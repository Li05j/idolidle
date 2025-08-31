import { CPs } from "$lib/stores/game_state/checkpoints.svelte";
import { stat_list } from "$lib/stores/game_state/stats.svelte";
import { RivalStatsM } from "$lib/stores/live_rival_stats.svelte";
import type { LiveTurn, LiveBattleStats } from "$lib/types";

type Actor = "Player" | "Rival"

class LiveBattleManager {
    public final_fan_difference: number | null = $state(null) // un-null this only when battle is over
    public did_player_win: boolean = $state(false)
    public live_sim_complete: boolean = $state(false) // actual live over

    public display_your_fans: number = $state(1)
    public display_enemy_fans: number = $state(1)

    private _real_turns: LiveTurn[] = [] // automated replay turns
    private _replay_turns: LiveTurn[] = $state([]) // display turns

    private _you: LiveBattleStats = { Fans: 0, Max_Stamina: 0, Curr_Stamina: 0, Haste: 0, Sing: 0, Dance: 0, Charm: 0, Presence: 0, }

    // Draw turns based on Haste
    private _timeline: Actor[] = [];
    private _action_bar = [0, 0] // [Player, Rival]

    get turn_logs() { return this._replay_turns; }
    
    public init() {
        RivalStatsM.init_stats[CPs.current_completed_checkpoint]();

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

        this.display_your_fans = stat_list.Fans.final
        this.display_enemy_fans = RivalStatsM.stats.Fans

        this._action_bar[0] += 1 / this._you.Haste
        this._action_bar[1] += 1 / RivalStatsM.stats.Haste

        this.populate_timeline();
        
        this._real_turns.push({
            msg: "**LIVE start!**", 
            your_stats: { ...this._you }, 
            enemy_stats: { ...RivalStatsM.stats },
        })
    }

    private fight() {
        while(!this.battleOver()) {
            if (this._timeline.length <= 0) {
                this.populate_timeline()
            }
            let actor = this._timeline.shift()
            if (actor) this.take_turn(actor)
        }
    }

    private take_turn(actor: Actor) {
        const attacker = actor === "Player" ? this._you : RivalStatsM.stats
        const defender = actor === "Player" ? RivalStatsM.stats : this._you

        if (attacker.Curr_Stamina <= 0) { return }

        this.basic_attack(actor, attacker, defender)
    }

    private basic_attack(actor: string, attacker: LiveBattleStats, defender: LiveBattleStats) {
        let r = Math.random()
        let atk_stat_name: keyof LiveBattleStats = r > 0.5 ? "Sing" : "Dance"
        let def_stat_name: keyof LiveBattleStats = r > 0.5 ? "Charm" : "Presence"
        
        // If you have low Haste, your atk at least is 0.75*, but more Haste = more atk
        let atk_stat = attacker[atk_stat_name] * (0.75 + attacker.Haste / defender.Haste * 0.5)
        // If you have low Stamina your def drops, range [0.5, 1]
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
        else if (RivalStatsM.stats.Curr_Stamina <= 0) {
            for (let i = 0; i < how_many; i++) {
                this._timeline.push("Player")
            }
        }

        for (let i = 0; i < how_many; i++) {
            if (this._action_bar[0] <= this._action_bar[1]) {
                this._action_bar[0] += 1 / this._you.Haste
                this._timeline.push("Player")
            } else {
                this._action_bar[1] += 1 / RivalStatsM.stats.Haste
                this._timeline.push("Rival")
            }
        }
    }

    private battleOver(): boolean {
        const fan_cond = RivalStatsM.stats.Fans <= 0 || this._you.Fans <= 0
        const sta_cond = this._you.Curr_Stamina <= 0 && RivalStatsM.stats.Curr_Stamina <= 0

        if (fan_cond) {
            // this.log("[red]Someone has lost ALL their fans...[/red]", false)
        } else if (sta_cond) {
            this.log("[red]Both sides have no Stamina left![/red]", false)
        }
        return fan_cond || sta_cond;
    }

    private log(msg: string, auto_push_stats: boolean = true) {
        if (auto_push_stats) {
            this._real_turns.push({
                msg,
                your_stats: { ...this._you },
                enemy_stats: { ...RivalStatsM.stats },
            })
        } else {
            this._real_turns.push({msg});
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
        this.did_player_win = this._you.Fans > RivalStatsM.stats.Fans

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

    reset() {
        this.live_sim_complete = false;
        this.final_fan_difference = null;
        this._real_turns = []
        this._replay_turns = []
        this._timeline= [];
        this._action_bar = [0, 0]
        this.did_player_win = false;
        RivalStatsM.reset()
    }

    debug_print_logs() {
        this._real_turns.forEach((l) => {
            console.log(l.msg + ", Your fans: " + l.your_stats?.Fans + ", Enemy fans: " + l.enemy_stats?.Fans)
        })
    }

    debug_print_timeline() {
        this._timeline.forEach((l) => {
            console.log(l + ", ")
        })
    }
}

export const LiveBattleM = new LiveBattleManager();