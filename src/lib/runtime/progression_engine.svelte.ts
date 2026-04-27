import { TD_List_Tracker } from '$lib/state/todos_list_tracker.svelte';
import { locationMap, allLocations, STARTING_LOCATION } from '$lib/data/locations/index';
import type { ActionDef, LocationDef, UpgradeDef } from '$lib/data/locations/location_definition';

class ProgressionEngine {
    private applied_upgrades: Set<string> = new Set();
    private _tick = $state(0);

    get mutation_tick() { return this._tick; }
    mark_dirty() { this._tick++; }

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

        TD_List_Tracker.mark_dirty();
    }

    onUsesExhausted(triggeredLocation: string, actionName: string) {
        this._removeAction(triggeredLocation, actionName);

        const match = this._findUpgrade(actionName);
        if (!match) return;

        const { owner, upgrade } = match;
        this._applyUpgrade(owner, upgrade);
        upgrade.on_trigger?.();
    }

    /** Read the currently-registered def for a location. Post-upgrade, returns the swapped-in def. */
    resolveAction(locationName: string, actionName: string): ActionDef | undefined {
        return locationMap.get(locationName)?.actions.find(a => a.name === actionName);
    }

    private _applyUpgrade(owner: LocationDef, upgrade: UpgradeDef) {
        locationMap.set(owner.name, upgrade.upgrade_to);
        this.applied_upgrades.add(upgrade.trigger);

        const newEntries = upgrade.upgrade_to.actions.map(a => ({ name: a.name, elapsed: 0 }));
        TD_List_Tracker.actions = new Map([
            ...TD_List_Tracker.actions,
            [owner.name, newEntries],
        ]);

        this._tick++;
        TD_List_Tracker.mark_dirty();
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

        TD_List_Tracker.mark_dirty();
    }

    /** Reset locationMap to its baseline (every base def under its own name). Run before any upgrade replay. */
    private _restoreBaseline() {
        for (const loc of allLocations) {
            locationMap.set(loc.name, loc);
        }
    }

    init() {
        this.applied_upgrades = new Set();
        this._restoreBaseline();
        TD_List_Tracker.locations = [{ name: STARTING_LOCATION.name, elapsed: 0 }];
        TD_List_Tracker.actions = new Map();
        this._tick++;
        TD_List_Tracker.mark_dirty();
    }

    reset() {
        this.init();
    }

    serialize(): string[] {
        return Array.from(this.applied_upgrades);
    }

    /** Replay persisted upgrades into locationMap. Must run before TD_List_Tracker.deserialize so action-name validation sees the post-upgrade action set. */
    deserialize(data: unknown): void {
        this.applied_upgrades = new Set();
        this._restoreBaseline();

        if (!Array.isArray(data)) return;

        for (const loc of allLocations) {
            const upgrade = loc.upgrades?.find(u => data.includes(u.trigger));
            if (!upgrade) continue;
            locationMap.set(loc.name, upgrade.upgrade_to);
            this.applied_upgrades.add(upgrade.trigger);
        }
    }
}

export const Progression = new ProgressionEngine();
