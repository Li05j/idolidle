class TodoListTracker {
    public locations: string[] = $state([]);
    public actions: Map<string, string[]> = $state(new Map());

    public reset() {
        this.locations = [];
        this.actions = new Map();
    }
}

export const TD_List_Tracker = new TodoListTracker();
