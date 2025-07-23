<script lang="ts">
	import { LiveInfo } from "$lib/stores/live_rival_info.svelte";

    $effect(() => {
        let overall_ratio = (
            LiveInfo.fan_clamped +
            LiveInfo.sta_clamped +
            LiveInfo.sing_clamped +
            LiveInfo.dance_clamped +
            LiveInfo.charm_clamped +
            LiveInfo.pres_clamped
        ) / 6

        if (overall_ratio >= 0.9) {
            LiveInfo.condition_text = "Looks like Rival doesn't stand a chance!"
        } else if (overall_ratio >= 0.7) {
            LiveInfo.condition_text = "You've got a solid shot at winning!"
        } else if (overall_ratio >= 0.4) {
            LiveInfo.condition_text = "It's dicey - anyone could win!"
        } else if (overall_ratio >= 0.25) {
            LiveInfo.condition_text = "Come on, you know you need just a little more training!"
        } else {
            LiveInfo.condition_text = "You're no match for Rival... are you even serious about being an Idol?"
        }
    })

</script>

<div class="w-full p-4">
    <div class="rounded shadow-[inset_0_0px_6px_rgba(0,0,0,0.1)] p-4">
        <h3 class="text-xl font-bold mb-4 justify-center text-center">Your Rival</h3>
        <div class="grid grid-cols-2 text-center max-w-[24rem] mx-auto">
            <div class='text-lg'>Fans:</div> 
            <div class="flex justify-center items-center h-full">
                <div class="w-8 h-6 rounded" style={LiveInfo.fan_color}></div>
            </div>

            <div class='text-lg'>Stamina:</div> 
            <div class="flex justify-center items-center h-full">
                <div class="w-8 h-6 rounded" style={LiveInfo.sta_color}></div>
            </div>

            <div class='text-lg'>Sing:</div> 
            <div class="flex justify-center items-center h-full">
                <div class="w-8 h-6 rounded" style={LiveInfo.sing_color}></div>
            </div>

            <div class='text-lg'>Dance:</div> 
            <div class="flex justify-center items-center h-full">
                <div class="w-8 h-6 rounded" style={LiveInfo.dance_color}></div>
            </div>

            <div class='text-lg'>Charm:</div> 
            <div class="flex justify-center items-center h-full">
                <div class="w-8 h-6 rounded" style={LiveInfo.charm_color}></div>
            </div>

            <div class='text-lg'>Presence:</div> 
            <div class="flex justify-center items-center h-full">
                <div class="w-8 h-6 rounded" style={LiveInfo.pres_color}></div>
            </div>
        </div>
    </div>
    <div class="flex items-center p-1">
        <p class='text-sm'>Hint:</p>
        <div class="mx-1 w-6 h-4 rounded" style="background-color: hsl(120, 100%, 50%)"></div>
        <p class='text-sm'>is good;</p>
        <div class="mx-1 w-6 h-4 rounded" style="background-color: hsl(0, 100%, 50%)"></div>
        <p class='text-sm'>is bad.</p>
    </div>
        <div class="flex p-8 justify-center items-center">
            <h1 class="text-xl font-bold">{LiveInfo.condition_text}</h1>
        </div>
    <!-- <hr class="h-1 bg-black border-0 opacity-15 mb-4" /> -->
</div>