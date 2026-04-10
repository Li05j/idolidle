import type { EquipDef } from './equipment_definition';

export const park_equipment: EquipDef[] = [
    {
        id: 'buskers_cap',
        name: "Busker's Cap",
        slot: 'hat',
        desc: "A weathered cap from your street performing days. It still smells like loose change and determination.",
        stat_bonuses: [
            { stat: 'Haste', base_value: 0.3, target: 'base' },
            { stat: 'Charm', base_value: 0.3, target: 'base' },
        ],
        skill: {
            name: 'Underdog',
            triggers: ['turn_start'],
            chance: 1,
            cond_string: 'Your Fans < Rival Fans',
            eff_string: 'Your next move steals 50% more Fans.',
            condition: ({ you, rival }) => you.Fans < rival.Fans,
            effect: ({ you }) => {
                // Temporarily boost Sing and Dance by 50% for the next attack
                you.Sing *= 1.5;
                you.Dance *= 1.5;
            },
        },
    },
];
