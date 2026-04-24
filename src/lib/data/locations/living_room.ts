import { history } from '$lib/state/history.svelte';
import { simple_flat_stat_reward } from '$lib/utils/reward_helpers';
import { weighted_pick } from '$lib/utils/equip_drop';
import { EquipM } from '$lib/state/equipment.svelte';
import type { Rarity } from '$lib/data/equipment/equipment_definition';
import type { ActionDef, LocationDef } from './location_definition';
import { park } from './park';
import { school } from './school';

function extra_singing_practice() {
    let [is_success, value] = simple_flat_stat_reward("Sing", "base", "Good", 2.0);
    if (is_success) {
        history.addSystemLog(`Eureka! You found your voice! +${value} Sing!`);
    }
}

function extra_dancing_practice() {
    let [is_success, value] = simple_flat_stat_reward("Dance", "base", "Good", 2.0);
    if (is_success) {
        history.addSystemLog(`Eureka! You found your rhythm! +${value} Dance!`);
    }
}

const LIVING_ROOM_DROP_TABLE = [
    { equip_id: 'comfy_slippers', weight: 2 },
    { equip_id: 'monster_energy_drink', weight: 2 },
    { equip_id: 'teddy_plushie', weight: 2 },
    { equip_id: 'ballet_slippers', weight: 1 },
];

function rummage_the_couch() {
    const equip_id = weighted_pick(LIVING_ROOM_DROP_TABLE);
    const rarity: Rarity = Math.random() < 0.8 ? 'SR' : 'UR';
    EquipM.receive_equipment(equip_id, rarity);
}

const singing_practice: ActionDef = {
    name: 'Singing Practice',
    kind: 'training',
    base_time: 5,
    desc: "Your voice cracks. Your cat weeps. But somewhere in the noise, a star might be warming up.",
    rewards: [
        { which_stat: "Sing", target: 'base', amount: 0.5 },
    ],
};

const dancing_practice: ActionDef = {
    name: 'Dancing Practice',
    kind: 'training',
    base_time: 5,
    desc: "Limbs flail, rhythm fails, and then you trip yourself. Maybe the floor just hates you.",
    rewards: [
        { which_stat: "Dance", target: 'base', amount: 0.5 },
    ],
};

const singing_practice_plus: ActionDef = {
    name: 'Singing Practice+',
    mastery_id: 'Singing Practice',
    kind: 'training',
    base_time: 25,
    desc: "At least your cat won't faint anymore, that's what we call improvement.",
    rewards: [
        { which_stat: "Stamina", target: 'base', amount: 0.5 },
        { which_stat: "Sing", target: 'base', amount: 2.0 },
    ],
    on_complete: {
        fn: extra_singing_practice,
        desc: "Good chance to gain an extra 2.0 Sing.",
    },
};

const dancing_practice_plus: ActionDef = {
    name: 'Dancing Practice+',
    mastery_id: 'Dancing Practice',
    kind: 'training',
    base_time: 25,
    desc: "No more kisses with the floor you just mopped. More calm, more peace. Going with the flow.",
    rewards: [
        { which_stat: "Stamina", target: 'base', amount: 0.5 },
        { which_stat: "Dance", target: 'base', amount: 2.0 },
    ],
    on_complete: {
        fn: extra_dancing_practice,
        desc: "Good chance to gain an extra 2.0 Dance.",
    },
};

const rummage_the_couch_action: ActionDef = {
    name: 'Rummage the Couch',
    kind: 'training',
    base_time: 15,
    no_drops: true,
    desc: "Now that the place is fixed up, maybe there's treasure buried between the cushions. One last dig before the cleaner takes it all away.",
    rewards: [],
    uses: 1,
    on_complete: {
        fn: rummage_the_couch,
        desc: "Hmm, I wonder what you will find...?",
    },
};

const living_room_plus: LocationDef = {
    name: 'Living Room',
    base_time: 4,
    desc: "The first stage of your idol career, or maybe just where socks mysteriously vanish. Sing off-key, dance like a disaster—no one's watching (except maybe the cat). Meow.",
    rewards: [
        { which_stat: "Stamina", target: 'base', amount: 0.2 },
    ],
    equip_drops: {
        chance: 0.08,
        table: LIVING_ROOM_DROP_TABLE,
    },
    unlocks: () => [park, school],
    actions: [rummage_the_couch_action, singing_practice_plus, dancing_practice_plus,],
};

export const living_room: LocationDef = {
    name: 'Living Room',
    base_time: 4,
    desc: "The first stage of your idol career, or maybe just where socks mysteriously vanish. Sing off-key, dance like a disaster—no one's watching (except maybe the cat). Meow.",
    rewards: [
        { which_stat: "Stamina", target: 'base', amount: 0.2 },
    ],
    equip_drops: {
        chance: 0.05,
        table: LIVING_ROOM_DROP_TABLE,
    },
    unlocks: () => [park, school],
    actions: [singing_practice, dancing_practice],
    upgrades: [
        {
            trigger: 'Upgrade Living Room',
            upgrade_to: living_room_plus,
            on_trigger: () => {
                history.addSystemLog('Your Living Room upgraded to Living Room+, give it a check!');
            },
        },
    ],
};
