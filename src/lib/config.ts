import type { BasicStats } from '$lib/types';

// 0 = prod, 1 = prod-fast, 2 = super-fast
const ENV: 0 | 1 | 2 = 2;

const envs = {
	0: {
		time_scale: 1000.0,
		stat_init_add_value: 0.0,
		stat_init_multi: 1.0,
		rebirth_base_ratio: 0.025,
		rebirth_multi_ratio: 0.0001,
		min_action_time: 100,
		mastery_rate: 0.02,
		mastery_offset: 0.04,
		equip_drop_mult: 1,
		checkpoint_dp_base: 2,
	},
	1: {
		time_scale: 100.0,
		stat_init_add_value: 0.0,
		stat_init_multi: 1.0,
		rebirth_base_ratio: 0.025,
		rebirth_multi_ratio: 0.0001,
		min_action_time: 100,
		mastery_rate: 0.02,
		mastery_offset: 0.04,
		equip_drop_mult: 1,
		checkpoint_dp_base: 2,
	},
	2: {
		time_scale: 10.0,
		stat_init_add_value: 1.0,
		stat_init_multi: 10.0,
		rebirth_base_ratio: 0.1,
		rebirth_multi_ratio: 0.0005,
		min_action_time: 100,
		mastery_rate: 0.02,
		mastery_offset: 0.04,
		equip_drop_mult: 1,
		checkpoint_dp_base: 2,
	},
} as const;

export const DEV = ENV !== 0;
export const CFG = envs[ENV];

// Design-time reference: canonical stat gain per second at 1.0x value.
// value = sum(reward_i / BASE_RATE[stat_i]) / base_time
export const BASE_RATE: Record<BasicStats, number> = {
	Stamina:  0.05,
	Fans:     0.1,
	Moni:     0.3,
	Sing:     0.1,
	Dance:    0.1,
	Charm:    0.1,
	Presence: 0.1,
	Haste:    0.1,
};
