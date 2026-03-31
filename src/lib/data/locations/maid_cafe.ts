import { history } from '$lib/state/history.svelte';
import { stat_list } from '$lib/state/stats.svelte';
import { simple_flat_stat_reward } from '$lib/utils/reward_helpers';
import type { LocationDefinition } from './location_definition';

const MAID_INTERVIEW_COST = { fans: 150, charm: 75 };

function extra_moe_magic() {
    let [is_success, value] = simple_flat_stat_reward("Charm", "multi", "Tiny", 0.01);
    if (is_success) {
        history.addEurekaLogs(`+${value} Charm multi`, 'An unexpected breakthrough!');
    }
}

function extra_maid_part_time() {
    let [is_success, value] = simple_flat_stat_reward("Fans", "base", "Good", 1, 5);
    if (is_success) {
        history.addEurekaLogs(`+${value} Fans`, `You converted ${value} Otaku(s) into fans!`);
    }
}

export const maid_cafe: LocationDefinition = {
    location: {
        name: 'Maid Cafe',
        base_time: 300,
        desc: "\"Can I work as a waitress - wait, cat ears? Why? I guess it is kinda cute...?\"",
        tooltip: {
            custom_msg: "During LIVE, you consume Stamina for each move you perform. However, your Fans will also be more easily swayed by Rival if your are running out of Stamina."
        },
        rewards: [
            { which_stat: "Stamina", flat_gain_base: 15 },
        ],
    },
    unlocks: [],
    actions: [
        {
            name: 'Maid Interview',
            type: 'action',
            base_time: 30,
            desc: "So you want to be a maid? Prove your Charm.",
            tooltip: {
                prereq: `Fans ≥ ${MAID_INTERVIEW_COST.fans}, Charm ≥ ${MAID_INTERVIEW_COST.charm}`,
                eureka: "Unlocks more options in Maid Cafe."
            },
            rewards: [
                { which_stat: "Presence", flat_gain_base: 5 },
            ],
            one_off: true,
            check_disabled_fn: () => stat_list.Fans.final < MAID_INTERVIEW_COST.fans || stat_list.Charm.final < MAID_INTERVIEW_COST.charm,
        },
        {
            name: 'Chant Moe Magic',
            type: 'action',
            base_time: 25,
            desc: "Otaku dances aren't real dances, but it sure is cute and lovely. And cute. And lovely~ Look at all these Otakus fawning at you, you could even start a cult at this rate.",
            tooltip: { eureka: "Tiny chance to gain 0.01 Charm multi" },
            rewards: [
                { which_stat: "Dance", flat_gain_base: 0.5 },
                { which_stat: "Charm", flat_gain_base: 2.5 },
            ],
            extra_reward_fn: extra_moe_magic,
        },
    ],
    upgrades: [
        {
            trigger_action: 'Maid Interview',
            add_actions: [
                {
                    name: 'New Hire Bonus!',
                    type: 'action',
                    base_time: 10,
                    desc: "New maid, new Idol life.",
                    tooltip: {},
                    rewards: [
                        { which_stat: "Charm", flat_gain_multi: 0.02 },
                        { which_stat: "Presence", flat_gain_multi: 0.02 },
                    ],
                    one_off: true,
                },
                {
                    name: 'Maid Part-time',
                    type: 'gain_currency',
                    base_time: 45,
                    desc: "\"Moe Moe Kyun Moe Moe Kyun Moe Moe Kyun Oishikuna-re~!!\"",
                    tooltip: {
                        dependsOn: "Charm ➤ Moni",
                        eureka: "Good chance to gain a few Fans"
                    },
                    rewards: [
                        { which_stat: "Presence", flat_gain_base: 3.5 },
                        {
                            which_stat: "Moni",
                            flat_gain_base: 10,
                            depends: [{ which_stat: "Charm", effectiveness: 1.0 }],
                            efficiency: "mid",
                        },
                    ],
                    extra_reward_fn: extra_maid_part_time,
                },
            ],
            on_trigger: () => {
                history.addHintLogs('You are now a Maid!');
            },
        },
        {
            trigger_action: 'New Hire Bonus!',
        },
    ],
};
