import { CFG } from '$lib/config';

type CheckpointDef = { time: number; multi: number };

class Checkpoints {
	public current_time_spent = $state(0)

	private _defs: CheckpointDef[] = $state([
		{ time: 1000,     multi: 1.0 },
		{ time: 2500,     multi: 1.0 },
		{ time: 4000,     multi: 1.0 },
		{ time: Infinity, multi: 1.0 },
	])
	private _idx = $state(0)
	private _last_triggered = $state(-1)

	get current_completed_checkpoint() {
		return this._idx
	}

	get current_multi() {
		return this._defs[this._idx].multi
	}

	setMulti(idx: number, val: number) {
		if (this._defs[idx]) this._defs[idx].multi = val
	}

	get current_total_time() {
		return this._defs[this._idx].time * CFG.time_scale * this._defs[this._idx].multi
	}

	readonly shouldTrigger = $derived(
		this._last_triggered !== this._idx &&
		this.current_time_spent >= this.current_total_time
	)

	markTriggered() {
		this._last_triggered = this._idx
	}

	advanceToNextCheckpoint() {
		if (this._idx < this._defs.length - 1) {
			this._idx++
			this.current_time_spent = 0
		}
	}

	reset() {
		this._idx = 0
		this.current_time_spent = 0
		this._last_triggered = -1
	}
}

export const CPs = new Checkpoints()
