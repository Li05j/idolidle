import type { EquipDef } from './equipment_definition';

export const living_room_equipment: EquipDef[] = [
    {
        id: 'comfy_slippers',
        name: 'Comfy Slippers',
        slot: 'shoes',
        desc: "Worn-out slippers from home. They remind you to take it easy sometimes.",
        stat_bonuses: [
            { stat: 'Stamina', base_value: 0.5, target: 'base' },
        ],
        skill: {
            name: 'Go-Home Club',
            triggers: ['turn_start'],
            chance: 1,
            cond_string: 'Stamina < 25%',
            eff_string: 'Restore 25% Stamina.',
            condition: ({ you }) => you.Curr_Stamina < you.Max_Stamina * 0.25,
            effect: ({ you }) => { you.Curr_Stamina = Math.min(you.Max_Stamina, you.Curr_Stamina + you.Max_Stamina * 0.25); },
        },
    },
];
