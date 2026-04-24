import { TD_List_Tracker, type TDEntry } from '$lib/state/todos_list_tracker.svelte';
import { canonical_index } from '$lib/data/locations';

class AvailableActionsVM {
    get entries(): [string, TDEntry[]][] {
        return [...TD_List_Tracker.actions].sort(
            ([a], [b]) => canonical_index(a) - canonical_index(b),
        );
    }
}

export const available_actions_vm = new AvailableActionsVM();
