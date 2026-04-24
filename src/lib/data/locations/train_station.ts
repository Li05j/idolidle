import { stat_list } from '$lib/state/stats.svelte';
import { history } from '$lib/state/history.svelte';
import { simple_flat_stat_reward } from '$lib/utils/reward_helpers';
import type { LocationDef } from './location_definition';

function extra_people_watching() {
    let [is_success, value] = simple_flat_stat_reward("Haste", "base", "Tiny", 3, 1);
    if (is_success) {
        history.addSystemLog(`Eureka! You decided to chase the train too. +${value} Haste!`);
        if (stat_list.Haste.base >= 150) {
            stat_list.Fans.base += 10;
            history.addSystemLog(`Eureka! Your speed was unbelievable! +10 Fans!`);
        }
    }
}

function extra_platform_busking() {
    let [is_success, actual_gain] = simple_flat_stat_reward('Sing', 'base', 'Slight', 3, 5);
    if (is_success) {
        history.addSystemLog(`Eureka! You got better at singing, +${actual_gain} Sing!`);
    }
}

export const train_station: LocationDef = {
    name: 'Train Station',
    base_time: 190,
    desc: "Announcements echo off the tiles. Somewhere a train is always leaving. One day you'll be on it.",
    rewards: [
        { which_stat: "Stamina", target: 'base', amount: 9.5 },
    ],
    equip_drops: {
        chance: 0.05,
        table: [
            { equip_id: 'buskers_cap', weight: 1 },
            { equip_id: 'monster_energy_drink', weight: 1 },
        ],
    },
    unlocks: () => [],
    actions: [
        {
            name: 'People-Watching',
            kind: 'training',
            base_time: 15,
            desc: "Study the commuters. Posture, rhythm, the way they chase the trains. All of it useful.",
            rewards: [
                { which_stat: "Haste", target: 'base', amount: 0.3 },
                { which_stat: "Presence", target: 'base', amount: 1.2 },
            ],
            on_complete: {
                fn: extra_people_watching,
                desc: "Tiny chance to gain some Haste"
            },
        },
        {
            name: 'Platform Busking',
            kind: 'earning',
            base_time: 40,
            desc: "Rush-hour acoustics are surprisingly forgiving. The coins land with a satisfying clink.",
            rewards: [
                { which_stat: "Fans", target: 'base', amount: 4 },
                {
                    which_stat: "Moni",
                    target: 'base',
                    amount: 8,
                    scaling: {
                        sources: [
                            { which_stat: "Sing", effectiveness: 0.55 },
                            { which_stat: "Presence", effectiveness: 0.55 },
                        ],
                    },
                },
            ],
            on_complete: {
                fn: extra_platform_busking,
                desc: "Slight chance to gain some Sing"
            }
        },
    ],
};
