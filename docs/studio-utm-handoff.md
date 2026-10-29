# Datus 官网到 Studio 的 UTM 参数传递说明

For new links and code reviews, follow the [UTM conventions](utm-conventions.md). This document supplements them with implementation boundaries and acceptance checks.

更新日期：2026 年 10 月 28 日。适用于官网所有 Studio 跳转，包括中英文营销页面、移动菜单、支持页以及 Blog 导航、CTA 和正文链接。

外部推广链接用 `utm_source`、`utm_medium`、`utm_campaign` 说明用户从哪里来；没有这些参数时，官网也会尝试识别搜索引擎来源。官网用 `utm_content` 说明用户点击了哪个按钮，并将来源和按钮标识合并到 Studio 链接中，不把外部来源改写成 `datus.ai`。没有有效推广来源时，使用 `utm_source=datus.ai` 兜底，不额外生成 medium 或 campaign，也不把默认值保存成推广来源。

## 参数如何分工

| 参数 | 负责填写 | 示例 | 官网处理方式 |
|---|---|---|---|
| `utm_source` | 外部推广链接，或搜索引擎识别 | `linkedin`、`youtube`、`google` | 显式传入值优先；否则可识别为搜索引擎名称；没有有效推广来源时使用 `datus.ai` |
| `utm_medium` | 外部推广链接，或搜索引擎识别 | `social`、`video`、`email`、`organic` | 沿用传入值；自然搜索使用 `organic` |
| `utm_campaign` | 外部推广链接 | `product_launch` | 沿用传入值；自然搜索不编造 campaign |
| `utm_content` | 官网 CTA | `home_hero` | 使用当前按钮的固定标识 |

外部素材也使用 `utm_content` 时，该字段不会继续转发：进入 Studio 的 `utm_content` 专门表示官网按钮位置。若后续需要同时保留外部素材标识，应另行定义字段。

## 一个完整示例

LinkedIn 发布的官网链接：

```text
https://datus.ai/?utm_source=linkedin&utm_medium=social&utm_campaign=product_launch
```

用户点击首页 Hero 的 Studio 按钮后，目标链接为：

```text
https://studio.datus.ai/login?utm_source=linkedin&utm_content=home_hero&utm_medium=social&utm_campaign=product_launch
```

接受使用分析后，用户也可以先进入解决方案页，再点击该页的按钮：

```text
https://studio.datus.ai/login?utm_source=linkedin&utm_content=semantic_layer_hero&utm_medium=social&utm_campaign=product_launch
```

所有链接统一通过 `src/lib/studio-url.mjs` 组装；存在 `utm_source` 时，固定放在查询参数第一位，例如 `https://studio.datus.ai/login?utm_source=datus.ai&utm_content=home_hero`。不改变目标路径、其他业务参数或片段。页头与手机菜单的 Studio 试用按钮直达 `https://studio.datus.ai/`；正文中的登录按钮仍去 `/login`，演示入口仍去 `/overview`。例如首页页头为 `https://studio.datus.ai/?utm_source=datus.ai&utm_content=home_header`，中文版为 `https://studio.datus.ai/?utm_source=datus.ai&utm_content=zh_home_header`。

Studio 开通入口的按钮文案统一为 **Get Started Free**／**免费开始使用**，由 `src/i18n/ui.ts` 中的 `common.tryStudio` 维护。页面、位置和语言仍通过各自的 `utm_content` 区分；统一文案不合并标签。Studio 产品页不再提供演示视频按钮。

## 自然搜索如何传给 Studio

Google 自然搜索的官网链接通常没有 UTM。如果浏览器提供了可识别的 Google 搜索来源，官网会在 Studio CTA 上补充：

```text
https://studio.datus.ai/login?utm_source=google&utm_content=home_hero&utm_medium=organic
```

