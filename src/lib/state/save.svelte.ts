import { CURRENT_PRESET, SAVE_KEY, type PresetName } from '$lib/config';
import { stat_list, stat_list_serialize, stat_list_deserialize } from '$lib/state/stats.svelte';
import { CPs } from '$lib/state/checkpoints.svelte';
import { EquipM } from '$lib/state/equipment.svelte';
import { Mastery } from '$lib/state/mastery.svelte';
import { Rebirth } from '$lib/state/rebirth.svelte';
import { Dreams } from '$lib/state/dreams.svelte';
import { TD_List_Tracker } from '$lib/state/todos_list_tracker.svelte';
import { RivalStatsM } from '$lib/runtime/live_rival_stats.svelte';
import { TodoCardM } from '$lib/runtime/todo_card_manager.svelte';

const SAVE_VERSION = 1 as const;
const DEBOUNCE_MS = 1000;

type SaveBlob = {
    version: typeof SAVE_VERSION;
    preset: PresetName;
    stats:   ReturnType<typeof stat_list_serialize>;
    cps:     ReturnType<typeof CPs.serialize>;
    equip:   ReturnType<typeof EquipM.serialize>;
    mastery: ReturnType<typeof Mastery.serialize>;
    rebirth: ReturnType<typeof Rebirth.serialize>;
    dreams:  ReturnType<typeof Dreams.serialize>;
    td:      ReturnType<typeof TD_List_Tracker.serialize>;
    rivals:  ReturnType<typeof RivalStatsM.serialize>;
};

class SaveManager {
    private _battle_in_progress = false;
    private _debounce_id: ReturnType<typeof setTimeout> | null = null;
    private _autosave_started = false;
    private _loaded = false;

    set_battle_in_progress(b: boolean) {
        this._battle_in_progress = b;
    }

    /** Caller asserts hydration is finished (load() ran, or fresh init completed). */
    mark_loaded() {
        this._loaded = true;
    }

    /** Stamp the active card's live elapsed into the tracker, then write the whole blob. */
    save_now = () => {
        if (typeof localStorage === 'undefined') return;
        if (!this._loaded) return;
        if (this._battle_in_progress) return;

        const snap = TodoCardM.active_snapshot;
        if (snap) {
            TD_List_Tracker.set_elapsed(snap.key.loc, snap.key.action, snap.elapsed);
        }

        const blob: SaveBlob = {
            version: SAVE_VERSION,
            preset: CURRENT_PRESET,
            stats:   stat_list_serialize(),
            cps:     CPs.serialize(),
            equip:   EquipM.serialize(),
            mastery: Mastery.serialize(),
            rebirth: Rebirth.serialize(),
            dreams:  Dreams.serialize(),
            td:      TD_List_Tracker.serialize(),
            rivals:  RivalStatsM.serialize(),
        };

        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(blob));
        } catch (e) {
            console.error('save failed', e);
        }
    };

    /** Returns true if a save was loaded; false if there was nothing or it was rejected. */
    load(): boolean {
        if (typeof localStorage === 'undefined') return false;
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return false;

        let parsed: unknown;
        try {
            parsed = JSON.parse(raw);
        } catch {
            return false;
        }

        if (!parsed || typeof parsed !== 'object') return false;
        const p = parsed as Partial<SaveBlob>;
        if (p.version !== SAVE_VERSION) return false;

        stat_list_deserialize(p.stats);
        CPs.deserialize(p.cps);
        EquipM.deserialize(p.equip);
        Mastery.deserialize(p.mastery);
        Rebirth.deserialize(p.rebirth);
        Dreams.deserialize(p.dreams);
        TD_List_Tracker.deserialize(p.td);
        RivalStatsM.deserialize(p.rivals);

        return true;
    }

    /** Set up debounced autosave + beforeunload flush. Idempotent. */
    start_autosave() {
        if (this._autosave_started) return;
        this._autosave_started = true;

        const schedule = () => {
            if (this._debounce_id !== null) clearTimeout(this._debounce_id);
            this._debounce_id = setTimeout(() => {
                this._debounce_id = null;
                this.save_now();
            }, DEBOUNCE_MS);
        };

        // Touch sentinel signals so the effect re-runs on any meaningful change.
        // The set is intentionally broad; reading is cheap and missing one would silently lose writes.
        $effect.root(() => {
            $effect(() => {
                for (const k of ['Fans', 'Moni', 'Stamina', 'Haste', 'Sing', 'Dance', 'Charm', 'Presence'] as const) {
                    void stat_list[k].base; void stat_list[k].multi;
                    void stat_list[k].equip_base; void stat_list[k].equip_multi;
                }
                void CPs.current_completed_checkpoint;
                void CPs.current_time_spent;
                void EquipM.inventory.size;
                void EquipM.equipped;
                void EquipM.pending_dp;
                void EquipM.ever_obtained.size;
                void Rebirth.rebirth_count;
                void Rebirth.rebirth_points;
                void Rebirth.max_completed_checkpoints;
                void TD_List_Tracker.locations.length;
                void TD_List_Tracker.actions.size;

                schedule();
            });
        });

        if (typeof window !== 'undefined') {
            window.addEventListener('beforeunload', this.save_now);
        }
    }
}

export const Save = new SaveManager();
