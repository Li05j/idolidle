<script lang="ts">
    import type { Todo } from '$lib/types'
    import ActionCard from '$lib/components/generic_action_card.svelte';
    import { fans, moni, sing, dance, sta, charm, eloq } from "$lib/stores/stats.svelte"

    let locations: Todo[] = [
        { type: 'location', name: 'Dorm Room', base_duration: 5000, reward: () => sta.base++},
        { type: 'location', name: 'Dorm Room', base_duration: 5000, reward: () => sta.base++},
        { type: 'location', name: 'Dorm Room', base_duration: 5000, reward: () => sta.base++},
        { type: 'location', name: 'Dorm Room', base_duration: 5000, reward: () => sta.base++},
        { type: 'location', name: 'Dorm Room', base_duration: 5000, reward: () => sta.base++},
        { type: 'location', name: 'Dorm Room', base_duration: 5000, reward: () => sta.base++},
        { type: 'location', name: 'Dorm Room', base_duration: 5000, reward: () => sta.base++},
    ]
</script>

<h1 class="text-lg font-bold mb-4 justify-center text-center">Locations</h1>
<hr class="h-1 bg-black border-0 opacity-15 mb-4" />

<div class="overflow-y-auto p-4 h-full">
    {#each locations as todo}
        <ActionCard {todo} />
    {/each}
</div>