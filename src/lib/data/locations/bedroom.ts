import type { LocationDef } from './location_definition';
import { living_room } from './living_room';

export const bedroom: LocationDef = {
    name: 'Bedroom',
    base_time: 1,
    desc: "Time to wake up from your dream, silly. Everything starts here.",
    rewards: [
        { which_stat: "Stamina", target: 'base', amount: 0.1 },
        { which_stat: "Haste", target: 'base', amount: 0.1 },
    ],
    unlocks: () => [living_room],
    actions: [],
};
