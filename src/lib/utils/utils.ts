import type { StatEffectPair, Rewards, BasicStats, TrainingEfficiency } from '$lib/types'
import { stat_list, dummy, stat_list_get } from "$lib/stores/stats.svelte";
import type { PrereqTooltip } from '$lib/data/todo_type';

export const DECIMAL_PLACES = 1;
export const S_TO_MS = 100

// export function toFixedNumber(num: number, digits: number = DECIMAL_PLACES, base: number = 10) {
//     const pow = Math.pow(base, digits);
//     return Math.round(num * pow) / pow;
// }

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
            let multi = stat_list_get(r.which_stat).multi
            temp += ` +${(summed_flat_gain * multi).toFixed(fixed_at)} ${r.which_stat}`;
        }
        else if (r.flat_gain_multi) {
            temp += ` +${(r.flat_gain_multi + depends_gain).toFixed(fixed_at)} ${r.which_stat} Multi`;
        }
        ret_str += temp;
    })

    return ret_str
}

export function handle_rewards(rewards: Rewards[]): void {
    rewards.forEach(r => {
        let s = stat_list_get(r.which_stat);
        if (s) {
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
        }
    });
}

export function tooltip_string(tooltip: PrereqTooltip, is_disabled: boolean,): string {
    if ('custom_msg' in tooltip) {
        return "💡" + tooltip.custom_msg;
    }

    let ret_str = '';
    if ('prereq' in tooltip) {
        const prereq = tooltip.prereq;
        if (prereq) {
            if (is_disabled) ret_str += `[red]**!! Prereq: ${prereq}.**[/red]\n`
            else ret_str += `Prereq: ${prereq}.\n`
        }
    }
    if ('dependsOn' in tooltip) {
        const depends_on = tooltip.dependsOn;
        if (depends_on) {
            ret_str += `Depends: ${depends_on}.\n`
        }
    }
    if ('eureka' in tooltip) {
        const eureka = tooltip.eureka;
        if (eureka) {
            ret_str += `[blue]⭐ ${eureka}.[/blue]\n`
        }
    }
    return ret_str;
}

export function calc_stat_effectiveness(depends: StatEffectPair[]): number {
    let r_stat = 0;
    depends.forEach((d) => {
        let s = stat_list_get(d.which_stat);
        let normalization_factor = 1;
        if (d.which_stat === 'Fans') normalization_factor = 2;
        if (d.which_stat === 'Stamina') normalization_factor = 3;

        if (s) r_stat += s.final * d.effectiveness / normalization_factor;
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