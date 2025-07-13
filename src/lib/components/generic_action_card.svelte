<script lang="ts">
    import { onDestroy } from "svelte";
    import { trainings } from "$lib/stores/stats.svelte"
    import { msToSecF } from "$lib/utils/utils"
    import { createTodoTimer } from "$lib/stores/todo_timer.svelte";
    import GenericButton from "./generic_button.svelte";

    let { todo } = $props()

    const MIN_TRAINING_TIME = 100; // ms
    const timer = createTodoTimer();

    let todo_actual_duration: number = $state(0.0)
    let bg_color = $state("")

    $effect(() => {
        todo_actual_duration = trainings.get_final_training_time(todo);
        if (todo_actual_duration <= MIN_TRAINING_TIME) { todo_actual_duration = MIN_TRAINING_TIME }
    })

    $effect(() => {
        switch (todo.type) {
            case "location":
                bg_color = "bg-pink-200"
                break
            case "action":
                bg_color = "bg-white"
                break
            case "none":
                bg_color = "bg-white"
                break
        }
    })

    function startTodo() {
        timer.start(todo_actual_duration, () => {
            todo.reward();
            todo.then?.();
        });
    }

    onDestroy(() => {
        timer.destroy();
    });
</script>

<div class="{bg_color} p-6 rounded-lg shadow-md mb-4 h-48">
    <div class="flex justify-between items-center mb-4">
        <div class="text-lg font-semibold">{todo.name}</div>
        <div class="text-gray-600 text-sm">Base: {msToSecF(todo_actual_duration)}s</div>
    </div>
  
    <div class="w-full bg-gray-200 rounded-full h-4 mb-4">
        <div class="h-4 bg-green-500 rounded transition-all duration-100" style="width: {timer.progress_percent}%"></div>
    </div>
  
    <div class="text-center text-sm text-gray-600 mb-4">{timer.progress_text}</div>
  
    <GenericButton name={timer.is_active ? "In Progress..." : "Start"} disabled={timer.is_active} onclick={startTodo}/>
</div>