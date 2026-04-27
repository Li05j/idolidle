import { Save } from "$lib/state/save.svelte";

export class SaveDataVM {
	export_text = $state('');
	import_text = $state('');
	import_error = $state<string | null>(null);
	copied = $state(false);

	private _copy_timer: ReturnType<typeof setTimeout> | null = null;

	async generate_export() {
		this.export_text = await Save.export_blob();
		this.copied = false;
	}

	async copy_export() {
		if (!this.export_text) await this.generate_export();
		try {
			await navigator.clipboard.writeText(this.export_text);
			this.copied = true;
			if (this._copy_timer) clearTimeout(this._copy_timer);
			this._copy_timer = setTimeout(() => { this.copied = false; }, 1500);
		} catch (e) {
			console.error('clipboard write failed', e);
		}
	}

	async apply_import() {
		this.import_error = null;
		const trimmed = this.import_text.trim();
		if (!trimmed) {
			this.import_error = 'Paste a save blob first.';
			return;
		}
		if (!window.confirm('Import will overwrite your current save and reload. Continue?')) return;
		const err = await Save.import_blob(trimmed);
		if (err) this.import_error = err;
	}
}
