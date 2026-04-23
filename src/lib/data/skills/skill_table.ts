import type { SkillDef } from './skill_definition';

export const ALL_SKILLS: SkillDef[] = [
    {
        id: 'go_home_club',
        name: 'Go-Home Club',
        triggers: ['after_inflicting_dmg'],
        chance: 0.5,
        values: { threshold: 0.25, restore: 0.25 },
        cond_string: (v) => `Stamina < ${v.threshold * 100}%`,
        eff_string: (v) => `Restore ${v.restore * 100}% Stamina.`,
        condition: ({ you, values: v }) => you.Curr_Stamina < you.Max_Stamina * v.threshold,
        effect: ({ you, log, values: v }) => {
            const before = you.Curr_Stamina;
            you.Curr_Stamina = Math.min(you.Max_Stamina, you.Curr_Stamina + you.Max_Stamina * v.restore);
            log(`Go-Home Club: Recovered ${Math.round(you.Curr_Stamina - before)} Stamina!`);
        },
    },
    {
        id: 'underdog',
        name: 'Underdog',
        triggers: ['before_inflicting_dmg'],
        chance: 0.35,
        values: { buff: 1.5 },
        cond_string: '{Self_poss} Fans < {opp_poss} Fans',
        eff_string: (v) => `{Self_poss} next move steals ${(v.buff - 1) * 100}% more Fans.`,
        condition: ({ you, rival }) => you.Fans < rival.Fans,
        effect: ({ you, apply_temp_buff, log, values: v }) => {
            apply_temp_buff!('you', 'Sing', you.Sing * v.buff);
            apply_temp_buff!('you', 'Dance', you.Dance * v.buff);
            log(`Underdog: {Self} got fired up! {Self_poss} next move hits harder!`);
        },
    },
    {
        id: 'idol_executive',
        name: 'Idol Executive',
        triggers: ['live_start'],
        chance: 1,
        values: { drain: 0.1 },
        cond_string: 'Always',
        eff_string: (v) => `Drain ${v.drain * 100}% Fans from {Opp} before LIVE starts.`,
        condition: () => true,
        effect: ({ you, rival, log, values: v }) => {
            const drain = Math.floor(rival.Fans * v.drain);
            rival.Fans -= drain;
            you.Fans += drain;
            log(`Idol Executive: Drained ${drain} Fans from {Opp_poss} stash!`);
        },
    },
    {
        id: 'good_student',
        name: 'Good Student',
        triggers: ['before_taking_dmg'],
        chance: 0.25,
        values: { reduction: 0.75 },
        cond_string: '{Opp} performs a move.',
        eff_string: (v) => `Reduce Fans loss by ${v.reduction * 100}%.`,
        condition: () => true,
        effect: ({ set_dmg_reduction, log, values: v }) => {
            set_dmg_reduction?.(v.reduction);
            log(`Good Student: {Self} stood unwavering. Fans loss is reduced!`);
        },
    },
    {
        id: 'flashy',
        name: 'Flashy',
        triggers: ['live_start'],
        chance: 1,
        values: { drain: 0.1 },
        cond_string: 'Always',
        eff_string: (v) => `Reduce {Opp_poss} Stamina by ${v.drain * 100}%.`,
        condition: () => true,
        effect: ({ rival, log, values: v }) => {
            const before = rival.Curr_Stamina;
            const drain = rival.Max_Stamina * v.drain;
            rival.Curr_Stamina = Math.max(0, rival.Curr_Stamina - drain);
            log(`Flashy: Sapped ${Math.round(before - rival.Curr_Stamina)} Stamina from {Opp}!`);
        },
    },
    {
        id: 'moe_kyun',
        name: 'Moe Kyun~!',
        triggers: ['before_taking_dmg'],
        chance: 0.25,
        values: { charm_buff: 1.5, penalty: 0.1 },
        cond_string: '{Opp} performs a Sing move.',
        eff_string: (v) => `Increase Charm by ${(v.charm_buff - 1) * 100}% for 1 turn. If {opp} fails to steal Fans, {opp} loses ${v.penalty * 100}% Fans.`,
        condition: ({ atk_type }) => atk_type === 'Sing',
        effect: ({ you, rival, apply_temp_buff, on_after_attack, log, values: v }) => {
            apply_temp_buff!('you', 'Charm', you.Charm * v.charm_buff);
            log(`Moe Kyun~!: {Self_poss} Charm soars!`);
            on_after_attack!((fans_stolen) => {
                if (fans_stolen <= 0) {
                    const pen = Math.floor(rival.Fans * v.penalty);
                    rival.Fans -= pen;
                    log(`{Opp_poss} attempt was BOO'd instead! Drained ${pen} Fans!`);
                }
            });
        },
    },
    {
        id: 'final_burst',
        name: 'Final Burst',
        triggers: ['after_taking_dmg'],
        chance: 0.4,
        values: { threshold: 0.25, buff: 1.5 },
        cond_string: (v) => `Stamina < ${v.threshold * 100}%`,
        eff_string: (v) => `Sing & Dance increases by ${(v.buff - 1) * 100}% for the rest of the LIVE.`,
        condition: ({ you, values: v }) => you.Curr_Stamina < you.Max_Stamina * v.threshold,
        effect: ({ you, log, values: v }) => {
            you.Sing *= v.buff;
            you.Dance *= v.buff;
            log(`Final Burst: {Self} is preparing to all in! Sing & Dance rises!`);
        },
    },
    {
        id: 'old_fashioned',
        name: 'Old Fashioned',
        triggers: ['after_taking_dmg'],
        chance: 0.5,
        values: { haste_debuff: 0.9 },
        cond_string: '{Opp_poss} Haste > {self_poss} Haste',
        eff_string: (v) => `Cuts {opp_poss} Haste by ${(1 - v.haste_debuff) * 100}% for the rest of the LIVE.`,
        condition: ({ you, rival }) => you.Haste < rival.Haste,
        effect: ({ rival, log, values: v }) => {
            rival.Haste *= v.haste_debuff;
            log(`Old Fashioned: {Self} lectures {Opp} for flexing too much, {Opp_poss} Haste dropped for this LIVE!`);
        },
    },
    {
        id: 'seasoned_runner',
        name: 'Seasoned Runner',
        triggers: ['live_start'],
        chance: 1,
        values: { haste_buff: 1.5 },
        cond_string: 'Always',
        eff_string: (v) => `Haste increases by ${(v.haste_buff - 1) * 100}% for 1 turn.`,
        condition: () => true,
        effect: ({ you, apply_temp_buff, log, values: v }) => {
            apply_temp_buff!('you', 'Haste', you.Haste * v.haste_buff);
            log(`Seasoned Runner: {Self} is ready to take the lead!`);
        },
    },
    {
        id: 'showstopper',
        name: 'Showstopper',
        triggers: ['before_inflicting_dmg'],
        chance: 0.35,
        values: { stam_cost: 0.2, buff: 2.0 },
        cond_string: (v) => `Stamina >= ${v.stam_cost * 100}%`,
        eff_string: (v) => `Burn ${v.stam_cost * 100}% Stamina to ${v.buff}x next move.`,
        condition: ({ you, values: v }) => you.Curr_Stamina >= you.Max_Stamina * v.stam_cost,
        effect: ({ you, apply_temp_buff, log, values: v }) => {
            you.Curr_Stamina -= you.Max_Stamina * v.stam_cost;
            apply_temp_buff!('you', 'Sing', you.Sing * v.buff);
            apply_temp_buff!('you', 'Dance', you.Dance * v.buff);
            log(`Showstopper: {Self} pulls out all the stops!!`);
        },
    },
    {
        id: 'scandal_magnet',
        name: 'Scandal Magnet',
        triggers: ['after_taking_dmg'],
        chance: 0.35,
        values: { reflect: 0.5 },
        cond_string: '{Opp} steals Fans with a Sing move',
        eff_string: (v) => `Steal back ${v.reflect * 100}% of the Fans lost.`,
        condition: ({ atk_type, fans_stolen }) => atk_type === 'Dance' && (fans_stolen ?? 0) > 0,
        effect: ({ you, rival, log, fans_stolen, values: v }) => {
            const reflect = Math.floor((fans_stolen ?? 0) * v.reflect);
            const taken = Math.min(rival.Fans, reflect);
            rival.Fans -= taken;
            you.Fans += taken;
            log(`Scandal Magnet: Scandalous! {Self} dissed {Opp} and stole ${taken} Fans back from {Opp}!`);
        },
    },
];

export const SKILL_REGISTRY: Map<string, SkillDef> = new Map(
    ALL_SKILLS.map(s => [s.id, s]),
);
