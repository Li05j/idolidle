import { DECIMAL_PLACES, truncate_to_decimal } from "$lib/utils/utils"
import type { BasicStats } from "$lib/types"

type RoundFn = (v: number) => number;

function createStat(name: string, round: RoundFn, formatFinal: (v: number) => string, baseInit: number, multiInit: number) {
	let base = $state(baseInit);
	let multi = $state(multiInit);

	return {
		get name() { return name },
		get base() { return base }, set base(v) { base = v },
		get multi() { return multi }, set multi(v) { multi = v },
		add_base_from_final(v: number) { base += round(v / multi) },
		format_final_gain(v: number) { return round(v * multi).toString() },
		get final() { return round(base * multi) },
		get final_str() { return formatFinal(round(base * multi)) },
		reset() {
			base = baseInit;
			multi = multiInit;
		},
	};
}

export type Stat = ReturnType<typeof createStat>;

const floor = Math.floor;
const truncate = truncate_to_decimal;
const intFormat = (v: number) => v.toString();
const decFormat = (v: number) => v.toFixed(DECIMAL_PLACES);

export const stat_list: Record<BasicStats, Stat> = {
	Fans:     createStat('Fans',     floor,    intFormat, 35, 1.0),
	Moni:     createStat('Moni',     floor,    intFormat, 35, 1.0),
	Stamina:  createStat('Stamina',  truncate, decFormat, 15, 1.0),
	Haste:    createStat('Haste',    truncate, decFormat, 15, 1.0),
	Sing:     createStat('Sing',     truncate, decFormat, 15, 1.0),
	Dance:    createStat('Dance',    truncate, decFormat, 15, 1.0),
	Charm:    createStat('Charm',    truncate, decFormat, 15, 1.0),
	Presence: createStat('Presence', truncate, decFormat, 15, 1.0),
};

export function stat_list_reset() {
	for (const s of Object.values(stat_list)) s.reset();
}
