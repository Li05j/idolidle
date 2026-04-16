import type { LiveBattleStats } from "$lib/types";
import { CHECKPOINTS, generateRivalStats } from "$lib/data/checkpoints";

function emptyStats(): LiveBattleStats {
    return { Fans: 1, Max_Stamina: 1, Curr_Stamina: 1, Haste: 1, Sing: 1, Dance: 1, Charm: 1, Presence: 1 };
}

function rerollPreviews(): (LiveBattleStats | null)[] {
    return CHECKPOINTS.map(c => c.rival ? generateRivalStats(c.rival) : null);
}

class RivalStats {
    private _previews: (LiveBattleStats | null)[] = rerollPreviews();
    public battle: LiveBattleStats = emptyStats();

    preview(checkpoint: number): LiveBattleStats {
        return this._previews[checkpoint] ?? this._previews.find(p => p !== null) ?? emptyStats();
    }

    initForBattle(checkpoint: number) {
        this.battle = { ...this.preview(checkpoint) };
    }

    reroll() {
        this._previews = rerollPreviews();
    }
}

export const RivalStatsM = new RivalStats();
