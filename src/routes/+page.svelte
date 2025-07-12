<script lang="ts">
    import type { Todo } from '$lib/types'

    import ActionCard from '$lib/components/generic_action_card.svelte';
    import ActionCollection from '$lib/components/action_collection.svelte';
    import CheckpointTopBar from '$lib/components/checkpoint_top_bar.svelte';
    import { fans, moni, sing, dance, sta, charm, eloq } from "$lib/stores/store.svelte"

    let locations: Todo[] = [
        { id: 1, type: 'location', name: 'Dorm Room', base_duration: 5000, reward: () => sta.base++},
        { id: 2, type: 'location', name: 'Dorm Room', base_duration: 5000, reward: () => sta.base++},
        { id: 3, type: 'location', name: 'Dorm Room', base_duration: 5000, reward: () => sta.base++},
        { id: 4, type: 'location', name: 'Dorm Room', base_duration: 5000, reward: () => sta.base++},
        { id: 5, type: 'location', name: 'Dorm Room', base_duration: 5000, reward: () => sta.base++},
        { id: 6, type: 'location', name: 'Dorm Room', base_duration: 5000, reward: () => sta.base++},
        { id: 7, type: 'location', name: 'Dorm Room', base_duration: 5000, reward: () => sta.base++},
    ]

    let actions: Todo[] = [
        { id: 1, type: 'action', name: 'Sing', base_duration: 3000, reward: () => sing.base++ },
        { id: 2, type: 'action', name: 'Dance', base_duration: 5000, reward: () => sing.multi += 0.01 },
        { id: 3, type: 'action', name: 'Dance', base_duration: 5000, reward: () => sing.multi += 0.01 },
        { id: 4, type: 'action', name: 'Dance', base_duration: 5000, reward: () => sing.multi += 0.01 },
        { id: 5, type: 'action', name: 'Dance', base_duration: 5000, reward: () => sing.multi += 0.01 },
    ];
</script>

<div class="h-screen flex flex-col">
    <div class="top-0 bg-white">
        <CheckpointTopBar />
    </div>
    <div class="flex-auto p-6 bg-gray-50 overflow-hidden">
        <div class="grid grid-cols-5 overflow-hidden h-full">

            <!-- Stats and Logs -->
            <div class="flex-auto col-span-1 overflow-hidden h-full">
                <h3 class="text-lg font-bold mb-4 justify-center text-center">Your Stats</h3>
                <hr class="h-1 bg-black border-0 opacity-15 mb-4" />

                <div class="overflow-y-auto p-4 h-full">
                    <div class="grid grid-cols-2 gap-x-4 text-center justify-center">
                        <div>Fans:</div>
                        <div>{fans.final_str}</div>
                        <div>Moni:</div>
                        <div>{moni.final_str}</div>
                        <div>Sing:</div>
                        <div>{sing.final_str}</div>
                        <div>Dance:</div>
                        <div>{dance.final_str}</div>
                        <div>Stamina:</div>
                        <div>{sta.final_str}</div>
                        <div>Charm:</div>
                        <div>{charm.final_str}</div>
                        <div>Eloquence:</div>
                        <div>{eloq.final_str}</div>
                    </div>
                </div>
            </div>

            <!-- Location -->
            <div class="flex-auto col-span-1 overflow-hidden h-full">
                <h1 class="text-lg font-bold mb-4 justify-center text-center">Locations</h1>
                <hr class="h-1 bg-black border-0 opacity-15 mb-4" />

                <div class="overflow-y-auto p-4 h-full">
                    {#each locations as todo}
                        <ActionCard {todo} />
                    {/each}
                </div>
            </div>

            <!-- Actions -->
            <div class="flex-auto col-span-3 overflow-hidden h-full">
                <h1 class="text-lg font-bold mb-4 justify-center text-center">Actions</h1>
                <hr class="h-1 bg-black border-0 opacity-15 mb-4" />

                <div class="overflow-y-auto p-4 h-full">
                    <div>
                        <ActionCollection title={"Dorm Room"} todos={actions} />
                    </div>
                    <div>
                        <ActionCollection title={"Dorm Room"} todos={actions} />
                    </div>
                    <div>
                        <ActionCollection title={"Dorm Room"} todos={actions} />
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>