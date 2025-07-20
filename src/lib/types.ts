export type TodoType = "none" | "location" | "action" | "gain_currency" | "spend_currency";
export type BasicStats = "Fans" | "Moni" | "Stamina" | "Sing" | "Dance" | "Charm" | "Presence";
export type TrainingEfficiency = "slow" | "mid" | "fast" | "n/a"

export interface Todo {
    name: string,               // Primary key.
    type: TodoType,
    one_off?: boolean,          // If the card is one time use or not. Locations are by default 1 time use.
    base_cost: number,
    depends: StatEffectPair[],
    spendings_moni?: number,    // How much moni is spent. This is used with "spend_currency" type.
    rewards: Rewards[],
    desc: string,
    extra_reward?: () => void,
    then?: () => void,
};

export type BasicStatsValuesMap = {
    Fans: number,
    Moni?: number,
    Stamina: number,
    Sing: number,
    Dance: number,
    Charm: number,
    Presence: number,
}

export type LiveTurn = {
    msg: string,
    your_stats?: BasicStatsValuesMap,
    enemy_stats?: BasicStatsValuesMap,
}

// Only f0-f30, i.e. 31 entries
// export enum ProgressFlag {
//     f0 = 1 << 0, f1 = 1 << 1, f2 = 1 << 2, f3 = 1 << 3, f4 = 1 << 4, f5 = 1 << 5, f6 = 1 << 6, f7 = 1 << 7,
//     f8 = 1 << 8, f9 = 1 << 9, f10 = 1 << 10, f11 = 1 << 11, f12 = 1 << 12, f13 = 1 << 13, f14 = 1 << 14, f15 = 1 << 15, 
//     f16 = 1 << 16, f17 = 1 << 17, f18 = 1 << 18, f19 = 1 << 19, f20 = 1 << 20, f21 = 1 << 21, f22 = 1 << 22, f23 = 1 << 23,
//     f24 = 1 << 24, f25 = 1 << 25, f26 = 1 << 26, f27 = 1 << 27, f28 = 1 << 28, f29 = 1 << 29, f30 = 1 << 30,
// };

// Which stat the Todo is effected by and by how much based on effectiveness. This only affects idle time.
export type StatEffectPair = { which_stat: BasicStats, effectiveness: number };

// Only 1 of flat_gain_base and flat_gain_multi can be defined at a time. 
// If depends is defined, training_efficiency has to be defined as well.
export type Rewards = { which_stat: BasicStats, flat_gain_base?: number, flat_gain_multi?: number, depends?: StatEffectPair[], efficiency?: TrainingEfficiency};
