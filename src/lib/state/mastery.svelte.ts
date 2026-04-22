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
	// p > 1 keeps the early phase gentle; the polynomial denominator throttles
	// the dive so we get a short accel phase then long decel into the floor.
	// With defaults: ~0.87x at 10, ~0.18x at 100, ~0.026x at 1000, ~floor at 10000.
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
