import { stat_list } from "$lib/state/stats.svelte";
import { CPs } from "$lib/state/checkpoints.svelte";
import { RivalStatsM } from "$lib/runtime/live_rival_stats.svelte";
import type { LiveBattleStats } from "$lib/types";
import { EQUIP_REGISTRY } from "$lib/data/equipment";
import {
    effective_bonus,
    resolve_equip,
    resolve_skill_string,
    type EquipDef,
    type EquipSkillDef,
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

const SLOT_SORT: Record<EquipSlot, number> = { hat: 0, top: 1, bottom: 2, shoes: 3, accessory: 4 };

export type StatComparison = { label: string; clamped: number; color: string; playerValue: string; rivalValue: string; rivalLabel: string };

export type RivalEquipDisplay = {
    idx: number;
    entry: RivalEquipEntry;
    def: EquipDef;
    skill_name: string | null;
};

export type RivalEquipSkillView = {
    skill: EquipSkillDef;
    cond_string: string;
    eff_string: string;
    chance: number;
    triggers: string;
};

export type RivalEquipEffectiveBonus = {
    stat: BasicStats;
    target: 'base' | 'multi';
    value: number;
};

export type RivalEquipDetail = {
    def: EquipDef;
    entry: RivalEquipEntry;
    effective_bonuses: RivalEquipEffectiveBonus[];
    skill_view: RivalEquipSkillView | null;
};

class RivalComparison {
    public selected_equip_idx: number | null = $state(null);

    public persona_name: string = $derived(
        RivalStatsM.preview(CPs.current_completed_checkpoint).persona.name
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

    public rival_equipment: RivalEquipDisplay[] = $derived.by(() => {
        const loadout = RivalStatsM.preview(CPs.current_completed_checkpoint).equipment;
        const items: RivalEquipDisplay[] = [];
        loadout.forEach((entry, idx) => {
            const def = EQUIP_REGISTRY.get(entry.equip_id);
            if (!def) return;
            const skill_name = resolve_equip(def, entry.rarity).skill?.name ?? null;
            items.push({ idx, entry, def, skill_name });
        });
        items.sort((a, b) => SLOT_SORT[a.def.slot] - SLOT_SORT[b.def.slot]);
        return items;
    });

    public selected_equip_detail: RivalEquipDetail | null = $derived.by(() => {
        const idx = this.selected_equip_idx;
        if (idx === null) return null;
        const loadout = RivalStatsM.preview(CPs.current_completed_checkpoint).equipment;
        const entry = loadout[idx];
        if (!entry) return null;
        const def = EQUIP_REGISTRY.get(entry.equip_id);
        if (!def) return null;
        const resolved = resolve_equip(def, entry.rarity);
        const effective_bonuses: RivalEquipEffectiveBonus[] = resolved.stat_bonuses.map((b) => ({
            stat: b.stat,
            target: b.target,
            value: effective_bonus(b, entry.level, resolved.stat_mult),
        }));
        let skill_view: RivalEquipSkillView | null = null;
        if (resolved.skill) {
            const values = resolved.skill.values ?? {};
            skill_view = {
                skill: resolved.skill,
                cond_string: resolve_skill_string(resolved.skill.cond_string, values),
                eff_string: resolve_skill_string(resolved.skill.eff_string, values),
                chance: resolved.skill.chance,
                triggers: resolved.skill.triggers.join(', '),
            };
        }
        return { def, entry, effective_bonuses, skill_view };
    });

    public condition_text: string = $derived.by(() => {
        const avg = this.comparisons.reduce((sum, c) => sum + c.clamped, 0) / this.comparisons.length;
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
