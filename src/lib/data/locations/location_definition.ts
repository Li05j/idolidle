import type { BasicStats, Rewards } from '$lib/types';

export type ActionKind = 'training' | 'earning' | 'spending';

export type ActionDef = {
    name: string;
    desc: string;
    base_time: number;
    kind: ActionKind;
    uses?: number;

    rewards: Rewards[];
    costs?: { stat: BasicStats; amount: number }[];

    requires?: {
        text: string;
        check: () => boolean;
    };

    on_complete?: {
        fn: () => void;
        hint?: string;
    };
};

export type UpgradeDef = {
    trigger_action: string;
    remove_actions?: string[];
    add_actions?: ActionDef[];
    replace_all?: boolean;
    on_trigger?: () => void;
};

export type LocationDef = {
    name: string;
    desc: string;
    base_time: number;
    hint?: string;
    rewards: Rewards[];
    requires?: {
        text: string;
        check: () => boolean;
    };
    unlocks: string[];
    actions: ActionDef[];
    upgrades?: UpgradeDef[];
};
