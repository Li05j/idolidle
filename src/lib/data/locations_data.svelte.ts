import type { Todo } from '$lib/types'
import { Game_Progress } from '$lib/stores/game_progress.svelte';
import { fans, moni, sta, sing, dance, charm, pres } from "$lib/stores/stats.svelte";

const S_TO_MS = 1000

export const locations_data: Todo[] = [
    {
        name: 'Wake Up',
        type: 'location',
        base_cost: 1 * S_TO_MS, 
        depends: [],
        rewards: [
            {which_stat: "Stamina", flat_gain_base: 0.1},
            {which_stat: "Sing", flat_gain_base: 0.1},
            {which_stat: "Dance", flat_gain_base: 0.1},
            {which_stat: "Charm", flat_gain_base: 0.1},
            {which_stat: "Presence", flat_gain_base: 0.1},
        ],
        desc: "Time to wake up, silly. Everything starts here.",
        then: () => {
            Game_Progress.progress_handler.wake_up();
        }
    },
    {
        name: 'Living Room',
        type: 'location',
        base_cost: 4 * S_TO_MS, 
        depends: [{ which_stat: "Stamina", effectiveness: 1.0 }],
        rewards: [
            {which_stat: "Stamina", flat_gain_base: 0.2},
        ],
        desc: "The first stage of your idol career, or maybe just where socks mysteriously vanish. Sing off-key, dance like a disaster—no one\'s watching (except maybe the cat). Meow.",
        then: () => {
            Game_Progress.progress_handler.living_room();
        }
    },
    {
        name: 'Park', 
        type: 'location',
        base_cost: 30 * S_TO_MS, 
        depends: [{ which_stat: "Stamina", effectiveness: 1.0 }],
        rewards: [
            {which_stat: "Stamina", flat_gain_base: 1.5},
        ],
        desc: "Just your everyday neighborhood park. Nothing fancy, but it got it's place in your heart. Something always feels about to happen.",
        then: () => {
            Game_Progress.progress_handler.park();
        }
    },
    {
        name: 'School', 
        type: 'location',
        base_cost: 240 * S_TO_MS, 
        depends: [{ which_stat: "Stamina", effectiveness: 1.0 }],
        rewards: [
            {which_stat: "Stamina", flat_gain_base: 12},
        ],
        desc: "A place for learning, daydreaming, and maybe scribbling lyrics in your notebook. Idol stories always seem to start with being a student.",
        then: () => {
            Game_Progress.progress_handler.school()
        }
    },
    {
        name: 'Mall', 
        type: 'location',
        base_cost: 300 * S_TO_MS, 
        depends: [{ which_stat: "Stamina", effectiveness: 1.0 }],
        rewards: [
            {which_stat: "Stamina", flat_gain_base: 15},
        ],
        desc: "Bright lights, weird mannequins... way too many choices. Be careful, rumors say Moni vanishes if one stays for too long.",
        then: () => {
            Game_Progress.progress_handler.mall();
        }
    },
];
