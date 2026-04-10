import type { EquipDef } from './equipment_definition';

export const school_equipment: EquipDef[] = [
    {
        id: 'stage_microphone',
        name: 'Stage Microphone',
        slot: 'accessory',
        desc: "The first mic you ever used on a real stage. It crackles sometimes, but the memories are crystal clear.",
        stat_bonuses: [
            { stat: 'Sing', base_value: 0.5, target: 'base' },
            { stat: 'Presence', base_value: 0.3, target: 'base' },
        ],
        skill: {
            name: 'Idol Executive',
            triggers: ['live_start'],
            chance: 1,
            cond_string: 'Always',
            eff_string: 'Drain 10% Fans from Rival before LIVE starts.',
            condition: () => true,
            effect: ({ rival }) => {
                const drain = Math.floor(rival.Fans * 0.1);
                rival.Fans -= drain;
            },
        },
    },
    {
        id: 'reading_glasses',
        name: 'Reading Glasses',
        slot: 'accessory',
        desc: "Studious and stylish. They make you look like you know what you're doing (you don't, but they don't know that).",
        stat_bonuses: [
            { stat: 'Dance', base_value: 0.3, target: 'base' },
            { stat: 'Charm', base_value: 0.3, target: 'base' },
        ],
        skill: {
            name: 'Good Student',
            triggers: ['before_taking_dmg'],
            chance: 1,
            cond_string: 'Rival performs a move.',
            eff_string: 'Reduce Fans loss by 50%.',
            condition: () => true,
            effect: ({ set_dmg_reduction }) => {
                set_dmg_reduction?.(0.5);
            },
        },
    },
];
