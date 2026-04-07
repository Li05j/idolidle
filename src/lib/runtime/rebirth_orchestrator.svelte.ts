import { LiveBattleM } from "$lib/runtime/live_battle_manager.svelte"
import { ModalM } from "$lib/runtime/modal_manager.svelte"
import { TodoCardM } from "$lib/runtime/todo_card_manager.svelte"
import { CPs } from "$lib/state/checkpoints.svelte"
import { Progression } from "$lib/runtime/progression_engine.svelte"
import { stat_list_reset } from "$lib/state/stats.svelte"
import { RivalStatsM } from "$lib/runtime/live_rival_stats.svelte"
import { skill_unlock_conditions_reset, SkillM } from "$lib/state/skills.svelte"
import { Rebirth } from "$lib/state/rebirth.svelte"

export function performRebirth() {
    Rebirth.inherit_stats()
    stat_list_reset()
    LiveBattleM.reset()
    RivalStatsM.reroll()
    TodoCardM.reset()
    CPs.reset()
    Progression.reset()
    ModalM.reset()
    SkillM.reset()
    skill_unlock_conditions_reset()
    Rebirth.increment_rebirth_count()
    Rebirth.apply_gains_to_initial_stats()
}
