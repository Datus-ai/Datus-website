# Knowledge: Pre-publish Audit — P0 gates and the 10-dimension score

Load at **Step 5.5**, after the page renders locally and before the PR. The
audit decides whether the post is **publish-ready**; its report goes into the PR
description so the operator reviews a scored draft, not a raw one.

Order: run `tools/check-post.mjs` → P0 gates → type gate → score → report.
Audit the rendered page and the source together — some failures (a broken
image, a mangled table) only show in the browser.

---

## 1. P0 gates — any one blocks the PR

| Gate | Blocks when |
|---|---|
| **G1 Fact** | A product capability, status or number contradicts official docs or `product-positioning.md` |
| **G2 Dead link** | An internal link 404s, or several external links fail |
| **G3 Unsourced number** | A quantitative claim (%, ROI, accuracy, stars, counts) has no Source Map row or no "as of" date |
| **G4 Competitor status** | A competitor's GA / Preview / Archived / shut down / acquired status is wrong or undated |
| **G5 Overclaim** | Datus is credited with something beyond what is shipped, or with an unsupported "only" / "first" / "world's first" |
| **G6 Unlaunched page** | An internal link points at a route that doesn't exist (`writing-quality.md` §4) |
| **G7 Brand risk** | Disparaging a competitor ("just", "merely", "only does X") or anything that invites a dispute |

Then the type gate (D / T / P / R in `article-types.md` §4).

Output: `P0: PASS` or `P0: BLOCKED by G?` with the offending line. A blocked post
goes back to Step 3 (or Step 2 if the fix needs new research); it does not get a
score.

## 2. Ten-dimension score (only after P0 passes)

Score each 0–10, multiply by weight, sum to 100.

| Dim | Weight | A 10 looks like |
|---|:-:|---|
| A Strategy & intent | 10% | Right search intent; clear hub / spoke role; Gate A reasoning holds |
| B SEO & SERP fit | 10% | Title and description in range with the keyword; SERP Fit complete; snippet-ready definition |
| C Structure | 9% | TL;DR, numbered sections, Conclusion, 4–6 FAQ, Related articles; matches the type skeleton |
| D Writing & voice | 11% | House voice; no filler (`writing-quality.md` §2); concrete examples |
| E Fact & E-E-A-T | 20% | Every claim in the Source Map; competitor facts accurate and dated; ≥1 genuine competitor strength |
| F Links & graph | 6% | Internal counts and placement per `writing-quality.md` §4; reciprocal link added; 2–5 external, all `nofollow noopener` |
| G Differentiation | 14% | Delivers the Synthesis thesis; overlap with other posts on the site < 30% |
| H Conversion | 6% | ≤2 CTAs, matched to the reader's stage |
| I Density | 2% | ≥1 concrete example per ~500 words; the conclusion makes a judgement |
| J Presentation | 12% | Rhythm checks in `writing-quality.md` §3 pass |

**Grades**: S ≥90 (plus an Excellence signal and zero P1 fixes) · A 80–89 ·
B 70–79 · C 60–69 · D <60. **Publish-ready = P0 PASS and ≥70.** Below 70, fix
and re-score before opening the PR; don't ship a C and ask the operator to
sort it out.

**Excellence signal** (reported separately, not in the score): **Yes** if the
post contains at least one unit worth quoting or sharing — an original
framework, a checklist people will reuse, a concrete documented case, a clear
insight the SERP lacks. **No** is still publishable at B. Never bolt on a
gimmick to earn a Yes; it must follow from the Synthesis thesis.

## 3. Report (goes into the PR description)

```markdown
## Pre-publish audit — <slug>

**Type**: <ArticleType> · **Investment Score**: <mean> · **Keyword**: <kw>
**check-post.mjs**: <n> pass / <n> warn / 0 fail
**P0**: PASS
**Type gate**: <D1–D3 | T1–T3 | P1–P3 | R1–R2>: PASS
**Score**: <xx>/100 · Grade <X> · **Excellence**: Yes — <what> | No

| Dim | Score | Weight | Note |
|-----|:-----:|:------:|------|
| A | | 10% | |
| … | | | |

**Known P2 follow-ups** (not blocking):
- [ ] …
```

The PR description then carries, in order: summary, this audit, the Research
Log, SERP Fit and Source Map (`research-protocol.md`), and the local preview
URL.
