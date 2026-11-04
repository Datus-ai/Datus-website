# Datus Website-to-Studio UTM Handoff

For new links and code reviews, follow the [UTM conventions](utm-conventions.md). This document supplements them with implementation boundaries and acceptance checks.

Updated: November 2, 2026. Covers all website links to Studio, including English and Chinese marketing pages, mobile menus, Support pages, and Blog navigation, CTAs, and body links.

External marketing links identify acquisition with `utm_source`, `utm_medium`, and `utm_campaign`. When a valid explicit source is missing, the website uses the current external HTTP(S) Referrer hostname. Untagged search and AI arrivals retain existing classification. The website identifies its own button with `utm_content`, then combines that placement with acquisition evidence on the Studio URL. It does not replace valid external attribution with `datus.ai`. When no valid campaign exists, it uses `utm_source=datus.ai` without inventing a medium or campaign or storing the fallback as acquisition evidence.

## Parameter ownership

| Parameter | Supplied by | Examples | Website behavior |
|---|---|---|---|
| `utm_source` | External link or external referrer | `linkedin`, `youtube`, `google`, `claude.ai` | Explicit values take precedence; otherwise use an external Referrer domain or fall back to `datus.ai` |
| `utm_medium` | External link or external referrer | `social`, `email`, `organic`, `referral` | Preserve explicit values; inferred search uses `organic`, inferred AI and generic untagged referrals use `referral` |
| `utm_campaign` | External marketing link | `product_launch` | Preserve the incoming value; do not invent a campaign for inferred sources |
| `utm_content` | Website CTA | `home_hero` | Use the current button's stable identifier |

If an external asset also supplies `utm_content`, that value is not forwarded. Studio-bound content identifies the website button. Preserving external creative identity as well would require a separately defined field.

## End-to-end example

A website link published on LinkedIn:

```text
https://datus.ai/?utm_source=linkedin&utm_medium=social&utm_campaign=product_launch
```

After the visitor clicks the homepage hero CTA:

```text
https://studio.datus.ai/login?utm_source=linkedin&utm_medium=social&utm_campaign=product_launch&utm_content=home_hero
```

After accepting usage analytics, the visitor can first navigate to the solution page and click its CTA:

```text
https://studio.datus.ai/login?utm_source=linkedin&utm_medium=social&utm_campaign=product_launch&utm_content=semantic_layer_hero
```

All Studio URLs use `src/lib/studio-url.mjs`. When present, `utm_source` is the first query parameter. For example, a fallback URL is `https://studio.datus.ai/login?utm_source=datus.ai&utm_content=home_hero`. Destination paths, unrelated destination query parameters, and fragments are preserved.

Header and mobile-menu sign-up buttons go to `https://studio.datus.ai/`. Existing login buttons retain `/login`, and demo entry points retain `/overview`. The homepage header uses `https://studio.datus.ai/?utm_source=datus.ai&utm_content=home_header`; its Chinese equivalent uses `utm_content=zh_home_header`.

Sign-up CTA copy is **Get Started Free** in English and the existing Chinese equivalent, maintained by `common.tryStudio` in `src/i18n/ui.ts`. Page, placement, and locale remain distinct in `utm_content`; shared wording does not merge identifiers. The Studio product page no longer offers a demo-video button.

## Organic search handoff

A Google organic-search link usually has no UTM parameters. If the browser supplies a recognized Google referrer, the website decorates the Studio CTA as follows:

```text
https://studio.datus.ai/login?utm_source=google&utm_medium=organic&utm_content=home_hero
```

The explicit allowlist covers Google and common regional domains, Bing, DuckDuckGo, Yahoo Search, Baidu, Sogou, 360, Yandex, Naver Search, Brave Search, Ecosia, Startpage, and Qwant. Their source values are respectively `google`, `bing`, `duckduckgo`, `yahoo`, `baidu`, `sogou`, `360`, `yandex`, `naver`, `brave`, `ecosia`, `startpage`, and `qwant`. All use `utm_medium=organic`.

