type Only<T, U> = T & { [K in Exclude<keyof U, keyof T>]?: never };

export type BasicStats = "Fans" | "Moni" | "Stamina" | "Haste" | "Sing" | "Dance" | "Charm" | "Presence" | "Dummy";
export type TrainingEfficiency = "v_slow" | "slow" | "mid" | "fast" | "v_fast" | "n/a";

export type LiveBattleStats = {
    Fans: number,
    Max_Stamina: number,
    Curr_Stamina: number,
    Haste: number,
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

type Triggers = "live_start" | "turn_start" | "before_taking_dmg"
export type Skill = {
    name: string,
    triggers: Triggers[],
    chance: number,
    unlock_string: string,
    cond_string: string,
    eff_string: string,
    condition?: (ctx) => boolean,
    effect?: (ctx) => void,
}