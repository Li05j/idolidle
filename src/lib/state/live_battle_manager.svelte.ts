import { CPs } from "$lib/state/checkpoints.svelte";
import { stat_list } from "$lib/state/stats.svelte";
import { RivalStatsM } from "$lib/state/live_rival_stats.svelte";
import { Rebirth } from "$lib/state/rebirth.svelte";
import { history } from "$lib/state/history.svelte";
import type { LiveTurn, LiveBattleStats } from "$lib/types";

type Actor = "Player" | "Rival"

class LiveBattleManager {
    public final_fan_difference: number | null = $state(null)
    public did_player_win: boolean = $state(false)
    public live_sim_complete: boolean = $state(false)

    public display_your_fans: number = $state(1)
    public display_enemy_fans: number = $state(1)

    private _real_turns: LiveTurn[] = []
    private _replay_turns: LiveTurn[] = $state([])

    private _you: LiveBattleStats = { Fans: 0, Max_Stamina: 0, Curr_Stamina: 0, Haste: 0, Sing: 0, Dance: 0, Charm: 0, Presence: 0 }
    private _rival: LiveBattleStats = { Fans: 0, Max_Stamina: 0, Curr_Stamina: 0, Haste: 0, Sing: 0, Dance: 0, Charm: 0, Presence: 0 }

    private _timeline: Actor[] = [];
    private _action_bar = [0, 0]

    get turn_logs() { return this._replay_turns; }

    private init() {
        RivalStatsM.initForBattle(CPs.current_completed_checkpoint);
        this._rival = { ...RivalStatsM.battle };

        this._you = {
            Fans: stat_list.Fans.final,
            Max_Stamina: stat_list.Stamina.final,
            Curr_Stamina: stat_list.Stamina.final,
            Haste: stat_list.Haste.final,
            Sing: stat_list.Sing.final,
            Dance: stat_list.Dance.final,
            Charm: stat_list.Charm.final,
            Presence: stat_list.Presence.final,
        }

        this.display_your_fans = this._you.Fans
        this.display_enemy_fans = this._rival.Fans

        this._action_bar[0] += 1 / this._you.Haste
        this._action_bar[1] += 1 / this._rival.Haste

        this.populate_timeline();

        this._real_turns.push({
            msg: "**LIVE start!**",
            your_stats: { ...this._you },
            enemy_stats: { ...this._rival },
        })
    }

    private fight() {
        while (!this.battleOver()) {
            if (this._timeline.length <= 0) {
                this.populate_timeline()
            }
            let actor = this._timeline.shift()
            if (actor) this.take_turn(actor)
        }
    }

    private take_turn(actor: Actor) {
        const attacker = actor === "Player" ? this._you : this._rival
        const defender = actor === "Player" ? this._rival : this._you

        if (attacker.Curr_Stamina <= 0) { return }

        this.basic_attack(actor, attacker, defender)
    }

    private basic_attack(actor: string, attacker: LiveBattleStats, defender: LiveBattleStats) {
        let r = Math.random()
        let atk_stat_name: keyof LiveBattleStats = r > 0.5 ? "Sing" : "Dance"
        let def_stat_name: keyof LiveBattleStats = r > 0.5 ? "Charm" : "Presence"

        // High Haste gives attack bonus [0.75, 1.25+]
        let atk_stat = attacker[atk_stat_name] * (0.75 + attacker.Haste / defender.Haste * 0.5)
        // Low Stamina weakens defense [0.5, 1.0]
        let def_stat = defender[def_stat_name] * ((defender.Curr_Stamina / defender.Max_Stamina) * 0.5 + 0.5)

        let fluctuation = 1 + (Math.random() * 0.6 - 0.3);
        let dmg = Math.max(Math.min(Math.ceil((atk_stat - def_stat) * fluctuation), defender.Fans), 0)

        attacker.Fans += dmg
        defender.Fans -= dmg

        attacker.Curr_Stamina -= attacker[atk_stat_name] / 2 + 0.1

        if (actor === "Player") {
            this.log(`[green]${actor} performed a ${atk_stat_name} move![/green]`, false)
            this.log(`[green]${actor} poached ${dmg.toFixed(0)} fans![/green]`)
        } else {
            this.log(`[darkorange]${actor} performed a ${atk_stat_name} move![/darkorange]`, false)
            this.log(`[darkorange]${actor} poached ${dmg.toFixed(0)} fans![/darkorange]`)
        }

        if (defender.Fans <= 0) {
            let who = actor === "Player" ? "Rival" : "Player"
            this.log(`[red]${who} has lost ALL their fans...[/red]`, false)
            return
        }

        if (attacker.Curr_Stamina <= 0) {
            this.log(`[red]${actor} has no Stamina left![/red]`, false)
        }
    }

    private populate_timeline(how_many: number = 10) {
        if (this._you.Curr_Stamina <= 0) {
            for (let i = 0; i < how_many; i++) {
                this._timeline.push("Rival")
            }
        }
        else if (this._rival.Curr_Stamina <= 0) {
            for (let i = 0; i < how_many; i++) {
                this._timeline.push("Player")
            }
        }

        for (let i = 0; i < how_many; i++) {
            if (this._action_bar[0] <= this._action_bar[1]) {
                this._action_bar[0] += 1 / this._you.Haste
                this._timeline.push("Player")
            } else {
                this._action_bar[1] += 1 / this._rival.Haste
                this._timeline.push("Rival")
            }
        }
    }

    private battleOver(): boolean {
        const fan_cond = this._rival.Fans <= 0 || this._you.Fans <= 0
        const sta_cond = this._you.Curr_Stamina <= 0 && this._rival.Curr_Stamina <= 0

        if (sta_cond && !fan_cond) {
            this.log("[red]Both sides have no Stamina left![/red]", false)
        }
        return fan_cond || sta_cond;
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
        const interval = setInterval(() => {
            if (source.length === 0) {
                clearInterval(interval);
                this.live_sim_complete = true;
                return;
            }
            const item = source.shift();
            if (item !== undefined) {
                target.push(item);
                if (item.your_stats) this.display_your_fans = item.your_stats.Fans;
                if (item.enemy_stats) this.display_enemy_fans = item.enemy_stats.Fans;
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
            stat_list.Fans.add_to_final(fan_change);

            const fan_change_str = fan_change.toFixed(0);
            if (fan_change >= 0) {
                history.addHintLogs(`LIVE has successfully concluded. You gained ${fan_change_str} fans!`, true);
            } else {
                history.addHintLogs(`LIVE has concluded. You lost ${-fan_change_str} fans!`, true);
            }
        }
    }

    reset() {
        this.live_sim_complete = false;
        this.final_fan_difference = null;
        this._real_turns = []
        this._replay_turns = []
        this._timeline = [];
        this._action_bar = [0, 0]
        this.did_player_win = false;
        RivalStatsM.reroll()
    }
}

export const LiveBattleM = new LiveBattleManager();
