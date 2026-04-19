import type { LiveBattleStats } from "$lib/types";
import type { RivalEquipEntry } from "$lib/data/equipment/equipment_definition";
import { CHECKPOINTS, generateRivalStats } from "$lib/data/checkpoints";
import { pickPersona, type Persona } from "$lib/data/rivals/personas";
import { RIVAL_EQUIP_BUDGET, generate_rival_loadout, apply_rival_equipment } from "$lib/data/rivals/rival_equipment";

export type RivalPreview = { stats: LiveBattleStats; persona: Persona; equipment: RivalEquipEntry[] };

const FALLBACK_PERSONA: Persona = {
    id: 'none',
    name: 'Your Rival',
    desc: '',
    weights: { fans: 1, stamina: 1, haste: 1, sing: 1, dance: 1, charm: 1, presence: 1 },
};

function emptyStats(): LiveBattleStats {
    return { Fans: 1, Max_Stamina: 1, Curr_Stamina: 1, Haste: 1, Sing: 1, Dance: 1, Charm: 1, Presence: 1 };
}

const FALLBACK_PREVIEW: RivalPreview = { stats: emptyStats(), persona: FALLBACK_PERSONA, equipment: [] };

function rerollPreviews(): (RivalPreview | null)[] {
    return CHECKPOINTS.map((c, i) => {
        if (!c.rival) return null;
        const persona = pickPersona();
        const stats = generateRivalStats(persona, c.rival);
        const budget = RIVAL_EQUIP_BUDGET[i] ?? 0;
        const equipment = generate_rival_loadout(budget);
        apply_rival_equipment(stats, equipment);
        return { persona, stats, equipment };
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
