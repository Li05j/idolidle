import { TD_List_Tracker } from '$lib/state/todos_list_tracker.svelte';
import { locationMap, buildLocationTodo, buildTodoBase } from '$lib/data/locations/index';
import type { ActionParams } from '$lib/data/locations/location_definition';
import type { TodoBase } from '$lib/data/todo_type';

class ProgressionEngine {
    /**
     * Called when a location task completes.
     * Removes the location from the tracker, adds its actions, and reveals unlocked locations.
     */
    onLocationArrived(locationName: string) {
        const def = locationMap.get(locationName);
        if (!def) return;

        // Remove the location from the active list
        const index = TD_List_Tracker.locations.findIndex(ld => ld.name === locationName);
        if (index > -1) {
            TD_List_Tracker.locations.splice(index, 1);
        }

        // Add this location's actions
        if (def.actions.length > 0) {
            const todos = this._buildActions(locationName, def.actions);
            TD_List_Tracker.actions = new Map([
                ...TD_List_Tracker.actions,
                [locationName, todos],
            ]);
        }

        // Reveal unlocked locations
        for (const unlockName of def.unlocks) {
            const unlockDef = locationMap.get(unlockName);
            if (unlockDef) {
                const todo = buildLocationTodo(unlockDef, () => this.onLocationArrived(unlockName));
                TD_List_Tracker.locations.push(todo);
            }
        }
    }

    /**
     * Called when a one-off action completes.
     * Checks if this action triggers an upgrade for the given location.
     */
    onOneOffCompleted(locationName: string, actionName: string) {
        const def = locationMap.get(locationName);
        if (!def?.upgrades) {
            this._removeAction(locationName, actionName);
            return;
        }

        const upgrade = def.upgrades.find(u => u.trigger_action === actionName);
        if (!upgrade) {
            this._removeAction(locationName, actionName);
            return;
        }

        // Remove the trigger action itself
        this._removeAction(locationName, actionName);

        if (upgrade.replace_all) {
            // Replace all actions for this location
            const newTodos = upgrade.add_actions ? this._buildActions(locationName, upgrade.add_actions) : [];
            TD_List_Tracker.actions = new Map([
                ...TD_List_Tracker.actions,
                [locationName, newTodos],
            ]);
        } else {
            // Remove specified actions
            if (upgrade.remove_actions) {
                for (const name of upgrade.remove_actions) {
                    this._removeAction(locationName, name);
                }
            }

            // Add new actions
            if (upgrade.add_actions) {
                const newTodos = this._buildActions(locationName, upgrade.add_actions);
                const current = TD_List_Tracker.actions.get(locationName) || [];
                TD_List_Tracker.actions = new Map([
                    ...TD_List_Tracker.actions,
                    [locationName, [...current, ...newTodos]],
                ]);
            }
        }

        // Fire any extra logic
        upgrade.on_trigger?.();
    }

    /**
     * Build TodoBase instances for actions, auto-wiring then_fn for one-off actions.
     */
    private _buildActions(locationName: string, params: ActionParams[]): TodoBase[] {
        return params.map(p => {
            const then_fn = p.one_off
                ? () => this.onOneOffCompleted(locationName, p.name)
                : undefined;
            return buildTodoBase(p, then_fn);
        });
    }

    private _removeAction(locationName: string, actionName: string) {
        const actions = TD_List_Tracker.actions.get(locationName);
        if (!actions) return;

        const filtered = actions.filter(a => a.name !== actionName);
        TD_List_Tracker.actions = new Map([
            ...TD_List_Tracker.actions,
            [locationName, filtered],
        ]);
    }

    /**
     * Build the initial "Wake Up" location and set it in the tracker.
     */
    init() {
        const wakeUpDef = locationMap.get('Wake Up');
        if (wakeUpDef) {
            const todo = buildLocationTodo(wakeUpDef, () => this.onLocationArrived('Wake Up'));
            TD_List_Tracker.locations = [todo];
        }
        TD_List_Tracker.actions = new Map();
    }

    reset() {
        this.init();
    }
}

export const Progression = new ProgressionEngine();

// Auto-initialize on first import
Progression.init();
