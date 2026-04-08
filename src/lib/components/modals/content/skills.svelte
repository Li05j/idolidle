<script lang="ts">
    import { SkillM } from "$lib/state/skills.svelte";
    import type { Skill } from "$lib/types";

    let active: Skill | null = $state(null)
</script>

<div class="h-[35vh] rounded-xl bg-[var(--surface-inset)] overflow-auto">
    <div class="grid grid-cols-4 px-4 py-4 text-center gap-2">
        {#each SkillM.learned_skills as skill}
            <button 
                class="px-3 py-2 rounded-full shadow-sm text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.03]
                {active?.name === skill[0]
                ? 'outline outline-3 outline-[var(--card-border-active)] shadow-[var(--glow-active)]'
                : ''}" 
                style="background: var(--btn-cute);"
                onclick={() => active = skill[1]}
            >
                {skill[0]}
            </button>
        {/each}
        {#each SkillM.unlearned_skills as skill}
            <button 
                class="px-3 py-2 rounded-full shadow-sm text-sm font-semibold text-[var(--text-muted)] bg-[var(--surface-base)] transition-all duration-200 hover:bg-[var(--progress-bg)] hover:scale-[1.03]
                {active?.name === skill[0]
                ? 'outline outline-3 outline-[var(--card-border-active)] shadow-[var(--glow-active)]'
                : ''}" 
                onclick={() => active = skill[1]}
            >
                {skill[0]}
            </button>
        {/each}
    </div>
</div>
                        
<div class="h-[35vh] rounded-xl bg-[var(--surface-inset)] mt-3 overflow-auto p-4">
    {#if active === null}
        <div class='font-semibold text-base text-[var(--text-muted)]'>Click on a Skill above to view its details.</div>
    {:else if SkillM.unlearned_skills.has(active.name)}
        <div class='font-semibold text-base text-[var(--text-primary)]'>{active.unlock_string}</div>
    {/if}
</div>