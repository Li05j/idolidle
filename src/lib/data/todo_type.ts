import type { Rewards, StatEffectPair, TodoType } from "$lib/types";

abstract class TodoBase {
    constructor(
        public name: string,
        public type: TodoType,
        public base_cost: number,
        public desc: string,
    ) {}

    abstract execute(): void;
}

class ActionTodo extends TodoBase {
    constructor(
        name: string,
        base_cost: number,
        public depends: StatEffectPair[],
        public rewards: Rewards[],
        desc: string,
    ) {
        super(name, "action", base_cost, desc);
    }

    execute() {
        console.log(`Executing Action: ${this.name}`);
        // apply depends, calculate rewards, etc
    }
}

// SpendCurrencyTodo
class SpendCurrencyTodo extends TodoBase {
    constructor(
        name: string,
        base_cost: number,
        public spendings_moni: number,
        desc: string,
    ) {
        super(name, "spend_currency", base_cost, desc);
    }

    execute() {
        console.log(`Spending ${this.spendings_moni} moni`);
        // deduct currency etc
    }
}

// Example usage:
const todos: Map<string, TodoBase[]> = new Map();

todos.set("daily", [
  new ActionTodo(
    "Singing Practice",
    5000,
    [
      { which_stat: "Stamina", effectiveness: 0.25 },
      { which_stat: "Charm", effectiveness: 0.75 }
    ],
    [{ which_stat: "Sing", flat_gain_base: 0.5 }],
    "Your voice cracks. Your cat weeps. But somewhere in the noise, a star might be warming up."
  ),
  new SpendCurrencyTodo(
    "Pay Rent",
    0,
    1000,
    "You pay your rent. Landlord is pleased."
  )
]);

// Later:
for (const todo of todos.get("daily")!) {
  todo.execute();
}
