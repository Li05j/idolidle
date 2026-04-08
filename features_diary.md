# IdolIdle — Features Diary

An idle game where you train an aspiring idol and battle rival idols in LIVE showdowns.

## Core Loop

Complete **locations** (timed cards) to unlock new areas with **actions**. Actions run on timers and grant stat rewards. A checkpoint bar fills passively — when full, a **LIVE battle** triggers against a rival idol. Win the LIVE to advance; optionally **rebirth** afterward to carry over stat bonuses.

## Locations & Actions

Locations unlock sequentially via each location's `unlocks` list. Arriving at a location grants its rewards (typically Stamina) and reveals its actions. Some locations have prerequisites (stat thresholds).

Actions come in three kinds:
- **training** — stat gains, duration shortened by Haste.
- **earning** — Moni income, rewards can scale with stats via `depends`/`efficiency`.
- **spending** — costs Moni.

Some actions are **one-off** (`uses: 1`) — they disappear after completion and can trigger **upgrades** (swap/add/remove actions in that location). Eureka events (`on_complete`) give random bonus procs.

## Stats

Fans, Moni, Stamina, Haste, Sing, Dance, Charm, Presence. Each has a `base` and `multi`; final = base × multi.

## LIVE Battles

Turn-based simulation. Timeline order is determined by Haste. Each turn one side attacks (Sing vs Charm or Dance vs Presence, randomly chosen). Damage poaches Fans from the defender. Stamina drains per attack; low Stamina weakens defense. Battle ends when either side hits 0 Fans or both run out of Stamina. The fight is pre-computed then replayed turn-by-turn in the UI.

Rival stats are generated from `RivalTemplate` ranges per checkpoint, with a minimum-stat-sum floor to prevent pushover rolls.

## Skills

Defined in `src/lib/state/skills.svelte.ts`. Each skill has a trigger timing (`live_start`, `turn_start`, `before_taking_dmg`), a proc chance, and condition/effect descriptions. Skills are unlocked by performing specific actions. On rebirth, all skills reset to unlearned.

## Checkpoints

Defined as `{ time, multi }` entries in `src/lib/state/checkpoints.svelte.ts`. The checkpoint bar fills while actions are running. Each checkpoint corresponds 1:1 to a rival template in `src/lib/data/rival_stats.ts`.

## Rebirth

After a LIVE, you can "dream" (rebirth). This resets all progress but permanently carries over a portion of your current stats as base/multi bonuses. The multi carry-over is capped proportionally to your furthest completed checkpoint. Ratios are configured in `RebirthStats` (`BASE_RATIO`, `MULTI_RATIO`).

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

Single file: `src/lib/state/rebirth.svelte.ts`. Adjust `BASE_RATIO`, `MULTI_RATIO`, or the carry-over logic in `inherit_stats()`.
