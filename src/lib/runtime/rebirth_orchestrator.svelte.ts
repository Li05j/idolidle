import { LiveBattleM } from "$lib/runtime/live_battle_manager.svelte"
import { ModalM } from "$lib/runtime/modal_manager.svelte"
import { TodoCardM } from "$lib/runtime/todo_card_manager.svelte"
import { CPs } from "$lib/state/checkpoints.svelte"
import { Progression } from "$lib/runtime/progression_engine.svelte"
import { stat_list_reset } from "$lib/state/stats.svelte"
import { RivalStatsM } from "$lib/runtime/live_rival_stats.svelte"
import { EquipM } from "$lib/state/equipment.svelte"
import { Rebirth } from "$lib/state/rebirth.svelte"

export function performRebirth() {
    Rebirth.inherit_stats()
    Rebirth.award_rebirth_points()
    Rebirth.add_dream_points(EquipM.flush_pending_dp())
    stat_list_reset()
    LiveBattleM.reset()
    RivalStatsM.reroll()
    TodoCardM.reset()
    CPs.reset()
    Progression.reset()
    ModalM.reset()
    Rebirth.increment_rebirth_count()
    Rebirth.apply_gains_to_initial_stats()
    EquipM.reset_for_rebirth()
}
