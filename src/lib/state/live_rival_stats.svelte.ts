import type { LiveBattleStats } from "$lib/types";
import { RIVAL_TEMPLATES, generateRivalStats } from "$lib/data/rival_stats";

function emptyStats(): LiveBattleStats {
    return { Fans: 1, Max_Stamina: 1, Curr_Stamina: 1, Haste: 1, Sing: 1, Dance: 1, Charm: 1, Presence: 1 };
}

class RivalStats {
    private _previews: LiveBattleStats[] = RIVAL_TEMPLATES.map(generateRivalStats);
    public battle: LiveBattleStats = emptyStats();

    preview(checkpoint: number): LiveBattleStats {
        return this._previews[checkpoint] ?? this._previews[0];
    }

    initForBattle(checkpoint: number) {
        this.battle = { ...this.preview(checkpoint) };
    }

    reroll() {
        this._previews = RIVAL_TEMPLATES.map(generateRivalStats);
    }
}

export const RivalStatsM = new RivalStats();
