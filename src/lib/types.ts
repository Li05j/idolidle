type Only<T, U> = T & { [K in Exclude<keyof U, keyof T>]?: never };

export type TodoType = "none" | "location" | "action" | "gain_currency" | "spend_currency";
export type BasicStats = "Fans" | "Moni" | "Stamina" | "Sing" | "Dance" | "Charm" | "Presence";
export type TrainingEfficiency = "slow" | "mid" | "fast" | "n/a"

export type LiveBattleStats = {
    Fans: number,
    Max_Stamina: number,
    Curr_Stamina: number,
    Sing: number,
    Dance: number,
    Charm: number,
    Presence: number,
}

export type LiveTurn = {
    msg: string,
    your_stats?: LiveBattleStats,
    enemy_stats?: LiveBattleStats,
}

// Which stat the Todo is effected by and by how much based on effectiveness. This only affects idle time.
export type StatEffectPair = { which_stat: BasicStats, effectiveness: number };

type RewardsCommon = {
    flat_gain_base?: number;
    flat_gain_multi?: number;
    depends?: StatEffectPair[];
    efficiency?: TrainingEfficiency;
};

type RewardFlatBase = Only<{
    which_stat: BasicStats;
    flat_gain_base: number;
}, RewardsCommon>;

type RewardFlatMulti = Only<{
    which_stat: BasicStats;
    flat_gain_multi: number;
}, RewardsCommon>;

type RewardDynamicBase = Only<{
    which_stat: BasicStats;
    flat_gain_base: number;
    depends: StatEffectPair[];
    efficiency: TrainingEfficiency;
}, RewardsCommon>;

type RewardDynamicMulti = Only<{
    which_stat: BasicStats;
    flat_gain_multi: number;
    depends: StatEffectPair[];
    efficiency: TrainingEfficiency;
}, RewardsCommon>;

export type Rewards = RewardFlatBase | RewardFlatMulti | RewardDynamicBase | RewardDynamicMulti;
