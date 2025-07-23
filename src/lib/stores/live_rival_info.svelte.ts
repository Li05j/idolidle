import { stat_list } from "$lib/stores/stats.svelte";
import { CPs } from "$lib/stores/checkpoints.svelte";
import { RivalStatsM } from "$lib/stores/live_rival_stats.svelte";

const HUE_CONST = 120;

class PlayerRivalCompare {
    private fan_ratio = $derived(stat_list.fans.final / RivalStatsM.get_stats[CPs.current_completed_checkpoint].Fans)
    public fan_clamped = $derived(Math.max(0, Math.min(1, this.fan_ratio - 0.5))) // within [0,1]
    public fan_color = $derived(`background-color: hsl(${this.fan_clamped * HUE_CONST}, 100%, 50%)`)
    
    private sta_ratio = $derived(stat_list.sta.final / RivalStatsM.get_stats[CPs.current_completed_checkpoint].Max_Stamina)
    public sta_clamped = $derived(Math.max(0, Math.min(1, this.sta_ratio - 0.5))) // within [0,1]
    public sta_color = $derived(`background-color: hsl(${this.sta_clamped * HUE_CONST}, 100%, 50%)`)
    
    private sing_ratio = $derived(stat_list.sing.final / RivalStatsM.get_stats[CPs.current_completed_checkpoint].Charm)
    public sing_clamped = $derived(Math.max(0, Math.min(1, this.sing_ratio - 0.5))) // within [0,1]
    public sing_color = $derived(`background-color: hsl(${this.sing_clamped * HUE_CONST}, 100%, 50%)`)
    
    private dance_ratio = $derived(stat_list.dance.final / RivalStatsM.get_stats[CPs.current_completed_checkpoint].Presence)
    public dance_clamped = $derived(Math.max(0, Math.min(1, this.dance_ratio - 0.5))) // within [0,1]
    public dance_color = $derived(`background-color: hsl(${this.dance_clamped * HUE_CONST}, 100%, 50%)`)
    
    private charm_ratio = $derived(stat_list.charm.final / RivalStatsM.get_stats[CPs.current_completed_checkpoint].Sing)
    public charm_clamped = $derived(Math.max(0, Math.min(1, this.charm_ratio - 0.5))) // within [0,1]
    public charm_color = $derived(`background-color: hsl(${this.charm_clamped * HUE_CONST}, 100%, 50%)`)
    
    private pres_ratio = $derived(stat_list.pres.final / RivalStatsM.get_stats[CPs.current_completed_checkpoint].Dance)
    public pres_clamped = $derived(Math.max(0, Math.min(1, this.pres_ratio - 0.5))) // within [0,1]
    public pres_color = $derived(`background-color: hsl(${this.pres_clamped * HUE_CONST}, 100%, 50%)`)
    
    public condition_text = $state("You're no match for Rival... are you even serious about being an Idol?")
}

export const LiveInfo = new PlayerRivalCompare();