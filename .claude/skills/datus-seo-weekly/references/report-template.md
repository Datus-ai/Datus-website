# Report template, analysis rules and thresholds

The report is written in **中文** (URLs, query strings, event names and product
names stay as they are). Every number traces to a field of
`seo-report-bundle-<sunday>.json`; the field paths are given per section.

---

## 1. Site facts the analysis depends on

| Fact | Value |
|---|---|
| Positioning | Enterprise data context layer (Apache Ossie semantic layer + ontology); the open-source Datus agent, commercial Studio, the Dosi engine |
| SEO workhorse | `/blog/<slug>/` — every long-form article; English only |
| Strategic non-blog pages | `/osi-field-mapping/`, `/tools/osi-playground/`, `/glossary/` |
| `/zh/**` | Chinese mirrors of the marketing pages only (no `/zh/blog/**`) |
| Blog grouping | the `CATEGORIES` labels in `scripts/build-blog.mjs` (the same as `/blog/`); the bundle's clusters use them as `blog:<label>` |
| Trailing slashes | The site uses them everywhere; the scripts compare paths without them |
| Stage | Early: weekly clicks are small, first-week zeros are normal |

## 2. Content lifecycle stages

| Stage | Signal | Next step |
|---|---|---|
| 孵化期 Incubating | New, < 100 impressions, 0–3 clicks | Wait two weeks; don't judge |
| 爬升期 Climbing | Impressions rising, position improving (e.g. 15 → 8) | Add internal links from strong posts; tune the title |
| 起飞期 Take-off | Clicks > +100% week over week | Build spokes around it; link it to product pages |
| 成熟期 Mature | Stable position, clicks ±20% | Maintain; refresh facts yearly |
| 异常页 Anomaly | > 500 impressions, CTR < 0.1% | **Rewrite title / description now** |
| 过时 Stale | Timely topic whose demand has passed | Stop investing |

Indexing delay: published ≤ 3 days ago with no GSC data → "正常延迟".
Published ≥ 7 days ago and still zero impressions → check the sitemap and
request indexing via URL Inspection.

## 3. Thresholds (early-stage site)

| Metric | 🟢 Healthy | 🟡 Watch | 🔴 Act |
|---|---|---|---|
| Weekly GSC clicks, week over week | +10% to +100% | −20% to +10% | < −30% two weeks running |
| Branded share of clicks | 20–60% | < 15% or > 80% | explain it |
| New post, first-week impressions | ≥ 10 | 1–9 | 0 and published ≥ 7 days |
| High impressions, low CTR | CTR ≥ 1% | 0.3–1% | > 500 impressions and CTR < 0.1% |
| GSC clicks ÷ GA4 organic sessions (`healthCheck.d6_…`) | 0.8–1.5 | 0.5–0.8 or 1.5–2.0 | > 2.0 or < 0.5 |

`overallChange.*Pct` is `null` when last week was zero — write "新增", not
"+100%".

## 4. Data health (Appendix A — check before writing)

| Check | Field | If it fails |
|---|---|---|
| Mode | `source` (`api-auto` / `gsc-only` / `ga4-only`) or manual | Label the report 🤖 / 📋 |
| Period | `healthCheck.d1_period` — two full 7-day weeks | Flag any mismatch |
| GSC dimensions | `healthCheck.d2_gscDimensions` | Skip the missing section |
| GA4 present | `healthCheck.d3_ga4Present` | Skip §8–§10 |
| Catalog fresh | `healthCheck.d4_catalogSyncedAt` is today | §11 relies on it — re-run `sync-blog` |
| GSC ↔ GA4 overlap | `healthCheck.d5_gscPagesSeenInGa4` < 20% | Say the cross-analysis is weak |
| Magnitude | `d6_…` ratio | Explain big gaps (consent banners, bots, property mismatch) |
| Data state | `gscDataState` | If `all`, note the last days are preliminary |
| Conversion events | `ga4.conversionEventsMissing` | List events that were configured but never fired — they may be misnamed in GA4 |

