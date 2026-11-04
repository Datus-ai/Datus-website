# Datus UTM Conventions

Updated: 2026-11-02. Applies to website development, external marketing assets, and links prepared for colleagues to publish.

Use this document when creating links or reviewing attribution changes. This extends #115 (shared source fallback) and #116 (AI referral recognition) with missing-source completion at campaign capture time. See the [Studio handoff specification](studio-utm-handoff.md) for implementation details and the [CTA inventory](studio-cta-tags.csv) for recorded website placements. The inventory is a maintained snapshot of static base URLs, not an automatically generated live list; update it when adding pages or buttons. Runtime Referrer completion does not change its placement identifiers or fallback URLs.

## 1. Parameter ownership

| Parameter | Purpose | External marketing links | Website-to-Studio CTAs |
|---|---|---|---|
| `utm_source` | Originating platform | For example, `linkedin`, `youtube`, `x` | Preserve the external source; fall back to `datus.ai` when no valid campaign is available |
| `utm_medium` | Channel type | For example, `social`, `email`, `referral` | Preserve the incoming value |
| `utm_campaign` | Shared marketing initiative | For example, `dosi_launch_202610` | Preserve the incoming value; do not replace it with a page name |
| `utm_content` | Specific asset or button placement | Distinguish posts, videos, creatives, and destinations | Use the current website button's stable identifier |

**Preserve external campaign evidence when available. Otherwise, website-to-Studio links use `utm_source=datus.ai`. Identify the button with `utm_content`; do not invent a medium or campaign.**

Do not add UTM parameters to ordinary navigation between website pages. For example, a homepage link to a solution page must not add `utm_source=datus.ai` or create a new campaign on every internal navigation.

## 2. Naming and stability

- Use short, readable lowercase values with numbers and underscores for new tags, such as `official_announcement_studio`. Incoming values are not automatically lowercased; do not rewrite valid visitor-supplied values.
- Use the same campaign across platforms for one initiative. Set the source to the actual publishing platform and provide a separate, complete URL for each platform. Do not reuse a LinkedIn-tagged URL on X.
- Website `utm_content` values generally follow `{page}_{placement}`, such as `home_hero` or `pricing_cloud_signup`. Keep existing identifiers stable when changing button copy or adjusting layout.
- `studioNavTag()` generates header and mobile-menu identifiers: trim the English route's leading and trailing slashes, replace `/` and `-` with `_`, use `home` for the homepage, then append `_header` or `_mobile_menu`.
- `studioCtaUrl()` adds `zh_` once for Chinese website buttons. Do not add it manually as well. Name external Chinese-language assets by their actual channel and content; language alone does not identify a platform.
- External content identifiers can follow `{account_or_post}_{destination}`, such as `shao_announcement_studio` or `launch_flash_dosi_connectors`. Distinguish destinations when one asset links to several places.
- The website trims incoming source, medium, and campaign values and accepts at most 100 characters per field. Empty, overlong, or control-character values are ignored. Keep all new tags short. Never include names, email addresses, tokens, API keys, or other personal or confidential information.
- Preserve the destination domain, path, unrelated query parameters, and fragment. Use the URL API to merge parameters without adding duplicate question marks, breaking encoding, or overwriting login redirect parameters.

### Apache Ossie converter routes

The canonical hub is `/apache-ossie-converter/`. Direction pages use
`{source}-to-{target}/` and identify their resource CTA with
`apache_ossie_converter_{flow}_resources` (hyphens become underscores).
The hub retains `semantic_converter_resources`. Header and mobile CTAs use
`studioNavTag()` for the current canonical route. All use the shared campaign
handoff and source fallback. Legacy converter URLs are redirect-only and have
no CTA placements. See the inventory for both locale variants.

## 3. Defaults for external channels

These are Datus conventions for new ordinary marketing links, not automatic classification rules for every visitor.

| Publishing channel | `utm_source` | `utm_medium` |
|---|---|---|
| Organic LinkedIn posts, company pages, and articles | `linkedin` | `social` |
| Organic X posts and profile links | `x` | `social` |
| YouTube channels and video descriptions | `youtube` | `social` |
| Datus-owned Slack community | `slack` | `community` |
| WeChat official accounts and groups | `wechat` | `social` |
| Medium articles | `medium` | `referral` |
| Email newsletters | Actual newsletter name, such as `datus_newsletter` | `email` |

