import { TD_List_Tracker } from '$lib/state/todos_list_tracker.svelte';
import { locationMap, allLocations } from '$lib/data/locations/index';
import type { ActionDef, LocationDef, UpgradeDef } from '$lib/data/locations/location_definition';

class ProgressionEngine {
    onLocationArrived(locationName: string) {
        const def = locationMap.get(locationName);
        if (!def) return;

        const index = TD_List_Tracker.locations.indexOf(locationName);
        if (index > -1) {
            TD_List_Tracker.locations.splice(index, 1);
        }

        if (def.actions.length > 0) {
            const actionNames = def.actions.map(a => a.name);
            TD_List_Tracker.actions = new Map([
                ...TD_List_Tracker.actions,
                [locationName, actionNames],
            ]);
        }

        for (const unlockDef of def.unlocks()) {
            TD_List_Tracker.locations.push(unlockDef.name);
        }
    }

    onUsesExhausted(triggeredLocation: string, actDef: ActionDef) {
        this._removeAction(triggeredLocation, actDef.name);

        const match = this._findUpgrade(actDef);
        if (!match) return;

        const { owner, upgrade } = match;

        if (upgrade.replace_all) {
            const newNames = upgrade.add_actions ? upgrade.add_actions.map(a => a.name) : [];
            TD_List_Tracker.actions = new Map([
                ...TD_List_Tracker.actions,
                [owner.name, newNames],
            ]);
        } else {
            if (upgrade.remove_actions) {
                for (const removeDef of upgrade.remove_actions) {
                    this._removeAction(owner.name, removeDef.name);
                }
            }

            if (upgrade.add_actions) {
                const newNames = upgrade.add_actions.map(a => a.name);
                const current = TD_List_Tracker.actions.get(owner.name) || [];
                TD_List_Tracker.actions = new Map([
                    ...TD_List_Tracker.actions,
                    [owner.name, [...current, ...newNames]],
                ]);
            }
        }

        upgrade.on_trigger?.();
    }

    /**
     * Resolve an ActionDef by location + action name.
     * Checks the location's base actions first, then upgrade-added actions owned by that location.
     */
    resolveAction(locationName: string, actionName: string): ActionDef | undefined {
        const def = locationMap.get(locationName);
        if (!def) return undefined;

        const found = def.actions.find(a => a.name === actionName);
        if (found) return found;

        if (def.upgrades) {
            for (const upgrade of def.upgrades) {
                const inUpgrade = upgrade.add_actions?.find(a => a.name === actionName);
                if (inUpgrade) return inUpgrade;
            }
        }

        return undefined;
    }

    private _findUpgrade(actDef: ActionDef): { owner: LocationDef; upgrade: UpgradeDef } | undefined {
        for (const loc of allLocations) {
            const upgrade = loc.upgrades?.find(u => u.trigger === actDef);
            if (upgrade) return { owner: loc, upgrade };
        }
        return undefined;
    }

    private _removeAction(locationName: string, actionName: string) {
        const actions = TD_List_Tracker.actions.get(locationName);
        if (!actions) return;

        const filtered = actions.filter(n => n !== actionName);
        TD_List_Tracker.actions = new Map([
            ...TD_List_Tracker.actions,
            [locationName, filtered],
        ]);
    }

    init() {
        const wakeUpDef = locationMap.get('Wake Up');
        if (wakeUpDef) {
            TD_List_Tracker.locations = ['Wake Up'];
        }
        TD_List_Tracker.actions = new Map();
    }

    reset() {
        this.init();
    }
}

export const Progression = new ProgressionEngine();

Progression.init();
