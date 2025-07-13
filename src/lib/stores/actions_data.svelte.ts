import type { Todo, StatEffectPair } from '$lib/types'
import { fans, moni, sta, charm, presence, eloq, poise } from "$lib/stores/stats.svelte";
import { calc_stat_effectiveness, moni_making_slow, moni_making_mid, moni_making_fast } from "$lib/utils/utils"

const S_TO_MS = 1000

export const actions_data: Map<string, Todo[]> = new Map([
    ['Living Room', 
        [
            {
                name: 'Singing Practice', 
                type: 'action', 
                base_cost: 5 * S_TO_MS,
                depends: [
                    { which_stat: "sta", effectiveness: 0.25 },
                    { which_stat: "eloq", effectiveness: 0.75 },
                ],
                reward: () => {
                    eloq.base += 0.5
                },
            },
            {
                name: 'Dancing Practice', 
                type: 'action', 
                base_cost: 5 * S_TO_MS,
                depends: [
                    { which_stat: "sta", effectiveness: 0.25 },
                    { which_stat: "charm", effectiveness: 0.75 },
                ],
                reward: () => {
                    charm.base += 0.5
                },
            },
        ],
    ],
    ['Park', 
        [
            {
                name: 'Pickup Bottles', 
                type: 'moni_making', 
                base_cost: 10 * S_TO_MS,
                depends: [
                    { which_stat: "sta", effectiveness: 1.0 },
                ],
                reward: (d: StatEffectPair[]) => {
                    moni.base += moni_making_slow(calc_stat_effectiveness(d))
                },
            },
            {
                name: 'Busker', 
                type: 'moni_making', 
                base_cost: 30 * S_TO_MS,
                depends: [
                    { which_stat: "fans", effectiveness: 0.7 },
                    { which_stat: "charm", effectiveness: 0.15 },
                    { which_stat: "eloq", effectiveness: 0.15 },
                ],
                reward: (d: StatEffectPair[]) => {
                    moni.base += moni_making_mid(calc_stat_effectiveness(d))
                    fans.base += 1
                },
            },
            {
                name: 'Playing with kids', 
                type: 'action', 
                base_cost: 12 * S_TO_MS,
                depends: [
                    { which_stat: "charm", effectiveness: 1.0 },
                ],
                reward: () => {
                    charm.base += 1.2
                    let r = Math.random();
                    if (r < 0.1) {
                        fans.base += 1
                    }
                },
            },
        ],
    ],
    ['School', 
        [
            {
                name: 'Dance', 
                type: 'action', 
                base_cost: 5 * S_TO_MS,
                depends: [
                    { which_stat: "sta", effectiveness: 0.25 },
                    { which_stat: "charm", effectiveness: 0.75 },
                ],
                reward: () => {
                    charm.base += 0.5
                },
            },
            {
                name: 'Sing', 
                type: 'action', 
                base_cost: 5 * S_TO_MS,
                depends: [
                    { which_stat: "sta", effectiveness: 0.25 },
                    { which_stat: "eloq", effectiveness: 0.75 },
                ],
                reward: () => {
                    eloq.base += 0.5
                },
            },
        ],
    ],
]);