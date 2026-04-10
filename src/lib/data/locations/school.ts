import { history } from '$lib/state/history.svelte';
import { stat_list } from '$lib/state/stats.svelte';
import { truncate_to_decimal } from '$lib/utils/utils';
import { simple_flat_stat_reward, simple_percent_stat_reward, uniform_rand_stat_flat_reward } from '$lib/utils/reward_helpers';
import type { LocationDef } from './location_definition';

const IDOL_CLUB_COST = { fans: 100, moni: 500 };
const IDOL_CLUB_CONCERT_COST = 100;

function extra_grade_report() {
    let [stat_name, actual_gain] = uniform_rand_stat_flat_reward('base', 5, 10);
    history.addSystemLog(`Eureka! The Grade Report has enlightened you. +${actual_gain} ${stat_name}!`);
}

function extra_attend_class() {
    let a = Math.random();
    let b = Math.random();
    let c = Math.random();
    let d = Math.random();
    let gain = 1.2;
    if (a < 0.5) {
        stat_list.Sing.base += gain;
        history.addSystemLog(`Eureka! You gained +${truncate_to_decimal(gain * stat_list.Sing.multi)} Sing!`);
    }
    if (b < 0.5) {
        stat_list.Dance.base += gain;
        history.addSystemLog(`Eureka! You gained +${truncate_to_decimal(gain * stat_list.Dance.multi)} Dance!`);
    }
    if (c < 0.5) {
        stat_list.Charm.base += gain;
        history.addSystemLog(`Eureka! You gained +${truncate_to_decimal(gain * stat_list.Charm.multi)} Charm!`);
    }
    if (d < 0.5) {
        stat_list.Presence.base += gain;
        history.addSystemLog(`Eureka! You gained +${truncate_to_decimal(gain * stat_list.Presence.multi)} Presence!`);
    }
}

function extra_yell_on_wooden_box() {
    let [is_success, value] = simple_flat_stat_reward("Fans", "base", "Tiny", 5);
    if (is_success) {
        history.addSystemLog(`Eureka! You attracted ${value} student(s) to be fans! +${value} Fans!`);
    }
}

function extra_hallway_flash_mob() {
    let [is_success, value] = simple_flat_stat_reward("Fans", "base", "Tiny", 5);
    if (is_success) {
        history.addSystemLog(`Eureka! You attracted ${value} student(s) to be fans! +${value} Fans!`);
    }
}

function extra_host_school_concert() {
    let [is_success, value] = simple_percent_stat_reward("Fans", "base", "Tiny", 0.1);
    if (is_success) {
        history.addSystemLog(`Eureka! The concert was a BIG SUCCESS! +${value} Fans!`);
    }
}

function extra_club_promoter() {
    let [is_success, value] = simple_flat_stat_reward("Fans", "multi", "Tiny", 0.01);
    if (is_success) {
        history.addSystemLog(`Eureka! You sparked interest among students! +${value} Fans multi!`);
    }
}

