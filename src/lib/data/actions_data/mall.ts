import { TodoBase } from '$lib/data/todo_type';
import { S_TO_MS } from '$lib/utils/utils';
import { 
    check_disabled_mini_lottery, 
    check_disabled_outfit, 
    check_disabled_upgrade_living_room, 
    extra_mini_lottery, 
    then_upgrade_living_room 
} from '../actions_side_effects';
import { Cost } from '../cost_constants';

export const a_mall: TodoBase[] = [
    new TodoBase({
        name: 'Upgrade Living Room',
        type: 'spend_currency',
        base_time: 60 * S_TO_MS,
        desc: "Tired of the shitty environment at home? Well, hopefully this little upgrade will make it better.",
        tooltip: {prereq: `Moni ≥ ${Cost.living_room_upgrade}`,},
        rewards:[],
        spendings: [{stat_name: 'Moni', value: Cost.living_room_upgrade}],
        one_off: true,
        then_fn: then_upgrade_living_room,
        check_disabled_fn: check_disabled_upgrade_living_room,
    }),
    new TodoBase({
        name: 'Mini Lottery',
        type: 'spend_currency',
        base_time: 10 * S_TO_MS,
        desc: "We do NOT encourage the behavior of gambling. You see, this is gacha, it\'s different.",
        tooltip: { 
            prereq: `Moni ≥ ${Cost.mini_lottery}`,
            eureka: "Who knows what you will get...?" 
        },
        rewards:[],
        spendings: [{stat_name: "Moni", value: Cost.mini_lottery}],
        one_off: true,
        extra_reward_fn: extra_mini_lottery,
        check_disabled_fn: check_disabled_mini_lottery,
    }),
    new TodoBase({
        name: 'Buy Cute Outfit',
        type: 'spend_currency',
        base_time: 3 * S_TO_MS,
        desc: "Buy Buy Buy Spend Spend Spend... New clothes are always welcome.",
        tooltip: { prereq: `Moni ≥ ${Cost.outfit}`, },
        rewards:[{ which_stat: "Charm", flat_gain_base: 3.5 },],
        spendings: [{stat_name: "Moni", value: Cost.outfit}],
        check_disabled_fn: check_disabled_outfit,
    }),
    new TodoBase({
        name: 'Buy Cool Outfit',
        type: 'spend_currency',
        base_time: 3 * S_TO_MS,
        desc: "Buy Buy Buy Spend Spend Spend... New clothes are always welcome.",
        tooltip: { prereq: `Moni ≥ ${Cost.outfit}`, },
        rewards:[{ which_stat: "Presence", flat_gain_base: 3.5 },],
        spendings: [{stat_name: "Moni", value: Cost.outfit}],
        check_disabled_fn: check_disabled_outfit,
    }),
]