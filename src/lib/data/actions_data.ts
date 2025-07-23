import { stat_list } from "$lib/stores/stats.svelte";
import { logs } from '$lib/stores/history.svelte'
import { ActionTodo, GainCurrencyTodo, SpendCurrencyTodo, type TodoBase } from './todo_type';
import { Game_Progress } from "$lib/stores/game_progress.svelte";
import { DECIMAL_PLACES, S_TO_MS } from "$lib/utils/utils";
import { Cost } from "$lib/data/cost_constants";

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
                30 * S_TO_MS,
                [
                    { which_stat: "Stamina", effectiveness: 0.25 },
                    { which_stat: "Charm", effectiveness: 0.75 },
                ],
                [
                    { which_stat: "Stamina", flat_gain_base: 0.5},
                    { which_stat: "Sing", flat_gain_base: 4.5},
                ],
                "At least your cat won\'t faint anymore, that\'s what we call improvement.",
                {
                    dependsOn: "Stamina, Charm",
                },
            ),
            new ActionTodo(
                'Dancing Practice+',
                30 * S_TO_MS,
                [
                    { which_stat: "Stamina", effectiveness: 0.25 },
                    { which_stat: "Presence", effectiveness: 0.75 },
                ],
                [
                    { which_stat: "Stamina", flat_gain_base: 0.5},
                    { which_stat: "Dance", flat_gain_base: 4.5},
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
                8 * S_TO_MS,
                [
                    {which_stat: "Moni", flat_gain_base: 3, depends: [{ which_stat: "Stamina", effectiveness: 1.0 }], efficiency: "v_slow"},
                ],
                "Being an Idol means starting somewhere, you know? Defo not working for the Moni - Just making sure the Park is clean and tidy.",
                {
                    dependsOn: "Stamina"
                },
            ),
            new GainCurrencyTodo(
                'Busker',
                30 * S_TO_MS,
                [
                    {
                        which_stat: "Fans",
                        flat_gain_base: 1,
                        depends: [
                            { which_stat: "Sing", effectiveness: 0.4 },
                            { which_stat: "Dance", effectiveness: 0.4 },
                        ],
                        efficiency: "v_slow",
                    },
                    {
                        which_stat: "Moni",
                        flat_gain_base: 6,
                        depends: [
                            { which_stat: "Fans", effectiveness: 1.0 },
                        ],
                        efficiency: "slow",
                    },
                ],
                "It's quite embarrassing doing this in public... But at least it's somewhat better than collecting bottles?",
                {
                    dependsOn: "Fans, Sing, Dance"
                },
            ),
            new ActionTodo(
                'Play Tag with Kids',
                12 * S_TO_MS,
                [
                    { which_stat: "Stamina", effectiveness: 0.5 },
                    { which_stat: "Charm", effectiveness: 0.5 },
                ],
                [
                    { which_stat: "Agility", flat_gain_base: 0.6 },
                    { which_stat: "Charm", flat_gain_base: 0.6 },
                ],
                "\"Tag - You're it!\" You giggle, trying to charm them with your elegant wink. It usually doesn\'t work, though.",
                {
                    dependsOn: "Stamina, Charm",
                    eureka: "Tiny chance to gain some Fans"
                },
                {
                    extra_reward_fn: () => {
                        let r = Math.random();
                        if (r < 0.1) {
                            let gain = 1
                            let actual_gain = Math.floor(gain * stat_list.Fans.multi)
                            stat_list.Fans.base += gain
                            logs.addEurekaLogs(`+${actual_gain} Fans`, `You converted ${actual_gain} kid(s) into fans!`)
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
                30 * S_TO_MS,
                Cost.idol_club.moni,
                [
                    { which_stat: "Fans", flat_gain_base: 25 },
                ],
                "On your way to become the ultimate school idol. One step closer to becoming the star you\'ve always dreamed of.",
                {
                    prereq: `Fans ≥ ${Cost.idol_club.fans}, Moni ≥ ${Cost.idol_club.moni}`,
                },
                {
                    one_off_flag: true,
                    then_fn: () => {
                        Game_Progress.progress_handler.school_idol_club();
                        logs.addHintLogs('You have unlocked some club activities under School, go check them out!')
                    },
                    check_disabled_fn: (stat_list) => {
                        if (stat_list.Fans.final >= Cost.idol_club.fans && stat_list.Moni.final >= Cost.idol_club.moni) {
                            return false;
                        }
                        return true;
                    },
                },
            ),
            new ActionTodo(
                'Collect Grade Report',
                15 * S_TO_MS,
                [],
                [],
                "Somehow you didn\'t bother to take your Grade Report from last year back home... How clumsy of you. Better collect it now.",
                {
                    eureka: "Randomly increase a stat by a small amount",
                },
                {
                    one_off_flag: true,
                    then_fn: () => {
                        Game_Progress.progress_handler.grade_report();
                    },
                    extra_reward_fn: () => {
                        let stat = Math.random();
                        let gain = Math.random() * 5 + 5
                        if (stat < 1/6) {
                            let actual_gain = Math.floor(gain * stat_list.Stamina.multi)
                            stat_list.Stamina.base += gain
                            logs.addEurekaLogs(`+${actual_gain} Stamina`, `The Grade Report has enlightened you.`)
                        } else if (stat < 1/3) {
                            let actual_gain = Math.floor(gain * stat_list.Agility.multi)
                            stat_list.Agility.base += gain
                            logs.addEurekaLogs(`+${actual_gain} Agility`, `The Grade Report has enlightened you.`)
                        } else if (stat < 1/2) {
                            let actual_gain = Math.floor(gain * stat_list.Sing.multi)
                            stat_list.Sing.base += gain
                            logs.addEurekaLogs(`+${actual_gain} Sing`, `The Grade Report has enlightened you.`)
                        } else if (stat < 2/3) {
                            let actual_gain = Math.floor(gain * stat_list.Dance.multi)
                            stat_list.Dance.base += gain
                            logs.addEurekaLogs(`+${actual_gain} Dance`, `The Grade Report has enlightened you.`)
                        } else if (stat < 5/6) {
                            let actual_gain = Math.floor(gain * stat_list.Charm.multi)
                            stat_list.Charm.base += gain
                            logs.addEurekaLogs(`+${actual_gain} Charm`, `The Grade Report has enlightened you.`)
                        } else if (stat <= 1) {
                            let actual_gain = Math.floor(gain * stat_list.Presence.multi)
                            stat_list.Presence.base += gain
                            logs.addEurekaLogs(`+${actual_gain} Presence`, `The Grade Report has enlightened you.`)
                        }
                    },
                },
            ),
            new ActionTodo(
                'Go to Class',
                60 * S_TO_MS,
                [
                    { which_stat: "Charm", effectiveness: 0.35 },
                    { which_stat: "Presence", effectiveness: 0.35 },
                ],
                [
                    { which_stat: "Sing", flat_gain_base: 1.2 },
                    { which_stat: "Dance", flat_gain_base: 1.2 },
                    { which_stat: "Charm", flat_gain_base: 1.2 },
                    { which_stat: "Presence", flat_gain_base: 1.2 },
                ],
                "You still gotta study alright; elite idol and elite student? That's the spirit.",
                {
                    dependsOn: "Charm, Presence",
                    eureka: "Good chance to double stat gains"
                },
                {
                    extra_reward_fn: () => {
                        let a = Math.random();
                        let b = Math.random();
                        let c = Math.random();
                        let d = Math.random();
                        let gain = 1.2;
                        if (a < 0.5) {
                            stat_list.Sing.base += gain
                            logs.addEurekaLogs(`+${(gain * stat_list.Sing.multi).toFixed(DECIMAL_PLACES)} Sing`)
                        }
                        if (b < 0.5) {
                            stat_list.Dance.base += gain
                            logs.addEurekaLogs(`+${(gain * stat_list.Dance.multi).toFixed(DECIMAL_PLACES)} Dance`)
                        }
                        if (c < 0.5) {
                            stat_list.Charm.base += gain
                            logs.addEurekaLogs(`+${(gain * stat_list.Charm.multi).toFixed(DECIMAL_PLACES)} Charm`)
                        }
                        if (d < 0.5) {
                            stat_list.Presence.base += gain
                            logs.addEurekaLogs(`+${(gain * stat_list.Presence.multi).toFixed(DECIMAL_PLACES)} Presence`)
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
                    eureka: "Tiny chance to gain some Fans"
                },
                {
                    extra_reward_fn: () => {
                        let r = Math.random();
                        if (r < 0.1) {
                            let gain = 2
                            let actual_gain = Math.floor(gain * stat_list.Fans.multi)
                            stat_list.Fans.base += gain
                            logs.addEurekaLogs(`+${actual_gain} Fans`, `You attracted ${actual_gain} student(s) to be fans!`)
                        }
                    },
                },
            ),
            new ActionTodo(
                'Hallway Dancing',
                20 * S_TO_MS,
                [{ which_stat: "Dance", effectiveness: 1.0 },],
                [
                    { which_stat: "Dance", flat_gain_base: 0.5 },
                    { which_stat: "Presence", flat_gain_base: 1.5 },
                ],
                "Your school is too poor to have their own dance studio, but as an serious Idol, anywhere is your dance studio!",
                {
                    dependsOn: "Dance",
                    eureka: "Tiny chance to gain some Fans"
                },
                {
                    extra_reward_fn: () => {
                        let r = Math.random();
                        if (r < 0.1) {
                            let gain = 2
                            let actual_gain = Math.floor(gain * stat_list.Fans.multi)
                            stat_list.Fans.base += gain
                            logs.addEurekaLogs(`+${actual_gain} Fans`, `You attracted ${actual_gain} student(s) to be fans!`)
                        }
                    },
                },
            ),
            new ActionTodo(
                'Climbing the Stairs',
                20 * S_TO_MS,
                [{ which_stat: "Agility", effectiveness: 1.0 },],
                [{ which_stat: "Stamina", flat_gain_base: 2.0 },],
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
                45 * S_TO_MS,
                Cost.idol_club_concert,
                [
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
                "Finally, a real stage. The lighting, the music, the fans...! Is this what it feels like to be in the spotlight? The tickets are free though.",
                {
                    prereq: `Moni ≥ ${Cost.idol_club_concert}`,
                    dependsOn: "Sing, Dance",
                    eureka: "Tiny chance for Big Success."
                },
                {
                    extra_reward_fn: () => {
                        let r = Math.random();
                        if (r < 0.1) {
                            let gain = Math.round(stat_list.Fans.final * 0.1)
                            stat_list.Fans.base += gain
                            logs.addEurekaLogs(`+${Math.floor(gain * stat_list.Fans.multi)} Fans`, 'The concert was a BIG SUCCESS!')
                        }
                    },
                    check_disabled_fn: (stat_list) => {
                        if (stat_list.Moni.final >= Cost.idol_club_concert) {
                            return false;
                        }
                        return true;
                    },
                },
            ),
            new GainCurrencyTodo(
                'Sell Merch',
                25 * S_TO_MS,
                [{ which_stat: "Moni",
                    flat_gain_base: 10,
                    depends: [
                        { which_stat: "Fans", effectiveness: 1.5 },
                    ],
                    efficiency: "slow",
                },],
                "Scam? What do you mean? It\'s them who chose to spend the Moni...",
                {
                    dependsOn: "Fans",
                },
            ),
            new ActionTodo(
                'Club Promoter',
                32 * S_TO_MS,
                [
                    { which_stat: "Sing", effectiveness: 0.5 },
                    { which_stat: "Dance", effectiveness: 0.5 },
                ],
                [
                    { which_stat: "Presence", flat_gain_base: 4 },
                ],
                "Idol isn\'t all about performing on stage, getting your name out there is also important. But people will only notice you if you are actually good...",
                {
                    dependsOn: "Sing, Dance",
                    eureka: "Tiny chance to gain 0.01 Fans multi"
                },
                {
                    extra_reward_fn: () => {
                        let r = Math.random();
                        if (r < 0.1) {
                            stat_list.Fans.multi += 0.01
                            logs.addEurekaLogs(`+0.01 Fans multi`, `You sparked interest among students!`)
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
                60 * S_TO_MS,
                Cost.living_room_upgrarde,
                [],
                "Tired of the shitty environment at home? Well, hopefully this little upgrade will make it better.",
                {
                    prereq: `Moni ≥ ${Cost.living_room_upgrarde}`,
                },
                {
                    one_off_flag: true,
                    then_fn: () => {
                        Game_Progress.progress_handler.upgrade_living_room();
                        logs.addHintLogs('Your Living Room upgraded to Living Room+, give it a check!')
                    },
                    check_disabled_fn: (stat_list) => {
                        if (stat_list.Moni.final >= Cost.living_room_upgrarde) {
                            return false;
                        }
                        return true;
                    },
                },
            ),
            // new SpendCurrencyTodo(
            //     'Lottery',
            //     15 * S_TO_MS,
            //     25,
            //     [],
            //     "We do NOT encourage the behavior of gambling. You see, this is gacha, it\'s different.",
            //     {
            //         prereq: "Moni ≥ 25",
            //         eureka: "Who knows what you will get...?"
            //     },
            //     {
            //         one_off_flag: true,
            //         check_disabled_fn: (stat_list) => {
            //             if (stat_list.Moni.final >= 25) {
            //                 return false;
            //             }
            //             return true;
            //         },
            //         extra_reward_fn: () => {

            //         },
            //     },
            // ),
            new SpendCurrencyTodo(
                'Buy Cute Outfit',
                3 * S_TO_MS,
                25,
                [
                    { which_stat: "Charm", flat_gain_base: 3.5 },
                ],
                "Buy Buy Buy Spend Spend Spend... New clothes are always welcome.",
                {
                    prereq: "Moni ≥ 25",
                },
                {
                    check_disabled_fn: (stat_list) => {
                        if (stat_list.Moni.final >= 25) {
                            return false;
                        }
                        return true;
                    },
                },
            ),
            new SpendCurrencyTodo(
                'Buy Cool Outfit',
                3 * S_TO_MS,
                25,
                [
                    { which_stat: "Presence", flat_gain_base: 3.5 },
                ],
                "Buy Buy Buy Spend Spend Spend... New clothes are always welcome.",
                {
                    prereq: "Moni ≥ 25",
                },
                {
                    check_disabled_fn: (stat_list) => {
                        if (stat_list.Moni.final >= 25) {
                            return false;
                        }
                        return true;
                    },
                },
            ),
        ]
    ],
    ["Gym", 
        [
            new SpendCurrencyTodo(
                'Purchase Gym VIP',
                10 * S_TO_MS,
                Cost.gym_vip,
                [],
                "With just a 1 time fee, you no longer need to pay to use the Gym. What a deal!",
                {
                    prereq: `Moni ≥ ${Cost.gym_vip}`,
                    eureka: "Void all training costs in Gym. Trainings are also slightly more efficient."
                },
                {
                    one_off_flag: true,
                    then_fn: () => {
                        Game_Progress.progress_handler.upgrade_gym();
                        logs.addHintLogs('You are now a VIP member of the Gym! All equipment costs are voided.')
                    },
                    check_disabled_fn: (stat_list) => {
                        if (stat_list.Moni.final >= Cost.gym_vip) {
                            return false;
                        }
                        return true;
                    },
                },
            ),
            new SpendCurrencyTodo(
                'Bench Press',
                20 * S_TO_MS,
                Cost.gym_actions,
                [
                    { which_stat: "Stamina", flat_gain_base: 3 },
                ],
                "Is this the Idol meta nowadays?",
                {
                    prereq: `Moni ≥ ${Cost.gym_actions}`,
                },
                {
                    check_disabled_fn: (stat_list) => {
                        if (stat_list.Moni.final >= Cost.gym_actions) {
                            return false;
                        }
                        return true;
                    },
                },
            ),
            new SpendCurrencyTodo(
                'Assault Bike',
                20 * S_TO_MS,
                Cost.gym_actions,
                [
                    { which_stat: "Agility", flat_gain_base: 3 },
                ],
                "You are not actually assulting a bike are you.",
                {
                    prereq: `Moni ≥ ${Cost.gym_actions}`,
                },
                {
                    check_disabled_fn: (stat_list) => {
                        if (stat_list.Moni.final >= Cost.gym_actions) {
                            return false;
                        }
                        return true;
                    },
                },
            ),
            new SpendCurrencyTodo(
                'Treadmill',
                20 * S_TO_MS,
                Cost.gym_actions,
                [
                    { which_stat: "Agility", flat_gain_base: 1.5 },
                    { which_stat: "Stamina", flat_gain_base: 1.5 },
                ],
                "\"...Why do I have to pay to run?\"",
                {
                    prereq: `Moni ≥ ${Cost.gym_actions}`,
                },
                {
                    check_disabled_fn: (stat_list) => {
                        if (stat_list.Moni.final >= Cost.gym_actions) {
                            return false;
                        }
                        return true;
                    },
                },
            ),
        ]
    ],
    ["Gym VIP", 
        [
            new ActionTodo(
                'Assault Bike',
                20 * S_TO_MS,
                [{ which_stat: "Stamina", effectiveness: 1.0 },],
                [
                    { which_stat: "Agility", flat_gain_base: 3.0 },
                ],
                "Running.",
                {
                    dependsOn: "Stamina",
                    eureka: "Slight chance to gain 0.01 Agility multi"
                },
                {
                    extra_reward_fn: () => {
                        let r = Math.random();
                        if (r < 0.1) {
                            stat_list.Agility.multi += 0.01
                            logs.addEurekaLogs(`+0.01 Agility multi`, 'An unexpected breakthrough!')
                        }
                    },
                }
            ),
            new ActionTodo(
                'Treadmill',
                20 * S_TO_MS,
                [
                    { which_stat: "Stamina", effectiveness: 0.5 },
                    { which_stat: "Agility", effectiveness: 0.5 },
                ],
                [
                    { which_stat: "Stamina", flat_gain_base: 2 },
                    { which_stat: "Agility", flat_gain_base: 2 },
                ],
                "Running.",
                {
                    dependsOn: "Stamina, Agility",
                },
            ),
            new ActionTodo(
                'Bench Press',
                20 * S_TO_MS,
                [{ which_stat: "Agility", effectiveness: 1.0 },],
                [
                    { which_stat: "Stamina", flat_gain_base: 3.0 },
                ],
                "Ok like, muscles? Chest? Triceps? Being an Idol nowadays sure is tough. Hey, at least it\'s free now.",
                {
                    dependsOn: "Stamina",
                    eureka: "Slight chance to gain 0.01 Stamina multi"
                },
                {
                    extra_reward_fn: () => {
                        let r = Math.random();
                        if (r < 0.1) {
                            stat_list.Stamina.multi += 0.01
                            logs.addEurekaLogs(`+0.01 Stamina multi`, 'An unexpected breakthrough!')
                        }
                    },
                }
            ),
        ]
    ],
    ["Maid Cafe", 
        [
            new ActionTodo(
                'Maid Interview',
                20 * S_TO_MS,
                [],
                [
                    { which_stat: "Presence", flat_gain_base: 5 },
                ],
                "So you want to be a maid? Prove your worth.",
                {
                    prereq: `Fans ≥ ${Cost.maid_interview.fans}, Charm ≥ ${Cost.maid_interview.charm}`,
                    eureka: "Unlocks more options in Maid Cafe."
                },
                {
                    one_off_flag: true,
                    then_fn: () => {
                        Game_Progress.progress_handler.maid_interview();
                        logs.addHintLogs('You are now a Maid!')
                    },
                    check_disabled_fn: (stat_list) => {
                        if (stat_list.Fans.final >= Cost.maid_interview.fans && stat_list.Charm.final >= Cost.maid_interview.charm) {
                            return false;
                        }
                        return true;
                    },
                },
            ),
            new ActionTodo(
                'Chant Moe Magic',
                25 * S_TO_MS,
                [{ which_stat: "Sing", effectiveness: 1.0 },],
                [
                    { which_stat: "Dance", flat_gain_base: 0.5 },
                    { which_stat: "Charm", flat_gain_base: 2.5 },
                ],
                "Otaku dances aren\'t real dances, but it sure is cute and lovely. And cute. And lovely~ Look at all these Otakus fawning at you, you could even start a cult at this rate.",
                {
                    dependsOn: "Charm",
                    eureka: "Tiny chance to gain 0.01 Charm multi"
                },
                {
                    extra_reward_fn: () => {
                        let r = Math.random();
                        if (r < 0.1) {
                            stat_list.Charm.multi += 0.01
                            logs.addEurekaLogs(`+0.01 Charm multi`, 'An unexpected breakthrough!')
                        }
                    },
                },
            ),
        ]
    ],
    ["Maid Employee", 
        [
            new ActionTodo(
                'New Hire Bonus!',
                15 * S_TO_MS,
                [],
                [],
                "Yipee! Maid Cafe is as excited as you to have you join their team. Maybe they see something in you... Like, a rising Idol heart perhaps.",
                {
                    eureka: "Gain Moni based on your Charm",
                },
                {
                    one_off_flag: true,
                    then_fn: () => {
                        Game_Progress.progress_handler.maid_hire();
                    },
                    extra_reward_fn: () => {
                        const m = Math.random() * 0.3 + 0.3;
                        let gain = stat_list.Charm.final * m
                        stat_list.Moni.base += gain
                        logs.addEurekaLogs(`+${Math.floor(gain * stat_list.Moni.multi)} Moni`, 'Free Moni~')
                    },
                },
            ),
            new GainCurrencyTodo(
                'Maid Part-time',
                45 * S_TO_MS,
                [
                    { which_stat: "Presence", flat_gain_base: 3.5 },
                    { which_stat: 
                        "Moni",
                        flat_gain_base: 10,
                        depends: [
                            { which_stat: "Charm", effectiveness: 1.0 },
                        ],
                        efficiency: "mid",
                    },
                ],
                "\"Moe Moe Kyun Moe Moe Kyun Moe Moe Kyun Oishikuna-re~!!\"",
                {
                    dependsOn: "Charm",
                    eureka: "Good chance to gain some Fans"
                },
                {
                    extra_reward_fn: () => {
                        let r = Math.random();
                        if (r < 0.5) {
                            let gain = Math.random() * 5
                            let actual_gain = Math.floor(gain * stat_list.Fans.multi)
                            stat_list.Fans.base += gain
                            logs.addEurekaLogs(`+${actual_gain} Fans`, `You converted ${actual_gain} Otaku(s) into fans!`)
                        }
                    },
                },
            ),
        ]
    ],
]);