<!-- <script lang="ts">
    import { fans, moni, sing, dance, sta, charm, eloq } from "$lib/stores/store.svelte"

    let { action, time_left = $bindable<number>() } = $props()

    let progress = $state(0);
    let is_active = $state(false);
    let progress_text = $state("Ready to start");

    let action_actual_duration: number = $state(0.0)

    $effect(() => {
        let time = action.base_duration / sing.final
        if (time <= 0.1) { time = 0.1 }
        action_actual_duration = toFixedNumber(time, 2)
    })

    function startAction() {
        if (is_active) return;
        
        const duration = action.base_duration / sing.final;

        is_active = true;
        
        const startTime = Date.now();
        const totalTime = duration * 1000;

        let lastTime = Date.now();
        const interval = setInterval(() => {
            const now = Date.now();

            const elapsed = now - startTime;
            const delta: number = now - lastTime;
            lastTime = now;

            time_left = toFixedNumber(time_left - (delta / 1000), 2);
            
            progress = Math.min((elapsed / totalTime) * 100, 100);
            progress_text = `${Math.round(progress)}% complete`;
        
            if (progress >= 100) {
                clearInterval(interval);
                action.reward();
                progress = 0;
                progress_text = "Ready to start";
                is_active = false;
            }
        }, 100);
    }
</script>

<div class="bg-white p-6 rounded-lg shadow-md mb-4">
    <div class="flex justify-between items-center mb-4">
        <div class="text-lg font-semibold">{action.name}</div>
        <div class="text-gray-600 text-sm">Base: {action_actual_duration}s</div>
    </div>
  
    <div class="w-full bg-gray-200 rounded-full h-4 mb-4">
        <div class="h-4 bg-green-500 rounded transition-all duration-100" style="width: {progress}%"></div>
    </div>
  
    <div class="text-center text-sm text-gray-600 mb-4">{progress_text}</div>
  
    <button 
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        disabled={is_active}
        onclick={startAction}
    >
        {is_active ? "In Progress..." : "Start"}
    </button>
</div> -->