# Knowledge: Retro Audit — reviewing and refreshing published posts

Load only in **refresh mode**: the operator asks to audit, refresh, update or
clean up posts that are already live ("检查一下已发布的文章", "刷新一下 X",
"哪些旧文章该更新"), or Gate A returned MERGE into an existing post.

A retro audit **produces a diff list first and edits nothing**. Changes happen
only after the operator agrees to the verdicts.

---

## 1. The 14 checks

| # | Check | What to look at |
|---|---|---|
| R1 | Hub ↔ spoke links | Spoke links up to its hub; hub links down to it (`topic-selection.md` §1) |
| R2 | Dated facts | Versions, star counts, pricing, "as of" dates, competitor status — still true? |
| R3 | Fairness | Comparison posts still give each competitor a real strength |
| R4 | Fragmentation | Walls of bullets, runs of one-line paragraphs (`writing-quality.md` §3) |
| R5 | Filler / generated tone | `writing-quality.md` §2 phrases, hype adjectives |
| R6 | List share | Bullets > 25% of the body |
| R7 | Frontmatter | title, description, keywords, `date` / `lastmod` complete and in range |
| R8 | Reciprocal Related articles | Posts it lists link back where natural |
| R9 | Information gain | Does it still beat today's SERP? (re-run R2 / R3 briefly) |
| R10 | Slug | Anti-patterns (`topic-selection.md` §4) — report only; a rename is a separate decision (see PR #80's cost) |
| R11 | Meta lengths | Title < ~60, description 150–160, keyword present |
| R12 | Canonical overreach | A spoke that re-explains a term another post owns |
| R13 | Evidence | Bare numbers; claims with no source |
| R14 | Cross-post contradictions | Conflicts with sibling posts or with current positioning (e.g. the Sept 2026 context-layer pivot, 16 Dosi dialects) |

Status per check: ✅ pass · ⚠️ partial · ❌ fail. Run `tools/check-post.mjs` on
the file first; it covers R6, R7, R11 and part of R13 mechanically.

## 2. Verdict per post

| Verdict | When | What happens next |
|---|---|---|
| **Retain** | No ❌, at most minor ⚠️ | Nothing, or trivial fixes batched later |
| **Refresh** | Stale facts, weak structure or lost information gain, but the intent is still unique | Edit in place: fix facts, restructure, bump `lastmod`; keep the slug |
| **Merge** | Another post owns the same intent | Fold the unique parts into the canonical post; then ask the operator how to handle the old URL — this site has no server-side 301, so a removed slug needs a redirect stub or stays as a clearly differentiated page |
| **Deprecate** | Obsolete and no longer worth ranking | Ask the operator; never delete a live post on your own |

## 3. Report

```markdown
## Retro audit — <slug>   (<YYYY-MM-DD>)

**Verdict**: Retain | Refresh | Merge → <slug> | Deprecate

| # | Check | Status | Detail |
|---|-------|:------:|--------|

**P1 (fix in this pass)**: …
**P2 (later)**: …
```

For a batch, lead with a one-table summary (slug · verdict · top issue) and put
the per-post reports underneath.

## 4. Executing a refresh

Same mechanics as a new post: its own branch (`blog/refresh-<slug>`), Step 4
wiring only if links change, Step 5 build + preview, the pre-publish audit on
the edited post, one PR. Refreshing a ported article follows
`porting-external-articles.md` — surgical factual fixes only, never a rewrite
of the author's prose. Record the refresh in `memory/covered-topics.md` as a
short note under the post's existing entry (or a new "Refreshed" line), not as
a new post.
