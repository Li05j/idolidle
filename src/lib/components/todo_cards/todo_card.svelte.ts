import { stat_list } from '$lib/state/stats.svelte';
import { createTodoTimer } from './todo_timer.svelte';
import { TodoCardM } from '$lib/runtime/todo_card_manager.svelte';
import { Progression } from '$lib/runtime/progression_engine.svelte';
import { locationMap } from '$lib/data/locations/index';
import { history } from '$lib/state/history.svelte';
import type { ActionDef, LocationDef } from '$lib/data/locations/location_definition';
import { executeAction, actionRewardText, handle_rewards, reward_string } from '$lib/utils/utils';
import { LOCATION_DROPS } from '$lib/data/equipment/location_drops';
import { CFG } from '$lib/config';
import { Mastery } from '$lib/state/mastery.svelte';


const ACTION_BG = {
    training: { normal: 'bg-[var(--card-action)]',         hover: 'bg-[var(--card-action-hover)]' },
    earning:  { normal: 'bg-[var(--card-gain-currency)]',  hover: 'bg-[var(--card-gain-currency-hover)]' },
    spending: { normal: 'bg-[var(--card-spend-currency)]', hover: 'bg-[var(--card-spend-currency-hover)]' },
} as const;

const LOCATION_BG = { normal: 'bg-[var(--card-location)]', hover: 'bg-[var(--card-location-hover)]' };

const BORDER_ACTIVE = 'outline outline-3 outline-[var(--card-border-active)] shadow-[var(--glow-active)]';
const BORDER_INACTIVE = 'outline outline-2 outline-[var(--card-border-inactive)]';

function getLocationDuration(base_time: number): number {
    return Math.max(base_time * CFG.time_scale, CFG.min_action_time);
}

function getActionDuration(base_time: number, mastery_id: string): number {
    return Math.max(base_time * Mastery.factor(mastery_id) * CFG.time_scale, CFG.min_action_time);
}

export class TodoCardVM {
    readonly card_id: number;
    readonly timer = createTodoTimer();
    readonly is_location: boolean;

    private locationName: string;
    private actionName: string | undefined;

    todo_actual_duration: number = $state(0);
    bg_color = $state('');
    border = $state(BORDER_INACTIVE);
    loop = $state(1);
    hovered = $state(false);
    disabled: boolean;

    get def(): ActionDef | LocationDef {
        if (this.is_location) {
            return locationMap.get(this.locationName)!;
        }
        return Progression.resolveAction(this.locationName, this.actionName!)!;
    }

    get actionDef(): ActionDef | undefined {
        return this.is_location ? undefined : this.def as ActionDef;
    }

    get locationDef(): LocationDef | undefined {
        return this.is_location ? this.def as LocationDef : undefined;
    }

    get name(): string { return this.def.name; }
    get desc(): string { return this.def.desc; }

    get rewardText(): string {
        const d = this.def;
        if ('kind' in d) return actionRewardText(d);
        return reward_string(d.rewards);
    }

    get has_uses(): boolean {
        return this.actionDef?.uses !== undefined;
    }

    get mastery_id(): string {
        if (this.is_location) return this.locationName;
        const def = this.actionDef;
        return def?.mastery_id ?? def?.name ?? this.actionName!;
    }

    constructor(locationName: string, actionName?: string) {
        this.locationName = locationName;
        this.actionName = actionName;
        this.is_location = actionName === undefined;
        this.card_id = TodoCardM.generateCardId();

        const checkDisabled = () => {
            const d = this.def;
            return d.requires?.check() ?? false;
        };
        this.disabled = $derived.by(() => checkDisabled());

        $effect(() => {
            if (this.is_location) {
                this.todo_actual_duration = getLocationDuration(this.def.base_time);
            } else {
                this.todo_actual_duration = getActionDuration(this.def.base_time, this.mastery_id);
            }
        });

        $effect(() => {
            if (this.is_location) {
                this.bg_color = this.hovered ? LOCATION_BG.hover : LOCATION_BG.normal;
            } else {
                const colors = ACTION_BG[(this.def as ActionDef).kind];
                this.bg_color = this.hovered ? colors.hover : colors.normal;
            }
        });

        $effect(() => {
            this.border = this.timer.is_active ? BORDER_ACTIVE : BORDER_INACTIVE;
        });
    }

    updateLoop(repeat_val: string) {
        switch (repeat_val) {
            case 'x1':   this.loop = 1; break;
            case 'x5':   this.loop = 5; break;
            case 'x20':  this.loop = 20; break;
            case 'x100': this.loop = 100; break;
        }
    }

    toggle(repeat_val?: string) {
        if (this.timer.is_paused) {
            this.start(repeat_val);
        } else {
            this.pause(repeat_val);
        }
    }

    private start(repeat_val?: string) {
        if (this.disabled) return;

        if (this.is_location) {
            this.startLocation();
        } else {
            this.startAction(repeat_val!);
        }
    }

    private startLocation() {
        TodoCardM.activateCard(this.card_id);
        const locDef = this.locationDef!;
        const dur = this.todo_actual_duration;
        this.timer.repeat(1, () => dur,
            () => {
                handle_rewards(locDef.rewards);
                history.addLogs(locDef.name, reward_string(locDef.rewards));
            },
            () => {
                TodoCardM.deactivateCard(this.card_id);
                Progression.onLocationArrived(this.locationName);
            },
        );
    }

    private startAction(repeat_val: string) {
        this.updateLoop(repeat_val);
        TodoCardM.activateCard(this.card_id);
        const actDef = this.actionDef!;

        const mid = this.mastery_id;
        const getDur = () => getActionDuration(actDef.base_time, mid);

        if (actDef.uses !== undefined) {
            this.timer.repeat(1, getDur,
                () => {
                    executeAction(actDef, history.addLogs, LOCATION_DROPS[this.locationName]);
                    Mastery.increment(mid);
                },
                () => {
                    TodoCardM.deactivateCard(this.card_id);
                    Progression.onUsesExhausted(this.locationName, actDef.name);
                },
            );
        } else {
            this.timer.repeat(this.loop, getDur,
                () => {
                    this.loop--;
                    executeAction(actDef, history.addLogs, LOCATION_DROPS[this.locationName]);
                    Mastery.increment(mid);
                    if (this.disabled) this.timer.loop_count = 0;
                },
                () => {
                    TodoCardM.deactivateCard(this.card_id);
                    this.updateLoop(repeat_val);
                },
            );
        }
    }

    private pause(repeat_val?: string) {
        if (repeat_val) this.updateLoop(repeat_val);
        TodoCardM.deactivateCard(this.card_id);
        this.timer.pause();
    }

    init() {
        TodoCardM.registerCard(this.card_id, () => {
            TodoCardM.deactivateCard(this.card_id);
            this.timer.pause();
        });
    }

    destroy() {
        TodoCardM.unregisterCard(this.card_id);
        this.timer.clear();
    }
}
