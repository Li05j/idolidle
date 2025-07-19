import type { Todo, StatEffectPair } from '$lib/types'
import { fans, moni, sta, sing, dance, charm, pres } from "$lib/stores/stats.svelte";
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
                    { which_stat: "Charm", effectiveness: 0.75 },
                ],
                rewards: [
                    {which_stat: "Sing", flat_gain_base: 0.5},
                ],
                desc: "Your voice cracks. Your cat weeps. But somewhere in the noise, a star might be warming up.",
            },
            {
                name: 'Dancing Practice', 
                type: 'action', 
                base_cost: 5 * S_TO_MS,
                depends: [
                    { which_stat: "Stamina", effectiveness: 0.25 },
                    { which_stat: "Presence", effectiveness: 0.75 },
                ],
                rewards: [
                    {which_stat: "Dance", flat_gain_base: 0.5},
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
                base_cost: 5 * S_TO_MS,
                depends: [],
                rewards: [
                    {which_stat: "Moni", flat_gain_base: 5, depends: [{ which_stat: "Stamina", effectiveness: 1.0 }], efficiency: "slow"},
                ],
                desc: "Being an Idol always means starting somewhere, you know? This isn't for the Moni, obviously; Just making sure the Park is clean and tidy.",
            },
            {
                name: 'Busker', 
                type: 'gain_currency', 
                base_cost: 30 * S_TO_MS,
                depends: [],
                rewards: [
                    {which_stat: "Fans", flat_gain_base: 3},
                    {which_stat: 
                        "Moni",
                        flat_gain_base: 3, 
                        depends: [
                            { which_stat: "Fans", effectiveness: 0.7 },
                            { which_stat: "Sing", effectiveness: 0.15 },
                            { which_stat: "Dance", effectiveness: 0.15 },
                        ],
                        efficiency: "mid",
                    },
                ],
                desc: "Being an Idol always meens starting somewhere, you know? It's not for the Moni, obviously. Just making sure the Park is clean and tidy.",
            },
            {
                name: 'Running around with kids', 
                type: 'action', 
                base_cost: 12 * S_TO_MS,
                depends: [
                    { which_stat: "Stamina", effectiveness: 0.8 },
                    { which_stat: "Charm", effectiveness: 0.2 },
                ],
                rewards: [
                    {which_stat: "Stamina", flat_gain_base: 0.6},
                    {which_stat: "Charm", flat_gain_base: 0.6},
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
            {
                name: 'Go to class', 
                type: 'action', 
                base_cost: 60 * S_TO_MS,
                depends: [
                    { which_stat: "Charm", effectiveness: 0.5 },
                    { which_stat: "Presence", effectiveness: 0.5 },
                ],
                rewards: [
                    {which_stat: "Sing", flat_gain_base: 1.2 },
                    {which_stat: "Dance", flat_gain_base: 1.2 },
                    {which_stat: "Charm", flat_gain_base: 1.2 },
                    {which_stat: "Presence", flat_gain_base: 1.2 },
                ],
                desc: "Being an Idol always meens starting somewhere, you know? It's not for the Moni, obviously. Just making sure the Park is clean and tidy.",
                extra_reward: () => {
                    let a = Math.random();
                    let b = Math.random();
                    let c = Math.random();
                    let d = Math.random();
                    if (a < 0.5) {
                        sing.base += 1.2
                        logs.addEurekaLogs( '+1.2 Sing')
                    }
                    if (b < 0.5) {
                        dance.base += 1.2
                        logs.addEurekaLogs( '+1.2 Dance')
                    }
                    if (c < 0.5) {
                        charm.base += 1.2
                        logs.addEurekaLogs( '+1.2 Charm')
                    }
                    if (d < 0.5) {
                        pres.base += 1.2
                        logs.addEurekaLogs( '+1.2 Presence')
                    }
                },
            },
            {
                name: 'Yell on a wooden box', 
                type: 'action', 
                base_cost: 15 * S_TO_MS,
                depends: [
                    { which_stat: "Presence", effectiveness: 1.0 },
                ],
                rewards: [
                    {which_stat: "Fans", flat_gain_base: 2 },
                ],
                desc: "Being an Idol always meens starting somewhere, you know? It's not for the Moni, obviously. Just making sure the Park is clean and tidy.",
                extra_reward: () => {
                    let r = Math.random();
                    if (r < 0.1) {
                        fans.base += 1
                        logs.addEurekaLogs( '+1 Fans', 'You poached an extra fan!')
                    }
                },
            },
            {
                name: 'Dancing in the hallway', 
                type: 'action', 
                base_cost: 35 * S_TO_MS,
                depends: [
                    { which_stat: "Presence", effectiveness: 1.0 },
                ],
                rewards: [
                    {which_stat: "Dance", flat_gain_base: 2 },
                    {which_stat: "Presence", flat_gain_base: 1.5 },
                ],
                desc: "Being an Idol always meens starting somewhere, you know? It's not for the Moni, obviously. Just making sure the Park is clean and tidy.",
                extra_reward: () => {
                    let r = Math.random();
                    if (r < 0.1) {
                        fans.base += 1
                        logs.addEurekaLogs( '+1 Fans', 'You attracted a student to be a fan!')
                    }
                },
            },
            {
                name: 'Running up and down the stairs', 
                type: 'action', 
                base_cost: 40 * S_TO_MS,
                depends: [
                    { which_stat: "Stamina", effectiveness: 1.0 },
                ],
                rewards: [
                    {which_stat: "Stamina", flat_gain_base: 4.0 },
                ],
                desc: "Being an Idol always meens starting somewhere, you know? It's not for the Moni, obviously. Just making sure the Park is clean and tidy.",
            },
        ],
    ],
]);