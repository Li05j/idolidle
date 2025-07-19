import { CPs } from "$lib/stores/checkpoints.svelte";
import { fans, moni, sta, sing, dance, charm, pres } from "$lib/stores/stats.svelte";
import { LiveEnemyStats } from "$lib/stores/live_enemy_stats.svelte";
import type { LiveTurn, BasicStatsValuesMap } from "$lib/types";
import { DECIMAL_PLACES } from "$lib/utils/utils";

class LiveBattleManager {
    public live_sim_complete: boolean = $state(false)

    public display_your_fans: number = $state(1)
    public display_enemy_fans: number = $state(1)

    private _turns: LiveTurn[] = []
    private _replay_turns: LiveTurn[] = $state([])
    private _you: BasicStatsValuesMap = {
        Fans: fans.final,
        Stamina: sta.final,
        Sing: sing.final,
        Dance: dance.final,
        Charm: charm.final,
        Presence: pres.final,
    }
    private _enemy: LiveEnemyStats = new LiveEnemyStats()
    private _turn_order: ("Player" | "Rival")[] = [];

    get battle_you() { return this._you; }
    get battle_enemy() { return this._enemy.stats; }
    get turn_logs() { return this._replay_turns; }
    
    public init() {
        this._enemy.init_stats[CPs.current_completed_checkpoint]();

        this.display_your_fans = fans.final
        this.display_enemy_fans = this._enemy.stats.Fans
        
        this._turns.push({
            msg: "**LIVE start!**", 
            your_stats: { ...this._you }, 
            enemy_stats: { ...this._enemy.stats },
        })
        this.debug_print_logs()

        this._turn_order = this._you.Fans >= this._enemy.stats.Fans
            ? ["Player", "Rival"]
            : ["Rival", "Player"]
    }

    private fight() {
        while(!this.battleOver()) {
            for (const actor of this._turn_order) {
                if (this.battleOver()) break
                this.take_turn(actor)
            }
        }

        const winner = this._you.Fans === this._enemy.stats.Fans ? "Draw" :
                       this._you.Fans > this._enemy.stats.Fans ? "You win!" : "Enemy wins!"
        this.log(`Battle over! ${winner}`)
    }

    private take_turn(actor: "Player" | "Rival") {
        const attacker = actor === "Player" ? this._you : this._enemy.stats
        const defender = actor === "Player" ? this._enemy.stats : this._you

        if (attacker.Stamina <= 0) {
            this.log(`[red]${actor} has no Stamina left![/red]`)
            return
        }

        const [dmg, move] = this.calc_and_log_damage(attacker, defender)
        
        if (actor === "Player") {
            this.log(`[green]${actor} performed a ${move} move![/green]`, false)
            this.log(`[green]${actor} poached ${dmg} fans![/green]`)
        } else {
            this.log(`[darkorange]${actor} performed a ${move} move![/darkorange]`, false)
            this.log(`[darkorange]${actor} poached ${dmg} fans![/darkorange]`)
        }
    }

    // Todo: Make this smarter
    private calc_and_log_damage(attacker: BasicStatsValuesMap, defender: BasicStatsValuesMap): [number, string] {
        let r = Math.random()
        if (r > 0.5) {
            let atk_stat = attacker.Sing
            let def_stat = defender.Charm

            let fluctuation = Math.random() * 0.4 - 0.2;
            let dmg = Math.max(Math.min(Math.ceil((atk_stat - def_stat) * fluctuation), defender.Fans), 0)
            attacker.Fans += dmg
            defender.Fans -= dmg

            attacker.Stamina -= atk_stat / 2
            return [dmg, "Sing"];
        } else {
            let atk_stat = attacker.Dance
            let def_stat = defender.Presence

            let fluctuation = 1 + Math.random() * 0.4 - 0.2;
            let dmg = Math.max(Math.min(Math.ceil((atk_stat - def_stat) * fluctuation), defender.Fans), 0)
            attacker.Fans += dmg
            defender.Fans -= dmg

            attacker.Stamina -= atk_stat / 2
            return [dmg, "Dance"];
        }
    }

    private battleOver(): boolean {
        return this._enemy.stats.Fans <= 0 || this._you.Fans <= 0 ||
               (this._you.Stamina <= 0 && this._enemy.stats.Stamina <= 0)
    }

    private log(msg: string, auto_push_stats: boolean = true) {
        if (auto_push_stats) {
            this._turns.push({
                msg,
                your_stats: { ...this._you },
                enemy_stats: { ...this._enemy.stats },
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

    start_live() {
        this.init()
        this.fight()
        this.replay_fight()
    }

    reset() {
        this.live_sim_complete = false;
        this._turns = []
        this._replay_turns = []
        this._enemy.reset()
    }

    debug_print_logs() {
        this._turns.forEach((l) => {
            console.log(l.msg + ", Your fans: " + l.your_stats?.Fans + ", Enemy fans: " + l.enemy_stats?.Fans)
        })
    }
}

export const LiveBattleM = new LiveBattleManager();