import { stat_list, trainings } from '$lib/state/stats.svelte';
import { createTodoTimer } from '$lib/state/todo_timer.svelte';
import { TodoCardM } from '$lib/state/todo_card_manager.svelte';
import type { TodoBase } from '$lib/data/todo_type';

const BG_COLORS = {
    action:         { normal: 'bg-[var(--card-action)]',         hover: 'bg-[var(--card-action-hover)]' },
    gain_currency:  { normal: 'bg-[var(--card-gain-currency)]',  hover: 'bg-[var(--card-gain-currency-hover)]' },
    spend_currency: { normal: 'bg-[var(--card-spend-currency)]', hover: 'bg-[var(--card-spend-currency-hover)]' },
} as const;

const BORDER_ACTIVE = 'outline outline-4 outline-[var(--card-border-active)]';
const BORDER_INACTIVE = 'outline outline-4 outline-[var(--card-border-inactive)]';

export class ActionTodoCardVM {
    private todo: TodoBase;
    readonly card_id: number;
    readonly timer = createTodoTimer();

    todo_actual_duration: number = $state(0);
    bg_color = $state('');
    border = $state(BORDER_INACTIVE);
    loop = $state(1);
    hovered = $state(false);
    disabled: boolean;

    constructor(todo: TodoBase) {
        this.todo = todo;
        this.disabled = $derived.by(() => todo.check_disabled(stat_list));
        this.card_id = TodoCardM.generateCardId();

        $effect(() => {
            if (todo.type === 'gain_currency' || todo.type === 'spend_currency') {
                this.todo_actual_duration = todo.base_time;
            } else {
                this.todo_actual_duration = trainings.get_final_training_time(todo);
            }
        });

        $effect(() => {
            const colors = BG_COLORS[todo.type as keyof typeof BG_COLORS];
            if (colors) {
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

    toggle(repeat_val: string) {
        if (this.timer.is_paused) {
            this.start(repeat_val);
        } else {
            this.pause(repeat_val);
        }
    }

    private start(repeat_val: string) {
        if (this.disabled) return;
        this.updateLoop(repeat_val);
        TodoCardM.activateCard(this.card_id);

        if (this.todo.one_off) {
            this.timer.repeat(1, this.todo_actual_duration,
                () => { this.todo.spend_and_reward(); },
                () => {
                    TodoCardM.deactivateCard(this.card_id);
                    this.todo.then?.();
                },
            );
        } else {
            this.timer.repeat(this.loop, this.todo_actual_duration,
                () => {
                    this.loop--;
                    this.todo.spend_and_reward();
                    if (this.disabled) this.timer.loop_count = 0;
                },
                () => {
                    TodoCardM.deactivateCard(this.card_id);
                    this.updateLoop(repeat_val);
                    this.todo.then?.();
                },
            );
        }
    }

    private pause(repeat_val: string) {
        this.updateLoop(repeat_val);
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
