class Checkpoints {
	public current_time_spent = $state(0)

	private _checkpoints = [200000, 300000, 400000]
	private _max_idx = 3
	private _multi = $state([1.0, 1.0, 1.0])
	private _current_idx = $state(0)

	private getFinalTotalTime(idx: number): number {
		return idx < this._max_idx ? this._checkpoints[idx] * this._multi[idx] : NaN
	}

	get current_checkpoint() { 
		return this._checkpoints[this._current_idx] 
	}

	get next_checkpoint() { 
		return this._current_idx < this._max_idx ? this._checkpoints[this._current_idx + 1] : NaN 
	}

	get current_multi() { 
		return this._multi[this._current_idx] 
	}

	setMulti(idx: number, val: number) { 
		this._multi[idx] = val 
	}

	get current_total_time() { 
		return this.getFinalTotalTime(this._current_idx) 
	}

	get next_total_time() { 
		return this.getFinalTotalTime(this._current_idx + 1) 
	}

	advanceToNextCheckpoint() {
		if (this._current_idx < this._max_idx - 1) {
			this._current_idx++
			this.current_time_spent = 0
		}
	}

	reset() {
		this._current_idx = 0
		this.current_time_spent = 0
	}
}

function createCheckpoints() {
	return new Checkpoints()
}

export const CPs = createCheckpoints()