import { logs } from "$lib/stores/history.svelte";
import { stat_list, stat_list_get } from "$lib/stores/stats.svelte";
import type { BasicStats, Rewards, TodoType } from "$lib/types";
import { handle_rewards, reward_string } from "$lib/utils/utils";

let todo_id_counter = 0;

type StatList = typeof stat_list;
export type PrereqTooltip =
    | { prereq?: string; dependsOn?: string; eureka?: string }
    | { custom_msg: string; prereq?: never; dependsOn?: never; extras?: never };

type ConstructorParams = {
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
    then_fn?: () => void;
    check_disabled_fn?: (stats?: StatList) => boolean;
};

export class TodoBase {
    name: string;
    type: TodoType;
    base_time: number;
    desc: string;
    tooltip: PrereqTooltip;
    rewards: Rewards[];
    one_off: boolean;
    haste_efficiency: number;
    spendings?: { stat_name: string; value: number }[];

    private _id = ++todo_id_counter;
    check_disabled: (stats?: StatList) => boolean = () => false;
    extra_reward?: () => void;
    then?: () => void;

    constructor({
        name,
        type,
        base_time,
        desc,
        tooltip,
        rewards,
        one_off = false,
        haste_efficiency = 1.0,
        spendings,
        extra_reward_fn,
        then_fn,
        check_disabled_fn
    }: ConstructorParams) {
        this.name = name;
        this.type = type;
        this.base_time = base_time;
        this.desc = desc;
        this.tooltip = tooltip;
        this.rewards = rewards;
        this.one_off = one_off;
        this.haste_efficiency = haste_efficiency;
        this.spendings = spendings;

        if (extra_reward_fn) this.extra_reward = extra_reward_fn;
        if (then_fn) this.then = then_fn;
        if (check_disabled_fn) this.check_disabled = check_disabled_fn;
    }

    get id() {
        return this._id;
    }

    spend_and_reward() {
        if (this.type === 'spend_currency' && this.spendings) {
            this.spendings.forEach(obj => {
                stat_list_get(obj.stat_name).add_to_final(-obj.value);
            });
        }

        handle_rewards(this.rewards);
        logs.addLogs(this);
        this.extra_reward?.();
    }

    get_spendings_rewards_string(): string {
        if (this.type === 'spend_currency') {
            let ret_str = ``;
            this.spendings?.forEach(obj => {
                ret_str += `-${obj.value} ${obj.stat_name} `;
            });
            return ret_str + reward_string(this.rewards);
        } else {
            return reward_string(this.rewards);
        }
    }
}
