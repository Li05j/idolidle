import type { LocationDefinition } from './location_definition';

export const wake_up: LocationDefinition = {
    location: {
        name: 'Wake Up',
        base_time: 1,
        desc: "Time to wake up, silly. Everything starts here.",
        tooltip: {
            custom_msg: "What are you waiting for, click me to start your Idol journey!"
        },
        rewards: [
            { which_stat: "Stamina", flat_gain_base: 0.1 },
            { which_stat: "Haste", flat_gain_base: 0.1 },
        ],
    },
    unlocks: ['Living Room'],
    actions: [],
};
