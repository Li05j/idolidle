import type { LiveBattleStats } from '$lib/types';

export type BattleTrigger =
    | 'live_start'
    | 'before_inflicting_dmg'
    | 'before_taking_dmg'
    | 'after_inflicting_dmg'
    | 'after_taking_dmg';

export type SkillOwner = 'player' | 'rival';

export type SkillContext = {
    // ── Always present ─────────────────────────────────────────────
    you: LiveBattleStats;
    rival: LiveBattleStats;
    /** Resolved skill values (taken from the rarity-merged skill). */
    values: Record<string, number>;
    /** Which side owns this skill. */
    owner: SkillOwner;
    /** Push a colored line into the live battle log. Use freely from effect/on_after_attack. */
    log: (msg: string) => void;

    // ── Trigger-specific extras (may be undefined) ─────────────────
    /** The attack type being performed. Available during before_taking_dmg / after_* triggers. */
    atk_type?: 'Sing' | 'Dance';
    /** Fans transferred by the just-resolved attack. Available during after_* triggers. */
    fans_stolen?: number;
    /** Set to reduce incoming damage by this fraction (0-1). Only meaningful for before_taking_dmg. */
    set_dmg_reduction?: (amount: number) => void;
    /** Apply a temporary stat buff that reverts after the current attack resolves. */
    apply_temp_buff?: (who: 'you' | 'rival', stat: keyof LiveBattleStats, new_value: number) => void;
    /** Register a callback that runs after the current attack resolves. Receives fans_stolen (0 = blocked). */
    on_after_attack?: (callback: (fans_stolen: number) => void) => void;
};

/**
 * A battle skill. Each skill fires at most once per battle, across all triggers.
 *
 * Execution order in run_skills():
 *   1. trigger match -> 2. condition(ctx) -> 3. chance roll -> 4. effect(ctx)
 *
 * - condition: gate that decides whether the skill activates (checked BEFORE chance roll).
 */
export type SkillDef = {
    id: string;
    name: string;
    /** Battle events that can trigger this skill. */
    triggers: BattleTrigger[];
    /** Activation probability (0-1). Rolled after condition check. */
    chance: number;
    /** Skill parameters consumed by cond_string / eff_string / condition / effect. */
    values?: Record<string, number>;
    /** Human-readable condition. String or function of resolved values. */
    cond_string: string | ((v: Record<string, number>) => string);
    /** Human-readable effect. String or function of resolved values. */
    eff_string: string | ((v: Record<string, number>) => string);
    /** Gate function — return true to activate. Don't mutate stats here. */
    condition: (ctx: SkillContext) => boolean;
    /** Gameplay mutation. Use ctx helpers or mutate ctx.you / ctx.rival directly. */
    effect: (ctx: SkillContext) => void;
};

export function resolve_skill_string(
    str: string | ((v: Record<string, number>) => string),
    values: Record<string, number>,
): string {
    return typeof str === 'function' ? str(values) : str;
}

/**
 * Skills are authored from the owner's POV. These placeholders are swapped at
 * render time so the same string reads naturally whether the player or the
 * rival owns the skill.
 *
 * Tokens: {Self} {self} {Self_poss} {self_poss} {Opp} {opp} {Opp_poss} {opp_poss}
 */
const TOKEN_MAP: Record<SkillOwner, Record<string, string>> = {
    player: {
        Self: 'Player',        self: 'Player',
        Self_poss: "Player's", self_poss: "Player's",
        Opp: 'Rival',          opp: 'Rival',
        Opp_poss: "Rival's",   opp_poss: "Rival's",
    },
    rival: {
        Self: 'Rival',         self: 'Rival',
        Self_poss: "Rival's",  self_poss: "Rival's",
        Opp: 'Player',         opp: 'Player',
        Opp_poss: "Player's",  opp_poss: "Player's",
    },
};

export function render_skill_string(
    str: string | ((v: Record<string, number>) => string),
    values: Record<string, number>,
    owner: SkillOwner,
): string {
    const resolved = resolve_skill_string(str, values);
    const map = TOKEN_MAP[owner];
    return resolved.replace(/\{(\w+)\}/g, (match, key) => map[key] ?? match);
}
