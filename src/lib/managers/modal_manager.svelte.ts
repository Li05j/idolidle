type Level1Modal = 'default' | 'settings' | 'stats'
type Level2Modal = 'live'
export type ModalType = Level1Modal | Level2Modal

const MODAL_LEVELS = {
    default: 1,
    settings: 1,
    stats: 1,
    live: 2,
} as const

function createModalType() {
    let _modals: ModalType[] = $state([])

    let _level_1_open = $state(false)
    let _level_2_open = $state(false)

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

    function set_modal_close(t: ModalType) {
        const level = MODAL_LEVELS[t]
        level_setters[level](false)

        _modals.splice(modal.modals.indexOf(t), 1);
    }

    return {
        get modals() { return _modals },
        is_modal_open,
        set_modal_open,
        set_modal_close,
    }
}

export const modal = createModalType()