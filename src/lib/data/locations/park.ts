import { history } from '$lib/state/history.svelte';
import { stat_list } from '$lib/state/stats.svelte';
import { simple_flat_stat_reward } from '$lib/utils/reward_helpers';
import type { LocationDefinition } from './location_definition';

function extra_play_with_kids() {
    let [is_success, actual_gain] = simple_flat_stat_reward('Fans', 'base', 'Slight', 1);
    if (is_success) {
        history.addEurekaLogs(`+${actual_gain} Fans`, `You converted ${actual_gain} kid(s) into fans!`);
    }
}

export const park: LocationDefinition = {
    location: {
        name: 'Park',
        base_time: 20,
        desc: "Just your everyday neighborhood park. Nothing fancy, but it got it's place in your heart. Something always feels about to happen.",
        tooltip: {
            prereq: "Sing + Dance ≥ 3.0",
        },
        rewards: [
            { which_stat: "Stamina", flat_gain_base: 1.0 },
        ],
        check_disabled_fn: () => stat_list.Sing.final + stat_list.Dance.final < 3.0,
    },
    unlocks: ['Mall'],
    actions: [
        {
            name: 'Picking Bottles',
            type: 'gain_currency',
            base_time: 8,
            desc: "Being an Idol means starting somewhere, you know? Defo not working for the Moni - Just making sure the Park is clean and tidy.",
            tooltip: { dependsOn: "Haste ➤ Moni" },
            rewards: [
                { which_stat: "Moni", flat_gain_base: 3, depends: [{ which_stat: "Haste", effectiveness: 1.0 }], efficiency: "v_slow" },
            ],
        },
        {
            name: 'Busker',
            type: 'gain_currency',
            base_time: 30,
            desc: "It's quite embarrassing doing this in public... But at least it's somewhat better than collecting bottles?",
            tooltip: { dependsOn: "Fans ➤ Moni" },
            rewards: [
                { which_stat: "Fans", flat_gain_base: 3 },
                {
                    which_stat: "Moni",
                    flat_gain_base: 7,
                    depends: [{ which_stat: "Fans", effectiveness: 1.0 }],
                    efficiency: "slow",
                },
            ],
        },
        {
            name: 'Play Tag with Kids',
            type: 'action',
            base_time: 12,
            desc: "\"Tag - You're it!\" You giggle, trying to charm them with your elegant wink. It usually doesn't work, though.",
            tooltip: { eureka: "Slight chance to gain 1 Fans" },
            rewards: [
                { which_stat: "Haste", flat_gain_base: 0.6 },
                { which_stat: "Charm", flat_gain_base: 0.6 },
            ],
            extra_reward_fn: extra_play_with_kids,
        },
    ],
};
