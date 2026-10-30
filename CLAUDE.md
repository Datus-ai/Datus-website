# CLAUDE.md

Long-lived conventions for this repo. Build commands and the blog workflow live
in [DEVELOPMENT.md](./DEVELOPMENT.md) and are not repeated here.

---

# 1. Bilingual pages (`/zh`)

The site is a Vite MPA, not Next.js. The public URL contract follows the
internal `datus-i18n-spec.md` (kept in the clients repo, not here); the
framework layer is this stack's equivalent implementation. **The public URL
contract does not change because the framework does.**

## 1.1 Scope

| | Rule |
|---|---|
| **Included** | Every marketing / product / landing path except `/blog/**` |
| **Excluded** | `/blog/**` (English only), `/datafun/` (a `noindex` Chinese-only event page — a mirror would just be a duplicate), docs.datus.ai, studio.datus.ai |
| **Path** | Chinese = `/zh` + the English path; **the slug is never translated** |
| **Default** | A new marketing page ships its `/zh` mirror in the same PR |

```
/{path}      ↔  /zh/{path}
/blog/...    →  English only. Never a /zh/blog URL, never a zh-Hans alternate.
```

English stays unprefixed so existing URLs keep their equity. Locale is decided
**by the URL and nothing else** — no Accept-Language sniffing, no cookie, no
automatic redirect. A crawler or a shared link always gets the language the path
declares.

`MIRRORED_PATHS` in `src/i18n/config.ts` is the single source of truth for the
route list, shared by the routing helpers, the prerenderer, the `/zh` shell
generator and the sitemap.

## 1.2 Where copy lives

| Layer | Location |
|---|---|
| Shared UI copy (nav, footer, buttons, form labels, shared components) | `src/i18n/ui.ts` |
| Page body copy | that page's `content.ts` / `faq.ts`, exported as `Record<Locale, …>` |
| `<head>` metadata | English in `src/seo/pages.json` (converter copy via `src/seo/pages.ts`); Chinese in `src/i18n/pageMeta.ts` |
| Glossary entries | English in `src/glossary/glossaryData.ts`; Chinese overlay keyed by slug in `src/glossary/glossaryData.zh.ts` |

Components read the active branch with `useT(dict)`. **Never** hard-code an
EN/ZH branch or long prose inside a component; even short labels belong in
`ui.ts`.

## 1.3 Internal links

Always write internal hrefs in **English form** (`/pricing/`) and let
`useHref()` prefix them at render time:

```tsx
const l = useHref();
<a href={l("/pricing/")}>…</a>
```

- **Never hard-code `/zh/…`.**
- `localizePath()` only prefixes paths in `MIRRORED_PATHS`, so `/blog/...`,
  external URLs, `mailto:` and bare fragments pass through untouched. That is
  intended behaviour, not an oversight.
- The language switcher is the only link on an English page allowed to point at
  `/zh`, and vice versa.

## 1.4 Responses must be complete HTML

**The `text/html` response for a route must already contain the full page,
copy included. Never ship a JS-only SPA shell that mounts the copy client-side**
— it has to be crawlable as-is.

`scripts/templates/page.html` is the shared source HTML template. Vite generates
ignored English `<route>/index.html` inputs from `src/seo/pages.ts` before dev or
build; never hand-edit these generated files. Page-specific fonts, structured
data and mobile settings live in the registry. The blog keeps its existing
independent generator.

`vite build` emits only the English shells. `npm run prerender` then:

1. derives each `/zh` shell from its freshly built English sibling (same asset
   hashes; head rewritten from `pageMeta.ts`),
2. injects the hreflang cluster into both trees,
3. renders **every route once per locale** into `<div id="root">`,
4. writes `dist/sitemap-pages.xml`.

The client hydrates (`src/lib/mount.tsx`, `src/glossary-main.tsx`), so the SSR
output and the hydrated tree must match.

> `npm run dev` serves `/zh` page **bodies** but not `/zh` **head metadata** —
> that is a build-time artifact. Verify meta tags with `npm run preview`.

## 1.5 Adding a marketing page

