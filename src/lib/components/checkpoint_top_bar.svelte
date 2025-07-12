<script lang="ts">
    import { checkpoint, fans, moni, sing, dance, sta, charm, eloq } from "$lib/stores/store.svelte"
    import { msToSecF, DECIMAL_PLACES } from "$lib/utils/utils"

    let progress_percent = $derived(Math.min((checkpoint.current_time_spent / checkpoint.current_total_time) * 100, 100));
    let progress_text = $derived(`${progress_percent.toFixed(DECIMAL_PLACES)}% complete`);
</script>

<div class="bg-white p-6 rounded-lg shadow-md mb-4 top-0 left-0 w-full h-36">
    <div class="flex justify-between items-center mb-4">
        <div class="text-lg font-semibold">Time till next LIVE!</div>
        <div class="text-gray-600 text-sm">
            {msToSecF(checkpoint.current_time_spent)}/{msToSecF(checkpoint.current_total_time)}s
        </div>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-4 mb-4">
        <div class="h-4 bg-green-500 rounded transition-all duration-100" style="width: {progress_percent}%"></div>
    </div>
    <div class="text-center text-sm text-gray-600 mb-4">{progress_text}</div>
</div>