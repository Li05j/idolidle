<script lang="ts">
    import type { Todo } from "$lib/types";

    import { onMount, onDestroy } from "svelte";
    import { trainings } from "$lib/stores/stats.svelte"
    import { msToSecF } from "$lib/utils/utils"
    import { createTodoTimer } from "$lib/stores/todo_timer.svelte";
    import { TodoCardM } from "$lib/stores/central_todo_card_manager.svelte";
	
    let { todo, repeat_val }: { todo: Todo, repeat_val?: string } = $props();

    const card_id = TodoCardM.generateCardId()

    const MIN_TRAINING_TIME = 100; // ms
    const timer = createTodoTimer();

    let todo_actual_duration: number = $state(0.0)
    let bg_color = $state("")
    let border = $state("")

    $effect(() => {
        let b: number = NaN;
        if (todo.type === 'moni_making') {
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
            case "location":
                bg_color = "bg-pink-100"
                break
            case "action":
                bg_color = "bg-white"
                break
            case "moni_making":
                bg_color = "bg-purple-100"
                break
            case "none":
                bg_color = "bg-white"
                break
        }
    })

    $effect(() => {
        if (timer.is_active) {
            border = "border-4 border-orange-400"
        }
        else {
            border = ""
        }
    })

    function startTodo() {
        TodoCardM.activateCard(card_id)
        timer.start(todo_actual_duration, () => {
            todo.reward(todo.depends);
            todo.then?.();
        });
    }

    function pauseTodo() {
        timer.pause()
    }

    onMount(() => {
        TodoCardM.registerCard(card_id, pauseTodo);
        console.log(todo.name + card_id)
    })

    onDestroy(() => {
        timer.destroy();
        TodoCardM.unregisterCard(card_id);
    });
</script>

<div class="{bg_color} {border} p-6 rounded-lg shadow-md mb-4 h-48 relative overflow-hidden" onclick={timer.is_paused ? startTodo : pauseTodo}>
    <!-- Watermark -->
    <div class="absolute bottom-4 right-4 flex pointer-events-none">
        <span class="text-6xl font-bold text-gray-300 opacity-75 transform rotate-12 select-none">
            {repeat_val}
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
    </div>
</div>