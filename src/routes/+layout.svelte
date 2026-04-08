<script lang="ts">
	import '../app.postcss';
	import './layout.css';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="flex min-h-screen bg-[var(--surface-base)]">
	<div class="flex-1">
		{@render children()}
	</div>
</div>