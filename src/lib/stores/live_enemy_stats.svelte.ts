import type { BasicStatsValuesMap } from "$lib/types";

export class LiveEnemyStats {

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
        2: () => this.genEnemyStatsCp2(),
    }

    private genEnemyStatsCp0() {
        this.stats.Fans = 25;
        this.stats.Stamina = 50;
        this.stats.Sing = 10;
        this.stats.Dance = 10;
        this.stats.Charm = 7;
        this.stats.Presence = 9;
    }

    private genEnemyStatsCp1() {
        this.stats.Fans = 245;
        this.stats.Stamina = 310;
        this.stats.Sing = 72;
        this.stats.Dance = 90;
        this.stats.Charm = 66;
        this.stats.Presence = 50;
    }

    private genEnemyStatsCp2() {
        this.stats.Fans = 1000;
        this.stats.Stamina = 1330;
        this.stats.Sing = 360;
        this.stats.Dance = 310;
        this.stats.Charm = 245;
        this.stats.Presence = 400;
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