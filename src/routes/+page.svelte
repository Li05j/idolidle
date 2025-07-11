<script lang="ts">
    import ActionCard from '$lib/components/generic_action_card.svelte';
    import CheckpointTopBar from '$lib/components/checkpoint_top_bar.svelte';
    import { fans, moni, sing, dance, sta, charm, eloq } from "$lib/stores/store.svelte"

    const actions = [
        { id: 1, name: 'Sing', base_duration: 3.0, reward: () => sing.base++ },
        { id: 2, name: 'Dance', base_duration: 5.0, reward: () => sing.multi += 0.5 }
    ];
</script>

<div class="w-full h-full">
    <CheckpointTopBar />
    <div class="max-w-md mx-auto p-6 bg-gray-50 min-h-screen">
        <div class="bg-gray-100 p-4 rounded-lg mb-6">
            <h3 class="text-lg font-bold mb-2">Your Stats</h3>
            <div>Sing: {sing.base}</div>
            <div>Sing final: {sing.final}</div>
        </div>

        {#each actions as action}
            <ActionCard {action} />
        {/each}
    </div>
</div>