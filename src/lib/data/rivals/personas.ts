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
        weights: W(1.0, 1.0, 0.8, 0.4, 2.0, 0.4, 1.6),
    },
    {
        id: 'vocal_queen',
        name: 'Vocal Queen',
        desc: 'A voice that fills the hall. Stage moves... not so much.',
        weights: W(1.0, 1.0, 0.8, 2.0, 0.4, 1.6, 0.4),
    },
    {
        id: 'otk_glass_cannon',
        name: 'Glass Cannon',
        desc: 'Hits first, hits hard, folds the moment you punch back.',
        weights: W(0.4, 1.0, 1.4, 1.6, 1.6, 0.5, 0.5),
    },
    {
        id: 'tank',
        name: 'Iron Idol',
        desc: 'Slow, sturdy, refuses to die. Outlasts you and grinds you down.',
        weights: W(1.3, 2.0, 0.5, 0.6, 0.6, 1.0, 1.0),
    },
    {
        id: 'fan_favorite',
        name: 'Fan Favorite',
        desc: 'Massive following before the curtain even rises. Skill? Eh.',
        weights: W(1.7, 1.1, 0.8, 0.8, 0.8, 0.9, 0.9),
    },
    {
        id: 'hearthrob',
        name: 'Heartthrob',
        desc: 'All smiles and presence. Wins hearts, not technique contests.',
        weights: W(0.9, 1.0, 0.9, 0.6, 0.6, 1.6, 1.4),
    },
];

export function pickPersona(): Persona {
    return ALL_PERSONAS[Math.floor(Math.random() * ALL_PERSONAS.length)];
}

export const RIVAL_ADJECTIVES: string[] = [
    'dazzling', 'fierce', 'elegant', 'ruthless', 'cocky', 'stoic',
    'radiant', 'cunning', 'tireless', 'haughty', 'graceful', 'magnetic',
    'sharp-tongued', 'sly', 'unflinching', 'reckless', 'serene', 'impeccable',
    'merciless', 'quietly terrifying', 'starstruck', 'velvet-voiced',
    'lightning-fast', 'iron-willed', 'unbothered', 'flashy', 'sultry',
    'unshakeable', 'brilliant', 'meticulous',
];

export function pickAdjective(): string {
    return RIVAL_ADJECTIVES[Math.floor(Math.random() * RIVAL_ADJECTIVES.length)];
}
