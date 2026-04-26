import { CPs } from "$lib/state/checkpoints.svelte";
import { stat_list } from "$lib/state/stats.svelte";
import { RivalStatsM } from "$lib/runtime/live_rival_stats.svelte";
import { Rebirth } from "$lib/state/rebirth.svelte";
import { history } from "$lib/state/history.svelte";
import type { LiveTurn, LiveBattleStats } from "$lib/types";
import { render_skill_string, resolve_equip, type BattleTrigger, type Rarity, type RivalEquipEntry, type SkillOwner } from "$lib/data/equipment/equipment_definition";
import { EQUIP_REGISTRY } from "$lib/data/equipment";
import { EquipM } from "$lib/state/equipment.svelte";
import { Save } from "$lib/state/save.svelte";
import { RunTotals } from "$lib/state/run_totals.svelte";

// FIXME: Math.random() calls below (basic_attack variance/atk_type, run_skills chance roll, skill effects) are not seeded.
// Refresh-during-replay re-rolls outcomes against the same persisted rival → mild save-scum vector.
// Fix when needed: derive a per-checkpoint seed (stored on RivalPreview) and thread a seeded RNG through.

type Actor = "Player" | "Rival"

/** Tuning constants for battle balance. Adjust these to micro-tune combat feel. */
export const BATTLE_TUNING = {
    /** Multiplier on ATK stat for stamina cost per action. Higher = shorter battles. */
    STAMINA_COST_MULT: 0.2,
    /** Defense effectiveness at 0 stamina. 0.5 = half defense, 1.0 = no penalty. */
    FATIGUE_FLOOR: 0.5,
    /** Damage variance range: [1 - VARIANCE, 1 + VARIANCE]. */
    VARIANCE: 0.2,
    /** Max turns before force-ending the battle. */
    MAX_TURNS: 120,
    /** Per-stack atk multiplier from Style. Each basic attack grants +1 Style to the attacker. */
    STYLE_PER_STACK: 0.05,
}

class LiveBattleManager {
    public final_fan_difference: number | null = $state(null)
    public did_player_win: boolean = $state(false)
    public live_sim_complete: boolean = $state(false)

    public display_your_fans: number = $state(1)
    public display_enemy_fans: number = $state(1)
    public display_your_stamina_pct: number = $state(1)
    public display_enemy_stamina_pct: number = $state(1)
    public display_your_style: number = $state(0)
    public display_enemy_style: number = $state(0)

    private _real_turns: LiveTurn[] = []
    private _replay_turns: LiveTurn[] = $state([])

    private _you: LiveBattleStats = { Fans: 0, Max_Stamina: 0, Curr_Stamina: 0, Haste: 0, Sing: 0, Dance: 0, Charm: 0, Presence: 0, Style: 0 }
    private _rival: LiveBattleStats = { Fans: 0, Max_Stamina: 0, Curr_Stamina: 0, Haste: 0, Sing: 0, Dance: 0, Charm: 0, Presence: 0, Style: 0 }

    private _action_bar = [0, 0]
    private _rival_equipment: RivalEquipEntry[] = []
    private _replay_interval: ReturnType<typeof setInterval> | null = null

    get turn_logs() { return this._replay_turns; }

    private init() {
        const cp = CPs.current_completed_checkpoint;
        RivalStatsM.initForBattle(cp);
        this._rival = { ...RivalStatsM.battle };
        this._rival_equipment = RivalStatsM.preview(cp).equipment;

        this._you = {
            Fans: Math.round(stat_list.Fans.final),
            Max_Stamina: stat_list.Stamina.final,
            Curr_Stamina: stat_list.Stamina.final,
            Haste: stat_list.Haste.final,
            Sing: stat_list.Sing.final,
            Dance: stat_list.Dance.final,
            Charm: stat_list.Charm.final,
            Presence: stat_list.Presence.final,
            Style: 0,
        }

        this.display_your_fans = this._you.Fans
        this.display_enemy_fans = this._rival.Fans
        this.display_your_stamina_pct = 1
        this.display_enemy_stamina_pct = 1
        this.display_your_style = 0
        this.display_enemy_style = 0

        this.fire_skills('live_start');
        this.fire_rival_skills('live_start');

        this._action_bar[0] = 1 / this._you.Haste
        this._action_bar[1] = 1 / this._rival.Haste

        this._real_turns.push({
            msg: "**LIVE start!**",
            your_stats: { ...this._you },
            enemy_stats: { ...this._rival },
        })
    }

