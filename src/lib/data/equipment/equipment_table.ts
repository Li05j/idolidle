import type { EquipDef } from './equipment_definition';

export const ALL_EQUIPMENT: EquipDef[] = [
    // Living Room
    {
        id: 'comfy_slippers',
        name: 'Comfy Slippers',
        slot: 'shoes',
        desc: "Worn-out slippers from home. They remind you to take it easy sometimes.",
        stat_bonuses: [
            { stat: 'Stamina', base_value: 5.0, target: 'base' },
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

    // Park
    {
        id: 'buskers_cap',
        name: "Busker's Cap",
        slot: 'hat',
        desc: "A weathered cap from your street performing days. It still smells like loose change and determination.",
        stat_bonuses: [
            { stat: 'Sing', base_value: 1.5, target: 'base' },
            { stat: 'Dance', base_value: 1.5, target: 'base' },
        ],
        skill: {
            name: 'Underdog',
            triggers: ['turn_start'],
            chance: 1,
            cond_string: 'Your Fans < Rival Fans',
            eff_string: 'Your next move steals 50% more Fans.',
            condition: ({ you, rival }) => you.Fans < rival.Fans,
            effect: ({ you, apply_temp_buff }) => {
                apply_temp_buff!('you', 'Sing', you.Sing * 1.5);
                apply_temp_buff!('you', 'Dance', you.Dance * 1.5);
            },
        },
    },

    // School
    {
        id: 'stage_microphone',
        name: 'Stage Microphone',
        slot: 'accessory',
        desc: "The first mic you ever used on a real stage. It crackles sometimes, but the memories are crystal clear.",
        stat_bonuses: [
            { stat: 'Sing', base_value: 5.0, target: 'base' },
            { stat: 'Presence', base_value: 2.5, target: 'base' },
        ],
        skill: {
            name: 'Idol Executive',
            triggers: ['live_start'],
            chance: 1,
            cond_string: 'Always',
            eff_string: 'Drain 10% Fans from Rival before LIVE starts.',
            condition: () => true,
            effect: ({ you, rival }) => {
                const drain = Math.floor(rival.Fans * 0.1);
                rival.Fans -= drain;
                you.Fans += drain;
            },
        },
    },
    {
        id: 'reading_glasses',
        name: 'Reading Glasses',
        slot: 'accessory',
        desc: "Studious and stylish. They make you look like you know what you're doing (you don't, but they don't know that).",
        stat_bonuses: [
            { stat: 'Sing', base_value: 1.5, target: 'base' },
            { stat: 'Dance', base_value: 1.5, target: 'base' },
            { stat: 'Charm', base_value: 1.5, target: 'base' },
            { stat: 'Presence', base_value: 1.5, target: 'base' },
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

    // Mall
    {
        id: 'designer_jacket',
        name: 'Designer Jacket',
        slot: 'top',
        desc: "Flashy, expensive, and turns heads. Exactly what an idol needs to make a statement before the show even starts.",
        stat_bonuses: [
            { stat: 'Moni', base_value: 0.02, target: 'multi' },
            { stat: 'Presence', base_value: 3.0, target: 'base' },
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

    // Gym
    {
        id: 'training_shorts',
        name: 'Training Shorts',
        slot: 'bottom',
        desc: "Light, breathable, and somehow always in the laundry when you need them.",
        stat_bonuses: [
            { stat: 'Stamina', base_value: 0.5, target: 'base' },
            { stat: 'Haste', base_value: 7.5, target: 'base' },
        ],
    },

    // Maid Cafe
    {
        id: 'cat_ear_headband',
        name: 'Cat Ear Headband',
        slot: 'hat',
        desc: "Nya~ It's embarrassing, but the fans absolutely love it. Meow.",
        stat_bonuses: [
            { stat: 'Charm', base_value: 5.0, target: 'base' },
            { stat: 'Dance', base_value: 1.0, target: 'base' },
        ],
        skill: {
            name: 'Moe Kyun~!',
            triggers: ['before_taking_dmg'],
            chance: 1,
            cond_string: 'Rival performs a Sing move.',
            eff_string: 'Increase Charm by 50%. If Rival fails to steal Fans, Rival loses 10% Fans.',
            condition: ({ atk_type }) => atk_type === 'Sing',
            effect: ({ you, rival, apply_temp_buff, on_after_attack }) => {
                apply_temp_buff!('you', 'Charm', you.Charm * 1.5);
                on_after_attack!((fans_stolen) => {
                    if (fans_stolen <= 0) {
                        const penalty = Math.floor(rival.Fans * 0.1);
                        rival.Fans -= penalty;
                    }
                });
            },
        },
    },
];
