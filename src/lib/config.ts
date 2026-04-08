const DEV = 1

const dev = {
	time_scale: 1.0,
	stat_init_add_value: 1.0,
	stat_init_multi: 10,
	rebirth_base_ratio: 0.1,
	rebirth_multi_ratio: 0.0005,
	min_action_time: 100,
} as const;

const prod = {
	time_scale: 1000.0,
	stat_init_add_value: 0.0,
	stat_init_multi: 1.0,
	rebirth_base_ratio: 0.025,
	rebirth_multi_ratio: 0.0001,
	min_action_time: 100,
} as const;

export const CFG = DEV ? dev : prod;
