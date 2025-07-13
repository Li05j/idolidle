<script lang="ts">
    import { fans, moni, sta, charm, presence, eloq, poise } from "$lib/stores/stats.svelte";
    import GenericButton from "./generic_button.svelte";

    function openStatsModal() {
        console.log("Stats Modal opened - except it isn't implemented yet owo")
        return
    }
</script>

<h3 class="text-lg font-bold mb-4 justify-center text-center">Your Stats</h3>
<hr class="h-1 bg-black border-0 opacity-15 mb-4" />

<div class="overflow-y-auto p-4 h-full">
    <div class="grid grid-cols-2 gap-x-4 pt-6 px-4 py-4 text-center justify-center rounded shadow-[inset_0_0px_6px_rgba(0,0,0,0.1)]">
        <div>Fans:</div>        <div>{fans.final_str}</div>
        <div>Moni:</div>        <div>{moni.final_str}</div>
        <div>Stamina:</div>     <div>{sta.final_str}</div>
        <div>Charm:</div>       <div>{charm.final_str}</div>
        <div>Presence:</div>    <div>{presence.final_str}</div>
        <div>Eloquence:</div>   <div>{eloq.final_str}</div>
        <div>Poise:</div>       <div>{poise.final_str}</div>

        <div class="col-span-2 justify-center py-4">
            <GenericButton name={"Detailed Stats..."} onclick={openStatsModal} class={"w-full"}/> 
        </div>
    </div>
</div>