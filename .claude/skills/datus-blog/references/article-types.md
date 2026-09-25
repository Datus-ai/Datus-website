# Knowledge: Article Types — routing, length, Datus share, skeletons

Load at **Step 1** (to name the type) and **Step 3** (to pick the skeleton).
Route by **content intent**, not by which cluster the topic lives in: the
cluster decides the `CATEGORIES` entry in `scripts/build-blog.mjs`; the type
decides the template, length and gates. This repo has no `category` /
`secondaryCategory` frontmatter — don't add them.

---

## 1. Routing table

Match top to bottom; the first hit wins. If the operator gives only a keyword,
infer the type and state it in the Step 1 announcement.

| # | Type | Signals | Narrative words (target / floor) | Datus share cap | Default slug |
|:-:|---|---|---|:-:|---|
| 1 | **Product** | "introducing", release, capability launch | 1800–2800 / 1600 | 40% | `introducing-<thing>` |
| 2 | **Alternatives** | "<vendor> alternatives", "alternatives to <vendor>", "<vendor> competitors", "replace <vendor>" | 2400–3400 / 2200 | 20% | `<vendor>-alternatives` |
| 3 | **ToolsList** | "best", "tools", "list", landscape | 2800–4000 / 2600 | 25% | `best-<category>` |
| 4 | **GlossaryComparison** | "X vs Y" where X and Y are **concepts** | 2400–3400 / 2200 | 15% | `<a>-vs-<b>` |
| 5 | **Comparison** | "X vs Y" where X and Y are **products / platforms / implementations** | 2200–3200 / 2000 | 20% | `<a>-vs-<b>` |
| 6 | **GlossaryTerm** | "what is", a single term | 2200–3200 / 2000 | 15% | `what-is-<term>` |
| 7 | **Tutorial** | "build your first", "how to set up", step-by-step | 2500–3500 / 2300 | 30% | `<verb>-<object>` |
| 8 | **Research** | a deep guide, "how <vendor> works", a vendor deep dive | 2800–4500 / 2600 | 25% | `what-is-<vendor>` / topic |
| 9 | **Pillar** | a category hub: "what is <category>" + a multi-product framework | 3200–4800 / 3000 | 20% | `what-is-<category>` |

**Narrative words** exclude frontmatter, tables, code blocks and FAQ; measure
with `tools/check-post.mjs`. **Datus share** is the share of body paragraphs
that are about Datus; the tool estimates it.

Disambiguation:

| Case | Type |
|---|---|
| semantic layer vs ontology | GlossaryComparison (two concepts) |
| OSI vs dbt MetricFlow | Comparison (a standard vs an implementation) |
| what is Cube / GoodData / AtScale | Research (vendor deep dive) |
| Cube alternatives / dbt Semantic Layer alternatives | Alternatives (the reader already uses — or is evaluating — one named vendor) |
| best semantic layer tools | ToolsList (no incumbent; the whole category) |
| what is a data engineering agent, with many product examples | Pillar |
| a ported Medium / WeChat article | whatever it is — but the template does not override the author's structure (see `porting-external-articles.md`) |

Not yet templated — if the operator asks for one, say so and propose the
closest type: **CaseStudy** (named customer rollout), **PlatformOps**
(single-platform how-to).

## 2. Modules every type shares

These come from `blog-standard.md` and are not repeated per type:
single H1 = title; `## TL;DR` as the first block (3–6 bullets, the first one a
BLUF answer); numbered `## 1.` … `## N.` sections (Conclusion and FAQ are not
numbered); `## Conclusion`; `## Frequently asked questions` with 4–6 `###`
questions (≥2 is the hard floor for FAQPage JSON-LD); `## Related articles`;
no Disclosure block.

## 3. Skeletons by type

### GlossaryTerm
Definition-first opener → `## 1. <Term>: a working definition` (a blockquote
definition that says what it is **and is not**, 150–200 words usable as a
snippet) → boundaries / how it differs from neighbouring terms (table) → why it
exists / motivation → how it breaks in production (`###` failure modes) →
implementations / vendors (table, fair) → the agent / context angle →
practical checklist → Conclusion → FAQ → Related.
The full skeleton with notes is `blog-standard.md` §2.

