import { TodoBase } from '$lib/data/todo_type';
import { S_TO_MS } from '$lib/utils/utils';
import * as loc_fns from './locations_side_effects';

export const locations_data: TodoBase[] = [
    new TodoBase({
        name: 'Wake Up',
        type: 'location',
        base_time: 1 * S_TO_MS,
        desc: "Time to wake up, silly. Everything starts here.",
        tooltip: {
            custom_msg: "What are you waiting for, click me to start your Idol journey!"
        },
        rewards: [
            { which_stat: "Stamina", flat_gain_base: 0.1 },
            { which_stat: "Haste", flat_gain_base: 0.1 },
        ],
        then_fn: loc_fns.then_wake_up,
    }),
    new TodoBase({
        name: 'Living Room',
        type: 'location',
        base_time: 4 * S_TO_MS,
        desc: "The first stage of your idol career, or maybe just where socks mysteriously vanish. Sing off-key, dance like a disaster—no one\'s watching (except maybe the cat). Meow.",
        tooltip: {
            custom_msg: "Some cards may show very important info when hovered - like hints, or even restrictions/bonuses."
        },
        rewards: [
            { which_stat: "Stamina", flat_gain_base: 0.2 },
        ],
        then_fn: loc_fns.then_living_room,
    }),
    new TodoBase({
        name: 'Park',
        type: 'location',
        base_time: 20 * S_TO_MS,
        desc: "Just your everyday neighborhood park. Nothing fancy, but it got it's place in your heart. Something always feels about to happen.",
        tooltip: {
            prereq: "Sing + Dance ≥ 3.0",
        },
        rewards: [
            { which_stat: "Stamina", flat_gain_base: 1.0 },
        ],
        check_disabled_fn: loc_fns.check_disabled_park,
        then_fn: loc_fns.then_park,
    }),
    new TodoBase({
        name: 'School',
        type: 'location',
        base_time: 80 * S_TO_MS,
        desc: "A place for learning, daydreaming, and maybe scribbling lyrics in your notebook. Idol stories always seem to start with being a student.",
        tooltip: {
            custom_msg: "When it is time for LIVE, you will need to prove that you are the better Idol. All of your stats (except Moni) will be taken into consideration. Make sure to train well!",
        },
        rewards: [
            { which_stat: "Stamina", flat_gain_base: 4 },
        ],
        then_fn: loc_fns.then_school,
    }),
    new TodoBase({
        name: 'Mall',
        type: 'location',
        base_time: 200 * S_TO_MS,
        desc: "Bright lights, weird mannequins... way too many choices. Be careful, rumors say Moni vanishes if one stays for too long.",
        tooltip: {
            custom_msg: "All Location cards and white Action cards relies on Haste. The more Haste you have, the less time it takes for it to complete."
        },
        rewards: [
            { which_stat: "Stamina", flat_gain_base: 10 },
        ],
        then_fn: loc_fns.then_mall,
    }),
    new TodoBase({
        name: 'Gym',
        type: 'location',
        base_time: 70 * S_TO_MS,
        desc: "Remember to wipe the equipment after using them, don\'t wanna end up being cancelled by some gym bros online. Talking about ways to end your Idol career...",
        tooltip: {
            custom_msg: "You cannot lower the time needed to complete Purple and Yellow cards. However, their rewards tend to be dynamic."
        },
        rewards: [
            { which_stat: "Stamina", flat_gain_base: 3.5 },
        ],
        then_fn: loc_fns.then_gym,
    }),
    new TodoBase({
        name: 'Maid Cafe',
        type: 'location',
        base_time: 300 * S_TO_MS,
        desc: "\"Can I work as a waitress - wait, cat ears? Why? I guess it is kinda cute...?\"",
        tooltip: {
            custom_msg: "During LIVE, you consume Stamina for each move you perform. However, your Fans will also be more easily swayed by Rival if your are running out of Stamina."
        },
        rewards: [
            { which_stat: "Stamina", flat_gain_base: 15 },
        ],
        then_fn: loc_fns.then_maid_cafe,
    }),
];

