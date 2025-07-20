import { logs } from "$lib/stores/history.svelte";
import { moni } from "$lib/stores/stats.svelte";
import type { Rewards, StatEffectPair, TodoType } from "$lib/types";
import { handle_rewards, reward_string } from "$lib/utils/utils";

export abstract class TodoBase {
    constructor(
        public name: string,
        public type: TodoType,
        public base_cost: number,
        public desc: string,
        public one_off: boolean = false,
    ) {}

    abstract spend_and_reward(): void;
    abstract get_spendings_rewards_string(): string;

    extra_reward?(): void;
    then?(): void;
}

export class LocationTodo extends TodoBase {
    constructor(
        name: string,
        base_cost: number,
        public depends: StatEffectPair[],
        public rewards: Rewards[],
        desc: string,
        opts: {
            extra_reward_fn?: () => void;
            then_fn?: () => void;
        } = {}
    ) {
        super(name, "location", base_cost, desc);
        this.one_off = true;
        if (opts.extra_reward_fn) this.extra_reward = opts.extra_reward_fn;
        if (opts.then_fn) this.then = opts.then_fn;
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
        opts: {
            extra_reward_fn?: () => void;
            then_fn?: () => void;
        } = {}
    ) {
        super(name, "action", base_cost, desc);
        if (opts.extra_reward_fn) this.extra_reward = opts.extra_reward_fn;
        if (opts.then_fn) this.then = opts.then_fn;
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
        public depends: StatEffectPair[],
        public rewards: Rewards[],
        desc: string,
        opts: {
            extra_reward_fn?: () => void;
            then_fn?: () => void;
        } = {}
    ) {
        super(name, "gain_currency", base_cost, desc);
        if (opts.extra_reward_fn) this.extra_reward = opts.extra_reward_fn;
        if (opts.then_fn) this.then = opts.then_fn;
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
        opts: {
            one_off_flag?: boolean;
            extra_reward_fn?: () => void;
            then_fn?: () => void;
        } = {}
    ) {
        super(name, "spend_currency", base_cost, desc);
        if (opts.one_off_flag) this.one_off = opts.one_off_flag;
        if (opts.extra_reward_fn) this.extra_reward = opts.extra_reward_fn;
        if (opts.then_fn) this.then = opts.then_fn;
    }

    spend_and_reward() {
        moni.base -= this.spendings_moni / moni.multi; // Divide multi to balance the gain out.
        handle_rewards(this.rewards);
        logs.addLogs(this);
        this.extra_reward?.();
    }

    get_spendings_rewards_string() {
        let ret_str = `-${this.spendings_moni} Moni `;
        return ret_str + reward_string(this.rewards)
    }
}

