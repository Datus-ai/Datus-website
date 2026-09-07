# Knowledge: Website Overview

How datus.ai is built, so blog posts wire in correctly and render.

## Repo
- Remote `Datus-ai/Datus-website`, base branch `main`. The blog skill config lives inside that repo at `.claude/skills/datus-blog/`; the working repo is the repo root.
- Deploy: on push/merge to `main`, `.github/workflows/deploy.yml` runs `npm run build:all` and publishes `dist/` to **GitHub Pages** (production `https://datus.ai`). So a merged PR auto-publishes; no manual deploy.

## Two rendering systems in one repo
1. **React MPA (marketing pages)** — Vite. Routes like `/`, `/integrations/`, `/mcp/`, `/pricing/` are `<route>/index.html` → `src/pages/<route>/main.tsx` → `Page.tsx`, prerendered by `scripts/prerender.mjs`. **Blog posts are NOT part of this.**
2. **Static blog generator** — `scripts/build-blog.mjs` renders `blog/posts/*.md` into styled static HTML at **`/blog/<slug>/`**, builds the category index at `/blog/`, and writes redirect stubs at the old `/blog/posts/<slug>/` paths. This is what the blog agent works with.

## Build commands
- `npm run dev` — vite dev server (React pages only; **does not render blog posts**).
- `npm run build:all` — `vite build` + `prerender` + `blog:build` + clean. **Required to see a blog post.**
- `npm run preview` — serves the built `dist/` at **`http://localhost:4173`**.
- `npm run blog:build` — blog only (still needs a prior `vite build` for shared assets; use `build:all` to be safe).

## Blog pipeline specifics (`scripts/build-blog.mjs`)
- **Discovery:** every `blog/posts/*.md` except `index.md` is rendered automatically. A new post appears even if not categorized (it falls into a "More essays" section) — but you should categorize it.
- **Canonical/URL:** the script hard-sets `canonical = https://datus.ai/blog/<slug>/`. Whatever canonical/og:url you put in frontmatter `head` is ignored (only `head` → `keywords` is used). So the real URL is always `/blog/<slug>/`.
- **CATEGORIES:** an array near the top maps category label → list of slugs (controls the `/blog/` index grouping and the per-post category eyebrow badge). Add your slug to the right one.
- **FAQ → schema:** if the body has a `## Frequently asked questions` H2 with `###` questions (≥2), the script emits `FAQPage` JSON-LD automatically, byte-parity with the visible DOM. Just write the section.
- **Article JSON-LD + BreadcrumbList** are emitted automatically per post.
- **TL;DR:** a `## TL;DR` section gets special styling (`wrapTldr`).
- **Hero image:** frontmatter `heroImage`/`heroImageAlt` wins; else the first body image is promoted to the hero; else text-only hero. Images are optional — this is a text-first SEO blog.
- **Reading time, TOC, share links** are generated automatically from the rendered HTML.

## Other site pieces the blog touches
- **Sitemap:** nothing to edit by hand. `build-blog.mjs` writes `dist/blog/sitemap.xml` from the posts it discovers and the `dist/sitemap.xml` index that points at it (plus `dist/sitemap-pages.xml` from the prerender step). `src/public/sitemap.xml` is only a build-time fallback — do NOT add posts to it.
- **Glossary:** `src/glossary/glossaryData.ts` — categories → terms `{term, slug, definition, article?}`. Rendered at `/glossary/`. Set a term's `article: "/blog/<slug>/"` when you publish its post.
- **Blog pillar page:** `blog/data-engineering-agent/index.md` (`/data-engineering-agent/`) — the hub; optionally add a related link.

## Product surfaces & canonical links (for CTAs / mentions)
- Studio (hosted, free): `https://studio.datus.ai/overview`
- GitHub (Apache-2.0): `https://github.com/Datus-ai/Datus-agent`
- Docs: `https://docs.datus.ai`
- Main site: `https://datus.ai`
- Product pages on-site: `/products/cli/`, `/products/studio/`, `/products/vscode/`, `/products/enterprise/`, plus `/mcp/`, `/chatbot/`, `/integrations/`, `/databases/`, `/models/`.
