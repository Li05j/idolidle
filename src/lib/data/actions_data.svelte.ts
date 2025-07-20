import { fans, moni, sta, sing, dance, charm, pres } from "$lib/stores/stats.svelte";
import { logs } from '$lib/stores/history.svelte'
import { ActionTodo, GainCurrencyTodo, SpendCurrencyTodo, type TodoBase } from './todo_type.svelte';
import { Game_Progress } from "$lib/stores/game_progress.svelte";

const S_TO_MS = 1000

export const actions_data: Map<string, TodoBase[]> = new Map([
    ["Living Room", 
        [
            new ActionTodo(
                'Singing Practice',
                5 * S_TO_MS,
                [
                    { which_stat: "Stamina", effectiveness: 0.25 },
                    { which_stat: "Charm", effectiveness: 0.75 },
                ],
                [
                    { which_stat: "Sing", flat_gain_base: 0.5},
                ],
                "Your voice cracks. Your cat weeps. But somewhere in the noise, a star might be warming up.",
            ),
            new ActionTodo(
                'Dancing Practice',
                5 * S_TO_MS,
                [
                    { which_stat: "Stamina", effectiveness: 0.25 },
                    { which_stat: "Presence", effectiveness: 0.75 },
                ],
                [
                    { which_stat: "Dance", flat_gain_base: 0.5},
                ],
                "Limbs flail, rhythm fails, and then you trip yourself. Maybe the floor just hates you.",
            ),
        ]
    ],
    ["Park", 
        [
            new GainCurrencyTodo(
                'Picking Bottles',
                5 * S_TO_MS,
                [],
                [
                    {which_stat: "Moni", flat_gain_base: 5, depends: [{ which_stat: "Stamina", effectiveness: 1.0 }], efficiency: "slow"},
                ],
                "Being an Idol means starting somewhere, you know? Defo not working for the Moni - Just making sure the Park is clean and tidy.",
            ),
            new GainCurrencyTodo(
                'Busker',
                30 * S_TO_MS,
                [],
                [
                    { which_stat: "Fans", flat_gain_base: 3},
                    { which_stat: 
                        "Moni",
                        flat_gain_base: 3, 
                        depends: [
                            { which_stat: "Fans", effectiveness: 0.7 },
                            { which_stat: "Sing", effectiveness: 0.15 },
                            { which_stat: "Dance", effectiveness: 0.15 },
                        ],
                        efficiency: "mid",
                    },
                ],
                "This is quite embarrassing... But at least it's somewhat better than collecting bottles?",
            ),
            new ActionTodo(
                'Play Tag with Kids',
                12 * S_TO_MS,
                [
                    { which_stat: "Stamina", effectiveness: 0.8 },
                    { which_stat: "Charm", effectiveness: 0.2 },
                ],
                [
                    { which_stat: "Stamina", flat_gain_base: 0.6},
                    { which_stat: "Charm", flat_gain_base: 0.6},
                ],
                "\'Tag - You're it!\' You giggle, trying to charm them with your elegant wink. It usually doesn\'t work, though.",
                {
                    extra_reward_fn: () => {
                        let r = Math.random();
                        if (r < 0.1) {
                            fans.base += 1
                            logs.addEurekaLogs( '+1 Fans', 'You converted a kid into a fan!')
                        }
                    },
                },
            ),
        ]
    ],
    ["School", 
        [
            new ActionTodo(
                'Go to Class',
                60 * S_TO_MS,
                [
                    { which_stat: "Charm", effectiveness: 0.25 },
                    { which_stat: "Presence", effectiveness: 0.25 },
                ],
                [
                    { which_stat: "Sing", flat_gain_base: 1.2 },
                    { which_stat: "Dance", flat_gain_base: 1.2 },
                    { which_stat: "Charm", flat_gain_base: 1.2 },
                    { which_stat: "Presence", flat_gain_base: 1.2 },
                ],
                "You still gotta study alright; elite idol and elite student? That's the spirit.",
                {
                    extra_reward_fn: () => {
                        let a = Math.random();
                        let b = Math.random();
                        let c = Math.random();
                        let d = Math.random();
                        if (a < 0.5) {
                            sing.base += 1.2
                            logs.addEurekaLogs( '+1.2 Sing')
                        }
                        if (b < 0.5) {
                            dance.base += 1.2
                            logs.addEurekaLogs( '+1.2 Dance')
                        }
                        if (c < 0.5) {
                            charm.base += 1.2
                            logs.addEurekaLogs( '+1.2 Charm')
                        }
                        if (d < 0.5) {
                            pres.base += 1.2
                            logs.addEurekaLogs( '+1.2 Presence')
                        }
                    },
                },
            ),
            new ActionTodo(
                'Yell on Wooden Box',
                15 * S_TO_MS,
                [
                    { which_stat: "Presence", effectiveness: 1.0 },
                ],
                [
                    {which_stat: "Fans", flat_gain_base: 2 },
                ],
                "You know when those anime girls standing near the school gate after school to try and advertise their idol activities? Yeah, that's you now.",
            ),
            new ActionTodo(
                'Hallway Dancing',
                35 * S_TO_MS,
                [
                    { which_stat: "Presence", effectiveness: 1.0 },
                ],
                [
                    { which_stat: "Dance", flat_gain_multi: 0.01 },
                    { which_stat: "Presence", flat_gain_multi: 0.01 },
                ],
                "Your school is too poor to have their own dance studio, but as an serious Idol, anywhere is your dance studio!",
                {
                    extra_reward_fn: () => {
                        let r = Math.random();
                        if (r < 0.1) {
                            fans.base += 1
                            logs.addEurekaLogs( '+1 Fans', 'You attracted a student to be a fan!')
                        }
                    },
                },
            ),
            new ActionTodo(
                'Climbing the Stairs',
                40 * S_TO_MS,
                [
                    { which_stat: "Stamina", effectiveness: 1.0 },
                ],
                [
                    { which_stat: "Stamina", flat_gain_base: 4.0 },
                ],
                "No, no, not metaphorically; physically - you are physically running up and down the stairs like a silly goose. But hey, this does make you fitter, probably.",
                {
                    extra_reward_fn: () => {
                        let r = Math.random();
                        if (r < 0.1) {
                            fans.base += 1
                            logs.addEurekaLogs( '+1 Fans', 'You attracted a student to be a fan!')
                        }
                    },
                },
            ),
        ]
    ],
    ["Mall", 
        [
            new SpendCurrencyTodo(
                'Upgrade Living Room',
                1 * S_TO_MS,
                5000,
                [],
                "Tired of the shitty environment at home? Well, hopefully this little upgrade will make it better.",
                {
                    one_off_flag: true,
                    then_fn: () => {
                        Game_Progress.progress_handler.upgrade_living_room();
                        logs.addHintLogs('Your Living Room upgraded to Living Room+, give it a check!')
                    },
                    check_disabled_fn: (stat_list) => {
                        if (stat_list.moni.final >= 5000) {
                            return false;
                        }
                        return true;
                    },
                },
            ),
            new SpendCurrencyTodo(
                'Buy Cute Outfit',
                1 * S_TO_MS,
                99,
                [
                    { which_stat: "Charm", flat_gain_base: 5.0 },
                ],
                "Buy Buy Buy Spend Spend Spend... New clothes are always welcome.",
                {
                    check_disabled_fn: (stat_list) => {
                        if (stat_list.moni.final >= 99) {
                            return false;
                        }
                        return true;
                    },
                },
            ),
            new SpendCurrencyTodo(
                'Buy Cool Outfit',
                1 * S_TO_MS,
                99,
                [
                    { which_stat: "Presence", flat_gain_base: 5.0 },
                ],
                "Buy Buy Buy Spend Spend Spend... New clothes are always welcome.",
                {
                    check_disabled_fn: (stat_list) => {
                        if (stat_list.moni.final >= 99) {
                            return false;
                        }
                        return true;
                    },
                },
            ),
        ]
    ],
    ["Living Room+", 
        [
            new ActionTodo(
                'Singing Practice+',
                50 * S_TO_MS,
                [
                    { which_stat: "Stamina", effectiveness: 0.25 },
                    { which_stat: "Charm", effectiveness: 0.75 },
                ],
                [
                    {which_stat: "Sing", flat_gain_base: 6.0},
                ],
                "At least your cat won\'t faint anymore, that\'s what we call improvement.",
            ),
            new ActionTodo(
                'Dancing Practice+',
                50 * S_TO_MS,
                [
                    { which_stat: "Stamina", effectiveness: 0.25 },
                    { which_stat: "Presence", effectiveness: 0.75 },
                ],
                [
                    {which_stat: "Dance", flat_gain_base: 6.0},
                ],
                "No more kisses with the floor you just mopped. More calm, more peace. Going with the flow.",
            ),
        ]
    ],
]);