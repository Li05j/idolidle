import { locations_data } from "$lib/data/locations_data.svelte"
import type { TodoBase } from '$lib/data/todo_type.svelte';

class TodoListTracker {
    public constructor() {
        this.reset()
    }

    public locations: TodoBase[] = $state([]);
    public actions: Map<string, TodoBase[]> = $state(new Map);

    public reset() {
        let initial_loc = locations_data.find((ld) => ld.name == 'Wake Up')
        if (initial_loc) {
            this.locations = [initial_loc]
        }
        else{
            this.locations = []
        }
        this.actions.clear()
    }
}

function createTodoListTracker() {
    return new TodoListTracker()
}

export const TD_List_Tracker = createTodoListTracker()