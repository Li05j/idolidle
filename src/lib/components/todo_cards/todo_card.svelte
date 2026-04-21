<script lang="ts">
    import { onMount } from 'svelte';
    import { msToSecF, parseText, tooltipString } from "$lib/utils/utils";
    import { TodoCardVM } from "./todo_card.svelte.ts";
    import { Mastery } from "$lib/state/mastery.svelte";

    let { locationName, actionName, repeat_val, is_collapse }:
        { locationName: string, actionName?: string, repeat_val?: string, is_collapse?: boolean } = $props();

    const vm = new TodoCardVM(locationName, actionName);

    $effect(() => {
        if (repeat_val) vm.setRepeat(repeat_val);
    });

    onMount(() => {
        vm.init();
        return () => vm.destroy();
    });
</script>

<div
    class="{vm.bg_color} {vm.border} transition-all duration-200 pl-5 pr-5 pt-4 rounded-[var(--border-radius-card)] shadow-sm relative overflow-hidden mb-3 hover:shadow-md hover:scale-[1.01] {(vm.disabled && !vm.timer.is_active) ? 'cursor-not-allowed opacity-60 saturate-50' : 'cursor-pointer'} {is_collapse ? 'h-28' : 'h-44'}"
    onclick={() => vm.toggle(repeat_val)}
    onmouseenter={() => vm.hovered = true}
    onmouseleave={() => vm.hovered = false}
>
    {#if !vm.is_location}
        <div class="absolute bottom-3 right-4 flex pointer-events-none z-5">
            <span class="text-6xl font-extrabold text-[var(--text-primary)] opacity-[0.07] transform rotate-12 select-none">
                {#if vm.has_uses}
                    ONCE
                {:else}
                    x{vm.timer.is_active ? vm.loop : vm.display_loop}
                {/if}
            </span>
        </div>
    {/if}

    <div class="relative h-full">
        <div class="flex justify-between items-center mb-3">
            <div class="text-sm font-bold text-[var(--text-primary)]">{vm.name}</div>
            <div class="text-[var(--text-muted)] text-xs">{msToSecF(vm.timer.elapsed)}/{msToSecF(vm.todo_actual_duration)}s</div>
        </div>
        <div class="w-full bg-[var(--progress-bg)] rounded-full h-3 mb-3 overflow-hidden">
            <div
                class="h-3 w-full rounded-full will-change-transform"
                style="transform: scaleX({vm.timer.progress_percent / 100}); transform-origin: left; background: linear-gradient(90deg, var(--progress-from), var(--progress-to));"
            ></div>
        </div>

        {#if !is_collapse}
            <div class="relative text-xs h-full">
                <div class="transition-opacity duration-300 text-[var(--text-muted)]" style="opacity: {vm.hovered ? 0 : 1};">
                    <i>{@html parseText(vm.desc)}</i>
                </div>
                <div class="absolute top-0 left-0 rounded-lg transition-opacity duration-300 h-2/5 w-full text-[var(--text-primary)]" style="opacity: {vm.hovered ? 1 : 0};">
                    <p>{@html parseText(tooltipString(vm.def, vm.disabled, vm.actionDef?.kind === 'training' ? Mastery.completions(vm.mastery_id) : undefined))}</p>
                </div>
            </div>
        {/if}
    </div>

    <div class="absolute bottom-3 right-4 text-xs text-[var(--text-muted)] pt-2 text-right"> {vm.rewardText} </div>
</div>