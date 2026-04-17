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
                skill: {
                    name: 'Go-Home Club',
                    triggers: ['turn_start'],
                    chance: 0.5,
                    values: { threshold: 0.25, restore: 0.25 },
                    cond_string: (v) => `Stamina < ${v.threshold * 100}%`,
                    eff_string: (v) => `Restore ${v.restore * 100}% Stamina.`,
                    condition: ({ you, values: v }) => you.Curr_Stamina < you.Max_Stamina * v.threshold,
                    effect: ({ you, log, values: v }) => {
                        const before = you.Curr_Stamina;
                        you.Curr_Stamina = Math.min(you.Max_Stamina, you.Curr_Stamina + you.Max_Stamina * v.restore);
                        log(`Recovered ${Math.round(you.Curr_Stamina - before)} Stamina!`);
                    },
                },
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
                skill: {
                    name: 'Underdog',
                    triggers: ['turn_start'],
                    chance: 0.5,
                    values: { buff: 1.5 },
                    cond_string: 'Your Fans < Rival Fans',
                    eff_string: (v) => `Your next move steals ${(v.buff - 1) * 100}% more Fans.`,
                    condition: ({ you, rival }) => you.Fans < rival.Fans,
                    effect: ({ you, apply_temp_buff, log, values: v }) => {
                        apply_temp_buff!('you', 'Sing', you.Sing * v.buff);
                        apply_temp_buff!('you', 'Dance', you.Dance * v.buff);
                        log(`You're fired up! Your next move hits harder!`);
                    },
                },
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
                skill: {
                    name: 'Idol Executive',
                    triggers: ['live_start'],
                    chance: 1,
                    values: { drain: 0.1 },
                    cond_string: 'Always',
                    eff_string: (v) => `Drain ${v.drain * 100}% Fans from Rival before LIVE starts.`,
                    condition: () => true,
                    effect: ({ you, rival, log, values: v }) => {
                        const drain = Math.floor(rival.Fans * v.drain);
                        rival.Fans -= drain;
                        you.Fans += drain;
                        log(`Drained ${drain} Fans from your Rival!`);
                    },
                },
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
                skill: {
                    name: 'Good Student',
                    triggers: ['before_taking_dmg'],
                    chance: 0.2,
                    values: { reduction: 0.5 },
                    cond_string: 'Rival performs a move.',
                    eff_string: (v) => `Reduce Fans loss by ${v.reduction * 100}%.`,
                    condition: () => true,
                    effect: ({ set_dmg_reduction, log, values: v }) => {
                        set_dmg_reduction?.(v.reduction);
                        log(`You stood unwavering. Fans loss is mitigated!`);
                    },
                },
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
                skill: {
                    name: 'Flashy Outfit',
                    triggers: ['live_start'],
                    chance: 1,
                    values: { drain: 0.1 },
                    cond_string: 'Always',
                    eff_string: (v) => `Reduce Rival Stamina by ${v.drain * 100}%.`,
                    condition: () => true,
                    effect: ({ rival, log, values: v }) => {
                        const before = rival.Curr_Stamina;
                        const drain = rival.Max_Stamina * v.drain;
                        rival.Curr_Stamina = Math.max(0, rival.Curr_Stamina - drain);
                        log(`Sapped ${Math.round(before - rival.Curr_Stamina)} Stamina from your Rival!`);
                    },
                },
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
                skill: {
                    name: 'Moe Kyun~!',
                    triggers: ['before_taking_dmg'],
                    chance: 0.25,
                    values: { charm_buff: 1.5, penalty: 0.1 },
                    cond_string: 'Rival performs a Sing move.',
                    eff_string: (v) => `Increase Charm by ${(v.charm_buff - 1) * 100}%. If Rival fails to steal Fans, Rival loses ${v.penalty * 100}% Fans.`,
                    condition: ({ atk_type }) => atk_type === 'Sing',
                    effect: ({ you, rival, apply_temp_buff, on_after_attack, log, values: v }) => {
                        apply_temp_buff!('you', 'Charm', you.Charm * v.charm_buff);
                        log(`Moe Kyun~! Your Charm soars!`);
                        on_after_attack!((fans_stolen) => {
                            if (fans_stolen <= 0) {
                                const pen = Math.floor(rival.Fans * v.penalty);
                                rival.Fans -= pen;
                                log(`Rival's attempt was BOO'd instead! Drained ${pen} Fans!`);
                            }
                        });
                    },
                },
            },
        },
    },
];
