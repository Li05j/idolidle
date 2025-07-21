<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { stat_list, trainings } from "$lib/stores/stats.svelte"
    import { msToSecF, parseText, tooltip_string } from "$lib/utils/utils"
    import { createTodoTimer } from "$lib/stores/todo_timer.svelte";
    import { TodoCardM } from "$lib/managers/todo_card_manager.svelte";
	import type { TodoBase } from "$lib/data/todo_type.svelte";
	
    let { todo, repeat_val }: { todo: TodoBase, repeat_val?: string } = $props();

    const card_id = TodoCardM.generateCardId()

    const MIN_TRAINING_TIME = 100; // ms
    const timer = createTodoTimer();

    let todo_actual_duration: number = $state(0.0)
    let bg_color = $state("")
    let border = $state("outline outline-4 outline-orange-300/10")
    let loop = $state(1)

    let disabled = $derived(todo.check_disabled(stat_list));
    let hovered = $state(false)

    $effect(() => {
        let b: number = NaN;
        if (todo.type === 'gain_currency') {
            b = todo.base_cost
        }
        else {
            b = trainings.get_final_training_time(todo);
        }
        if (b < MIN_TRAINING_TIME) b = MIN_TRAINING_TIME;
        todo_actual_duration = b;
    })

    $effect(() => {
        if (hovered) {
            switch (todo.type) {
                case "action": bg_color = "bg-stone-100"; break
                case "gain_currency": bg_color = "bg-purple-200"; break
                case "spend_currency": bg_color = "bg-yellow-200"; break
            }
        } else {
            switch (todo.type) {
                case "action": bg_color = "bg-white"; break
                case "gain_currency": bg_color = "bg-purple-100"; break
                case "spend_currency": bg_color = "bg-yellow-100"; break
            }
        }
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
        if (repeat_val) {
            updateLoop()
        }
    })

    function updateLoop() {
        switch (repeat_val) {
            case 'x1': loop = 1; break
            case 'x10': loop = 10; break
            case 'x100': loop = 100; break
        }
    }

    function startTodoNormal() {
        timer.repeat(loop, todo_actual_duration, 
            () => {
                loop--;
                todo.spend_and_reward()
                if (disabled) timer.loop_count = 0;
            },
            () => {
                TodoCardM.deactivateCard(card_id)
                updateLoop()
                todo.then?.();
            }
        );
    }

    function startTodoOneOff() {
        timer.repeat(1, todo_actual_duration, 
            () => {
                todo.spend_and_reward()
            },
            () => {
                TodoCardM.deactivateCard(card_id)
                todo.then?.();
            }
        );
    }

    function startTodo() {
        if (disabled) return;
        updateLoop()
        TodoCardM.activateCard(card_id)
        if (todo.one_off) {
            startTodoOneOff();
        } else {
            startTodoNormal();
        }
    }

    function pauseTodo() {
        updateLoop()
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
    <!-- Watermark -->
    <div class="absolute bottom-4 right-4 flex pointer-events-none">
        <span class="text-7xl font-bold text-teal-800 opacity-20 transform rotate-12 select-none">
            {#if todo.one_off}
                ONCE
            {:else}
                x{loop}
            {/if}
        </span>
    </div>

    <!-- Watermark Line -->
    {#if (disabled && !timer.is_active)}
        <div class="absolute inset-0 pointer-events-none z-50">
            <div class="w-full h-full">
                <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <line x1="0" y1="0" x2="100%" y2="100%" stroke="red" stroke-opacity="0.2" stroke-width="4" />
                </svg>
            </div>
        </div>
    {/if}
  
    <div class="relative h-full">
        <div class="flex justify-between items-center mb-4">
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

    <div class="absolute bottom-4 right-4 text-gray-700 text-xs pt-2 text-right"> {todo.get_spendings_rewards_string()} </div>
</div>