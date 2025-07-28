import type { TodoBase } from "$lib/data/todo_type";
import { DECIMAL_PLACES, truncate_to_decimal } from "$lib/utils/utils"

class Trainings {
	private _training_constant = $state(650);
	private _min_training_time = $state(100); // ms

	private _calc_stat(td: TodoBase): number {
		let r = stat_list.Haste.final * td.haste_efficiency;
		return r;
	}

	public get_final_training_time(td: TodoBase): number {
		let t = truncate_to_decimal(td.base_time * Math.exp(-this._calc_stat(td) / this._training_constant))
		return Math.max(t, this._min_training_time);
	}
}

function createTrainings() {
	return new Trainings()
}

// Currency floors while Stat can have decimals.
function createCurrency(name: string, baseInit = 0, multiInit = 1.0) {
	const _name = name;
    let base = $state(baseInit);
    let multi = $state(multiInit);
	const add_to_final = ((v: number) => base += Math.floor(v / multi))
	const get_final_gain_str = ((v: number) => { return Math.floor(v * multi).toString() })
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
		add_to_final,
		get_final_gain_str,
        get final() { return final() },
		get final_str() { return final_str() },
		reset,
	};
}

function createStat(name: string, baseInit = 0, multiInit = 1.0) {
	const _name = name;
  	let base = $state(baseInit);
  	let multi = $state(multiInit);
	const add_to_final = ((v: number) => base += truncate_to_decimal(v / multi))
	const get_final_gain_str = ((v: number) => { return truncate_to_decimal(v * multi).toString() })
  	const final = (() => truncate_to_decimal(base * multi));
	const final_str = (() => final().toFixed(DECIMAL_PLACES))
	const reset = () => {
	  	base = baseInit;
	  	multi = multiInit;
	}


  	return { 
		get name() { return _name },
		get base() { return base }, set base(v) { base = v },
        get multi() { return multi }, set multi(v) { multi = v },
        add_to_final,
		get_final_gain_str,
        get final() { return final() },
		get final_str() { return final_str() },
		reset,
	};
}

export const trainings = createTrainings()
export const dummy = createStat('Dummy');

const fans = createCurrency('Fans');
const moni = createCurrency('Moni');

const sta = createStat('Stamina');
const haste = createStat('Haste');
const sing = createStat('Sing');
const dance = createStat('Dance');
const charm = createStat('Charm');
const pres = createStat('Presence');

export const stat_list = {
	Fans: fans,
	Moni: moni,
	Stamina: sta,
	Haste: haste,
	Sing: sing,
	Dance: dance,
	Charm: charm,
	Presence: pres,
}

export function stat_list_get(s: string) {
	switch (s) {
		case "Fans": 		return fans;
		case "Moni": 		return moni;
		case "Stamina": 	return sta;
		case "Haste": 		return haste;
		case "Sing": 		return sing;
		case "Dance": 		return dance;
		case "Charm": 		return charm;
		case "Presence": 	return pres;
		default:			return dummy;
	}
}

export function stat_list_reset() {
	fans.reset();
	moni.reset();
	sta.reset();
	haste.reset();
	sing.reset();
	dance.reset();
	charm.reset();
	pres.reset();
}