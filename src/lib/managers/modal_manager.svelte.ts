type BigModals = 'default' | 'settings' | 'stats' | 'live' | 'rival_info'
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

    function reset() {
        _close_on_esc = true
        _modals = []
    }

    return {
        get modals() { return _modals },
        get close_on_esc() { return _close_on_esc }, set close_on_esc(b) { _close_on_esc = b },
        is_modal_open,
        set_modal_open,
        set_modal_close,
        handleKeydown,
        reset,
    }
}

export const ModalM = createModalType()