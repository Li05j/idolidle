type Term = {
	name: string;
	body: string;
};

type HandbookSection = {
	title: string;
	subtitle: string;
	items: string[];
};

export class IdolHandbookVM {
	readonly terms: Term[] = [
		{ name: 'Base', body: 'The raw stat value you build from actions, dreams, and equipment.' },
		{ name: 'Multi', body: 'A multiplier applied after base. More multi makes future base gains matter more.' },
		{ name: 'Final', body: 'The number the game actually uses: base times multi, then rounded for display.' },
		{ name: 'Fans', body: 'Your LIVE health bar. Attacks steal fans instead of deleting them.' },
		{ name: 'Moni', body: 'Spendable money for actions. Spending Moni does not erase dream inheritance credit.' },
		{ name: 'Stamina', body: 'How many moves you can afford in LIVE before you run dry.' },
		{ name: 'Haste', body: 'Turn speed in LIVE. Higher haste fills your action bar faster.' },
		{ name: 'Sing / Dance', body: 'Attack stats. Each basic move randomly uses one of them.' },
		{ name: 'Charm / Presence', body: 'Defense stats. They blunt incoming Sing or Dance moves.' },
		{ name: 'Style', body: 'A LIVE-only momentum stack. Each move adds Style, making later hits stronger.' },
	];

	readonly sections: HandbookSection[] = [
		{
			title: 'LIVE Battle',
			subtitle: 'How rival showdowns are resolved.',
			items: [
				'Haste decides who acts next by filling action bars.',
				'Each move spends stamina, rolls Sing or Dance, then checks against Charm or Presence.',
				'Damage poaches fans from the defender. If someone hits zero fans, the LIVE ends.',
				'Equipment skills can fire during specific battle timings and each skill fires at most once per battle.',
				'Winning unlocks the next checkpoint choice. Losing means you need more training or better equipment.',
			],
		},
		{
			title: 'Dreams',
			subtitle: 'The reset layer after a LIVE.',
			items: [
				'After a LIVE, dreaming resets the run but keeps permanent dream progress.',
				'Dreams inherit part of your run stats into future base and multi bonuses.',
				'Fans and Moni inheritance uses what you earned this run, not what you still have left.',
				'Dream Points come from checkpoints and equipment found during the run.',
				'Spend Dream Points on permanent upgrades in the Idol Hub.',
			],
		},
	];
}
