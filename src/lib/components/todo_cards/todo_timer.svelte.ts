import { CPs } from "$lib/state/checkpoints.svelte";
import { DECIMAL_PLACES } from "$lib/utils/utils"

type TimerState = 'idle' | 'running' | 'paused';

export interface TodoTimer {
    is_active: boolean;
    is_paused: boolean;
    elapsed: number;
    progress_percent: number;
    progress_text: string;
    loop_count: number;
    repeat: (loop_count: number, durationMs: number, onComplete: () => void, onAllComplete: () => void) => void;
    pause: () => void;
    stop: () => void;
    clear: () => void;
}

export function createTodoTimer(): TodoTimer {
    let state: TimerState = $state('idle');
    let progress_percent = $state(0);
    let progress_text = $state("");
    let elapsed = $state(0);

    let loop_count = 0;
    let raf_id = 0;
    let last_frame_time = 0;
    let duration = 0;
    let checkpoint_base = 0;
    let onCompleteCallback: (() => void) | null = null;
    let onAllCompleteCallback: (() => void) | null = null;

    function tick(now: number) {
        if (state !== 'running') return;

        const delta = now - last_frame_time;
        last_frame_time = now;

        elapsed += delta;
        CPs.current_time_spent += delta;

        while (elapsed >= duration) {
            onCompleteCallback?.();

            if (loop_count > 0) {
                // Carry overshoot into next loop
                elapsed -= duration;
                loop_count--;
                checkpoint_base += duration;
                CPs.current_time_spent = checkpoint_base + elapsed;
            } else {
                stop();
                return;
            }
        }

        progress_percent = (elapsed / duration) * 100;
        progress_text = `${progress_percent.toFixed(DECIMAL_PLACES)}% complete`;

        raf_id = requestAnimationFrame(tick);
    }

    function repeat(loops: number, durationMs: number, onComplete: () => void, onAllComplete: () => void = () => {}) {
        if (state === 'running') return;

        loop_count = loops - 1;
        duration = durationMs;
        onCompleteCallback = onComplete;
        onAllCompleteCallback = onAllComplete;
        checkpoint_base = CPs.current_time_spent;

        state = 'running';
        last_frame_time = performance.now();

        raf_id = requestAnimationFrame(tick);
    }

    function pause() {
        state = 'paused';
        if (raf_id) cancelAnimationFrame(raf_id);
        raf_id = 0;
    }

    function stop() {
        // Snap checkpoint to exact expected value — no accumulated drift
        CPs.current_time_spent = checkpoint_base + duration;
        onAllCompleteCallback?.();
        clear();
    }

    function clear() {
        if (raf_id) cancelAnimationFrame(raf_id);
        raf_id = 0;
        loop_count = 0;
        progress_percent = 0;
        elapsed = 0;
        checkpoint_base = 0;
        duration = 0;
        state = 'idle';
        onCompleteCallback = null;
        onAllCompleteCallback = null;
    }

    return {
        get is_active() { return state === 'running'; },
        get is_paused() { return state !== 'running'; },
        get elapsed() { return elapsed; },
        get progress_percent() { return progress_percent; },
        get progress_text() { return progress_text; },
        set loop_count(c: number) { loop_count = c; },
        repeat,
        pause,
        stop,
        clear
    };
}
