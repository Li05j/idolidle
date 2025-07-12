import { checkpoint } from "$lib/stores/store.svelte";
import { msToSecF, DECIMAL_PLACES } from "$lib/utils/utils"

export interface ActionTimer {
    progress_percent: number;
    is_active: boolean;
    progress_text: string;
    start: (durationMs: number, onComplete: () => void) => void;
    pause: () => void;
    stop: () => void;
    destroy: () => void;
}

export function createActionTimer(): ActionTimer {
    let progress_percent = $state(0);
    let is_active = $state(false);
    let is_paused = $state(false);
    let progress_text = $state("Ready to start");

    let interval: NodeJS.Timeout | null = null;
    let lastTime = 0;
    let startTime = 0;
    let elapsed = 0;
    let durationMs = 0;
    let onCompleteCallback: (() => void) | null = null;

    let estimated_checkpoint_end_time = 0;

    function updateProgress() {
        if (is_paused) {
            return
        }

        const now = performance.now();
        elapsed = now - startTime;
        
        if (elapsed >= durationMs) {
            stop();
            onCompleteCallback?.();
            return;
        }

        checkpoint.current_time_spent += now - lastTime;
        
        progress_percent = (elapsed / durationMs) * 100;
        progress_text = `${Math.round(progress_percent).toFixed(DECIMAL_PLACES)}% complete`;

        lastTime = now;
    }

    function start(duration: number, onComplete: () => void) {
        if (is_active) return;
        
        is_active = true;
        durationMs = duration;
        lastTime = performance.now();
        startTime = performance.now();
        onCompleteCallback = onComplete;

        estimated_checkpoint_end_time = checkpoint.current_time_spent + durationMs - elapsed
        
        updateProgress();
        interval = setInterval(updateProgress, 100);
    }

    function pause() {
        is_active = false;
        is_paused = true;
        estimated_checkpoint_end_time = 0;
    }

    function stop() {
        if (interval !== null) {
            clearInterval(interval);
            interval = null;
        }
        progress_percent = 0;
        elapsed = 0;
        progress_text = "Ready to start";
        is_active = false;
        onCompleteCallback = null;

        checkpoint.current_time_spent = estimated_checkpoint_end_time
    }

    function destroy() {
        if (interval !== null) {
            clearInterval(interval);
            interval = null;
        }
    }

    return {
        get progress_percent() { return progress_percent; },
        get is_active() { return is_active; },
        get progress_text() { return progress_text; },
        start,
        pause,
        stop,
        destroy
    };
}