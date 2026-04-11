# IdolIdle — Features Diary

An idle game where you train an aspiring idol and battle rival idols in LIVE showdowns.

## Core Loop

Complete **locations** to unlock new areas with **actions**. Actions run on timers and grant stat rewards. A checkpoint bar fills passively — when full, a **LIVE battle** triggers against a rival idol. Win the LIVE to advance; optionally **rebirth** afterward to carry over stat bonuses.

## Locations & Actions

Locations unlock sequentially via each location's `unlocks` list. Arriving at a location grants its rewards (typically Stamina) and reveals its actions. Some locations have prerequisites (stat thresholds).

Actions come in three kinds:
- **training** — stat gains.
- **earning** — Moni income. All earners scale via `depends`/`efficiency` (sublinear power curves: v_slow ^0.4 through v_fast ^0.92). Later earners have better tiers and outscale early ones at high stats.
- **spending** — costs Moni.

Some actions are **one-off** (`uses: 1`) — they disappear after completion and can trigger **upgrades** (swap/add/remove actions in that location). Eureka events (`on_complete`) give random bonus procs.

## Stats

Fans, Moni, Stamina, Haste, Sing, Dance, Charm, Presence. Each has a `base` and `multi`; final = base × multi.

Canonical gain rates per second at 1.0x value: Stamina 0.05/s, Fans 0.1/s, Moni 0.3/s, all others 0.1/s. An action's **value** = `sum(reward / rate) / base_time`. Defined in `BASE_RATE` in `config.ts`.

## LIVE Battles

Turn-based simulation. Timeline order is determined by Haste. Each turn one side attacks (Sing vs Charm or Dance vs Presence, randomly chosen). Damage poaches Fans from the defender. Stamina drains per attack; low Stamina weakens defense. Battle ends when either side hits 0 Fans or both run out of Stamina. The fight is pre-computed then replayed turn-by-turn in the UI.

Rival stats are generated from `RivalTemplate` ranges per checkpoint, with a minimum-stat-sum floor to prevent pushover rolls.

## Skills

Defined in `src/lib/state/skills.svelte.ts`. Each skill has a trigger timing (`live_start`, `turn_start`, `before_taking_dmg`), a proc chance, and condition/effect descriptions. Skills are unlocked by performing specific actions. On rebirth, all skills reset to unlearned.

## Equipment

Actions can drop equipment. Each item has a slot (hat, top, bottom, shoes, accessory), stat bonuses, and optionally a battle skill. On drop, rarity is rolled (N/R/SR/UR) — higher rarity multiplies stat bonuses. Duplicates grant EXP toward leveling; a dupe with higher rarity upgrades the item's rarity instead. Leveling adds 10% bonus per level. Six equip slots: hat, top, bottom, shoes, accessory ×2.

Global tuning (rarity weights, stat multipliers, leveling curve) lives in `EQUIP_CONFIG` in `src/lib/data/equipment/equipment_definition.ts`. Per-action drop chances are defined inline on each action's `equip_drops` field in the location files.

Some equipment grants a passive skill that triggers during LIVE battles (e.g. restore stamina, steal extra fans, reduce damage).

## Checkpoints

Defined as `{ time, multi }` entries in `src/lib/state/checkpoints.svelte.ts`. The checkpoint bar fills while actions are running. Each checkpoint corresponds 1:1 to a rival template in `src/lib/data/rival_stats.ts`.

## Action Mastery

Each action tracks total completions across all rebirths. More completions = shorter action time via a diminishing-returns curve: `min(1, 1/(1 + rate * sqrt(completions)) + offset)`. The offset creates a dead zone where early completions have no effect; the sqrt provides a gentler ramp than log. Action timers are reactive — mastery gains apply immediately to subsequent loops. Upgraded actions can share a mastery track via `mastery_id` (e.g. "Singing Practice+" shares mastery with "Singing Practice"). Mastery info shows on card hover.

## Rebirth

After a LIVE, you can "dream" (rebirth). This resets all progress but permanently carries over a portion of your current stats as base/multi bonuses. The multi carry-over is capped proportionally to your furthest completed checkpoint. Ratios are configured in `RebirthStats` (`BASE_RATIO`, `MULTI_RATIO`).

Each rebirth also awards **Dream Points** (`checkpoint_completed + 1`). Points accumulate permanently. They currently have no gameplay effect but are tracked for future use.

---

## Contributor Guide: How to Extend

### Add a new location

1. Create `src/lib/data/locations/<name>.ts` — export a `LocationDef` (see `park.ts` for a minimal example, `school.ts` for upgrades).
2. Register it in `src/lib/data/locations/index.ts` — add to `allLocations`.
3. Add the location name to an existing location's `unlocks` array so the progression chain reaches it.

### Add a new action to an existing location

Single-file edit: append to the `actions` array in that location's file. For actions unlocked by an upgrade, add them inside an `UpgradeDef` in the `upgrades` array instead.

### Add a new checkpoint

Two files, matched by array index:
1. `src/lib/state/checkpoints.svelte.ts` — add a `{ time, multi }` entry to `_defs`.
2. `src/lib/data/rival_stats.ts` — add a corresponding `RivalTemplate` to `RIVAL_TEMPLATES` (use `scaleTemplate` or define manually).

### Edit rival stats

Single file: `src/lib/data/rival_stats.ts`. Edit `BASE` template ranges or adjust `scaleTemplate` multipliers in `RIVAL_TEMPLATES`.

### Edit rebirth bonuses

Single file: `src/lib/state/rebirth.svelte.ts`. Adjust `BASE_RATIO`, `MULTI_RATIO`, carry-over logic in `inherit_stats()`.

### Add new equipment

1. Define the item in `src/lib/data/equipment/<location>_equipment.ts` — export an `EquipDef` with slot, stat bonuses, and optional skill.
2. Register it in `src/lib/data/equipment/index.ts`.
3. Add it to an action's `equip_drops` table in the relevant location file (`{ chance, table: [{ equip_id, weight }] }`).

### Edit equipment rates / stats

- **Global rarity weights, stat multipliers, leveling**: `EQUIP_CONFIG` in `src/lib/data/equipment/equipment_definition.ts`.
- **Per-action drop chance**: `equip_drops.chance` on the action in its location file.
- **Per-item stat bonuses**: `stat_bonuses` in the item's definition file.

### Edit mastery curve

Mastery curve is `mastery_rate` (sqrt coefficient) and `mastery_offset` (additive constant clamped to 1.0) in `config.ts`. Completion tracking lives in `src/lib/state/mastery.svelte.ts`. To link upgraded actions to a shared mastery track, set `mastery_id` on the `ActionDef`.
