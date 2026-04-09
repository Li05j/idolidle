import { history } from '$lib/state/history.svelte';
import { skill_unlock_conditions, SkillM } from '$lib/state/skills.svelte';
import type { LocationDef } from './location_definition';

function skill_go_home_club() {
    skill_unlock_conditions.living_room_actions++;
    if (SkillM.learned_skills.has("Go-Home Club")) {
        return;
    }
    const rand = Math.random();
    if (rand < skill_unlock_conditions.living_room_actions / 10) {
        SkillM.learn_skill("Go-Home Club");
        history.addSystemLog(`Eureka! You gained a new skill: Go-Home Club!`);
    }
}

export const living_room: LocationDef = {
    name: 'Living Room',
    base_time: 4,
    desc: "The first stage of your idol career, or maybe just where socks mysteriously vanish. Sing off-key, dance like a disaster—no one's watching (except maybe the cat). Meow.",
    hint: "Some cards may show very important info when hovered - like hints, or even restrictions/bonuses.",
    rewards: [
        { which_stat: "Stamina", flat_gain_base: 0.2 },
    ],
    unlocks: ['Park', 'School'],
    actions: [
        {
            name: 'Singing Practice',
            kind: 'training',
            base_time: 5,
            desc: "Your voice cracks. Your cat weeps. But somewhere in the noise, a star might be warming up.",
            rewards: [
                { which_stat: "Sing", flat_gain_base: 0.5 },
            ],
            on_complete: { fn: skill_go_home_club },
        },
        {
            name: 'Dancing Practice',
            kind: 'training',
            base_time: 5,
            desc: "Limbs flail, rhythm fails, and then you trip yourself. Maybe the floor just hates you.",
            rewards: [
                { which_stat: "Dance", flat_gain_base: 0.5 },
            ],
            on_complete: { fn: skill_go_home_club },
        },
    ],
    upgrades: [
        {
            trigger_action: 'Upgrade Living Room',
            replace_all: true,
            add_actions: [
                {
                    name: 'Singing Practice+',
                    mastery_id: 'Singing Practice',
                    kind: 'training',
                    base_time: 30,
                    desc: "At least your cat won't faint anymore, that's what we call improvement.",
                    rewards: [
                        { which_stat: "Stamina", flat_gain_base: 0.5 },
                        { which_stat: "Sing", flat_gain_base: 5 },
                    ],
                    on_complete: { fn: skill_go_home_club },
                },
                {
                    name: 'Dancing Practice+',
                    mastery_id: 'Dancing Practice',
                    kind: 'training',
                    base_time: 30,
                    desc: "No more kisses with the floor you just mopped. More calm, more peace. Going with the flow.",
                    rewards: [
                        { which_stat: "Stamina", flat_gain_base: 0.5 },
                        { which_stat: "Dance", flat_gain_base: 5 },
                    ],
                    on_complete: { fn: skill_go_home_club },
                },
            ],
            on_trigger: () => {
                history.addSystemLog('Your Living Room upgraded to Living Room+, give it a check!');
            },
        },
    ],
};
