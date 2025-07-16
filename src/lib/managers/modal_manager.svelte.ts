type Level1Modal = 'default' | 'settings' | 'stats'
type Level2Modal = 'live'
export type ModalType = Level1Modal | Level2Modal

function createModalType() {
    let _is_level_1_modal_open = $state(false)
    let _modal_type: ModalType = $state('default')

    function is_modal_open() {
        return _is_level_1_modal_open
    }

    function set_modal_open(b: boolean) {
        _is_level_1_modal_open = b
    }

    return {
        get type() { return _modal_type },
        set type(m) { _modal_type = m },
        is_modal_open,
        set_modal_open,
    }
}

export const modal = createModalType()