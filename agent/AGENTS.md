# AGENTS.md — Operating Playbook

> ## ⛔ STOP — load these files FIRST (mandatory, in order)
> Do **not** start any work until you have actually opened and read every file
> below (paths are relative to this `agent/` directory). This is required whether
> or not a runtime auto-loads them — if you skip them you will violate the rules
> you don't yet know exist.
>
> 1. [ ] `IDENTITY.md` — who you are and your scope
> 2. [ ] `SOUL.md` — non-negotiable principles (truth over volume, no duplicates, house voice, one post = one PR). **These override convenience.**
> 3. [ ] `USER.md` — the operator, the review/merge loop, and the definition of done
> 4. [ ] `knowledge/seo-and-research.md` — the SEO goal + the "research first, never fabricate" hard rule
> 5. [ ] `knowledge/blog-standard.md` — frontmatter, house style, SEO, post templates
> 6. [ ] `knowledge/website-overview.md` — the site & blog build pipeline, commands, URLs
> 7. [ ] `knowledge/product-positioning.md` — what Datus is + canonical vocabulary
> 8. [ ] `knowledge/glossary-directions.md` — candidate topics + how to choose
> 9. [ ] `memory/covered-topics.md` — **read before choosing any topic; skip anything already covered**
>
> After reading, briefly confirm to the operator (in 中文) that you've loaded the
> config, then proceed with the workflow below. Re-read `memory/covered-topics.md`
> at the start of **every** new post.

This is the step-by-step SOP for producing one Datus blog post end to end. The
files above are the full context; this playbook is the procedure that uses them.

**Trigger:** the operator asks for a blog post, e.g. *"写一篇 blog，从 /glossary 挑一个方向。"*

**Golden rules (from SOUL.md):** research before writing, never fabricate,
never duplicate an existing topic, match the house style, only commit relevant
files, one post = one branch = one PR, keep the operator updated in 中文.

---

## Key locations & facts

| Thing | Value |
|---|---|
| Working repo | the repo root that contains this `agent/` dir — the Datus-website site |
| Git remote / base branch | `Datus-ai/Datus-website` / `main` |
| Post source file | `blog/posts/<slug>.md` |
| Live URL & canonical | `https://datus.ai/blog/<slug>/` (short URL — the build script sets this canonical automatically) |
| Local preview URL | `http://localhost:4173/blog/<slug>/` |
| Glossary source (directions) | `src/glossary/glossaryData.ts` |
| Blog build script (categories live here) | `scripts/build-blog.mjs` → `CATEGORIES` |
| Sitemap | `src/public/sitemap.xml` |
| Images (optional) | `blog/public/images/<slug>/…`, referenced as `/blog/images/<slug>/…` |

**Build is static.** `npm run dev` (vite) does NOT render blog posts — they only
exist after the static build. Always preview with `build:all` + `preview`.

---

## The workflow

### Step 0 — Sync the repo
Run all shell commands from the **repo root** (the parent of this `agent/` directory).
```bash
git checkout main && git pull
```

### Step 1 — Choose a direction (and check it's not covered)
1. Open `src/glossary/glossaryData.ts`. Prefer a term with **no `article:` link yet** (an "open direction" — see `knowledge/glossary-directions.md`).
2. Open `memory/covered-topics.md`. **Skip anything already covered** or a near-duplicate angle. If the best term is partly covered, either pick another or define a genuinely new angle and note the difference.
3. Evaluate 2–3 candidates on: search value (is it a term people search?), fit with Datus's story, and whitespace (can we say something the current top results don't?).
4. Announce the pick to the operator in 中文 with a one-line rationale. If two are equally good, ask; otherwise proceed.

### Step 2 — Research FIRST (never skip, never invent)
Before drafting, gather **current, authoritative** material (see `knowledge/seo-and-research.md`):
- Web-search the term: official docs/specs, primary sources, credible 2025–2026 articles, the actual vendors involved.
- Read enough to understand the concept deeply, its real trade-offs, current state of the art, and how competitors frame it.
- Collect the exact facts/numbers/quotes you'll cite, each with a real source URL (these become `rel="nofollow noopener"` external links).
- Note the current top-ranking pages for the keyword and how to beat them (depth, honesty, a table they lack, a failure-mode walkthrough).
- If you cannot verify a claim, do not make it. Hedge honestly.

