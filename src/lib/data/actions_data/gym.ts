import { TodoBase } from '$lib/data/todo_type';
import { S_TO_MS } from '$lib/utils/utils';
import { check_disabled_gym_actions, check_disabled_gym_upgrade, extra_assault_bike, extra_bench_press, then_gym_vip } from '../actions_side_effects';
import { Cost } from '../cost_constants';

export const a_gym: TodoBase[] = [
    new TodoBase({
        name: 'Purchase Gym VIP',
        type: 'spend_currency',
        base_time: 10 * S_TO_MS,
        desc: "With just a 1 time fee, you no longer need to pay to use the Gym. What a deal!",
        tooltip: { 
            prereq: `Moni ≥ ${Cost.gym_vip}`,
            eureka: "Void all training costs in Gym. Trainings will also be slightly more efficient." 
        },
        rewards:[],
        spendings: [{stat_name: "Moni", value: Cost.gym_vip},],
        one_off: true,
        then_fn: then_gym_vip,
        check_disabled_fn: check_disabled_gym_upgrade,
    }),
    new TodoBase({
        name: 'Bench Press',
        type: 'spend_currency',
        base_time: 20 * S_TO_MS,
        desc: "Is this the Idol meta nowadays?",
        tooltip: { prereq: `Moni ≥ ${Cost.gym_actions}`, },
        rewards: [{ which_stat: "Stamina", flat_gain_base: 3 },],
        spendings: [{stat_name: "Moni", value: Cost.gym_actions},],
        check_disabled_fn: check_disabled_gym_actions,
    }),
    new TodoBase({
        name: 'Assault Bike',
        type: 'spend_currency',
        base_time: 20 * S_TO_MS,
        desc: "You are not actually assulting a bike are you.",
        tooltip: { prereq: `Moni ≥ ${Cost.gym_actions}`, },
        rewards:[{ which_stat: "Haste", flat_gain_base: 3 },],
        spendings: [{stat_name: "Moni", value: Cost.gym_actions},],
        check_disabled_fn: check_disabled_gym_actions,
    }),
    new TodoBase({
        name: 'Treadmill',
        type: 'spend_currency',
        base_time: 20 * S_TO_MS,
        desc: "\"...Why do I have to pay to run?\"",
        tooltip: { prereq: `Moni ≥ ${Cost.gym_actions}`, },
        rewards:[            
            { which_stat: "Stamina", flat_gain_base: 1.5 },
            { which_stat: "Haste", flat_gain_base: 1.5 },
        ],
        spendings: [{stat_name: "Moni", value: Cost.gym_actions},],
        check_disabled_fn: check_disabled_gym_actions,
    }),
]

export const a_gym_vip: TodoBase[] = [
    new TodoBase({
        name: 'Bench Press',
        type: 'action',
        base_time: 20 * S_TO_MS,
        desc: "Muscles? Chest? Triceps? Being an Idol nowadays sure is tough. Hey, at least it\'s free now.",
        tooltip: {eureka: "Slight chance to gain 0.01 Stamina multi"},
        rewards:[{ which_stat: "Stamina", flat_gain_base: 3.0 },],
        extra_reward_fn: extra_bench_press,
    }),
    new TodoBase({
        name: 'Assault Bike',
        type: 'action',
        base_time: 20 * S_TO_MS,
        desc: "Biking.",
        tooltip: {eureka: "Slight chance to gain 0.01 Haste multi"},
        rewards:[{ which_stat: "Haste", flat_gain_base: 3.0 },],
        extra_reward_fn: extra_assault_bike,
    }),
    new TodoBase({
        name: 'Treadmill',
        type: 'action',
        base_time: 20 * S_TO_MS,
        desc: "Running.",
        tooltip: {},
        rewards:[
            { which_stat: "Stamina", flat_gain_base: 2 },
            { which_stat: "Haste", flat_gain_base: 2 },
        ],
    }),
]