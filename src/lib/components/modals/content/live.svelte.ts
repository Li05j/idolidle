import { LiveBattleM } from '$lib/runtime/live_battle_manager.svelte';
import { ModalM } from '$lib/runtime/modal_manager.svelte';
import RebirthAlert from './rebirth_alert.svelte';

export class LiveVM {
    private onClose: () => void;

    phase: 'preview' | 'fighting' = $state('preview');
    effectivePhase = $derived(
        this.phase === 'fighting' && LiveBattleM.live_sim_complete ? 'done' : this.phase
    );

    total = $derived(LiveBattleM.display_your_fans + LiveBattleM.display_enemy_fans);
    leftPercent = $derived(LiveBattleM.display_your_fans / this.total * 100);
    rightPercent = $derived(LiveBattleM.display_enemy_fans / this.total * 100);
    is_won = $derived(LiveBattleM.did_player_win);

    constructor(onClose: () => void) {
        this.onClose = onClose;
    }

    startBattle() {
        this.phase = 'fighting';
        ModalM.set_top_closeable(false);
        LiveBattleM.start_live();
    }

    onContinue() {
        LiveBattleM.concludeBattle();
        LiveBattleM.reset();
        this.onClose();
    }

    onRebirth() {
        ModalM.open({ component: RebirthAlert, size: 'sm', closeable: true });
    }
}
