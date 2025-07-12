export type TodoType = "none" | "location" | "action"

export type Todo = {
    type: TodoType,
    name: string,
    base_duration: number,
    reward: () => void,
}