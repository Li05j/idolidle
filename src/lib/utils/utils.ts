import type { StatEffectPair } from '$lib/types'
import { fans, moni, sta, charm, presence, eloq, poise } from "$lib/stores/stats.svelte";

export const DECIMAL_PLACES = 1;

// export function toFixedNumber(num: number, digits: number = DECIMAL_PLACES, base: number = 10) {
//     const pow = Math.pow(base, digits);
//     return Math.round(num * pow) / pow;
// }

// convert ms to seconds in a string, formatted to always display digits decimal places.
export function msToSecF(ms: number, digits: number = DECIMAL_PLACES): string {
    return (ms / 1000).toFixed(digits)
}

export function calc_stat_effectiveness(depends: StatEffectPair[]): number {
    let r_stat = 0;
    depends.forEach((d) => {
        switch (d.which_stat) {
            case "fans":
                r_stat += fans.final * d.effectiveness
                break
            case "sta":
                r_stat += sta.final * d.effectiveness
                break
            case "charm":
                r_stat += charm.final * d.effectiveness
                break
            case "presence":
                r_stat += presence.final * d.effectiveness
                break
            case "eloq":
                r_stat += eloq.final * d.effectiveness
                break
            case "poise":
                r_stat += poise.final * d.effectiveness
                break
        }
    })
    return r_stat
}

export function moni_making_slow(v: number) {
    return Math.max(Math.floor(Math.pow(v, 0.5)), 1)
}

export function moni_making_mid(v: number) {
    return Math.max(Math.floor(Math.pow(v, 0.727)), 1)
}

export function moni_making_fast(v: number) {
    return Math.max(Math.floor(Math.pow(v, 0.9)), 1)
}