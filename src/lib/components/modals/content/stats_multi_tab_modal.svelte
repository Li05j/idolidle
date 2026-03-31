<script lang="ts">
	import DetailedStats from "./detailed_stats.svelte";
	import Skills from "./skills.svelte";

    type Tabs = 'stats' | 'skills' | 'dreams'

    let active = $state<Tabs>('stats')

    const tabs: {id: Tabs, label: string}[] = [
        { id: 'stats', label: 'Stats' },
        { id: 'skills', label: 'Skills' },
        { id: 'dreams', label: 'Dreams' }
    ]
</script>

<div class="grid grid-cols-[1fr_9fr]">
    <!-- Tabs -->
    <div class="flex flex-col space-y-3 pt-3 pl-2 h-full">
        {#each tabs as t}
            <button
                class="px-4 py-2 rounded shadow-md transition-all duration-300 origin-right
                    {active === t.id 
                    ? 'bg-blue-500 font-bold text-white rounded hover:bg-blue-700 disabled:bg-gray-400' 
                    : 'bg-zinc-200 text-zinc-800 rounded hover:bg-zinc-400 disabled:bg-gray-400 translate-x-1'}"
                onclick={() => active = t.id}
            >
                {t.label}
            </button>
        {/each}
    </div>

    <!-- Content -->
    <div class="flex flex-col p-4">
        <div 
            class="absolute top-[0%] h-[100%] w-1 bg-gradient-to-b from-transparent via-zinc-700 to-transparent shadow-[0_0_6px_rgba(0,0,0,0.1)]"
        ></div>
        <div class="ml-8">
            {#if active === 'stats'}
                <DetailedStats />
            {:else if active === 'skills'}
                <Skills />
            {:else if active === 'dreams'}
                <h2 class="text-xl font-semibold mb-2">Not done yet.</h2>
            {/if}
        </div>
    </div>
</div>