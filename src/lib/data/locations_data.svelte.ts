import { Game_Progress } from '$lib/stores/game_progress.svelte';
import { stat_list } from "$lib/stores/stats.svelte";
import { LocationTodo, type TodoBase } from '$lib/data/todo_type.svelte';

const S_TO_MS = 1000

export const locations_data: TodoBase[] = [
    new LocationTodo(
        'Wake Up',
        1 * S_TO_MS,
        [],
        [
            {which_stat: "Stamina", flat_gain_base: 0.1},
            {which_stat: "Sing", flat_gain_base: 0.1},
            {which_stat: "Dance", flat_gain_base: 0.1},
            {which_stat: "Charm", flat_gain_base: 0.1},
            {which_stat: "Presence", flat_gain_base: 0.1},
        ],
        "Time to wake up, silly. Everything starts here.",
        {        
            then_fn: () => {
                Game_Progress.progress_handler.wake_up();
            }
        }
    ),
    new LocationTodo(
        'Living Room',
        1 * S_TO_MS,
        [{ which_stat: "Stamina", effectiveness: 1.0 },],
        [{ which_stat: "Stamina", flat_gain_base: 0.2 },],
        "The first stage of your idol career, or maybe just where socks mysteriously vanish. Sing off-key, dance like a disaster—no one\'s watching (except maybe the cat). Meow.",
        {        
            then_fn: () => {
                Game_Progress.progress_handler.living_room();
            }
        }
    ),
    new LocationTodo(
        'Park',
        1 * S_TO_MS,
        [{ which_stat: "Stamina", effectiveness: 1.0 },],
        [{ which_stat: "Stamina", flat_gain_base: 1.5 },],
        "Just your everyday neighborhood park. Nothing fancy, but it got it's place in your heart. Something always feels about to happen.",
        {        
            then_fn: () => {
                Game_Progress.progress_handler.park();
            },
            // check_disabled_fn: (stat_list) => {
            //     if (stat_list.sing.final + stat_list.dance.final >= 2.0) {
            //         return false;
            //     }
            //     return true;
            // },
        }
    ),
    new LocationTodo(
        'School',
        240 * S_TO_MS,
        [{ which_stat: "Stamina", effectiveness: 1.0 },],
        [{ which_stat: "Stamina", flat_gain_base: 12 },],
        "A place for learning, daydreaming, and maybe scribbling lyrics in your notebook. Idol stories always seem to start with being a student.",
        {        
            then_fn: () => {
                Game_Progress.progress_handler.school();
            }
        }
    ),
    new LocationTodo(
        'Mall',
        1 * S_TO_MS,
        [{ which_stat: "Stamina", effectiveness: 1.0 },],
        [{ which_stat: "Stamina", flat_gain_base: 15 },],
        "Bright lights, weird mannequins... way too many choices. Be careful, rumors say Moni vanishes if one stays for too long.",
        {        
            then_fn: () => {
                Game_Progress.progress_handler.mall();
            }
        }
    ),
];

