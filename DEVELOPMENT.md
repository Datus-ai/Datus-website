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

## Adding a Blog Post

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
