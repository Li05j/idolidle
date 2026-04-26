import type { LocationDef } from './location_definition';
import { bedroom } from './bedroom';
import { living_room } from './living_room';
import { park } from './park';
import { old_theatre } from './old_theatre';
import { school } from './school';
import { train_station } from './train_station';
import { mall } from './mall';
import { gym } from './gym';
import { maid_cafe } from './maid_cafe';

// NOTE: array order is the display order. Authored order = canonical UI order.
// Adding/reordering here changes what every player sees, regardless of unlock path.
export const allLocations: LocationDef[] = [
    bedroom,
    living_room,
    park,
    school,
    old_theatre,
    gym,
    mall,
    maid_cafe,
    train_station,
];

// ---------------------------------------------------------------------------
// Future location/upgrade ideas: brainstorm.
// Constraint reminders: Sing is currently only trained at School (gap).
// Haste lives almost entirely in Gym. Late game Moni has nowhere to go past
// Mall outfits + Living Room upgrade.
//
//   - Concert Hall
//   - Streaming Studio could spawn from upgraded Living Room instead.
//   - Talent Agency
//   - Shrine / Festival
//
// Cities (much later, NOT now): probably each city can have its own theme.
// Optional: 'start-in-Tokyo' rebirth choice as a dream upgrade once unlocked.
// ---------------------------------------------------------------------------

/** The location the player starts at on a fresh run / rebirth. */
export const STARTING_LOCATION: LocationDef = bedroom;

const LOCATION_ORDER = new Map<string, number>(
    allLocations.map((loc, i) => [loc.name, i])
);

/** Canonical sort key for a location name. Unknown names sort to the end. */
export function canonical_index(name: string): number {
    return LOCATION_ORDER.get(name) ?? Number.POSITIVE_INFINITY;
}

export const locationMap = new Map<string, LocationDef>(
    allLocations.map(loc => [loc.name, loc])
);

/** Reverse map: equip_id → location display name. Walks every base location plus all upgrade_to defs reachable from it, so equip dropped only by an upgraded form still attributes back to the base name. */
export const EQUIP_DROP_LOCATION: Map<string, string> = new Map(
    allLocations.flatMap(loc => {
        const reachable: LocationDef[] = [loc];
        for (const upg of loc.upgrades ?? []) reachable.push(upg.upgrade_to);
        return reachable.flatMap(d => {
            const tables = [d.equip_drops, ...d.actions.map(a => a.equip_drops)]
                .filter((t): t is NonNullable<typeof t> => !!t);
            return tables.flatMap(t => t.table.map(e => [e.equip_id, loc.name] as const));
        });
    })
);
