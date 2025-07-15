export type ModalType = 'default' | 'settings' | 'stats'

function createModalType() {
    let _modal_type: ModalType = $state('default')
    return {
        get type() { return _modal_type },
        set type(m) { _modal_type = m },
    }
}

export const modal = createModalType()