Use `social` consistently for new YouTube links rather than alternating with `video`. Paid advertising requires its own agreed campaign and paid medium; do not apply organic social defaults. If a partner publishes on LinkedIn, use `linkedin/social` and identify the partner or account in `utm_content`. Confirm unspecified channels instead of guessing LinkedIn or WeChat.

Established campaign names:

| Context | `utm_campaign` |
|---|---|
| October 2026 Datus / DOSI launch | `dosi_launch_202610` |
| Evergreen LinkedIn company profile links | `company_page` |
| Evergreen X profile links | `profile` |

Do not use an evergreen profile campaign for launch assets. Marketing and development should agree on one stable name for each new initiative.

Clearly flag unconfirmed channels in drafts. If a draft uses `replace_with_channel`, **replace it before publication**. A placeholder is not a valid final source. Google Docs is not the publishing source merely because the draft lives there.

### External URL examples

Official LinkedIn announcement linking to the website:

```text
https://datus.ai/?utm_source=linkedin&utm_medium=social&utm_campaign=dosi_launch_202610&utm_content=official_announcement_website
```

YouTube founder video linking directly to Studio:

```text
https://studio.datus.ai/?utm_source=youtube&utm_medium=social&utm_campaign=dosi_launch_202610&utm_content=shao_announcement_studio
```

X post linking to DOSI for the same launch:

```text
https://dosi.datus.ai/?utm_source=x&utm_medium=social&utm_campaign=dosi_launch_202610&utm_content=official_announcement_dosi_quickstart
```

External links can target the appropriate website, Studio, DOSI, or documentation page. The website's automatic handoff covers only the Studio links described below; it does not establish equivalent storage or attribution behavior on DOSI, the documentation site, or Studio's registration flow.

## 4. Implementing website CTAs

Reuse the existing helpers instead of assembling separate source parameters or adding another storage mechanism. `studioCtaUrl()` calls `studioUrl()` from `src/lib/studio-url.mjs`. The shared builder replaces the campaign as a whole, places `utm_source` first when present, and supplies the website fallback when no valid campaign is available:

```tsx
import { studioCtaUrl } from "../lib/studio-cta";
import { STUDIO_START_URL } from "../config/nav";

// Use the page's existing Locale and adjust relative imports for the file.
const href = studioCtaUrl(STUDIO_START_URL, "home_hero", locale);
```

This demonstrates the helper API; the actual homepage hero currently retains its `/login` destination. Adding UTM must not interchange the root, `/login`, and `/overview` destinations.

Examples of base URLs rendered by the server:

```text
https://studio.datus.ai/?utm_source=datus.ai&utm_content=home_hero
https://studio.datus.ai/?utm_source=datus.ai&utm_content=zh_home_hero
```

After a visitor arrives from LinkedIn and clicks the homepage hero CTA:

```text
https://studio.datus.ai/login?utm_source=linkedin&utm_medium=social&utm_campaign=dosi_launch_202610&utm_content=home_hero
```

The external asset's `utm_content` is not forwarded: the Studio URL identifies the website button with `home_hero`. An external link that goes directly to Studio retains its external content identifier in the URL, but this repository does not guarantee Studio records it. Preserving both creative identity and website placement requires a separately designed field; do not silently change existing meanings.

Use `common.tryStudio` from `src/i18n/ui.ts` for sign-up CTA copy: **Get Started Free** in English and its existing localized equivalent in Chinese. Shared copy does not mean shared content identifiers.

## 5. Automatic handoff, inferred sources, and storage

After marketing-page hydration or static Blog loading, `setupStudioCampaignHandoff()` decorates **all links whose origin is exactly `https://studio.datus.ai`**. A pre-existing `utm_content` is not required. SSR and Blog generation also use `studioUrl()` for the default source. Do not broaden this rule to other subdomains or ports.

Source precedence:

1. Explicit `utm_source`, `utm_medium`, and `utm_campaign` in the current URL.
2. When a valid explicit `utm_source` is missing, use the current external HTTP(S) Referrer hostname. Untagged search and AI visits retain their existing normalization; other untagged hosts use their domain plus `referral`. Partial UTM or known paid-click arrivals fill only the source domain, preserving current URL medium/campaign without inferring a medium. No referrer creates a campaign name. Same-host navigation and `datus.ai` / `www.datus.ai` aliases are ignored.
3. Valid campaign data cached in the current tab after usage-analytics consent.
4. With no usable evidence, `utm_source=datus.ai` plus the button's existing `utm_content`, without a medium or campaign. The fallback identifies the website handoff, not the visitor's original acquisition source, and is not stored as campaign evidence.

