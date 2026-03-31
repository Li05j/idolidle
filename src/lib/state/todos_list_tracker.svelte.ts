import type { TodoBase } from '$lib/data/todo_type';

class TodoListTracker {
    public locations: TodoBase[] = $state([]);
    public actions: Map<string, TodoBase[]> = $state(new Map());

    public reset() {
        this.locations = [];
        this.actions = new Map();
    }
}

export const TD_List_Tracker = new TodoListTracker();
