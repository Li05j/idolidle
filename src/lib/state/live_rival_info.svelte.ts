import { stat_list } from "$lib/state/stats.svelte";
import { CPs } from "$lib/state/checkpoints.svelte";
import { RivalStatsM } from "$lib/state/live_rival_stats.svelte";
import type { LiveBattleStats } from "$lib/types";

type StatKey = keyof typeof stat_list;
type RivalKey = keyof LiveBattleStats;

const COMBAT_PAIRS: [StatKey, RivalKey, string][] = [
    ["Fans",     "Fans",        "Fans"],
    ["Stamina",  "Max_Stamina", "Stamina"],
    ["Haste",    "Haste",       "Haste"],
    ["Sing",     "Charm",       "Sing"],
    ["Dance",    "Presence",    "Dance"],
    ["Charm",    "Sing",        "Charm"],
    ["Presence", "Dance",       "Presence"],
];

export type StatComparison = { label: string; clamped: number; color: string };

class RivalComparison {
    public comparisons: StatComparison[] = $derived.by(() => {
        const rival = RivalStatsM.preview(CPs.current_completed_checkpoint);
        return COMBAT_PAIRS.map(([playerKey, rivalKey, label]) => {
            const ratio = stat_list[playerKey].final / rival[rivalKey];
            const clamped = Math.max(0, Math.min(1, ratio / 2));
            return { label, clamped, color: `background-color: hsl(${clamped * 120}, 100%, 50%)` };
        });
    });

    public condition_text: string = $derived.by(() => {
        const avg = this.comparisons.reduce((sum, c) => sum + c.clamped, 0) / this.comparisons.length;
        if (avg >= 0.9) return "Looks like Rival doesn't stand a chance!";
        if (avg >= 0.6) return "You've got a solid shot at winning!";
        if (avg >= 0.4) return "It's anyone's game!";
        if (avg >= 0.25) return "Come on, you know you need just a little more training!";
        return "You're no match for Rival... are you even serious about being an Idol?";
    });
}

export const LiveInfo = new RivalComparison();