识别范围为代码中明确列出的搜索域名：Google 及常见地区域名、Bing、DuckDuckGo、Yahoo Search、百度、搜狗、360、Yandex、Naver Search、Brave Search、Ecosia、Startpage 和 Qwant。`utm_source` 分别使用 `google`、`bing`、`duckduckgo`、`yahoo`、`baidu`、`sogou`、`360`、`yandex`、`naver`、`brave`、`ecosia`、`startpage`、`qwant`；`utm_medium` 统一为 `organic`。

这是一套基于浏览器来源域名的识别规则，不等于读取 Google Analytics 的归因结果。浏览器未提供来源、来源不在白名单内、来自 Gmail 等非搜索产品时，都不会猜测为自然搜索，也不会从来源 URL 复制搜索词。

优先级为：**显式 UTM → 当前可识别的搜索或 AI 问答来源 → 有效暂存 → `utm_source=datus.ai` 兜底**。显式 UTM 即使只包含部分有效字段，也不补成另一组来源（例如只带 campaign 时不会补 `datus.ai`）。全部字段无效时使用官网兜底。自然搜索会整体替换之前暂存的推广来源，清除旧 campaign。

带有 `gclid`、`dclid`、`gbraid`、`wbraid`、`msclkid`、`yclid` 或 `NaPm` 等已知广告点击标识时，不推断为自然搜索，也不沿用旧暂存；有显式 UTM 时仍以 UTM 为准。此改动不实现付费广告点击归因。

