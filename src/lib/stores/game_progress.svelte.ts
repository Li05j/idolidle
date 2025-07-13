import { ProgressFlag } from '$lib/types'
import type { ProgressKey } from "$lib/stores/flag_update_handler.svelte"
import { P_Handler } from "$lib/stores/flag_update_handler.svelte";

class ProgressParts {
    // Each part can only hold 31 flags.
    private _TOTAL_PARTS = 1;
    public parts: number[] = $state([]);

    constructor() {
        this.parts = new Array(this._TOTAL_PARTS).fill(0)
    }

    get TOTAL_PARTS() {
        return this._TOTAL_PARTS;
    }

    reset() {
        this.parts = new Array(this._TOTAL_PARTS).fill(0);
    }
}

class GameProgress {
    private p = new ProgressParts;
    private _progress_handler = P_Handler;

    private _update(part: number, which: ProgressFlag) {
        const key: ProgressKey = `${part}-${which}`;
        const f = this._progress_handler.handlers.get(key)
        if (f) f();
        return
    }

    get todolist_tracker() {
        return this._progress_handler.TD_List_Tracker
    }

    enable(part: number, which: ProgressFlag) {
        if (part >= this.p.TOTAL_PARTS) return;
        this.p.parts[part] |= which
        this._update(part, which)
    }

    // why do we need this?
    disable(part: number, which: ProgressFlag) {
        if (part >= this.p.TOTAL_PARTS) return;
        this.p.parts[part] &= ~which
    }

    has(part: number, which: ProgressFlag): boolean{
        if (part >= this.p.TOTAL_PARTS) return false;
        return (this.p.parts[part] & which) != 0;
    }

    reset() {
        this.p.reset();
        this.todolist_tracker.reset();
    }
}

function createGameProgress() {
    return new GameProgress()
}

export const Game_Progress = createGameProgress()