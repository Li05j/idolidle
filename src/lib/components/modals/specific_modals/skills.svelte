<script lang="ts">
	import { Rebirth } from "$lib/stores/game_state/rebirth.svelte";
    import { stat_list } from "$lib/stores/game_state/stats.svelte";

    let skills = [
        { name: "skill1", learned: true, condition: "Do this 1", desc: "Effect..."},
        { name: "skill2", learned: true, condition: "Do this 2", desc: "Effect..."},
        { name: "skill3", learned: false, condition: "Do this 3", desc: "Effect..."},
        { name: "skill4", learned: false, condition: "Do this 4", desc: "Effect..."},
        { name: "skill5", learned: true, condition: "Do this 5", desc: "Effect..."},
        { name: "skill6", learned: false, condition: "Do this 6", desc: "Effect..."},
    ]

    let skills_sorted = [...skills];
    skills_sorted.sort((a, b) => Number(b.learned) - Number(a.learned));

    let active: {name: String, learned: boolean, condition: String, desc: String} | null = $state(null)
</script>

<div class="h-[35vh] rounded shadow-[inset_0_0px_6px_rgba(0,0,0,0.1)] overflow-auto">
    <div class="grid grid-cols-4 px-4 py-4 text-center justify-center gap-y-2">
        <div class='col-span-4 grid grid-cols-4 text-center justify-center'>
            {#each skills_sorted as skill}
                <button 
                    class="px-4 py-2 rounded shadow-md m-2
                    {active?.name === skill.name
                    ? 'outline outline-4 outline-orange-300 '
                    : ' '}
                    {skill.learned === true
                    ? 'bg-pink-500 font-bold text-white rounded hover:bg-pink-700 disabled:bg-gray-400'
                    : 'bg-zinc-200 text-zinc-800 rounded hover:bg-zinc-400 disabled:bg-gray-400'}" 
                    onclick={() => active = skill}
                >
                    {skill.name}
                </button>
            {/each}
        </div>
    </div>
</div>
                        
<div class="h-[35vh] rounded shadow-[inset_0_0px_6px_rgba(0,0,0,0.1)] mt-2 overflow-auto p-4">
    {#if active === null}
        <div class='font-semibold text-lg'>Click on a Skill above to view its details.</div>
    {/if}
</div>