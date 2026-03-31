import type { Component } from 'svelte';

export type ModalSize = 'sm' | 'lg' | 'worker';

export type ModalConfig = {
    component: Component<any>;
    props?: Record<string, any>;
    size: ModalSize;
    closeable: boolean;
};

function createModalManager() {
    let _stack: ModalConfig[] = $state([]);
    let _close_on_esc: boolean = $state(true);

    function open(config: ModalConfig) {
        _stack.push(config);
        if (!config.closeable) {
            _close_on_esc = false;
        }
    }

    function close() {
        const removed = _stack.pop();
        // Restore esc behavior based on remaining stack
        if (removed && !removed.closeable) {
            _close_on_esc = _stack.every(m => m.closeable);
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (_close_on_esc && e.key === 'Escape' && _stack.length > 0) {
            close();
        }
    }

    function reset() {
        _close_on_esc = true;
        _stack = [];
    }

    return {
        get stack() { return _stack; },
        open,
        close,
        handleKeydown,
        reset,
    };
}

export const ModalM = createModalManager();
