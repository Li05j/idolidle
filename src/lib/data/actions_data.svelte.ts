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
                {
                    dependsOn: "Stamina, Charm"
                },            
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
                {
                    dependsOn: "Stamina, Presence"
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
                    {which_stat: "Sing", flat_gain_base: 6.5},
                ],
                "At least your cat won\'t faint anymore, that\'s what we call improvement.",
                {
                    dependsOn: "Stamina, Charm",
                },
            ),
            new ActionTodo(
                'Dancing Practice+',
                50 * S_TO_MS,
                [
                    { which_stat: "Stamina", effectiveness: 0.25 },
                    { which_stat: "Presence", effectiveness: 0.75 },
                ],
                [
                    {which_stat: "Dance", flat_gain_base: 6.5},
                ],
                "No more kisses with the floor you just mopped. More calm, more peace. Going with the flow.",
                {
                    dependsOn: "Stamina, Presence",
                },
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
                {
                    dependsOn: "Stamina"
                },
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
                "It's quite embarrassing doing this in public... But at least it's somewhat better than collecting bottles?",
                {
                    dependsOn: "Stamina, Presence"
                },
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
                "\"Tag - You're it!\" You giggle, trying to charm them with your elegant wink. It usually doesn\'t work, though.",
                {
                    dependsOn: "Stamina, Charm",
                    eureka: "Small chance to gain 1 Fans"
                },
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
            new SpendCurrencyTodo(
                'Open Idol Club',
                1 * S_TO_MS,
                8,
                [
                    { which_stat: "Fans", flat_gain_base: 20 },
                ],
                "On your way to become the ultimate school idol. One step closer to becoming the star you\'ve always dreamed of.",
                {
                    prereq: "Fans ≥ 100, Moni ≥ 8888",
                },
                {
                    one_off_flag: true,
                    then_fn: () => {
                        Game_Progress.progress_handler.school_idol_club();
                        logs.addHintLogs('You have unlocked some club activities under School, go check them out!')
                    },
                    check_disabled_fn: (stat_list) => {
                        if (stat_list.fans.final >= 10 && stat_list.moni.final >= 8) {
                            return false;
                        }
                        return true;
                    },
                },
            ),
            new ActionTodo(
                'Go to Class',
                80 * S_TO_MS,
                [
                    { which_stat: "Charm", effectiveness: 0.25 },
                    { which_stat: "Presence", effectiveness: 0.25 },
                ],
                [
                    { which_stat: "Sing", flat_gain_base: 1.5 },
                    { which_stat: "Dance", flat_gain_base: 1.5 },
                    { which_stat: "Charm", flat_gain_base: 1.5 },
                    { which_stat: "Presence", flat_gain_base: 1.5 },
                ],
                "You still gotta study alright; elite idol and elite student? That's the spirit.",
                {
                    dependsOn: "Charm, Presence",
                    eureka: "Moderate chance to double stat gains"
                },
                {
                    extra_reward_fn: () => {
                        let a = Math.random();
                        let b = Math.random();
                        let c = Math.random();
                        let d = Math.random();
                        let gain = 1.5;
                        if (a < 0.5) {
                            sing.base += gain
                            logs.addEurekaLogs(`+${gain * sing.multi} Sing`)
                        }
                        if (b < 0.5) {
                            dance.base += gain
                            logs.addEurekaLogs(`+${gain * sing.multi} Dance`)
                        }
                        if (c < 0.5) {
                            charm.base += gain
                            logs.addEurekaLogs(`+${gain * sing.multi} Charm`)
                        }
                        if (d < 0.5) {
                            pres.base += gain
                            logs.addEurekaLogs(`+${gain * sing.multi} Presence`)
                        }
                    },
                },
            ),
            new ActionTodo(
                'Yell on Wooden Box',
                20 * S_TO_MS,
                [{ which_stat: "Presence", effectiveness: 1.0 },],
                [{ which_stat: "Fans", flat_gain_base: 2 },],
                "You know when those anime girls standing near the school gate after school to try and advertise their idol activities? Yeah, that's you now.",
                {
                    dependsOn: "Presence",
                },
            ),
            new ActionTodo(
                'Hallway Dancing',
                60 * S_TO_MS,
                [{ which_stat: "Presence", effectiveness: 1.0 },],
                [
                    { which_stat: "Dance", flat_gain_multi: 0.01 },
                    { which_stat: "Presence", flat_gain_multi: 0.01 },
                ],
                "Your school is too poor to have their own dance studio, but as an serious Idol, anywhere is your dance studio!",
                {
                    dependsOn: "Presence",
                    eureka: "Small chance to gain 1 Fans"
                },
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
                [{ which_stat: "Stamina", effectiveness: 1.0 },],
                [{ which_stat: "Stamina", flat_gain_base: 4.0 },],
                "No, no, not metaphorically; physically - you are physically running up and down the stairs like a silly goose. But hey, this does make you fitter, probably.",
                {
                    dependsOn: "Stamina",
                },
            ),
        ]
    ],
    ["Idol Club", 
        [
            new SpendCurrencyTodo(
                'Host School Concert',
                60 * S_TO_MS,
                120,
                [
                    { which_stat: 
                        "Fans",
                        flat_gain_base: 3, 
                        depends: [
                            { which_stat: "Sing", effectiveness: 0.5 },
                            { which_stat: "Dance", effectiveness: 0.5 },
                        ],
                        efficiency: "slow",
                    },
                    { which_stat: "Sing", flat_gain_base: 2.5 },
                    { which_stat: "Dance", flat_gain_base: 2.5 },
                ],
                "Finally, a real stage. The lighting, the music, the fans...! Is this what it feels like to be in the spotlight? The tickets are free though.",
                {
                    prereq: "Moni ≥ 120",
                    eureka: "Small chance for Big Success."
                },
                {
                    extra_reward_fn: () => {
                        let r = Math.random();
                        if (r < 0.1) {
                            let gain = Math.round(fans.final * 0.1)
                            fans.base += gain
                            logs.addEurekaLogs(`+${gain} Fans`, 'The concert was a BIG SUCCESS!')
                        }
                    },
                    check_disabled_fn: (stat_list) => {
                        if (stat_list.moni.final >= 120) {
                            return false;
                        }
                        return true;
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
                5,
                [],
                "Tired of the shitty environment at home? Well, hopefully this little upgrade will make it better.",
                {
                    prereq: "Moni ≥ 1500",
                },
                {
                    one_off_flag: true,
                    then_fn: () => {
                        Game_Progress.progress_handler.upgrade_living_room();
                        logs.addHintLogs('Your Living Room upgraded to Living Room+, give it a check!')
                    },
                    check_disabled_fn: (stat_list) => {
                        if (stat_list.moni.final >= 5) {
                            return false;
                        }
                        return true;
                    },
                },
            ),
            new SpendCurrencyTodo(
                'Buy Cute Outfit',
                3 * S_TO_MS,
                99,
                [
                    { which_stat: "Charm", flat_gain_base: 5.0 },
                ],
                "Buy Buy Buy Spend Spend Spend... New clothes are always welcome.",
                {
                    prereq: "Moni ≥ 99",
                },
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
                3 * S_TO_MS,
                99,
                [
                    { which_stat: "Presence", flat_gain_base: 5.0 },
                ],
                "Buy Buy Buy Spend Spend Spend... New clothes are always welcome.",
                {
                    prereq: "Moni ≥ 99",
                },
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
]);