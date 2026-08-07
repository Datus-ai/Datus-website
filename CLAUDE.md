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
| `<head>` metadata | English in the hand-written `<route>/index.html`; Chinese in `src/i18n/pageMeta.ts` |
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
5. write the English `<head>` in `<route>/index.html`, following an existing page;
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
| semantic model | 语义模型 | |
| metrics | 指标 | |
| Reference SQL | Reference SQL | product concept, kept in English |
| NL2SQL / text-to-SQL | NL2SQL / 自然语言转 SQL | |
| lineage | 血缘 | |
| data quality | 数据质量 | |
| governance | 治理 | |
| long-running agents | 长时运行 Agent | |
| warehouse | 数仓 / 数据仓库 | 数仓 when the context is clear |
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
