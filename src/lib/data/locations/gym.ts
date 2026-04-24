import { history } from '$lib/state/history.svelte';
import { stat_list } from '$lib/state/stats.svelte';
import { simple_flat_stat_reward } from '$lib/utils/reward_helpers';
import type { ActionDef, LocationDef } from './location_definition';

const GYM_VIP_COST = 500;
const GYM_ACTION_COST = 5;

function extra_bench_press() {
    let [is_success, value] = simple_flat_stat_reward("Stamina", "multi", "Slight", 0.01);
    if (is_success) {
        history.addSystemLog(`Eureka! An unexpected breakthrough! +${value} Stamina multi!`);
    }
}

function extra_assault_bike() {
    let [is_success, value] = simple_flat_stat_reward("Haste", "multi", "Slight", 0.01);
    if (is_success) {
        history.addSystemLog(`Eureka! An unexpected breakthrough! +${value} Haste multi!`);
    }
}

function extra_treadmill() {
    const stat = Math.random() > 0.5 ? "Stamina" : "Haste";
    let [is_success, value] = simple_flat_stat_reward(stat, "base", "Slight", 1.0);
    if (is_success) {
        history.addSystemLog(`Eureka! An unexpected breakthrough! +${value} ${stat}!`);
    }
}

const purchase_gym_vip: ActionDef = {
    name: 'Purchase Gym VIP',
    kind: 'spending',
    base_time: 10,
    no_drops: true,
    desc: "With just a 1 time fee, you no longer need to pay to use the Gym. What a deal!",
    rewards: [],
    costs: [{ stat: "Moni", amount: GYM_VIP_COST }],
    uses: 1,
    requires: {
        text: `Moni ≥ ${GYM_VIP_COST}`,
        is_met: () => stat_list.Moni.final >= GYM_VIP_COST,
    },
    on_complete: {
        fn: () => {},
        desc: "Void all training costs in Gym. Gym Equipment drop rate increased. Trainings will also be slightly more efficient.",
    },
};

const bench_press: ActionDef = {
    name: 'Bench Press',
    kind: 'spending',
    base_time: 30,
    no_drops: true,
    desc: "Is this the Idol meta nowadays?",
    rewards: [{ which_stat: "Stamina", target: 'base', amount: 3.0 }],
    costs: [{ stat: "Moni", amount: GYM_ACTION_COST }],
    requires: {
        text: `Moni ≥ ${GYM_ACTION_COST}`,
        is_met: () => stat_list.Moni.final >= GYM_ACTION_COST,
    },
};

const assault_bike: ActionDef = {
    name: 'Assault Bike',
    kind: 'spending',
    base_time: 30,
    no_drops: true,
    desc: "You are not actually assulting a bike are you.",
    rewards: [{ which_stat: "Haste", target: 'base', amount: 3.0 }],
    costs: [{ stat: "Moni", amount: GYM_ACTION_COST }],
    requires: {
        text: `Moni ≥ ${GYM_ACTION_COST}`,
        is_met: () => stat_list.Moni.final >= GYM_ACTION_COST,
    },
};

const treadmill: ActionDef = {
    name: 'Treadmill',
    kind: 'spending',
    base_time: 30,
    no_drops: true,
    desc: "\"...Why do I have to pay to run?\"",
    rewards: [
        { which_stat: "Stamina", target: 'base', amount: 1.5 },
        { which_stat: "Haste", target: 'base', amount: 1.5 },
    ],
    costs: [{ stat: "Moni", amount: GYM_ACTION_COST }],
    requires: {
        text: `Moni ≥ ${GYM_ACTION_COST}`,
        is_met: () => stat_list.Moni.final >= GYM_ACTION_COST,
    },
};

const GYM_DROP_TABLE = [
    { equip_id: 'training_shorts', weight: 1 },
    { equip_id: 'vintage_sneakers', weight: 1 },
];

const bench_press_plus: ActionDef = {
    name: 'Bench Press',
    kind: 'training',
    base_time: 40,
    desc: "Muscles? Chest? Triceps? Being an Idol nowadays sure is tough. Hey, at least it's free now.",
    rewards: [{ which_stat: "Stamina", target: 'base', amount: 4.0 }],

    on_complete: {
        fn: extra_bench_press,
        desc: "Slight chance to gain 0.01 Stamina multi.",
    },
};

const assault_bike_plus: ActionDef = {
    name: 'Assault Bike',
    kind: 'training',
    base_time: 40,
    desc: "Biking.",
    rewards: [{ which_stat: "Haste", target: 'base', amount: 4.0 }],

    on_complete: {
        fn: extra_assault_bike,
        desc: "Slight chance to gain 0.01 Haste multi.",
    },
};

const treadmill_plus: ActionDef = {
    name: 'Treadmill',
    kind: 'training',
    base_time: 40,
    desc: "Running.",
    rewards: [
        { which_stat: "Stamina", target: 'base', amount: 2.0 },
        { which_stat: "Haste", target: 'base', amount: 2.0 },
    ],

    on_complete: {
        fn: extra_treadmill,
        desc: "Slight chance to gain 1 Stamina or Haste.",
    },
};

const gym_plus: LocationDef = {
    name: 'Gym',
    base_time: 70,
    desc: "Remember to wipe the equipment after using them, don't wanna end up being cancelled by some gym bros online. Talking about ways to end your Idol career...",
    rewards: [
        { which_stat: "Stamina", target: 'base', amount: 3.5 },
    ],
    equip_drops: {
        chance: 0.08,
        table: GYM_DROP_TABLE,
    },
    unlocks: () => [],
    actions: [
        bench_press_plus,
        assault_bike_plus,
        treadmill_plus,
    ],
};

export const gym: LocationDef = {
    name: 'Gym',
    base_time: 70,
    desc: "Remember to wipe the equipment after using them, don't wanna end up being cancelled by some gym bros online. Talking about ways to end your Idol career...",
    rewards: [
        { which_stat: "Stamina", target: 'base', amount: 3.5 },
    ],
    equip_drops: {
        chance: 0.05,
        table: GYM_DROP_TABLE,
    },
    unlocks: () => [],
    actions: [
        purchase_gym_vip,
        bench_press,
        assault_bike,
        treadmill,
    ],
    upgrades: [
        {
            trigger: 'Purchase Gym VIP',
            upgrade_to: gym_plus,
            on_trigger: () => {
                history.addSystemLog('You are now a VIP member of the Gym! All equipment costs are voided.');
            },
        },
    ],
};
