import { COOKIE_UI } from "../i18n/cookie";
import { localeFromPathname, localizePath } from "../i18n/config";
import { clearStoredWebsiteCampaign } from "../lib/studio-campaign";
import {
  COOKIE_CHOICE_KEY as KEY,
  COOKIE_CHOICE_VERSION as VERSION,
  COOKIE_CHOICE_AGE as AGE,
  ANALYTICS_CONSENT_EVENT,
  readCookieChoice as read,
  type CookieChoice as IChoice,
} from "./choice";

const GA_ID = "G-EPVCH78EZP";
const SCRIPT_ID = "datus-consented-analytics";
const locale = localeFromPathname(location.pathname);
const t = COOKIE_UI[locale];
const win = window as unknown as Record<string, any>;
let choice = read();
let analyticsStarted = false;
let lastStorage: "granted" | "denied" | undefined;
let dismissed = false;
let returnFocus: HTMLElement | null = null;

function current(): IChoice | null {
  return choice && Date.now() - choice.savedAt < AGE ? choice : null;
}
function clearCookies() {
  const parts = location.hostname.split(".");
  const domains = ["", ...parts.map((_, i) => parts.slice(i).join("."))];
  for (const part of document.cookie.split(";")) {
    const name = part.trim().split("=")[0];
    if (!/^(_ga($|_)|_gid$|_gat($|_)|datus_website_ga($|_))/.test(name))
      continue;
    for (const domain of domains)
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain ? `; Domain=${domain}` : ""}`;
  }
}
function synchronizeAnalytics() {
  const selected = current();
  const allowed = selected?.analytics === true;
  const blocked = selected?.analytics === false;
  if (!allowed) clearStoredWebsiteCampaign();
  window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: allowed }));
  win[`ga-disable-${GA_ID}`] = blocked;
  if (!allowed) clearCookies();
  if (blocked) {
    // Disable this property's transmission without discarding page/form state.
    // A later acceptance updates consent while reusing the loaded SDK.
    lastStorage = undefined;
    return;
  }
  const storage = allowed ? "granted" : "denied";
  if (analyticsStarted) {
    if (lastStorage !== storage) {
      win.gtag("consent", "update", { analytics_storage: storage });
      lastStorage = storage;
    }
    return;
  }
  win.dataLayer = win.dataLayer || [];
  win.gtag =
    win.gtag ||
    function (..._args: unknown[]) {
      win.dataLayer.push(arguments);
    };
  win.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  if (allowed) win.gtag("consent", "update", { analytics_storage: "granted" });
  win.gtag("js", new Date());
  win.gtag("config", GA_ID, {
    cookie_domain: "none",
    cookie_prefix: "datus_website",
    cookie_expires: 15_552_000,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    page_location: location.origin + location.pathname,
    page_referrer: document.referrer
      ? new URL(document.referrer).origin + new URL(document.referrer).pathname
      : "",
  });
  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.append(script);
  analyticsStarted = true;
  lastStorage = storage;
}

const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ]!,
  );
const policyHref = localizePath("/policies/cookies/", locale);
const policy = `<a href="${policyHref}">${escape(t.policy)}</a>`;
const host = document.createElement("div");
host.className = "cookie-ui";
host.innerHTML = `
<aside class="cookie-ui__banner" aria-labelledby="cookie-banner-title" hidden>
 <button class="cookie-ui__close" type="button" data-dismiss aria-label="${escape(t.dismiss)}">×</button>
 <h2 id="cookie-banner-title">${escape(t.title)}</h2><p>${escape(t.description)} ${policy}</p>
 <div class="cookie-ui__actions"><button type="button" data-open>${escape(t.manage)}</button><button type="button" data-reject>${escape(t.reject)}</button><button type="button" data-accept>${escape(t.accept)}</button></div>
</aside>
<dialog class="cookie-ui__dialog" aria-labelledby="cookie-settings-title" aria-describedby="cookie-settings-intro">
 <header><div><small>${escape(t.brand)}</small><h2 id="cookie-settings-title">${escape(t.settings)}</h2></div><button class="cookie-ui__close" type="button" data-close aria-label="${escape(t.close)}">×</button></header>
 <div class="cookie-ui__body"><p id="cookie-settings-intro">${escape(t.intro)}</p>${policy}
 <section><div class="cookie-ui__heading"><h3>${escape(t.necessary)}</h3><span>${escape(t.always_on)}</span></div><p>${escape(t.necessary_description)}</p><details><summary>${escape(t.details)}</summary><p>${escape(t.necessary_details)}</p></details></section>
 <section><div class="cookie-ui__heading"><label for="cookie-analytics">${escape(t.analytics)}</label><input type="checkbox" id="cookie-analytics" aria-label="${escape(t.analytics)}"></div><p>${escape(t.analytics_description)}</p><details><summary>${escape(t.details)}</summary><p>${escape(t.analytics_details)}</p></details></section>
 <p class="cookie-ui__scope">${escape(t.scope)}</p></div>
 <footer><button type="button" data-reject>${escape(t.reject)}</button><button type="button" data-save>${escape(t.save)}</button></footer>
</dialog><p class="cookie-ui__status" role="status" hidden></p>`;
document.body.append(host);
const banner = host.querySelector<HTMLElement>(".cookie-ui__banner")!;
const dialog = host.querySelector<HTMLDialogElement>("dialog")!;
const toggle = host.querySelector<HTMLInputElement>("#cookie-analytics")!;
const status = host.querySelector<HTMLElement>("[role=status]")!;
function render() {
  banner.hidden = !!current() || dismissed;
}
function open(opener?: HTMLElement) {
  returnFocus = opener || (document.activeElement as HTMLElement);
  toggle.checked = current()?.analytics ?? false;
  host.querySelectorAll("details").forEach((item) => {
    item.open = false;
  });
  if (!dialog.open) dialog.showModal();
}
function save(analytics: boolean) {
  choice = {
    necessary: true,
    analytics,
    savedAt: Date.now(),
    version: VERSION,
  };
  let persisted = true;
  try {
    localStorage.setItem(KEY, JSON.stringify(choice));
  } catch {
    persisted = false;
  }
  status.textContent = persisted ? "" : t.storage_error;
  status.hidden = persisted;
  dismissed = false;
  if (dialog.open) dialog.close();
  render();
  synchronizeAnalytics();
  scheduleExpiry();
}
host.addEventListener("click", (event) => {
  const button = (event.target as Element).closest("button");
  if (!button) return;
  if (button.hasAttribute("data-open")) open(button);
  if (button.hasAttribute("data-close")) dialog.close();
  if (button.hasAttribute("data-reject")) save(false);
  if (button.hasAttribute("data-accept")) save(true);
  if (button.hasAttribute("data-save")) save(toggle.checked);
  if (button.hasAttribute("data-dismiss")) {
    dismissed = true;
    render();
    document.querySelector<HTMLElement>("[data-cookie-settings]")?.focus();
  }
});
dialog.addEventListener("close", () => {
  if (
    returnFocus?.isConnected &&
    returnFocus.getClientRects().length &&
    !returnFocus.closest("[hidden]")
  )
    returnFocus.focus();
  else document.querySelector<HTMLElement>("[data-cookie-settings]")?.focus();
});
document.addEventListener("click", (event) => {
  const opener = (event.target as Element).closest<HTMLElement>(
    "[data-cookie-settings]",
  );
  if (opener) open(opener);
});
window.addEventListener("storage", (event) => {
  if (event.key === KEY || event.key === null) {
    choice = read();
    dismissed = false;
    render();
    synchronizeAnalytics();
    scheduleExpiry();
  }
});
let expiryTimer: ReturnType<typeof setTimeout>;
function scheduleExpiry() {
  clearTimeout(expiryTimer);
  if (choice)
    expiryTimer = setTimeout(
      () => {
        expire();
        scheduleExpiry();
      },
      Math.min(Math.max(0, AGE - (Date.now() - choice.savedAt)), 2_147_483_647),
    );
}
const expire = () => {
  if (choice && !current()) {
    choice = null;
    dismissed = false;
    render();
    synchronizeAnalytics();
    scheduleExpiry();
  }
};
window.addEventListener("pageshow", expire);
window.addEventListener("focus", expire);
scheduleExpiry();
render();
synchronizeAnalytics();
