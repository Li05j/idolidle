<script lang="ts">
    import { onDestroy } from "svelte";
    import { checkpoint, trainings, fans, moni, sing, dance, sta, charm, eloq } from "$lib/stores/store.svelte"
    import { msToSecF } from "$lib/utils/utils"
    import { createActionTimer } from "$lib/stores/action_timer.svelte";

    let { action } = $props()

    const MIN_TRAINING_TIME = 100; // ms

    const timer = createActionTimer();

    let action_actual_duration: number = $state(0.0)

    $effect(() => {
        action_actual_duration = trainings.get_training_time(action.base_duration, sing.final);
        if (action_actual_duration <= MIN_TRAINING_TIME) { action_actual_duration = MIN_TRAINING_TIME }
    })

    function startAction() {
        timer.start(action_actual_duration, () => {
            action.reward();
        });
    }

    onDestroy(() => {
        timer.stop();
    });
</script>

<div class="bg-white p-6 rounded-lg shadow-md mb-4 h-48">
    <div class="flex justify-between items-center mb-4">
        <div class="text-lg font-semibold">{action.name}</div>
        <div class="text-gray-600 text-sm">Base: {msToSecF(action_actual_duration)}s</div>
    </div>
  
    <div class="w-full bg-gray-200 rounded-full h-4 mb-4">
        <div class="h-4 bg-green-500 rounded transition-all duration-100" style="width: {timer.progress}%"></div>
    </div>
  
    <div class="text-center text-sm text-gray-600 mb-4">{timer.progress_text}</div>
  
    <button 
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        disabled={timer.is_active}
        onclick={startAction}
    >
        {timer.is_active ? "In Progress..." : "Start"}
    </button>
</div>