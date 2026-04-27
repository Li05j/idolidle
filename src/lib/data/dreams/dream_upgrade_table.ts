import type { DreamUpgradeDef } from './dream_upgrade_definition';
import { BASIC_STATS, type BasicStats } from '$lib/types';

function stat_base(stat: BasicStats): DreamUpgradeDef {
    return {
        id: `base_${stat.toLowerCase()}`,
        name: `${stat} Base`,
        desc: `+6.0 initial ${stat} base per level`,
        max_level: 50,
        effect_per_level: 6.0,
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
        max_level: 50,
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
        desc: 'Reduce location card base time by 3% per level',
        max_level: 20,
        effect_per_level: 0.03,
        base_cost: 3,
        category: 'time_reduction',
    },
    {
        id: 'time_training',
        name: 'Quick Training',
        desc: 'Reduce training card base time by 3% per level',
        max_level: 20,
        effect_per_level: 0.03,
        base_cost: 3,
        category: 'time_reduction',
    },
    {
        id: 'time_earning',
        name: 'Efficient Work',
        desc: 'Reduce earning/spending card base time by 3% per level',
        max_level: 20,
        effect_per_level: 0.03,
        base_cost: 3,
        category: 'time_reduction',
    },

    // Stat base upgrades
    ...BASIC_STATS.map(stat_base),

    // Stat multi upgrades
    ...BASIC_STATS.map(stat_multi),

    // Equipment drop rate
    {
        id: 'equip_drop_rate',
        name: 'Lucky Finds',
        desc: 'Equipment drop rate +15% per level',
        max_level: 10,
        effect_per_level: 0.15,
        base_cost: 5,
        category: 'equip_drop',
    },
];
