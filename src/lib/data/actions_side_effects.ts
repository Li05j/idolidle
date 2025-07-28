import { Game_Progress } from "$lib/stores/game_progress.svelte"
import { history } from "$lib/stores/history.svelte";
import { stat_list, stat_list_get } from "$lib/stores/stats.svelte";
import type { BasicStats } from "$lib/types";
import { truncate_to_decimal } from "$lib/utils/utils";
import { Cost } from "./cost_constants";

type Chance = 'Tiny' | 'Slight' | 'Good' | 'Great' // 0.1, 0.25, 0.5, 0.75

function map_chance_to_number(chance: Chance) {
    switch (chance) {
        case 'Tiny'     : return 0.1;
        case 'Slight'   : return 0.25;
        case 'Good'     : return 0.5;
        case 'Great'    : return 0.75;
    }
}

function simple_flat_stat_reward (
    stat_name: BasicStats, 
    which: 'base' | 'multi', 
    chance: Chance, 
    gain: number,
    range: number = 0,
): [boolean, string] {
    let r = Math.random();
    if (r < map_chance_to_number(chance)) {
        gain = Math.random() * range + gain

        let stat = stat_list_get(stat_name);
        let actual_gain = '';
        if (which === 'multi') {
            actual_gain = gain.toString()
        } else if (which === 'base') {
            actual_gain = stat.get_final_gain_str(gain)
        }
        stat[which] += gain;
        return [true, actual_gain]
    }
    return [false, '']
}

function simple_percent_stat_reward (
    stat_name: BasicStats, 
    which: 'base' | 'multi', 
    chance: Chance, 
    portion: number
): [boolean, string] {
    let r = Math.random();
    if (r < map_chance_to_number(chance)) {
        let stat = stat_list_get(stat_name);
        let actual_gain = '';
        const gain = stat[which] * portion;
        stat[which] += gain;
        if (which === 'multi') {
            actual_gain = gain.toString()
        } else if (which === 'base') {
            actual_gain = stat.get_final_gain_str(gain)
        }
        return [true, actual_gain]
    }
    return [false, '']
}

function uniform_rand_stat_flat_reward (
    which: 'base' | 'multi', 
    min: number, 
    max: number,
): [BasicStats, string] {
    const stat_names: BasicStats[] = ['Stamina', 'Haste', 'Sing', 'Dance', 'Charm', 'Presence'];
    const r = Math.random();
    const index = Math.floor(r * stat_names.length);
    const stat_name = stat_names[index];
    const stat = stat_list_get(stat_name)

    const gain = Math.random() * (max - min) + min;
    let actual_gain = '';

    if (which === 'multi') {
        actual_gain = gain.toFixed()
    } else if (which === 'base') {
        actual_gain = stat.get_final_gain_str(gain)
    }

    stat[which] += gain;
    return [stat_name, actual_gain]
}

export function extra_play_with_kids() {
    let [is_success, actual_gain] = simple_flat_stat_reward('Fans', 'base', 'Slight', 1)
    if (is_success) {
        history.addEurekaLogs(`+${actual_gain} Fans`, `You converted ${actual_gain} kid(s) into fans!`)
    }
}

export function extra_grade_report() {
    let [stat_name, actual_gain] = uniform_rand_stat_flat_reward('base', 5, 10);
    history.addEurekaLogs(`+${actual_gain} ${stat_name}`, `The Grade Report has enlightened you.`)
}

export function extra_attend_class() {
    let a = Math.random();
    let b = Math.random();
    let c = Math.random();
    let d = Math.random();
    let gain = 1.2;
    if (a < 0.5) {
        stat_list.Sing.base += gain
        history.addEurekaLogs(`+${truncate_to_decimal(gain * stat_list.Sing.multi)} Sing`)
    }
    if (b < 0.5) {
        stat_list.Dance.base += gain
        history.addEurekaLogs(`+${truncate_to_decimal(gain * stat_list.Dance.multi)} Dance`)
    }
    if (c < 0.5) {
        stat_list.Charm.base += gain
        history.addEurekaLogs(`+${truncate_to_decimal(gain * stat_list.Charm.multi)} Charm`)
    }
    if (d < 0.5) {
        stat_list.Presence.base += gain
        history.addEurekaLogs(`+${truncate_to_decimal(gain * stat_list.Presence.multi)} Presence`)
    }
}

export function extra_yell_on_wooden_box() {
    let [is_success, value] = simple_flat_stat_reward("Fans", "base", "Tiny", 5)
    if (is_success) {
        history.addEurekaLogs(`+${value} Fans`, `You attracted ${value} student(s) to be fans!`);
    }
}

export function extra_hallway_flash_mob() {
    let [is_success, value] = simple_flat_stat_reward("Fans", "base", "Tiny", 5)
    if (is_success) {
        history.addEurekaLogs(`+${value} Fans`, `You attracted ${value} student(s) to be fans!`);
    }
}

export function extra_host_school_concert() {
    let [is_success, value] = simple_percent_stat_reward("Fans", "base", "Tiny", 0.1)
    if (is_success) {
        history.addEurekaLogs(`+${value} Fans`, `The concert was a BIG SUCCESS!`);
    }
}

export function extra_club_promoter() {
    let [is_success, value] = simple_flat_stat_reward("Fans", "multi", "Tiny", 0.01)
    if (is_success) {
        history.addEurekaLogs(`+${value} Fans multi`, `You sparked interest among students!`);
    }
}

