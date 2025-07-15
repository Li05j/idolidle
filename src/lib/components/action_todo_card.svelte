<script lang="ts">
    import type { Todo } from "$lib/types";

    import { onMount, onDestroy } from "svelte";
    import { trainings } from "$lib/stores/stats.svelte"
    import { msToSecF, parseText, handle_rewards, reward_string } from "$lib/utils/utils"
    import { createTodoTimer } from "$lib/stores/todo_timer.svelte";
    import { TodoCardM } from "$lib/stores/todo_card_manager.svelte";
	import { logs } from "$lib/stores/history.svelte";
	
    let { todo, repeat_val }: { todo: Todo, repeat_val?: string } = $props();

    const card_id = TodoCardM.generateCardId()

    const MIN_TRAINING_TIME = 100; // ms
    const timer = createTodoTimer();

    let todo_actual_duration: number = $state(0.0)
    let bg_color = $state("")
    let border = $state("")
    let loop = $state(1)

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
        switch (todo.type) {
            case "action": bg_color = "bg-white"; break
            case "gain_currency": bg_color = "bg-purple-100"; break
        }
    })

    $effect(() => {
        if (timer.is_active) {
            border = "outline outline-4 outline-orange-400"
        }
        else {
            border = ""
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

    function startTodo() {
        updateLoop()
        TodoCardM.activateCard(card_id)
        timer.repeat(loop, todo_actual_duration, 
            () => {
                loop--;
                handle_rewards(todo.rewards);
                logs.addLogs(todo);
                todo.extra_reward?.()
            },
            () => {
                TodoCardM.deactivateCard(card_id)
                updateLoop()
                todo.then?.();
            }
        );
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

<div class="{bg_color} {border} p-6 rounded-lg shadow-md mb-4 h-48 relative overflow-hidden" onclick={timer.is_paused ? startTodo : pauseTodo}>
    <!-- Watermark -->
    <div class="absolute bottom-4 right-4 flex pointer-events-none">
        <span class="text-7xl font-bold text-teal-800 opacity-20 transform rotate-12 select-none">
            x{loop}
        </span>
    </div>
  
    <div class="relative z-10">
        <div class="flex justify-between items-center mb-4">
            <div class="text-base font-medium">{todo.name}</div>
            <div class="text-gray-600 text-sm">{msToSecF(timer.elapsed)}/{msToSecF(todo_actual_duration)}s</div>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div class="h-4 bg-green-500 rounded transition-all duration-100" style="width: {timer.progress_percent}%"></div>
        </div>
        <div class="text-gray-700 text-xs pt-2"> <i>{@html parseText(todo.desc)}</i></div>
        <div class="text-gray-700 text-sm pt-2 text-right"> {reward_string(todo.rewards)} </div>
    </div>
</div>