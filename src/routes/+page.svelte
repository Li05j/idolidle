<script lang="ts">
    import ActionCard from '$lib/components/generic_action_card.svelte';
    import CheckpointTopBar from '$lib/components/checkpoint_top_bar.svelte';
    import { fans, moni, sing, dance, sta, charm, eloq } from "$lib/stores/store.svelte"

    let locations = [
        { id: 1, name: 'Dorm Room', base_duration: 5000, reward: () => sta.base++}
    ]

    let actions = [
        { id: 1, name: 'Sing', base_duration: 3000, reward: () => sing.base++ },
        { id: 2, name: 'Dance', base_duration: 5000, reward: () => sing.multi += 0.5 }
    ];
</script>

<div>
    <CheckpointTopBar />
    <div class="mx-auto p-6 bg-gray-50 h-screen w-full">
        <div class="grid grid-cols-5">
            <div class="col-span-1">
                <h3 class="text-lg font-bold mb-4 justify-center text-center">Your Stats</h3>
                <hr class="h-1 bg-black border-0 opacity-15 mb-4" />
                <div>Sing: {sing.base}</div>
                <div>Sing final: {sing.final}</div>
            </div>
            <div class="col-span-1">
                <h1 class="text-lg font-bold mb-4 justify-center text-center">Locations</h1>
                <hr class="h-1 bg-black border-0 opacity-15 mb-4" />
                {#each locations as action}
                    <ActionCard {action} />
                {/each}
            </div>
            <div class="col-span-3">
                <h1 class="text-lg font-bold mb-4 justify-center text-center">Actions</h1>
                <hr class="h-1 bg-black border-0 opacity-15 mb-4" />
                <div>
                    {#each actions as action}
                        <ActionCard {action} />
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>