1. add the path to `MIRRORED_PATHS` in `src/i18n/config.ts`;
2. add its Chinese title / description / og to `ZH_PAGE_META` in
   `src/i18n/pageMeta.ts` — **the build fails if this is missing**
   (`missingZhMeta()`);
3. add the component to `PAGES` in `src/prerender.tsx`;
4. write the page copy as `Record<Locale, …>`;
5. register the page entry and English metadata in `src/seo/pages.json` (or derive a page family in `src/seo/pages.ts`), and ignore its generated `<route>/index.html`;
6. run `npm run build:all && npm run preview` and walk the checklist in §4.

---

# 2. Locked terminology

Aligned with §5 of the i18n spec. **Every translation and every new piece of
Chinese copy must follow this table — one English term, one Chinese rendering.**
When a new term comes up, add it here rather than inventing a rendering inside a
page.

## 2.1 Brand and category

| English | 中文 (locked) | Notes |
|---|---|---|
| Datus | Datus | not translated |
| data engineering agent | 数据工程 Agent | the category term; not 数据工程智能体 |
| open-source | 开源 | |
| evolvable context | 可演进的上下文 | One Story wording |
| one-man / one-person data team | 一人数据团队 | |
| enterprise agent teams | 企业 Agent 团队 | |
| modern data stack | modern data stack | kept in English |

## 2.2 Product and capabilities

| English | 中文 (locked) | Notes |
|---|---|---|
| Context Engine / Data Context Engine | 上下文引擎 / 数据上下文引擎 | never 情境引擎 |
| context | 上下文 | never 情境 in a data setting |
| Subagent | 子代理 | 子代理 in body copy; `Subagent` may stay in headings and product names |
| Semantic Layer | 语义层 | |
| ontology / business ontology | 本体 / 业务本体 | ontology connects business concepts and relationships to semantic definitions |
| runtime / semantic execution runtime | 运行时 / 语义执行运行时 | DOSI may also be used independently |
| semantic model | 语义模型 | |
| metrics | 指标 | |
| Reference SQL | Reference SQL | product concept, kept in English |
| NL2SQL / text-to-SQL | NL2SQL / 自然语言转 SQL | |
| lineage | 血缘 | |
| data quality | 数据质量 | |
| governance | 治理 | |
| long-running agents | 长时运行 Agent | |
| warehouse | 数仓 / 数据仓库 | 数仓 when the context is clear |
| lakehouse / lakehousing | 湖仓 / 湖仓一体 | 湖仓一体 for the capability, 湖仓 as a modifier |
| hybrid search | 混合检索 | never 混合搜索 |
| catalog | 数据目录 | |
| MCP (Model Context Protocol) | MCP | do not expand in headings |
| adapter | 适配器 | database support is always adapters — **not** "MCP connectors" |
| schema | 表结构 / Schema | keep English in Schema 漂移, Schema Linking |
| skills | Skills | product concept, kept in English |
| self-host | 私有部署 / 自行部署 | |
| RBAC / SSO / SLA | RBAC / SSO / SLA | not translated |

## 2.3 Navigation and CTAs

| English | 中文 (locked) |
|---|---|
| Get started | 开始使用 |
| Get started — free | 免费开始使用 |
| Home | 首页 |
| Products | 产品 |
| Pricing | 定价 |
| Integrations | 集成 |
| Databases | 数据库 |
| Models | 模型 |
| Documentation / Docs | 文档 |
| Blog | 博客 |
| Community | 社区 |
| Glossary | 术语表 |
| FAQ | 常见问题 |
| Enterprise | 企业版 |
| Open Source (pricing tier) | 开源版 |
| Cloud Personal | 云端个人版 |
| Contact us | 联系我们 |
| Capabilities / What you get | 核心能力 / 你能得到什么 |
| Quickstart | 快速开始 |

## 2.4 Never translated

Product names (Datus CLI / Studio / Enterprise), CLI commands and flags
(`datus-cli --web`, `pip install datus-agent`), package names, config fields and
code identifiers (`dataset.source`, `metrics[].aggregation`, `agent.yml`),
vendor and product proper nouns (Snowflake, dbt, Cube, LookML, Airflow…), and
protocol names (MCP, OSI, OpenTelemetry).

