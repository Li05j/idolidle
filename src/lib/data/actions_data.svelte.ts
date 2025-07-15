import type { Todo, StatEffectPair } from '$lib/types'
import { fans, moni, sta, charm, pres, eloq, poise } from "$lib/stores/stats.svelte";
import { logs } from '$lib/stores/history.svelte'

const S_TO_MS = 1000

export const actions_data: Map<string, Todo[]> = new Map([
    ['Living Room', 
        [
            {
                name: 'Singing Practice', 
                type: 'action', 
                base_cost: 5 * S_TO_MS,
                depends: [
                    { which_stat: "Stamina", effectiveness: 0.25 },
                    { which_stat: "Eloquence", effectiveness: 0.75 },
                ],
                rewards: [
                    {which_stat: "Eloquence", flat_gain_base: 0.5},
                ],
                desc: "Your voice cracks. Your cat weeps. But somewhere in the noise, a star might be warming up.",
            },
            {
                name: 'Dancing Practice', 
                type: 'action', 
                base_cost: 5 * S_TO_MS,
                depends: [
                    { which_stat: "Stamina", effectiveness: 0.25 },
                    { which_stat: "Charm", effectiveness: 0.75 },
                ],
                rewards: [
                    {which_stat: "Charm", flat_gain_base: 0.5},
                ],
                desc: "Limbs flail, rhythm fails, and then you trip yourself. Maybe the floor just hates you.",
            },
        ],
    ],
    ['Park', 
        [
            {
                name: 'Pickup Bottles', 
                type: 'gain_currency', 
                base_cost: 1 * S_TO_MS,
                depends: [],
                rewards: [
                    {which_stat: "Moni", flat_gain_base: 1, depends: [{ which_stat: "Stamina", effectiveness: 1.0 }], efficiency: "slow"},
                ],
                desc: "Being an Idol always meens starting somewhere, you know? It's not for the Moni, obviously. Just making sure the Park is clean and tidy.",
                // reward: (d: StatEffectPair[]) => {
                //     moni.base += moni_making_slow(calc_stat_effectiveness(d))
                // },
            },
            {
                name: 'Busker', 
                type: 'gain_currency', 
                base_cost: 30 * S_TO_MS,
                depends: [],
                rewards: [
                    {which_stat: "Fans", flat_gain_base: 1},
                    {which_stat: 
                        "Moni",
                        flat_gain_base: 1, 
                        depends: [
                            { which_stat: "Fans", effectiveness: 0.7 },
                            { which_stat: "Charm", effectiveness: 0.15 },
                            { which_stat: "Eloquence", effectiveness: 0.15 },
                        ],
                        efficiency: "mid",
                    },
                ],
                desc: "Being an Idol always meens starting somewhere, you know? It's not for the Moni, obviously. Just making sure the Park is clean and tidy.",
            },
            {
                name: 'Playing with kids', 
                type: 'action', 
                base_cost: 12 * S_TO_MS,
                depends: [
                    { which_stat: "Charm", effectiveness: 1.0 },
                ],
                rewards: [
                    {which_stat: "Charm", flat_gain_base: 1.2},
                ],
                desc: "Being an Idol always meens starting somewhere, you know? It's not for the Moni, obviously. Just making sure the Park is clean and tidy.",
                extra_reward: () => {
                    let r = Math.random();
                    if (r < 0.1) {
                        fans.base += 1
                        logs.addEurekaLogs( '+1 Fans', 'You converted a kid into a fan!')
                    }
                },
            },
        ],
    ],
    ['School', 
        [
            
        ],
    ],
]);