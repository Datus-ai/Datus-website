# Knowledge: Topic Selection — Investment Score, Gate A, Slug Gate

Load at **Step 1**. The goal of this step is to reject a topic *before* any
research money is spent on it. Most bad posts on a young domain are not badly
written — they are the second page competing for a query the site already
answers, or a page nobody searches for.

Inputs: `src/glossary/glossaryData.ts`, `../memory/covered-topics.md`,
`scripts/build-blog.mjs` → `CATEGORIES`, and `ls blog/posts/`. The ledger and the
real `blog/posts/` directory are authoritative; this file's cluster map is a
snapshot that drifts as posts ship.

---

## 1. Classify the candidate against the content graph

Every post is either a **hub** (the canonical page for a head term) or a
**spoke** (a narrower page that links up to its hub). Decide which one the
candidate is before scoring it.

| Cluster (`CATEGORIES` label) | Hub slug(s) — link up to these | Typical spokes |
|---|---|---|
| Data Engineering Agent | `what-is-data-engineering-agent-2026` (canonical definition), `contextual-data-engineering` (narrative) | comparisons, `vs` pages, platform agents (Genie, Cortex Analyst), use cases |
| Semantic Layer | `what-is-semantic-layer` | metric layer, semantic model, ontology, OSI / Apache Ossie, Dosi, vendor deep dives (Cube, GoodData, AtScale, Timbr) |
| Semantic Layer → OSI sub-cluster | `open-semantic-interchange-osi` | `osi-vs-*`, `what-is-snowflake-osi`, interoperability |
| Semantic Layer → Dosi sub-cluster | `introducing-dosi` | `dosi-*`, `first-native-apache-ossie-engine`, `why-osi-needs-execution-engine` |
| Glossary | the individual `what-is-*` term post | — (each term is its own hub; spokes live in other clusters) |
| Releases | `introducing-datus-knowledge`, `introducing-datus-subagents` | feature / adapter announcements |

`what-is-data-agent` is the parent-term hub for "data agent"; keep semantic-layer
vendors (Cube / AtScale / Timbr) out of it.

## 2. Gate A — KEEP / MERGE / STOP

Run this before scoring. Output one line: `Gate A: KEEP | MERGE → <slug> | STOP`.

**KEEP** needs at least two of:
1. A distinct search intent no existing post targets (check titles, not just
   slugs — two near-identical titles cannibalise even with different slugs).
2. Information gain over the current top results (see
   `research-protocol.md` §4) that is realistic to deliver.
3. A clear place in the content graph (a hub, or a spoke with a hub to link to).

**MERGE** when the term already has a canonical post. Do not write a second full
definition. Either improve the existing post (that becomes a refresh — see
`retro-audit.md`) or write a narrower spoke that defines the term in 1–2
sentences and links to the canonical page.

**STOP** when the idea fails Gate A and no narrower angle exists. Tell the
operator why and propose the next candidate.

### Known cannibalisation traps

| New idea | Action |
|---|---|
| Another "what is a data engineering agent" | MERGE → `what-is-data-engineering-agent-2026` |
| Another "best data engineering agents" | MERGE → `best-data-engineering-agents-2026` (two already exist) |
| Semantic layer vs ontology | Already two pages with deliberately split intents (`semantic-layer-vs-ontology` = head-term comparison, `semantic-layer-vs-ontology-difference` = definitions / when you need each). Do not add a third. |
| Another "why context matters for agents" essay | The context cluster is saturated (`contextual-data-engineering`, `context-engine-*`, `how-structured-context-*`, `why-ai-agents-need-semantic-context-*`). Needs a sharply distinct angle or STOP. |
| OSI standard definition | Link `open-semantic-interchange-osi`; never redefine the standard in full |
| A tools list for semantic layers | Link the canonical glossary posts rather than re-explaining each concept |
| A Dosi / product piece | Link the OSI hub; never restate the standard |

## 3. Investment Score

Score each of 2–3 surviving candidates 1–5 on five factors; take the mean.

| Factor | 1 | 5 |
|---|---|---|
| Search demand | Almost nobody searches it | Steady or rising demand (glossary "what is X" terms usually score well) |
| Business relevance | Unrelated to the ICP | Close to evaluating or adopting a data context layer / agent |
| Differentiation | We could only restate the SERP | We have a real angle, example or proof nobody else has |
| Evidence availability | Claims could not be verified | Official docs / specs / primary sources exist for every claim |
| Shelf life | Stale within 3 months | Evergreen for 2+ years |

| Mean | Action |
|---|---|
| ≥ 4.0 | KEEP — proceed |
| 3.0–3.9 | Narrow the angle or pick another candidate |
| < 3.0 | MERGE / STOP |

Search demand is a judgement call unless the operator supplies data. If the
`datus-seo-weekly` report exists, its query and opportunity tables are the best
evidence available — cite them.

**ICP**, for business relevance: primary = data engineer / analytics engineer;
secondary = head of data / CDO; tertiary = analyst / platform owner.

## 4. Slug Gate (Gate B)

A slug is permanent — renaming one later costs a re-index and every inbound
link (PR #80 had to do exactly that).

| Rule | Detail |
|---|---|
| Format | lowercase kebab-case ASCII, ≤ 60 chars, ideally 3–6 words |
| Evergreen | **No year in new slugs.** `2026` may appear in the title, never the slug. (Some legacy slugs carry a year; don't copy them.) |
| Intent-first | The words a searcher types, not internal code names |
| Pattern | glossary → `what-is-<term>`; concept comparison → `<a>-vs-<b>`; tools list → `best-<category>` or `<category>-tools` |
| Unique | `ls blog/posts/<slug>.md` must not exist, and no title in the ledger may be near-identical |

Anti-patterns (any one fails the slug): a year; `complete-guide-to-*`;
`*-strategy`; a brand word first (`datus-lakehouse`); a comparison without `vs`
(`lakehouse-warehouse`); a triple comparison; an unexplained abbreviation when
the expanded form is what people search (`what-is-cdc` is fine only because the
SERP uses "CDC"); a `-v2` of an existing canonical.

## 5. What to announce to the operator

One short 中文 message before research starts:

```
方向：<term>（<ArticleType>，<cluster> 的 <hub|spoke>）
Gate A：KEEP — <which two conditions>
Investment Score：<mean>（需求 x / 相关 x / 差异 x / 证据 x / 时效 x）
Slug：<slug>
理由：<one line>
```

If two candidates tie, ask. Otherwise proceed without waiting.
