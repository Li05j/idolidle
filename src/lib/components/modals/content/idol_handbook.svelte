<script lang="ts">
	import { IdolHandbookVM } from "./idol_handbook.svelte.ts";

	const vm = new IdolHandbookVM();
</script>

<div class="flex max-h-[72vh] flex-col gap-6 overflow-y-auto pr-2">
	<div class="rounded-2xl bg-[var(--surface-inset)] px-6 py-5 shadow-sm">
		<!-- <div class="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[var(--rose)]">
			Player Reference
		</div> -->
		<h2 class="mt-1 text-2xl font-bold text-[var(--text-primary)]">Idol Handbook</h2>
		<p class="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-muted)]">
			Anything and everything you probably want to know about being the best Idol no one ever was!
		</p>
	</div>

	<section class="flex flex-col gap-3">
		<div>
			<h3 class="text-base font-semibold text-[var(--text-primary)]">Stat Terminology</h3>
			<!-- <p class="text-xs text-[var(--text-muted)]">The stats screen is mostly base, multi, and final values.</p> -->
		</div>

		<div class="grid grid-cols-2 gap-3">
			{#each vm.terms as term}
				<div class="rounded-xl bg-[var(--surface-inset)] px-4 py-3">
					<div class="text-sm font-bold text-[var(--text-primary)]">{term.name}</div>
					<p class="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">{term.body}</p>
				</div>
			{/each}
		</div>
	</section>

	{#each vm.sections as section}
		<section class="flex flex-col gap-3">
			<div>
				<h3 class="text-base font-semibold text-[var(--text-primary)]">{section.title}</h3>
				{#if section.subtitle}
					<p class="text-xs text-[var(--text-muted)]">{section.subtitle}</p>
				{/if}
			</div>

			<div class="flex flex-col gap-3 rounded-2xl bg-[var(--surface-inset)] px-5 py-4">
				{#each section.items as item}
					<div class="flex gap-3 text-sm leading-relaxed text-[var(--text-primary)]">
						<span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--progress-from)]"></span>
						<span>{item}</span>
					</div>
				{/each}
			</div>
		</section>
	{/each}
</div>