### GlossaryComparison
Contrast opener ("A and B solve different problems but are often confused") →
define A → define B (if either already has a canonical post, 1–2 sentences +
link instead of a full definition) → comparison table, ≥6 rows → decision
framework (when you need which / both) → the agent / context angle → FAQ.

### Comparison
TL;DR → what each one is → big side-by-side table → per-option fair write-ups
(each with a genuine strength) → when to pick which → how they fit the stack /
agents → FAQ. For head-to-heads, resolve with "when to use which / they work
best together" rather than a winner.

### Alternatives
The reader already runs (or has shortlisted) one named product — the
**incumbent** — and wants to know whether to leave it and for what. That makes
it a different page from a ToolsList: it is organised around *reasons to
leave*, and the incumbent is one of the answers. Studied from
cube.dev/articles/dbt-semantic-layer-alternatives-2026 and
colrows.com/blogs/dbt-semantic-layer-alternatives (both Sept 2026 top results);
the moves below are the ones that make those pages useful, minus their
self-promotion.

```
## TL;DR                     ← the answer by driver, in 4–6 bullets; bullet 1 says when to stay
Opener                       ← which <incumbent> this is (vendor names collide), then what the reader would be replacing
## 1. What you'd actually be replacing
## 2. Why teams look for <incumbent> alternatives
## 3. How to evaluate an alternative
## 4. The alternatives                     ← one ### per option, identical fields
### <Option> — best for <one-line niche>
## 5. When <incumbent> is still the right choice
## 6. <Incumbent> alternatives at a glance  ← the one comparison table
## 7. How to choose                        ← decision paths by driver
## 8. Moving off <incumbent>               ← migration cost, what carries over
## 9. How this comparison was checked      ← fact-check date + sources
## Conclusion
## Frequently asked questions
## Related articles
```

Section notes:

1. **What you'd actually be replacing.** Split the incumbent into the layers
   people conflate — for Cube: Cube Core (the open-source semantic layer) vs
   CubeStore (the cache) vs Cube Cloud / its agentic analytics product; for
   dbt: dbt (transformation) vs the dbt Semantic Layer (serving). Most
   "alternatives" replace only one layer, and saying so up front is the
   information gain both reference pages lead with.
2. **Why teams look.** 3–5 concrete friction points, each with evidence:
   published pricing, a documented limit, a licence change, a vendor's own
   statement. No invented dissatisfaction ("users hate…"). This section is
   the spine of the post — every later section maps back to these drivers.
3. **How to evaluate.** 5–7 criteria tied to the drivers (e.g. caching,
   query interfaces, multi-warehouse compilation, who authors the semantics,
   AI-agent access / MCP, deployment model, pricing model).
4. **The alternatives.** 4–7 options. Every `###` carries the same fields, in
   the same order, so the reader can scan across them:
   - **Best for** — one line, a defensible niche
   - **Where it wins** — against the incumbent specifically, with sources
   - **Where it gets harder** — real trade-offs, as long as "where it wins";
     a lopsided entry fails R1
   - **Pricing** — published entry price with an "as of" date, or "quote
     only"; never an estimate presented as a price
   - **Moving from <incumbent>** — what carries over (definitions, dbt
     models, OSI / Apache Ossie YAML) and what must be rewritten

   Order by fit for the most common driver, not by preference. Apache Ossie +
   Dosi, or Datus, appear **only** where they genuinely replace the layer in
   question, **never first**, and with the same five fields including "where
   it gets harder". If the site's own narrative calls them complementary
   (e.g. `dosi-with-cube`), present them as a path that can run *alongside*
   the incumbent, not as a replacement — and ask the operator when unsure.
5. **When the incumbent is still right.** Mandatory, a real section, not a
   sentence: the conditions under which staying is the correct call, and what
   would change that (a "second consumer", a second warehouse, agent traffic).
   Both reference pages treat "stay" as a legitimate option; that fairness is
   why they are credible.
