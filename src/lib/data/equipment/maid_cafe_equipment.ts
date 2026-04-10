import type { EquipDef } from './equipment_definition';

export const maid_cafe_equipment: EquipDef[] = [
    {
        id: 'cat_ear_headband',
        name: 'Cat Ear Headband',
        slot: 'hat',
        desc: "Nya~ It's embarrassing, but the fans absolutely love it. Meow.",
        stat_bonuses: [
            { stat: 'Charm', base_value: 0.5, target: 'base' },
            { stat: 'Dance', base_value: 0.2, target: 'base' },
        ],
        skill: {
            name: 'Moe Kyun~!',
            triggers: ['before_taking_dmg'],
            chance: 1,
            cond_string: 'Rival performs a Sing move.',
            eff_string: 'Increase Charm by 50%. If Rival fails to steal Fans, Rival loses 10% Fans.',
            condition: () => true,
            effect: ({ you }) => {
                // Boost charm for this defense check
                you.Charm *= 1.5;
                // The "rival loses 10% fans on fail" part is handled in battle manager
                // after damage calculation, when damage <= 0
            },
        },
    },
];