export const school: LocationDef = {
    name: 'School',
    base_time: 80,
    desc: "A place for learning, daydreaming, and maybe scribbling lyrics in your notebook. Idol stories always seem to start with being a student.",
    hint: "When it is time for LIVE, you will need to prove that you are the better Idol. All of your stats (except Moni) will be taken into consideration. Make sure to train well!",
    rewards: [
        { which_stat: "Stamina", flat_gain_base: 4 },
    ],
    unlocks: ['Gym', 'Maid Cafe'],
    actions: [
        {
            name: 'Open Idol Club',
            kind: 'spending',
            base_time: 30,
            desc: "On your way to become the ultimate school idol. One step closer to becoming the star you've always dreamed of.",
            rewards: [
                { which_stat: "Fans", flat_gain_base: 25 },
            ],
            costs: [{ stat: "Moni", amount: IDOL_CLUB_COST.moni }],
            uses: 1,
            requires: {
                text: `Fans ≥ ${IDOL_CLUB_COST.fans}, Moni ≥ ${IDOL_CLUB_COST.moni}`,
                check: () => stat_list.Fans.final < IDOL_CLUB_COST.fans || stat_list.Moni.final < IDOL_CLUB_COST.moni,
            },
        },
        {
            name: 'Collect Grade Report',
            kind: 'training',
            base_time: 10,
            desc: "Somehow you didn't bother to take your Grade Report from last year back home... How clumsy of you. Better collect it now.",
            rewards: [],
            uses: 1,
            on_complete: {
                fn: extra_grade_report,
                hint: "Randomly increase a stat by a small amount",
            },
        },
        {
            name: 'Attend Class',
            kind: 'training',
            base_time: 60,
            desc: "You still gotta study alright; elite idol and elite student? That's the spirit.",
            rewards: [
                { which_stat: "Sing", flat_gain_base: 1.2 },
                { which_stat: "Dance", flat_gain_base: 1.2 },
                { which_stat: "Charm", flat_gain_base: 1.2 },
                { which_stat: "Presence", flat_gain_base: 1.2 },
            ],
            on_complete: {
                fn: extra_attend_class,
                hint: "Good chance to double stat gains",
            },
        },
        {
            name: 'Yell on Wooden Box',
            kind: 'training',
            base_time: 20,
            desc: "You know when those anime girls standing near the school gate after school to try and advertise their idol activities? Yeah, that's you now.",
            rewards: [
                { which_stat: "Fans", flat_gain_base: 2 },
            ],
            on_complete: {
                fn: extra_yell_on_wooden_box,
                hint: "Tiny chance to gain 5 Fans",
            },
        },
        {
            name: 'Hallway Flash Mob',
            kind: 'training',
            base_time: 20,
            desc: "Your school doesn't seem to understand your value to provide you with a suitable stage. But as an serious Idol, anywhere is your stage to shine in!",
            rewards: [
                { which_stat: "Dance", flat_gain_base: 1.0 },
                { which_stat: "Presence", flat_gain_base: 1.0 },
            ],
            on_complete: {
                fn: extra_hallway_flash_mob,
                hint: "Tiny chance to gain 5 Fans",
            },
        },
        {
            name: 'Climbing the Stairs',
            kind: 'training',
            base_time: 6,
            desc: "No, no, not metaphorically; physically - you are physically running up and down the stairs like a silly goose. But hey, this does make you fitter, probably.",
            rewards: [
                { which_stat: "Stamina", flat_gain_base: 0.4 },
                { which_stat: "Presence", flat_gain_base: 0.2 },
            ],
        },
    ],
    upgrades: [
        {
            trigger_action: 'Open Idol Club',
            add_actions: [
                {
                    name: 'Host School Concert',
                    kind: 'spending',
                    base_time: 45,
                    desc: "Finally, a real stage. The lighting, the music, the fans...! Is this what it feels like to be in the spotlight? The tickets are free though.",
                    rewards: [
                        {
                            which_stat: "Fans",
                            flat_gain_base: 20,
                            depends: [
                                { which_stat: "Sing", effectiveness: 0.5 },
                                { which_stat: "Dance", effectiveness: 0.5 },
                            ],
                            efficiency: "fast",
                        },
                        { which_stat: "Charm", flat_gain_base: 5.0 },
                        { which_stat: "Presence", flat_gain_base: 5.0 },
                    ],
                    costs: [{ stat: "Moni", amount: IDOL_CLUB_CONCERT_COST }],
                    requires: {
                        text: `Moni ≥ ${IDOL_CLUB_CONCERT_COST}`,
                        check: () => stat_list.Moni.final < IDOL_CLUB_CONCERT_COST,
                    },
                    on_complete: {
                        fn: extra_host_school_concert,
                        hint: "Tiny chance for Big Success",
                    },
                },
                {
                    name: 'Sell Merch',
                    kind: 'earning',
                    base_time: 25,
                    desc: "Overpriced? Scam? What do you mean? It's them who chose to spend the Moni...",
                    rewards: [{
                        which_stat: "Moni",
                        flat_gain_base: 5,
                        depends: [{ which_stat: "Presence", effectiveness: 1.2 }],
                        efficiency: "slow",
                    }],
                },
                {
                    name: 'Club Promoter',
                    kind: 'training',
                    base_time: 30,
                    desc: "Idol isn't all about performing on stage, getting your name out there is also important. But people will only notice you if you are actually good...",
                    rewards: [{ which_stat: "Presence", flat_gain_base: 3.0 }],
                    on_complete: {
                        fn: extra_club_promoter,
                        hint: "Tiny chance to gain 0.01 Fans multi",
                    },
                },
            ],
            on_trigger: () => {
                history.addSystemLog('You have unlocked some club activities under School, go check them out!');
            },
        },
        {
            trigger_action: 'Collect Grade Report',
        },
    ],
};
