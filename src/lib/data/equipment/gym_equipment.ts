import type { EquipDef } from './equipment_definition';

export const gym_equipment: EquipDef[] = [
    {
        id: 'training_shorts',
        name: 'Training Shorts',
        slot: 'bottom',
        desc: "Light, breathable, and somehow always in the laundry when you need them.",
        stat_bonuses: [
            { stat: 'Stamina', base_value: 0.5, target: 'base' },
            { stat: 'Haste', base_value: 0.3, target: 'base' },
        ],
    },
];
