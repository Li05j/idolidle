import type { Skill } from "$lib/types";

function createSkillManager() {
	const all_skills: Map<string, Skill> = new Map()
	let unlearned_skills: Map<string, Skill> = $state(new Map())
    let learned_skills: Map<string, Skill> = $state(new Map())

    const init = () => {
        reset()
    }

    const add_skill = (s: Skill) => {
        all_skills.set(s.name, s);
    }

    const learn_skill = (n: string) => {
        const skill = unlearned_skills.get(n)
        if (skill) {
            learned_skills.set(skill.name, skill);
            unlearned_skills.delete(skill.name)
        }
    }

    const reset = () => {
        unlearned_skills = new Map(all_skills)
        learned_skills.clear();
    }

    return {
        get all_skills() { return all_skills },
        get unlearned_skills() { return unlearned_skills },
        get learned_skills() { return learned_skills },
        init,
        add_skill,
        learn_skill,
        reset,
    }
}

export let skill_unlock_conditions = {
    living_room_actions: 0
}

export function skill_unlock_conditions_reset() {
    skill_unlock_conditions = {
        living_room_actions: 0
    }
}

export const SkillM = createSkillManager();

SkillM.add_skill(
    {
        name: "Go-Home Club",
        triggers: ["turn_start"],
        chance: 1,
        unlock_string: 'Unlock by doing stuff at home.',
        cond_string: 'Stamina < 25%',
        eff_string: 'Restore 25% Stamina.',
    }
)

SkillM.add_skill(
    {
        name: "Underdog",
        triggers: ["turn_start"],
        chance: 1,
        unlock_string: 'Unlock by busking.',
        cond_string: 'Your Fans < Rival Fans',
        eff_string: 'Your next move will pouch 50% more Fans.',
    }
)

SkillM.add_skill(
    {
        name: "Idol Executive",
        triggers: ["live_start"],
        chance: 1,
        unlock_string: 'Unlock by hosting a school concert.',
        cond_string: 'Always',
        eff_string: 'Drain 10% Fans from Rival before LIVE starts.',
    }
)

SkillM.add_skill(
    {
        name: "Good Student",
        triggers: ["before_taking_dmg"],
        chance: 1,
        unlock_string: 'Unlock by being a good student in class.',
        cond_string: 'Rival performs a move.',
        eff_string: 'Reduce Fans loss by 50%.',
    }
)

SkillM.add_skill(
    {
        name: "Flashy Outfit",
        triggers: ["live_start"],
        chance: 1,
        unlock_string: 'Unlock by spending Moni on clothes.',
        cond_string: 'Always',
        eff_string: 'Reduce Rival Stamina by 10%.',
    }
)

SkillM.add_skill(
    {
        name: "Moe Kyun~!",
        triggers: ["before_taking_dmg"],
        chance: 1,
        unlock_string: 'Unlock by working at the Maid Cafe.',
        cond_string: 'Rival performs a Sing move.',
        eff_string: 'Increase Charm by 50%. If Rival failed to pouch any Fans from you, Rival loses 10% Fans.',
    }
)

SkillM.init()