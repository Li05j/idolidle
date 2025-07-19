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
    }

    private genEnemyStatsCp0() {
        this.stats.Fans = 55;
        this.stats.Stamina = 100;
        this.stats.Sing = 25;
        this.stats.Dance = 35;
        this.stats.Charm = 40;
        this.stats.Presence = 15;
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