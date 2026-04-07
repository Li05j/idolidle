<script lang="ts">
	import { LiveInfo } from "$lib/runtime/live_rival_info.svelte";
</script>

<div class="w-full p-4">
    <div class="rounded shadow-[inset_0_0px_6px_rgba(0,0,0,0.1)] p-4">
        <h3 class="text-xl font-bold mb-4 justify-center text-center">Your Rival</h3>
        <div class="grid grid-cols-2 text-center max-w-[24rem] mx-auto">
            {#each LiveInfo.comparisons as comp}
                <div class='text-lg'>{comp.label}:</div>
                <div class="flex justify-center items-center h-full">
                    <div class="w-8 h-6 rounded" style={comp.color}></div>
                </div>
            {/each}
        </div>
    </div>
    <div class="flex items-center p-1">
        <div class="mx-1 w-6 h-4 rounded" style="background-color: hsl(120, 100%, 50%)"></div>
        <p class='text-sm'>- you have enough of this stat.</p>
    </div>
    <div class="flex items-center p-1">
        <div class="mx-1 w-6 h-4 rounded" style="background-color: hsl(0, 100%, 50%)"></div>
        <p class='text-sm'>- you need more training on this stat.</p>
    </div>
    <div class="flex p-8 justify-center items-center">
        <h1 class="text-xl font-bold">{LiveInfo.condition_text}</h1>
    </div>
</div>
