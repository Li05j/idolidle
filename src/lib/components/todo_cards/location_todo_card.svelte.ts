import { stat_list, trainings } from '$lib/state/stats.svelte';
import { createTodoTimer } from '$lib/state/todo_timer.svelte';
import { TodoCardM } from '$lib/state/todo_card_manager.svelte';
import type { TodoBase } from '$lib/data/todo_type';

const BORDER_ACTIVE = 'outline outline-4 outline-[var(--card-border-active)]';
const BORDER_INACTIVE = 'outline outline-4 outline-[var(--card-border-inactive)]';

export class LocationTodoCardVM {
    private todo: TodoBase;
    readonly card_id: number;
    readonly timer = createTodoTimer();

    todo_actual_duration: number = $state(0);
    bg_color = $state('bg-[var(--card-location)]');
    border = $state(BORDER_INACTIVE);
    hovered = $state(false);
    disabled: boolean;

    constructor(todo: TodoBase) {
        this.todo = todo;
        this.card_id = TodoCardM.generateCardId();
        this.disabled = $derived.by(() => todo.check_disabled(stat_list));

        $effect(() => {
            this.todo_actual_duration = trainings.get_final_training_time(todo);
        });

        $effect(() => {
            this.border = this.timer.is_active ? BORDER_ACTIVE : BORDER_INACTIVE;
        });

        $effect(() => {
            this.bg_color = this.hovered ? 'bg-[var(--card-location-hover)]' : 'bg-[var(--card-location)]';
        });
    }

    toggle() {
        if (this.timer.is_paused) {
            this.start();
        } else {
            this.pause();
        }
    }

    private start() {
        if (this.disabled) return;
        TodoCardM.activateCard(this.card_id);
        this.timer.repeat(1, this.todo_actual_duration,
            () => { this.todo.spend_and_reward(); },
            () => {
                TodoCardM.deactivateCard(this.card_id);
                this.todo.then?.();
            },
        );
    }

    private pause() {
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
