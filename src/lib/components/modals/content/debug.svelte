<script lang="ts">
    import GenericButton from "$lib/components/shared/generic_button.svelte";
    import { DebugVM } from "./debug.svelte.ts";

    const vm = new DebugVM();
</script>

<div class="flex flex-col gap-6 max-w-md">
    <div class="flex flex-col gap-2">
        <h3 class="text-base font-semibold text-[var(--text-primary)]">CFG Preset</h3>
        <p class="text-xs text-[var(--text-muted)]">
            Switching preset wipes all progress and reloads. Current: <span class="font-mono">{vm.current}</span>
        </p>
        <div class="flex items-center gap-3">
            <select
                class="flex-1 px-3 py-2 rounded-md bg-[var(--surface-inset)] text-[var(--text-primary)] text-sm border border-[var(--progress-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--progress-from)]"
                bind:value={vm.staged}
            >
                {#each vm.options as opt}
                    <option value={opt}>{opt}{opt === vm.current ? ' (current)' : ''}</option>
                {/each}
            </select>
            <GenericButton
                name="Apply"
                onclick={() => vm.apply()}
                disabled={!vm.can_apply}
                class="px-4 py-2 text-xs"
            />
        </div>
    </div>

    <div class="flex flex-col gap-2 pt-4 border-t border-[var(--progress-bg)]">
        <h3 class="text-base font-semibold text-[var(--text-primary)]">Skip to LIVE</h3>
        <p class="text-xs text-[var(--text-muted)]">Fast-forwards the current checkpoint timer so the next tick triggers the LIVE battle.</p>
        <GenericButton
            name="Skip to LIVE"
            onclick={() => vm.skip_to_live()}
            disabled={!vm.can_skip_to_live}
            variant="secondary"
            class="px-4 py-2 text-xs self-start"
        />
    </div>

    <div class="flex flex-col gap-2 pt-4 border-t border-[var(--progress-bg)]">
        <h3 class="text-base font-semibold text-[var(--text-primary)]">Reroll Rival</h3>
        <p class="text-xs text-[var(--text-muted)]">Generates a new persona and equipment loadout for every rival.</p>
        <GenericButton
            name="Reroll Rival"
            onclick={() => vm.reroll_rival()}
            variant="secondary"
            class="px-4 py-2 text-xs self-start"
        />
    </div>

    <div class="flex flex-col gap-2 pt-4 border-t border-[var(--progress-bg)]">
        <h3 class="text-base font-semibold text-[var(--text-primary)]">Restart</h3>
        <p class="text-xs text-[var(--text-muted)]">Wipes all progress and reloads on the current preset.</p>
        <GenericButton
            name="Restart Game"
            onclick={() => vm.restart()}
            variant="secondary"
            class="px-4 py-2 text-xs self-start"
        />
    </div>
</div>
