import type { LocationDef } from './location_definition';
import { living_room } from './living_room';

export const wake_up: LocationDef = {
    name: 'Wake Up',
    base_time: 1,
    desc: "Time to wake up, silly. Everything starts here.",
    hint: "What are you waiting for, click me to start your Idol journey!",
    rewards: [
        { which_stat: "Stamina", target: 'base', amount: 0.1 },
        { which_stat: "Haste", target: 'base', amount: 0.1 },
    ],
    unlocks: () => [living_room],
    actions: [],
};
