import type { EquipDef } from './equipment_definition';

export const ALL_EQUIPMENT: EquipDef[] = [
    // Living Room
    {
        id: 'comfy_slippers',
        name: 'Comfy Slippers',
        slot: 'shoes',
        desc: "Worn-out slippers from home. They remind you to take it easy sometimes.",
        variants: {
            N: {
                stat_bonuses: [
                    { stat: 'Stamina', base_value: 5.0, target: 'base' },
                ],
                skill_id: 'go_home_club',
            },
        },
    },

    // Park
    {
        id: 'buskers_cap',
        name: "Busker's Cap",
        slot: 'hat',
        desc: "A weathered cap from your street performing days. It still smells like loose change and determination.",
        variants: {
            N: {
                stat_bonuses: [
                    { stat: 'Sing', base_value: 1.5, target: 'base' },
                    { stat: 'Dance', base_value: 1.5, target: 'base' },
                ],
                skill_id: 'underdog',
            },
        },
    },

    // School
    {
        id: 'stage_microphone',
        name: 'Stage Microphone',
        slot: 'accessory',
        desc: "The first mic you ever used on a real stage. It crackles sometimes, but the memories are crystal clear.",
        variants: {
            N: {
                stat_bonuses: [
                    { stat: 'Sing', base_value: 5.0, target: 'base' },
                    { stat: 'Presence', base_value: 2.5, target: 'base' },
                ],
                skill_id: 'idol_executive',
            },
        },
    },
    {
        id: 'reading_glasses',
        name: 'Reading Glasses',
        slot: 'accessory',
        desc: "Studious and stylish. They make you look like you know what you're doing (you don't, but they don't know that).",
        variants: {
            N: {
                stat_bonuses: [
                    { stat: 'Sing', base_value: 1.5, target: 'base' },
                    { stat: 'Dance', base_value: 1.5, target: 'base' },
                    { stat: 'Charm', base_value: 1.5, target: 'base' },
                    { stat: 'Presence', base_value: 1.5, target: 'base' },
                ],
                skill_id: 'good_student',
            },
        },
    },

    // Mall
    {
        id: 'designer_jacket',
        name: 'Designer Jacket',
        slot: 'top',
        desc: "Flashy, expensive, and turns heads. Exactly what an idol needs to make a statement before the show even starts.",
        variants: {
            N: {
                stat_bonuses: [
                    { stat: 'Moni', base_value: 0.02, target: 'multi' },
                    { stat: 'Presence', base_value: 3.0, target: 'base' },
                ],
                skill_id: 'flashy_outfit',
            },
        },
    },

    // Gym
    {
        id: 'training_shorts',
        name: 'Training Shorts',
        slot: 'bottom',
        desc: "Light, breathable, and somehow always in the laundry when you need them.",
        variants: {
            N: {
                stat_bonuses: [
                    { stat: 'Stamina', base_value: 0.5, target: 'base' },
                    { stat: 'Haste', base_value: 7.5, target: 'base' },
                ],
            },
        },
    },

    // Maid Cafe
    {
        id: 'cat_ear_headband',
        name: 'Cat Ear Headband',
        slot: 'hat',
        desc: "Nya~ It's embarrassing, but the fans absolutely love it. Meow.",
        variants: {
            N: {
                stat_bonuses: [
                    { stat: 'Charm', base_value: 5.0, target: 'base' },
                    { stat: 'Dance', base_value: 1.0, target: 'base' },
                ],
                skill_id: 'moe_kyun',
            },
        },
    },
];
