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
                    { stat: 'Sing', base_value: 2.5, target: 'base' },
                    { stat: 'Dance', base_value: 2.5, target: 'base' },
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
                    { stat: 'Sing', base_value: 6.5, target: 'base' },
                    { stat: 'Presence', base_value: 1.5, target: 'base' },
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
                    { stat: 'Moni', base_value: 0.04, target: 'multi' },
                    { stat: 'Presence', base_value: 9.0, target: 'base' },
                ],
                skill_id: 'flashy',
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
                    { stat: 'Haste', base_value: 4.5, target: 'base' },
                    { stat: 'Charm', base_value: 1.0, target: 'base' },
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
                    { stat: 'Charm', base_value: 6.0, target: 'base' },
                ],
                skill_id: 'moe_kyun',
            },
        },
    },

        // ??? — unsorted brainstorm equips
    {
        id: 'monster_energy_drink',
        name: 'M*****r Energy Drink',
        slot: 'accessory',
        desc: "Tastes like regret and aluminum. Keeps you upright through the encore.",
        variants: {
            N: {
                stat_bonuses: [
                    { stat: 'Stamina', base_value: 4.0, target: 'base' },
                    { stat: 'Haste', base_value: 2.0, target: 'base' },
                ],
                skill_id: 'final_burst',
            },
        },
    },
    {
        id: 'archaic_tiara',
        name: 'Archaic Tiara',
        slot: 'hat',
        desc: "Worn by chart-toppers before you. The weight is heavier than it looks.",
        variants: {
            N: {
                stat_bonuses: [
                    { stat: 'Sing', base_value: 1.5, target: 'base' },
                    { stat: 'Sing', base_value: 0.02, target: 'multi' },
                    { stat: 'Dance', base_value: 1.5, target: 'base' },
                    { stat: 'Dance', base_value: 0.02, target: 'multi' },
                ],
                skill_id: 'old_fashioned',
            },
        },
    },
    {
        id: 'vintage_sneakers',
        name: 'Vintage Sneakers',
        slot: 'shoes',
        desc: "Scuffed but reliable. They've walked more practice rooms than you've had hot meals.",
        variants: {
            N: {
                stat_bonuses: [
                    { stat: 'Haste', base_value: 1.5, target: 'base' },
                    { stat: 'Haste', base_value: 0.01, target: 'multi' },
                    { stat: 'Dance', base_value: 1.5, target: 'base' },
                ],
                skill_id: 'seasoned_runner',
            },
        },
    },
    {
        id: 'teddy_plushie',
        name: 'Teddy Plushie',
        slot: 'accessory',
        desc: "An ugly little bear that came free with your first single. You can't bring yourself to throw it out.",
        variants: {
            N: {
                stat_bonuses: [
                    { stat: 'Charm', base_value: 4.0, target: 'base' },
                ],
                skill_id: 'crybaby',
            },
        },
    },
    {
        id: 'glittery_tights',
        name: 'Glittery Tights',
        slot: 'bottom',
        desc: "They shed glitter EVERYWHERE. Your manager has stopped complaining about the dressing room.",
        variants: {
            N: {
                stat_bonuses: [
                    { stat: 'Presence', base_value: 3.5, target: 'base' },
                    { stat: 'Dance', base_value: 3.5, target: 'base' },
                ],
                skill_id: 'showstopper',
            },
        },
    },
    {
        id: 'rivals_old_hoodie',
        name: "Rival's Old Hoodie",
        slot: 'top',
        desc: "Found in a thrift bin. Smells faintly of someone you once admired. Or hated. Both, maybe.",
        variants: {
            N: {
                stat_bonuses: [
                    { stat: 'Sing', base_value: 2.0, target: 'base' },
                    { stat: 'Charm', base_value: 2.0, target: 'base' },
                ],
                skill_id: 'scandal_magnet',
            },
        },
    },
    {
        id: 'lozenges',
        name: "Lozenges",
        slot: 'accessory',
        desc: "1",
        variants: {
            N: {
                stat_bonuses: [
                    { stat: 'Sing', base_value: 5.0, target: 'base' },
                ],
                // skill_id: 'scandal_magnet',
            },
        },
    },
    {
        id: 'ballet_slippers',
        name: "Ballet Slippers",
        slot: 'shoes',
        desc: "1",
        variants: {
            N: {
                stat_bonuses: [
                    { stat: 'Haste', base_value: 2.0, target: 'base' },
                    { stat: 'Dance', base_value: 4.0, target: 'base' },
                    { stat: 'Dance', base_value: 0.01, target: 'multi' },
                ],
                // skill_id: 'scandal_magnet',
            },
        },
    },
    
];
