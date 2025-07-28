import { TodoBase } from '$lib/data/todo_type';
import { S_TO_MS } from '$lib/utils/utils';
import { 
    check_disabled_host_school_concert,
    check_disabled_open_idol_club, 
    extra_attend_class, 
    extra_club_promoter, 
    extra_grade_report, 
    extra_host_school_concert, 
    extra_yell_on_wooden_box, 
    then_grade_report, 
    then_open_idol_club 
} from '../actions_side_effects';
import { Cost } from '../cost_constants';

export const a_school: TodoBase[] = [
    new TodoBase({
        name: 'Open Idol Club',
        type: 'spend_currency',
        base_time: 30 * S_TO_MS,
        desc: "On your way to become the ultimate school idol. One step closer to becoming the star you\'ve always dreamed of.",
        tooltip: { prereq: `Fans ≥ ${Cost.idol_club.fans}, Moni ≥ ${Cost.idol_club.moni}`, },
        rewards:[
            { which_stat: "Fans", flat_gain_base: 25 },
        ],
        spendings: [{stat_name: "Moni", value: Cost.idol_club.moni},],
        one_off: true,
        then_fn: then_open_idol_club,
        check_disabled_fn: check_disabled_open_idol_club,
    }),
    new TodoBase({
        name: 'Collect Grade Report',
        type: 'action',
        base_time: 10 * S_TO_MS,
        desc: "Somehow you didn\'t bother to take your Grade Report from last year back home... How clumsy of you. Better collect it now.",
        tooltip: { eureka: "Randomly increase a stat by a small amount", },
        rewards: [],
        one_off: true,
        then_fn: then_grade_report,
        extra_reward_fn: extra_grade_report,
    }),
    new TodoBase({
        name: 'Attend Class',
        type: 'action',
        base_time: 60 * S_TO_MS,
        desc: "You still gotta study alright; elite idol and elite student? That's the spirit.",
        tooltip: { eureka: "Good chance to double stat gains" },
        rewards:[
            { which_stat: "Sing", flat_gain_base: 1.2 },
            { which_stat: "Dance", flat_gain_base: 1.2 },
            { which_stat: "Charm", flat_gain_base: 1.2 },
            { which_stat: "Presence", flat_gain_base: 1.2 },
        ],
        extra_reward_fn: extra_attend_class,
    }),
    new TodoBase({
        name: 'Yell on Wooden Box',
        type: 'action',
        base_time: 20 * S_TO_MS,
        desc: "You know when those anime girls standing near the school gate after school to try and advertise their idol activities? Yeah, that's you now.",
        tooltip: { eureka: "Tiny chance to gain 3 Fans" },
        rewards:[
            { which_stat: "Fans", flat_gain_base: 2 },
        ],
        extra_reward_fn: extra_yell_on_wooden_box,
    }),
    new TodoBase({
        name: 'Hallway Flash Mob',
        type: 'action',
        base_time: 20 * S_TO_MS,
        desc: "Your school doesn't seem to understand your value to provide you with a suitable stage. But as an serious Idol, anywhere is your stage to shine in!",
        tooltip: { eureka: "Tiny chance to gain 3 Fans" },
        rewards:[
            { which_stat: "Dance", flat_gain_base: 0.5 },
            { which_stat: "Presence", flat_gain_base: 1.5 },
        ],
        extra_reward_fn: extra_yell_on_wooden_box,
    }),
    new TodoBase({
        name: 'Climbing the Stairs',
        type: 'action',
        base_time: 20 * S_TO_MS,
        desc: "No, no, not metaphorically; physically - you are physically running up and down the stairs like a silly goose. But hey, this does make you fitter, probably.",
        tooltip: { eureka: "Tiny chance to gain 3 Fans" },
        rewards:[
            { which_stat: "Stamina", flat_gain_base: 2.0 },
        ],
    }),
]

export const a_idol_club: TodoBase[] = [
    new TodoBase({
        name: 'Host School Concert',
        type: 'spend_currency',
        base_time: 45 * S_TO_MS,
        desc: "Finally, a real stage. The lighting, the music, the fans...! Is this what it feels like to be in the spotlight? The tickets are free though.",
        tooltip: {
            prereq: `Moni ≥ ${Cost.idol_club_concert}`,
            dependsOn: "Sing, Dance ➤ Fans",
            eureka: "Tiny chance for Big Success."
        },
        rewards:[
            { which_stat: "Fans",
                flat_gain_base: 10, 
                depends: [
                    { which_stat: "Sing", effectiveness: 0.5 },
                    { which_stat: "Dance", effectiveness: 0.5 },
                ],
                efficiency: "mid",
            },
            { which_stat: "Charm", flat_gain_base: 4 },
            { which_stat: "Presence", flat_gain_base: 4 },
        ],
        spendings: [{stat_name: "Moni", value: Cost.idol_club_concert}],
        extra_reward_fn: extra_host_school_concert,
        check_disabled_fn: check_disabled_host_school_concert,
    }),
    new TodoBase({
        name: 'Sell Merch',
        type: 'gain_currency',
        base_time: 25 * S_TO_MS,
        desc: "Overpriced? Scam? What do you mean? It\'s them who chose to spend the Moni...",
        tooltip: { dependsOn: "Fans ➤ Moni" },
        rewards: [{ 
            which_stat: "Moni",
            flat_gain_base: 9,
            depends: [
                { which_stat: "Fans", effectiveness: 1.0 },
            ],
            efficiency: "slow",
        },],
    }),
    new TodoBase({
        name: 'Club Promoter',
        type: 'action',
        base_time: 32 * S_TO_MS,
        desc: "Idol isn\'t all about performing on stage, getting your name out there is also important. But people will only notice you if you are actually good...",
        tooltip: { eureka: "Tiny chance to gain some Fans" },
        rewards:[{ which_stat: "Presence", flat_gain_base: 4 },],
        extra_reward_fn: extra_club_promoter,
    }),
]