6. **At a glance.** One table, the incumbent as a column or row alongside the
   options, dimensions = the §3 criteria + "main trade-off". Cells are short
   facts, not marketing.
7. **How to choose.** 4–6 decision paths, "If <driver / estate shape> → <option>".
   Lead with judgement, not a single winner — no "our pick" verdict.
8. **Moving off the incumbent.** Switching cost: what is portable (dbt models,
   OSI YAML, SQL), what is not (proprietary modelling syntax, caches,
   embedded-analytics integrations), and a phased path (run both, move one
   consumer first). Keep it hedged; no invented migration timelines.
9. **How this comparison was checked.** The date the facts were verified and
   the kinds of sources used (official docs, pricing pages, repos), plus
   "verify against current vendor docs before deciding". This is a
   methodology note, **not** a Disclosure block: no "we are the vendor"
   paragraph (house rule, `blog-standard.md` §2).

FAQ: "Is <incumbent> open source / does it require <paid tier>?", "Can I use
<incumbent> and <option> together?", "What is the best open-source <incumbent>
alternative?", "Which alternative is best for AI agents?", "How hard is it to
migrate off <incumbent>?", plus People-Also-Ask for the query.

Links: link the incumbent's deep dive once, early (for Cube:
`cube-agentic-analytics`); link the category ToolsList instead of redescribing
every tool (`semantic-layer-tools-list-osi`); link each option's own deep
dive or head-to-head where one exists (`what-is-atscale`, `osi-vs-cube`,
`dbt-semantic-layer-metricflow`, `what-is-gooddata`). External links: the
incumbent's pricing and docs, and each option's official page.

### ToolsList
Market segments described in **prose** (no per-segment product tables) →
**one** product catalogue table → evaluation dimensions in depth → selection
framework → the agent angle → FAQ. Table budget: ≤3 tables in total, exactly
one of them the catalogue. At most 4 product paragraphs about Datus before
the FAQ.

### Research
TL;DR → background / why now → architecture or evolution → capability deep
dive → relationship to open standards and the Datus stack (restrained,
educational before product) → Conclusion → FAQ.

### Pillar
TL;DR → working definition → types / architecture sections → a comparison
framework across representative products → the context-layer narrative → FAQ.
Pillars are hubs: 4–6 internal links, mostly to their own spokes.

### Product
TL;DR → the problem → capability breakdown → how to use it (link docs, show the
real command) → relationship to the category → FAQ. Only shipped capabilities;
anything else is labelled as direction.

### Tutorial
TL;DR → prerequisites → numbered steps with real CLI / YAML → the daily
workflow after setup → troubleshooting → next steps / Studio CTA → practical
FAQ. Every command must be one you verified against docs.datus.ai or the repo.

## 4. Type gates (checked at the pre-publish audit)

| Type | Gate |
|---|---|
| GlossaryTerm / GlossaryComparison | **D1** an existing canonical term is not redefined in full (1–2 sentences + link). **D2** ≥2 internal blog links, ≤3 glossary links, 2–5 external. **D3** Datus share ≤15%. |
| Alternatives | **A1** a real "When <incumbent> is still the right choice" section. **A2** every option has all five fields, with "where it gets harder" given comparable weight to "where it wins". **A3** Datus / Dosi never listed first, never framed as a replacement where site copy calls it complementary; Datus share ≤20%. **A4** every price is published and dated, or marked "quote only"; the fact-check date appears in §9. |
| ToolsList | **T1** ≤3 tables, exactly one catalogue. **T2** ≥2 internal blog links, 2–5 external. **T3** Datus share ≤25%; ≤4 Datus product paragraphs before the FAQ. |
| Product / Tutorial | **P1** every capability claim links to docs or the repo. **P2** no unreleased features presented as shipped. **P3** Datus share ≤40% (Tutorial ≤30%). |
| Comparison / Research / Pillar | **R1** every competitor / platform statement is verifiable; proof-of-concept ≠ GA. **R2** Datus share ≤25% (Pillar ≤20%); educational sections come before product sections. |