    private next_actor(): Actor {
        if (this._action_bar[0] <= this._action_bar[1]) {
            this._action_bar[0] += 1 / this._you.Haste
            return "Player"
        } else {
            this._action_bar[1] += 1 / this._rival.Haste
            return "Rival"
        }
    }

    private fight() {
        let turns = 0
        while (!this.battleOver() && turns < BATTLE_TUNING.MAX_TURNS) {
            turns++
            const actor = this.pre_turn()
            const attacker = actor === "Player" ? this._you : this._rival
            // Stamina-0 actor: skip take_turn AND post_turn. _temp_buffs is empty
            // here (single-turn semantics), so nothing to revert anyway.
            if (attacker.Curr_Stamina <= 0) continue
            this.log(`[muted]— Turn ${turns} · ${actor}'s turn —[/muted]`, false)
            this.take_turn(actor)
            this.post_turn()
        }
    }

    /** Engine phase: pick next actor, increment their action bar. */
    private pre_turn(): Actor {
        return this.next_actor()
    }

    /** Engine phase: revert single-turn temp buffs. */
    private post_turn(): void {
        this.revert_temp_buffs()
    }

    private take_turn(actor: Actor) {
        const attacker = actor === "Player" ? this._you : this._rival
        const defender = actor === "Player" ? this._rival : this._you

        if (actor === "Player") {
            this.fire_skills('before_inflicting_dmg');
        } else {
            this.fire_rival_skills('before_inflicting_dmg');
        }

        this.basic_attack(actor, attacker, defender)
    }

    private basic_attack(actor: string, attacker: LiveBattleStats, defender: LiveBattleStats) {
        const r = Math.random()
        const atk_type = r > 0.5 ? "Sing" : "Dance" as const
        const def_type = r > 0.5 ? "Charm" : "Presence" as const
        const color = actor === "Player" ? "green" : "darkorange"

        this.log(`[${color}]${actor} performed a ${atk_type} move![/${color}]`, false)

        // Fire before_taking_dmg skills BEFORE reading stats so temp buffs apply
        this._dmg_reduction = 0;
        if (actor === "Rival") {
            this.fire_skills('before_taking_dmg', atk_type);
        } else {
            this.fire_rival_skills('before_taking_dmg', atk_type);
        }

        const base_atk = attacker[atk_type] as number
        const style_mult = 1 + attacker.Style * BATTLE_TUNING.STYLE_PER_STACK
        const raw_atk = base_atk * style_mult
        const raw_def = defender[def_type] as number

        // Defense weakens as stamina drops: [FATIGUE_FLOOR, 1.0]
        const stamina_ratio = defender.Curr_Stamina / defender.Max_Stamina
        const fatigue = BATTLE_TUNING.FATIGUE_FLOOR + (1 - BATTLE_TUNING.FATIGUE_FLOOR) * stamina_ratio
        const effective_def = raw_def * fatigue

        // Subtraction-based damage with variance
        const variance = (1 - BATTLE_TUNING.VARIANCE) + Math.random() * BATTLE_TUNING.VARIANCE * 2
        let raw_damage = (raw_atk - effective_def) * variance
        if (this._dmg_reduction > 0) {
            raw_damage *= (1 - this._dmg_reduction);
        }
        const fans_stolen = Math.max(Math.ceil(Math.min(raw_damage, defender.Fans)), 0)

        // Transfer fans
        attacker.Fans += fans_stolen
        defender.Fans -= fans_stolen

        // Pay stamina (Style does not affect cost — only damage)
        const stamina_cost = base_atk * BATTLE_TUNING.STAMINA_COST_MULT + 1
        attacker.Curr_Stamina = Math.max(attacker.Curr_Stamina - stamina_cost, 0)

        // Bump Style before the snapshotting log so the display ticks up on this turn.
        attacker.Style += 1

        this.log(`[${color}]${actor} poached ${fans_stolen} fans![/${color}]`)

        if (actor === "Player") {
            this.fire_skills('after_inflicting_dmg', atk_type, fans_stolen);
            this.fire_rival_skills('after_taking_dmg', atk_type, fans_stolen);
        } else {
            this.fire_rival_skills('after_inflicting_dmg', atk_type, fans_stolen);
            this.fire_skills('after_taking_dmg', atk_type, fans_stolen);
        }

        // Run post-attack effects. Temp buff revert happens in post_turn.
        this.run_post_attack_effects(fans_stolen);

        if (defender.Fans <= 0) {
            const loser = actor === "Player" ? "Rival" : "Player"
            this.log(`[red]${loser} has lost ALL their fans...[/red]`, false)
        } else if (attacker.Curr_Stamina <= 0) {
            this.log(`[red]${actor} has no Stamina left![/red]`, false)
        }
    }

