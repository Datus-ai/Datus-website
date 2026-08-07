# CLAUDE.md

本文件是本仓库的长期约定。构建流程、加博客文章等日常操作见 [DEVELOPMENT.md](./DEVELOPMENT.md)，这里不重复。

---

# 一、中英双语（`/zh`）规范

站点是 Vite MPA（非 Next.js）。公开 URL 契约严格遵循内部规范 `datus-i18n-spec.md`（在 clients 仓，不在本仓），框架层按本栈的等价实现落地——**公开 URL 约定不因框架而变**。

## 1.1 范围

| | 规则 |
|---|---|
| **纳入** | 除 `/blog/**` 外的全部营销 / 产品 / 落地路径 |
| **排除** | `/blog/**`（仅英文）、`/datafun/`（noindex 的中文专场活动页，做镜像即重复）、docs.datus.ai、studio.datus.ai |
| **路径** | 中文 = `/zh` + 英文 path，**slug 不翻译** |
| **默认** | 新增营销页默认同步出 `/zh` 镜像 |

```
/{path}      ↔  /zh/{path}
/blog/...    →  仅英文，永不出现 /zh/blog，也不得声明 zh-Hans alternate
```

英文无前缀，保住存量 URL 权重。语言**只由 URL 决定**——不做 Accept-Language 嗅探、不读 cookie、不做自动跳转，爬虫和分享链接拿到的一定是路径所声明的语言。

`src/i18n/config.ts` 的 `MIRRORED_PATHS` 是路由清单的唯一事实来源，被路由 helper、预渲染、`/zh` 壳生成器和 sitemap 共用。

## 1.2 改文案去哪儿改

| 层 | 位置 |
|---|---|
| UI 通用文案（导航、页脚、按钮、表单标签、共用组件） | `src/i18n/ui.ts` |
| 页面正文 | 各页自己的 `content.ts` / `faq.ts`，导出 `Record<Locale, …>` |
| `<head>` 元数据 | 英文在 `<route>/index.html`（手写）；中文在 `src/i18n/pageMeta.ts` |
| 术语表词条 | 英文 `src/glossary/glossaryData.ts`；中文 `src/glossary/glossaryData.zh.ts`（按 slug 覆盖） |

组件里用 `useT(dict)` 取当前语言分支。**禁止**在组件内硬编码中英分支或长文；短标签最终也要进 `ui.ts`。

## 1.3 内链

内链一律写**英文形态**（`/pricing/`），由 `useHref()` 在渲染时加前缀：

```tsx
const l = useHref();
<a href={l("/pricing/")}>…</a>
```

- **禁止硬编码 `/zh/…`**。
- `localizePath()` 只给 `MIRRORED_PATHS` 里的路径加前缀，所以 `/blog/...`、外链、`mailto:`、纯锚点会原样透传——这是设计行为，不是遗漏。
- 语言切换器是 EN 页面上唯一允许指向 `/zh` 的链接（反之亦然）。

## 1.4 渲染必须是完整 HTML

**要求请求路由的 `text/html` 里就含完整页面内容（含文案），不能只返回 SPA 的 JS 再由前端挂载。**

`vite build` 只产出英文壳；`npm run prerender` 随后：

1. 从刚构建好的英文壳派生 `/zh` 壳（复用同一批 hash 资源，head 按 `pageMeta.ts` 重写）；
2. 给两棵树注入 hreflang 簇；
3. **两种语言各渲染一遍**，注入 `<div id="root">`；
4. 写出 `dist/sitemap-pages.xml`。

客户端走 `hydrateRoot`（见 `src/lib/mount.tsx`、`src/glossary-main.tsx`），所以 SSR 与 hydration 的产物必须一致。

> `npm run dev` 能看到 `/zh` 的**页面正文**，但看不到 `/zh` 的 **head 元数据**（那是构建期产物）。校验 meta 一律用 `npm run preview`。

## 1.5 新增一个营销页的清单

1. `src/i18n/config.ts` → `MIRRORED_PATHS` 加路径；
2. `src/i18n/pageMeta.ts` → `ZH_PAGE_META` 加中文 title / description / og（**缺了会直接构建失败**，`missingZhMeta()` 兜底）；
3. `src/prerender.tsx` → `PAGES` 加组件；
4. 页面文案写成 `Record<Locale, …>`；
5. 英文 `<route>/index.html` 照现有页面写 head；
6. `npm run build:all && npm run preview` 核对 §1.8 验收清单。

---

# 二、术语锁定表

对齐规范 §5。**精调、新增文案一律遵守，禁止同词多译**；需要新增映射时改这张表，不要各页自造。

## 2.1 品牌与品类

| English | 中文（锁定） | 备注 |
|---|---|---|
| Datus | Datus | 不译 |
| data engineering agent | 数据工程 Agent | 品类主译；不用「数据工程智能体」 |
| open-source | 开源 | |
| evolvable context | 可演进的上下文 | One Story 用语 |
| one-man / one-person data team | 一人数据团队 | |
| enterprise agent teams | 企业 Agent 团队 | |
| modern data stack | modern data stack | 保留英文 |

## 2.2 产品与能力

