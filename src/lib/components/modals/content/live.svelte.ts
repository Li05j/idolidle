import { LiveBattleM } from '$lib/state/live_battle_manager.svelte';
import { CPs } from '$lib/state/checkpoints.svelte';
import { ModalM } from '$lib/state/modal_manager.svelte';
import { history } from '$lib/state/history.svelte';
import { Rebirth } from '$lib/state/rebirth.svelte';
import { stat_list } from '$lib/state/stats.svelte';
import RebirthAlert from './rebirth_alert.svelte';

export class LiveVM {
    private onClose: () => void;

    total = $derived(LiveBattleM.display_your_fans + LiveBattleM.display_enemy_fans);
    leftPercent = $derived(LiveBattleM.display_your_fans / this.total * 100);
    rightPercent = $derived(LiveBattleM.display_enemy_fans / this.total * 100);
    is_won = $derived(LiveBattleM.did_player_win);

    constructor(onClose: () => void) {
        this.onClose = onClose;
    }

    startBattle() {
        LiveBattleM.start_live();
    }

    onContinue() {
        CPs.advanceToNextCheckpoint();
        Rebirth.update_max_completed_checkpoints(CPs.current_completed_checkpoint);

        if (LiveBattleM.final_fan_difference != null) {
            const fan_change = LiveBattleM.final_fan_difference;
            stat_list.Fans.add_to_final(fan_change);

            const fan_change_str = fan_change.toFixed(0);
            if (fan_change >= 0) {
                history.addHintLogs(`LIVE has successfully concluded. You gained ${fan_change_str} fans!`, true);
            } else {
                history.addHintLogs(`LIVE has concluded. You lost ${-fan_change_str} fans!`, true);
            }
        }

        LiveBattleM.reset();
        this.onClose();
    }

    onRebirth() {
        ModalM.open({ component: RebirthAlert, size: 'sm', closeable: true });
    }
}
