import { CFG } from '$lib/config';
import { CHECKPOINTS } from '$lib/data/checkpoints';

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

    serialize() {
        return {
            idx: this._idx,
            time_spent: this.current_time_spent,
            last_triggered: this._last_triggered,
        };
    }

    deserialize(data: unknown) {
        if (!data || typeof data !== 'object') return;
        const d = data as { idx?: unknown; time_spent?: unknown; last_triggered?: unknown };

        const max_idx = CHECKPOINTS.length - 1;
        let idx = typeof d.idx === 'number' ? d.idx : 0;
        idx = Math.max(0, Math.min(max_idx, Math.floor(idx)));
        this._idx = idx;

        this.current_time_spent = typeof d.time_spent === 'number' ? d.time_spent : 0;

        let lt = typeof d.last_triggered === 'number' ? Math.floor(d.last_triggered) : -1;

        // Re-trigger guard: saved post-trigger but pre-conclude → make shouldTrigger fire again on load.
        if (lt === idx && this.current_time_spent >= this.current_total_time) {
            lt = idx - 1;
        }
        this._last_triggered = lt;
    }
}

export const CPs = new Checkpoints()
