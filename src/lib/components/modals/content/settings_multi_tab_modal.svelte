<script lang="ts">
    import { DEV } from "$lib/config";
    import Debug from "./debug.svelte";

    type Tabs = 'debug';

    const tabs: {id: Tabs, label: string}[] = [
        ...(DEV ? [{ id: 'debug' as const, label: 'Debug' }] : []),
    ];

    let active = $state<Tabs | null>(tabs[0]?.id ?? null);
</script>

<div class="grid grid-cols-[1fr_9fr] h-full">
    <div class="flex flex-col gap-2 pt-4 pl-2 pr-2 h-full">
        {#each tabs as t}
            <button
                class="px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 origin-right
                    {active === t.id 
                    ? 'text-white shadow-md' 
                    : 'bg-[var(--surface-inset)] text-[var(--text-muted)] hover:bg-[var(--progress-bg)] translate-x-0.5'}"
                style={active === t.id ? 'background: var(--btn-primary);' : ''}
                onclick={() => active = t.id}
            >
                {t.label}
            </button>
        {/each}
    </div>

    <div class="flex flex-col p-4 relative">
        <div 
            class="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-transparent via-[var(--progress-from)] to-transparent opacity-40"
        ></div>
        <div class="ml-6">
            {#if active === 'debug'}
                <Debug />
            {/if}
        </div>
    </div>
</div>
