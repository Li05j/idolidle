import { CURRENT_PRESET, SAVE_KEY, type PresetName } from '$lib/config';
import { stat_list_serialize, stat_list_deserialize, stats_mutation_tick } from '$lib/state/stats.svelte';
import { CPs } from '$lib/state/checkpoints.svelte';
import { EquipM } from '$lib/state/equipment.svelte';
import { Mastery } from '$lib/state/mastery.svelte';
import { Rebirth } from '$lib/state/rebirth.svelte';
import { Dreams } from '$lib/state/dreams.svelte';
import { RunTotals } from '$lib/state/run_totals.svelte';
import { TD_List_Tracker } from '$lib/state/todos_list_tracker.svelte';
import { RivalStatsM } from '$lib/runtime/live_rival_stats.svelte';
import { TodoCardM } from '$lib/runtime/todo_card_manager.svelte';
import { Progression } from '$lib/runtime/progression_engine.svelte';

const SAVE_VERSION = 2 as const;
const SAVE_INTERVAL_MS = 2000;
const TAB_LOCK_CHANNEL = 'idolidle-tab-lock';
const TAB_HANDSHAKE_MS = 150;
const EXPORT_PREFIX = 'IDOLIDLE1:';
const CHECKSUM_LEN = 8; // hex chars of sha-256 prefix; collision-resistant enough for paste detection

async function _sha256_short(text: string): Promise<string> {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf), b => b.toString(16).padStart(2, '0')).join('').slice(0, CHECKSUM_LEN);
}

type TabMessage = { type: 'HELLO' | 'CLAIM'; id: number };

type SaveBlob = {
    version: typeof SAVE_VERSION;
    preset: PresetName;
    stats:   ReturnType<typeof stat_list_serialize>;
    cps:     ReturnType<typeof CPs.serialize>;
    equip:   ReturnType<typeof EquipM.serialize>;
    mastery: ReturnType<typeof Mastery.serialize>;
    rebirth: ReturnType<typeof Rebirth.serialize>;
    dreams:  ReturnType<typeof Dreams.serialize>;
    run_totals: ReturnType<typeof RunTotals.serialize>;
    td:      ReturnType<typeof TD_List_Tracker.serialize>;
    rivals:  ReturnType<typeof RivalStatsM.serialize>;
    upgrades: ReturnType<typeof Progression.serialize>;
};

class SaveManager {
    private _battle_in_progress = false;
    private _interval_id: ReturnType<typeof setInterval> | null = null;
    private _autosave_started = false;
    private _loaded = false;
    private _dirty = false;

    // Tab lock state. Active tabs respond to HELLOs with CLAIMs. Locked tabs go quiet.
    private _channel: BroadcastChannel | null = null;
    private _tab_id: number = Math.floor(Math.random() * 1e15);
    private _tab_active = false;
    private _is_locked = $state(false);

    get is_locked() { return this._is_locked; }

    set_battle_in_progress(b: boolean) {
        this._battle_in_progress = b;
    }

    /** Caller asserts hydration is finished (load() ran, or fresh init completed). */
    mark_loaded() {
        this._loaded = true;
    }

    /** Prevent any further writes (used before wipe-and-reload). */
    disable() {
        this._loaded = false;
    }

    private _build_blob(): SaveBlob {
        const snap = TodoCardM.active_snapshot;
        if (snap) {
            TD_List_Tracker.set_elapsed(snap.key.loc, snap.key.action, snap.elapsed);
        }

        return {
            version: SAVE_VERSION,
            preset: CURRENT_PRESET,
            stats:   stat_list_serialize(),
            cps:     CPs.serialize(),
            equip:   EquipM.serialize(),
            mastery: Mastery.serialize(),
            rebirth: Rebirth.serialize(),
            dreams:  Dreams.serialize(),
            run_totals: RunTotals.serialize(),
            td:      TD_List_Tracker.serialize(),
            rivals:  RivalStatsM.serialize(),
            upgrades: Progression.serialize(),
        };
    }

