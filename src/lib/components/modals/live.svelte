<script lang="ts">
    import { fans, moni, sta, charm, pres, eloq, poise } from "$lib/stores/stats.svelte";

    let stats = [fans, moni, sta, charm, pres, eloq, poise]

    let left: number = $state(30);
    let right: number = $state(70);
    
    let total = $derived(left + right);
    let leftPercent = $derived(left / total * 100);
    let rightPercent = $derived(right / total * 100);
</script>

<div class="w-full flex justify-center">
    <div class="relative w-1/2 h-6 bg-gray-200 rounded my-8">
        <!-- Left -->
        <div 
            class="absolute top-0 left-0 h-full bg-green-500 transition-all duration-300 rounded"
            style="width: {leftPercent}%"
        ></div>
        
        <!-- Right part -->
        <div 
            class="absolute top-0 right-0 h-full bg-red-500 transition-all duration-300 rounded"
            style="width: {rightPercent}%"
        ></div>
        
        <!-- Divider line -->
        <div 
          class="absolute top-[-75%] h-[250%] w-1 bg-gradient-to-b from-transparent via-gray-800 to-transparent shadow-[0_0_6px_rgba(0,0,0,0.3)] transition-all duration-300"
          style="left: {leftPercent-0.3}%"
        ></div>
    </div>
</div>

<div class="mt-4 space-x-4">
    <button 
        class="px-4 py-2 bg-blue-500 text-white rounded"
        onclick={() => left = Math.max(0, left - 10)}
    >
        Left -10
    </button>
    <button 
        class="px-4 py-2 bg-blue-500 text-white rounded"
        onclick={() => left += 10}
    >
        Left +10
    </button>
    <button 
        class="px-4 py-2 bg-red-500 text-white rounded"
        onclick={() => right = Math.max(0, right - 10)}
    >
        Right -10
    </button>
    <button 
        class="px-4 py-2 bg-red-500 text-white rounded"
        onclick={() => right += 10}
    >
        Right +10
    </button>
</div>

<div class="mt-2 text-sm text-gray-600">
    Left: {left}, Right: {right}
</div>