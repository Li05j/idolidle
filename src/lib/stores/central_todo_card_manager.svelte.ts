import { get, writable, type Writable } from 'svelte/store';

class TodoCardManager {
    private _active: boolean = $state(false)

    private _active_card: Writable<number | null> = writable(null);
    private _pause_card_callbacks = new Map<number, () => void>();
    private _card_counter = 0;

    // isActiveCardNull(): boolean {
    //     return get(this._active_card) === null;
    // }

    get active() {
        return this._active;
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
        this._active = true;
    }

    deactivateCard(card_id: number) {
        this._active_card.update(current => current === card_id ? null : current);
        this._active = false
    }
}

export const TodoCardM = new TodoCardManager();