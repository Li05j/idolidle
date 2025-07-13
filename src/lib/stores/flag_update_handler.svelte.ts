import { ProgressFlag } from '$lib/types'
import { TD_List_Tracker } from "$lib/stores/todos_list_tracker.svelte";
import {
    locations_data,
    actions_data,
} from "$lib/stores/todos_data.svelte"

type ProgressHandler = () => void;
export type ProgressKey = `${number}-${ProgressFlag}`; // "part-flag"

class ProgressHandlers {
    private _pf = ProgressFlag;

    get TD_List_Tracker() {
        return TD_List_Tracker;
    }

    public handlers = new Map<ProgressKey, ProgressHandler>([
        [`0-${this._pf.f0}`, () => {
            let t = actions_data.get('Living Room');
            if (t) {
                TD_List_Tracker.actions = new Map([
                    ...TD_List_Tracker.actions,
                    ['Living Room', t],
                ]);
            }
        }],
        
        [`0-${this._pf.f1}`, () => { return }],
        [`0-${this._pf.f2}`, () => { return }],
        [`0-${this._pf.f3}`, () => { return }],
    ]);
}

function createProgressHandlers() {
    return new ProgressHandlers()
}

export const P_Handler = createProgressHandlers()