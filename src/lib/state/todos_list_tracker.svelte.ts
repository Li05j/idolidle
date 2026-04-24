import { locationMap } from '$lib/data/locations';

export type TDEntry = { name: string; elapsed: number };

class TodoListTracker {
    public locations: TDEntry[] = $state([]);
    public actions: Map<string, TDEntry[]> = $state(new Map());

    set_elapsed(loc: string, action: string | undefined, elapsed: number): void {
        if (action === undefined) {
            const e = this.locations.find(x => x.name === loc);
            if (e) e.elapsed = elapsed;
            return;
        }
        const list = this.actions.get(loc);
        if (!list) return;
        const e = list.find(x => x.name === action);
        if (e) e.elapsed = elapsed;
    }

    get_elapsed(loc: string, action: string | undefined): number {
        if (action === undefined) {
            return this.locations.find(x => x.name === loc)?.elapsed ?? 0;
        }
        return this.actions.get(loc)?.find(x => x.name === action)?.elapsed ?? 0;
    }

    public reset() {
        this.locations = [];
        this.actions = new Map();
    }

    serialize() {
        return {
            locations: this.locations.map(e => ({ ...e })),
            actions: Array.from(this.actions.entries()).map(([k, v]) => [k, v.map(e => ({ ...e }))] as [string, TDEntry[]]),
        };
    }

    deserialize(data: unknown): void {
        this.locations = [];
        this.actions = new Map();

        if (!data || typeof data !== 'object') return;
        const d = data as { locations?: unknown; actions?: unknown };

        const parse_entry = (raw: unknown): TDEntry | null => {
            if (!raw || typeof raw !== 'object') return null;
            const e = raw as { name?: unknown; elapsed?: unknown };
            if (typeof e.name !== 'string') return null;
            return { name: e.name, elapsed: typeof e.elapsed === 'number' ? e.elapsed : 0 };
        };

        if (Array.isArray(d.locations)) {
            for (const raw of d.locations) {
                const e = parse_entry(raw);
                if (!e) continue;
                if (!locationMap.has(e.name)) continue;
                this.locations.push(e);
            }
        }

        if (Array.isArray(d.actions)) {
            for (const raw of d.actions) {
                if (!Array.isArray(raw) || raw.length !== 2) continue;
                const [loc, list] = raw;
                if (typeof loc !== 'string') continue;
                const def = locationMap.get(loc);
                if (!def) continue;

                // locationMap reflects post-upgrade state (Progression.deserialize ran first), so def.actions is authoritative.
                const known = new Set<string>(def.actions.map(a => a.name));

                if (!Array.isArray(list)) continue;
                const entries: TDEntry[] = [];
                for (const r of list) {
                    const e = parse_entry(r);
                    if (!e) continue;
                    if (!known.has(e.name)) continue;
                    entries.push(e);
                }
                this.actions.set(loc, entries);
            }
        }
    }
}

export const TD_List_Tracker = new TodoListTracker();
