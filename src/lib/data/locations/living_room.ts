import { history } from '$lib/state/history.svelte';
import type { LocationDef } from './location_definition';
import { park } from './park';
import { school } from './school';
import { upgrade_living_room } from './mall';

export const living_room: LocationDef = {
    name: 'Living Room',
    base_time: 4,
    desc: "The first stage of your idol career, or maybe just where socks mysteriously vanish. Sing off-key, dance like a disaster—no one's watching (except maybe the cat). Meow.",
    hint: "Some cards may show very important info when hovered - like hints, or even restrictions/bonuses.",
    rewards: [
        { which_stat: "Stamina", target: 'base', amount: 0.2 },
    ],
    equip_drops: {
        chance: 0.08,
        table: [{ equip_id: 'comfy_slippers', weight: 1 }],
    },
    unlocks: () => [park, school],
    actions: [
        {
            name: 'Singing Practice',
            kind: 'training',
            base_time: 5,
            desc: "Your voice cracks. Your cat weeps. But somewhere in the noise, a star might be warming up.",
            rewards: [
                { which_stat: "Sing", target: 'base', amount: 0.5 },
            ],

        },
        {
            name: 'Dancing Practice',
            kind: 'training',
            base_time: 5,
            desc: "Limbs flail, rhythm fails, and then you trip yourself. Maybe the floor just hates you.",
            rewards: [
                { which_stat: "Dance", target: 'base', amount: 0.5 },
            ],

        },
    ],
    upgrades: [
        {
            trigger: upgrade_living_room,
            replace_all: true,
            add_actions: [
                {
                    name: 'Singing Practice+',
                    mastery_id: 'Singing Practice',
                    kind: 'training',
                    base_time: 30,
                    desc: "At least your cat won't faint anymore, that's what we call improvement.",
                    rewards: [
                        { which_stat: "Stamina", target: 'base', amount: 0.5 },
                        { which_stat: "Sing", target: 'base', amount: 5 },
                    ],

                },
                {
                    name: 'Dancing Practice+',
                    mastery_id: 'Dancing Practice',
                    kind: 'training',
                    base_time: 30,
                    desc: "No more kisses with the floor you just mopped. More calm, more peace. Going with the flow.",
                    rewards: [
                        { which_stat: "Stamina", target: 'base', amount: 0.5 },
                        { which_stat: "Dance", target: 'base', amount: 5 },
                    ],

                },
            ],
            on_trigger: () => {
                history.addSystemLog('Your Living Room upgraded to Living Room+, give it a check!');
            },
        },
    ],
};
