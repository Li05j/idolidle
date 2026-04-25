import { stat_list } from "$lib/state/stats.svelte";
import { CPs } from "$lib/state/checkpoints.svelte";
import { RivalStatsM } from "$lib/runtime/live_rival_stats.svelte";
import { equip_cost } from "$lib/data/rivals/rival_equipment";
import { CHECKPOINTS } from "$lib/data/checkpoints";
import type { LiveBattleStats } from "$lib/types";
import { EQUIP_REGISTRY } from "$lib/data/equipment";
import {
    effective_bonus,
    render_skill_string,
    resolve_equip,
    type EquipDef,
    type SkillDef,
    type EquipSlot,
    type RivalEquipEntry,
} from "$lib/data/equipment/equipment_definition";
import type { BasicStats } from "$lib/types";

type StatKey = keyof typeof stat_list;
type RivalKey = keyof LiveBattleStats;

const COMBAT_PAIRS: [StatKey, RivalKey, string][] = [
    ["Fans",     "Fans",        "Fans"],
    ["Stamina",  "Max_Stamina", "Stamina"],
    ["Haste",    "Haste",       "Haste"],
    ["Sing",     "Charm",       "Sing"],
    ["Dance",    "Presence",    "Dance"],
    ["Charm",    "Sing",        "Charm"],
    ["Presence", "Dance",       "Presence"],
];

export type StatComparison = { label: string; clamped: number; color: string; playerValue: string; rivalValue: string; rivalLabel: string };

export type RivalEquipFilled = {
    slot_label: string;
    filled: true;
    idx: number;
    entry: RivalEquipEntry;
    def: EquipDef;
    skill_name: string | null;
};

export type RivalEquipEmpty = {
    slot_label: string;
    filled: false;
};

export type RivalEquipSlot = RivalEquipFilled | RivalEquipEmpty;

const DISPLAY_SLOTS: { slot: EquipSlot; label: string }[] = [
    { slot: 'hat', label: 'Hat' },
    { slot: 'top', label: 'Top' },
    { slot: 'bottom', label: 'Bottom' },
    { slot: 'shoes', label: 'Shoes' },
    { slot: 'accessory', label: 'Accessory' },
    { slot: 'accessory', label: 'Accessory' },
];

export type RivalEquipSkillView = {
    skill: SkillDef;
    cond_string: string;
    eff_string: string;
    chance: number;
    triggers: string;
};

export type RivalEquipStatRow = {
    stat: BasicStats;
    base: number | null;
    multi: number | null;
};

export type RivalEquipDetail = {
    def: EquipDef;
    entry: RivalEquipEntry;
    stat_rows: RivalEquipStatRow[];
    skill_view: RivalEquipSkillView | null;
    budget_cost: number;
};

export type RivalBudgetInfo = { total: number; cap: number; used: number };

class RivalComparison {
    public selected_equip_idx: number | null = $state(null);

    public persona_name: string = $derived(
        RivalStatsM.preview(CPs.current_completed_checkpoint).persona.name
    );

    public persona_desc: string = $derived(
        RivalStatsM.preview(CPs.current_completed_checkpoint).persona.desc
    );

    public comparisons: StatComparison[] = $derived.by(() => {
        const rival = RivalStatsM.preview(CPs.current_completed_checkpoint).stats;
        return COMBAT_PAIRS.map(([playerKey, rivalKey, label]) => {
            const pv = stat_list[playerKey].final;
            const rv = rival[rivalKey] as number;
            const ratio = pv / rv;
            const clamped = Math.max(0, Math.min(1, ratio / 2));
            const fmt = (v: number) => playerKey === 'Fans' || playerKey === 'Moni' ? Math.floor(v).toString() : v.toFixed(1);
            return {
                label,
                clamped,
                color: `background-color: hsl(${clamped * 120}, 100%, 50%)`,
                playerValue: fmt(pv),
                rivalValue: fmt(rv),
                rivalLabel: rivalKey === 'Max_Stamina' ? 'Stamina' : rivalKey,
            };
        });
    });

