export type TodoType = "none" | "location" | "action"

export type Todo = {
    id: number,
    type: TodoType,
    name: string,
    base_duration: number,
    reward: () => void,
}