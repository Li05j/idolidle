import type { LocationDef } from './location_definition';
import { wake_up } from './wake_up';
import { living_room } from './living_room';
import { park } from './park';
import { school } from './school';
import { mall } from './mall';
import { gym } from './gym';
import { maid_cafe } from './maid_cafe';

export const allLocations: LocationDef[] = [
    wake_up,
    living_room,
    park,
    school,
    mall,
    gym,
    maid_cafe,
];

/** The location the player starts at on a fresh run / rebirth. */
export const STARTING_LOCATION: LocationDef = wake_up;

export const locationMap = new Map<string, LocationDef>(
    allLocations.map(loc => [loc.name, loc])
);

/** Reverse map: equip_id → location display name. Derived from each location's drop tables. */
export const EQUIP_DROP_LOCATION: Map<string, string> = new Map(
    allLocations.flatMap(loc => {
        const tables = [
            loc.equip_drops,
            ...loc.actions.map(a => a.equip_drops),
            ...(loc.upgrades ?? []).flatMap(u => u.add_actions?.map(a => a.equip_drops) ?? []),
        ].filter((t): t is NonNullable<typeof t> => !!t);
        return tables.flatMap(t => t.table.map(e => [e.equip_id, loc.name] as const));
    })
);
