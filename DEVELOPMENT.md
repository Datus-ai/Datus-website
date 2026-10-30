# Development Guide

## Quick Start

**Development (Daily Use)**
```bash
npm run dev  # http://localhost:5173
```
Hot reload enabled for the React marketing pages. Changes take effect
immediately.

> **The blog is a build-time artifact.** It is generated into `dist/` by
> `scripts/build-blog.mjs`, not served live by `vite dev`. Run
> `npm run build:all` once and the dev server will serve `/blog` from `dist/`;
> re-run it after editing posts. Without a build, `/blog` falls back to the
> homepage.

**Preview (Before Deploy)**
```bash
npm run build:all && npm run preview  # http://localhost:4173
```
Tests the full production build (marketing pages + static blog). Requires a
rebuild after changes.

## Bilingual pages (`/zh`)

> Copy rules, the locked EN↔ZH terminology table and the review checklist live
> in [CLAUDE.md](./CLAUDE.md). This section covers only the build mechanics.

Every marketing page has a Chinese mirror at `/zh` + the same path — the slug is
never translated. **The blog is English only** and must never gain a `/zh/blog`
URL or a `zh-Hans` alternate. See `src/i18n/config.ts` for the route list.

- **UI copy** (nav, footer, buttons, form labels) → `src/i18n/ui.ts`.
- **Page copy** → the page's own `content.ts` / `faq.ts`, exported as
  `Record<Locale, …>`; the component picks a branch with `useT(...)`.
- **`<head>` metadata** → English stays in the route's hand-written
  `<route>/index.html`; Chinese goes in `src/i18n/pageMeta.ts`.
- **Internal links** are always written in English form (`/pricing/`) and
  prefixed at render time by `useHref()`. Never hard-code `/zh/…`.

`npm run build` only emits the English shells. The `prerender` step then derives
each `/zh` shell from its English sibling, injects the hreflang cluster into
both, renders every route in both locales into `<div id="root">`, and writes
`dist/sitemap-pages.xml`. So **`npm run dev` shows `/zh` page bodies but not
`/zh` head metadata** — check that on `npm run preview`.

Adding a new marketing page: add its path to `MIRRORED_PATHS`, its Chinese
metadata to `ZH_PAGE_META`, and its component to `PAGES` in
`src/prerender.tsx`. The build fails loudly if the metadata is missing.

## Adding a Blog Post

> For a full SEO post (research, house style, wiring, PR, anti-duplication
> ledger) use the **`datus-blog` skill** at
> [`.claude/skills/datus-blog/`](./.claude/skills/datus-blog/) — `SKILL.md` is the
> SOP, `references/` the writing/SEO standard, `memory/covered-topics.md` the
> list of what's already published. The steps below are the bare mechanics.

1. **Create file**: `blog/posts/my-post.md`
```markdown
---
title: My Post Title
description: One-line summary used for the meta description and social cards.
author: Your Name
date: 2026-06-15
lastmod: 2026-06-15
---
## Start with an H2 — the title above is rendered as the page <h1>.
Content here...
```

2. **Categorize it** (optional): add the slug (`my-post`) to a category's
   `slugs` array in the `CATEGORIES` list in `scripts/build-blog.mjs`.
   Uncategorized posts automatically appear under "More essays".

3. **Build**: `npm run build:all`. The blog index, the post page (at
   `/blog/my-post/`), the legacy `/blog/posts/my-post/` redirect, and the
   sitemap entry are all generated automatically — no manual index/sidebar
   edits needed.

4. **Preview**: visit `/blog/` on the dev server (`npm run dev`, 5173) or the
   preview server (`npm run preview`, 4173).

## Key Commands

- `npm run dev` - Development mode
- `npm run build:all` - Build everything
- `npm run preview` - Preview production build

## Deployment

Push to `main` branch → GitHub Actions automatically deploys to GitHub Pages.


## Cookie consent and analytics

Marketing pages and the static blog load the same consent entry. Google
Analytics uses three states: no choice loads the SDK with analytics storage
`denied` for cookieless measurement; acceptance updates it to `granted` without
loading a second SDK; explicit rejection or withdrawal sets the GA property
disable flag and clears GA cookies in place. No consent transition reloads or
navigates the page, including cross-tab refusal and expiry, so unsaved input
survives. A saved refusal prevents loading GA on subsequent visits. If storage
is blocked, refusal still disables GA for the current visit. Reacceptance updates
consent while reusing the SDK.
Advertising storage, Google signals, and advertising personalization stay off.

The English and Chinese policies explain that limited measurements reach Google
before a choice. Website and Studio choices remain origin-specific, valid for
180 days; expiry returns to the limited state and shows the banner. The website
has no Datus first-party event collector. Its usage-analytics choice controls
Google Analytics and temporary campaign-source storage. The shared policy has
a Studio-specific section disclosing default
first-party product events, independent of the Google Analytics choice. Necessary
settings and diagnostic logging also remain independent.

After `npm run build:all`, run `npm run test:cookie-consent`. External analytics
is mocked. Verify initial denied-mode measurement without analytics cookies,
acceptance without duplicate initialization, full stop after rejection,
withdrawal, expired choices, storage failures, and centered responsive dialogs
across marketing, Chinese, policy, and blog routes.

## Studio CTA link tags

Start with [Datus UTM conventions](docs/utm-conventions.md) for parameter ownership, external channel defaults, naming, examples and Studio source fallback. Keep this policy and the [CTA inventory](docs/studio-cta-tags.csv) current when adding links.

