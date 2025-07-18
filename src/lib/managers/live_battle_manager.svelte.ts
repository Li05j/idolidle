import { CPs } from "$lib/stores/checkpoints.svelte";
import { fans, moni, sta, sing, dance, charm, pres, type BasicStatsValuesMap } from "$lib/stores/stats.svelte";

type Turn = {
    msg: string,
    your_stats: BasicStatsValuesMap,
    enemy_stats: BasicStatsValuesMap,
}

class EnemyStats {

    public stats: BasicStatsValuesMap = {
        Fans: 1,
        Stamina: 1,
        Sing: 1,
        Dance: 1,
        Charm: 1,
        Presence: 1,
    }

    public init_stats: { [key: number]: () => void } = {
        0: () => this.genEnemyStatsCp0(),
        1: () => this.genEnemyStatsCp1(),
    }

    private genEnemyStatsCp0() {
        this.stats.Fans = 25;
        this.stats.Stamina = 50;
        this.stats.Sing = 15;
        this.stats.Dance = 15;
        this.stats.Charm = 10;
        this.stats.Presence = 10;
    }

    private genEnemyStatsCp1() {
        this.stats.Fans = 1;
        this.stats.Stamina = 1;
        this.stats.Sing = 1;
        this.stats.Dance = 1;
        this.stats.Charm = 1;
        this.stats.Presence = 1;
    }

    public reset() {
        this.stats.Fans = 1;
        this.stats.Stamina = 1;
        this.stats.Sing = 1;
        this.stats.Dance = 1;
        this.stats.Charm = 1;
        this.stats.Presence = 1;
    }
}

class LiveBattleManager {
    public display_your_fans: number = $state(1)
    public display_enemy_fans: number = $state(1)

    private _turns: Turn[] = []
    private _replay_turns: Turn[] = $state([])
    private _you: BasicStatsValuesMap = {
        Fans: fans.final,
        Stamina: sta.final,
        Sing: sing.final,
        Dance: dance.final,
        Charm: charm.final,
        Presence: pres.final,
    }
    private _enemy: EnemyStats = new EnemyStats()
    private _turn_order: ("player" | "enemy")[] = [];

    get battle_you() { return this._you; }
    get battle_enemy() { return this._enemy.stats; }
    get turn_logs() { return this._replay_turns; }
    
    public init() {
        this._enemy.init_stats[CPs.current_completed_checkpoint]();
        this._turns.push({msg: "LIVE start!", your_stats: this._you, enemy_stats: this._enemy.stats})

        this.display_your_fans = fans.final
        this.display_enemy_fans = this._enemy.stats.Fans

        this._turn_order = this._you.Fans >= this._enemy.stats.Fans
            ? ["player", "enemy"]
            : ["enemy", "player"]
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

    private take_turn(actor: "player" | "enemy") {
        const attacker = actor === "player" ? this._you : this._enemy.stats
        const defender = actor === "player" ? this._enemy.stats : this._you

        if (attacker.Stamina <= 0) {
            this.log(`${actor} has no Stamina left!`)
            return
        }

        const steal = Math.min(5, defender.Fans) // dummy calc
        attacker.Stamina -= 5
        attacker.Fans += steal
        defender.Fans -= steal

        this.log(`${actor} steals ${steal} fans`)
    }

    private battleOver(): boolean {
        return this._enemy.stats.Fans <= 0 || this._you.Fans <= 0 ||
               (this._you.Stamina <= 0 && this._enemy.stats.Stamina <= 0)
    }

    private log(msg: string) {
        this._turns.push({
            msg,
            your_stats: { ...this._you },
            enemy_stats: { ...this._enemy.stats },
        })
    }

    private push_over_time(source: Turn[], target: Turn[], intervalMs: number = 500) {
        const interval = setInterval(() => {
            if (source.length === 0) {
                clearInterval(interval);
                return;
            }
            const item = source.shift();
            if (item !== undefined) {
                target.push(item);
                this.display_your_fans = item.your_stats.Fans
                this.display_enemy_fans = item.enemy_stats.Fans
            }
        }, intervalMs);
    }

    private replay_fight() {
        this.push_over_time(this._turns, this._replay_turns);
    }

    start_live() {
        // this.init()
        this.fight()
        this.replay_fight()
    }

    reset() {
        this._turns = []
        this._enemy.reset()
    }
}

export const LiveBattleM = new LiveBattleManager();