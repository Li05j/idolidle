import { stat_list } from '$lib/state/stats.svelte';
import type { LocationDef } from './location_definition';

export const karaoke_box: LocationDef = {
    name: 'Karaoke Box',
    base_time: 60,
    desc: "A booth-lined hallway humming with half-drunk choruses. The soundproofing is a lie.",
    rewards: [
        { which_stat: "Stamina", target: 'base', amount: 3.0 },
    ],
    requires: {
        text: "Sing ≥ 20.0",
        is_met: () => stat_list.Sing.final >= 20.0,
    },
    unlocks: () => [],
    // TODO: placeholder dummies — replace with real Sing-focused lineup later.
    actions: [
        {
            name: 'Solo Booth',
            kind: 'training',
            base_time: 15,
            no_drops: true,
            desc: "Just you, a mic, and a playlist of ballads you pretend not to love.",
            rewards: [
                { which_stat: "Sing", target: 'base', amount: 1.0 },
            ],
        },
        {
            name: 'Song Contest Entry',
            kind: 'earning',
            base_time: 40,
            no_drops: true,
            desc: "Small prize money if you can hold a note longer than the regulars.",
            rewards: [
                {
                    which_stat: "Moni",
                    target: 'base',
                    amount: 4,
                    scaling: {
                        sources: [{ which_stat: "Sing", effectiveness: 1.0 }],
                    },
                },
            ],
        },
    ],
};
