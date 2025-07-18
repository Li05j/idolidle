<script lang="ts">
    import { fans, moni, sta, sing, dance, charm, pres } from "$lib/stores/stats.svelte";
</script>

<h3 class="text-lg font-bold mb-4 justify-center text-center">Your Stats</h3>
<hr class="h-1 bg-black border-0 opacity-15 mb-4" />

<div class="p-4">
    <div class="grid grid-cols-2 gap-x-4 pt-6 px-4 py-4 text-center justify-center rounded shadow-[inset_0_0px_6px_rgba(0,0,0,0.1)]">
        <div>Fans:</div>        <div>{fans.final_str}</div>
        <div>Moni:</div>        <div>{moni.final_str}</div>
        <div>Stamina:</div>     <div>{sta.final_str}</div>
        <div>Sing:</div>        <div>{sing.final_str}</div>
        <div>Dance:</div>       <div>{dance.final_str}</div>
        <div>Charm:</div>       <div>{charm.final_str}</div>
        <div>Presence:</div>    <div>{pres.final_str}</div>
    </div>
</div>