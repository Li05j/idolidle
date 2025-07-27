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
    gain: number
): [boolean, number] {
    let r = Math.random();
    if (r < map_chance_to_number(chance)) {
        let stat = stat_list_get(stat_name);
        let decimal = (stat_name === 'Fans' || stat_name === 'Moni') ? 0 : 1;
        let actual_gain = 0;
        if (which === 'multi') {
            actual_gain = gain
        } else if (which === 'base') {
            actual_gain = truncate_to_decimal(gain * stat.multi, decimal);
        }
        stat[which] += actual_gain
        return [true, actual_gain]
    }
    return [false, 0]
}

function simple_percent_stat_reward (
    stat_name: BasicStats, 
    which: 'base' | 'multi', 
    chance: Chance, 
    portion: number
): [boolean, number] {
    let r = Math.random();
    if (r < map_chance_to_number(chance)) {
        let stat = stat_list_get(stat_name);
        let actual_gain = 0;
        let decimal = (stat_name === 'Fans' || stat_name === 'Moni') ? 0 : 1;
        if (which === 'multi') {
            decimal = 2
        }
        actual_gain = truncate_to_decimal(portion * stat[which], decimal);
        stat[which] += actual_gain
        return [true, actual_gain]
    }
    return [false, 0]
}

function uniform_random_flat_stat_reward(min: number, max: number,): [BasicStats, number] {
    let stat = Math.random();
    let stat_name: BasicStats = 'Dummy'
    let gain = Math.random() * (max - min) + min;
    let actual_gain = 0;
    if (stat < 1/6) {
        stat_name = 'Stamina';
        actual_gain = truncate_to_decimal(gain * stat_list.Stamina.multi)
        stat_list.Stamina.base += gain
    } else if (stat < 1/3) {
        stat_name = 'Haste'
        actual_gain = truncate_to_decimal(gain * stat_list.Haste.multi)
        stat_list.Haste.base += gain
    } else if (stat < 1/2) {
        stat_name = 'Sing'
        actual_gain = truncate_to_decimal(gain * stat_list.Sing.multi)
        stat_list.Sing.base += gain
    } else if (stat < 2/3) {
        stat_name = 'Dance'
        actual_gain = truncate_to_decimal(gain * stat_list.Dance.multi)
        stat_list.Dance.base += gain
    } else if (stat < 5/6) {
        stat_name = 'Charm'
        actual_gain = truncate_to_decimal(gain * stat_list.Charm.multi)
        stat_list.Charm.base += gain
    } else if (stat <= 1) {
        stat_name = 'Presence'
        actual_gain = truncate_to_decimal(gain * stat_list.Presence.multi)
        stat_list.Presence.base += gain
    }
    return [stat_name, actual_gain]
}

export function extra_play_with_kids() {
    let [is_success, actual_gain] = simple_flat_stat_reward('Fans', 'base', 'Slight', 1)
    if (is_success) {
        history.addEurekaLogs(`+${actual_gain} Fans`, `You converted ${actual_gain} kid(s) into fans!`)
    }
}

export function extra_grade_report() {
    let [stat_name, actual_gain] = uniform_random_flat_stat_reward(5, 5);
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
    let [is_success, value] = simple_flat_stat_reward("Fans", "base", "Tiny", 3)
    if (is_success) {
        history.addEurekaLogs(`+${value} Fans`, `You attracted ${value} student(s) to be fans!`);
    }
}

export function extra_hallway_flash_mob() {
    let [is_success, value] = simple_flat_stat_reward("Fans", "base", "Tiny", 3)
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

export function then_open_idol_club() {
    Game_Progress.progress_handler.school_idol_club();
    history.addHintLogs('You have unlocked some club activities under School, go check them out!')
}

export function then_grade_report() {
    Game_Progress.progress_handler.grade_report();
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
