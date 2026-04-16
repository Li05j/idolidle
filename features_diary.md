# IdolIdle — Features Diary

An idle game where you train an aspiring idol and battle rival idols in LIVE showdowns.

## Core Loop

Complete **locations** to unlock new areas with **actions**. Actions run on timers and grant stat rewards. A checkpoint bar fills passively — when full, a **LIVE battle** triggers against a rival idol. Win the LIVE to advance; optionally **rebirth** afterward to carry over stat bonuses.

## Locations & Actions

Locations unlock sequentially; some have stat prerequisites. Actions come in three kinds: **training** (stat gains), **earning** (Moni income, scales with stats), and **spending** (costs Moni). Some actions are **one-off** — they disappear after completion and can trigger **upgrades** that swap/add/remove actions. Eureka events give random bonus procs on completion.

Location definitions: `src/lib/data/locations/`. See `park.ts` for a minimal example, `school.ts` for upgrades.

## Stats

Fans, Moni, Stamina, Haste, Sing, Dance, Charm, Presence. Each has base/multi components; equipment bonuses add into each. See `createStat` in `src/lib/state/stats.svelte.ts`.

## LIVE Battles

Turn-based simulation. Haste determines turn order. Attacks poach Fans from the defender; battle ends when either side hits 0 Fans or both exhaust Stamina. The fight is pre-computed then replayed turn-by-turn in the UI. Rival stats are generated from templates per checkpoint.

Battle logic: `src/lib/state/live.svelte.ts`. Rival templates: `src/lib/data/rival_stats.ts`.

## Skills

Each skill has a trigger timing, proc chance, and conditions. Unlocked by performing specific actions. Reset on rebirth. Defined in `src/lib/state/skills.svelte.ts`.

## Equipment

Actions can drop equipment. Each item has a slot (hat, top, bottom, shoes, accessory), stat bonuses, and optionally a battle skill. Rarity is rolled on drop (N/R/SR/UR). Duplicates grant EXP toward leveling; a higher-rarity dupe upgrades rarity instead. Equipment resets on rebirth, but the **Codex** tracks all-time collection history.

Item definitions: `src/lib/data/equipment/`. Global tuning: `EQUIP_CONFIG` in `equipment_definition.ts`. Drop tables: `equip_drops` field on actions in location files.

## Checkpoints

The checkpoint bar fills while actions run. Each checkpoint maps 1:1 to a rival template. Defined in `src/lib/state/checkpoints.svelte.ts`; rival templates in `src/lib/data/rival_stats.ts`.

## Action Mastery

Actions track total completions across all rebirths. More completions = shorter action time (diminishing returns). Upgraded actions can share a mastery track via `mastery_id`. Config in `config.ts`; state in `src/lib/state/mastery.svelte.ts`.

## Rebirth

After a LIVE, you can "dream" (rebirth). Resets progress but permanently carries over a portion of current stats as base/multi bonuses. Multi carry-over is capped by furthest checkpoint reached. Logic in `src/lib/state/rebirth.svelte.ts`.

**Dream Points** are awarded on rebirth from two sources: equipment obtained during the run, and checkpoints completed.

## Dream Upgrades

Spend dream points on permanent upgrades (persist across rebirths): time reductions, initial stat bonuses, equipment drop rate. Upgrade definitions: `src/lib/data/dreams/`. State: `src/lib/state/dreams.svelte.ts`.

---

## Contributor Guide

### Add a location

1. Create `src/lib/data/locations/<name>.ts` — export a `LocationDef`.
2. Register in `src/lib/data/locations/index.ts` (`allLocations`).
3. Add to an existing location's `unlocks` thunk: `unlocks: () => [mall, new_loc]`. Import the peer directly; the thunk defers evaluation so module-load order is not a concern.

### Add an action

Append to the `actions` array in a location file. For upgrade-gated actions, add inside an `UpgradeDef` in the `upgrades` array.

Upgrades reference their trigger by **object ref**, not name: extract the action as a `const my_action: ActionDef = {...}`, put it in `actions`, and use `{ trigger: my_action, ... }` in `upgrades`. Triggers can live in a different location than the upgrade — import the action from the owning file (e.g. Living Room's upgrade triggers off `upgrade_living_room` imported from `mall.ts`). The progression engine searches all locations for an upgrade matching the exhausted action.

### Add a checkpoint

Two files, matched by array index: add `{ time, multi }` to `checkpoints.svelte.ts` and a corresponding `RivalTemplate` to `rival_stats.ts`.

### Add equipment

1. Define in `src/lib/data/equipment/equipment_table.ts` (`ALL_EQUIPMENT`).
2. Add to a `LocationDef.equip_drops` (location-wide drop) or a specific `ActionDef.equip_drops` (action override). The reverse map `EQUIP_DROP_LOCATION` in `locations/index.ts` is derived automatically — no manual registration.

### Add a dream upgrade

Append a `DreamUpgradeDef` to `ALL_DREAM_UPGRADES` in `src/lib/data/dreams/dream_upgrade_table.ts` and wire up the bonus in `src/lib/state/dreams.svelte.ts`.
