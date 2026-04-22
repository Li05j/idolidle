/**
 * Single source of truth for player-facing hover hints on Location cards.
 * Keyed by the location's `name`. Add new locations here as `null` first,
 * then fill in copy when ready — gaps are intentional and easy to spot.
 */
export const LOCATION_HINTS: Record<string, string | null> = {
    'Wake Up':     "What are you waiting for, click me to start your Idol journey!",
    'Living Room': "Some cards may show very important info when hovered - like hints, or even restrictions/bonuses.",
    'Park':        null, // TODO
    'School':      "When it is time for LIVE, you will need to prove that you are the better Idol. All of your stats (except Moni) will be taken into consideration. Make sure to train well!",
    'Mall':        "All Location cards and white Action cards will take less time to complete the more you do them. Keep up your trainings!",
    'Gym':         "You cannot lower the time needed to complete Purple and Yellow cards. However, their rewards tend to be dynamic.",
    'Maid Cafe':   "During LIVE, you consume Stamina for each move you perform. However, your Fans will also be more easily swayed by Rival if your are running out of Stamina.",
};

export function getLocationHint(name: string): string | null {
    return LOCATION_HINTS[name] ?? null;
}
