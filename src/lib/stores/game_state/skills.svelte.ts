import type { Skill } from "$lib/types";

function createSkillContainer() {
	const all_skills: Map<string, Skill> = new Map()
	let unlearned_skills: Map<string, Skill> = $state(new Map())
    let learned_skills: Map<string, Skill> = $state(new Map())

    const init = () => {
        reset()
    }

    const add_skill = (s: Skill) => {
        all_skills.set(s.name, s);
    }

    const learn_skill = (s: Skill) => {
        const skill = unlearned_skills.get(s.name)
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

export const skill_container = createSkillContainer();

skill_container.add_skill(
    {
        name: "Cool skill",
        triggers: [],
        chance: 0,
        cond_string: '',
        eff_string: '',
     }
)

skill_container.add_skill(
    {
        name: "Cool skill",
        triggers: [],
        chance: 0,
        cond_string: '',
        eff_string: '',
     }
)

skill_container.add_skill(
    {
        name: "Cool skill1",
        triggers: [],
        chance: 0,
        cond_string: '',
        eff_string: '',
     }
)

skill_container.add_skill(
    {
        name: "Cool skill2",
        triggers: [],
        chance: 0,
        cond_string: '',
        eff_string: '',
     }
)

skill_container.add_skill(
    {
        name: "Cool skill3",
        triggers: [],
        chance: 0,
        cond_string: '',
        eff_string: '',
     }
)

skill_container.add_skill(
    {
        name: "Cool skill4",
        triggers: [],
        chance: 0,
        cond_string: '',
        eff_string: '',
     }
)

skill_container.init()