import { history } from '$lib/state/history.svelte';
import { stat_list } from '$lib/state/stats.svelte';
import { simple_flat_stat_reward } from '$lib/utils/reward_helpers';
import type { ActionDef, LocationDef } from './location_definition';

const MAID_INTERVIEW_COST = { fans: 150, charm: 75 };

function extra_moe_magic() {
    let [is_success, value] = simple_flat_stat_reward("Charm", "multi", "Tiny", 0.01);
    if (is_success) {
        history.addSystemLog(`Eureka! An unexpected breakthrough! +${value} Charm multi!`);
    }
}

function extra_maid_part_time() {
    let [is_success, value] = simple_flat_stat_reward("Fans", "base", "Good", 1, 5);
    if (is_success) {
        history.addSystemLog(`Eureka! You converted ${value} Otaku(s) into fans! +${value} Fans!`);
    }
}

const maid_interview: ActionDef = {
    name: 'Maid Interview',
    kind: 'training',
    base_time: 30,
    no_drops: true,
    desc: "So you want to be a maid? Prove your Charm.",
    rewards: [
        { which_stat: "Presence", target: 'base', amount: 3.0 },
    ],
    uses: 1,
    requires: {
        text: `Fans ≥ ${MAID_INTERVIEW_COST.fans}, Charm ≥ ${MAID_INTERVIEW_COST.charm}`,
        check: () => stat_list.Fans.final < MAID_INTERVIEW_COST.fans || stat_list.Charm.final < MAID_INTERVIEW_COST.charm,
    },
    on_complete: {
        fn: () => {},
        hint: "Unlocks more options in Maid Cafe.",
    },
};

export const maid_cafe: LocationDef = {
    name: 'Maid Cafe',
    base_time: 300,
    desc: "\"Can I work as a waitress - wait, cat ears? Why? I guess it is kinda cute...?\"",
    hint: "During LIVE, you consume Stamina for each move you perform. However, your Fans will also be more easily swayed by Rival if your are running out of Stamina.",
    rewards: [
        { which_stat: "Stamina", target: 'base', amount: 15 },
    ],
    equip_drops: {
        chance: 0.04,
        table: [{ equip_id: 'cat_ear_headband', weight: 1 }],
    },
    unlocks: () => [],
    actions: [
        maid_interview,
        {
            name: 'Chant Moe Magic',
            kind: 'training',
            base_time: 25,
            desc: "Otaku dances aren't real dances, but it sure is cute and lovely. And cute. And lovely~ Look at all these Otakus fawning at you, you could even start a cult at this rate.",
            rewards: [
                { which_stat: "Dance", target: 'base', amount: 0.5 },
                { which_stat: "Charm", target: 'base', amount: 2.0 },
            ],
            on_complete: {
                fn: extra_moe_magic,
                hint: "Tiny chance to gain 0.01 Charm multi. May drop equipment.",
            },
        },
    ],
    upgrades: [
        {
            trigger: maid_interview,
            add_actions: [
                {
                    name: 'New Hire Bonus!',
                    kind: 'training',
                    base_time: 10,
                    no_drops: true,
                    desc: "New maid, new Idol life.",
                    rewards: [
                        { which_stat: "Charm", target: 'multi', amount: 0.02 },
                        { which_stat: "Presence", target: 'multi', amount: 0.02 },
                    ],
                    uses: 1,
                },
                {
                    name: 'Maid Part-time',
                    kind: 'earning',
                    base_time: 45,
                    desc: "\"Moe Moe Kyun Moe Moe Kyun Moe Moe Kyun Oishikuna-re~!!\"",
                    rewards: [
                        { which_stat: "Presence", target: 'base', amount: 3.5 },
                        {
                            which_stat: "Moni",
                            target: 'base',
                            amount: 9,
                            scaling: {
                                sources: [{ which_stat: "Charm", effectiveness: 1.2 }],
                                efficiency: "slow",
                            },
                        },
                    ],
                    on_complete: {
                        fn: extra_maid_part_time,
                        hint: "Good chance to gain a few Fans. May drop equipment.",
                    },
                },
            ],
            on_trigger: () => {
                history.addSystemLog('You are now a Maid!');
            },
        },
    ],
};
