import { stat_list } from '$lib/state/stats.svelte';
import type { LocationDef } from './location_definition';

export const train_station: LocationDef = {
    name: 'Train Station',
    base_time: 22,
    desc: "Announcements echo off the tiles. Somewhere a train is always leaving. One day you'll be on it.",
    rewards: [
        { which_stat: "Presence", target: 'base', amount: 0.5 },
    ],
    requires: {
        text: "Presence ≥ 3.0",
        is_met: () => stat_list.Presence.final >= 3.0,
    },
    unlocks: () => [],
    // TODO: placeholder hub. Future cities (Tokyo pool per the brainstorm in
    // ./index.ts) should unlock from here via an upgrade.
    actions: [
        {
            name: 'People-Watching',
            kind: 'training',
            base_time: 10,
            no_drops: true,
            desc: "Study the commuters. Posture, rhythm, the way they carry themselves. All of it useful.",
            rewards: [
                { which_stat: "Presence", target: 'base', amount: 0.8 },
            ],
        },
        {
            name: 'Platform Busking',
            kind: 'earning',
            base_time: 30,
            no_drops: true,
            desc: "Rush-hour acoustics are surprisingly forgiving. The coins land with a satisfying clink.",
            rewards: [
                {
                    which_stat: "Moni",
                    target: 'base',
                    amount: 5,
                    scaling: {
                        sources: [{ which_stat: "Presence", effectiveness: 1.0 }],
                    },
                },
            ],
        },
    ],
};
