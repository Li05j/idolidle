import { history } from '$lib/state/history.svelte';
import { stat_list } from '$lib/state/stats.svelte';
import type { BasicStats } from '$lib/types';
import type { ActionDef, LocationDef } from './location_definition';

const LIVING_ROOM_UPGRADE_COST = 500;
const MINI_LOTTERY_COST = 50;
const OUTFIT_COST = 25;

function extra_mini_lottery() {
    const grade_thresholds = [0.12, 0.34, 0.56, 0.78, 1.0];
    const grades = ['S', 'A', 'B', 'C', 'D'];
    let r = Math.random();
    const grade_index = grade_thresholds.findIndex(t => r <= t);
    const grade = grades[grade_index];

    const stat_names: BasicStats[] = ['Fans', 'Moni', 'Stamina', 'Haste', 'Sing', 'Dance', 'Charm', 'Presence'];

    const loop = grade === 'S' ? 3 : 2;

    if (grade !== 'S') {
        history.addSystemLog(`You got some prizes!`);
    } else {
        history.addSystemLog(`...Is this the ultimate Idol luck!?!!?!`);
    }

    const grade_multiplier = [5, 4, 3, 2, 1];

    for (let i = 0; i < loop; i++) {
        r = Math.random();
        let index = Math.floor(r * grades.length);
        const stat_name = stat_names[index];
        const stat = stat_list[stat_name];

        r = Math.random();
        const w = r <= 0.5 ? 'base' : 'multi';

        if (w === 'base') {
            const range = [10, 15];
            let gain = Math.random() * (range[1] - range[0]) + range[0];
            gain *= grade_multiplier[grade_index];
            stat.base += gain;
            const actual_gain_str = stat.format_final_gain(gain);
            history.addSystemLog(`+${actual_gain_str} ${stat_name}!`);
        } else {
            const range = [0.01, 0.02];
            let gain = Math.random() * (range[1] - range[0]) + range[0];
            gain *= grade_multiplier[grade_index];
            stat.multi += gain;
            history.addSystemLog(`+${gain.toFixed(2)} ${stat_name} multi!`);
        }
    }
}

export const upgrade_living_room: ActionDef = {
    name: 'Upgrade Living Room',
    kind: 'spending',
    base_time: 60,
    no_drops: true,
    desc: "Tired of the shitty environment at home? Well, hopefully this little upgrade will make it better.",
    rewards: [],
    costs: [{ stat: 'Moni', amount: LIVING_ROOM_UPGRADE_COST }],
    uses: 1,
    requires: {
        text: `Moni ≥ ${LIVING_ROOM_UPGRADE_COST}`,
        is_met: () => stat_list.Moni.final >= LIVING_ROOM_UPGRADE_COST,
    },
};

export const mall: LocationDef = {
    name: 'Mall',
    base_time: 200,
    desc: "Bright lights, weird mannequins... way too many choices. Be careful, rumors say Moni vanishes if one stays for too long.",
    tutorial: "All Location cards and white Action cards will take less time to complete the more you do them. Keep up your trainings!",
    rewards: [
        { which_stat: "Stamina", target: 'base', amount: 10 },
    ],
    equip_drops: {
        chance: 0.05,
        table: [{ equip_id: 'designer_jacket', weight: 1 }],
    },
    unlocks: () => [],
    actions: [
        upgrade_living_room,
        {
            name: 'Mini Lottery',
            kind: 'spending',
            base_time: 10,
            no_drops: true,
            desc: "We do NOT encourage the behavior of gambling. You see, this is gacha, it's different.",
            rewards: [],
            costs: [{ stat: "Moni", amount: MINI_LOTTERY_COST }],
            uses: 1,
            requires: {
                text: `Moni ≥ ${MINI_LOTTERY_COST}`,
                is_met: () => stat_list.Moni.final >= MINI_LOTTERY_COST,
            },
            on_complete: {
                fn: extra_mini_lottery,
                desc: "Who knows what you will get...?",
            },
        },
        {
            name: 'Buy Cute Outfit',
            kind: 'spending',
            base_time: 3,
            desc: "Buy Buy Buy Spend Spend Spend... New clothes are always welcome.",
            rewards: [{ which_stat: "Charm", target: 'base', amount: 8 }],
            costs: [{ stat: "Moni", amount: OUTFIT_COST }],
            requires: {
                text: `Moni ≥ ${OUTFIT_COST}`,
                is_met: () => stat_list.Moni.final >= OUTFIT_COST,
            },
        },
        {
            name: 'Buy Cool Outfit',
            kind: 'spending',
            base_time: 3,
            desc: "Buy Buy Buy Spend Spend Spend... New clothes are always welcome.",
            rewards: [{ which_stat: "Presence", target: 'base', amount: 8 }],
            costs: [{ stat: "Moni", amount: OUTFIT_COST }],
            requires: {
                text: `Moni ≥ ${OUTFIT_COST}`,
                is_met: () => stat_list.Moni.final >= OUTFIT_COST,
            },
        },
    ],
};