付费链接如果既没有 UTM，也没有可识别的广告点击标识，仅凭来源域名无法可靠区分付费与自然搜索。来源读取与分类原则可参考 [浏览器 referrer 说明](https://developer.mozilla.org/en-US/docs/Web/API/Document/referrer) 和 [Google 流量来源处理说明](https://support.google.com/analytics/answer/11242841?hl=en)。

## AI 问答推荐如何传给 Studio

没有显式 UTM 或已知广告点击标识时，根据 `document.referrer` 的精确域名白名单识别 AI 引荐。AI 使用 `referral`，与传统自然搜索的 `organic` 区分；来源使用产品规范域名，与 ChatGPT 等显式 UTM 保持一致：

| 产品 | Referer 域名白名单 | 推断 utmSource | 推断 utmMedium |
| --- | --- | --- | --- |
| ChatGPT | chatgpt.com、www.chatgpt.com、chat.openai.com | chatgpt.com | referral |
| Claude | claude.ai、www.claude.ai | claude.ai | referral |
| Perplexity | perplexity.ai、www.perplexity.ai | perplexity.ai | referral |
| Gemini | gemini.google.com | gemini.google.com | referral |
| Copilot | copilot.microsoft.com、copilot.com、copilot.cloud.microsoft、m365.cloud.microsoft | copilot.microsoft.com | referral |
| DeepSeek | chat.deepseek.com | chat.deepseek.com | referral |


例如 Claude → 官网 → Studio：

```text
https://studio.datus.ai/login?utm_source=claude.ai&utm_medium=referral&utm_content=home_hero
```

显式 UTM 优先、不补缺失字段；已知广告点击标识阻止推断。新识别的 AI 来源整体替换旧来源，不沿用旧 campaign。接受使用分析后按现有规则在当前标签页暂存 30 分钟，跨语言和 Blog 继续透传；拒绝时只使用当前页面来源。SaaS 直接入口使用同一白名单和字段值。

只读取来源域名，不保存对话 ID、问题、完整 URL、查询参数或片段。不把 OpenAI、Anthropic 的营销站或 API 控制台当作 AI 推荐。Referer 仅证明来自该产品，不能证明具体回答推荐了 Datus。若客户端既不提供 Referer 也不带 UTM，无法可靠识别；不根据 User-Agent 或机器人访问猜测来源，官网继续使用 datus.ai 兜底。

域名依据：[ChatGPT 发布者说明](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq)、[Claude 入口](https://support.claude.com/en/articles/8114487-what-interfaces-can-i-use-to-access-claude)、[Perplexity 帮助](https://www.perplexity.ai/help-center/en/articles/11187416-which-perplexity-subscription-plan-is-right-for-you)、[Gemini 入口](https://support.google.com/gemini/answer/14886647?hl=en)、[Copilot 新旧入口](https://support.microsoft.com/en-us/microsoft-365-copilot/troubleshoot-content-copilot-app)、[Copilot 企业入口](https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-app-overview)、[DeepSeek 入口](https://api-docs.deepseek.com/news/news1210/)。这些资料用于核对产品入口，不代表所有客户端都会发送 Referer。

## 浏览其他页面时如何保留来源

接受官网的使用分析设置后，来源参数保存在当前标签页的 `sessionStorage`，从获取时起最多 30 分钟。普通站内跳转不会延长这段时间。只保存三个参数及其获取时间，不创建访客标识，也不发送新的埋点请求。

| 情况 | 行为 |
|---|---|
| 当前 URL 有推广参数 | 使用当前 URL 的一组参数 |
| 没有显式 UTM，但识别到自然搜索 | 使用搜索引擎名称和 `organic`，不生成 campaign |
| 没有显式 UTM 或新识别的搜索／AI 问答来源，已接受分析且缓存有效 | 使用之前保存的一组参数 |
| 新的推广链接进入官网 | 整体替换之前的一组参数，不混用不同活动 |
| 只传入部分字段 | 只保留这些字段，不从旧活动补齐缺失字段 |
| 没有参数、可识别的搜索来源或有效缓存 | Studio 链接携带按钮自己的 `utm_content` 和 `utm_source=datus.ai`，不生成 medium 或 campaign |
| 已知广告点击标识，但没有显式 UTM | 不推断 organic，清除旧暂存，使用 `utm_source=datus.ai` 兜底 |
| 未接受、拒绝或浏览器禁止存储 | 只使用当前 URL 参数或当前可识别的搜索／AI 问答来源，否则使用官网兜底；不跨页保存 |
| 撤回同意或同意到期 | 清理暂存；当前 URL 参数或当前可识别的搜索来源仍可随链接传递 |
| 保存超过 30 分钟 | 参数失效，使用官网兜底，直到新的推广链接或可识别的自然搜索访问进入 |

独立打开的标签页不共享这项存储。浏览器可能把已有页面的会话存储复制到它打开的新标签页，但不应依赖这个行为。直接通过官网 CTA 在新标签页打开 Studio 时，已合并好的参数包含在链接本身，无需 Studio 读取官网的存储。

每个字段最多 100 个字符，忽略空值、过长值和控制字符。只转发三个允许的来源字段；完整来源 URL、搜索词、登录验证码、Token、其他查询参数和 URL 片段不会被复制。不要在 UTM 中放置邮箱、姓名等个人信息。

## 官网按钮标识

| 页面与位置 | 英文页面 `utm_content` |
|---|---|
| 首页 Hero | `home_hero` |
| 首页底部 | `home_closing` |
| Semantic Layer Hero | `semantic_layer_hero` |
| Semantic Layer 流程后 | `semantic_layer_workflow` |
| Semantic Layer 底部 | `semantic_layer_closing` |
| Studio 演示按钮 | `studio_hero_demo` |
| Studio 注册按钮 | `studio_closing_signup` |
| Pricing 免费注册 | `pricing_cloud_signup` |
| Integrations 底部 | `integrations_closing` |
| Chatbot 底部 | `chatbot_closing` |
| Converter 的 Studio 资源链接 | `semantic_converter_resources` |

页头按钮使用 `{页面路径}_header`，移动菜单使用 `{页面路径}_mobile_menu`。路径中的 `/` 和 `-` 替换为 `_`，移除首尾斜杠；首页使用 `home`。例如：`solutions_semantic_layer_header`、`products_studio_mobile_menu`。

中文页面统一添加 `zh_`，例如 `zh_home_hero`。完整的页面、按钮和基础链接清单见 [CTA tag 清单](studio-cta-tags.csv)。

## 官网和 Studio 各自负责什么

| 范围 | 本次改动 |
|---|---|
| 官网所有 Studio 链接 | 读取 UTM 或识别自然搜索／AI 问答来源，按同意状态暂存，并合并到 Studio CTA |
| 页面语言与主题 | 保持原有行为；语言切换后来源仍可继续使用 |
| Blog 文章与 CTA | 与营销页面共用默认来源和外部来源透传；导航使用 `utm_content=blog_header`，生成的正文 CTA 使用 `blog_cta`；文章原有 Studio 链接保持路径并补默认来源，不再生成 blog medium 或 campaign |
| Support 功能链接 | 反馈、Studio 和部署文档入口保持目标路径，补充官网按钮标识，并使用统一来源规则 |
| Studio 注册流程 | 本次不修改，需要产品端保留登录、SSO 和注册跳转中的传入参数 |
| GA4 与注册归因 | 本次不配置完整归因链路，也不新增注册成功事件 |

本次实现保证符合条件的官网 CTA 链接可以带上来源参数；不保证 Studio 已记录这些参数，也不保证注册报表已完成关联。Studio 同事可使用上面的示例链接检查登录、SSO 回调和注册成功后的参数保留情况。

## 发布前验收

1. 从带有 LinkedIn 参数的官网链接进入，检查 Hero CTA 中的四个字段。
2. 接受使用分析，浏览解决方案页，确认来源仍是 LinkedIn，按钮标识变成该页的标识。
3. 打开移动菜单，确认菜单 CTA 有自己的标识，并保留同一组来源。
4. 用新的 YouTube 推广链接进入，确认不再混入旧 LinkedIn 活动字段。
5. 拒绝或撤回使用分析，确认暂存清除；没有 URL 参数的其他页面使用官网兜底和按钮标识。
6. 在中文页面、右键新标签页打开、缓存过期和存储被禁用的情况下重复检查。
7. 从 Google 或 Bing 搜索来源进入，不携带 UTM，确认 Studio 链接出现搜索引擎名称和 `organic`，没有旧 campaign。
8. 使用显式推广 UTM，确认完整保留来源组合，部分字段不混入官网兜底；使用已知广告点击标识、Gmail、未知域名或没有来源进入，确认使用 `datus.ai` 兜底，不被错误标记为自然搜索。
9. 禁用 JavaScript，确认中英文预渲染 CTA 包含官网兜底和按钮标识。

## 代码入口

- `src/lib/studio-url.mjs`：公共 URL 组装方法，整组替换来源、设置兜底，并保证 source 在首位。
- `src/lib/studio-cta.ts`：生成固定的按钮标识和基础链接，兼容预渲染。
- `src/lib/studio-campaign.ts`：合并来源、管理暂存及到期，更新动态生成的 CTA。
- `src/lib/referrer-attribution.ts`：搜索和 AI 问答域名白名单与广告点击标识排除规则。
- `src/components/SiteLayout.tsx`：页面完成水合后启用参数传递，避免影响服务端 HTML。
- `scripts/build-blog.mjs` 与 `src/site-motion.ts`：Blog 生成时处理所有 Studio 链接，加载后使用相同来源传递逻辑。
- `src/cookie-consent/choice.ts` 与 `src/cookie-consent/main.ts`：读取和同步现有的分析同意状态。
- `src/i18n/cookie.ts` 与 `src/pages/policies/cookies/content.ts`：中英文存储说明。

## 验证结果

完整构建、推广与自然搜索参数传递测试、原有 Cookie 同意测试均已通过。

检查范围包括 `utm_campaign` 在内的三个来源字段、自然搜索及地区域名识别、显式 UTM 优先、广告点击排除、跨页保留、中文与移动菜单、新来源替换、到期清理、拒绝与撤回、存储不可用，以及服务端预渲染和浏览器水合。

相关命令为 `npm run build:all`、`npm run test:studio-campaign` 和 `npm run test:cookie-consent`。测试只访问本地网站，并模拟外部请求，不向真实 Studio 或 GA 发送测试数据。

发布状态以 Git 记录和对应 PR 为准。
