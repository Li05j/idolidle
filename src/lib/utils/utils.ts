import type { StatEffectPair, Rewards, BasicStats, TrainingEfficiency } from '$lib/types'
import { stat_list } from "$lib/state/stats.svelte";
import type { ActionDef, LocationDef } from '$lib/data/locations/location_definition';
import { CFG } from '$lib/config';
import { roll_equip_drop } from '$lib/utils/equip_drop';
import type { EquipDropTable } from '$lib/data/equipment/equipment_definition';

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

export function reward_string(rewards: Rewards[]): string {
    let ret_str = ""
    rewards.forEach(r => {
        let temp = ``
        let depends_gain = 0;
        let fixed_at = DECIMAL_PLACES;
        if (r.which_stat === 'Fans' || r.which_stat === 'Moni') fixed_at = 0;

        if (r.depends && r.efficiency) {
            depends_gain = find_training_eff_from_str(r.efficiency)(calc_stat_effectiveness(r.depends))
        }
        if (r.flat_gain_base) {
            let summed_flat_gain = r.flat_gain_base + depends_gain
            let multi = stat_list[r.which_stat].multi
            temp += ` +${(summed_flat_gain * multi).toFixed(fixed_at)} ${r.which_stat}`;
        }
        else if (r.flat_gain_multi) {
            temp += ` +${(r.flat_gain_multi + depends_gain).toFixed(2)} ${r.which_stat} Multi`;
        }
        ret_str += temp;
    })

    return ret_str
}

export function handle_rewards(rewards: Rewards[]): void {
    rewards.forEach(r => {
        let s = stat_list[r.which_stat];
        let depends_gain = 0;
        if (r.depends && r.efficiency) {
            depends_gain = find_training_eff_from_str(r.efficiency)(calc_stat_effectiveness(r.depends))
        }
        if (r.flat_gain_base) {
            s.base += r.flat_gain_base;
            s.base += depends_gain;
        }
        else if (r.flat_gain_multi) {
            s.multi += r.flat_gain_multi;
            s.multi += depends_gain;
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

export function executeAction(def: ActionDef, log: (name: string, text: string) => void, location_drops?: EquipDropTable): void {
    if (def.costs) {
        def.costs.forEach(c => {
            stat_list[c.stat].add_base_from_final(-c.amount);
        });
    }

    handle_rewards(def.rewards);
    log(def.name, actionRewardText(def));
    if (!def.no_drops) roll_equip_drop(def.equip_drops ?? location_drops);
    def.on_complete?.fn();
}

function deriveDependsOn(def: ActionDef): string | null {
    const deps = def.rewards
        .filter(r => r.depends?.length)
        .map(r => {
            const sources = r.depends!.map(d => d.which_stat).join(', ');
            return `${sources} ➤ ${r.which_stat}`;
        });
    return deps.length ? deps.join('. ') : null;
}

export function tooltipString(def: ActionDef | LocationDef, is_disabled: boolean, mastery_completions?: number): string {
    if ('hint' in def && def.hint && !('kind' in def)) {
        return "💡" + def.hint;
    }

    let ret_str = '';
    if (def.requires) {
        if (is_disabled) ret_str += `[red]**!! Prereq: ${def.requires.text}.**[/red]\n`
        else ret_str += `Prereq: ${def.requires.text}.\n`
    }

    if ('kind' in def) {
        const depends = deriveDependsOn(def);
        if (depends) {
            ret_str += `Depends: ${depends}.\n`
        }
        if (def.on_complete?.hint) {
            ret_str += `[blue]⭐ ${def.on_complete.hint}.[/blue]\n`
        }
        if (mastery_completions !== undefined && mastery_completions > 0) {
            const factor = Math.min(1, 1 / (1 + CFG.mastery_rate * Math.sqrt(mastery_completions)) + CFG.mastery_offset);
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

function find_training_eff_from_str(s: TrainingEfficiency) {
    switch (s) {
        case "v_slow"       : return training_v_slow;
        case "slow"         : return training_slow;
        case "mid"          : return training_mid;
        case "fast"         : return training_fast;
        case "v_fast"       : return training_v_fast;
        default             : return identity;
    }
}

function training_v_slow(v: number) {
    return Math.max(Math.floor(Math.pow(v, 0.4)), 1)
}

function training_slow(v: number) {
    return Math.max(Math.floor(Math.pow(v, 0.53)), 1)
}

function training_mid(v: number) {
    return Math.max(Math.floor(Math.pow(v, 0.66)), 1)
}

function training_fast(v: number) {
    return Math.max(Math.floor(Math.pow(v, 0.79)), 1)
}

function training_v_fast(v: number) {
    return Math.max(Math.floor(Math.pow(v, 0.92)), 1)
}

function identity(i: any) {
    return i;
}