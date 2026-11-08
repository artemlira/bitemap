const SEEN_KEY = "bitemap-admin-spots-seen";
export const SEEN_EVENT = "bitemap:moderation-seen";

/** When the admin last looked at the new-spots list. Missing value means "now", so the first visit shows no badge. */
export function readSpotsSeenAt(): number {
  try {
    const stored = Number(window.localStorage.getItem(SEEN_KEY));
    if (Number.isFinite(stored) && stored > 0) return stored;
    window.localStorage.setItem(SEEN_KEY, String(Date.now()));
  } catch {
    // Storage can be unavailable; fall through to "now".
  }
  return Date.now();
}

export function markSpotsSeen() {
  try {
    window.localStorage.setItem(SEEN_KEY, String(Date.now()));
  } catch {
    // Not critical: the badge simply stays.
  }
  window.dispatchEvent(new Event(SEEN_EVENT));
}
