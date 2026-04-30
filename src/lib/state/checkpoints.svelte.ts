import { CFG } from '$lib/config';
import { CHECKPOINTS } from '$lib/data/checkpoints';

class Checkpoints {
	private _time_spent = $state(0)
	private _idx = $state(0)
	private _tick = $state(0)

	get current_time_spent() { return this._time_spent }
	set current_time_spent(v: number) { this._time_spent = v; this._tick++; }

	get mutation_tick() { return this._tick }
	mark_dirty() { this._tick++ }

	get current_completed_checkpoint() {
		return this._idx
	}

	get current_total_time() {
		return CHECKPOINTS[this._idx].time * CFG.time_scale
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
			this._time_spent = 0
			this._tick++
		}
	}

    reset() {
        this._idx = 0
        this._time_spent = 0
        this._tick++
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
