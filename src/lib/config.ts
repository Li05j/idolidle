import type { BasicStats } from '$lib/types';

const BUILD_ENV: 'prod' | 'dev' = 'dev';
export const DEV = BUILD_ENV === 'dev';

const prod = {
	time_scale: 1000.0,
	stat_init_add_value: 0.0,
	stat_init_multi: 1.0,
	rebirth_base_ratio: 0.025,
	rebirth_multi_ratio: 0.0001,
	rebirth_base_cap_per_cp: 1.0,
	rebirth_multi_cap_per_cp: 0.01,
	min_action_time: 100,
	mastery_rate: 0.01,
	mastery_exponent: 0.88,
	mastery_floor: 0.02,
	stat_scaling_exponent: 0.5,
	equip_drop_mult: 1,
	equip_drop_pivot_seconds: 5,
	equip_drop_above_exp: 0.9,
	checkpoint_dp_base: 2,
} as const;

const PRESETS = {
	prod,
	'prod-fast': { ...prod, time_scale: 100.0, min_action_time: 10 },
	'super-fast': {
		...prod,
		time_scale: 10.0,
		stat_init_add_value: 1.0,
		stat_init_multi: 10.0,
		rebirth_base_ratio: 0.1,
		rebirth_multi_ratio: 0.0005,
		rebirth_base_cap_per_cp: 5.0,
		rebirth_multi_cap_per_cp: 0.05,
	},
} as const;

export type PresetName = keyof typeof PRESETS;
export const PRESET_NAMES = Object.keys(PRESETS) as PresetName[];

const PRESET_KEY = 'idolidle_preset';
export const SAVE_KEY = 'idolidle_save';
const DEFAULT_PRESET: PresetName = 'super-fast';

function read_preset(): PresetName {
	if (typeof localStorage === 'undefined') return DEFAULT_PRESET;
	const v = localStorage.getItem(PRESET_KEY);
	return v && v in PRESETS ? (v as PresetName) : DEFAULT_PRESET;
}

export const CURRENT_PRESET: PresetName = read_preset();
export const CFG = PRESETS[CURRENT_PRESET];

async function disable_save() {
	const { Save } = await import('$lib/state/save.svelte');
	Save.disable();
}

export async function switch_preset_and_restart(name: PresetName) {
	await disable_save();
	localStorage.setItem(PRESET_KEY, name);
	localStorage.removeItem(SAVE_KEY);
	window.location.reload();
}

export async function restart_game() {
	await disable_save();
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
