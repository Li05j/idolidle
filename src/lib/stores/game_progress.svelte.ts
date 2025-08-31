import { TD_List_Tracker } from "$lib/stores/todos_list_tracker.svelte";
import { P_Handler } from "$lib/stores/game_state/game_progress_update_handlers.svelte";

class GameProgress {
    public progress_handler = P_Handler;

    get todolist_tracker() {
        return TD_List_Tracker;
    }

    reset() {
        this.todolist_tracker.reset();
    }
}

function createGameProgress() {
    return new GameProgress()
}

export const Game_Progress = createGameProgress()