import { ProgressFlag } from '$lib/types'
import { TD_List_Tracker } from "./todos_list_tracker.svelte";
import { fans, moni, sing, dance, sta, charm, eloq } from "$lib/stores/stats.svelte"

type ProgressHandler = () => void;
export type ProgressKey = `${number}-${ProgressFlag}`; // "part-flag"

class ProgressHandlers {
    private _pf = ProgressFlag;

    get TD_List_Tracker() {
        return TD_List_Tracker;
    }

    public handlers = new Map<ProgressKey, ProgressHandler>([
        [`0-${this._pf.f0}`, () => {
            this.TD_List_Tracker.locations = this.TD_List_Tracker.locations.filter((l) => { l.id == 0})
            this.TD_List_Tracker.actions = new Map([
                ...this.TD_List_Tracker.actions,
                ['Dorm Room', [
                    { id: 1, type: 'action', name: 'Sing', base_duration: 3000, reward: () => sing.base++ },
                ]]
            ]);
            console.log("updated: " + this.TD_List_Tracker.locations)
            console.log("updated: " + this.TD_List_Tracker.actions)
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