This is browser-referrer classification, not a lookup of Google Analytics attribution. Missing referrers, unknown hosts, and non-search products such as Gmail are not guessed to be organic search. Search terms are not copied from referrer URLs.

Precedence is **valid explicit source → current external Referrer → valid cached campaign → `utm_source=datus.ai` fallback**. Current URL medium/campaign values are retained when a missing source is completed from the same arrival's Referrer. Never merge with an older campaign or fill a partial campaign from the website fallback. A new external arrival replaces the cached campaign as a whole.

Known paid-click identifiers (`gclid`, `dclid`, `gbraid`, `wbraid`, `msclkid`, `yclid`, `NaPm`) suppress organic/AI classification and stale-cache reuse. Partial UTM and paid arrivals may still use an external hostname as source, without inferring a medium. Only source, medium, and campaign are forwarded; external content, term, id, and source_platform are not copied. Content-only arrivals without an external Referrer do not themselves replace cached attribution.

## Generic external referral handoff

For example, an untagged visit from `https://www.linkedin.com/feed/` produces:

```text
https://studio.datus.ai/login?utm_source=www.linkedin.com&utm_medium=referral&utm_content=home_hero
```

Any valid external HTTP(S) hostname can supply the missing source, including news sites, communities and vendor sites. Preserve the hostname including subdomains, normalize case and a trailing dot, and omit paths, ports, queries and fragments. Ignore the current website hostname and the `datus.ai` / `www.datus.ai` aliases so internal browsing cannot overwrite the original source. Hostnames over the existing 100-character field limit are ignored. A valid explicit source always wins; if only campaign/medium is present, preserve it and fill only the source. Without current evidence or a valid cache, retain the existing website fallback.

