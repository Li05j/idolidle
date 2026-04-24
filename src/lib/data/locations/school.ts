import { history } from '$lib/state/history.svelte';
import { stat_list } from '$lib/state/stats.svelte';
import { truncate_to_decimal } from '$lib/utils/utils';
import { simple_flat_stat_reward, simple_percent_stat_reward, uniform_rand_stat_flat_reward } from '$lib/utils/reward_helpers';
import type { ActionDef, LocationDef } from './location_definition';
import { gym } from './gym';
import { maid_cafe } from './maid_cafe';
import { old_theatre } from './old_theatre';

const IDOL_CLUB_COST = { fans: 100, moni: 500 };
const IDOL_CLUB_CONCERT_COST = 150;

function extra_grade_report() {
    let [stat_name, actual_gain] = uniform_rand_stat_flat_reward('base', 5, 10);
    history.addSystemLog(`Eureka! The Grade Report has enlightened you. +${actual_gain} ${stat_name}!`);
}

function extra_attend_class() {
    let a = Math.random();
    let b = Math.random();
    let c = Math.random();
    let d = Math.random();
    let gain = 1.2;
    if (a < 0.5) {
        stat_list.Sing.base += gain;
        history.addSystemLog(`Eureka! You gained +${truncate_to_decimal(gain * stat_list.Sing.multi)} Sing!`);
    }
    if (b < 0.5) {
        stat_list.Dance.base += gain;
        history.addSystemLog(`Eureka! You gained +${truncate_to_decimal(gain * stat_list.Dance.multi)} Dance!`);
    }
    if (c < 0.5) {
        stat_list.Charm.base += gain;
        history.addSystemLog(`Eureka! You gained +${truncate_to_decimal(gain * stat_list.Charm.multi)} Charm!`);
    }
    if (d < 0.5) {
        stat_list.Presence.base += gain;
        history.addSystemLog(`Eureka! You gained +${truncate_to_decimal(gain * stat_list.Presence.multi)} Presence!`);
    }
}

function extra_yell_on_wooden_box() {
    let [is_success, value] = simple_flat_stat_reward("Fans", "base", "Tiny", 4);
    if (is_success) {
        history.addSystemLog(`Eureka! You attracted ${value} student(s) to be fans! +${value} Fans!`);
    }
}

function extra_hallway_flash_mob() {
    let [is_success, value] = simple_flat_stat_reward("Fans", "base", "Tiny", 5);
    if (is_success) {
        history.addSystemLog(`Eureka! You attracted ${value} student(s) to be fans! +${value} Fans!`);
    }
}

function extra_host_school_concert() {
    let [is_success, value] = simple_percent_stat_reward("Fans", "base", "Tiny", 0.05);
    if (is_success) {
        history.addSystemLog(`Eureka! The concert was a BIG SUCCESS! +${value} Fans!`);
    }
}

function extra_club_promoter() {
    let [is_success, value] = simple_flat_stat_reward("Fans", "multi", "Tiny", 0.01);
    if (is_success) {
        history.addSystemLog(`Eureka! You sparked interest among students! +${value} Fans multi!`);
    }
}

const open_idol_club: ActionDef = {
    name: 'Open Idol Club',
    kind: 'spending',
    base_time: 30,
    no_drops: true,
    desc: "On your way to become the ultimate school idol. One step closer to becoming the star you've always dreamed of.",
    rewards: [
        { which_stat: "Fans", target: 'base', amount: 25 },
    ],
    costs: [{ stat: "Moni", amount: IDOL_CLUB_COST.moni }],
    uses: 1,
    requires: {
        text: `Fans ≥ ${IDOL_CLUB_COST.fans}, Moni ≥ ${IDOL_CLUB_COST.moni}`,
        is_met: () => stat_list.Fans.final >= IDOL_CLUB_COST.fans && stat_list.Moni.final >= IDOL_CLUB_COST.moni,
    },
    on_complete: {
        fn: () => {},
        desc: "Unlocks more options in School. School Equipment drop rate increased",
    },
};

const SCHOOL_DROP_TABLE = [
    { equip_id: 'reading_glasses', weight: 2 },
    { equip_id: 'stage_microphone', weight: 1 },
    { equip_id: 'lozenges', weight: 1 },
];

const collect_grade_report: ActionDef = {
    name: 'Collect Grade Report',
    kind: 'training',
    base_time: 10,
    no_drops: true,
    desc: "Somehow you didn't bother to take your Grade Report from last year back home... How clumsy of you. Better collect it now.",
    rewards: [],
    uses: 1,
    on_complete: {
        fn: extra_grade_report,
        desc: "Randomly increase a stat by a small amount",
    },
};

const attend_class: ActionDef = {
    name: 'Attend Class',
    kind: 'training',
    base_time: 60,
    desc: "You still gotta study alright; elite idol and elite student? That's the spirit.",
    rewards: [
        { which_stat: "Sing", target: 'base', amount: 1.2 },
        { which_stat: "Dance", target: 'base', amount: 1.2 },
        { which_stat: "Charm", target: 'base', amount: 1.2 },
        { which_stat: "Presence", target: 'base', amount: 1.2 },
    ],
    on_complete: {
        fn: extra_attend_class,
        desc: "Good chance to double stat gains",
    },
};

