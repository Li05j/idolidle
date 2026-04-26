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
    function open(config: ModalConfig) {
        _stack.push(config);
    }

    function close() {
        _stack.pop();
    }

    function set_top_closeable(value: boolean) {
        if (_stack.length === 0) return;
        _stack[_stack.length - 1].closeable = value;
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === 'Escape' && _stack.length > 0) {
            const top = _stack[_stack.length - 1];
            if (top.closeable) close();
        }
    }

    function reset() {
        _stack = [];
    }

    return {
        get stack() { return _stack; },
        open,
        close,
        set_top_closeable,
        handleKeydown,
        reset,
    };
}

export const ModalM = createModalManager();
