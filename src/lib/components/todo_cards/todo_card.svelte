<script lang="ts">
    import { onMount } from 'svelte';
    import { msToSecF } from "$lib/utils/utils";
    import { TodoCardVM } from "./todo_card.svelte.ts";
    import Tooltip from "$lib/components/shared/tooltip.svelte";

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
    class="{vm.bg_color} {vm.border} transition-all duration-200 px-5 pt-3 pb-2 rounded-[var(--border-radius-card)] shadow-sm relative overflow-hidden mb-3 hover:shadow-md hover:scale-[1.01] {(vm.disabled && !vm.timer.is_active) ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'} {is_collapse ? 'h-22' : 'h-45'}"
    onclick={() => vm.toggle(repeat_val)}
    onmouseenter={() => vm.hovered = true}
    onmouseleave={() => vm.hovered = false}
>
    {#if !vm.is_location}
        <div class="absolute bottom-3 right-4 flex pointer-events-none z-0">
            <span class="text-6xl font-extrabold text-[var(--text-primary)] opacity-[0.07] transform rotate-12 select-none">
                {#if vm.has_uses}
                    ONCE
                {:else}
                    x{vm.timer.is_active ? vm.loop : vm.display_loop}
                {/if}
            </span>
        </div>
    {/if}

    <div class="relative h-full flex flex-col gap-1.5">
        <!-- Header: name + timer -->
        <div class="flex justify-between items-center">
            <div class="text-sm font-bold text-[var(--text-primary)] truncate pr-2">{vm.name}</div>
            <div class="text-[var(--text-muted)] text-xs whitespace-nowrap">
                {msToSecF(vm.timer.elapsed)}/{msToSecF(vm.todo_actual_duration)}s
            </div>
        </div>

        <!-- Progress bar -->
        <div class="w-full bg-[var(--progress-bg)] rounded-full h-3 overflow-hidden">
            <div
                class="h-3 w-full rounded-full will-change-transform {vm.timer.is_active ? 'progress-shimmer' : ''}"
                style="transform: scaleX({vm.todo_actual_duration > 0 ? Math.min(vm.timer.elapsed / vm.todo_actual_duration, 1) : 0}); transform-origin: left; background: linear-gradient(90deg, var(--progress-from), var(--progress-to), var(--progress-from));"
            ></div>
        </div>

        {#if !is_collapse}
            <!-- Chip row: prereq, mastery, depends, on-complete bonus, hint -->
            <div class="flex flex-wrap gap-1 items-center text-[10px] leading-tight">
                {#if vm.prereq}
                    <span
                        class="px-1.5 py-0.5 rounded-full font-semibold"
                        style="color: {vm.prereq.met ? 'var(--text-muted)' : 'var(--chip-locked-fg)'}; background: {vm.prereq.met ? 'transparent' : 'var(--chip-locked-bg)'};"
                    >
                        {vm.prereq.met ? '' : '🔒 '}{vm.prereq.text}
                    </span>
                {/if}

                {#if vm.mastery_info}
                    <span
                        class="px-1.5 py-0.5 rounded-full font-semibold"
                        style="color: var(--chip-mastery-fg); background: var(--chip-mastery-bg);"
                    >
                        Mastery · {vm.mastery_info.count} −{vm.mastery_info.pct}%
                    </span>
                {/if}

                {#each vm.depends as d (d.target)}
                    <Tooltip text={`${d.sources.join(', ')} scale ${d.target}`}>
                        <span class="px-1.5 py-0.5 rounded-full font-semibold text-[var(--text-muted)] border border-[var(--card-border-inactive)]">
                            {d.sources.join('+')}➤{d.target}
                        </span>
                    </Tooltip>
                {/each}

                {#if vm.on_complete_desc}
                    <Tooltip text={vm.on_complete_desc}>
                        <span
                            class="px-1.5 py-0.5 rounded-full font-semibold truncate max-w-[12rem]"
                            style="color: var(--chip-bonus-fg); background: var(--chip-bonus-bg);"
                        >
                            ⭐ {vm.on_complete_desc}
                        </span>
                    </Tooltip>
                {/if}

                {#if vm.hint}
                    <Tooltip text={vm.hint}>
                        <span class="px-1.5 py-0.5 rounded-full font-semibold text-[var(--text-muted)] border border-[var(--card-border-inactive)]">
                            💡 Hint - hover me!
                        </span>
                    </Tooltip>
                {/if}
            </div>

            <!-- Description (full, italic, muted) -->
            <div class="text-[11px] italic text-[var(--text-muted)] leading-snug">
                {vm.desc}
            </div>
        {/if}

        <!-- Cost / reward strip (visible in both modes) -->
        <div class="mt-auto flex justify-between items-end gap-2 text-[11px] relative z-10">
            <div class="flex flex-wrap gap-1">
                {#each vm.cost_chips as c}
                    <span
                        class="px-1.5 py-0.5 rounded-md font-semibold"
                        style="color: var(--chip-cost-fg); background: var(--chip-cost-bg);"
                    >
                        −{c.amount} {c.stat}
                    </span>
                {/each}
            </div>
            <div class="flex flex-wrap gap-1 justify-end">
                {#each vm.reward_chips as r}
                    <span
                        class="px-1.5 py-0.5 rounded-md font-semibold"
                        style="color: var(--chip-reward-fg); background: var(--chip-reward-bg);"
                    >
                        {r.sign}{r.amount} {r.stat}{r.suffix ? ' ' + r.suffix : ''}{r.scaled ? '*' : ''}
                    </span>
                {/each}
            </div>
        </div>
    </div>
</div>
