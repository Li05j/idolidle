import type { Todo } from '$lib/types'
import { Game_Progress } from '$lib/stores/game_progress.svelte';
import { ProgressFlag } from '$lib/types'
import { fans, moni, sing, dance, sta, charm, eloq } from "$lib/stores/stats.svelte"

class TodoListTracker {
    public constructor() {
        this.locations.push({ id: 0, type: 'location', name: 'Dorm Room', base_duration: 2000, reward: () => sta.base++, flag_check: () => {
            Game_Progress.enable(0, ProgressFlag.f0);
        }},)
    }

    public locations: Todo[] = $state([]);
    public actions: Map<string, Todo[]> = $state(new Map);
}

function createTodoListTracker() {
    return new TodoListTracker()
}

export const TD_List_Tracker = createTodoListTracker()