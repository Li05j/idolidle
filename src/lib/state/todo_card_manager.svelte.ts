class TodoCardManager {
    private _active_card: number | null = $state(null);
    private _pause_card_callbacks = new Map<number, () => void>();
    private _card_counter = 0;

    get is_active() {
        return this._active_card !== null;
    }

    generateCardId() {
        return ++this._card_counter;
    }

    registerCard(card_id: number, pause_card_callback: () => void) {
        this._pause_card_callbacks.set(card_id, pause_card_callback);
    }

    unregisterCard(card_id: number) {
        this.deactivateCard(card_id);
        this._pause_card_callbacks.delete(card_id);
    }

    activateCard(card_id: number) {
        // Stop current active card
        if (this._active_card && this._active_card !== card_id) {
            const f = this._pause_card_callbacks.get(this._active_card);
            if (f) f();
        }

        this._active_card = card_id;
    }

    deactivateCard(card_id: number) {
        if (this._active_card === card_id) {
            this._active_card = null;
        }
    }

    deactivateCurrentActiveCard() {
        if (this._active_card === null) {
            return;
        }

        const f = this._pause_card_callbacks.get(this._active_card);
        if (f) f();
        this._active_card = null;
    }

    reset() {
        this.deactivateCurrentActiveCard();
        this._pause_card_callbacks.clear();
    }
}

export const TodoCardM = new TodoCardManager();
