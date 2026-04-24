import { stat_list } from '$lib/state/stats.svelte';
import { history } from '$lib/state/history.svelte';
import { simple_flat_stat_reward, uniform_rand_stat_flat_reward } from '$lib/utils/reward_helpers';
import type { LocationDef } from './location_definition';

const TICKET_COST = 25;

function extra_sneak_rehearsal() {
    let [is_success, value] = simple_flat_stat_reward("Haste", "base", "Slight", 1, 5);
    if (is_success) {
        history.addSystemLog(`Eureka! Successfully sneaked out of the Theatre before getting caught! +${value} Haste!`);
    }
}

function extra_watch_a_play() {
    let [stat_name, actual_gain] = uniform_rand_stat_flat_reward('base', 5, 5);
    history.addSystemLog(`The performance moved you! +${actual_gain} ${stat_name}!`);
}

export const old_theatre: LocationDef = {
    name: 'Old Theatre',
    base_time: 60,
    desc: "The last theatre in town, where the seats creak almost as much as the patrons.",
    rewards: [
        { which_stat: "Stamina", target: 'base', amount: 3.0 },
    ],
    requires: {
        text: "Sing ≥ 20.0",
        is_met: () => stat_list.Sing.final >= 20.0,
    },
    equip_drops: {
        chance: 0.05,
        table: [
            { equip_id: 'stage_microphone', weight: 3 },
            { equip_id: 'ballet_slippers', weight: 3 },
            { equip_id: 'archaic_tiara', weight: 1 },
        ],
    },
    unlocks: () => [],
    actions: [
        {
            name: 'Sneak a Rehearsal',
            kind: 'training',
            base_time: 25,
            desc: "A dusty booth. Close your eyes, and the empty seats almost feel real.",
            rewards: [
                { which_stat: "Sing", target: 'base', amount: 2.0 },
                { which_stat: "Dance", target: 'base', amount: 0.5 },
            ],
            on_complete: {
                fn: extra_sneak_rehearsal,
                desc: "Slight chance to gain 1~6 Haste",
            }
        },
        {
            name: 'Watch a Play',
            kind: 'spending',
            base_time: 55,
            desc: "Sometimes, it is best to sit down and be the audience for once. Or twice.",
            costs: [{ stat: "Moni", amount: TICKET_COST }],
            requires: {
                text: `Moni ≥ ${TICKET_COST}`,
                is_met: () => stat_list.Moni.final >= TICKET_COST,
            },
            rewards: [
                { which_stat: "Sing", target: 'base', amount: 5.5 },
                { which_stat: "Dance", target: 'base', amount: 5.5 },
            ],
            on_complete: {
                fn: extra_watch_a_play,
                desc: "Randomly increase a stat by a small amount",
            },
        },
    ],
};