Without UTM or recognizable paid-click identifiers, a referrer alone cannot reliably distinguish paid from organic search. See the [browser referrer documentation](https://developer.mozilla.org/en-US/docs/Web/API/Document/referrer) and [Google traffic-source processing documentation](https://support.google.com/analytics/answer/11242841?hl=en) for background.

## AI referral handoff

Without explicit UTM or a known paid-click identifier, the website recognizes AI referrals through an exact hostname allowlist applied to `document.referrer`. AI referrals use `referral`, distinct from search's `organic`. Sources use canonical product domains to align with explicitly tagged traffic from those products.

| Product | Allowed referrer hosts | Inferred `utm_source` | Inferred `utm_medium` |
|---|---|---|---|
| ChatGPT | chatgpt.com, www.chatgpt.com, chat.openai.com | chatgpt.com | referral |
| Claude | claude.ai, www.claude.ai | claude.ai | referral |
| Perplexity | perplexity.ai, www.perplexity.ai | perplexity.ai | referral |
| Gemini | gemini.google.com | gemini.google.com | referral |
| Copilot | copilot.microsoft.com, copilot.com, copilot.cloud.microsoft, m365.cloud.microsoft | copilot.microsoft.com | referral |
| DeepSeek | chat.deepseek.com | chat.deepseek.com | referral |

Example: Claude → website → Studio:

```text
https://studio.datus.ai/login?utm_source=claude.ai&utm_medium=referral&utm_content=home_hero
```

A valid explicit source wins; a missing source can be completed from the current Referrer domain. Partial tags and paid-click identifiers suppress inferred medium classification. A newly recognized AI source replaces the previous campaign as a whole. With usage-analytics consent, the existing 30-minute tab-scoped cache allows retention across locales and Blog pages. Without consent, only current-page evidence can be forwarded; otherwise the website fallback applies. Studio's direct-entry attribution must be verified in the product repository rather than inferred from this website's implementation.

Only the referrer host is classified. Conversation IDs, questions, full URLs, query parameters, and fragments are not stored. OpenAI and Anthropic marketing sites and API consoles are not treated as AI recommendations. A referrer shows that a visitor came from a product; it does not prove that a particular answer recommended Datus. If a client provides neither a referrer nor UTM, the source cannot be reliably identified. Do not infer it from User-Agent strings or crawler activity; use the website fallback.

Product-host references: [ChatGPT publisher guidance](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq), [Claude interfaces](https://support.claude.com/en/articles/8114487-what-interfaces-can-i-use-to-access-claude), [Perplexity help](https://www.perplexity.ai/help-center/en/articles/11187416-which-perplexity-subscription-plan-is-right-for-you), [Gemini entry point](https://support.google.com/gemini/answer/14886647?hl=en), [Copilot entry points](https://support.microsoft.com/en-us/microsoft-365-copilot/troubleshoot-content-copilot-app), [Copilot enterprise entry point](https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-app-overview), and [DeepSeek entry point](https://api-docs.deepseek.com/news/news1210/). These identify product entry points, not a guarantee that every client sends a referrer.

## Retention across website pages

After the visitor accepts website usage analytics, campaign fields are stored in the current tab's `sessionStorage` for up to 30 minutes from capture. Ordinary navigation does not extend the expiry. Storage contains only the three campaign fields and capture time; it creates no visitor identifier or new collection request.

| Situation | Behavior |
|---|---|
| Current URL contains campaign parameters | Use valid URL fields; fill a missing source only from the current external Referrer |
| No explicit UTM, but recognized search referrer | Use search-engine source plus `organic`, without a campaign |
| No explicit UTM, but recognized AI referrer | Use canonical product domain plus `referral`, without a campaign |
| No explicit source, but other external Referrer | Capture the hostname as source; untagged arrivals use `referral`, partial/paid arrivals preserve only supplied medium/campaign |
| No fresh campaign or external referrer; consent granted and cache valid | Use the cached campaign |
| New marketing link arrives | Replace the previous campaign; do not mix campaigns |
| Only some campaign fields supplied | Retain valid URL fields and complete source from the current external Referrer; never use old campaign fields or the website fallback |
| No valid campaign, external referrer, or cache | Use `utm_source=datus.ai` and the button's content identifier, without medium or campaign |
| Known paid-click ID without explicit source | Use an external Referrer domain without inferred medium; otherwise clear stale cache and use the website fallback |
| Consent not granted, refused, or storage blocked | Use current URL or current external Referrer evidence, otherwise fallback; do not persist across pages |
| Consent withdrawn or expired | Clear cache; current-page URL or external Referrer evidence may still accompany links |
| Campaign older than 30 minutes | Expire it and use fallback until new valid arrival evidence is available |

Independent tabs do not share this storage. Browsers may copy session storage into a newly opened tab, but the implementation must not depend on that behavior. When a website CTA opens Studio in a new tab, the decorated URL already carries the parameters; Studio does not need to read website storage.

Each incoming campaign field is trimmed and limited to 100 characters. Empty, overlong, and control-character values are ignored. Only the three allowed acquisition fields are forwarded. Full referrer URLs, search terms, login codes, tokens, unrelated incoming query parameters, and incoming fragments are not copied. Never include personal information such as names or email addresses in UTM values.

## Website button identifiers

| Page and placement | English `utm_content` |
|---|---|
| Homepage hero | `home_hero` |
| Homepage closing | `home_closing` |
| Semantic Layer hero | `semantic_layer_hero` |
| Semantic Layer after workflow | `semantic_layer_workflow` |
| Semantic Layer closing | `semantic_layer_closing` |
| Studio demo identifier retained in the inventory | `studio_hero_demo` |
| Studio sign-up | `studio_closing_signup` |
| Pricing free sign-up | `pricing_cloud_signup` |
| Integrations closing | `integrations_closing` |
| Chatbot closing | `chatbot_closing` |
| Converter Studio resource link | `semantic_converter_resources` |

Header buttons use `{page_path}_header`; mobile-menu buttons use `{page_path}_mobile_menu`. Trim leading and trailing slashes and replace `/` and `-` with `_`; use `home` for the homepage. Examples: `solutions_semantic_layer_header`, `products_studio_mobile_menu`.

Chinese pages add `zh_`, for example `zh_home_hero`. See the [CTA inventory](studio-cta-tags.csv) for recorded pages, buttons, and base URLs. It is a maintained snapshot; an identifier in the inventory does not establish that a removed button is still present.

## Website and Studio responsibilities

| Scope | Responsibility |
|---|---|
| All website links to Studio | Read explicit UTM or complete a missing source from an external Referrer, cache according to consent, and decorate Studio URLs |
| Locale and theme | Preserve existing behavior; language changes can retain valid campaign data |
| Blog articles and CTAs | Share the marketing fallback and handoff; navigation uses `blog_header`, generated body CTAs use `blog_cta`; existing Studio links retain their paths and no longer receive the old blog medium or campaign |
| Support actions | Preserve functional destinations, use the relevant button identifiers, and apply shared source handling |
| Studio registration flow | Product-side responsibility: retain incoming parameters through login, SSO, and registration redirects |
| GA4 and registration attribution | Complete attribution configuration and registration-success events are outside this website change |

Source compensation happens when the arrival campaign is captured, before the existing consent-gated sessionStorage write. Saved campaign fields already contain the compensated source; link decoration consumes that same campaign rather than computing a separate fallback at click time.

The website ensures eligible links can carry campaign fields. It does not guarantee Studio has recorded them or connected them to registration reports. Product colleagues should use the example URLs to verify retention through login, SSO callbacks, and registration completion.

## Acceptance checks

1. Enter through a LinkedIn-tagged website URL and inspect all four fields on the hero CTA.
2. Accept usage analytics, visit the solution page, and confirm the source remains LinkedIn while content changes to that page's button identifier.
3. Open the mobile menu and confirm its CTA has a distinct identifier and the same campaign.
4. Enter through a new YouTube campaign and confirm no fields from the previous LinkedIn campaign remain.
5. Refuse or withdraw usage analytics and confirm cache cleanup. Pages without current arrival evidence should use the website fallback and their own button identifier.
6. Repeat for Chinese pages, new-tab navigation, expired cache, and blocked storage.
7. Enter from a Google or Bing referrer without UTM. Confirm engine source and `organic`, without an old campaign.
8. Check explicit complete and partial campaigns. Fill missing source from the current external Referrer, never from the website fallback. Paid-click IDs, Gmail and unknown domains must not be misclassified as organic. Untagged external domains use `referral`; paid or partial arrivals fill source only. Same-host navigation preserves cached attribution; missing evidence uses `datus.ai`.
9. Disable JavaScript and confirm prerendered English and Chinese CTAs contain the fallback and placement identifier.
10. Check recognized AI hosts, explicit-UTM precedence, unsupported vendor sites, and missing referrers. Only eligible AI hosts should produce canonical product sources with `referral`.

## Implementation entry points

- `src/lib/studio-url.mjs`: shared URL builder; replaces campaign fields, applies fallback, and places source first when present.
- `src/lib/studio-cta.ts`: stable localized button identifiers and prerender-compatible base URLs.
- `src/lib/studio-campaign.ts`: source handoff, consent-aware caching, expiry, and dynamic link decoration.
- `src/lib/referrer-attribution.ts`: search/AI normalization, generic external-domain fallback, same-host exclusions, and paid-click classification guards.
- `src/components/SiteLayout.tsx`: starts handoff after hydration without changing server-rendered visitor attribution.
- `scripts/build-blog.mjs` and `src/site-motion.ts`: process Studio links at Blog build time and enable the shared runtime handoff.
- `src/cookie-consent/choice.ts` and `src/cookie-consent/main.ts`: existing analytics consent state and synchronization.
- `src/i18n/cookie.ts` and `src/pages/policies/cookies/content.ts`: localized storage disclosures.

## Verification and release status

Verification covers the production build, generic external referrals, missing-source completion before consent-gated campaign persistence, partial campaign preservation, regional search hosts, AI hosts, paid-click classification guards, same-host navigation, cross-page retention, Chinese and mobile navigation, replacement, expiry, refusal, withdrawal, unavailable storage, prerendering, and hydration.

Relevant commands are `npm run build:all`, `npm run test:studio-campaign`, and `npm run test:cookie-consent`. Tests target the local website and mock external requests rather than sending test data to real Studio or GA endpoints.

Git history and the relevant pull requests are the source of truth for release status.
