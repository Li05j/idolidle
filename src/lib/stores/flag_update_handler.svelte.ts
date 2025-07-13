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

    private _get_new_locations(loc_names: string[]) {
        loc_names.forEach((name) => {
            let t = locations_data.find((ld) => ld.name === name);
            if (t) {
                TD_List_Tracker.locations.push(t)
            }
        })
    }

    private _get_new_actions(loc_name: string) {
        const index = TD_List_Tracker.locations.findIndex(ld => ld.name === loc_name);
        if (index > -1) {
            TD_List_Tracker.locations.splice(index, 1);
        }
        
        let t = actions_data.get(loc_name);
        if (t) {
            TD_List_Tracker.actions = new Map([
                ...TD_List_Tracker.actions,
                [loc_name, t],
            ]);
        }
    }

    public handlers = new Map<ProgressKey, ProgressHandler>([
        [`0-${this._pf.f0}`, () => { this._get_new_actions('Living Room'); this._get_new_locations(['Park', 'School']) }],
        [`0-${this._pf.f1}`, () => { this._get_new_actions('Park') }],
        [`0-${this._pf.f2}`, () => { this._get_new_actions('School') }],
        [`0-${this._pf.f3}`, () => { return }],
    ]);
}

function createProgressHandlers() {
    return new ProgressHandlers()
}

export const P_Handler = createProgressHandlers()