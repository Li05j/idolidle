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
        weights: W(0.8, 1.0, 1.2, 0.6, 1.5, 1.2, 0.7),
    },
    {
        id: 'mic_queen',
        name: 'Mic Queen',
        desc: 'A voice that fills the hall. Slow, but steady.',
        weights: W(1.0, 1.1, 0.7, 1.6, 0.7, 0.9, 1.1),
    },
    {
        id: 'otk_glass_cannon',
        name: 'Eye Catcher',
        desc: 'Grabs everyone\'s attention in an instant. Does not hold them for long, though.',
        weights: W(0.4, 1.2, 1.5, 1.3, 1.5, 0.5, 0.6),
    },
    {
        id: 'tank',
        name: 'Marathon Runner',
        desc: ' Outlasts you on stage. Attracts Fans by being the last one standing.',
        weights: W(1.3, 1.7, 0.6, 0.8, 0.6, 1.1, 0.9),
    },
    {
        id: 'fan_favorite',
        name: 'Fan Favorite',
        desc: 'Massive following before the curtain even rises. Skill? Fans.',
        weights: W(1.7, 0.9, 0.8, 1.0, 0.9, 0.8, 0.9),
    },
    {
        id: 'hearthrob',
        name: 'Heart Warmer',
        desc: 'All smiles and rainbows. Wins hearts, not technique contests.',
        weights: W(0.8, 1.1, 0.8, 0.6, 0.8, 1.6, 1.3),
    },
    {
        id: 'swifty',
        name: 'Trickster',
        desc: 'Look at the songs look at the moves! Fast and stylish, but deep inside, no substance.',
        weights: W(0.8, 1.2, 1.7, 0.7, 0.6, 0.9, 1.1),
    },
];

export function pickPersona(): Persona {
    return ALL_PERSONAS[Math.floor(Math.random() * ALL_PERSONAS.length)];
}

export const RIVAL_ADJECTIVES: string[] = [
    'dazzling', 'fierce', 'elegant', 'ruthless', 'cocky', 'stoic',
    'radiant', 'cunning', 'tireless', 'haughty', 'graceful', 'magnetic',
    'sharp-tongued', 'sly', 'unflinching', 'reckless', 'serene', 'impeccable',
    'merciless', 'terrifying', 'starstruck', 'impeccable',
    'marvelous', 'strong-willed', 'unbothered', 'flashy', 'sultry',
    'unshakeable', 'brilliant', 'meticulous', 'unwavering', 'sassy', 'zesty', 'coquettish', 'aloof', 'quirky', 'bashful', 'serious', 'calm', 'bold', 'kittenish', 'relaxed', 'gentle', 'adamant', 'nonchalant', 'annoying', 'wary',
];

export function pickAdjective(): string {
    return RIVAL_ADJECTIVES[Math.floor(Math.random() * RIVAL_ADJECTIVES.length)];
}
