import type { PrereqTooltip } from '$lib/data/todo_type';
import type { Rewards, TodoType } from '$lib/types';

export type ActionParams = {
    name: string;
    type: TodoType;
    base_time: number;
    desc: string;
    tooltip: PrereqTooltip;
    rewards: Rewards[];
    one_off?: boolean;
    haste_efficiency?: number;
    spendings?: { stat_name: string; value: number }[];
    extra_reward_fn?: () => void;
    check_disabled_fn?: (stats?: any) => boolean;
};

export type UpgradeDefinition = {
    trigger_action: string;
    remove_actions?: string[];
    add_actions?: ActionParams[];
    replace_all?: boolean;
    on_trigger?: () => void;
};

export type LocationDefinition = {
    location: {
        name: string;
        base_time: number;
        desc: string;
        tooltip: PrereqTooltip;
        rewards: Rewards[];
        check_disabled_fn?: (stats?: any) => boolean;
    };
    unlocks: string[];
    actions: ActionParams[];
    upgrades?: UpgradeDefinition[];
};