### Step 3 — Write the post
Create `blog/posts/<slug>.md` following `knowledge/blog-standard.md` exactly:
- Correct frontmatter (title, description 150–160 chars, author, date, lastmod, `head` with keywords + OG/Twitter + canonical).
- House structure for the post type (glossary / comparison / thought-leadership / how-to — templates in the standard).
- Single H1 = title; bold one-sentence definition opener; italic **Disclosure** line; `## TL;DR`; numbered `##` sections; tables; `## Frequently asked questions` (≥2 `###` Q&A → auto FAQPage JSON-LD); `## Related articles`; closing italic **Disclosure**.
- House voice & canonical vocabulary (`knowledge/product-positioning.md`). Educational first, Datus via disclosure — not a sales pitch.
- **Internal links:** 3–6 to existing posts using `/blog/<slug>/`, plus link the matching `/glossary/` where relevant. Only link posts that exist (check `blog/posts/`).

### Step 4 — Wire it into the site
1. **Sitemap** — add to `src/public/sitemap.xml`:
   ```xml
   <url>
     <loc>https://datus.ai/blog/<slug>/</loc>
     <lastmod>YYYY-MM-DD</lastmod>
     <changefreq>monthly</changefreq>
     <priority>0.7</priority>
   </url>
   ```
2. **Blog category** — add the slug to the right category's `slugs` array in `scripts/build-blog.mjs` `CATEGORIES` (glossary terms → the `"Glossary"` or `"Semantic Layer"` category). (If skipped it lands in "More essays" — prefer the right home.)
3. **Glossary cross-link** — in `src/glossary/glossaryData.ts`, set the term's `article: "/blog/<slug>/"` so the glossary page links to the new post (internal-link + SEO win).
4. **Reciprocal internal links** — add a "Related articles" link to the new post from 1–2 closely related existing posts if natural.

### Step 5 — Build & preview locally, open the page
```bash
npm run build:all        # vite build + prerender + blog:build + clean
npm run preview          # serves dist/ at http://localhost:4173  (leave running)
```
Then open the page for the operator:
```bash
open "http://localhost:4173/blog/<slug>/"
```
Verify before handing off: page renders, title/hero correct, internal links resolve, no broken images, FAQ shows, view-source shows the meta + JSON-LD. Fix anything broken before continuing.

### Step 6 — Open a PR
```bash
git checkout -b blog/<slug>
# stage ONLY the files this post touched — never `git add -A`:
git add blog/posts/<slug>.md src/public/sitemap.xml scripts/build-blog.mjs src/glossary/glossaryData.ts
#   (+ blog/public/images/<slug>/ if you added images, + any related post you edited)
git commit -m "blog: <Title>"
git push -u origin blog/<slug>
gh pr create --base main --title "blog: <Title>" --body "<what/why, target keyword, sources, local URL>"
```
The repo auto-deploys to GitHub Pages when the PR is merged to `main` (`.github/workflows/deploy.yml` runs `build:all`). The operator merges.

### Step 7 — Record it in memory
Append a record to `memory/covered-topics.md` (see `memory/README.md` for the format): slug, title, target keyword, angle, source direction, key sources, PR link, date. This is what prevents duplicate posts next time.

### Step 8 — Report to the operator (中文)
Send: chosen direction + rationale, the sources you researched, the local review URL, and the PR link.

---

## Iteration loop (operator feedback)
- The operator reviews the local page / PR. If good, **they merge**.
- If they give feedback: edit the post (and wiring) on the **same branch**, re-run `npm run build:all` + `npm run preview`, re-open the page, then:
  ```bash
  git add <changed files>
  git commit -m "blog: address review — <summary>"
  git push        # updates the SAME PR — never open a new one
  ```
- Update the memory record if the angle/keyword changed materially.

---

## Guardrails checklist (every post, before PR)
- [ ] Direction checked against `memory/covered-topics.md` — not a duplicate.
- [ ] Researched against real, current sources; every fact/number/quote is verifiable; external links `nofollow noopener`.
- [ ] Frontmatter complete; description 150–160 chars; title < ~60 chars with the keyword.
- [ ] House structure + voice; single H1; TL;DR; FAQ (≥2 Q); Related articles; disclosure lines.
- [ ] 3–6 internal links to existing posts (`/blog/<slug>/`) + glossary cross-link set.
- [ ] Sitemap + build-blog category + glossaryData `article` updated.
- [ ] `npm run build:all` succeeds; page verified at `http://localhost:4173/blog/<slug>/`.
- [ ] Only relevant files staged (no `.idea/`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`).
- [ ] PR opened on `Datus-ai/Datus-website`; memory record appended; 中文 summary sent.
