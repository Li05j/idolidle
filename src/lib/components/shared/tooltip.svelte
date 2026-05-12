<script lang="ts">
    import { onMount, type Snippet } from 'svelte';

    let { text, children }: { text: string; children: Snippet } = $props();

    let trigger: HTMLElement | undefined = $state();
    let tip: HTMLDivElement | undefined = $state();
    let show = $state(false);
    let x = $state(0);
    let y = $state(0);

    function update_pos() {
        if (!trigger) return;
        const r = trigger.getBoundingClientRect();
        x = r.left + r.width / 2;
        y = r.top;
    }

    onMount(() => {
        if (tip) document.body.appendChild(tip);
        return () => tip?.remove();
    });
</script>

<span
    bind:this={trigger}
    class="inline-flex align-middle"
    onmouseenter={() => { update_pos(); show = true; }}
    onmouseleave={() => show = false}
>
    {@render children()}
</span>

<div
    bind:this={tip}
    class="pointer-events-none fixed z-[9999] px-2 py-1 rounded-md text-xs leading-snug whitespace-pre-line bg-[var(--text-primary)] text-white shadow-lg max-w-xs w-max transition-opacity duration-150"
    style="left: {x}px; top: {y}px; transform: translate(-50%, calc(-100% - 6px)); opacity: {text && show ? 1 : 0};"
>
    {text}
</div>