const yell_on_wooden_box: ActionDef = {
    name: 'Yell on Wooden Box',
    kind: 'training',
    base_time: 20,
    desc: "You know when those anime girls standing near the school gate after school to try and advertise their idol activities? Yeah, that's you now.",
    rewards: [
        { which_stat: "Fans", target: 'base', amount: 2 },
    ],
    on_complete: {
        fn: extra_yell_on_wooden_box,
        desc: "Tiny chance to gain 4 Fans",
    },
};

const hallway_flash_mob: ActionDef = {
    name: 'Hallway Flash Mob',
    kind: 'training',
    base_time: 20,
    desc: "Your school doesn't seem to understand your value to provide you with a suitable stage. But as an serious Idol, anywhere is your stage to shine in!",
    rewards: [
        { which_stat: "Dance", target: 'base', amount: 1.0 },
        { which_stat: "Presence", target: 'base', amount: 1.0 },
    ],
    on_complete: {
        fn: extra_hallway_flash_mob,
        desc: "Tiny chance to gain 5 Fans",
    },
};

const climbing_the_stairs: ActionDef = {
    name: 'Climbing the Stairs',
    kind: 'training',
    base_time: 6,
    desc: "No, no, not metaphorically; physically - you are physically running up and down the stairs like a silly goose. But hey, this does make you fitter, probably.",
    rewards: [
        { which_stat: "Stamina", target: 'base', amount: 0.4 },
        { which_stat: "Presence", target: 'base', amount: 0.2 },
    ],
};

const host_school_concert: ActionDef = {
    name: 'Host School Concert',
    kind: 'spending',
    base_time: 45,
    desc: "Finally, a real stage. The lighting, the music, the fans...! Is this what it feels like to be in the spotlight? The tickets are free though.",
    rewards: [
        {
            which_stat: "Fans",
            target: 'base',
            amount: 25,
            scaling: {
                sources: [
                    { which_stat: "Sing", effectiveness: 2.5 },
                    { which_stat: "Dance", effectiveness: 2.5 },
                ],
            },
        },
        { which_stat: "Fans", target: 'multi', amount: 0.01 },
    ],
    costs: [{ stat: "Moni", amount: IDOL_CLUB_CONCERT_COST }],
    requires: {
        text: `Moni ≥ ${IDOL_CLUB_CONCERT_COST}`,
        is_met: () => stat_list.Moni.final >= IDOL_CLUB_CONCERT_COST,
    },
    equip_drops: {
        chance: 1,
        table: [
            { equip_id: 'stage_microphone', weight: 1 },
        ],
    },
    on_complete: {
        fn: extra_host_school_concert,
        desc: "Tiny chance for Big Success",
    },
};

const sell_merch: ActionDef = {
    name: 'Sell Merch',
    kind: 'earning',
    base_time: 25,
    desc: "Overpriced? Scam? What do you mean? It's them who chose to spend the Moni...",
    rewards: [{
        which_stat: "Moni",
        target: 'base',
        amount: 5,
        scaling: {
            sources: [{ which_stat: "Presence", effectiveness: 2.75 }],
        },
    }],
};

const club_promoter: ActionDef = {
    name: 'Club Promoter',
    kind: 'training',
    base_time: 30,
    desc: "Idol isn't all about performing on stage, getting your name out there is also important. But people will only notice you if you are actually good...",
    rewards: [{ which_stat: "Presence", target: 'base', amount: 3.0 }],
    on_complete: {
        fn: extra_club_promoter,
        desc: "Tiny chance to gain 0.01 Fans multi",
    },
};

const school_plus: LocationDef = {
    name: 'School',
    base_time: 80,
    desc: "A place for learning, daydreaming, and maybe scribbling lyrics in your notebook. Idol stories always seem to start with being a student.",
    rewards: [
        { which_stat: "Stamina", target: 'base', amount: 4 },
    ],
    equip_drops: {
        chance: 0.08,
        table: SCHOOL_DROP_TABLE,
    },
    unlocks: () => [old_theatre, gym, maid_cafe],
    actions: [
        host_school_concert,
        collect_grade_report,
        attend_class,
        yell_on_wooden_box,
        hallway_flash_mob,
        climbing_the_stairs,
        sell_merch,
        club_promoter,
    ],
};

export const school: LocationDef = {
    name: 'School',
    base_time: 80,
    desc: "A place for learning, daydreaming, and maybe scribbling lyrics in your notebook. Idol stories always seem to start with being a student.",
    rewards: [
        { which_stat: "Stamina", target: 'base', amount: 4 },
    ],
    equip_drops: {
        chance: 0.05,
        table: SCHOOL_DROP_TABLE,
    },
    unlocks: () => [old_theatre, gym, maid_cafe],
    actions: [
        open_idol_club,
        collect_grade_report,
        attend_class,
        yell_on_wooden_box,
        hallway_flash_mob,
        climbing_the_stairs,
    ],
    upgrades: [
        {
            trigger: 'Open Idol Club',
            upgrade_to: school_plus,
            on_trigger: () => {
                history.addSystemLog('You have unlocked some club activities under School, go check them out!');
            },
        },
    ],
};
