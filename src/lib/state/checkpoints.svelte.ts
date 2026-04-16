import { CFG } from '$lib/config';
import { CHECKPOINTS } from '$lib/data/checkpoints';
import type { RivalTemplate } from '$lib/data/checkpoints';

class Checkpoints {
	public current_time_spent = $state(0)

	private _idx = $state(0)
	private _last_triggered = $state(-1)

	get current_completed_checkpoint() {
		return this._idx
	}

	get current_multi() {
		return CHECKPOINTS[this._idx].multi
	}

	get current_total_time() {
		const cp = CHECKPOINTS[this._idx];
		return cp.time * CFG.time_scale * cp.multi
	}

	get_rival_template(idx: number): RivalTemplate | undefined {
		return CHECKPOINTS[idx]?.rival;
	}

	readonly shouldTrigger = $derived(
		this._last_triggered !== this._idx &&
		this.current_time_spent >= this.current_total_time
	)

	markTriggered() {
		this._last_triggered = this._idx
	}

	advanceToNextCheckpoint() {
		if (this._idx < CHECKPOINTS.length - 1) {
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
