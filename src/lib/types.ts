export type TodoType = "none" | "location" | "action"

export type Todo = {
    id: number,
    type: TodoType,
    name: string,
    base_duration: number,
    reward: () => void,
    flag_check?: () => void,
}

// Only f0-f30, i.e. 31 entries
export enum ProgressFlag {
    f0 = 1 << 0, f1 = 1 << 1, f2 = 1 << 2, f3 = 1 << 3, f4 = 1 << 4, f5 = 1 << 5, f6 = 1 << 6, f7 = 1 << 7,
    f8 = 1 << 8, f9 = 1 << 9, f10 = 1 << 10, f11 = 1 << 11, f12 = 1 << 12, f13 = 1 << 13, f14 = 1 << 14, f15 = 1 << 15, 
    f16 = 1 << 16, f17 = 1 << 17, f18 = 1 << 18, f19 = 1 << 19, f20 = 1 << 20, f21 = 1 << 21, f22 = 1 << 22, f23 = 1 << 23,
    f24 = 1 << 24, f25 = 1 << 25, f26 = 1 << 26, f27 = 1 << 27, f28 = 1 << 28, f29 = 1 << 29, f30 = 1 << 30,
}