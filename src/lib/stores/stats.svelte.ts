import type { TodoBase } from "$lib/data/todo_type.svelte";
import { DECIMAL_PLACES, calc_stat_effectiveness } from "$lib/utils/utils"

class Trainings {
	private _training_constant = $state(727);

	private _calc_stat(td: TodoBase): number {
		let r = calc_stat_effectiveness(td.get_depends());
		return r;
	}

	get training_constant() {
		return this._training_constant
	}

	set training_constant(c: number) {
		this._training_constant = c
	}

	public get_final_training_time(td: TodoBase): number {
		return td.base_cost * Math.exp(-this._calc_stat(td) / this._training_constant)
	}
}

function createTrainings() {
	return new Trainings()
}

// Currency floors while Stat can have decimals.
function createCurrency(name: string, baseInit = 5, multiInit = 1.0) {
	const _name = name;
    let base = $state(baseInit);
    let multi = $state(multiInit);
    const final = (() => Math.floor(base * multi));
	const final_str = (() => final().toString())
	const reset = () => {
	  	base = baseInit;
	  	multi = multiInit;
	}

    return { 
		get name() { return _name },
		get base() { return base }, set base(v) { base = v },
        get multi() { return multi }, set multi(v) { multi = v },
		// get final() { return Math.max(final() || 0, 0) }, in case of NaN
        get final() { return final() },
		get final_str() { return final_str() },
		reset,
	};
}

function createStat(name: string, baseInit = 12, multiInit = 1.0) {
	const _name = name;
  	let base = $state(baseInit);
  	let multi = $state(multiInit);
  	const final = (() => base * multi);
	const final_str = (() => final().toFixed(DECIMAL_PLACES))
	const reset = () => {
	  	base = baseInit;
	  	multi = multiInit;
	}


  	return { 
		get name() { return _name },
		get base() { return base }, set base(v) { base = v },
        get multi() { return multi }, set multi(v) { multi = v },
        // get final() { return Math.max(final() || 0, 0) },
        get final() { return final() },
		get final_str() { return final_str() },
		reset,
	};
}

export const trainings = createTrainings()

export const fans = createCurrency('Fans');
export const moni = createCurrency('Moni');

export const sta = createStat('Stamina');
export const sing = createStat('Sing');
export const dance = createStat('Dance');
export const charm = createStat('Charm');
export const pres = createStat('Presence');

export const dummy = createStat('Dummy');

export const stat_list = {
	fans: fans,
	moni: moni,
	sta: sta,
	sing: sing,
	dance: dance,
	charm: charm,
	pres: pres,
}

export function stat_list_reset() {
	fans.reset();
	moni.reset();
	sta.reset();
	sing.reset();
	dance.reset();
	charm.reset();
	pres.reset();
}