    private _dmg_reduction = 0;
    private _fired_skills = new Set<string>();
    private _temp_buffs: { target: LiveBattleStats; stat: keyof LiveBattleStats; original: number }[] = [];
    private _post_attack_effects: ((fans_stolen: number) => void)[] = [];

    private fire_skills(trigger: BattleTrigger, atk_type?: 'Sing' | 'Dance', fans_stolen?: number): void {
        this.run_skills(trigger, atk_type, fans_stolen, 'player');
    }

    private fire_rival_skills(trigger: BattleTrigger, atk_type?: 'Sing' | 'Dance', fans_stolen?: number): void {
        this.run_skills(trigger, atk_type, fans_stolen, 'rival');
    }

    private run_skills(trigger: BattleTrigger, atk_type: 'Sing' | 'Dance' | undefined, fans_stolen: number | undefined, owner: SkillOwner): void {
        const you = owner === 'player' ? this._you : this._rival;
        const rival = owner === 'player' ? this._rival : this._you;
        const color = owner === 'player' ? 'green' : 'darkorange';

        // Iterate the right side's skill list. Player uses equipped inventory;
        // rival uses the pre-rolled loadout snapshot.
        const skill_sources: { key: string; equip_id: string; rarity: Rarity }[] =
            owner === 'player'
                ? EquipM.get_all_equipped().map(item => ({ key: item.equip_id, equip_id: item.equip_id, rarity: item.rarity }))
                : this._rival_equipment.map(entry => ({ key: `r:${entry.equip_id}`, equip_id: entry.equip_id, rarity: entry.rarity }));

        for (const src of skill_sources) {
            if (this._fired_skills.has(src.key)) continue;
            const def = EQUIP_REGISTRY.get(src.equip_id);
            if (!def) continue;

            const resolved = resolve_equip(def, src.rarity);
            const skill = resolved.skill;
            if (!skill) continue;
            if (!skill.triggers.includes(trigger)) continue;

            const values = skill.values ?? {};
            const render = (msg: string) => render_skill_string(msg, values, owner);

            const skill_ctx = {
                you,
                rival,
                atk_type,
                fans_stolen,
                values,
                owner,
                set_dmg_reduction: (amount: number) => { this._dmg_reduction = Math.max(this._dmg_reduction, amount); },
                apply_temp_buff: (who: 'you' | 'rival', stat: keyof LiveBattleStats, new_value: number) => {
                    const target = who === 'you' ? you : rival;
                    this._temp_buffs.push({ target, stat, original: target[stat] as number });
                    (target as Record<string, number>)[stat] = new_value;
                },
                on_after_attack: (callback: (fans_stolen: number) => void) => {
                    this._post_attack_effects.push(callback);
                },
                log: (msg: string) => this.log(`[${color}]${render(msg)}[/${color}]`),
            };

            if (!skill.condition(skill_ctx)) continue;
            if (Math.random() > skill.chance) continue;

            this.log(`[${color}]${render(skill.name)} activated![/${color}]`, false);
            skill.effect(skill_ctx);
            this._fired_skills.add(src.key);
        }
    }

    private revert_temp_buffs(): void {
        for (const buff of this._temp_buffs) {
            (buff.target as Record<string, number>)[buff.stat] = buff.original;
        }
        this._temp_buffs = [];
    }

    private run_post_attack_effects(fans_stolen: number): void {
        for (const fn of this._post_attack_effects) fn(fans_stolen);
        this._post_attack_effects = [];
    }

