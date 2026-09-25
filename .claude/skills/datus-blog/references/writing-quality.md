# Knowledge: Writing Quality — extractability, rhythm, link placement

Load at **Step 3** (while drafting) and again at the self-check. It sharpens
`blog-standard.md` §4 (house voice) with checks you can actually run on a draft.
Two readers matter: a human skimming for the answer, and a search engine / LLM
extracting a passage. Both reward the same thing — each section answers first
and every paragraph makes one claim.

---

## 1. Extractability

### BLUF in three places

| # | Where | Pass |
|---|---|---|
| B1 | Under the title (TL;DR first bullet or opening paragraph) | A 40–60-word direct answer to the primary intent |
| B2 | The first paragraph of every major `##` | Answers first, background second — no "In today's…" warm-up |
| B3 | Every FAQ answer | The first sentence is the answer; the FAQ is not copied from the body |

### One claim per paragraph

- The first 1–2 sentences of a paragraph state its single claim.
- Pronouns ("it", "this", "the above") resolve inside the same paragraph.
- Pick three paragraphs at random: each should answer one sub-question on its
  own.
- Never stack three unrelated conclusions in one paragraph.

### Judgement, not superlatives

- Good: "For teams running two warehouses, …", "In practice, …", "We find …"
  followed by the reason or source.
- Bad: bare "best", "only", "clearly better", "the leading" with no data.

## 2. Filler that marks a draft as generated

Flag every occurrence; more than three in one post means rewrite the passages:

"In today's data-driven world", "In today's fast-paced…", "It is important to
note that", "As we all know", "The reality is that", "Here's the thing", "But
that's not all", "Let's dive in", "Consider the following", "This is why…" with
no preceding cause.

Also banned in body copy: revolutionary, game-changing, guaranteed, "10x" with
no data, "only solution", and dismissive competitor phrasing ("just a chatbot",
"merely", "only does X").

## 3. Rhythm — paragraphs over lists

Glossary-style posts decay into "definition + list + list". That reads as thin
and ranks as thin. Paragraphs carry the argument; lists and tables carry
enumerations.

| Check | Healthy | Red line |
|---|---|---|
| Long paragraphs (4–8 sentences, 80–200 words) | ≥3 in the post; ≥1 of ≥3 sentences in every `##` | 0 |
| Consecutive short paragraphs (≤2 sentences) | ≤2 in a row | ≥4 in a row |
| Share of short paragraphs | 15–25% | >35% |
| Share of the body in bullet lists | ≤25% | — |

Use a list only when the items are genuinely parallel. Every list needs a lead-in
sentence and at least two sentences of analysis after it; items of more than two
sentences should be paragraphs; a one-item list is a paragraph. Every table
needs prose before or after it saying what to take from it — three bare tables
in a post is a fail.

Transitions: in any run of ten paragraphs, at least seven adjacent pairs should
be connected (a transition word, a sentence that picks up the previous
paragraph's key term, or an explicit cause / contrast). If three consecutive
paragraphs can be shuffled without anyone noticing, they are fragments.

Density: at least one concrete example (a real column, a named metric, a
documented behaviour) per ~500 words, and the conclusion states a judgement.

## 4. Link placement

The counts in `blog-standard.md` §6 (3–6 internal, 2–5 external) say how many;
this says where.

| Zone | Internal links | Limit |
|---|---|---|
| Opening (before the first `##`) | Usually none; at most the cluster hub | ≤1 |
| TL;DR | At most one hub / parent concept | Opening + TL;DR ≤2 |
| Each numbered `##` | Link a term the first time it is explained, to its canonical post | ≤2 unique per section |
| Conclusion | The hub, one sibling spoke, optionally one cross-cluster post | ≤3 |
| FAQ | Only when the question needs that post; don't introduce new unique targets | — |

Link each target slug once in the body; the Conclusion and Related articles may
repeat it. Anchor text is descriptive ("how schema linking works"), never
"click here" / "learn more". Glossary links (`/glossary/`) are capped at 3 for
glossary-type posts.

Unique internal targets by role: cluster hub 4–6 (mostly its spokes); glossary
or research spoke 3–5; comparison / tools list 4–6 (including the things
compared); product 3–4.

**Only link pages that exist.** Internal targets must be a file in
`blog/posts/` or a live site route (`/glossary/`, `/products/cli/`,
`/products/studio/`, `/mcp/`, `/integrations/`, `/databases/`, `/models/`,
`/pricing/`, `/faq/`, `/osi-field-mapping/`, `/tools/osi-playground/`, …). Paths
that look plausible but do not exist — `/agent`, `/features/…`, `/use-cases/…`,
`/vs/…`, `/alternatives/…`, `/case-studies/…` — are 404s.

## 5. Mentioning Datus

Within the type's Datus-share cap (`article-types.md`):
- Never open with Datus. The first Datus mention comes after the reader has
  what they searched for.
- Glossary posts: Datus lives in one "how context layers / agents improve X"
  section and possibly one FAQ — at most three paragraphs.
- Never "Datus is the only…". Frame it as complementary to semantic layers,
  catalogs and MCP.
- Every post names at least one situation where a non-Datus option is the
  better choice.
- CTAs: GitHub, docs.datus.ai or Studio, placed naturally in the Conclusion or
  FAQ — at most two.
