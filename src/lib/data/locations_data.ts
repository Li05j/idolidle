import { Game_Progress } from '$lib/stores/game_progress.svelte';
import { stat_list } from "$lib/stores/stats.svelte";
import { LocationTodo, type TodoBase } from '$lib/data/todo_type';
import { S_TO_MS } from '$lib/utils/utils';

export const locations_data: TodoBase[] = [
    new LocationTodo(
        'Wake Up',
        1 * S_TO_MS,
        [{ which_stat: "Agility", effectiveness: 2 },],
        [
            { which_stat: "Stamina", flat_gain_base: 0.1 },
            { which_stat: "Agility", flat_gain_base: 0.1 },
        ],
        "Time to wake up, silly. Everything starts here.",
        {
            custom_msg: "What are you waiting for, click me to start your Idol journey!"
        },
        {        
            then_fn: () => {
                Game_Progress.progress_handler.wake_up();
            }
        }
    ),
    new LocationTodo(
        'Living Room',
        3 * S_TO_MS,
        [{ which_stat: "Agility", effectiveness: 2 },],
        [{ which_stat: "Stamina", flat_gain_base: 0.2 },],
        "The first stage of your idol career, or maybe just where socks mysteriously vanish. Sing off-key, dance like a disaster—no one\'s watching (except maybe the cat). Meow.",
        {
            custom_msg: "Some cards may show very important info when hovered - like hints, or even restrictions/bonuses."
        },
        {        
            then_fn: () => {
                Game_Progress.progress_handler.living_room();
            }
        }
    ),
    new LocationTodo(
        'Park',
        30 * S_TO_MS,
        [{ which_stat: "Agility", effectiveness: 2 },],
        [{ which_stat: "Stamina", flat_gain_base: 2 },],
        "Just your everyday neighborhood park. Nothing fancy, but it got it's place in your heart. Something always feels about to happen.",
        {
            prereq: "Sing + Dance ≥ 3.0"
        },
        {        
            then_fn: () => {
                Game_Progress.progress_handler.park();
            },
            check_disabled_fn: (stat_list) => {
                if (stat_list.Sing.final + stat_list.Dance.final >= 3.0) {
                    return false;
                }
                return true;
            },
        }
    ),
    new LocationTodo(
        'School',
        81 * S_TO_MS,
        [{ which_stat: "Agility", effectiveness: 2 },],
        [{ which_stat: "Stamina", flat_gain_base: 5.4 },],
        "A place for learning, daydreaming, and maybe scribbling lyrics in your notebook. Idol stories always seem to start with being a student.",
        {
            custom_msg: "When it is time for LIVE, you will need to prove that you are the better Idol. All of your stats (except Moni) will be taken into consideration. Make sure to train well!"
        },
        {        
            then_fn: () => {
                Game_Progress.progress_handler.school();
            }
        }
    ),
    new LocationTodo(
        'Mall',
        150 * S_TO_MS,
        [{ which_stat: "Agility", effectiveness: 2 },],
        [{ which_stat: "Stamina", flat_gain_base: 10 },],
        "Bright lights, weird mannequins... way too many choices. Be careful, rumors say Moni vanishes if one stays for too long.",
        {
            custom_msg: "All cards under Locations depends on Stamina. The more Stamina you have, the less time it takes to complete."
        },
        {        
            then_fn: () => {
                Game_Progress.progress_handler.mall();
            }
        }
    ),
    new LocationTodo(
        'Gym',
        60 * S_TO_MS,
        [{ which_stat: "Agility", effectiveness: 2 },],
        [{ which_stat: "Stamina", flat_gain_base: 4 },],
        "Remember to wipe the equipment after using them, don\'t wanna end up being cancelled by some gym bros online. Talking about ways to end your Idol career...",
        {
            custom_msg: "You cannot lower the time needed to complete Purple and Yellow cards. However, their rewards tend to be dynamic."
        },
        {        
            then_fn: () => {
                Game_Progress.progress_handler.gym();
            }
        }
    ),
    new LocationTodo(
        'Maid Cafe',
        300 * S_TO_MS,
        [{ which_stat: "Agility", effectiveness: 2 },],
        [{ which_stat: "Stamina", flat_gain_base: 20 },],
        "\"Can I work as a waitress - wait, cat ears? Why? I guess it is kinda cute...?\"",
        {
            custom_msg: "During LIVE, you consume Stamina for each move you perform. However, your Fans will also be more easily swayed by Rival if your are running out of Stamina."
        },
        {        
            then_fn: () => {
                Game_Progress.progress_handler.maid_cafe();
            }
        }
    ),
];

