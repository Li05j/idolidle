import { stat_list } from "$lib/state/stats.svelte";
import type { BasicStats } from "$lib/types";

type Chance = 'Tiny' | 'Slight' | 'Good' | 'Great'; // 0.1, 0.25, 0.5, 0.75

function map_chance_to_number(chance: Chance) {
    switch (chance) {
        case 'Tiny'     : return 0.1;
        case 'Slight'   : return 0.25;
        case 'Good'     : return 0.5;
        case 'Great'    : return 0.75;
    }
}

export function simple_flat_stat_reward(
    stat_name: BasicStats,
    which: 'base' | 'multi',
    chance: Chance,
    gain: number,
    range: number = 0,
): [boolean, string] {
    let r = Math.random();
    if (r < map_chance_to_number(chance)) {
        gain = Math.random() * range + gain;

        let stat = stat_list[stat_name];
        let actual_gain = '';
        if (which === 'multi') {
            actual_gain = gain.toString();
        } else if (which === 'base') {
            actual_gain = stat.format_final_gain(gain);
        }
        stat[which] += gain;
        return [true, actual_gain];
    }
    return [false, ''];
}

export function simple_percent_stat_reward(
    stat_name: BasicStats,
    which: 'base' | 'multi',
    chance: Chance,
    portion: number,
): [boolean, string] {
    let r = Math.random();
    if (r < map_chance_to_number(chance)) {
        let stat = stat_list[stat_name];
        let actual_gain = '';
        const gain = stat[which] * portion;
        stat[which] += gain;
        if (which === 'multi') {
            actual_gain = gain.toString();
        } else if (which === 'base') {
            actual_gain = stat.format_final_gain(gain);
        }
        return [true, actual_gain];
    }
    return [false, ''];
}

export function uniform_rand_stat_flat_reward(
    which: 'base' | 'multi',
    min: number,
    max: number,
): [BasicStats, string] {
    const stat_names: BasicStats[] = ['Stamina', 'Haste', 'Sing', 'Dance', 'Charm', 'Presence'];
    const r = Math.random();
    const index = Math.floor(r * stat_names.length);
    const stat_name = stat_names[index];
    const stat = stat_list[stat_name];

    const gain = Math.random() * (max - min) + min;
    let actual_gain = '';

    if (which === 'multi') {
        actual_gain = gain.toFixed();
    } else if (which === 'base') {
        actual_gain = stat.format_final_gain(gain);
    }

    stat[which] += gain;
    return [stat_name, actual_gain];
}
