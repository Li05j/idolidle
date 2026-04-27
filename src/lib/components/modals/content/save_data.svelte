<script lang="ts">
    import GenericButton from "$lib/components/shared/generic_button.svelte";
    import { SaveDataVM } from "./save_data.svelte.ts";

    const vm = new SaveDataVM();
</script>

<div class="flex flex-col gap-6 max-w-md">
    <div class="flex flex-col gap-2">
        <h3 class="text-base font-semibold text-[var(--text-primary)]">Export</h3>
        <p class="text-xs text-[var(--text-muted)]">
            Generates a portable text blob of your current save. Keep it somewhere safe.
        </p>
        <textarea
            class="w-full h-24 px-3 py-2 rounded-md bg-[var(--surface-inset)] text-[var(--text-primary)] text-xs font-mono border border-[var(--progress-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--progress-from)] resize-none"
            readonly
            placeholder="Click Generate to produce your save blob."
            value={vm.export_text}
        ></textarea>
        <div class="flex gap-2">
            <GenericButton
                name="Generate"
                onclick={() => vm.generate_export()}
                variant="secondary"
                class="px-4 py-2 text-xs"
            />
            <GenericButton
                name={vm.copied ? "Copied!" : "Copy"}
                onclick={() => vm.copy_export()}
                disabled={!vm.export_text}
                class="px-4 py-2 text-xs"
            />
        </div>
    </div>

    <div class="flex flex-col gap-2 pt-4 border-t border-[var(--progress-bg)]">
        <h3 class="text-base font-semibold text-[var(--text-primary)]">Import</h3>
        <p class="text-xs text-[var(--text-muted)]">
            Pastes overwrite your current save and reload the page. Preset and version must match.
        </p>
        <textarea
            class="w-full h-24 px-3 py-2 rounded-md bg-[var(--surface-inset)] text-[var(--text-primary)] text-xs font-mono border border-[var(--progress-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--progress-from)] resize-none"
            placeholder="Paste a save blob here."
            bind:value={vm.import_text}
        ></textarea>
        {#if vm.import_error}
            <p class="text-xs text-red-400">{vm.import_error}</p>
        {/if}
        <GenericButton
            name="Import"
            onclick={() => vm.apply_import()}
            disabled={!vm.import_text.trim()}
            variant="secondary"
            class="px-4 py-2 text-xs self-start"
        />
    </div>
</div>
