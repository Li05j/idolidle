import { TodoBase } from '$lib/data/todo_type';
import { S_TO_MS } from '$lib/utils/utils';

export const a_living_room: TodoBase[] = [
    new TodoBase({
        name: 'Singing Practice',
        type: 'action',
        base_time: 5 * S_TO_MS,
        desc: "Your voice cracks. Your cat weeps. But somewhere in the noise, a star might be warming up.",
        tooltip: {},
        rewards:[
            { which_stat: "Sing", flat_gain_base: 0.5},
        ],
    }),
    new TodoBase({
        name: 'Dancing Practice',
        type: 'action',
        base_time: 5 * S_TO_MS,
        desc: "Limbs flail, rhythm fails, and then you trip yourself. Maybe the floor just hates you.",
        tooltip: {},
        rewards:[
            { which_stat: "Dance", flat_gain_base: 0.5},
        ],
    }),

]

export const a_living_room_upgrarde: TodoBase[] = [
    new TodoBase({
        name: 'Singing Practice+',
        type: 'action',
        base_time: 30 * S_TO_MS,
        desc: "At least your cat won\'t faint anymore, that\'s what we call improvement.",
        tooltip: {},
        rewards:[
            { which_stat: "Stamina", flat_gain_base: 0.5},
            { which_stat: "Sing", flat_gain_base: 5},
        ],
    }),
    new TodoBase({
        name: 'Dancing Practice+',
        type: 'action',
        base_time: 30 * S_TO_MS,
        desc: "No more kisses with the floor you just mopped. More calm, more peace. Going with the flow.",
        tooltip: {},
        rewards:[
            { which_stat: "Stamina", flat_gain_base: 0.5},
            { which_stat: "Dance", flat_gain_base: 5},
        ],
    }),
]