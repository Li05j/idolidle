import { CPs } from "$lib/state/checkpoints.svelte"
import { stat_list, stat_list_reset } from "$lib/state/stats.svelte"
import type { BasicStats } from "$lib/types"
import { CFG } from '$lib/config'

function zero_record(): Record<BasicStats, number> {
    return { Fans: 0, Moni: 0, Stamina: 0, Haste: 0, Sing: 0, Dance: 0, Charm: 0, Presence: 0 }
}

const STAT_KEYS = Object.keys(stat_list) as BasicStats[]

class RebirthStats {
    private _rebirth_count = $state(0)
    private _max_completed_checkpoints = $state(0)
    private _rebirth_points = $state(0)

    private base_gains: Record<BasicStats, number> = $state(zero_record())
    private multi_gains: Record<BasicStats, number> = $state(zero_record())

	private BASE_RATIO = CFG.rebirth_base_ratio
	private MULTI_RATIO = CFG.rebirth_multi_ratio

    inherit_stats() {
        const multi_cap = 0.01 * (CPs.current_completed_checkpoint + 1)
        for (const key of STAT_KEYS) {
            this.base_gains[key] += stat_list[key].final * this.BASE_RATIO
            this.multi_gains[key] += Math.min(stat_list[key].final * this.MULTI_RATIO, multi_cap)
        }
    }

    apply_gains_to_initial_stats() {
        for (const key of STAT_KEYS) {
            stat_list[key].base += this.base_gains[key]
            stat_list[key].multi += this.multi_gains[key]
        }
    }

    award_rebirth_points() {
        this._rebirth_points += CPs.current_completed_checkpoint + 1;
    }

    increment_rebirth_count() { this._rebirth_count++; }
    update_max_completed_checkpoints(c: number) {
        if (c > this._max_completed_checkpoints) {
            this._max_completed_checkpoints = c
        }
    }

    get rebirth_count() { return this._rebirth_count; }
    get rebirth_points() { return this._rebirth_points; }
    get max_completed_checkpoints() { return this._max_completed_checkpoints; }
}

export const Rebirth = new RebirthStats()
