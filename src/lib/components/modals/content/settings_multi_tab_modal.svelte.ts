import { DEV } from "$lib/config";

export type SettingsTabId = 'handbook' | 'debug';

type SettingsTab = {
	id: SettingsTabId;
	label: string;
};

export class SettingsMultiTabModalVM {
	readonly tabs: SettingsTab[] = [
		{ id: 'handbook', label: 'Idol Handbook' },
		...(DEV ? [{ id: 'debug', label: 'Debug' } satisfies SettingsTab] : []),
	];

	active = $state<SettingsTabId>(this.tabs[0].id);

	select_tab(tab: SettingsTab) {
		this.active = tab.id;
	}
}
