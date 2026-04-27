type Term = {
	name: string;
	body: string;
};

type HandbookSection = {
	title: string;
	subtitle?: string;
	items: string[];
};

export class IdolHandbookVM {
	readonly terms: Term[] = [
		{ name: 'Fans', body: 'Your lifeline. Hit zero and your Idol career is over.' },
		{ name: 'Moni', body: 'Spent on actions outside LIVE. Does not affect LIVE directly.' },
		{ name: 'Stamina', body: 'How many moves you get in a LIVE before you run out of gas.' },
		{ name: 'Haste', body: 'More Haste, more moves over your Rival.' },
		{ name: 'Sing / Dance', body: 'Your offensive moves. Poach Fans by stunning the Rival with your coquettish maneuvers!' },
		{ name: 'Charm / Presence', body: 'Your defense. Charm resists Sing, Presence resists Dance.' },
	];

	readonly sections: HandbookSection[] = [
		{
			title: 'LIVE Battle',
			// subtitle: 'How LIVE battles are resolved.',
			items: [
				'Your Rival\'s stats and loadout are randomly generated.',
				'Each move costs Stamina, rolls your Sing or Dance, then checks against your Rival\'s Charm or Presence.',
				'Each successful move grants a Style stack, which adds a bonus to your Sing and Dance for the rest of the LIVE.',
				'Equipment skills fire automatically, at most once per LIVE.',
				'Damage poaches Fans from the other Idol. The first Idol to hit zero Fans loses.',
				'If both Idols run out of Stamina, the one with more Fans wins.',
			],
		},
		{
			title: 'Dreams',
			// subtitle: 'When you could not handle reality anymore.',
			items: [
				'Dreaming resets the run and converts part of your run stats into permanent base and multi bonuses.',
				'Fans and Moni inheritance is based on what you earned this run, not what you have left.',
				'Dream Points are earned from how many Rivals you have defeated and the equipment you found during the run.',
				'Dream Points are spent on permanent upgrades in the Idol Hub.',
				'You can only Dream after a LIVE.',
			],
		},
	];
}
