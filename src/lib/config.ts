import type { BasicStats } from '$lib/types';

const BUILD_ENV: 'prod' | 'dev' = 'dev';
export const DEV = BUILD_ENV === 'dev';

const PRESETS = {
	prod: {
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
	'prod-fast': {
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
	'super-fast': {
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

export type PresetName = keyof typeof PRESETS;
export const PRESET_NAMES = Object.keys(PRESETS) as PresetName[];

const PRESET_KEY = 'idolidle_preset';
const SAVE_KEY = 'idolidle_save';
const DEFAULT_PRESET: PresetName = 'super-fast';

function read_preset(): PresetName {
	if (typeof localStorage === 'undefined') return DEFAULT_PRESET;
	const v = localStorage.getItem(PRESET_KEY);
	return v && v in PRESETS ? (v as PresetName) : DEFAULT_PRESET;
}

export const CURRENT_PRESET: PresetName = read_preset();
export const CFG = PRESETS[CURRENT_PRESET];

export function switch_preset_and_restart(name: PresetName) {
	localStorage.setItem(PRESET_KEY, name);
	localStorage.removeItem(SAVE_KEY);
	window.location.reload();
}

export function restart_game() {
	localStorage.removeItem(SAVE_KEY);
	window.location.reload();
}

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
