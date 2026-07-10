# Knowledge: SEO Goal & Research Discipline

## The site-wide goal
Get datus.ai **indexed and ranked highly on Google & Bing** for the terms data
teams search, so the market discovers Datus. Every blog post is an SEO asset
serving that goal. Quality and trust are the strategy — Google rewards genuinely
useful, accurate, experience-backed pages (E-E-A-T); thin/spun/invented content
gets buried and drags down the whole domain.

## Research FIRST — the hard rule
Never write from memory alone. Before drafting any post:

1. **Search the term** on the open web. Pull:
   - Primary/authoritative sources: official docs, specs, standards bodies, the actual vendors' own pages, release notes, reputable engineering blogs, papers.
   - Current (2025–2026) state of the art — the space moves fast; don't rely on stale training data.
2. **Understand it deeply** — the real definition, mechanics, trade-offs, failure modes, and how practitioners actually talk about it.
3. **Collect citable facts** — every number, date, capability, quote, or competitor claim you'll use, each tied to a real source URL. Those become `rel="nofollow noopener"` external links in the post.
4. **Scout the SERP** — look at what currently ranks for the target keyword. Identify how to be better: more depth, an honest comparison table they lack, a concrete failure-mode walkthrough, a clearer definition, updated 2026 facts.
5. **If you can't verify it, don't claim it.** Hedge honestly ("typically", "in practice", "as of 2026") or leave it out. This is a hard line from `SOUL.md` and an explicit operator requirement.

## On-page SEO checklist (per post)
- **Title** — keyword-first, < ~60 chars, compelling. Pattern for definitions: "What Is X? Definition, <benefit> & <differentiator>".
- **Description** — 150–160 chars, contains the keyword, earns the click (this is the SERP snippet).
- **Keywords** meta — primary + 4–6 variants/long-tails in `head`.
- **One H1** = the title; logical `##`/`###` outline; the term defined in the first sentence.
- **Structured data** — Article + BreadcrumbList emitted automatically; add a real `## Frequently asked questions` (≥2 Q) so `FAQPage` JSON-LD is generated (rich-result eligibility).
- **Internal links** — 3–6 to existing posts + the `/glossary/` cross-link; set the glossary term's `article` back to this post. Build the hub-and-spoke (link the pillar posts).
- **Depth + tables** — long-form with ≥1 comparison table; depth is the moat.
- **Freshness** — accurate `date`/`lastmod`; cite current sources.
- **Canonical** — `/blog/<slug>/` (build sets it); add to `sitemap.xml`.
- **Differentiation** — the page must say something the current top results don't.

## What NOT to do (SEO-harmful)
- Don't duplicate an existing post's topic/angle (check `memory/covered-topics.md`) — internal duplication splits ranking signals. The corpus already has a couple of accidental near-duplicates; don't add more.
- Don't keyword-stuff, don't invent stats, don't publish thin pages.
- Don't link to non-existent internal posts (creates 404s). Verify targets exist in `blog/posts/`.
- Don't `dofollow` competitor/external links (use `nofollow noopener`).
