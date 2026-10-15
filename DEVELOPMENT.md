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
loading a second SDK; explicit rejection or withdrawal disables analytics and
reloads with the saved refusal so the SDK does not run. If storage is blocked,
refusal disables the running SDK without reloading into an older saved grant.
Advertising storage, Google signals, and advertising personalization stay off.

The English and Chinese policies explain that limited measurements reach Google
before a choice. Website and Studio choices remain origin-specific, valid for
180 days; expiry returns to the limited state and shows the banner. Studio
first-party identifiers and usage-event queues remain acceptance-only. Necessary
settings and diagnostic logging do not depend on the analytics choice.

After `npm run build:all`, run `npm run test:cookie-consent`. External analytics
is mocked. Verify initial denied-mode measurement without analytics cookies,
acceptance without duplicate initialization, full stop after rejection,
withdrawal, expired choices, storage failures, and centered responsive dialogs
across marketing, Chinese, policy, and blog routes.
