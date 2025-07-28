import { TodoBase } from '$lib/data/todo_type';
import { S_TO_MS } from '$lib/utils/utils';
import { check_disabled_maid_interview, extra_maid_part_time, extra_moe_magic, then_maid_interview } from '../actions_side_effects';
import { Cost } from '../cost_constants';

export const a_maid_cafe: TodoBase[] = [
    new TodoBase({
        name: 'Maid Interview',
        type: 'action',
        base_time: 30 * S_TO_MS,
        desc: "So you want to be a maid? Prove your Charm.",
        tooltip: { 
            prereq: `Fans ≥ ${Cost.maid_interview.fans}, Charm ≥ ${Cost.maid_interview.charm}`,
            eureka: "Unlocks more options in Maid Cafe."
        },
        rewards:[
            { which_stat: "Presence", flat_gain_base: 5 },
        ],
        one_off: true,
        then_fn: then_maid_interview,
        check_disabled_fn: check_disabled_maid_interview,
    }),
    new TodoBase({
        name: 'Chant Moe Magic',
        type: 'action',
        base_time: 25 * S_TO_MS,
        desc: "Otaku dances aren\'t real dances, but it sure is cute and lovely. And cute. And lovely~ Look at all these Otakus fawning at you, you could even start a cult at this rate.",
        tooltip: { eureka: "Tiny chance to gain 0.01 Charm multi", },
        rewards: [
            { which_stat: "Dance", flat_gain_base: 0.5 },
            { which_stat: "Charm", flat_gain_base: 2.5 },
        ],
        extra_reward_fn: extra_moe_magic,
    }),
]

export const a_maid_worker: TodoBase[] = [
    new TodoBase({
        name: 'Maid Part-time',
        type: 'gain_currency',
        base_time: 45 * S_TO_MS,
        desc: "\"Moe Moe Kyun Moe Moe Kyun Moe Moe Kyun Oishikuna-re~!!\"",
        tooltip: {eureka: "Good chance to gain a few Fans"},
        rewards:[                    
            { which_stat: "Presence", flat_gain_base: 3.5 },
            { which_stat: 
                "Moni",
                flat_gain_base: 10,
                depends: [
                    { which_stat: "Charm", effectiveness: 1.0 },
                ],
                efficiency: "mid",
            },
        ],
        extra_reward_fn: extra_maid_part_time,
    }),
]