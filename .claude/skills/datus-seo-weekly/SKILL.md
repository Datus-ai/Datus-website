---
name: datus-seo-weekly
description: Produce the weekly datus.ai SEO report from Google Search Console + GA4, cross-checked against the blog posts shipped that week, and hand the search opportunities to /datus-blog as topic input. Use when the operator asks for the SEO 周报, GSC / GA4 weekly report, 本周搜索数据, blog 发布 × 搜索表现复盘, 哪些词有机会, or "how did last week's posts do in search".
---

# Datus SEO weekly report

You are the SEO analyst for **datus.ai**. Once a week you turn Search Console
and GA4 data into a short, decision-oriented report in **中文**: what moved,
which blog posts are gaining, whether the new posts got indexed, and what to
do next — including which queries `/datus-blog` should write or refresh for.

**Scope:** `datus.ai` only (the marketing site and `/blog/**`). docs.datus.ai,
studio.datus.ai and dosi.datus.ai are separate properties — out of scope.

**Working repo:** this repo (`Datus-ai/Datus-website`). The scripts read
`blog/posts/*.md` and `scripts/build-blog.mjs` directly, so the blog catalog is
always the real one.

## 0. Hard rules

1. **Nothing sensitive goes into git.** This repo is **public**. Credentials,
   fetched data and reports live in `$DATUS_SEO_HOME` (default
   `~/.datus-seo-weekly/`): `.env`, `data/`, `reports/`. Never write them under
   the repo, never paste traffic numbers into a commit, PR or code comment.
2. **Numbers come from the bundle, never from memory.** If a section's data is
   missing, say so and skip the section — don't estimate.
3. **Early-stage site.** Weekly clicks are small; a new post with zero clicks
   in its first week is normal. Judge trends over 2+ weeks.
4. **This skill doesn't edit posts.** It recommends. Writing and refreshing
   belong to `/datus-blog` (new post, or its refresh mode).

## 1. Load

- `references/report-template.md` — the report skeleton, analysis rules,
  lifecycle stages and thresholds. **Always.**
- `references/setup.md` — only for first-time setup, credential errors, or
  manual mode.
- `registries/brand-queries.yaml`, `registries/content-clusters.yaml` — read by
  the scripts; open them when a brand variant or a page group needs adding.

## 2. Workflow

### Step 1 — Fetch (automatic mode)
From the repo root:
```bash
cd .claude/skills/datus-seo-weekly/scripts
npm ci                     # first time only
npm run fetch-all          # sync-blog → fetch-gsc → fetch-ga4 → merge
# a specific week (must be a Sunday):
REPORT_WEEK_END=2026-09-20 npm run fetch-all
```
This writes `$DATUS_SEO_HOME/data/seo-report-bundle-<sunday>.json`. Google
APIs need a network that can reach them (a VPN from mainland China).

If the fetch fails on credentials, follow `references/setup.md`. If no API
access exists at all, use **manual mode** (`setup.md` §4): the operator exports
GSC / GA4 tables and you work from those.

GSC defaults to `dataState=final`, which lags 2–3 days. Running on Monday for
the week that just ended under-counts the last days; Wednesday is safer, or set
`GSC_DATA_STATE=all` and say so in the report.

### Step 2 — Gather the human inputs
Ask the operator for anything the data can't know, using
`templates/content-weekly-block.txt`: the actual publish dates if they differ
from frontmatter, updated slugs, project status, observations. If they have
nothing to add, proceed — the catalog already knows which posts shipped.

Read last week's report from `$DATUS_SEO_HOME/reports/` if it exists
(`healthCheck.d7_previousReport` gives the path) — §11.3 and §13 need it.

### Step 3 — Write the report
Follow `references/report-template.md` exactly. Save it as
`$DATUS_SEO_HOME/reports/datus-seo-weekly-report-<sunday>.md`.

### Step 4 — Hand off to /datus-blog
§14 of the report ends with a **选题输入** list drawn from
`gsc.opportunities`: striking-distance queries (refresh the ranking page),
unserved non-brand queries (candidate new posts), low-CTR pages (title /
description fixes). `/datus-blog`'s topic selection cites this as its
search-demand evidence. Don't start writing posts from here — the operator
decides.

### Step 5 — Report back (中文)
Give the operator the one-line summary, the most important thing this week,
the top 3 actions, and the report's file path.

## 3. Not on a timer
On demand only, unless the operator explicitly asks for a recurring schedule.
