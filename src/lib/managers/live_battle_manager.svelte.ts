import { CPs } from "$lib/stores/checkpoints.svelte";
import { stat_list } from "$lib/stores/stats.svelte";
import { RivalStatsM } from "$lib/stores/live_rival_stats.svelte";
import type { LiveTurn, LiveBattleStats } from "$lib/types";

type Actor = "Player" | "Rival"

class LiveBattleManager {
    public live_sim_complete: boolean = $state(false)
    public did_player_win: boolean = $state(false)

    public display_your_fans: number = $state(1)
    public display_enemy_fans: number = $state(1)

    private _turns: LiveTurn[] = []
    private _replay_turns: LiveTurn[] = $state([])
    private _you: LiveBattleStats = { Fans: 0, Max_Stamina: 0, Curr_Stamina: 0, Agility: 0, Sing: 0, Dance: 0, Charm: 0, Presence: 0, }

    // Draw turns based on agility
    private _timeline: Actor[] = [];
    private _action_bar = [0, 0] // [Player, Rival]

    get battle_you() { return this._you; }
    get battle_enemy() { return RivalStatsM.stats; }
    get turn_logs() { return this._replay_turns; }
    
    public init() {
        RivalStatsM.init_stats[CPs.current_completed_checkpoint]();

        this._you = {
            Fans: stat_list.Fans.final,
            Max_Stamina: Math.max(stat_list.Stamina.final, 0.1),
            Curr_Stamina: Math.max(stat_list.Stamina.final, 0.1),
            Agility: stat_list.Agility.final,
            Sing: stat_list.Sing.final,
            Dance: stat_list.Dance.final,
            Charm: stat_list.Charm.final,
            Presence: stat_list.Presence.final,
        }

        this.display_your_fans = stat_list.Fans.final
        this.display_enemy_fans = RivalStatsM.stats.Fans

        this._action_bar[0] += 1 / this._you.Agility
        this._action_bar[1] += 1 / RivalStatsM.stats.Agility

        this.populate_timeline();
        
        this._turns.push({
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

        this.did_player_win = this._you.Fans > RivalStatsM.stats.Fans
        const winner_str = this.did_player_win ? "[green]You win![/green]" : "[red]Rival wins![/red]"
        this.log(`LIVE over! ${winner_str}`)
    }

    private take_turn(actor: Actor) {
        const attacker = actor === "Player" ? this._you : RivalStatsM.stats
        const defender = actor === "Player" ? RivalStatsM.stats : this._you

        if (attacker.Curr_Stamina <= 0) {
            this.log(`[red]${actor} has no Stamina left![/red]`)
            return
        }

        const [dmg, move] = this.calc_and_log_damage(attacker, defender)
        
        if (actor === "Player") {
            this.log(`[green]${actor} performed a ${move} move![/green]`, false)
            this.log(`[green]${actor} poached ${Math.ceil(dmg)} fans![/green]`)
        } else {
            this.log(`[darkorange]${actor} performed a ${move} move![/darkorange]`, false)
            this.log(`[darkorange]${actor} poached ${Math.ceil(dmg)} fans![/darkorange]`)
        }
    }

    private calc_and_log_damage(attacker: LiveBattleStats, defender: LiveBattleStats): [number, string] {
        let r = Math.random()
        if (r > 0.5) {
            let atk_stat = attacker.Sing
            let def_stat = defender.Charm * ((defender.Curr_Stamina / defender.Max_Stamina) * 0.5 + 0.5) // [0.5, 1]

            let fluctuation = 1 + (Math.random() * 0.6 - 0.3);
            let dmg = Math.max(Math.min(Math.ceil((atk_stat - def_stat) * fluctuation), defender.Fans), 0)

            attacker.Fans += dmg
            defender.Fans -= dmg

            attacker.Curr_Stamina -= atk_stat / 2 + 0.1
            return [dmg, "Sing"];
        } else {
            let atk_stat = attacker.Dance
            let def_stat = defender.Presence * ((defender.Curr_Stamina / defender.Max_Stamina) * 0.5 + 0.5)

            let fluctuation = 1 + (Math.random() * 0.4 - 0.2);
            let dmg = Math.max(Math.min(Math.ceil((atk_stat - def_stat) * fluctuation), defender.Fans), 0)

            attacker.Fans += dmg
            defender.Fans -= dmg

            attacker.Curr_Stamina -= atk_stat / 2 + 0.1
            return [dmg, "Dance"];
        }
    }

    private populate_timeline(how_many: number = 10) {
        for (let i = 0; i < how_many; i++) {
            if (this._action_bar[0] <= this._action_bar[1]) {
                if (this._you.Curr_Stamina <= 0) continue;
                this._timeline.push("Player")
                this._action_bar[0] += 1 / this._you.Agility
            } else {
                if (RivalStatsM.stats.Curr_Stamina <= 0) continue;
                this._timeline.push("Rival")
                this._action_bar[1] += 1 / RivalStatsM.stats.Agility
            }
        }
    }

    private battleOver(): boolean {
        const fan_cond = RivalStatsM.stats.Fans <= 0 || this._you.Fans <= 0
        const sta_cond = this._you.Curr_Stamina <= 0 && RivalStatsM.stats.Curr_Stamina <= 0

        if (fan_cond) {
            this.log("[red]Someone has lost ALL their fans...[/red]", false)
        } else if (sta_cond) {
            this.log("[red]Both sides have no Stamina left![/red]", false)
        }
        return fan_cond || sta_cond;
    }

    private log(msg: string, auto_push_stats: boolean = true) {
        if (auto_push_stats) {
            this._turns.push({
                msg,
                your_stats: { ...this._you },
                enemy_stats: { ...RivalStatsM.stats },
            })
        } else {
            this._turns.push({msg});
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
        this.push_over_time(this._turns, this._replay_turns);
    }

    private post_fight(): number {
        let temp = stat_list.Fans.final
        let difference = Math.floor(this._you.Fans / stat_list.Fans.multi) - temp

        if (difference >= 0) {
            this.log(`LIVE has successfully concluded. You gained ${difference} fans!`, false)
        } else {
            this.log(`LIVE has concluded. You lost ${-difference} fans!`, false)
        }

        return difference;
    }

    start_live(): number {
        this.init()
        this.fight()
        let diff = this.post_fight()
        stat_list.Fans.base += diff / stat_list.Fans.multi
        this.replay_fight()

        return diff;
    }

    reset() {
        this.live_sim_complete = false;
        this._turns = []
        this._replay_turns = []
        this._timeline= [];
        this._action_bar = [0, 0]
        this.did_player_win = false;
        RivalStatsM.reset()
    }

    debug_print_logs() {
        this._turns.forEach((l) => {
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