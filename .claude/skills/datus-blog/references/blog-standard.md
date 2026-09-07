# Knowledge: Blog Standard (house style + SEO)

Derived from a full read of the existing 60 posts. Match this exactly — new
posts must be indistinguishable in voice and structure from the best existing ones.
Reference exemplar: `blog/posts/what-is-schema-linking.md` (gold-standard glossary post).

## 1. Frontmatter (required)

```yaml
---
title: "What Is X? Definition, <Benefit> & <Differentiator>"   # < ~60 chars, keyword-first, quote if it has a colon
description: "150–160 chars, compelling, contains the keyword; this is the SERP snippet."
author: "Evan Paul"        # a byline; existing posts use e.g. Evan Paul / John Smith / Harrison Zhao / Datus Team
date: 2026-06-07
lastmod: 2026-06-07
head:
  - - meta
    - name: keywords
      content: "primary keyword, variant 1, variant 2, long-tail 3, related term"
  - - meta
    - property: og:title
      content: "<same as title>"
  - - meta
    - property: og:description
      content: "<same as description>"
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://datus.ai/blog/<slug>/
  - - meta
    - property: og:image
      content: https://datus.ai/logo_dark.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/<slug>/
---
```
Notes: the build script overrides canonical to `/blog/<slug>/` regardless, but keep the block consistent with recent posts. `og:image` default is `https://datus.ai/logo_dark.svg` (only add a per-post PNG if you actually create one under `blog/public/images/<slug>/`).

## 2. Body skeleton — glossary "What is X" (the most common request)

```
# <Title>                                   ← single H1, == title

## TL;DR                                     ← FIRST block, right under the title
- 4–6 tight bullets: the definition, the main failure mode, the key distinction,
  and the "context/agent" angle.

**<Term>** is <one-sentence crisp definition>. When <it fails / why it matters>,
<consequence>. This guide defines <term>, <what else it covers>.   ← bold-term opener, follows TL;DR, may inline-link a pillar post

## 1. <Term>: a working definition        ← numbered H2 sections
> A production-oriented definition in a blockquote.
(concrete examples, real column names, a table of ambiguities/variants)

## 2. Where it sits / how it works
## 3. Why it breaks in production          ← failure modes with ### sub-heads
## 4. <Techniques / implementations / vendors>   ← comparison table; name real tools with nofollow links
## 5. <Physical vs semantic / the AI-agent gap>  ← contrast table
## 6. How context engines / agents improve <term>  ← Datus angle, still educational
## 7. Practical checklist                  ← numbered, actionable

## Conclusion
Recap the thesis in 2–4 sentences; land the "context evolves → reliability" point.

## Frequently asked questions
### <Natural-language question a searcher would type>
<Detailed, honest 60–120-word answer. Concrete. Hedged where uncertain.>
### <Q2> …                                 ← at least 2; 4–6 is typical → auto FAQPage JSON-LD

## Related articles
- [<Existing post>](/blog/<slug>/) — <em-dash gloss>
- [<Existing post>](/blog/<slug>/) — <gloss>
- [<Existing post>](/blog/<slug>/) — <gloss>
```

> **No disclosure blocks.** Posts must NOT include a Disclosure paragraph — not
> the italic opener, not the closing italic, not a blockquote or inline
> parenthetical form. Keep Datus mentions educational and in-body only.

## 3. Other post templates (skeletons)
- **Comparison "X vs Y" / "Best … 2026":** TL;DR (first block) → provocative market-claim opener → "the categories, briefly" → one big side-by-side **comparison table** → fair per-option H3 write-ups (with "verify their own numbers" caveats) → "Decision framework" (Question 1/2/3) → recommendation → FAQ → Related articles. For head-to-heads, resolve with "when to use which / they work best together."
- **Thought-leadership / concept:** 2–3 line thesis hook that names a false binary and dissolves it ("Most copilots help with generation. Data engineering needs execution.") → argument sections ("N reasons", each `###`) → "what changes in practice" → FAQ → "Final takeaway" → "Continue reading" + soft Datus CTA.
- **How-to / tutorial:** framing → numbered step sections with CLI/YAML code blocks → "next steps" → Try-Studio CTA → practical FAQ.

## 4. House voice (non-negotiable)
- **Reader:** a data engineer / analyst / data leader evaluating the space. Address them as "you / your stack / your warehouse."
- **Tone:** authoritative, concrete, calm, honest, mildly contrarian. No hype adjectives, no emoji in body, no marketing fluff.
- **Rhythm:** lead with a one-line thesis paragraph. Alternate short declaratives with longer analytical sentences. Em-dashes and parentheticals are on-brand. **Bold** key terms on first use.
- **Concreteness:** use real column names (`fact_orders.net_revenue_usd`), real failure modes, real trade-offs and hedged ranges ("5–15%", "typically", "as of 2026"). Never present invented numbers as hard facts.
- **Fairness:** name competitors directly and describe them fairly; tell readers to verify vendor numbers themselves.
- **Length:** long-form. Glossary/comparison flagships ≈ 180–240+ body lines, 6–8 sections, ≥1 big table, 4–6 FAQ. Depth is the SEO moat.

## 5. How to mention Datus (do NOT over-sell)
- Glossary/thought posts: Datus appears mainly in the "how context engines/agents improve X" section — educational framing, complementary ("Datus does not replace the semantic layer — it sits above and around it"). No disclosure block (see §2).
- Comparison/tutorial/product posts: Datus can appear throughout, still fair and honest ("architectural direction, not the shipped feature set" when talking roadmap).
- Always: open-source / Apache-2.0 framing; link Studio/GitHub/Docs where natural.

## 6. Links
- **Internal:** Markdown, root-relative, short URL: `[text](/blog/<slug>/)`. Only link posts that exist in `blog/posts/`. 3–6 per article + the matching `/glossary/` where relevant. Favor the hub posts (`what-is-data-engineering-agent-2026`, `what-is-semantic-layer`, `contextual-data-engineering`).
- **External:** raw HTML with `rel="nofollow noopener"`: `<a href="https://…" rel="nofollow noopener">Name</a>`. Use for competitor/reference/source links.

## 7. Formatting
- One H1 only (the title). Body uses `##` / `###` (rarely deeper).
- Markdown tables for comparisons/contrasts (a strong ranking signal — most posts have ≥1).
- Blockquotes for definitions and worked scenarios. Fenced code blocks for SQL/YAML/JSON/CLI.
- Bulleted + bold-lead-in lists ("**Context-switching.** …").

## 8. Quality bar (reject if any fail)
- Says something the current top-ranking results don't (differentiated).
- Every claim is verifiable; nothing fabricated.
- Reads like the existing best posts; a reader can't tell it's newly added.
- Answers the search intent completely in the first screen (definition posts define in sentence 1).
