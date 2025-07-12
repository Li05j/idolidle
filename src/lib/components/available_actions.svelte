<script lang="ts">
    import type { Todo } from '$lib/types'
    import { fans, moni, sing, dance, sta, charm, eloq } from "$lib/stores/stats.svelte"
    import ActionCollection from '$lib/components/action_collection.svelte';

    let actions: Todo[] = [
        { type: 'action', name: 'Sing', base_duration: 3000, reward: () => sing.base++ },
        { type: 'action', name: 'Dance', base_duration: 5000, reward: () => sing.multi += 0.01 },
        { type: 'action', name: 'Dance', base_duration: 5000, reward: () => sing.multi += 0.01 },
        { type: 'action', name: 'Dance', base_duration: 5000, reward: () => sing.multi += 0.01 },
        { type: 'action', name: 'Dance', base_duration: 5000, reward: () => sing.multi += 0.01 },
    ];
</script>

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