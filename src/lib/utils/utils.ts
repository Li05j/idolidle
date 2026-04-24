import type { StatEffectPair, Reward } from '$lib/types'
import { stat_list } from "$lib/state/stats.svelte";
import type { ActionDef, LocationDef } from '$lib/data/locations/location_definition';
import { CFG } from '$lib/config';
import { Mastery } from '$lib/state/mastery.svelte';
import { roll_equip_drop } from '$lib/utils/equip_drop';
import type { EquipDropTable } from '$lib/data/equipment/equipment_definition';
import { RunTotals } from '$lib/state/run_totals.svelte';
import { getLocationHint } from '$lib/data/hints';

export const DECIMAL_PLACES = 1;

// convert ms to seconds in a string, formatted to always display digits decimal places.
export function msToSecF(ms: number, digits: number = DECIMAL_PLACES): string {
    return (ms / 1000).toFixed(digits)
}

// parse text into html with {@html parseText(text)}.
export function parseText(text: string) {
    return text
        .split('\n')
        .map(line => line
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/_([^_]+)_/g, '<em>$1</em>')
            .replace(/\[([a-zA-Z]+)\](.*?)\[\/\1\]/g, '<span style="color: $1">$2</span>')
        )
        .join('<br>');
    }

export function truncate_to_decimal(v: number, decimals: number = 1) {
    const d = Math.pow(10, decimals)
    return Math.floor(v * d) / d;
}

// Format a fraction as a percent string (0.15 → "15%").
export function fmt_pct(fraction: number, digits: number = 0): string {
    return `${(fraction * 100).toFixed(digits)}%`;
}

function scaled_bonus(r: Reward): number {
    if (!r.scaling) return 0;
    return apply_stat_scaling(calc_stat_effectiveness(r.scaling.sources));
}

export function reward_string(rewards: Reward[]): string {
    let ret_str = ""
    rewards.forEach(r => {
        const depends_gain = scaled_bonus(r);
        if (r.target === 'base') {
            let fixed_at = DECIMAL_PLACES;
            if (r.which_stat === 'Fans' || r.which_stat === 'Moni') fixed_at = 0;
            const summed_flat_gain = r.amount + depends_gain;
            const multi = stat_list[r.which_stat].multi;
            const v = summed_flat_gain * multi;
            ret_str += ` ${v >= 0 ? '+' : ''}${v.toFixed(fixed_at)} ${r.which_stat}`;
        } else {
            const v = r.amount + depends_gain;
            ret_str += ` ${v >= 0 ? '+' : ''}${v.toFixed(2)} ${r.which_stat} Multi`;
        }
    })

    return ret_str
}

export function handle_rewards(rewards: Reward[]): void {
    rewards.forEach(r => {
        let s = stat_list[r.which_stat];
        const flat = r.amount + scaled_bonus(r);
        s[r.target] += flat;
        // Track Moni/Fans earned-this-run in displayed (final) units, so rebirth
        // carryover doesn't punish the player for spending or losing them later.
        if (r.target === 'base' && (r.which_stat === 'Moni' || r.which_stat === 'Fans')) {
            RunTotals.add(r.which_stat, flat * (s.multi + s.equip_multi));
        }
    });
}

export function actionRewardText(def: ActionDef): string {
    let ret_str = '';
    if (def.costs) {
        def.costs.forEach(c => {
            ret_str += `-${c.amount} ${c.stat} `;
        });
    }
    return ret_str + reward_string(def.rewards);
}

export function executeAction(def: ActionDef, log: (name: string, text: string) => void, location_drops: EquipDropTable | undefined, duration_ms: number): void {
    if (def.costs) {
        def.costs.forEach(c => {
            stat_list[c.stat].add_base_from_final(-c.amount);
        });
    }

    handle_rewards(def.rewards);
    log(def.name, actionRewardText(def));
    if (!def.no_drops) roll_equip_drop(def.equip_drops ?? location_drops, duration_ms);
    def.on_complete?.fn();
}

function deriveDependsOn(def: ActionDef): string | null {
    const deps = def.rewards
        .filter(r => r.scaling?.sources.length)
        .map(r => {
            const sources = r.scaling!.sources.map(d => d.which_stat).join(', ');
            return `${sources} ➤ ${r.which_stat}`;
        });
    return deps.length ? deps.join('. ') : null;
}

export function tooltipString(def: ActionDef | LocationDef, is_disabled: boolean, mastery_completions?: number): string {
    let ret_str = '';
    if (def.requires) {
        if (is_disabled) ret_str += `[red]**!! Prereq: ${def.requires.text}.**[/red]\n`
        else ret_str += `Prereq: ${def.requires.text}.\n`
    }

    if (!('kind' in def)) {
        const hint = getLocationHint(def.name);
        if (hint) ret_str += `💡${hint}\n`;
    }

    if ('kind' in def) {
        const depends = deriveDependsOn(def);
        if (depends) {
            ret_str += `Depends: ${depends}.\n`
        }
        if (def.on_complete?.desc) {
            ret_str += `[blue]⭐ ${def.on_complete.desc}.[/blue]\n`
        }
        if (mastery_completions !== undefined) {
            const factor = Mastery.factor_for_count(mastery_completions);
            const pct = ((1 - factor) * 100).toFixed(0);
            ret_str += `Mastery: ${mastery_completions}x done (−${pct}% time)\n`
        }
    }

    return ret_str;
}

export function calc_stat_effectiveness(depends: StatEffectPair[]): number {
    let r_stat = 0;
    depends.forEach((d) => {
        let s = stat_list[d.which_stat];
        let normalization_factor = 1;
        if (d.which_stat === 'Fans') normalization_factor = 2;
        if (d.which_stat === 'Stamina') normalization_factor = 3;

        r_stat += s.final * d.effectiveness / normalization_factor;
    })
    return r_stat
}

function apply_stat_scaling(v: number): number {
    if (v <= 0) return 0;
    return Math.pow(v, CFG.stat_scaling_exponent);
}