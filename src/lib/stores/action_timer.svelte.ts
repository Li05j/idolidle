// actionTimer.svelte.ts
import { checkpoint } from "$lib/stores/store.svelte";
import { DECIMAL_PLACES } from "$lib/utils/utils";

export interface ActionTimer {
    progress: number;
    is_active: boolean;
    progress_text: string;
    start: (duration: number, onComplete: () => void) => void;
    stop: () => void;
}

export function createActionTimer(): ActionTimer {
    let progress = $state(0);
    let is_active = $state(false);
    let progress_text = $state("Ready to start");
    let interval: NodeJS.Timeout | null = null;

    function start(duration: number, onComplete: () => void) {
        if (is_active) return;
        
        is_active = true;
        const startTime = Date.now();
        const totalTime = duration;
        let lastTime = Date.now();

        interval = setInterval(() => {
            const now = Date.now();
            const elapsed = now - startTime;
            const delta = now - lastTime;
            lastTime = now;

            // 1000 is ms->s
            checkpoint.current_time_spent += delta;
            
            // 100 is percent
            progress = Math.min((elapsed / totalTime) * 100, 100);
            progress_text = `${Math.round(progress).toFixed(DECIMAL_PLACES)}% complete`;
        
            if (progress >= 100) {
                stop();
                onComplete();
            }
        }, 100);
    }

    function stop() {
        if (interval !== null) {
            clearInterval(interval);
            interval = null;
        }
        progress = 0;
        progress_text = "Ready to start";
        is_active = false;
    }

    return {
        get progress() { return progress; },
        get is_active() { return is_active; },
        get progress_text() { return progress_text; },
        start,
        stop
    };
}