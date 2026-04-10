import type { EquipDef } from './equipment_definition';

export const mall_equipment: EquipDef[] = [
    {
        id: 'designer_jacket',
        name: 'Designer Jacket',
        slot: 'top',
        desc: "Flashy, expensive, and turns heads. Exactly what an idol needs to make a statement before the show even starts.",
        stat_bonuses: [
            { stat: 'Charm', base_value: 0.5, target: 'base' },
            { stat: 'Presence', base_value: 0.3, target: 'base' },
        ],
        skill: {
            name: 'Flashy Outfit',
            triggers: ['live_start'],
            chance: 1,
            cond_string: 'Always',
            eff_string: 'Reduce Rival Stamina by 10%.',
            condition: () => true,
            effect: ({ rival }) => {
                const drain = rival.Max_Stamina * 0.1;
                rival.Curr_Stamina = Math.max(0, rival.Curr_Stamina - drain);
            },
        },
    },
];
