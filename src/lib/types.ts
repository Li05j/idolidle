export type BasicStats = "Fans" | "Moni" | "Stamina" | "Haste" | "Sing" | "Dance" | "Charm" | "Presence";
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

export type StatEffectPair = { which_stat: BasicStats, effectiveness: number };

export type RewardScaling = {
    sources: StatEffectPair[];
    efficiency: TrainingEfficiency;
};

export type Reward = {
    which_stat: BasicStats;
    target: 'base' | 'multi';
    amount: number;
    scaling?: RewardScaling;
};
