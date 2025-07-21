import { LiveBattleM } from "$lib/managers/live_battle_manager.svelte"
import { ModalM } from "$lib/managers/modal_manager.svelte"
import { TodoCardM } from "$lib/managers/todo_card_manager.svelte"
import { CPs } from "$lib/stores/checkpoints.svelte"
import { Game_Progress } from "$lib/stores/game_progress.svelte"
import { stat_list } from "$lib/stores/stats.svelte"

class RebirthStats {
    private _rebirth_count = $state(0)
    private _max_completed_checkpoints = $state(0)

    public fan_base_gain = $state(0)
    public moni_base_gain = $state(0)
    public sta_base_gain = $state(0)
    public sing_base_gain = $state(0)
    public dance_base_gain = $state(0)
    public charm_base_gain = $state(0)
    public pres_base_gain = $state(0)

    public fan_multi_gain = $state(0)
    public moni_multi_gain = $state(0)
    public sta_multi_gain = $state(0)
    public sing_multi_gain = $state(0)
    public dance_multi_gain = $state(0)
    public charm_multi_gain = $state(0)
    public pres_multi_gain = $state(0)

    private inherit_stats() {
        this.fan_base_gain += stat_list.fans.final * 0.01
        this.moni_base_gain += stat_list.moni.final * 0.01
        this.sta_base_gain += stat_list.sta.final * 0.01
        this.sing_base_gain += stat_list.sing.final * 0.01
        this.dance_base_gain += stat_list.dance.final * 0.01
        this.charm_base_gain += stat_list.charm.final * 0.01
        this.pres_base_gain += stat_list.pres.final * 0.01

        this.fan_multi_gain += 2
        // this.fan_multi_gain += Math.min(stat_list.fans.final / 10000, 0.01 * (CPs.current_completed_checkpoint + 1))
        this.moni_multi_gain += Math.min(stat_list.moni.final / 10000, 0.01 * (CPs.current_completed_checkpoint + 1))
        this.sta_multi_gain += Math.min(stat_list.sta.final / 10000, 0.01 * (CPs.current_completed_checkpoint + 1))
        this.sing_multi_gain += Math.min(stat_list.sing.final / 10000, 0.01 * (CPs.current_completed_checkpoint + 1))
        this.dance_multi_gain += Math.min(stat_list.dance.final / 10000, 0.01 * (CPs.current_completed_checkpoint + 1))
        this.charm_multi_gain += Math.min(stat_list.charm.final / 10000, 0.01 * (CPs.current_completed_checkpoint + 1))
        this.pres_multi_gain += Math.min(stat_list.pres.final / 10000, 0.01 * (CPs.current_completed_checkpoint + 1))
    }

    private apply_gains_to_initial_stats() {
        stat_list.fans.base += this.fan_base_gain
        stat_list.moni.base += this.moni_base_gain
        stat_list.sta.base += this.sta_base_gain
        stat_list.sing.base += this.sing_base_gain
        stat_list.dance.base += this.dance_base_gain
        stat_list.charm.base += this.charm_base_gain
        stat_list.pres.base += this.pres_base_gain

        stat_list.fans.multi += this.fan_multi_gain
        stat_list.moni.multi += this.moni_multi_gain
        stat_list.sta.multi += this.sta_multi_gain
        stat_list.sing.multi += this.sing_multi_gain
        stat_list.dance.multi += this.dance_multi_gain
        stat_list.charm.multi += this.charm_multi_gain
        stat_list.pres.multi += this.pres_multi_gain
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
        LiveBattleM.reset()
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