<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { msToSecF, parseText, tooltip_string } from "$lib/utils/utils";
    import type { TodoBase } from "$lib/data/todo_type";
    import { ActionTodoCardVM } from "./action_todo_card.svelte.ts";

    let { todo, repeat_val, is_collapse }: { todo: TodoBase, repeat_val: string, is_collapse: boolean } = $props();

    const vm = new ActionTodoCardVM(todo);

    $effect(() => {
        if (repeat_val) vm.updateLoop(repeat_val);
    });

    onMount(() => vm.init());
    onDestroy(() => vm.destroy());
</script>

<div
    class="{vm.bg_color} {vm.border} transition-all duration-300 pl-6 pr-6 pt-4 rounded-lg shadow-md relative overflow-hidden mb-4 {(vm.disabled && !vm.timer.is_active) ? 'cursor-not-allowed' : 'cursor-pointer'} {is_collapse ? 'h-32' : 'h-48'}"
    onclick={() => vm.toggle(repeat_val)}
    onmouseenter={() => vm.hovered = true}
    onmouseleave={() => vm.hovered = false}
>
    <!-- Watermark -->
    <div class="absolute bottom-4 right-4 flex pointer-events-none z-5">
        <span class="text-7xl font-bold text-teal-800 opacity-15 transform rotate-12 select-none">
            {#if todo.one_off}
                ONCE
            {:else}
                x{vm.loop}
            {/if}
        </span>
    </div>

    <!-- Watermark Line -->
    {#if (vm.disabled && !vm.timer.is_active)}
        <div class="absolute inset-0 pointer-events-none z-10">
            <div class="w-full h-full">
                <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <line x1="0" y1="0" x2="100%" y2="100%" stroke="red" stroke-opacity="0.2" stroke-width="4" />
                </svg>
            </div>
        </div>
    {/if}

    <div class="relative h-full">
        <div class="flex justify-between items-center mb-4">
            <div class="text-base font-medium">{todo.name}</div>
            <div class="text-gray-600 text-sm">{msToSecF(vm.timer.elapsed)}/{msToSecF(vm.todo_actual_duration)}s</div>
        </div>
        <div class="w-full bg-[var(--progress-bg)] rounded-full h-4 mb-4">
            <div class="h-4 bg-[var(--progress-fill)] rounded transition-all duration-100" style="width: {vm.timer.progress_percent}%"></div>
        </div>

        <!-- Hover -->
        {#if !is_collapse}
            <div class="relative text-xs h-full">
                <div class="transition-opacity duration-300 text-gray-700" style="opacity: {vm.hovered ? 0 : 1};">
                    <i>{@html parseText(todo.desc)}</i>
                </div>
                <div class="absolute top-0 left-0 rounded transition-opacity duration-300 h-2/5 w-full" style="opacity: {vm.hovered ? 1 : 0};">
                    <p>{@html parseText(tooltip_string(todo.tooltip, vm.disabled))}</p>
                </div>
            </div>
        {/if}
    </div>

    <div class="absolute bottom-4 right-4 text-xs pt-2 text-right"> {todo.get_spendings_rewards_string()} </div>
</div>
