# Knowledge: Research Protocol — Research Triangle, SERP Fit, Source Map

Load at **Step 2**. This is how the "never fabricate" rule in
`seo-and-research.md` is actually executed. Research produces three artifacts —
a **Research Log**, a **SERP Fit** and a **Source Map** — which go into the PR
description (not the post, not the repo), so the reviewer can check every claim
without redoing the research.

Web search / fetch is mandatory. If it is unavailable, stop and tell the
operator; do not fall back to memory.

---

## 1. The research triangle

Three sources, in this order. Skipping one is the most common reason a post
ends up restating the SERP or contradicting the product.

| Leg | What | Where |
|---|---|---|
| **R1 — Project truth** | What Datus actually ships and how the site already covers the topic | `product-positioning.md`, the current homepage copy in `src/content/home.tsx`, docs.datus.ai, the Datus-agent GitHub repo, and the existing posts in the same cluster (`blog/posts/`) |
| **R2 — Search** | The current SERP for the primary keyword plus 2–3 variants; People-Also-Ask / related searches. Also the **bare** head term, with each top-10 result labelled by which entity it is about (the entity check, `topic-selection.md` §4) | Web search |
| **R3 — Fetch and read** | The top 3–5 ranking pages **read in full**, plus the primary sources behind the claims you'll cite (specs, official docs, release notes, vendor pages) | Web fetch |

R3 means reading, not skimming snippets. A claim you cite must come from a page
you actually opened.

## 2. Research Log (PR artifact)

```markdown
## Research Log

**Primary keyword**: …   **Variants**: …
**R1 project truth**: <what Datus ships that is relevant; existing posts in the cluster>
**R2 queries run**: "…", "…", "…"
**R3 fetched**:
| # | URL | Type (SERP / primary source) | What it establishes |
|---|-----|------------------------------|---------------------|
**Degraded**: <none | what could not be verified and how the post handles it>
```

## 3. SERP Fit (PR artifact)

```markdown
## SERP Fit

**Search intent**: Definition | Comparison | Tutorial | Tools list | Commercial
**Entity check** (bare term, top 10): <n>/10 about our entity — Unambiguous | Split | Owned by another entity; others: <entity: n, …>; qualifier used: <…>
**Top ranking pages**:
1. URL — covers: …
2. URL — covers: …
3. URL — covers: …
**What they all cover**: …
**What they miss or get wrong**: …
**Our unique contribution**: …
**Snippet-ready definition (40–60 words)**: …
```

Checks, re-run at the self-check step:
- [ ] The title matches the search intent.
- [ ] The first 200 words tell the reader they are in the right place — on a
      split SERP, the opening paragraph names which entity the page is about.
- [ ] On a split SERP, the title, slug and keywords meta carry the qualifier.
- [ ] The FAQ covers the People-Also-Ask questions.
- [ ] There is a 40–60-word snippet-ready definition (TL;DR first bullet or the
      opening paragraph).
- [ ] The slug is aligned with the primary keyword.

## 4. Synthesis Statement and Information Gain

Before writing a single heading, write three sentences. Each must point at a row
in the Research Log.

1. **What the SERP doesn't say** — what the top 5 omit, blur or get wrong.
2. **The one-line thesis** — a claim you cannot find stated in any of the top 5.
   If you can find it, the post has no angle yet: re-synthesise or go back to
   Gate A.
3. **What changes for the reader** — the specific decision or action they take
   differently after reading.

Then answer the three Information Gain questions honestly:

| # | Question | Failing answer |
|---|---|---|
| IG-1 | Could the core claim be pasted into ten other articles on this topic unchanged? | Yes → too generic |
| IG-2 | If this post were deleted, would the web lose anything substantive? | No → don't write it |
| IG-3 | Can the answer to the primary intent stand alone in 40–60 words inside the first 30% of the post? | No → restructure |

Candidate examples: list the concrete examples you plan to use (a real schema,
a named vendor behaviour, a documented incident). Vague examples ("a B2B
company…") are not allowed; prefer ones backed by a fetched source.

## 5. Source Map (PR artifact) and claim levels

Every factual claim in the draft gets a row. New claims added while drafting get
a row too.

```markdown
## Source Map

| Claim | Section | Level | Source URL | Checked | Confidence |
|-------|---------|-------|-----------|---------|:----------:|
| Cube participates in the OSI working group | §4 | P0 | https://… | 2026-09-25 | High |
```

| Level | Kind of claim | Minimum evidence |
|---|---|---|
| **P0** | Numbers (stars, %, ROI, latency, counts), competitor status (GA / Preview / Archived / shut down / acquired), pricing, Datus capabilities, customer names | Official source URL + an "as of <Month YYYY>" in the copy. High confidence only. |
| **P1** | Definitions, architecture, how a product works | Official docs, specs, standards, the vendor's own pages |
| **P2** | Industry context, history, trends | Credible secondary sources; phrase as "increasingly common", never "everyone" |
| **Banned** | "Most teams…", "industry-leading…" with no data | Rewrite as a qualitative, hedged statement or delete |

Confidence: **High** = primary / official; **Medium** = an internal or single
secondary account; **Low** = inference. Low-confidence claims may never carry
the core argument.

### Attribution patterns

- Stars / counts: "As of September 2026, the Cube repository reports roughly N
  GitHub stars." — never a bare number.
- Customer or case numbers: only when the operator supplies or approves them;
  label proof-of-concept as proof-of-concept, never as production.
- Roadmap vs shipped: "has announced / intends to" is not "supports". A
  converter that is discussed but unmerged is **intent**, not a shipped path.
- Datus capabilities: must be traceable to docs.datus.ai, the repo, or current
  site copy. If the only evidence is a roadmap slide, don't claim it.

### Preferred source classes

| Area | Sources |
|---|---|
| Semantic layer / metrics | docs.getdbt.com, cube.dev/docs, Looker / LookML docs, the Apache Ossie (OSI) repo and spec |
| Lakehouse / formats | iceberg.apache.org, docs.delta.io, hudi.apache.org, databricks.com docs |
| Warehouses | docs.snowflake.com, cloud.google.com/bigquery/docs |
| Catalog / governance | datahubproject.io, open-metadata.org, vendor docs |
| MCP | modelcontextprotocol.io, anthropic.com |
| Datus | docs.datus.ai, github.com/Datus-ai/Datus-agent, dosi.datus.ai |

## 6. Gate 0R — before drafting

All must hold, or go back:
- [ ] R1, R2 and R3 done; Research Log filled.
- [ ] SERP Fit filled, including the entity check and the snippet-ready definition.
- [ ] Synthesis Statement written; IG-1 to IG-3 pass.
- [ ] Every claim you already intend to make has a Source Map row.
