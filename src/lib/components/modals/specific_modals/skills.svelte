<script lang="ts">
	import { Rebirth } from "$lib/stores/game_state/rebirth.svelte";
	import { skill_container } from "$lib/stores/game_state/skills.svelte";
    import { stat_list } from "$lib/stores/game_state/stats.svelte";
	import type { Skill } from "$lib/types";

    // let skills_sorted = [...skill_container.learned_skills, 
    //                     ...skill_container.unlearned_skills]
    // skills_sorted.sort((a, b) => Number(b.learned) - Number(a.learned));

    let active: Skill | null = $state(null)
</script>

<div class="h-[35vh] rounded shadow-[inset_0_0px_6px_rgba(0,0,0,0.1)] overflow-auto">
    <div class="grid grid-cols-4 px-4 py-4 text-center justify-center gap-y-2">
        <div class='col-span-4 grid grid-cols-4 text-center justify-center'>
            {#each skill_container.learned_skills as skill}
                <button 
                    class="px-4 py-2 rounded shadow-md m-2 bg-pink-500 font-bold text-white rounded hover:bg-pink-700 disabled:bg-gray-400
                    {active?.name === skill[0]
                    ? 'outline outline-4 outline-orange-300 '
                    : ' '}" 
                    onclick={() => active = skill[1]}
                >
                    {skill[0]}
                </button>
            {/each}
            {#each skill_container.unlearned_skills as skill}
                <button 
                    class="px-4 py-2 rounded shadow-md m-2 bg-zinc-200 text-zinc-800 rounded hover:bg-zinc-400 disabled:bg-gray-400
                    {active?.name === skill[0]
                    ? 'outline outline-4 outline-orange-300 '
                    : ' '}" 
                    onclick={() => active = skill[1]}
                >
                    {skill[0]}
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