The presence of any of the three campaign fields counts as a fresh explicit arrival, even if its value is empty or invalid. Replace the old campaign as a whole. A missing source may be filled from the same arrival's external Referrer; never fill fields from a previous campaign or mix a partial external campaign with the website fallback. If all supplied campaign values are rejected and no valid external Referrer is available, the resulting link uses the fallback.

Exact search and AI host allowlists live in `src/lib/referrer-attribution.ts`. Recognized AI products include ChatGPT, Claude, Perplexity, Gemini, Copilot, and DeepSeek. Examples are `utm_source=claude.ai&utm_medium=referral` and `utm_source=chatgpt.com&utm_medium=referral`. Match confirmed product hosts; do not classify all OpenAI or Anthropic sites as AI referrals.

Known paid-click identifiers suppress organic/AI classification and stale-cache reuse, but an available external Referrer hostname can still supply the source. Other UTM fields do not prevent filling a missing source. Only source, medium, and campaign are forwarded; website CTA content remains authoritative. Content-only arrivals without an external Referrer do not themselves clear valid cached data. Referrer availability depends on the browser; absent both source and Referrer, the original acquisition source cannot be identified. Inferred hostnames follow the existing 100-character field limit; overlong hosts are ignored.

Complete the source from arrival evidence before saving the campaign, not only when a Studio CTA is clicked. The same captured campaign feeds both persistence and link decoration. Use `sessionStorage` only after website usage-analytics consent. The `datus_website_campaign` key contains only the three campaign fields and capture time. It expires 30 minutes after capture; ordinary navigation does not extend the expiry. Refusal, withdrawal, or expired consent clears the cache. Without consent or available storage, use only current URL or current external Referrer evidence, otherwise the website fallback. Cross-page retention is not guaranteed in that case.

Do not forward complete referrer URLs, search terms, `utm_term`, external `utm_content`, login codes, unrelated incoming query parameters, or incoming fragments. Dynamic menus and new-tab navigation use the same decorated hrefs. Do not depend on separate tabs sharing session storage.

## 6. Blog, Support, and system boundaries

Blog, Support, and marketing pages share the same website fallback and external-source handoff. `scripts/build-blog.mjs` processes Studio links with `studioUrl()` at build time; `src/site-motion.ts` enables the shared handoff when the Blog loads.

- Blog headers use `utm_content=blog_header`; generated body CTAs use `blog_cta`.
- Do not reintroduce the legacy combination `utm_source=datus.ai&utm_medium=blog&utm_campaign=get_started`. The shared builder replaces those historical campaign fields.
- Preserve existing Studio destination paths. Functional Support links, including feedback, also use the shared attribution rules; do not turn their destinations into registration pages.

The website can ensure eligible links carry parameters. The Studio team must verify retention through login, SSO, registration redirects, and registration-success attribution. This repository does not thereby add visitor IDs, collection endpoints, or a complete cross-domain attribution system.

## 7. Development and publication checklist

- Use `studioCtaUrl()`, existing destination constants, and shared CTA copy for new Studio sign-up buttons. Assign stable placement identifiers and add the Chinese prefix only once.
- Maintain the [CTA inventory](studio-cta-tags.csv). When parameter meanings or behavior change, update this convention, the [handoff specification](studio-utm-handoff.md), and relevant development guidance.
- Deliver complete URLs per publishing platform. Match source, medium, campaign, and content to the placement, remove placeholders, and preserve destination paths and fragments.
- Verify all three campaign fields, missing-source Referrer completion, same-host navigation, campaign replacement, cross-page retention, organic search, AI referrals, no-source fallback, refusal, withdrawal, expiry, and unavailable storage.
- Verify Chinese pages, mobile menus, new-tab navigation, and prerendering. Never embed a visitor's external campaign into static HTML.
- For implementation changes, run `npm run build:all`, then `npm run test:studio-campaign`. For consent or storage changes, also run `npm run test:cookie-consent`. Documentation-only changes require checking consistency with code, examples, and local links.

Implementation entry points: `src/lib/studio-url.mjs`, `src/lib/studio-cta.ts`, `src/lib/studio-campaign.ts`, `src/lib/referrer-attribution.ts`, and `src/components/SiteLayout.tsx`. Blog generation lives in `scripts/build-blog.mjs`; consent state lives in `src/cookie-consent/choice.ts`.
