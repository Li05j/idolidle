import { CPs } from "$lib/state/checkpoints.svelte"
import { stat_list, stat_list_reset } from "$lib/state/stats.svelte"
import type { BasicStats } from "$lib/types"
import { CFG } from '$lib/config'
import { Dreams } from '$lib/state/dreams.svelte'

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
            stat_list[key].base += this.base_gains[key] + Dreams.stat_base_bonus(key)
            stat_list[key].multi += this.multi_gains[key] + Dreams.stat_multi_bonus(key)
        }
    }

    award_rebirth_points() {
        let points = 1;
        for (let i = 1; i <= CPs.current_completed_checkpoint; i++) {
            points += CFG.checkpoint_dp_base ** i;
        }
        this._rebirth_points += points;
    }

    add_dream_points(n: number) {
        this._rebirth_points += n;
    }

    deduct_points(n: number) {
        this._rebirth_points -= n;
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

    serialize() {
        return {
            count: this._rebirth_count,
            max_cp: this._max_completed_checkpoints,
            points: this._rebirth_points,
            base_gains: { ...this.base_gains },
            multi_gains: { ...this.multi_gains },
        };
    }

    deserialize(data: unknown): void {
        if (!data || typeof data !== 'object') return;
        const d = data as {
            count?: unknown;
            max_cp?: unknown;
            points?: unknown;
            base_gains?: unknown;
            multi_gains?: unknown;
        };

        if (typeof d.count === 'number') this._rebirth_count = d.count;
        if (typeof d.max_cp === 'number') this._max_completed_checkpoints = d.max_cp;
        if (typeof d.points === 'number') this._rebirth_points = d.points;

        const filter = (src: unknown): Record<BasicStats, number> => {
            const out = zero_record();
            if (!src || typeof src !== 'object') return out;
            for (const k of STAT_KEYS) {
                const v = (src as Record<string, unknown>)[k];
                if (typeof v === 'number') out[k] = v;
            }
            return out;
        };

        this.base_gains = filter(d.base_gains);
        this.multi_gains = filter(d.multi_gains);
    }
}

export const Rebirth = new RebirthStats()
