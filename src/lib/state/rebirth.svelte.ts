import { LiveBattleM } from "$lib/state/live_battle_manager.svelte"
import { ModalM } from "$lib/state/modal_manager.svelte"
import { TodoCardM } from "$lib/state/todo_card_manager.svelte"
import { CPs } from "$lib/state/checkpoints.svelte"
import { Progression } from "$lib/state/progression_engine.svelte"
import { stat_list, stat_list_reset } from "$lib/state/stats.svelte"
import { RivalStatsM } from "$lib/state/live_rival_stats.svelte"
import { skill_unlock_conditions_reset, SkillM } from "$lib/state/skills.svelte"
import type { BasicStats } from "$lib/types"

function zero_record(): Record<BasicStats, number> {
    return { Fans: 0, Moni: 0, Stamina: 0, Haste: 0, Sing: 0, Dance: 0, Charm: 0, Presence: 0 }
}

const STAT_KEYS = Object.keys(stat_list) as BasicStats[]

class RebirthStats {
    private _rebirth_count = $state(0)
    private _max_completed_checkpoints = $state(0)

    private base_gains: Record<BasicStats, number> = $state(zero_record())
    private multi_gains: Record<BasicStats, number> = $state(zero_record())

    private BASE_RATIO = 0.075
    private MULTI_RATIO = 0.0003

    private inherit_stats() {
        const multi_cap = 0.01 * (CPs.current_completed_checkpoint + 1)
        for (const key of STAT_KEYS) {
            this.base_gains[key] += stat_list[key].final * this.BASE_RATIO
            this.multi_gains[key] += Math.min(stat_list[key].final * this.MULTI_RATIO, multi_cap)
        }
    }

    private apply_gains_to_initial_stats() {
        for (const key of STAT_KEYS) {
            stat_list[key].base += this.base_gains[key]
            stat_list[key].multi += this.multi_gains[key]
        }
    }

    increment_rebirth_count() { this._rebirth_count++; }
    update_max_completed_checkpoints(c: number) {
        if (c > this._max_completed_checkpoints) {
            this._max_completed_checkpoints = c
        }
    }

    get rebirth_count() { return this._rebirth_count; }
    get max_completed_checkpoints() { return this._max_completed_checkpoints; }

    on_rebirth() {
        this.inherit_stats()
        stat_list_reset()
        LiveBattleM.reset()
        RivalStatsM.reroll()
        TodoCardM.reset()
        CPs.reset()
        Progression.reset()
        ModalM.reset()
        SkillM.reset()
        skill_unlock_conditions_reset()
        this.increment_rebirth_count()
        this.apply_gains_to_initial_stats()
    }
}

export const Rebirth = new RebirthStats()
