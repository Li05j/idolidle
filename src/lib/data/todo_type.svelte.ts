import { logs } from "$lib/stores/history.svelte";
import { stat_list } from "$lib/stores/stats.svelte";
import type { Rewards, StatEffectPair, TodoType } from "$lib/types";
import { handle_rewards, reward_string } from "$lib/utils/utils";

type StatList = typeof stat_list;
export type PrereqTooltip =
    | { prereq?: string; dependsOn?: string; eureka?: string }   // all keys optional
    | { custom_msg: string; prereq?: never; dependsOn?: never; extras?: never }; // only custom_msg allowed

export abstract class TodoBase {
    constructor(
        public name: string,
        public type: TodoType,
        public base_cost: number,
        public desc: string,
        public tooltip: PrereqTooltip,
        public one_off: boolean = false,
    ) {}

    abstract spend_and_reward(): void;
    abstract get_spendings_rewards_string(): string;

    // Some don't have depends - and in this case their base cost cannot be lowered. So, we simply return empty array.
    get_depends(): StatEffectPair[] {
        if ('depends' in this) {
            return (this as { depends: StatEffectPair[] }).depends;
        } else {
            return [];
        }
    }

    extra_reward?(): void;
    then?(): void;

    check_disabled(stats = stat_list): boolean {
        return false;
    }
}

export class LocationTodo extends TodoBase {
    constructor(
        name: string,
        base_cost: number,
        public depends: StatEffectPair[],
        public rewards: Rewards[],
        desc: string,
        tooltip: PrereqTooltip,
        opts: {
            extra_reward_fn?: () => void;
            then_fn?: () => void;
            check_disabled_fn?: (stats: StatList) => boolean;
        } = {}
    ) {
        super(name, "location", base_cost, desc, tooltip);
        this.one_off = true;
        if (opts.extra_reward_fn) this.extra_reward = opts.extra_reward_fn;
        if (opts.then_fn) this.then = opts.then_fn;
        if (opts.check_disabled_fn) this.check_disabled = opts.check_disabled_fn;
    }

    spend_and_reward() {
        handle_rewards(this.rewards);
        logs.addLogs(this);
        this.extra_reward?.();
    }

    get_spendings_rewards_string() {
        return reward_string(this.rewards)
    }
}

export class ActionTodo extends TodoBase {
    constructor(
        name: string,
        base_cost: number,
        public depends: StatEffectPair[],
        public rewards: Rewards[],
        desc: string,
        tooltip: PrereqTooltip,
        opts: {
            extra_reward_fn?: () => void;
            then_fn?: () => void;
            check_disabled_fn?: (stats: StatList) => boolean;
        } = {}
    ) {
        super(name, "action", base_cost, desc, tooltip);
        if (opts.extra_reward_fn) this.extra_reward = opts.extra_reward_fn;
        if (opts.then_fn) this.then = opts.then_fn;
        if (opts.check_disabled_fn) this.check_disabled = opts.check_disabled_fn;
    }

    spend_and_reward() {
        handle_rewards(this.rewards);
        logs.addLogs(this);
        this.extra_reward?.();
    }

    get_spendings_rewards_string() {
        return reward_string(this.rewards)
    }
}

export class GainCurrencyTodo extends TodoBase {
    constructor(
        name: string,
        base_cost: number,
        public rewards: Rewards[],
        desc: string,
        tooltip: PrereqTooltip,
        opts: {
            extra_reward_fn?: () => void;
            then_fn?: () => void;
            check_disabled_fn?: (stats: StatList) => boolean;
        } = {}
    ) {
        super(name, "gain_currency", base_cost, desc, tooltip);
        if (opts.extra_reward_fn) this.extra_reward = opts.extra_reward_fn;
        if (opts.then_fn) this.then = opts.then_fn;
        if (opts.check_disabled_fn) this.check_disabled = opts.check_disabled_fn;
    }

    spend_and_reward() {
        handle_rewards(this.rewards);
        logs.addLogs(this);
        this.extra_reward?.();
    }

    get_spendings_rewards_string() {
        return reward_string(this.rewards)
    }
}

export class SpendCurrencyTodo extends TodoBase {
    constructor(
        name: string,
        base_cost: number,
        public spendings_moni: number,
        public rewards: Rewards[],
        desc: string,
        tooltip: PrereqTooltip,
        opts: {
            one_off_flag?: boolean;
            extra_reward_fn?: () => void;
            then_fn?: () => void;
            check_disabled_fn?: (stats: StatList) => boolean;
        } = {}
    ) {
        super(name, "spend_currency", base_cost, desc, tooltip);
        if (opts.one_off_flag) this.one_off = opts.one_off_flag;
        if (opts.extra_reward_fn) this.extra_reward = opts.extra_reward_fn;
        if (opts.then_fn) this.then = opts.then_fn;
        if (opts.check_disabled_fn) this.check_disabled = opts.check_disabled_fn;
    }

    spend_and_reward() {
        stat_list.moni.base -= this.spendings_moni / stat_list.moni.multi; // Divide multi to balance the gain out.
        handle_rewards(this.rewards);
        logs.addLogs(this);
        this.extra_reward?.();
    }

    get_spendings_rewards_string() {
        let ret_str = `-${this.spendings_moni} Moni `;
        return ret_str + reward_string(this.rewards)
    }
}