## 2.5 One Story anchor sentences

Reuse verbatim where the page calls for it:

> Datus 是一个开源的数据工程 Agent，为你的数据系统构建可演进的上下文。
> 从一人数据团队到企业 Agent 团队——Datus 把数据工作变成可靠、可复用的 Agent 系统。

---

# 3. Writing Chinese copy

- **Use full-width punctuation**: 。，、；：？！（）——. Put a half-width space
  between Chinese and adjacent Latin words, code or numbers: `支持 11+ 种数据库`,
  `用 pip install datus-agent 安装`.
- **No machine-translation register.** Marketing copy should read as if written
  in Chinese, not transliterated from English syntax. Split long English
  subordinate clauses into separate sentences.
- **CTAs are verb phrases**, never 点击这里.
- **Numbers and facts must agree across languages.** Change one side and you
  change the other (e.g. the glossary term count, the number of supported
  databases).
- **Never translate** code blocks, CLI commands, YAML or field names — only the
  prose around them.
- **Check the facts before translating.** The English source can be wrong: the
  CLI FAQ described DuckDB / StarRocks / Hive / Spark / ClickHouse / Trino as
  "MCP-based connectors" when they are native adapters. Fix both languages
  rather than faithfully mistranslating.

---

# 4. Hard SEO constraints

- Each locale is **self-canonical**. Never canonicalise across languages. Always
  absolute URLs.
- hreflang cluster = `en` + `zh-Hans` + `x-default` (→ English), declared
  **bidirectionally and including self**.
- Blog pages must **not** declare a `zh-Hans` alternate, and `/zh/blog/**` must
  not exist.
- `<html lang>` is `en-US` / `zh-CN`, with `og:locale` and
  `og:locale:alternate` following.
- JSON-LD URLs (breadcrumb, FAQ, HowTo) carry the correct locale prefix. The
  `Breadcrumb` and `FAQ` components handle this — pass English-form paths.
- Trailing slashes must agree across hreflang, canonical and sitemap. This site
  uses trailing slashes everywhere.
- The non-blog sitemap is written by the prerender step
  (`scripts/lib/i18n-shells.mjs`) with both locales and `xhtml:link` hreflang.
  `scripts/build-blog.mjs` owns the blog sitemap only.
- Bump `BUILD_DATE` in `scripts/lib/i18n-shells.mjs` when marketing copy changes
  materially. It is the marketing pages' `<lastmod>` and is independent of the
  blog's own BUILD_DATE.

---

# 5. Review checklist

For any change touching both languages, run `npm run build:all && npm run
preview` and verify:

- [ ] `/{path}` and `/zh/{path}` are both reachable **directly**, with no
      language negotiation or redirect
- [ ] `curl` returns the full body copy — nothing depends on JS to render
- [ ] no indexable `/zh/blog/**`; blog pages carry no `zh-Hans` hreflang
- [ ] `/en` and `/en/*` land on the unprefixed page (GitHub Pages can't 301, so
      these are `noindex` redirect stubs)
- [ ] marketing pages declare hreflang bidirectionally, including self and
      `x-default` → English
- [ ] each locale canonicalises to itself, absolute URL, trailing slash matching
      the sitemap
- [ ] `<html lang>` matches the page language
- [ ] the language switcher keeps the same path, swaps the prefix, and
      **preserves `?query`**
- [ ] on a `/zh` page every internal link stays inside `/zh` except the language
      switcher (blog links stay English)
- [ ] no leftover hard-coded English in body copy or shared components
- [ ] terminology matches §2
- [ ] headless-load a few `/zh` pages: no console errors, no hydration mismatch
- [ ] the non-blog sitemap contains the `/zh` mirrors and no Chinese blog URLs

---

# 6. Website motion conventions

These are approved website-wide design rules. Apply them to new pages and similar interactions without waiting for the operator to ask again.

## 6.1 Autoplay tabs

