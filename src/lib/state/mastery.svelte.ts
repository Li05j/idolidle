import { CFG } from '$lib/config';

class ActionMastery {
	private _counts: Record<string, number> = $state({});

	increment(mastery_id: string) {
		this._counts[mastery_id] = (this._counts[mastery_id] ?? 0) + 1;
	}

	completions(mastery_id: string): number {
		return this._counts[mastery_id] ?? 0;
	}

	// Rational (Hill) diminishing curve: floor + (1-floor) / (1 + rate * c^p)
	// Sub-linear p (≈0.88) keeps early grind cheap and stretches the decay so
	// mid-count reductions stay readable. With defaults:
	// ~0.93x at 10, ~0.77x at 50, ~0.64x at 100, ~0.30x at 500, ~0.20x at 1000.
	factor(mastery_id: string): number {
		return this.factor_for_count(this._counts[mastery_id] ?? 0);
	}

	factor_for_count(c: number): number {
		if (c <= 0) return 1;
		return CFG.mastery_floor + (1 - CFG.mastery_floor) / (1 + CFG.mastery_rate * Math.pow(c, CFG.mastery_exponent));
	}

	serialize(): Record<string, number> {
		return { ...this._counts };
	}

	deserialize(data: unknown): void {
		this._counts = {};
		if (!data || typeof data !== 'object') return;
		for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
			if (typeof v === 'number') this._counts[k] = v;
		}
	}
}

export const Mastery = new ActionMastery();
