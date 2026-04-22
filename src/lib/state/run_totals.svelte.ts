import type { BasicStats } from '$lib/types';

/**
 * Tracks how much Moni/Fans the player has *earned* over the current run,
 * independent of spending or LIVE losses. Used by Rebirth.inherit_stats so
 * carryover doesn't punish players for spending Moni or taking fan damage.
 *
 * Values are in "final" (displayed) units, matching what stat_list[k].final
 * would otherwise have returned at rebirth time.
 */
class RunTotalsState {
    private _moni_earned = $state(0);
    private _fans_earned = $state(0);

    add(stat: BasicStats, final_amount: number): void {
        if (final_amount <= 0) return;
        if (stat === 'Moni') this._moni_earned += final_amount;
        else if (stat === 'Fans') this._fans_earned += final_amount;
    }

    value(stat: BasicStats): number {
        if (stat === 'Moni') return this._moni_earned;
        if (stat === 'Fans') return this._fans_earned;
        return 0;
    }

    reset(): void {
        this._moni_earned = 0;
        this._fans_earned = 0;
    }

    get moni_earned() { return this._moni_earned; }
    get fans_earned() { return this._fans_earned; }

    serialize() {
        return { moni: this._moni_earned, fans: this._fans_earned };
    }

    deserialize(data: unknown): void {
        if (!data || typeof data !== 'object') return;
        const d = data as { moni?: unknown; fans?: unknown };
        if (typeof d.moni === 'number') this._moni_earned = d.moni;
        if (typeof d.fans === 'number') this._fans_earned = d.fans;
    }
}

export const RunTotals = new RunTotalsState();
