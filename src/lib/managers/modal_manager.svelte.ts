type BigModals = 'default' | 'settings' | 'stats' | 'live'
type SmallModals = 'rebirth_alert'

export type ModalType = BigModals | SmallModals

function createModalType() {
    let _modals: ModalType[] = $state([])
    let _close_on_esc: boolean = $state(true)

    function is_modal_open(t: ModalType) {
        return _modals.includes(t)
    }

    function set_modal_open(t: ModalType) {
        if (is_modal_open(t)) return

        _modals.push(t);
    }

    function set_modal_close() {
        const m = _modals.pop();
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

export const ModalM = createModalType()