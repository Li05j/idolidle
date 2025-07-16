import { CPs } from '$lib/stores/checkpoints.svelte';

type Level1Modal = 'default' | 'settings' | 'stats'
type Level2Modal = 'live'
export type ModalType = Level1Modal | Level2Modal

const MODAL_LEVELS = {
    'default': 1,
    'settings': 1,
    'stats': 1,
    'live': 2,
} as const

function createModalType() {
    let _modals: ModalType[] = $state([])

    let _level_1_open = $state(false)
    let _level_2_open = $state(false)

    let _close_on_esc = $state(true)

    const level_states = {
        1: () => _level_1_open,
        2: () => _level_2_open,
    }

    const level_setters = {
        1: (b: boolean) => _level_1_open = b,
        2: (b: boolean) => _level_2_open = b,
    }

    function is_modal_open(t: ModalType) {
        const level = MODAL_LEVELS[t]
        return level_states[level]()
    }

    function set_modal_open(t: ModalType) {
        if (is_modal_open(t)) return

        const level = MODAL_LEVELS[t]
        level_setters[level](true)

        _modals.push(t);
    }

    function set_modal_close() {
        const m = _modals.pop();
        if (m) {
            level_setters[MODAL_LEVELS[m]](false)
            if (m === 'live') {
                CPs.advanceToNextCheckpoint()
            }
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (_close_on_esc && e.key === 'Escape') {
            set_modal_close()
        }
    }

    return {
        get modals() { return _modals },
        get close_on_esc() { return _close_on_esc }, set close_on_esc(b) { _close_on_esc = b },
        is_modal_open,
        set_modal_open,
        set_modal_close,
        handleKeydown,
    }
}

export const modal = createModalType()