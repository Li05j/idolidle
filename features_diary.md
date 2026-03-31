# IdolIdle — Features Diary

An idle game where you manage an aspiring idol's training, career, and rise to stardom.

## Core Loop

You complete **locations** (pink cards) to unlock new areas with **actions**. Actions run on timers and reward stats. A checkpoint bar fills as time passes — when full, a **LIVE battle** triggers against a rival idol.

## Locations

Locations unlock in sequence. Each location grants Stamina and reveals its action set upon arrival.

## Actions

Three card types:
- **White (action):** Standard training. Duration shortened by Haste.
- **Purple (gain_currency):** Earns Moni. Duration fixed, rewards scale with stats.
- **Yellow (spend_currency):** Costs Moni. Duration fixed.

Some actions are **one-off** (marked "ONCE") — they disappear after completion and may trigger upgrades.

Actions can be repeated x1/x5/x20/x100 via a repeat selector on each location group.

## Stats

- **Fans** — primary score; gained from performances, lost/gained in LIVE.
- **Moni** — currency for purchases and upgrades.
- **Stamina** — consumed during LIVE; low Stamina weakens you.
- **Haste** — reduces action/location timer duration.
- **Sing, Dance, Charm, Presence** — combat stats used in LIVE battles.

Stats have a **base** and **multi**plier. Final value = base × multi.

## LIVE Battles

Triggered at checkpoint intervals. Turn-based simulation: you and a rival take turns attacking. Each turn costs Stamina. Stats determine damage, and the idol with more Fans at the end wins. Winning is required to advance to the next checkpoint.

Rival stats scale with checkpoint progression.

## Skills

Learnable abilities that trigger during LIVE (e.g., "Go-Home Club" unlocked via living room practice). Skills have conditions and proc chances.

## Rebirth

After a LIVE, you can choose to "dream" (rebirth). This resets all progress but carries over a portion of your stats as permanent base/multi bonuses. Higher checkpoints yield better inheritance ratios.

## Eureka Events

Some actions have random bonus procs (marked with eureka tooltips). Examples: gaining bonus Fans from playing with kids, stat multi breakthroughs from gym exercises, the Mini Lottery's gacha-style random rewards.
