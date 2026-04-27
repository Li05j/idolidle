import type { LiveBattleStats } from "$lib/types";
import type { RivalEquipEntry, Rarity } from "$lib/data/equipment/equipment_definition";
import { CHECKPOINTS, generateRivalStats } from "$lib/data/checkpoints";
import { pickPersona, pickAdjective, ALL_PERSONAS, type Persona } from "$lib/data/rivals/personas";
import { generate_rival_loadout, apply_rival_equipment } from "$lib/data/rivals/rival_equipment";
import { EQUIP_REGISTRY } from "$lib/data/equipment";

export type RivalPreview = { stats: LiveBattleStats; persona: Persona; adjective: string; equipment: RivalEquipEntry[]; budget_cap: number };

const FALLBACK_PERSONA: Persona = {
    id: 'none',
    name: 'Your Rival',
    desc: '',
    weights: { fans: 1, stamina: 1, haste: 1, sing: 1, dance: 1, charm: 1, presence: 1 },
};

function emptyStats(): LiveBattleStats {
    return { Fans: 1, Max_Stamina: 1, Curr_Stamina: 1, Haste: 1, Sing: 1, Dance: 1, Charm: 1, Presence: 1, Style: 0 };
}

const FALLBACK_PREVIEW: RivalPreview = { stats: emptyStats(), persona: FALLBACK_PERSONA, adjective: '', equipment: [], budget_cap: 0 };

function rerollPreviews(): (RivalPreview | null)[] {
    return CHECKPOINTS.map((c) => {
        if (!c.rival) return null;
        const persona = pickPersona();
        const adjective = pickAdjective();
        const stats = generateRivalStats(persona, c.rival.scale);
        const { loadout: equipment, budget_cap } = generate_rival_loadout(c.rival.scale.equip_budget);
        apply_rival_equipment(stats, equipment);
        return { persona, adjective, stats, equipment, budget_cap };
    });
}

class RivalStats {
    private _previews: (RivalPreview | null)[] = $state(rerollPreviews());
    private _tick = $state(0);
    public battle: LiveBattleStats = emptyStats();

    get mutation_tick() { return this._tick; }
    mark_dirty() { this._tick++; }

    preview(checkpoint: number): RivalPreview {
        return this._previews[checkpoint] ?? this._previews.find(p => p !== null) ?? FALLBACK_PREVIEW;
    }

    initForBattle(checkpoint: number) {
        this.battle = { ...this.preview(checkpoint).stats };
    }

    reroll() {
        this._previews = rerollPreviews();
        this._tick++;
    }

    serialize() {
        return {
            previews: this._previews.map(p => p === null ? null : ({
                persona_id: p.persona.id,
                adjective: p.adjective,
                stats: { ...p.stats },
                equipment: p.equipment.map(e => ({ ...e })),
                budget_cap: p.budget_cap,
            })),
        };
    }

    deserialize(data: unknown): void {
        const fresh = rerollPreviews();
        if (!data || typeof data !== 'object') {
            this._previews = fresh;
            return;
        }
        const d = data as { previews?: unknown };
        if (!Array.isArray(d.previews)) {
            this._previews = fresh;
            return;
        }

        const persona_by_id = new Map(ALL_PERSONAS.map(p => [p.id, p] as const));
        const valid_rarity = (r: unknown): r is Rarity => r === 'N' || r === 'R' || r === 'SR' || r === 'UR';
        const parse_stats = (raw: unknown): LiveBattleStats | null => {
            if (!raw || typeof raw !== 'object') return null;
            const s = raw as Record<string, unknown>;
            const keys: (keyof LiveBattleStats)[] = ['Fans', 'Max_Stamina', 'Curr_Stamina', 'Haste', 'Sing', 'Dance', 'Charm', 'Presence'];
            const out: Partial<LiveBattleStats> = {};
            for (const k of keys) {
                if (typeof s[k] !== 'number') return null;
                out[k] = s[k] as number;
            }
            out.Style = typeof s.Style === 'number' ? s.Style : 0;
            return out as LiveBattleStats;
        };

        const out: (RivalPreview | null)[] = [];
        for (let i = 0; i < CHECKPOINTS.length; i++) {
            const cp = CHECKPOINTS[i];
            if (!cp.rival) { out.push(null); continue; }

            const raw = d.previews[i];
            if (!raw || typeof raw !== 'object') {
                out.push(fresh[i]);
                continue;
            }
            const p = raw as { persona_id?: unknown; adjective?: unknown; stats?: unknown; equipment?: unknown; budget_cap?: unknown };
            const persona = typeof p.persona_id === 'string' ? persona_by_id.get(p.persona_id) : undefined;
            const stats = parse_stats(p.stats);
            if (!persona || !stats) {
                out.push(fresh[i]);
                continue;
            }
            const adjective = typeof p.adjective === 'string' && p.adjective.length > 0
                ? p.adjective
                : pickAdjective();

            const equipment: RivalEquipEntry[] = [];
            if (Array.isArray(p.equipment)) {
                for (const er of p.equipment) {
                    if (!er || typeof er !== 'object') continue;
                    const e = er as { equip_id?: unknown; rarity?: unknown; level?: unknown };
                    if (typeof e.equip_id !== 'string') continue;
                    if (!EQUIP_REGISTRY.has(e.equip_id)) continue;
                    if (!valid_rarity(e.rarity)) continue;
                    equipment.push({
                        equip_id: e.equip_id,
                        rarity: e.rarity,
                        level: typeof e.level === 'number' ? e.level : 1,
                    });
                }
            }

            const budget_cap = typeof p.budget_cap === 'number' ? p.budget_cap : 0;
            out.push({ persona, adjective, stats, equipment, budget_cap });
        }

        this._previews = out;
    }
}

export const RivalStatsM = new RivalStats();