export function extra_mini_lottery() {
    const grade_thresholds = [0.05, 0.2, 0.5, 0.75, 1.0]; // 5%, 15%, 30%, 25%, 25%
    const grades = ['S', 'A', 'B', 'C', 'D'];
    let r = Math.random();
    const grade_index = grade_thresholds.findIndex(t => r <= t)
    const grade = grades[grade_index];

    // Lottery will draw 2 of each rank. S rank just draws from A 3 times instead.
    
    const stat_names: BasicStats[] = ['Fans', 'Moni', 'Stamina', 'Haste', 'Sing', 'Dance', 'Charm', 'Presence'];
    
    const loop = grade === 'S' ? 3 : 2;

    if (grade !== 'S') {
        history.addHintLogs(`You got some prizes!`);
    } else {
        history.addHintLogs(`...Is this the ultimate Idol luck!?!!?!`)
    }

    const grade_multiplier = [4, 4, 3, 2, 1]; // S, A, B, C, D

    for (let i = 0; i < loop; i++) {
        r = Math.random();
        let index = Math.floor(r * grades.length);
        const stat_name = stat_names[index];
        const stat = stat_list_get(stat_name)

        r = Math.random();
        const w = r <= 0.5 ? 'base' : 'multi';

        if (w === 'base') {
            const range = [10, 15]
            let gain = Math.random() * (range[1] - range[0]) + range[0];
            gain *= grade_multiplier[grade_index]
            stat.base += gain
            const actual_gain_str = stat.get_final_gain_str(gain)
            
            history.addHintLogs(`+${actual_gain_str} ${stat_name}!`)
        } else {
            const range = [0.01, 0.02]
            let gain = Math.random() * (range[1] - range[0]) + range[0];
            gain *= grade_multiplier[grade_index]
            stat.multi += gain
            
            history.addHintLogs(`+${gain.toFixed(2)} ${stat_name} multi!`)
        }
    }
}

export function extra_bench_press() {
    let [is_success, value] = simple_flat_stat_reward("Stamina", "multi", "Slight", 0.01)
    if (is_success) {
        history.addEurekaLogs(`+${value} Stamina multi`, 'An unexpected breakthrough!')
    }
}

export function extra_assault_bike() {
    let [is_success, value] = simple_flat_stat_reward("Haste", "multi", "Slight", 0.01)
    if (is_success) {
        history.addEurekaLogs(`+${value} Haste multi`, 'An unexpected breakthrough!')
    }
}

export function extra_moe_magic() {
    let [is_success, value] = simple_flat_stat_reward("Charm", "multi", "Tiny", 0.01)
    if (is_success) {
        history.addEurekaLogs(`+${value} Charm multi`, 'An unexpected breakthrough!')
    }
}

export function extra_maid_part_time() {
    let [is_success, value] = simple_flat_stat_reward("Fans", "base", "Good", 1, 5)
    if (is_success) {
        history.addEurekaLogs(`+${value} Fans`, `You converted ${value} Otaku(s) into fans!`)
    }
}

export function then_open_idol_club() {
    Game_Progress.progress_handler.school_idol_club();
    history.addHintLogs('You have unlocked some club activities under School, go check them out!')
}

export function then_grade_report() {
    Game_Progress.progress_handler.grade_report();
}

export function then_upgrade_living_room() {
    Game_Progress.progress_handler.upgrade_living_room();
    history.addHintLogs('Your Living Room upgraded to Living Room+, give it a check!')
}

export function then_mini_lottery() {
    Game_Progress.progress_handler.mini_lottery();
}

export function then_gym_vip() {
    Game_Progress.progress_handler.upgrade_gym();
    history.addHintLogs('You are now a VIP member of the Gym! All equipment costs are voided.')
}

export function then_maid_interview() {
    Game_Progress.progress_handler.maid_interview();
    history.addHintLogs('You are now a Maid!')
}

export function then_maid_hire() {
    Game_Progress.progress_handler.maid_hire();
    // history.addHintLogs('You are now a Maid!')
}

export function check_disabled_open_idol_club() {
    if (stat_list.Fans.final >= Cost.idol_club.fans && stat_list.Moni.final >= Cost.idol_club.moni) {
        return false;
    }
    return true;
}

export function check_disabled_host_school_concert() {
    if (stat_list.Moni.final >= Cost.idol_club_concert) {
        return false;
    }
    return true;
}

export function check_disabled_upgrade_living_room() {
    if (stat_list.Moni.final >= Cost.living_room_upgrade) {
        return false;
    }
    return true;
}

export function check_disabled_mini_lottery() {
    if (stat_list.Moni.final >= Cost.mini_lottery) {
        return false;
    }
    return true;
}

export function check_disabled_outfit() {
    if (stat_list.Moni.final >= Cost.outfit) {
        return false;
    }
    return true;
}

export function check_disabled_gym_upgrade() {
    if (stat_list.Moni.final >= Cost.gym_vip) {
        return false;
    }
    return true;
}

export function check_disabled_gym_actions() {
    if (stat_list.Moni.final >= Cost.gym_actions) {
        return false;
    }
    return true;
}

export function check_disabled_maid_interview() {
    if (stat_list.Fans.final >= Cost.maid_interview.fans && stat_list.Charm.final >= Cost.maid_interview.charm) {
        return false;
    }
    return true;
}
