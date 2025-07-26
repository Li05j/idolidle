import { Game_Progress } from "$lib/stores/game_progress.svelte"
import { stat_list } from "$lib/stores/stats.svelte";

export function then_wake_up(): void {
    Game_Progress.progress_handler.wake_up()
}

export function then_living_room(): void {
    Game_Progress.progress_handler.living_room()
}

export function then_park(): void {
    Game_Progress.progress_handler.park()
}

export function then_school(): void {
    Game_Progress.progress_handler.school()
}

export function then_mall(): void {
    Game_Progress.progress_handler.mall()
}

export function then_gym(): void {
    Game_Progress.progress_handler.gym()
}

export function then_maid_cafe(): void {
    Game_Progress.progress_handler.maid_cafe()
}

export function check_disabled_park(): boolean {
    if (stat_list.Sing.final + stat_list.Dance.final >= 3.0) {
        return false;
    }
    return true;
}