    /** Stamp the active card's live elapsed into the tracker, then write the whole blob. */
    save_now = () => {
        if (typeof localStorage === 'undefined') return;
        if (!this._loaded) return;
        if (this._battle_in_progress) return;

        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(this._build_blob()));
        } catch (e) {
            console.error('save failed', e);
        }
    };

    /**
     * Encode the current save as a portable text blob:
     *   `IDOLIDLE1:<sha256-short>:<base64(JSON)>`
     * Base64 is friction; the checksum catches truncated/corrupted pastes before
     * we ever try to parse the inner JSON.
     */
    async export_blob(): Promise<string> {
        const json = JSON.stringify(this._build_blob());
        const sum = await _sha256_short(json);
        // btoa needs latin-1; route through UTF-8 bytes so non-ASCII names survive.
        const b64 = btoa(String.fromCharCode(...new TextEncoder().encode(json)));
        return `${EXPORT_PREFIX}${sum}:${b64}`;
    }

    /**
     * Validate and apply an exported blob. On success, writes to localStorage and
     * reloads (same flow as restart_game) so every domain rehydrates cleanly.
     * Returns null on success, an error message string on failure.
     */
    async import_blob(text: string): Promise<string | null> {
        const trimmed = text.trim();
        if (!trimmed.startsWith(EXPORT_PREFIX)) return 'Not a valid save blob.';

        const rest = trimmed.slice(EXPORT_PREFIX.length);
        const sep = rest.indexOf(':');
        if (sep !== CHECKSUM_LEN) return 'Blob is malformed (bad checksum field).';
        const expected_sum = rest.slice(0, CHECKSUM_LEN);
        const b64 = rest.slice(CHECKSUM_LEN + 1);

        let json: string;
        try {
            const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
            json = new TextDecoder().decode(bytes);
        } catch {
            return 'Blob is corrupted (base64 decode failed).';
        }

        const actual_sum = await _sha256_short(json);
        if (actual_sum !== expected_sum) {
            return 'Checksum mismatch — the blob is incomplete or was modified.';
        }

        let parsed: unknown;
        try {
            parsed = JSON.parse(json);
        } catch {
            return 'Blob is corrupted (JSON parse failed).';
        }

        if (!parsed || typeof parsed !== 'object') return 'Blob is not an object.';
        const p = parsed as Partial<SaveBlob>;
        if (p.version !== SAVE_VERSION) return `Save version mismatch (got ${p.version}, need ${SAVE_VERSION}).`;
        if (p.preset !== CURRENT_PRESET) return `Preset mismatch (blob: ${p.preset}, current: ${CURRENT_PRESET}).`;

        this.disable();
        try {
            localStorage.setItem(SAVE_KEY, json);
        } catch (e) {
            console.error('import write failed', e);
            return 'Failed to persist imported save.';
        }
        window.location.reload();
        return null;
    }

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
        RunTotals.deserialize(p.run_totals);
        Progression.deserialize(p.upgrades);
        TD_List_Tracker.deserialize(p.td);
        RivalStatsM.deserialize(p.rivals);

        return true;
    }

    /**
     * Acquire the single-tab lock. Resolves true if this tab gets the lock,
     * false if another tab is already active (or wins the simultaneous-boot
     * tiebreaker). Falls back to true if BroadcastChannel is unavailable.
     */
    async acquire_tab_lock(): Promise<boolean> {
        if (typeof BroadcastChannel === 'undefined') return true;

        this._channel = new BroadcastChannel(TAB_LOCK_CHANNEL);
        this._channel.onmessage = (e) => this._on_tab_message(e.data as TabMessage);

        this._channel.postMessage({ type: 'HELLO', id: this._tab_id } satisfies TabMessage);

        await new Promise(r => setTimeout(r, TAB_HANDSHAKE_MS));

        if (this._is_locked) return false;
        this._tab_active = true;
        return true;
    }

    private _on_tab_message(msg: TabMessage) {
        if (this._is_locked) return;

        if (msg.type === 'CLAIM') {
            // An already-active tab is rejecting us.
            if (msg.id !== this._tab_id) this._lock_tab();
            return;
        }

        if (msg.type === 'HELLO') {
            if (msg.id === this._tab_id) return;
            if (this._tab_active) {
                // We're the established active tab; reject the newcomer.
                this._channel?.postMessage({ type: 'CLAIM', id: this._tab_id } satisfies TabMessage);
            } else if (msg.id < this._tab_id) {
                // Both booting; lower id wins.
                this._lock_tab();
            }
            // If incoming id is higher, do nothing — we'll send CLAIM after our window closes.
        }
    }

    private _lock_tab() {
        this._is_locked = true;
        this._tab_active = false;
        this._loaded = false; // belt-and-suspenders: prevent any save attempt
    }

    /** Close the BroadcastChannel. Used by HMR cleanup. */
    dispose_tab_channel() {
        this._channel?.close();
        this._channel = null;
    }

    /** Set up interval-based autosave + beforeunload flush. Idempotent. */
    start_autosave() {
        if (this._autosave_started) return;
        this._autosave_started = true;

        // Subscribe to one mutation tick per persisted domain. Each domain bumps its own
        // tick from inside its mutators, so adding a new persisted field only requires
        // wiring `mark_dirty()` (or an internal `_tick++`) in the same module.
        $effect.root(() => {
            $effect(() => {
                void stats_mutation_tick();
                void CPs.mutation_tick;
                void EquipM.mutation_tick;
                void Mastery.mutation_tick;
                void Rebirth.mutation_tick;
                void Dreams.mutation_tick;
                void RunTotals.mutation_tick;
                void TD_List_Tracker.mutation_tick;
                void RivalStatsM.mutation_tick;
                void Progression.mutation_tick;

                this._dirty = true;
            });
        });

        this._interval_id = setInterval(() => {
            if (!this._dirty) return;
            this.save_now();
            this._dirty = false;
        }, SAVE_INTERVAL_MS);

        if (typeof window !== 'undefined') {
            window.addEventListener('beforeunload', this.save_now);
        }
    }
}

export const Save = new SaveManager();

// Vite HMR: when this module is hot-replaced, close the old tab-lock channel so
// the new instance's HELLO doesn't get echoed back as a CLAIM by the stale one.
if (import.meta.hot) {
    import.meta.hot.dispose(() => {
        Save.dispose_tab_channel();
    });
}