## 5. Report skeleton

```markdown
# Datus SEO 周报 | {start} ~ {end}

> **本周一句话**：…
> **本周最重要的一件事**：…
> 数据模式：🤖 API / 📋 手动 · GSC dataState：final | all

## 报告完整性总览
(which sections have data; which were skipped and why)

## §1 核心看板
GSC clicks / impressions / CTR / position vs last week (`gsc.overall`,
`overallPrev`, `overallChange`); blog share (`gsc.blogSummary`); GA4 sessions,
users, organic sessions (`ga4.overall`, `ga4.organicSearch`). One status emoji
per row from §3.

## §2 页面分析
Top pages by clicks and by impressions (`gsc.pages`), with page type; pages
that lost all impressions (`gsc.lostPages`) — often a redirect, a noindex or a
cannibalising sibling.

## §3 关键词分析
Top queries (`gsc.queries`) with brand / category / competitor tags.

## §4 品牌 vs 非品牌
`gsc.branded`, `gsc.nonBranded`, `gsc.category`. Non-brand growth is the SEO
strategy working.

## §5 区域流量
`gsc.countries`.

## §6 跨引擎对比 🔵
Bing data only if the operator supplied it; otherwise "未提供".

## §7 设备分布
`gsc.devices`.

## §8 转化与 Engagement 🔵
`ga4.conversionEvents`, `ga4.conversionEventsMissing`, engaged sessions.

## §9 GSC + GA4 交叉分析 🔵
`ga4.organicLandingPages` vs `gsc.pages`: pages that get search clicks but no
engagement, and the reverse.

## §10 Source / Medium 🔵
`ga4.sourceMedium`, `ga4.channels`.

## §11 内容-流量交叉（Blog 发布 × 搜索）← 必出
### 11.1 本周新发布
| 文章 | 分类 | 发布日 | 天数 | GSC 点击 | 曝光 | 位次 | GA4 Sessions | 判断 |
(`blog.newThisWeek`; `gsc: null` = no data yet → apply the indexing-delay rule;
GA4 sessions from `ga4.topLandingPages` by path)
### 11.2 按内容簇汇总
| 内容簇 | 本周新文 | 点击 | 曝光 | 环比 | 代表页面 |
(`contentClusters`; `blog:unknown` = GSC still shows a URL that isn't a live
post — usually an old `/blog/posts/...` redirect stub or a renamed slug)
### 11.3 上周发布复盘（第二周表现）
(`blog.newLastWeek` vs last week's report)
### 11.4 零点击高曝光
(`gsc.opportunities.lowCtrPages`)

## §12 生命周期阶段判断
Where the site is overall, and which notable posts are in which stage (§2).

## §13 执行进度
Posts published vs the monthly target (operator block); last week's §14 actions
→ ✅ / ⏳ / ❌; inventory (`blog.inventory.byCategory`).

## §14 关键发现与行动建议
3–5 findings, each with the evidence field and one concrete action and owner.

### 选题输入（给 /datus-blog）
| 类型 | Query / 页面 | 曝光 | 位次 | 建议动作 |
- **striking distance** (`opportunities.strikingDistanceQueries`) → refresh the
  page that ranks (name it), or a tighter spoke if no page targets it
- **unserved** (`opportunities.unservedQueries`) → candidate new post; note
  whether an existing post already covers the intent (then it's a refresh, not
  a new post)
- **low CTR** (`opportunities.lowCtrPages`) → title / description rewrite

## 附录 A：数据健康检查
(§4 table, filled in)

## 附录 B：历史趋势
(from previous reports, if any)

## 下次出报告补齐清单
(missing data, events to fix, questions for the operator)
```

## 6. Style

- Lead with judgement, then the number: "Glossary 簇在爬升：曝光 +38%（1.2k →
  1.7k），`what-is-schema-linking` 位次 11 → 8".
- Compare against last week and against the threshold, not in isolation.
- Name the page or query; never "某些页面".
- Don't recommend more than five actions; each needs an owner and a check for
  next week.
