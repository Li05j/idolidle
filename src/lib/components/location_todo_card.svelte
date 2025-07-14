<script lang="ts">
    import type { Todo } from "$lib/types";

    import { onMount, onDestroy } from "svelte";
    import { trainings } from "$lib/stores/stats.svelte"
    import { msToSecF, parseText, handle_rewards, reward_string } from "$lib/utils/utils"
    import { createTodoTimer } from "$lib/stores/todo_timer.svelte";
    import { TodoCardM } from "$lib/stores/todo_card_manager.svelte";
	
    let { todo }: { todo: Todo } = $props();

    const card_id = TodoCardM.generateCardId()

    const MIN_TRAINING_TIME = 100; // ms
    const timer = createTodoTimer();

    let todo_actual_duration: number = $state(0.0)
    let bg_color = "bg-pink-100"
    let border = $state("")
    const LOOP = 1

    $effect(() => {
        let b: number = trainings.get_final_training_time(todo);
        if (b < MIN_TRAINING_TIME) b = MIN_TRAINING_TIME;
        todo_actual_duration = b;
    })

    $effect(() => {
        if (timer.is_active) {
            border = "outline outline-4 outline-orange-400"
        }
        else {
            border = ""
        }
    })

    function startTodo() {
        TodoCardM.activateCard(card_id)
        timer.repeat(LOOP, todo_actual_duration, 
            () => {
                handle_rewards(todo.rewards)
            },
            () => {
                TodoCardM.deactivateCard(card_id)
                todo.then?.();
            }
        );
    }

    function pauseTodo() {
        TodoCardM.deactivateCard(card_id)
        timer.pause()
    }

    onMount(() => {
        TodoCardM.registerCard(card_id, pauseTodo);
    })

    onDestroy(() => {
        TodoCardM.unregisterCard(card_id);
        timer.clear();
    });
</script>

<div class="{bg_color} {border} pl-6 pr-6 pt-4 rounded-lg shadow-md h-48 relative overflow-hidden mb-4" onclick={timer.is_paused ? startTodo : pauseTodo}>
    <div class="relative z-10">
        <div class="flex justify-between items-center mb-3">
            <div class="text-base font-medium">{todo.name}</div>
            <div class="text-gray-600 text-sm">{msToSecF(timer.elapsed)}/{msToSecF(todo_actual_duration)}s</div>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div class="h-4 bg-green-500 rounded transition-all duration-100" style="width: {timer.progress_percent}%"></div>
        </div>
        <div class="text-gray-700 text-xs"> <i>{@html parseText(todo.desc)}</i></div>
        <div class="text-gray-700 text-sm pt-2 text-right"> {reward_string(todo.rewards)} </div>
    </div>
</div>