| English | 中文（锁定） | 备注 |
|---|---|---|
| Context Engine / Data Context Engine | 上下文引擎 / 数据上下文引擎 | 不译成「情境引擎」 |
| context | 上下文 | 数据语境下不用「情境」 |
| Subagent | 子代理 | 正文用「子代理」；产品名/标题可保留 Subagent |
| Semantic Layer | 语义层 | |
| semantic model | 语义模型 | |
| metrics | 指标 | |
| Reference SQL | Reference SQL | 产品概念保留英文 |
| NL2SQL / text-to-SQL | NL2SQL / 自然语言转 SQL | |
| lineage | 血缘 | |
| data quality | 数据质量 | |
| governance | 治理 | |
| long-running agents | 长时运行 Agent | |
| warehouse | 数仓 / 数据仓库 | 上下文清晰时用「数仓」 |
| catalog | 数据目录 | |
| MCP (Model Context Protocol) | MCP | 标题不译全称 |
| adapter | 适配器 | 数据库接入一律叫适配器，**不是** MCP 连接器 |
| schema | 表结构 / Schema | 「Schema 漂移」「Schema Linking」保留英文 |
| skills | Skills | 产品概念保留英文 |
| self-host | 私有部署 / 自行部署 | |
| RBAC / SSO / SLA | RBAC / SSO / SLA | 不译 |

## 2.3 导航与 CTA

| English | 中文（锁定） |
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
| Open Source | 开源版 |
| Cloud Personal | 云端个人版 |
| Contact us | 联系我们 |
| Capabilities / What you get | 核心能力 / 你能得到什么 |
| Quickstart | 快速开始 |

## 2.4 保留不译

产品名（Datus CLI / Studio / Enterprise）、CLI 命令与参数（`datus-cli --web`、`pip install datus-agent`）、包名、配置字段与代码标识符（`dataset.source`、`metrics[].aggregation`、`agent.yml`）、厂商与产品专名（Snowflake、dbt、Cube、LookML、Airflow…）、协议名（MCP、OSI、OpenTelemetry）。

## 2.5 One Story 锚点句

> Datus 是一个开源的数据工程 Agent，为你的数据系统构建可演进的上下文。
> 从一人数据团队到企业 Agent 团队——Datus 把数据工作变成可靠、可复用的 Agent 系统。

---

# 三、中文写作注意事项

- **标点用全角**：。，、；：？！（）——。英文专名、代码、数字与中文之间加半角空格：`支持 11+ 种数据库`、`用 pip install datus-agent 安装`。
- **不要机翻腔**：营销页要像中文母语者写的，而不是英文句式直译。长英文从句该拆就拆成两句。
- **CTA 用动词短语**，不要「点击这里」。
- **数字与事实必须与英文一致**：改了一边就要改另一边（例：glossary 的词条数量、支持的数据库数量）。
- **代码块、CLI 命令、YAML、字段名一律不翻译**，只翻译它们外面的说明文字。
- **翻译前先核对事实**。英文原文本身可能有错——例如 CLI FAQ 曾把 DuckDB/StarRocks/Hive/Spark/ClickHouse/Trino 写成「MCP-based connectors」，实际是原生适配器。发现这类错误要中英文一起改，不要照着错的翻。

---

# 四、SEO 硬性约束

- 各语言 `canonical` **指向自身**，禁止跨语言 canonical，一律绝对 URL。
- hreflang 簇 = `en` + `zh-Hans` + `x-default`（→ 英文），**双向互指且包含自身**。
- Blog 页面**不得**声明 `zh-Hans` alternate；`/zh/blog/**` 不得存在。
- `<html lang>`：英文 `en-US`，中文 `zh-CN`；`og:locale` / `og:locale:alternate` 随之。
- 面包屑、FAQ、HowTo 等 JSON-LD 的 URL 必须带正确 locale 前缀（`Breadcrumb` / `FAQ` 组件已内建，直接传英文形态 path 即可）。
- 尾斜杠：hreflang、canonical、sitemap 三者写法必须一致（本站统一带尾斜杠）。
- 非 blog 的 sitemap 由预渲染步骤写出（`scripts/lib/i18n-shells.mjs`），含两种语言 + `xhtml:link` hreflang；`scripts/build-blog.mjs` 只负责博客。
- 营销文案有实质改动时，同步 `scripts/lib/i18n-shells.mjs` 里的 `BUILD_DATE`（marketing 页 `<lastmod>`，与博客的 BUILD_DATE 相互独立）。

---

# 五、验收清单

改动涉及双语时，`npm run build:all && npm run preview` 后逐条核对：

- [ ] `/{path}` 与 `/zh/{path}` 均可**直接**访问（无语言协商跳转）
- [ ] `curl` 拿到的 HTML 里就有完整正文，不依赖 JS 挂载
- [ ] 不存在可索引的 `/zh/blog/**`；blog 页面无 `zh-Hans` hreflang
- [ ] `/en`、`/en/*` 落到无前缀页面（GitHub Pages 用 noindex 跳转桩代替 301）
- [ ] 营销页 hreflang 双向互指 + self + `x-default`→EN
- [ ] 各语言 canonical 指向自身，绝对 URL，与 sitemap 尾斜杠一致
- [ ] `<html lang>` 与页面语言一致
- [ ] 语言切换同 path 换前缀且**保留 `?query`**
- [ ] `/zh` 页面内链除语言切换器外全部在 `/zh` 内（blog 链接保持英文）
- [ ] 无硬编码漏网英文（抽查页面正文与共用组件）
- [ ] 术语符合第二章
- [ ] Headless 打开若干 `/zh` 页：无 console 报错、无 hydration mismatch
- [ ] 非 blog sitemap 含 `/zh` 镜像，且未混入 blog 中文 URL