    public rival_equipment: RivalEquipSlot[] = $derived.by(() => {
        const loadout = RivalStatsM.preview(CPs.current_completed_checkpoint).equipment;
        // Group resolved entries by slot so accessory cards fill left-to-right
        // and unfilled slots render as deterministic placeholders.
        const by_slot: Record<EquipSlot, RivalEquipFilled[]> = {
            hat: [], top: [], bottom: [], shoes: [], accessory: [],
        };
        loadout.forEach((entry, idx) => {
            const def = EQUIP_REGISTRY.get(entry.equip_id);
            if (!def) return;
            const skill_name = resolve_equip(def, entry.rarity).skill?.name ?? null;
            by_slot[def.slot].push({ slot_label: '', filled: true, idx, entry, def, skill_name });
        });
        return DISPLAY_SLOTS.map(({ slot, label }) => {
            const next = by_slot[slot].shift();
            if (next) return { ...next, slot_label: label };
            return { slot_label: label, filled: false };
        });
    });

    public avg_clamped: number = $derived.by(
        () => this.comparisons.reduce((s, c) => s + c.clamped, 0) / this.comparisons.length
    );

    public selected_equip_detail: RivalEquipDetail | null = $derived.by(() => {
        const idx = this.selected_equip_idx;
        if (idx === null) return null;
        const loadout = RivalStatsM.preview(CPs.current_completed_checkpoint).equipment;
        const entry = loadout[idx];
        if (!entry) return null;
        const def = EQUIP_REGISTRY.get(entry.equip_id);
        if (!def) return null;
        const resolved = resolve_equip(def, entry.rarity);
        const by_stat = new Map<BasicStats, RivalEquipStatRow>();
        for (const b of resolved.stat_bonuses) {
            let row = by_stat.get(b.stat);
            if (!row) {
                row = { stat: b.stat, base: null, multi: null };
                by_stat.set(b.stat, row);
            }
            row[b.target] = effective_bonus(b, entry.level, resolved.stat_mult);
        }
        const stat_rows: RivalEquipStatRow[] = Array.from(by_stat.values());
        let skill_view: RivalEquipSkillView | null = null;
        if (resolved.skill) {
            const values = resolved.skill.values ?? {};
            skill_view = {
                skill: resolved.skill,
                cond_string: render_skill_string(resolved.skill.cond_string, values, 'rival'),
                eff_string: render_skill_string(resolved.skill.eff_string, values, 'rival'),
                chance: resolved.skill.chance,
                triggers: resolved.skill.triggers.join(', '),
            };
        }
        return { def, entry, stat_rows, skill_view, budget_cost: equip_cost(entry.rarity, entry.level) };
    });

    public budget_info: RivalBudgetInfo = $derived.by(() => {
        const cp = CPs.current_completed_checkpoint;
        const total = CHECKPOINTS[cp]?.rival?.equip_budget ?? 0;
        const preview = RivalStatsM.preview(cp);
        const used = preview.equipment.reduce((s, e) => s + equip_cost(e.rarity, e.level), 0);
        return { total, cap: preview.budget_cap, used };
    });

    public condition_text: string = $derived.by(() => {
        const avg = this.avg_clamped;
        if (avg >= 0.9) return "Looks like Rival doesn't stand a chance!";
        if (avg >= 0.6) return "You've got a solid shot at winning!";
        if (avg >= 0.4) return "It's anyone's game!";
        if (avg >= 0.25) return "Come on, you know you need just a little more training!";
        return "You're no match for Rival... are you even serious about being an Idol?";
    });

    constructor() {
        // Reset selection when the rival changes (checkpoint advance).
        $effect.root(() => {
            $effect(() => {
                void CPs.current_completed_checkpoint;
                void RivalStatsM.preview(CPs.current_completed_checkpoint);
                this.selected_equip_idx = null;
            });
        });
    }

    select_equip(idx: number): void {
        this.selected_equip_idx = this.selected_equip_idx === idx ? null : idx;
    }
}

export const LiveInfo = new RivalComparison();
