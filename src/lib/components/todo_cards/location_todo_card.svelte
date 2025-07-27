<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { stat_list, trainings } from "$lib/stores/stats.svelte"
    import { msToSecF, parseText, tooltip_string } from "$lib/utils/utils"
    import { createTodoTimer } from "$lib/stores/todo_timer.svelte";
    import { TodoCardM } from "$lib/managers/todo_card_manager.svelte";
	import type { TodoBase } from "$lib/data/todo_type";
	
    let { todo }: { todo: TodoBase } = $props();

    const card_id = TodoCardM.generateCardId()
    const timer = createTodoTimer();

    let todo_actual_duration: number = $state(0.0)
    let bg_color = $state("bg-pink-100")
    let border = $state("outline outline-4 outline-orange-300/10")
    const LOOP = 1

    let disabled = $derived(todo.check_disabled(stat_list));
    let hovered = $state(false)

    $effect(() => {
        todo_actual_duration = trainings.get_final_training_time(todo);
    })

    $effect(() => {
        if (timer.is_active) {
            border = "outline outline-4 outline-orange-400"
        }
        else {
            border = "outline outline-4 outline-orange-300/10"
        }
    })

    $effect(() => {
        if (hovered) bg_color = "bg-pink-200"
        else bg_color = "bg-pink-100"
    })

    function startTodo() {
        if (disabled) return;
        TodoCardM.activateCard(card_id)
        timer.repeat(LOOP, todo_actual_duration, 
            () => {
                todo.spend_and_reward()
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

<div 
    class="{bg_color} {border} transition-all duration-300 pl-6 pr-6 pt-4 rounded-lg shadow-md h-48 relative overflow-hidden mb-4 {(disabled && !timer.is_active) ? 'cursor-not-allowed' : 'cursor-pointer'}" 
    onclick={timer.is_paused ? startTodo : pauseTodo}
    onmouseenter={() => hovered = true}
    onmouseleave={() => hovered = false}
>
    <!-- Watermark Line -->
    {#if (disabled && !timer.is_active)}
        <div class="absolute inset-0 pointer-events-none z-10">
            <div class="w-full h-full">
                <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <line x1="0" y1="0" x2="100%" y2="100%" stroke="red" stroke-opacity="0.2" stroke-width="4" />
                </svg>
            </div>
        </div>
    {/if}

    <div class="relative h-full">
        <div class="flex justify-between items-center mb-3">
            <div class="text-base font-medium">{todo.name}</div>
            <div class="text-gray-600 text-sm">{msToSecF(timer.elapsed)}/{msToSecF(todo_actual_duration)}s</div>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div class="h-4 bg-green-500 rounded transition-all duration-100" style="width: {timer.progress_percent}%"></div>
        </div>

        <!-- Hover -->
        <div class="relative text-xs h-full">
            <div class="transition-opacity duration-300 text-gray-700" style="opacity: {hovered ? 0 : 1};">
                <i>{@html parseText(todo.desc)}</i>
            </div>
            <div class="absolute top-0 left-0 rounded transition-opacity duration-300 h-2/5 w-full" style="opacity: {hovered ? 1 : 0};">
                <p>{@html parseText(tooltip_string(todo.tooltip, disabled))}</p>
            </div>
        </div>
    </div>
    <div class="absolute bottom-4 right-4 text-xs pt-2 text-right"> {todo.get_spendings_rewards_string()} </div>
</div>
