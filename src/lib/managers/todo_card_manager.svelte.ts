import { get, writable, type Writable } from 'svelte/store';

class TodoCardManager {
    private _is_active: boolean = $state(false)

    private _active_card: Writable<number | null> = writable(null);
    private _pause_card_callbacks = new Map<number, () => void>();
    private _card_counter = 0;

    // isActiveCardNull(): boolean {
    //     return get(this._active_card) === null;
    // }

    get is_active() {
        return this._is_active;
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
        this._active_card.subscribe(current => {
            if (current && current !== card_id) {
                const f = this._pause_card_callbacks.get(current);
                if (f) f();
            }
        })();
    
        // Set new active card
        this._active_card.set(card_id);
        this._is_active = true;
    }

    deactivateCard(card_id: number) {
        this._active_card.update(current => current === card_id ? null : current);
        this._is_active = false;
    }

    deactivateCurrentActiveCard() {
        const card_id = get(this._active_card)
        if (card_id === null) {
            return;
        }
        
        const f = this._pause_card_callbacks.get(card_id);
        if (f) f();
        this._active_card.set(null);
        this._is_active = false;
    }

    reset() {
        this.deactivateCurrentActiveCard();
        this._pause_card_callbacks.clear();
    }
}

export const TodoCardM = new TodoCardManager();