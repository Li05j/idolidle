import { history } from '$lib/state/history.svelte';
import { stat_list, stat_list_get } from '$lib/state/stats.svelte';
import type { BasicStats } from '$lib/types';
import type { LocationDefinition } from './location_definition';

const LIVING_ROOM_UPGRADE_COST = 500;
const MINI_LOTTERY_COST = 50;
const OUTFIT_COST = 25;

function extra_mini_lottery() {
    const grade_thresholds = [0.05, 0.2, 0.5, 0.75, 1.0];
    const grades = ['S', 'A', 'B', 'C', 'D'];
    let r = Math.random();
    const grade_index = grade_thresholds.findIndex(t => r <= t);
    const grade = grades[grade_index];

    const stat_names: BasicStats[] = ['Fans', 'Moni', 'Stamina', 'Haste', 'Sing', 'Dance', 'Charm', 'Presence'];

    const loop = grade === 'S' ? 3 : 2;

    if (grade !== 'S') {
        history.addHintLogs(`You got some prizes!`);
    } else {
        history.addHintLogs(`...Is this the ultimate Idol luck!?!!?!`);
    }

    const grade_multiplier = [4, 4, 3, 2, 1];

    for (let i = 0; i < loop; i++) {
        r = Math.random();
        let index = Math.floor(r * grades.length);
        const stat_name = stat_names[index];
        const stat = stat_list_get(stat_name);

        r = Math.random();
        const w = r <= 0.5 ? 'base' : 'multi';

        if (w === 'base') {
            const range = [10, 15];
            let gain = Math.random() * (range[1] - range[0]) + range[0];
            gain *= grade_multiplier[grade_index];
            stat.base += gain;
            const actual_gain_str = stat.get_final_gain_str(gain);
            history.addHintLogs(`+${actual_gain_str} ${stat_name}!`);
        } else {
            const range = [0.01, 0.02];
            let gain = Math.random() * (range[1] - range[0]) + range[0];
            gain *= grade_multiplier[grade_index];
            stat.multi += gain;
            history.addHintLogs(`+${gain.toFixed(2)} ${stat_name} multi!`);
        }
    }
}

export const mall: LocationDefinition = {
    location: {
        name: 'Mall',
        base_time: 200,
        desc: "Bright lights, weird mannequins... way too many choices. Be careful, rumors say Moni vanishes if one stays for too long.",
        tooltip: {
            custom_msg: "All Location cards and white Action cards relies on Haste. The more Haste you have, the less time it takes for it to complete."
        },
        rewards: [
            { which_stat: "Stamina", flat_gain_base: 10 },
        ],
    },
    unlocks: [],
    actions: [
        {
            name: 'Upgrade Living Room',
            type: 'spend_currency',
            base_time: 60,
            desc: "Tired of the shitty environment at home? Well, hopefully this little upgrade will make it better.",
            tooltip: { prereq: `Moni ≥ ${LIVING_ROOM_UPGRADE_COST}` },
            rewards: [],
            spendings: [{ stat_name: 'Moni', value: LIVING_ROOM_UPGRADE_COST }],
            one_off: true,
            check_disabled_fn: () => stat_list.Moni.final < LIVING_ROOM_UPGRADE_COST,
        },
        {
            name: 'Mini Lottery',
            type: 'spend_currency',
            base_time: 10,
            desc: "We do NOT encourage the behavior of gambling. You see, this is gacha, it's different.",
            tooltip: {
                prereq: `Moni ≥ ${MINI_LOTTERY_COST}`,
                eureka: "Who knows what you will get...?"
            },
            rewards: [],
            spendings: [{ stat_name: "Moni", value: MINI_LOTTERY_COST }],
            one_off: true,
            extra_reward_fn: extra_mini_lottery,
            check_disabled_fn: () => stat_list.Moni.final < MINI_LOTTERY_COST,
        },
        {
            name: 'Buy Cute Outfit',
            type: 'spend_currency',
            base_time: 3,
            desc: "Buy Buy Buy Spend Spend Spend... New clothes are always welcome.",
            tooltip: { prereq: `Moni ≥ ${OUTFIT_COST}` },
            rewards: [{ which_stat: "Charm", flat_gain_base: 8 }],
            spendings: [{ stat_name: "Moni", value: OUTFIT_COST }],
            check_disabled_fn: () => stat_list.Moni.final < OUTFIT_COST,
        },
        {
            name: 'Buy Cool Outfit',
            type: 'spend_currency',
            base_time: 3,
            desc: "Buy Buy Buy Spend Spend Spend... New clothes are always welcome.",
            tooltip: { prereq: `Moni ≥ ${OUTFIT_COST}` },
            rewards: [{ which_stat: "Presence", flat_gain_base: 8 }],
            spendings: [{ stat_name: "Moni", value: OUTFIT_COST }],
            check_disabled_fn: () => stat_list.Moni.final < OUTFIT_COST,
        },
    ],
    upgrades: [
        {
            trigger_action: 'Mini Lottery',
        },
    ],
};
