import { CFG } from '$lib/config';
import { CHECKPOINTS } from '$lib/data/checkpoints';

class Checkpoints {
	public current_time_spent = $state(0)

	private _idx = $state(0)

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

	get is_terminal() {
		return !CHECKPOINTS[this._idx]?.rival;
	}

	readonly is_live_pending = $derived(
		!this.is_terminal && this.current_time_spent >= this.current_total_time
	)

	advanceToNextCheckpoint() {
		if (this._idx < CHECKPOINTS.length - 1) {
			this._idx++
			this.current_time_spent = 0
		}
	}

    reset() {
        this._idx = 0
        this.current_time_spent = 0
    }

    serialize() {
        return {
            idx: this._idx,
            time_spent: this.current_time_spent,
        };
    }

    deserialize(data: unknown) {
        if (!data || typeof data !== 'object') return;
        const d = data as { idx?: unknown; time_spent?: unknown };

        const max_idx = CHECKPOINTS.length - 1;
        let idx = typeof d.idx === 'number' ? d.idx : 0;
        idx = Math.max(0, Math.min(max_idx, Math.floor(idx)));
        this._idx = idx;

        this.current_time_spent = typeof d.time_spent === 'number' ? d.time_spent : 0;
    }
}

export const CPs = new Checkpoints()
