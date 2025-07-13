import type { Todo } from '$lib/types'
import { Game_Progress } from '$lib/stores/game_progress.svelte';
import { ProgressFlag } from '$lib/types'
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
        base_cost: 3 * S_TO_MS, 
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
    {
        name: 'Mall', 
        type: 'location',
        base_cost: 320 * S_TO_MS, 
        depends: [{ which_stat: "sta", effectiveness: 1.0 }],
        reward: () => {
            sta.base += 32
        },
        then: () => {
            Game_Progress.enable(0, ProgressFlag.f3);
        }
    },
];
