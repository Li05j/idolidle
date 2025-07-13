import { CPs } from "$lib/stores/checkpoints.svelte";
import { DECIMAL_PLACES } from "$lib/utils/utils"

export interface TodoTimer {
    is_active: boolean;
    is_paused: boolean;
    elapsed: number;
    progress_percent: number;
    progress_text: string;
    start: (durationMs: number, onComplete: () => void) => void;
    pause: () => void;
    stop: () => void;
    destroy: () => void;
}

export function createTodoTimer(): TodoTimer {
    let progress_percent = $state(0);
    let is_active = $state(false);
    let is_paused = $state(true);
    let progress_text = $state("");

    let interval: NodeJS.Timeout | null = null;
    let lastTime = 0;
    let startTime = 0;
    let elapsed = $state(0);
    let saved_elapsed = 0;
    let durationMs = 0;
    let onCompleteCallback: (() => void) | null = null;

    let estimated_checkpoint_end_time = 0;

    function updateProgress() {
        if (is_paused) {
            return
        }

        const now = performance.now();
        elapsed = saved_elapsed + now - startTime;
        
        if (elapsed >= durationMs) {
            onCompleteCallback?.();
            stop();
            return;
        }

        CPs.current_time_spent += now - lastTime;
        
        progress_percent = (elapsed / durationMs) * 100;
        progress_text = `${progress_percent.toFixed(DECIMAL_PLACES)}% complete`;

        lastTime = now;
    }

    function start(duration: number, onComplete: () => void) {
        if (is_active) return;
        
        is_active = true;
        is_paused = false;
        durationMs = duration;
        lastTime = performance.now();
        startTime = performance.now();
        onCompleteCallback = onComplete;

        estimated_checkpoint_end_time = CPs.current_time_spent + Math.max(durationMs - elapsed, 0)
        
        updateProgress();
        interval = setInterval(updateProgress, 100);
    }

    function pause() {
        is_active = false;
        is_paused = true;
        saved_elapsed = elapsed;
        estimated_checkpoint_end_time = 0;
    }

    // Timer completed - Stopping gracefully.
    function stop() {
        CPs.current_time_spent = estimated_checkpoint_end_time;
        destroy()
    }

    // Timer may not complete - parent unmounted or process terminated
    function destroy() {
        if (interval !== null) {
            clearInterval(interval);
            interval = null;
        }

        progress_percent = 0;
        elapsed = 0;
        // saved_elapsed = 0;
        is_active = false;
        is_paused = true;
        estimated_checkpoint_end_time = 0;
        onCompleteCallback = null;
    }

    return {
        get is_active() { return is_active; },
        get is_paused() { return is_paused; },
        get elapsed() { return elapsed; },
        get progress_percent() { return progress_percent; },
        get progress_text() { return progress_text; },
        start,
        pause,
        stop,
        destroy
    };
}