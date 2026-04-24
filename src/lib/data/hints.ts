/**
 * Single source of truth for player-facing hover hints on Location cards.
 * Keyed by the location's `name`. Add new locations here as `null` first,
 * then fill in copy when ready — gaps are intentional and easy to spot.
 */
export const LOCATION_HINTS: Record<string, string | null> = {
    'Wake Up':     "What are you waiting for, click me to start your Idol journey!",
    'Living Room': "Some cards may show very important info when hovered - like hints, or even restrictions/bonuses.",
    'Park':        "All training cards have Mastery - the higher the mastery the less time it takes to complete them. Keep up your trainings!",
    'School':      "When it is time for LIVE, you will need to prove that you are the better Idol. All of your stats (except Moni) will be taken into consideration. Make sure to train well!",
    'Karaoke Box': "You cannot gain Mastery from Earning and Spending cards. However, their rewards tend to be dynamic.",
    'Gym':         "During LIVE, you consume Stamina for each move you perform. However, your Fans will also be more easily swayed by Rival if your are running out of Stamina.",
    'Maid Cafe':   "Most Equipment have Skills, and they can only be triggered ONCE per LIVE.",
    'Mall':        "Don't lose hope if you get defeated by Rival. On every Dream, you will gain extra stats and Dream Points (DP). Put them in good use!",
};

export function getLocationHint(name: string): string | null {
    return LOCATION_HINTS[name] ?? null;
}
