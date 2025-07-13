import type { Todo } from "$lib/types";
import { DECIMAL_PLACES, calc_stat_effectiveness } from "$lib/utils/utils"

class Trainings {
	private _training_constant = $state(727);

	private _calc_stat(td: Todo): number {
		let r = calc_stat_effectiveness(td.depends);
		return r;
	}

	get training_constant() {
		return this._training_constant
	}

	set training_constant(c: number) {
		this._training_constant = c
	}

	public get_final_training_time(td: Todo): number {
		return td.base_cost * Math.exp(-this._calc_stat(td) / this._training_constant)
	}
}

function createTrainings() {
	return new Trainings()
}

function createCurrency(baseInit = 0, multiInit = 1.0) {
    let base = $state(baseInit);
    let multi = $state(multiInit);
    const final = (() => Math.floor(base * multi));
	const final_str = (() => final().toString())

    return { 
		get base() { return base }, set base(v) { base = v },
        get multi() { return multi }, set multi(v) { multi = v },
		// get final() { return Math.max(final() || 0, 0) }, in case of NaN
        get final() { return final() },
		get final_str() { return final_str() },
	};
}

function createStat(baseInit = 0, flatInit = 0.0, multiInit = 1.0) {
  	let base = $state(baseInit);
  	let flat = $state(flatInit);
  	let multi = $state(multiInit);
  	const final = (() => (base + flat) * multi);
	const final_str = (() => final().toFixed(DECIMAL_PLACES))

  	return { 
		get base() { return base }, set base(v) { base = v },
        get flat() { return flat }, set flat(v) { flat = v },
        get multi() { return multi }, set multi(v) { multi = v },
        // get final() { return Math.max(final() || 0, 0) },
        get final() { return final() },
		get final_str() { return final_str() },
	};
}

export const trainings = createTrainings()

export const fans = createCurrency();
export const moni = createCurrency();

export const sta = createStat();
export const charm = createStat();
export const presence = createStat();
export const eloq = createStat();
export const poise = createStat();