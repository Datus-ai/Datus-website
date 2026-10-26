export const COOKIE_CHOICE_KEY = "datus_website_cookie_consent";
export const COOKIE_CHOICE_VERSION = "2026-10-15";
export const COOKIE_CHOICE_AGE = 180 * 24 * 60 * 60 * 1000;
export const ANALYTICS_CONSENT_EVENT = "datus:analytics-consent";

export interface CookieChoice {
  necessary: true;
  analytics: boolean;
  version: string;
  savedAt: number;
}

export function readCookieChoice(): CookieChoice | null {
  try {
    const value = JSON.parse(localStorage.getItem(COOKIE_CHOICE_KEY) || "null");
    const age = Date.now() - value?.savedAt;
    if (
      value?.version === COOKIE_CHOICE_VERSION &&
      value.necessary === true &&
      typeof value.analytics === "boolean" &&
      Number.isFinite(value.savedAt) &&
      age >= 0 && age < COOKIE_CHOICE_AGE
    ) return value;
  } catch {
    // Unavailable storage does not imply consent.
  }
  return null;
}
