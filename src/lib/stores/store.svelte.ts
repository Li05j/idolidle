class Trainings {
	private _training_constant = $state(727);

	get training_constant() {
		return this._training_constant
	}

	set training_constant(c: number) {
		this._training_constant = c
	}

	public get_training_time(base_cost: number, stat: number): number {
		return base_cost * Math.exp(-stat / this._training_constant)
	}
}

function createTrainings() {
	return new Trainings()
}

class Checkpoints {
	private _checkpoints = [20, 300, 400]
	private _max_idx = 3
	private _multi = $state([1.0, 1.0, 1.0])
	private _current_idx = $state(0)
	private _current_time_spent = $state(0)

	private getFinalTotalTime(idx: number): number {
		return idx < this._max_idx ? this._checkpoints[idx] * this._multi[idx] : NaN
	}

	get current_time_spent() { 
		return this._current_time_spent 
	}
	
	set current_time_spent(t: number) { 
		this._current_time_spent = t 
	}

	get current_checkpoint() { 
		return this._checkpoints[this.current_idx] 
	}

	get next_checkpoint() { 
		return this.current_idx < this._max_idx ? this._checkpoints[this.current_idx + 1] : NaN 
	}

	get current_multi() { 
		return this._multi[this.current_idx] 
	}

	setMulti(idx: number, val: number) { 
		this._multi[idx] = val 
	}

	get current_total_time() { 
		return this.getFinalTotalTime(this.current_idx) 
	}

	get next_total_time() { 
		return this.getFinalTotalTime(this.current_idx + 1) 
	}

	get current_idx() {
		return this._current_idx
	}

	nextCheckpoint() {
		if (this._current_idx < this._max_idx - 1) {
			this._current_idx++
			this._current_time_spent = 0
		}
	}

	reset() {
		this._current_idx = 0
		this._current_time_spent = 0
	}
}

function createCheckpoints() {
	return new Checkpoints()
}

function createCurrency(baseInit = 0, multiInit = 1.0) {
    let base = $state(baseInit);
    let multi = $state(multiInit);
    const final = (() => base * multi);

    return { 
		get base() { return base }, set base(v) { base = v },
        get multi() { return multi }, set multi(v) { multi = v },
        get final() { return final() } 
	};
}

function createStat(baseInit = 0, flatInit = 0.0, multiInit = 1.0) {
  	let base = $state(baseInit);
  	let flat = $state(flatInit);
  	let multi = $state(multiInit);
  	const final = (() => (base + flat) * multi);

  	return { 
		get base() { return base }, set base(v) { base = v },
        get flat() { return flat }, set flat(v) { flat = v },
        get multi() { return multi }, set multi(v) { multi = v },
        get final() { return final() } 
	};
}

export const checkpoint = createCheckpoints()
export const trainings = createTrainings()

export const fans = createCurrency();
export const moni = createCurrency();

export const sta = createStat();
export const sing = createStat();
export const dance = createStat();
export const charm = createStat();
export const eloq = createStat();