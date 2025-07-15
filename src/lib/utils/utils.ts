import type { StatEffectPair, Rewards, BasicStats, TrainingEfficiency } from '$lib/types'
import { fans, moni, sta, charm, pres, eloq, poise } from "$lib/stores/stats.svelte";

export const DECIMAL_PLACES = 1;

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

export function reward_string(rewards: Rewards[], stats = {fans, moni, sta, charm, pres, eloq, poise}): string {
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
            temp += ` +${(r.flat_gain_base + depends_gain).toFixed(fixed_at)} ${r.which_stat}`;
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
        let s = find_stat_from_str(r.which_stat);
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

export function find_stat_from_str(s: BasicStats) {
    switch (s) {
        case "Fans":        return fans;
        case "Moni":        return moni;
        case "Stamina":     return sta;
        case "Charm":       return charm;
        case "Presence":    return pres;
        case "Eloquence":   return eloq;
        case "Poise":       return poise;
        default:            return undefined;
    }
}

export function calc_stat_effectiveness(depends: StatEffectPair[]): number {
    let r_stat = 0;
    depends.forEach((d) => {
        let s = find_stat_from_str(d.which_stat);
        if (s) r_stat += s.final * d.effectiveness;
    })
    return r_stat
}

function find_training_eff_from_str(s: TrainingEfficiency) {
    switch (s) {
        case "slow" : return training_slow;
        case "mid"  : return training_mid;
        case "fast" : return training_fast;
        default     : return identity;
    }
}

function training_slow(v: number) {
    return Math.max(Math.floor(Math.pow(v, 0.5)), 1)
}

function training_mid(v: number) {
    return Math.max(Math.floor(Math.pow(v, 0.727)), 1)
}

function training_fast(v: number) {
    return Math.max(Math.floor(Math.pow(v, 0.9)), 1)
}

function identity(i: any) {
    return i;
}