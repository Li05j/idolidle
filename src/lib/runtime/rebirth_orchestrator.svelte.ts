import { LiveBattleM } from "$lib/runtime/live_battle_manager.svelte"
import { ModalM } from "$lib/runtime/modal_manager.svelte"
import { TodoCardM } from "$lib/runtime/todo_card_manager.svelte"
import { CPs } from "$lib/state/checkpoints.svelte"
import { Progression } from "$lib/runtime/progression_engine.svelte"
import { stat_list_reset } from "$lib/state/stats.svelte"
import { RivalStatsM } from "$lib/runtime/live_rival_stats.svelte"
import { EquipM } from "$lib/state/equipment.svelte"
import { Rebirth } from "$lib/state/rebirth.svelte"
import { RunTotals } from "$lib/state/run_totals.svelte"
import { history } from "$lib/state/history.svelte"

export function performRebirth() {
    // A won-but-not-continued battle still earned the CP: fold its rewards in
    // so "Dream after win" matches "Continue, then dream" (DP, max CP, fans).
    if (LiveBattleM.did_player_win) {
        LiveBattleM.concludeBattle()
    }
    Rebirth.inherit_stats()
    const cp_dp = Rebirth.award_rebirth_points()
    const equip_dp = EquipM.flush_pending_dp()
    Rebirth.add_dream_points(equip_dp)
    history.addSystemLog(`Your idol dream inspired you... +${cp_dp + equip_dp} DP`)
    RunTotals.reset()
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
