<script lang="ts">
    import AvailableLocations from '$lib/components/available_locations.svelte';
    import AvailableActions from '$lib/components/available_actions.svelte';
    import CheckpointTopBar from '$lib/components/checkpoint_top_bar.svelte';
    import Stats from '$lib/components/stats.svelte';
</script>

<div class="h-screen flex flex-col">
    <div class="top-0 bg-white">
        <CheckpointTopBar />
    </div>
    <div class="flex-auto p-6 bg-gray-50 overflow-hidden">
        <div class="grid grid-cols-5 overflow-hidden h-full">

            <!-- Stats and Logs -->
            <div class="flex-auto col-span-1 overflow-hidden h-full">
                <Stats />
            </div>

            <!-- Location -->
            <div class="flex-auto col-span-1 overflow-hidden h-full">
                <AvailableLocations />
            </div>

            <!-- Actions -->
            <div class="flex-auto col-span-3 overflow-hidden h-full">
                <AvailableActions />
            </div>
        </div>
    </div>
</div>