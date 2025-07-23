import { LiveBattleM } from "$lib/managers/live_battle_manager.svelte"
import { ModalM } from "$lib/managers/modal_manager.svelte"
import { TodoCardM } from "$lib/managers/todo_card_manager.svelte"
import { CPs } from "$lib/stores/checkpoints.svelte"
import { Game_Progress } from "$lib/stores/game_progress.svelte"
import { stat_list, stat_list_reset } from "$lib/stores/stats.svelte"
import { RivalStatsM } from "$lib/stores/live_rival_stats.svelte"

class RebirthStats {
    private _rebirth_count = $state(0)
    private _max_completed_checkpoints = $state(0)

    public fan_base_gain = $state(0)
    public moni_base_gain = $state(0)
    public sta_base_gain = $state(0)
    public spd_base_gain = $state(0)
    public sing_base_gain = $state(0)
    public dance_base_gain = $state(0)
    public charm_base_gain = $state(0)
    public pres_base_gain = $state(0)

    public fan_multi_gain = $state(0)
    public moni_multi_gain = $state(0)
    public sta_multi_gain = $state(0)
    public spd_multi_gain = $state(0)
    public sing_multi_gain = $state(0)
    public dance_multi_gain = $state(0)
    public charm_multi_gain = $state(0)
    public pres_multi_gain = $state(0)

    private BASE_RATIO = 0.075
    private MULTI_RATIO = 0.0003

    private inherit_stats() {
        this.fan_base_gain      += stat_list.Fans.final         * this.BASE_RATIO
        this.moni_base_gain     += stat_list.Moni.final         * this.BASE_RATIO
        this.sta_base_gain      += stat_list.Stamina.final      * this.BASE_RATIO
        this.spd_base_gain      += stat_list.Speed.final        * this.BASE_RATIO
        this.sing_base_gain     += stat_list.Sing.final         * this.BASE_RATIO
        this.dance_base_gain    += stat_list.Dance.final        * this.BASE_RATIO
        this.charm_base_gain    += stat_list.Charm.final        * this.BASE_RATIO
        this.pres_base_gain     += stat_list.Presence.final     * this.BASE_RATIO

        this.fan_multi_gain     += Math.min(stat_list.Fans.final        * this.MULTI_RATIO, 0.01 * (CPs.current_completed_checkpoint + 1))
        this.moni_multi_gain    += Math.min(stat_list.Moni.final        * this.MULTI_RATIO, 0.01 * (CPs.current_completed_checkpoint + 1))
        this.sta_multi_gain     += Math.min(stat_list.Stamina.final     * this.MULTI_RATIO, 0.01 * (CPs.current_completed_checkpoint + 1))
        this.spd_multi_gain     += Math.min(stat_list.Speed.final       * this.MULTI_RATIO, 0.01 * (CPs.current_completed_checkpoint + 1))
        this.sing_multi_gain    += Math.min(stat_list.Sing.final        * this.MULTI_RATIO, 0.01 * (CPs.current_completed_checkpoint + 1))
        this.dance_multi_gain   += Math.min(stat_list.Dance.final       * this.MULTI_RATIO, 0.01 * (CPs.current_completed_checkpoint + 1))
        this.charm_multi_gain   += Math.min(stat_list.Charm.final       * this.MULTI_RATIO, 0.01 * (CPs.current_completed_checkpoint + 1))
        this.pres_multi_gain    += Math.min(stat_list.Presence.final    * this.MULTI_RATIO, 0.01 * (CPs.current_completed_checkpoint + 1))
    }

    private apply_gains_to_initial_stats() {
        stat_list.Fans.base         += this.fan_base_gain
        stat_list.Moni.base         += this.moni_base_gain
        stat_list.Stamina.base      += this.sta_base_gain
        stat_list.Speed.base        += this.spd_base_gain
        stat_list.Sing.base         += this.sing_base_gain
        stat_list.Dance.base        += this.dance_base_gain
        stat_list.Charm.base        += this.charm_base_gain
        stat_list.Presence.base     += this.pres_base_gain

        stat_list.Fans.multi        += this.fan_multi_gain
        stat_list.Moni.multi        += this.moni_multi_gain
        stat_list.Stamina.multi     += this.sta_multi_gain
        stat_list.Speed.multi       += this.sta_multi_gain
        stat_list.Sing.multi        += this.sing_multi_gain
        stat_list.Dance.multi       += this.dance_multi_gain
        stat_list.Charm.multi       += this.charm_multi_gain
        stat_list.Presence.multi    += this.pres_multi_gain
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
        RivalStatsM.reset()
        TodoCardM.reset()
        CPs.reset()
        Game_Progress.reset()
        ModalM.reset()
        this.increment_rebirth_count()
        this.apply_gains_to_initial_stats()
    }
}

function createRebirth() {
    return new RebirthStats()
}

export const Rebirth = createRebirth()