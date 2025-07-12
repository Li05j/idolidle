class Checkpoints {
	private _checkpoints = [200000, 300000, 400000]
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

export const checkpoints = createCheckpoints()