- Autoplay tabs display their countdown **in the existing thick bottom border of the active tab**. The border is the progress track; never add a second, detached progress bar.
- Reuse `src/hooks/useTimedTabs.ts` and `src/styles/tab-countdown.css` for new tab rotations. The current default is 6.5 seconds per panel. The timer and underline must share a cycle and duration.
- Pause when the tabs leave the viewport, the document is hidden, or the visitor chooses Pause. Resuming preserves elapsed time. A manual selection resets that panel's countdown.
- Provide a visible Pause/Play control. Keyboard focus/navigation pauses rotation; support arrow keys and Home/End without stealing focus during automatic transitions.
- Respect `prefers-reduced-motion`: keep the content manually navigable and disable automatic rotation.

## 6.2 Section entrances

- Every major content section uses a subtle entrance when it enters the viewport: fade in with a small upward movement, once per page load.
- Use the shared `setupSectionReveals` in `src/lib/section-reveal.ts`. React pages inherit it through `SiteLayout`; generated blog pages load `src/site-motion.ts` and the same section styles.
- Do not stack a second entrance on a section that already has an authored intro, such as the homepage hero. Use `data-reveal-skip` for an intentional custom entrance.
- Animate marketing sections rather than nested tool panes, code editors, controls, or modal contents. Preserve readability, layout, keyboard access, anchor navigation, printing, SSR and no-JavaScript rendering.
- Reduced-motion visitors see the complete content immediately. Never hide prerendered content by default or depend on an animation to make it readable.

## 6.3 Interactive product walkthroughs

- Where a preview requires several clicks, guide the next action with a subtle cursor/click animation. Move the cue to the next real control after the visitor acts; never perform approval or merge actions automatically.
- Cues must not intercept clicks, alter accessible control names, or obscure important content. Pause looping cues offscreen/in the background and provide a static cue for reduced motion.

# 7. Header and hero continuity

- The website header and hero have **no dividing line between them**, across pages, locales, themes and viewport sizes. Do not add a header bottom border, hero top border, pseudo-element separator or shadow that recreates that line.
- Keep this in the shared navigation styles (`src/styles/site.css` and the Nordic theme styles), so React pages and generated blog pages inherit the same treatment. Header background behavior can remain page-specific.
- This rule concerns the website header/hero boundary. It does not remove borders inside product previews, navigation dropdowns or content sections.

# 8. Default website theme

- All marketing and product pages, glossary pages, and generated blog pages start in **light mode** when no preference is stored. The HTML shell is light even without JavaScript.
- Honor an explicit dark choice saved under `datus-home-theme`; use the same storage key in React and the static blog. Unavailable storage falls back to light.
- Reuse `scripts/lib/site-theme.mjs` for the early head script and shell attributes. Vite and the blog generator both apply it, before first paint, so routes do not flash the opposite theme.
- Theme controls, logos and prerendered React markup must agree with the light default. Keep the visitor's ability to toggle both themes.

# 9. Approved company positioning

Use **The trusted enterprise data context for AI agents.** in company positioning.
Keep **data** in **enterprise data context**, including page titles, the homepage,
footer, share images, and marketing assets. Chinese: **面向 AI Agent 的可信企业数据上下文**.
Line breaks may adapt to the available space; retain the approved words.
The three pillars remain **Business-aware. Agent-native. Audit-ready.**
The broader visual identity and its current assets live in the separate
`Datus-visual-identity` repository; do not bring that project's complete source
or asset collection into this website repository.

# 10. UTM and CTA attribution

Follow [the UTM conventions](./docs/utm-conventions.md) for website code and external marketing links. New marketing Studio CTAs use `studioCtaUrl()` and a stable placement `utm_content` plus the `utm_source=datus.ai` fallback in base HTML; source, medium and campaign come from arrival evidence through the shared handoff. External evidence replaces the fallback as a whole campaign; never fill missing fields in a partial campaign or add acquisition UTM to ordinary internal navigation. Preserve locale prefixes, consent-controlled storage and destination paths. Keep the CTA inventory current; marketing, Support and the static blog use the same source fallback and handoff.
