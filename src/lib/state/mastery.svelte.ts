import { CFG } from '$lib/config';

class ActionMastery {
	private _counts: Record<string, number> = $state({});

	increment(mastery_id: string) {
		this._counts[mastery_id] = (this._counts[mastery_id] ?? 0) + 1;
	}

	completions(mastery_id: string): number {
		return this._counts[mastery_id] ?? 0;
	}

	// Diminishing returns: min(1, 1/(1 + rate * sqrt(c)) + offset)
	// Dead zone at low counts (clamped to 1.0), then sqrt decay.
	// ~0.98x at 10, ~0.87x at 100, ~0.65x at 1000
	factor(mastery_id: string): number {
		const c = this._counts[mastery_id] ?? 0;
		if (c === 0) return 1;
		return Math.min(1, 1 / (1 + CFG.mastery_rate * Math.sqrt(c)) + CFG.mastery_offset);
	}
}

export const Mastery = new ActionMastery();