All prerendered website links to Studio (including support and generated blog
links) use `utm_source=datus.ai` as a fallback and `utm_content` for the website
CTA's page and placement (for example `home_hero` or
`solutions_semantic_layer_header`). Chinese links prefix the value with
`zh_`. Reuse `src/lib/studio-cta.ts` for localized CTA labels and the shared
`src/lib/studio-url.mjs` builder for URL assembly in React and the blog generator.
The builder puts `utm_source` first, preserves destination paths and unrelated
query/hash values, and replaces the whole campaign.

Use `datus.ai` only when no valid campaign is available; never fill missing fields
in a partial external campaign. Do not invent `utm_medium` or `utm_campaign` for
website placements. The fallback is not stored as campaign evidence. After
hydration (or loading the static blog), `src/lib/studio-campaign.ts` copies only
those three fields from an external tagged arrival onto all HTTPS Studio links, retaining
the button's own `utm_content`. Without explicit UTM, recognized search hosts
from `document.referrer` supply a source plus `organic`; known AI chat products
supply their canonical product domain plus `referral`. Neither invents a
campaign. AI hosts cover ChatGPT, Claude, Perplexity, Gemini, Copilot and DeepSeek,
using exact matches rather than vendor-wide domains. See `src/lib/referrer-attribution.ts` for exact allowed hosts and common
paid-click identifiers that disable this inference and discard stale attribution.
Explicit UTM wins over inferred search/AI referrals; a new recognized arrival
replaces cached campaigns. Missing referrer and UTM cannot identify AI traffic.
An arrival with UTM replaces the entire campaign; missing fields are not filled
from an older campaign. Values must be
non-empty, at most 100 characters, and contain no control characters.

After accepting usage analytics, campaign fields and their capture time are
stored in `sessionStorage` for 30 minutes from capture, without sliding expiry.
Before acceptance, after refusal, or with unavailable storage, only the current
URL's values or recognized current search/AI referrer can be forwarded; otherwise
links use the website fallback. No complete
referrer URL or search terms are stored. Refusal, withdrawal, and expired consent clear
the cache. Dynamic menus, native new-tab opening, and back/forward restoration
use the same decorated hrefs. Separate tabs do not share session storage.
No new event collector, visitor ID, cross-domain consent, or registration event
is added. Studio must retain incoming parameters through its own sign-up flow.
See [the handoff specification](docs/studio-utm-handoff.md).
The static blog uses the same campaign handoff; its generated CTAs identify
placement with `blog_header` / `blog_cta`. Raw article links and support actions
retain their destinations and use the same source fallback and handoff.

After `npm run build:all`, run `npm run test:studio-campaign` to check URL
allowlisting, source/medium/campaign handoff, consent, expiration, locale and
mobile navigation, blocked storage, and campaign replacement. External requests
are mocked. Run `npm run test:cookie-consent` after consent-related changes.

## Public support center

`/support/` and `/zh/support/` are public marketing routes. Page copy and the
12 help guides live in `src/pages/support/content.ts`; the page reuses the site
navigation, footer, FAQ, and locale helpers. Search runs locally over those
guides and FAQ. Feedback points to Studio; email and community links use the
existing contact channels. There is no support-ticket backend in this repo.

After `npm run build:all`, run `npm run test:support` to check both locales:
prerendered body content, canonical/hreflang/FAQ data, search and guide dialogs,
focus restoration, template copying and failure feedback, locale links,
responsive layouts, sitemap entries, and blog links. External network calls are
stubbed; screenshots are written to `/tmp/datus-support-production/`.

## SEO and AI-readable product summaries

Keep English metadata in each route's `index.html` and Chinese metadata in
`src/i18n/pageMeta.ts` aligned with the approved positioning. The homepage,
Studio, Datus Agent and Semantic Layer solution use `src/seo/entities.ts` for
localized JSON-LD, prerendered by `PageEntities`. Their shared company/product
IDs stay stable across languages; each WebPage URL and title follows its locale.
Do not add parallel Organization or application schemas to these HTML heads.
Datus Agent is Apache-2.0; DOSI uses Elastic License 2.0 and executes compatible
Apache Ossie definitions. Apache Ossie is the open specification.

`src/public/llms.txt` is a curated navigation/summary aid, not a replacement for
crawlable HTML or a promise of AI citations. Update it when product positioning
or important canonical routes change. Leave crawler access policy in
`blog/public/robots.txt` explicit.

The sitemap index derives each child date from that child's recorded modification
dates. The blog index uses the latest article modification date (or its maintained
fallback date); individual article dates stay unchanged. Do not substitute build
time for content changes. Marketing dates remain in `scripts/lib/i18n-shells.mjs`.

After `npm run build:all`, run `npm run test:seo` for metadata, canonical URLs,
languages, JSON-LD identities/licensing, image existence, llms links and sitemap
dates. For updated share images, run `npm run og:build -- products-cli
products-studio solutions-semantic-layer` before rebuilding. Exports are 1200 ×
630 with the bundled Inter font; inspect the images after editing their copy.

## Apache Ossie converter routes

The hub is `/apache-ossie-converter/`. Dedicated source-to-target pages
(e.g. `cube-to-ossie/` and `ossie-to-cube/`) are listed in
`src/modules/semantic-converter/routes.ts` and mirrored into `/zh/`. Keep each
English HTML head, Chinese metadata, directional body/FAQ and CTA inventory
aligned. Vite and prerendering consume the same route list. Legacy semantic
converter URLs are redirect-only and preserve query/hash in the browser; the
sitemap includes only the new canonical pages.

After `npm run build:all`, run `npm run test:semantic-converter-links` for direct
routes, clean configuration URLs, metadata/locale updates, state preservation
and legacy redirects. Run `npm run test:semantic-converter-theme` for editor and
control theme behavior, and `npm run test:seo` for canonical/hreflang/SSR output.
