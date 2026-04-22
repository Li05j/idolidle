import type { LocationDef } from './location_definition';
import { wake_up } from './wake_up';
import { living_room } from './living_room';
import { park } from './park';
import { school } from './school';
import { mall } from './mall';
import { gym } from './gym';
import { maid_cafe } from './maid_cafe';

// NOTE: array order is the display order. Authored order = canonical UI order.
// Adding/reordering here changes what every player sees, regardless of unlock path.
export const allLocations: LocationDef[] = [
    wake_up,
    living_room,
    park,
    school,
    mall,
    gym,
    maid_cafe,
];

// ---------------------------------------------------------------------------
// Future location/upgrade ideas — brainstorm pile, not a roadmap.
// Constraint reminders: Sing is currently only trained at School (real gap).
// Haste lives almost entirely in Gym. Late-game Moni has nowhere to go past
// Mall outfits + Living Room upgrade. No nighttime venues. No online loop.
//
// Priority guesses (closes the most obvious holes first):
//   1. Karaoke Box       — fixes Sing starvation. Unlock from Park/School.
//                          Trigger: 'Book a Solo Booth'. Late-night upgrade.
//   2. Concert Hall      — endgame stage. Gate behind School concert or Fans.
//                          Trigger: 'Pass Audition' → 'Headline Show'.
//   3. Streaming Studio  — Presence/Fans loop, big Moni sink + viral % procs.
//                          Could spawn from upgraded Living Room instead.
//   4. Talent Agency     — meta hub, 1-use buys: vocal coach, choreographer,
//                          photoshoot, signing bonus. Eats late-game Moni.
//   5. Shrine / Festival — Haste second home, omikuji gambling-lite, wholesome
//                          counter to Maid Cafe's otaku vibe.
//
// Cities (much later, NOT now): only worth it past ~12 locations AND only if
// each city carries mechanical weight beyond UI — own rival persona pool, own
// equip drop pool, own dream upgrade lane. Otherwise it's just folders and
// pure complexity cost. Tie unlock to a checkpoint milestone, not a menu.
// Possible split when the time comes:
//   Hometown (current 7 + Karaoke + Shrine) → Tokyo (Concert Hall, Streaming
//   Studio, Talent Agency, plus tougher rivals & better equip pools).
// Optional: 'start-in-Tokyo' rebirth choice as a dream upgrade once unlocked.
// ---------------------------------------------------------------------------

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
