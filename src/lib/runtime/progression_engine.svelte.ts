import { TD_List_Tracker } from '$lib/state/todos_list_tracker.svelte';
import { locationMap, allLocations, STARTING_LOCATION } from '$lib/data/locations/index';
import type { ActionDef, LocationDef, UpgradeDef } from '$lib/data/locations/location_definition';

class ProgressionEngine {
    onLocationArrived(locationName: string) {
        const def = locationMap.get(locationName);
        if (!def) return;

        const index = TD_List_Tracker.locations.findIndex(e => e.name === locationName);
        if (index > -1) {
            TD_List_Tracker.locations.splice(index, 1);
        }

        if (def.actions.length > 0) {
            const entries = def.actions.map(a => ({ name: a.name, elapsed: 0 }));
            TD_List_Tracker.actions = new Map([
                ...TD_List_Tracker.actions,
                [locationName, entries],
            ]);
        }

        for (const unlockDef of def.unlocks()) {
            TD_List_Tracker.locations.push({ name: unlockDef.name, elapsed: 0 });
        }
    }

    onUsesExhausted(triggeredLocation: string, actionName: string) {
        this._removeAction(triggeredLocation, actionName);

        const match = this._findUpgrade(actionName);
        if (!match) return;

        const { owner, upgrade } = match;

        if (upgrade.replace_all) {
            const newEntries = upgrade.add_actions ? upgrade.add_actions.map(a => ({ name: a.name, elapsed: 0 })) : [];
            TD_List_Tracker.actions = new Map([
                ...TD_List_Tracker.actions,
                [owner.name, newEntries],
            ]);
        } else {
            if (upgrade.remove_actions) {
                for (const removeName of upgrade.remove_actions) {
                    this._removeAction(owner.name, removeName);
                }
            }

            if (upgrade.add_actions) {
                const newEntries = upgrade.add_actions.map(a => ({ name: a.name, elapsed: 0 }));
                const current = TD_List_Tracker.actions.get(owner.name) || [];
                TD_List_Tracker.actions = new Map([
                    ...TD_List_Tracker.actions,
                    [owner.name, [...current, ...newEntries]],
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

    private _findUpgrade(actionName: string): { owner: LocationDef; upgrade: UpgradeDef } | undefined {
        for (const loc of allLocations) {
            const upgrade = loc.upgrades?.find(u => u.trigger === actionName);
            if (upgrade) return { owner: loc, upgrade };
        }
        return undefined;
    }

    private _removeAction(locationName: string, actionName: string) {
        const actions = TD_List_Tracker.actions.get(locationName);
        if (!actions) return;

        const filtered = actions.filter(e => e.name !== actionName);
        TD_List_Tracker.actions = new Map([
            ...TD_List_Tracker.actions,
            [locationName, filtered],
        ]);
    }

    init() {
        TD_List_Tracker.locations = [{ name: STARTING_LOCATION.name, elapsed: 0 }];
        TD_List_Tracker.actions = new Map();
    }

    reset() {
        this.init();
    }
}

export const Progression = new ProgressionEngine();
