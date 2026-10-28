import { ANALYTICS_CONSENT_EVENT, readCookieChoice } from "../cookie-consent/choice";
import { hasPaidClickId, referrerCampaign } from "./referrer-attribution";
import { studioUrl } from "./studio-url.mjs";

const FIELDS = ["utm_source", "utm_medium", "utm_campaign"] as const;
type CampaignFields = Partial<Record<(typeof FIELDS)[number], string>>;
interface Campaign { fields: CampaignFields; capturedAt: number }
const STORAGE_KEY = "datus_website_campaign";
const MAX_AGE = 30 * 60 * 1000;

/** Consent cleanup also applies on pages without the marketing handoff UI. */
export function clearStoredWebsiteCampaign() {
  try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* Storage may be blocked. */ }
}

function fieldsFrom(params: URLSearchParams): CampaignFields {
  const fields: CampaignFields = {};
  for (const key of FIELDS) {
    const value = params.get(key)?.trim();
    if (value && value.length <= 100 && !/[\u0000-\u001f\u007f]/.test(value)) fields[key] = value;
  }
  return fields;
}

function valid(campaign: Campaign | null): campaign is Campaign {
  const age = Date.now() - (campaign?.capturedAt ?? NaN);
  return !!campaign && Number.isFinite(age) && age >= 0 && age < MAX_AGE;
}

function readSaved(): Campaign | null {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null");
    if (!valid(saved) || typeof saved.fields !== "object" || !saved.fields) return null;
    const params = new URLSearchParams();
    for (const key of FIELDS) if (typeof saved.fields[key] === "string") params.set(key, saved.fields[key]);
    const fields = fieldsFrom(params);
    return Object.keys(fields).length ? { fields, capturedAt: saved.capturedAt } : null;
  } catch {
    return null;
  }
}

/** Run after hydration (or on the static blog). Decorate all Studio links. */
export function setupStudioCampaignHandoff(root: HTMLElement): () => void {
  let mayStore = readCookieChoice()?.analytics === true;
  const params = new URLSearchParams(window.location.search);
  const hasLandingFields = FIELDS.some(key => params.has(key));
  const landingFields = fieldsFrom(params);
  const inferred = hasLandingFields ? null : referrerCampaign(document.referrer, params);
  const hasFreshArrival = hasLandingFields || !!inferred || hasPaidClickId(params);
  // Replace the whole campaign on a new tagged arrival; never mix two campaigns.
  let campaign: Campaign | null = hasLandingFields
    ? Object.keys(landingFields).length ? { fields: landingFields, capturedAt: Date.now() } : null
    : inferred ? { fields: inferred, capturedAt: Date.now() }
      : hasPaidClickId(params) ? null
        : mayStore ? readSaved() : null;
  let expiryTimer: ReturnType<typeof setTimeout>;

  function persist() {
    try {
      if (mayStore && valid(campaign)) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(campaign));
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Current URL/referrer evidence still works when storage is blocked.
    }
  }

  function decorate(link: HTMLAnchorElement) {
    let url: URL;
    try { url = new URL(link.href); } catch { return; }
    if (url.origin !== "https://studio.datus.ai") return;
    const href = studioUrl(url.href, valid(campaign) ? campaign.fields : {});
    if (link.href !== href) link.href = href;
  }

  function decorateWithin(node: Element) {
    if (node instanceof HTMLAnchorElement) decorate(node);
    node.querySelectorAll<HTMLAnchorElement>("a[href]").forEach(decorate);
  }

  function refresh() {
    if (!valid(campaign)) campaign = null;
    persist();
    decorateWithin(root);
    clearTimeout(expiryTimer);
    if (campaign) expiryTimer = setTimeout(refresh, Math.max(0, MAX_AGE - (Date.now() - campaign.capturedAt)));
  }

  function consentChanged(event: Event) {
    mayStore = (event as CustomEvent<boolean>).detail === true;
    // Withdrawal clears cached attribution; current arrival evidence may still
    // accompany a Studio link without being stored.
    if (!mayStore && !hasFreshArrival) campaign = null;
    refresh();
  }

  function beforeNavigation(event: Event) {
    const target = event.target;
    const link = target instanceof Element ? target.closest<HTMLAnchorElement>("a[href]") : null;
    if (link && root.contains(link)) decorate(link);
  }

  refresh();
  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === "attributes" && record.target instanceof HTMLAnchorElement) decorate(record.target);
      for (const node of record.addedNodes) if (node instanceof Element) decorateWithin(node);
    }
  });
  observer.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ["href"] });
  window.addEventListener(ANALYTICS_CONSENT_EVENT, consentChanged);
  window.addEventListener("pageshow", refresh);
  window.addEventListener("focus", refresh);
  for (const type of ["click", "auxclick", "contextmenu"]) root.addEventListener(type, beforeNavigation, true);
  return () => {
    observer.disconnect();
    clearTimeout(expiryTimer);
    window.removeEventListener(ANALYTICS_CONSENT_EVENT, consentChanged);
    window.removeEventListener("pageshow", refresh);
    window.removeEventListener("focus", refresh);
    for (const type of ["click", "auxclick", "contextmenu"]) root.removeEventListener(type, beforeNavigation, true);
  };
}
