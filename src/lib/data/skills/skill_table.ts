import type { SkillDef } from './skill_definition';
import { drain_fans } from './skill_definition';
import { fmt_pct } from '$lib/utils/utils';

export const ALL_SKILLS: SkillDef[] = [
    {
        id: 'go_home_club',
        name: 'Go-Home Club',
        triggers: ['after_inflicting_dmg'],
        chance: 0.5,
        values: { threshold: 0.25, restore: 0.25 },
        cond_string: (v) => `Stamina < ${fmt_pct(v.threshold)}`,
        eff_string: (v) => `Restore ${fmt_pct(v.restore)} Stamina.`,
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
        chance: 0.4,
        values: { buff: 1.5 },
        cond_string: '{Self_poss} Fans < {opp_poss} Fans',
        eff_string: (v) => `{Self_poss} next move steals ${fmt_pct(v.buff - 1)} more Fans.`,
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
        eff_string: (v) => `Drain ${fmt_pct(v.drain)} Fans from {Opp} before LIVE starts.`,
        condition: () => true,
        effect: ({ you, rival, log, values: v }) => {
            const drained = drain_fans(rival, you, rival.Fans * v.drain);
            log(`Idol Executive: Drained ${drained} Fans from {Opp_poss} stash!`);
        },
    },
    {
        id: 'good_student',
        name: 'Good Student',
        triggers: ['before_taking_dmg'],
        chance: 0.25,
        values: { reduction: 0.75 },
        cond_string: '{Opp} performs a move.',
        eff_string: (v) => `Reduce Fans loss by ${fmt_pct(v.reduction)}.`,
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
        eff_string: (v) => `Reduce {Opp_poss} Stamina by ${fmt_pct(v.drain)}.`,
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
        eff_string: (v) => `Increase Charm by ${fmt_pct(v.charm_buff - 1)} for 1 turn. If {opp} fails to steal Fans, {opp} loses ${fmt_pct(v.penalty)} Fans.`,
        condition: ({ atk_type }) => atk_type === 'Sing',
        effect: ({ you, rival, apply_temp_buff, on_after_attack, log, values: v }) => {
            apply_temp_buff!('you', 'Charm', you.Charm * v.charm_buff);
            log(`Moe Kyun~!: {Self_poss} Charm soars!`);
            on_after_attack!((fans_stolen) => {
                if (fans_stolen <= 0) {
                    const drained = drain_fans(rival, you, rival.Fans * v.penalty);
                    log(`{Opp_poss} attempt was BOO'd instead! Drained ${drained} Fans!`);
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
        cond_string: (v) => `Stamina < ${fmt_pct(v.threshold)}`,
        eff_string: (v) => `Sing & Dance increases by ${fmt_pct(v.buff - 1)} for the rest of the LIVE.`,
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
        eff_string: (v) => `Cuts {opp_poss} Haste by ${fmt_pct(1 - v.haste_debuff)} for the rest of the LIVE.`,
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
        eff_string: (v) => `Haste increases by ${fmt_pct(v.haste_buff - 1)} for 1 turn.`,
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
        cond_string: (v) => `Stamina >= ${fmt_pct(v.stam_cost)}`,
        eff_string: (v) => `Burn ${fmt_pct(v.stam_cost)} Stamina to ${v.buff}x next move.`,
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
        eff_string: (v) => `Steal back ${fmt_pct(v.reflect)} of the Fans lost.`,
        condition: ({ atk_type, fans_stolen }) => atk_type === 'Sing' && (fans_stolen ?? 0) > 0,
        effect: ({ you, rival, log, fans_stolen, values: v }) => {
            const taken = drain_fans(rival, you, (fans_stolen ?? 0) * v.reflect);
            log(`Scandal Magnet: Scandalous! {Self} dissed {Opp} and stole ${taken} Fans back from {Opp}!`);
        },
    },
    {
        id: 'lullaby',
        name: 'Lullaby',
        triggers: ['before_inflicting_dmg'],
        chance: 0.25,
        values: { charm_debuff: 0.5 },
        cond_string: '{Self} performs a Sing move',
        eff_string: (v) => `Reduce {Opp_poss} Charm ${fmt_pct(v.charm_debuff)} for 1 turn.`,
        condition: ({ atk_type }) => atk_type === 'Sing',
        effect: ({ rival, apply_temp_buff, log, values: v }) => {
            apply_temp_buff!('rival', 'Charm', rival.Charm * v.charm_debuff);
            log(`Lullaby: {Self} soothing voice lowered {Opp_poss} guard!`);
        },
    },
    {
        id: 'my_lovely_teddy',
        name: 'My Lovely Teddy',
        triggers: ['after_inflicting_dmg'],
        chance: 0.75,
        values: { extra_charm_dmg: 0.5 },
        cond_string: '{Self} performs a move',
        eff_string: (v) => `Steal an additional Charm × ${fmt_pct(v.extra_charm_dmg)} Fans.`,
        condition: () => true,
        effect: ({ you, rival, log, values: v }) => {
            const drained = drain_fans(rival, you, you.Charm * v.extra_charm_dmg);
            log(`My Lovely Teddy: {Self_poss} teddy charmed an extra ${drained} Fans from {Opp}!`);
        },
    },
];

export const SKILL_REGISTRY: Map<string, SkillDef> = new Map(
    ALL_SKILLS.map(s => [s.id, s]),
);
