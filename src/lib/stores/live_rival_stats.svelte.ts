import type { LiveBattleStats } from "$lib/types";

type StatRange = { 
    fans_range:     [number, number], 
    sta_range:      [number, number], 
    sing_range:     [number, number], 
    dance_range:    [number, number], 
    charm_range:    [number, number], 
    pres_range:     [number, number],  
}

const MIN_STAT_PERCENT = 0.5;

// *1
const rival_cp0: StatRange = {
    fans_range      : [20, 32],
    sta_range       : [30, 48],
    sing_range      : [10, 16],
    dance_range     : [10, 16],
    charm_range     : [8, 15],
    pres_range      : [8, 15],
}

// *4
const rival_cp1: StatRange = {
    fans_range      : [80, 128],
    sta_range       : [120, 192],
    sing_range      : [40, 64],
    dance_range     : [40, 64],
    charm_range     : [32, 60],
    pres_range      : [32, 60],
}

// *9
const rival_cp2: StatRange = {
    fans_range      : [180, 288],
    sta_range       : [270, 432],
    sing_range      : [90, 144],
    dance_range     : [90, 144],
    charm_range     : [72, 135],
    pres_range      : [72, 135],
}

function random_in_range(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

function genEnemyStats(r: StatRange): LiveBattleStats {
    const ranges = [
        r.fans_range,
        r.sta_range,
        r.sing_range,
        r.dance_range,
        r.charm_range,
        r.pres_range,
    ];

    // pick a random total between MIN_TOTAL and theoretical max
    const minPossible = ranges.reduce((sum, [min, _]) => sum + min, 0);
    const maxPossible = ranges.reduce((sum, [_, max]) => sum + max, 0);
    const THRESHOLD = MIN_STAT_PERCENT * (minPossible + maxPossible)

    let roll = ranges.map((r) => { return random_in_range(r[0], r[1]) })
    const roll_sum = roll.reduce((sum, v) => sum + v, 0)

    const difference = roll_sum - THRESHOLD;

    // console.log(roll_sum, difference)
    // console.log(roll[0], roll[1])

    if (difference <= 0) {
        let budget = Math.abs(difference);
        for (let i = 0; i < roll.length; i++) {
            const gap = ranges[i][1] - roll[i]
            if (budget <= gap) {
                roll[i] += budget;
                break;
            } else {
                roll[i] = ranges[i][1];
                budget -= gap;
            }
        }
    }

    return {
        Fans            : roll[0],
        Max_Stamina     : roll[1],
        Curr_Stamina    : roll[1],
        Sing            : roll[2],
        Dance           : roll[3],
        Charm           : roll[4],
        Presence        : roll[5],
    };
}

class LiveEnemyStats {
    public stats: LiveBattleStats = {
        Fans: 1,
        Max_Stamina: 1,
        Curr_Stamina: 1,
        Sing: 1,
        Dance: 1,
        Charm: 1,
        Presence: 1,
    }

    private _rival_cp0_stats = genEnemyStats(rival_cp0)
    private _rival_cp1_stats = genEnemyStats(rival_cp1)
    private _rival_cp2_stats = genEnemyStats(rival_cp2)

    public get_stats = (i: number): LiveBattleStats => {
        switch (i) {
            case 0: return this._rival_cp0_stats
            case 1: return this._rival_cp1_stats
            case 2: return this._rival_cp2_stats
            
            default: return this._rival_cp0_stats
        }
    }


    public init_stats: { [key: number]: () => void } = {
        0: () => this.stats = { ...this._rival_cp0_stats },
        1: () => this.stats = { ...this._rival_cp1_stats },
        2: () => this.stats = { ...this._rival_cp2_stats },
    }

    public reset() {
        this._rival_cp0_stats = genEnemyStats(rival_cp0)
        this._rival_cp1_stats = genEnemyStats(rival_cp1)
        this._rival_cp2_stats = genEnemyStats(rival_cp2)
    }
}

export const RivalStatsM = new LiveEnemyStats();