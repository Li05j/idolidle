import { TD_List_Tracker } from "$lib/stores/todos_list_tracker.svelte";
import { locations_data } from "$lib/data/locations_data"
import { actions_data } from "$lib/data/actions_data"
import type { TodoBase } from "$lib/data/todo_type";

class ProgressHandlers {
    // For locations only
    private _arrived(loc_name: string) {
        const index = TD_List_Tracker.locations.findIndex(ld => ld.name === loc_name);
        if (index > -1) {
            TD_List_Tracker.locations.splice(index, 1);
        }

        let v = actions_data.get(loc_name);
        if (v) {
            TD_List_Tracker.actions = new Map([
                ...TD_List_Tracker.actions,
                [loc_name, v],
            ]);
        }
    }

    private _new_locations(loc_names: string[]) {
        loc_names.forEach((name) => {
            let t = locations_data.find((ld) => ld.name === name);
            if (t) {
                TD_List_Tracker.locations.push(t)
            }
        })
    }

    // Mainly used for one off actions
    private _remove_single_action(key: string, action_name: string) {
        const actions = TD_List_Tracker.actions.get(key);
        if (!actions) return;

        const filtered = actions.filter(a => a.name !== action_name);
        TD_List_Tracker.actions = new Map([
            ...TD_List_Tracker.actions,
            [key, filtered]
        ]);
    }

    private _replace_action_collection(from_loc: string, to_loc: string) {
        const new_available_actions: Map<string, TodoBase[]> = new Map();
        for (const [key, value] of TD_List_Tracker.actions) {
            if (key === from_loc) {
                const v = actions_data.get(to_loc);
                if (v) {
                    new_available_actions.set(to_loc, v)
                } else {
                    new_available_actions.set(key, value)
                }
            } else {
                new_available_actions.set(key, value)
            }
        }
        TD_List_Tracker.actions = new_available_actions;
    }

    private _add_actions_from(from_loc: string, to_loc: string) {
        const fromActions = actions_data.get(from_loc);
        if (!fromActions) return;

        const current = TD_List_Tracker.actions.get(to_loc) || [];
        const updated = [...current, ...fromActions];

        TD_List_Tracker.actions = new Map([
            ...TD_List_Tracker.actions,
            [to_loc, updated],
        ]);
    }

    ////////////////////////////////
    /////////// Handlers ///////////
    ////////////////////////////////

    public wake_up() {
        this._arrived('Wake Up'); 
        this._new_locations(['Living Room']);
    }

    public living_room() {
        this._arrived('Living Room'); 
        this._new_locations(['Park', 'School']);
    }

    public park() {
        this._arrived('Park'); 
        this._new_locations(['Mall']);
    }

    public school() {
        this._arrived('School');
        this._new_locations(['Gym', 'Maid Cafe']);
    }

    public mall() {
        this._arrived('Mall');
    }

    public gym() {
        this._arrived('Gym');
    }

    public maid_cafe() {
        this._arrived('Maid Cafe');
    }

    public upgrade_living_room() {
        this._remove_single_action('Mall', 'Upgrade Living Room');
        this._replace_action_collection('Living Room', 'Living Room+');
    }

    public mini_lottery() {
        this._remove_single_action('Mall', 'Mini Lottery');
    }

    public grade_report() {
        this._remove_single_action('School', 'Collect Grade Report');
    }

    public school_idol_club() {
        this._remove_single_action('School', 'Open Idol Club');
        this._add_actions_from('Idol Club', 'School');
    }

    public upgrade_gym() {
        this._remove_single_action('Gym', 'Purchase Gym VIP');
        this._remove_single_action('Gym', 'Treadmill');
        this._remove_single_action('Gym', 'Bench Press');
        this._remove_single_action('Gym', 'Assault Bike');
        this._add_actions_from('Gym VIP', 'Gym');
    }

    public maid_interview() {
        this._remove_single_action('Maid Cafe', 'Maid Interview')
        this._add_actions_from('Maid Worker', 'Maid Cafe');
    }

    public maid_hire() {
        this._remove_single_action('Maid Worker', 'New Hire Bonus!')
    }
}

function createProgressHandlers() {
    return new ProgressHandlers()
}

export const P_Handler = createProgressHandlers()