type CardKey = { loc: string; action?: string };
type CardHooks = {
    pause: () => void;
    key: CardKey;
    get_elapsed: () => number;
};

class TodoCardManager {
    private _active_card: number | null = $state(null);
    private _hooks = new Map<number, CardHooks>();
    private _card_counter = 0;

    get is_active() {
        return this._active_card !== null;
    }

    generateCardId() {
        return ++this._card_counter;
    }

    registerCard(card_id: number, hooks: CardHooks) {
        this._hooks.set(card_id, hooks);
    }

    unregisterCard(card_id: number) {
        this.deactivateCard(card_id);
        this._hooks.delete(card_id);
    }

    activateCard(card_id: number) {
        if (this._active_card && this._active_card !== card_id) {
            const h = this._hooks.get(this._active_card);
            if (h) h.pause();
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

        const h = this._hooks.get(this._active_card);
        if (h) h.pause();
        this._active_card = null;
    }

    /** Active card's identity + live elapsed for autosave stamping. Null if no card is active. */
    get active_snapshot(): { key: CardKey; elapsed: number } | null {
        if (this._active_card === null) return null;
        const h = this._hooks.get(this._active_card);
        if (!h) return null;
        return { key: h.key, elapsed: h.get_elapsed() };
    }

    reset() {
        this.deactivateCurrentActiveCard();
    }
}

export const TodoCardM = new TodoCardManager();
