import { history } from '$lib/state/history.svelte';
import { stat_list } from '$lib/state/stats.svelte';
import { simple_flat_stat_reward } from '$lib/utils/reward_helpers';
import type { LocationDefinition } from './location_definition';

const GYM_VIP_COST = 500;
const GYM_ACTION_COST = 5;

function extra_bench_press() {
    let [is_success, value] = simple_flat_stat_reward("Stamina", "multi", "Slight", 0.01);
    if (is_success) {
        history.addEurekaLogs(`+${value} Stamina multi`, 'An unexpected breakthrough!');
    }
}

function extra_assault_bike() {
    let [is_success, value] = simple_flat_stat_reward("Haste", "multi", "Slight", 0.01);
    if (is_success) {
        history.addEurekaLogs(`+${value} Haste multi`, 'An unexpected breakthrough!');
    }
}

export const gym: LocationDefinition = {
    location: {
        name: 'Gym',
        base_time: 70,
        desc: "Remember to wipe the equipment after using them, don't wanna end up being cancelled by some gym bros online. Talking about ways to end your Idol career...",
        tooltip: {
            custom_msg: "You cannot lower the time needed to complete Purple and Yellow cards. However, their rewards tend to be dynamic."
        },
        rewards: [
            { which_stat: "Stamina", flat_gain_base: 3.5 },
        ],
    },
    unlocks: [],
    actions: [
        {
            name: 'Purchase Gym VIP',
            type: 'spend_currency',
            base_time: 10,
            desc: "With just a 1 time fee, you no longer need to pay to use the Gym. What a deal!",
            tooltip: {
                prereq: `Moni ≥ ${GYM_VIP_COST}`,
                eureka: "Void all training costs in Gym. Trainings will also be slightly more efficient."
            },
            rewards: [],
            spendings: [{ stat_name: "Moni", value: GYM_VIP_COST }],
            one_off: true,
            check_disabled_fn: () => stat_list.Moni.final < GYM_VIP_COST,
        },
        {
            name: 'Bench Press',
            type: 'spend_currency',
            base_time: 20,
            desc: "Is this the Idol meta nowadays?",
            tooltip: { prereq: `Moni ≥ ${GYM_ACTION_COST}` },
            rewards: [{ which_stat: "Stamina", flat_gain_base: 3 }],
            spendings: [{ stat_name: "Moni", value: GYM_ACTION_COST }],
            check_disabled_fn: () => stat_list.Moni.final < GYM_ACTION_COST,
        },
        {
            name: 'Assault Bike',
            type: 'spend_currency',
            base_time: 20,
            desc: "You are not actually assulting a bike are you.",
            tooltip: { prereq: `Moni ≥ ${GYM_ACTION_COST}` },
            rewards: [{ which_stat: "Haste", flat_gain_base: 3 }],
            spendings: [{ stat_name: "Moni", value: GYM_ACTION_COST }],
            check_disabled_fn: () => stat_list.Moni.final < GYM_ACTION_COST,
        },
        {
            name: 'Treadmill',
            type: 'spend_currency',
            base_time: 20,
            desc: "\"...Why do I have to pay to run?\"",
            tooltip: { prereq: `Moni ≥ ${GYM_ACTION_COST}` },
            rewards: [
                { which_stat: "Stamina", flat_gain_base: 1.5 },
                { which_stat: "Haste", flat_gain_base: 1.5 },
            ],
            spendings: [{ stat_name: "Moni", value: GYM_ACTION_COST }],
            check_disabled_fn: () => stat_list.Moni.final < GYM_ACTION_COST,
        },
    ],
    upgrades: [
        {
            trigger_action: 'Purchase Gym VIP',
            remove_actions: ['Treadmill', 'Bench Press', 'Assault Bike'],
            add_actions: [
                {
                    name: 'Bench Press',
                    type: 'action',
                    base_time: 20,
                    desc: "Muscles? Chest? Triceps? Being an Idol nowadays sure is tough. Hey, at least it's free now.",
                    tooltip: { eureka: "Slight chance to gain 0.01 Stamina multi" },
                    rewards: [{ which_stat: "Stamina", flat_gain_base: 3.0 }],
                    extra_reward_fn: extra_bench_press,
                },
                {
                    name: 'Assault Bike',
                    type: 'action',
                    base_time: 20,
                    desc: "Biking.",
                    tooltip: { eureka: "Slight chance to gain 0.01 Haste multi" },
                    rewards: [{ which_stat: "Haste", flat_gain_base: 3.0 }],
                    extra_reward_fn: extra_assault_bike,
                },
                {
                    name: 'Treadmill',
                    type: 'action',
                    base_time: 20,
                    desc: "Running.",
                    tooltip: {},
                    rewards: [
                        { which_stat: "Stamina", flat_gain_base: 2 },
                        { which_stat: "Haste", flat_gain_base: 2 },
                    ],
                },
            ],
            on_trigger: () => {
                history.addHintLogs('You are now a VIP member of the Gym! All equipment costs are voided.');
            },
        },
    ],
};
