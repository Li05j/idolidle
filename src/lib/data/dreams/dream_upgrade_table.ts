import type { DreamUpgradeDef } from './dream_upgrade_definition';
import type { BasicStats } from '$lib/types';

const STATS: BasicStats[] = ['Fans', 'Moni', 'Stamina', 'Haste', 'Sing', 'Dance', 'Charm', 'Presence'];

function stat_base(stat: BasicStats): DreamUpgradeDef {
    return {
        id: `base_${stat.toLowerCase()}`,
        name: `${stat} Base`,
        desc: `+2.0 initial ${stat} base per level`,
        max_level: 25,
        effect_per_level: 2.0,
        base_cost: 1,
        category: 'stat_base',
        stat,
    };
}

function stat_multi(stat: BasicStats): DreamUpgradeDef {
    return {
        id: `multi_${stat.toLowerCase()}`,
        name: `${stat} Multi`,
        desc: `+0.02 initial ${stat} multiplier per level`,
        max_level: 25,
        effect_per_level: 0.02,
        base_cost: 3,
        category: 'stat_multi',
        stat,
    };
}

export const ALL_DREAM_UPGRADES: DreamUpgradeDef[] = [
    // Time reductions
    {
        id: 'time_location',
        name: 'Swift Travel',
        desc: 'Reduce location card base time by 1% per level',
        max_level: 25,
        effect_per_level: 0.02,
        base_cost: 2,
        category: 'time_reduction',
    },
    {
        id: 'time_training',
        name: 'Quick Training',
        desc: 'Reduce training card base time by 1% per level',
        max_level: 25,
        effect_per_level: 0.02,
        base_cost: 2,
        category: 'time_reduction',
    },
    {
        id: 'time_earning',
        name: 'Efficient Work',
        desc: 'Reduce earning/spending card base time by 1% per level',
        max_level: 25,
        effect_per_level: 0.02,
        base_cost: 2,
        category: 'time_reduction',
    },

    // Stat base upgrades
    ...STATS.map(stat_base),

    // Stat multi upgrades
    ...STATS.map(stat_multi),

    // Equipment drop rate
    {
        id: 'equip_drop_rate',
        name: 'Lucky Finds',
        desc: 'Equipment drop rate +10% per level',
        max_level: 10,
        effect_per_level: 0.10,
        base_cost: 5,
        category: 'equip_drop',
    },
];
