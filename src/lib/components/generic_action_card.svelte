<script lang="ts">
    import type { Todo } from "$lib/types";

    import { onDestroy } from "svelte";
    import { trainings } from "$lib/stores/stats.svelte"
    import { msToSecF } from "$lib/utils/utils"
    import { createTodoTimer } from "$lib/stores/todo_timer.svelte";
    import GenericButton from "./generic_button.svelte";
	
    let { todo }: { todo: Todo } = $props();

    const MIN_TRAINING_TIME = 100; // ms
    const timer = createTodoTimer();

    let todo_actual_duration: number = $state(0.0)
    let bg_color = $state("")

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
                bg_color = "bg-pink-200"
                break
            case "action":
                bg_color = "bg-white"
                break
            case "moni_making":
                bg_color = "bg-purple-200"
                break
            case "none":
                bg_color = "bg-white"
                break
        }
    })

    function startTodo() {
        timer.start(todo_actual_duration, () => {
            todo.reward(todo.depends);
            todo.then?.();
        });
    }

    onDestroy(() => {
        timer.destroy();
    });
</script>

<div class="{bg_color} p-6 rounded-lg shadow-md mb-4 h-48">
    <div class="flex justify-between items-center mb-4">
        <div class="text-base font-medium">{todo.name}</div>
        <div class="text-gray-600 text-sm">{msToSecF(timer.elapsed)}/{msToSecF(todo_actual_duration)}s</div>
    </div>
  
    <div class="w-full bg-gray-200 rounded-full h-4 mb-4">
        <div class="h-4 bg-green-500 rounded transition-all duration-100" style="width: {timer.progress_percent}%"></div>
    </div>
  
    <div class="flex justify-between">
        <GenericButton name={"Start"} disabled={timer.is_active} onclick={startTodo}/>
    </div>
</div>