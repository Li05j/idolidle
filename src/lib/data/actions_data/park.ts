import { TodoBase } from '$lib/data/todo_type';
import { S_TO_MS } from '$lib/utils/utils';
import { extra_play_with_kids } from '../actions_side_effects';

export const a_park: TodoBase[] = [
    new TodoBase({
        name: 'Picking Bottles',
        type: 'gain_currency',
        base_time: 8 * S_TO_MS,
        desc: "Being an Idol means starting somewhere, you know? Defo not working for the Moni - Just making sure the Park is clean and tidy.",
        tooltip: {dependsOn: "Haste ➤ Moni"},
        rewards:[
            {which_stat: "Moni", flat_gain_base: 3, depends: [{ which_stat: "Haste", effectiveness: 1.0 }], efficiency: "v_slow"},
        ],
    }),
    new TodoBase({
        name: 'Busker',
        type: 'gain_currency',
        base_time: 30 * S_TO_MS,
        desc: "It's quite embarrassing doing this in public... But at least it's somewhat better than collecting bottles?",
        tooltip: { dependsOn: "Fans ➤ Moni" },
        rewards:[
            { which_stat: "Fans",flat_gain_base: 3, },
            {
                which_stat: "Moni",
                flat_gain_base: 7,
                depends: [
                    { which_stat: "Fans", effectiveness: 1.0 },
                ],
                efficiency: "slow",
            },
        ],
    }),
    new TodoBase({
        name: 'Play Tag with Kids',
        type: 'action',
        base_time: 12 * S_TO_MS,
        desc: "\"Tag - You're it!\" You giggle, trying to charm them with your elegant wink. It usually doesn\'t work, though.",
        tooltip: { eureka: "Slight chance to gain 1 Fans" },
        rewards:[
            { which_stat: "Haste", flat_gain_base: 0.6 },
            { which_stat: "Charm", flat_gain_base: 0.6 },
        ],
        extra_reward_fn: extra_play_with_kids,
    }),
]