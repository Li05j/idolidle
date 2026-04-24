import { TD_List_Tracker, type TDEntry } from '$lib/state/todos_list_tracker.svelte';
import { canonical_index } from '$lib/data/locations';

class AvailableLocationsVM {
    get entries(): TDEntry[] {
        return TD_List_Tracker.locations
            .slice()
            .sort((a, b) => canonical_index(a.name) - canonical_index(b.name));
    }
}

export const available_locations_vm = new AvailableLocationsVM();
