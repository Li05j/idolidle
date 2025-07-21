import type { LiveBattleStats } from "$lib/types";

export class LiveEnemyStats {

    public stats: LiveBattleStats = {
        Fans: 1,
        Max_Stamina: 1,
        Curr_Stamina: 1,
        Sing: 1,
        Dance: 1,
        Charm: 1,
        Presence: 1,
    }

    public init_stats: { [key: number]: () => void } = {
        0: () => this.genEnemyStatsCp0(),
        1: () => this.genEnemyStatsCp1(),
        2: () => this.genEnemyStatsCp2(),
    }

    private genEnemyStatsCp0() {
        this.stats.Fans = 25;
        this.stats.Max_Stamina = 50;
        this.stats.Curr_Stamina = 50;
        this.stats.Sing = 10;
        this.stats.Dance = 10;
        this.stats.Charm = 7;
        this.stats.Presence = 9;
    }

    private genEnemyStatsCp1() {
        this.stats.Fans = 145;
        this.stats.Max_Stamina = 110;
        this.stats.Curr_Stamina = 110;
        this.stats.Sing = 69;
        this.stats.Dance = 45;
        this.stats.Charm = 50;
        this.stats.Presence = 32;
    }

    private genEnemyStatsCp2() {
        this.stats.Fans = 400;
        this.stats.Max_Stamina = 520;
        this.stats.Curr_Stamina = 520;
        this.stats.Sing = 200;
        this.stats.Dance = 135;
        this.stats.Charm = 145;
        this.stats.Presence = 120;
    }

    public reset() {
        this.stats.Fans = 1;
        this.stats.Max_Stamina = 1;
        this.stats.Curr_Stamina = 1;
        this.stats.Sing = 1;
        this.stats.Dance = 1;
        this.stats.Charm = 1;
        this.stats.Presence = 1;
    }
}