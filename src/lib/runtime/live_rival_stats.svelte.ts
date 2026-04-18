import type { LiveBattleStats } from "$lib/types";
import { CHECKPOINTS, generateRivalStats } from "$lib/data/checkpoints";
import { pickPersona, type Persona } from "$lib/data/rivals/personas";

export type RivalPreview = { stats: LiveBattleStats; persona: Persona };

const FALLBACK_PERSONA: Persona = {
    id: 'none',
    name: 'Your Rival',
    desc: '',
    weights: { fans: 1, stamina: 1, haste: 1, sing: 1, dance: 1, charm: 1, presence: 1 },
};

function emptyStats(): LiveBattleStats {
    return { Fans: 1, Max_Stamina: 1, Curr_Stamina: 1, Haste: 1, Sing: 1, Dance: 1, Charm: 1, Presence: 1 };
}

const FALLBACK_PREVIEW: RivalPreview = { stats: emptyStats(), persona: FALLBACK_PERSONA };

function rerollPreviews(): (RivalPreview | null)[] {
    return CHECKPOINTS.map(c => {
        if (!c.rival) return null;
        const persona = pickPersona();
        return { persona, stats: generateRivalStats(persona, c.rival) };
    });
}

class RivalStats {
    private _previews: (RivalPreview | null)[] = rerollPreviews();
    public battle: LiveBattleStats = emptyStats();

    preview(checkpoint: number): RivalPreview {
        return this._previews[checkpoint] ?? this._previews.find(p => p !== null) ?? FALLBACK_PREVIEW;
    }

    initForBattle(checkpoint: number) {
        this.battle = { ...this.preview(checkpoint).stats };
    }

    reroll() {
        this._previews = rerollPreviews();
    }
}

export const RivalStatsM = new RivalStats();