    private battleOver(): boolean {
        if (this._you.Fans <= 0 || this._rival.Fans <= 0) return true

        if (this._you.Curr_Stamina <= 0 && this._rival.Curr_Stamina <= 0) {
            this.log("[red]Both sides have no Stamina left![/red]", false)
            return true
        }

        return false
    }

    private log(msg: string, auto_push_stats: boolean = true) {
        if (auto_push_stats) {
            this._real_turns.push({
                msg,
                your_stats: { ...this._you },
                enemy_stats: { ...this._rival },
            })
        } else {
            this._real_turns.push({ msg });
        }
    }

    private push_over_time(source: LiveTurn[], target: LiveTurn[], intervalMs: number = 500) {
        this._replay_interval = setInterval(() => {
            if (source.length === 0) {
                clearInterval(this._replay_interval!);
                this.live_sim_complete = true;
                return;
            }
            const item = source.shift();
            if (item !== undefined) {
                target.push(item);
                if (item.your_stats) {
                    this.display_your_fans = item.your_stats.Fans;
                    if (item.your_stats.Max_Stamina > 0) {
                        this.display_your_stamina_pct = item.your_stats.Curr_Stamina / item.your_stats.Max_Stamina;
                    }
                    this.display_your_style = item.your_stats.Style;
                }
                if (item.enemy_stats) {
                    this.display_enemy_fans = item.enemy_stats.Fans;
                    if (item.enemy_stats.Max_Stamina > 0) {
                        this.display_enemy_stamina_pct = item.enemy_stats.Curr_Stamina / item.enemy_stats.Max_Stamina;
                    }
                    this.display_enemy_style = item.enemy_stats.Style;
                }
            }
        }, intervalMs);
    }

    private replay_fight() {
        this.push_over_time(this._real_turns, this._replay_turns);
    }

    private post_fight(): void {
        this.did_player_win = this._you.Fans > this._rival.Fans

        if (this.did_player_win) {
            this.log("[green]You defeated your Rival![/green]", false)

            let difference = this._you.Fans - stat_list.Fans.final
            let diff_str = difference.toFixed(0)

            if (difference >= 0) {
                this.log(`LIVE has successfully concluded. You gained ${diff_str} fans!`, false)
            } else {
                this.log(`LIVE has successfully concluded. You lost ${-diff_str} fans!`, false)
            }

            this.final_fan_difference = difference;
        } else {
            this.log("[red]Your Rival ended your Idol career...[/red]", false)
        }
    }

    start_live(): void {
        Save.set_battle_in_progress(true)
        this.init()
        this.fight()
        this.post_fight()
        this.replay_fight()
    }

    concludeBattle() {
        CPs.advanceToNextCheckpoint();
        Rebirth.update_max_completed_checkpoints(CPs.current_completed_checkpoint);

        if (this.final_fan_difference != null) {
            const fan_change = this.final_fan_difference;
            stat_list.Fans.add_base_from_final(fan_change);
            RunTotals.add('Fans', fan_change);

            const fan_change_str = fan_change.toFixed(0);
            if (fan_change >= 0) {
                history.addSystemLog(`LIVE has successfully concluded. You gained ${fan_change_str} fans!`, true);
            } else {
                history.addSystemLog(`LIVE has concluded. You lost ${-fan_change_str} fans!`, true);
            }
        }
    }

    reset() {
        if (this._replay_interval) {
            clearInterval(this._replay_interval);
            this._replay_interval = null;
        }
        this.live_sim_complete = false;
        this.final_fan_difference = null;
        this.display_your_stamina_pct = 1;
        this.display_enemy_stamina_pct = 1;
        this.display_your_style = 0;
        this.display_enemy_style = 0;
        this._real_turns = []
        this._replay_turns = []
        this._action_bar = [0, 0]
        this.did_player_win = false;
        this._dmg_reduction = 0;
        this._fired_skills.clear();
        this._temp_buffs = [];
        this._post_attack_effects = [];
        this._rival_equipment = [];
        RivalStatsM.reroll()
        Save.set_battle_in_progress(false)
    }
}

export const LiveBattleM = new LiveBattleManager();
