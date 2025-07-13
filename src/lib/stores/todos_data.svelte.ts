import type { Todo } from '$lib/types'
import { Game_Progress } from '$lib/stores/game_progress.svelte';
import { ProgressFlag } from '$lib/types'
import { TD_List_Tracker } from "$lib/stores/todos_list_tracker.svelte";
import { fans, moni, sta, charm, presence, eloq, poise } from "$lib/stores/stats.svelte";

const S_TO_MS = 1000

export const locations_data: Todo[] = [
    {
        name: 'Living Room',
        type: 'location',
        base_cost: 3 * S_TO_MS, 
        depends: [{ which_stat: "sta", effectiveness: 1.0 }],
        reward: () => {
            sta.base += 0.3
        },
        then: () => {
            Game_Progress.enable(0, ProgressFlag.f0);
        }
    },
    {
        name: 'Park', 
        type: 'location',
        base_cost: 30 * S_TO_MS, 
        depends: [{ which_stat: "sta", effectiveness: 1.0 }],
        reward: () => {
            sta.base += 3
        },
        then: () => {
            Game_Progress.enable(0, ProgressFlag.f1);
        }
    },
    {
        name: 'School', 
        type: 'location',
        base_cost: 300 * S_TO_MS, 
        depends: [{ which_stat: "sta", effectiveness: 1.0 }],
        reward: () => {
            sta.base += 30
        },
        then: () => {
            Game_Progress.enable(0, ProgressFlag.f2);
        }
    },
];

export const actions_data: Map<string, Todo[]> = new Map([
    ['Living Room', 
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
    ['Park', 
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