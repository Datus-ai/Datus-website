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
| 2 | **ToolsList** | "best", "tools", "list", landscape | 2800–4000 / 2600 | 25% | `best-<category>` |
| 3 | **GlossaryComparison** | "X vs Y" where X and Y are **concepts** | 2400–3400 / 2200 | 15% | `<a>-vs-<b>` |
| 4 | **Comparison** | "X vs Y" where X and Y are **products / platforms / implementations** | 2200–3200 / 2000 | 20% | `<a>-vs-<b>` |
| 5 | **GlossaryTerm** | "what is", a single term | 2200–3200 / 2000 | 15% | `what-is-<term>` |
| 6 | **Tutorial** | "build your first", "how to set up", step-by-step | 2500–3500 / 2300 | 30% | `<verb>-<object>` |
| 7 | **Research** | a deep guide, "how <vendor> works", a vendor deep dive | 2800–4500 / 2600 | 25% | `what-is-<vendor>` / topic |
| 8 | **Pillar** | a category hub: "what is <category>" + a multi-product framework | 3200–4800 / 3000 | 20% | `what-is-<category>` |

**Narrative words** exclude frontmatter, tables, code blocks and FAQ; measure
with `tools/check-post.mjs`. **Datus share** is the share of body paragraphs
that are about Datus; the tool estimates it.

Disambiguation:

| Case | Type |
|---|---|
| semantic layer vs ontology | GlossaryComparison (two concepts) |
| OSI vs dbt MetricFlow | Comparison (a standard vs an implementation) |
| what is Cube / GoodData / AtScale | Research (vendor deep dive) |
| what is a data engineering agent, with many product examples | Pillar |
| a ported Medium / WeChat article | whatever it is — but the template does not override the author's structure (see `porting-external-articles.md`) |

Not yet templated — if the operator asks for one, say so and propose the
closest type: **CaseStudy** (named customer rollout), **Alternatives**
("alternatives to <vendor>"), **PlatformOps** (single-platform how-to).

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
| ToolsList | **T1** ≤3 tables, exactly one catalogue. **T2** ≥2 internal blog links, 2–5 external. **T3** Datus share ≤25%; ≤4 Datus product paragraphs before the FAQ. |
| Product / Tutorial | **P1** every capability claim links to docs or the repo. **P2** no unreleased features presented as shipped. **P3** Datus share ≤40% (Tutorial ≤30%). |
| Comparison / Research / Pillar | **R1** every competitor / platform statement is verifiable; proof-of-concept ≠ GA. **R2** Datus share ≤25% (Pillar ≤20%); educational sections come before product sections. |
