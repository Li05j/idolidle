export type StatWeights = {
    fans: number;
    stamina: number;
    haste: number;
    sing: number;
    dance: number;
    charm: number;
    presence: number;
};

export type Persona = {
    id: string;
    name: string;
    desc: string;
    weights: StatWeights;
};

const W = (
    fans: number, stamina: number, haste: number,
    sing: number, dance: number, charm: number, presence: number,
): StatWeights => ({ fans, stamina, haste, sing, dance, charm, presence });

export const ALL_PERSONAS: Persona[] = [
    {
        id: 'balanced',
        name: 'Well-Rounded Hopeful',
        desc: 'No glaring strengths, no glaring weaknesses. The rival you train for by accident.',
        weights: W(1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0),
    },
    {
        id: 'dance_diva',
        name: 'Dance Diva',
        desc: 'Lets her footwork do the talking. Vocals are an afterthought.',
        weights: W(1.0, 1.0, 1.0, 0.4, 2.2, 0.4, 1.6),
    },
    {
        id: 'vocal_queen',
        name: 'Vocal Queen',
        desc: 'A voice that fills the hall. Stage moves... not so much.',
        weights: W(1.0, 1.0, 1.0, 2.2, 0.4, 1.6, 0.4),
    },
    {
        id: 'otk_glass_cannon',
        name: 'Glass Cannon',
        desc: 'Hits first, hits hard, folds the moment you punch back.',
        weights: W(0.7, 0.5, 2.5, 1.6, 1.6, 1.0, 1.0),
    },
    {
        id: 'tank',
        name: 'Iron Idol',
        desc: 'Slow, sturdy, refuses to die. Outlasts you and grinds you down.',
        weights: W(1.4, 2.5, 0.5, 0.7, 0.7, 1.0, 1.0),
    },
    {
        id: 'fan_favorite',
        name: 'Fan Favorite',
        desc: 'Massive following before the curtain even rises. Skill? Eh.',
        weights: W(2.5, 1.0, 1.0, 0.6, 0.6, 1.4, 1.4),
    },
    {
        id: 'charmer',
        name: 'Charmer',
        desc: 'All smiles and presence. Wins hearts, not technique contests.',
        weights: W(1.0, 1.0, 1.0, 0.5, 0.5, 2.0, 2.0),
    },
];

export function pickPersona(): Persona {
    return ALL_PERSONAS[Math.floor(Math.random() * ALL_PERSONAS.length)];
}
