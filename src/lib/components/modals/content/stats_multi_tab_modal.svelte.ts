export type StatsTabId = 'equipment' | 'dreams' | 'stats';

type StatsTab = {
	id: StatsTabId;
	label: string;
};

export class StatsMultiTabModalVM {
	readonly tabs: StatsTab[] = [
		{ id: 'equipment', label: 'Equipment' },
		{ id: 'dreams', label: 'Dreams' },
		{ id: 'stats', label: 'Stats' },
	];

	active = $state<StatsTabId>('equipment');

	select_tab(tab: StatsTab) {
		this.active = tab.id;
	}
}
