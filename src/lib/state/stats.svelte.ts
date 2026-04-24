import { DECIMAL_PLACES, truncate_to_decimal } from "$lib/utils/utils"
import { BASIC_STATS, type BasicStats } from "$lib/types"
import { CFG } from '$lib/config'
import { Dreams } from '$lib/state/dreams.svelte'

type RoundFn = (v: number) => number;

function createStat(name: BasicStats, round: RoundFn, formatFinal: (v: number) => string, baseInit: number, multiInit: number) {
	let base = $state(baseInit);
	let multi = $state(multiInit);
	let equip_base = $state(0);
	let equip_multi = $state(0);

	const dream_base  = () => Dreams.stat_base_bonus(name);
	const dream_multi = () => Dreams.stat_multi_bonus(name);
	const total_base  = () => base + equip_base + dream_base();
	const total_multi = () => multi + equip_multi + dream_multi();

	return {
		get name() { return name },
		get base() { return base }, set base(v) { base = v },
		get multi() { return multi }, set multi(v) { multi = v },
		get equip_base() { return equip_base }, set equip_base(v) { equip_base = v },
		get equip_multi() { return equip_multi }, set equip_multi(v) { equip_multi = v },
		get total_base() { return total_base() },
		get total_multi() { return total_multi() },
		add_base_from_final(v: number) { base += round(v / total_multi()) },
		format_final_gain(v: number) { return round(v * total_multi()).toString() },
		get final() { return round(total_base() * total_multi()) },
		get final_str() { return formatFinal(round(total_base() * total_multi())) },
		reset() {
			base = baseInit;
			multi = multiInit;
			// equip_base/equip_multi NOT reset — recomputed from equipment state
		},
	};
}

export type Stat = ReturnType<typeof createStat>;

const floor = Math.floor;
const truncate = truncate_to_decimal;
const intFormat = (v: number) => v.toString();
const decFormat = (v: number) => v.toFixed(DECIMAL_PLACES);

const A = CFG.stat_init_add_value;
const B = CFG.stat_init_multi;

export const stat_list: Record<BasicStats, Stat> = {
	Fans:     createStat('Fans',     floor,    intFormat, (1 + A) * B, 1.0),
	Moni:     createStat('Moni',     floor,    intFormat, (0 + A) * B, 1.0),
	Stamina:  createStat('Stamina',  truncate, decFormat, (1 + A) * B, 1.0),
	Haste:    createStat('Haste',    truncate, decFormat, (1 + A) * B, 1.0),
	Sing:     createStat('Sing',     truncate, decFormat, (1 + A) * B, 1.0),
	Dance:    createStat('Dance',    truncate, decFormat, (1 + A) * B, 1.0),
	Charm:    createStat('Charm',    truncate, decFormat, (1 + A) * B, 1.0),
	Presence: createStat('Presence', truncate, decFormat, (1 + A) * B, 1.0),
};

export function stat_list_reset() {
	for (const s of Object.values(stat_list)) s.reset();
}

export type StatsSave = Partial<Record<BasicStats, { base: number; multi: number }>>;

export function stat_list_serialize(): StatsSave {
	const out: StatsSave = {};
	for (const k of BASIC_STATS) {
		out[k] = { base: stat_list[k].base, multi: stat_list[k].multi };
	}
	return out;
}

export function stat_list_deserialize(data: unknown): void {
	if (!data || typeof data !== 'object') return;
	const d = data as Record<string, { base?: unknown; multi?: unknown } | undefined>;
	for (const k of BASIC_STATS) {
		const v = d[k];
		if (!v) continue;
		if (typeof v.base === 'number') stat_list[k].base = v.base;
		if (typeof v.multi === 'number') stat_list[k].multi = v.multi;
	}
}
