# Datus UTM 使用规范

更新日期：2026-10-29。适用于官网开发、外部推广素材和交给同事发布的链接。

这是新增链接与开发评审的统一规范；本规范依据最新 `main` 的 `20de465` 核对（包含 #115 默认来源统一、#116 AI 来源识别）。当前实现细节见 [Studio 参数传递说明](studio-utm-handoff.md)，已记录的官网按钮见 [CTA 清单](studio-cta-tags.csv)。清单是维护快照，新页面、新按钮应同步补充，不能把它当作自动生成的实时清单。

## 1. 参数分工

| 参数 | 用途 | 外部推广链接 | 官网到 Studio 的 CTA |
|---|---|---|---|
| `utm_source` | 来源平台 | 例如 `linkedin`、`youtube`、`x` | 有外部来源时沿用；没有有效来源时使用 `datus.ai` 兜底 |
| `utm_medium` | 渠道类型 | 例如 `social`、`email`、`referral` | 沿用外部传入值 |
| `utm_campaign` | 同一推广活动 | 例如 `dosi_launch_202610` | 沿用外部传入值，不以页面名称覆盖 |
| `utm_content` | 具体内容或按钮位置 | 区分帖子、视频、素材和目标入口 | 使用当前官网按钮的固定标识 |

**有外部来源时保留外部来源和活动；没有有效来源时，官网到 Studio 使用 `utm_source=datus.ai` 兜底。按钮位置由 `utm_content` 定义，不编造 medium 或 campaign。**

站内页面之间的普通导航不添加 UTM。不要给首页到解决方案页的链接添加 `utm_source=datus.ai`，也不要在每次站内跳转时重建 campaign。

## 2. 命名与稳定性

- 新建值使用小写英文、数字和下划线，保持简短可读；例如 `official_announcement_studio`。接收端不会自动规范化大小写，开发时不要改写访客已经传入的有效值。
- 同一活动在不同平台共用 campaign；source 按实际发布平台区分。每个平台提供独立、可复制的完整链接，不把 LinkedIn 链接直接复用于 X。
- 官网按钮的 `utm_content` 通常为 `{page}_{placement}`，例如 `home_hero`、`pricing_cloud_signup`。沿用已有稳定值，不因换文案或微调布局改名。
- 页头与移动菜单由 `studioNavTag()` 生成：英文路径去首尾斜杠，`/` 和 `-` 转为 `_`，首页为 `home`，然后加 `_header` 或 `_mobile_menu`。
- 中文官网按钮由 `studioCtaUrl()` 自动加一次 `zh_`；不要手动再加。外部中文素材按渠道与内容命名，不能仅凭中文内容猜测平台。
- 外部内容可用 `{account_or_post}_{destination}`，例如 `shao_announcement_studio`、`launch_flash_dosi_connectors`。同一内容有多个目标时应区分目标。
- 官网接收的三个来源字段会去除首尾空白，每个最多 100 个字符；空值、超长值和控制字符被忽略。所有新建字段都应保持简短。UTM 中不放邮箱、姓名、Token、API key 或其他个人与机密信息。
- 保留原域名、路径、非 UTM 查询参数和 `#` 锚点；用 URL API 合并参数，避免重复添加 `?`、破坏编码或覆盖登录跳转参数。

## 3. 外部渠道的默认取值

以下是 Datus 对新建普通推广链接的团队约定，不是对所有流量的自动识别规则。

| 实际发布渠道 | `utm_source` | `utm_medium` |
|---|---|---|
| LinkedIn 自然帖子、公司页、文章 | `linkedin` | `social` |
| X 自然帖子、账号主页 | `x` | `social` |
| YouTube 频道、视频说明 | `youtube` | `social` |
| 自有 Slack 社区 | `slack` | `community` |
| 微信公众号、微信社群 | `wechat` | `social` |
| Medium 文章 | `medium` | `referral` |
| 邮件 Newsletter | 实际 Newsletter 名称，例如 `datus_newsletter` | `email` |

YouTube 新链接统一使用 `social`，不与 `video` 混用。付费广告不套用自然社交默认值，须另行确认 campaign 与付费 medium。合作伙伴明确发布在 LinkedIn 时仍用 `linkedin/social`，伙伴或账号可放在 `utm_content`；未明确平台时先确认，不能猜成 LinkedIn 或微信。

已使用的活动命名：

| 场景 | `utm_campaign` |
|---|---|
| 2026 年 10 月 Datus / DOSI 发布 | `dosi_launch_202610` |
| LinkedIn 公司主页常设链接 | `company_page` |
| X 账号主页常设链接 | `profile` |

发布活动素材不要沿用主页常设 campaign。新活动由市场与开发共同确定一个稳定名称。

交付草稿必须标注尚未确认的渠道；如使用 `replace_with_channel` 占位符，**发布前必须替换**。占位符不是合法的最终来源名称。不能把文档所在的 Google Docs 当成实际发布来源。

### 可直接参考的外部链接

LinkedIn 官方发布帖到官网：

```text
https://datus.ai/?utm_source=linkedin&utm_medium=social&utm_campaign=dosi_launch_202610&utm_content=official_announcement_website
```

YouTube 创始人视频直接到 Studio：

```text
https://studio.datus.ai/?utm_source=youtube&utm_medium=social&utm_campaign=dosi_launch_202610&utm_content=shao_announcement_studio
```

同一活动的 X 帖到 DOSI：

```text
https://dosi.datus.ai/?utm_source=x&utm_medium=social&utm_campaign=dosi_launch_202610&utm_content=official_announcement_dosi_quickstart
```

外部链接可指向官网、Studio、DOSI 或文档的实际目标。官网的自动传递逻辑仅覆盖下节描述的 Studio CTA，不代表 DOSI、文档站或 Studio 注册流程已实现同样的存储和归因。

## 4. 官网 CTA 的开发方式

使用现有 helper，不在组件里拼接一套来源参数或新增并行的存储逻辑。`studioCtaUrl()` 调用共享 `src/lib/studio-url.mjs` 的 `studioUrl()`；后者整组替换来源，将 `utm_source` 放在首位，在没有有效 campaign 时填入官网兜底：

```tsx
import { studioCtaUrl } from "../lib/studio-cta";
import { STUDIO_START_URL } from "../config/nav";

// locale 使用页面现有的 Locale；相对 import 路径按文件位置调整。
const href = studioCtaUrl(STUDIO_START_URL, "home_hero", locale);
```

这是 helper 用法示例；现有首页 Hero 实际保留 `/login` 目标。应保持按钮已有目标语义：根路径、`/login`、`/overview` 不因添加 UTM 而互换。

服务端输出的基础链接示例：

```text
https://studio.datus.ai/?utm_source=datus.ai&utm_content=home_hero
https://studio.datus.ai/?utm_source=datus.ai&utm_content=zh_home_hero
```

用户从 LinkedIn 进入官网，再点击首页 Hero 后：

```text
https://studio.datus.ai/login?utm_source=linkedin&utm_medium=social&utm_campaign=dosi_launch_202610&utm_content=home_hero
```

外部链接自身的 `utm_content` 不会被转发：此时使用官网按钮的 `home_hero`。外部直接跳 Studio 时，URL 中仍是外部素材的 content；本仓库不承诺 Studio 会记录它。若需要同时保留外部素材与官网按钮位置，须另行设计字段，不能暗中改变现有含义。

开通类 CTA 文案复用 `src/i18n/ui.ts` 的 `common.tryStudio`：**Get Started Free／免费开始使用**。文案统一不意味着 content 标签统一。

## 5. 自动传递、自然搜索与暂存

营销页面水合后及静态 Blog 加载后，由 `setupStudioCampaignHandoff()` 装饰全部 **origin 严格等于 `https://studio.datus.ai` 的链接**，不要求原来已有 `utm_content`。SSR 与 Blog 构建也使用同一个 `studioUrl()` 生成默认来源。不要将此规则扩大到其他子域或其他端口。

来源优先级为：

1. 当前 URL 的显式 `utm_source`、`utm_medium`、`utm_campaign`。
2. 无显式 UTM 时，可识别的当前 referrer：搜索引擎名称 + `organic`，或已知 AI 产品域名 + `referral`；两者均不生成 campaign。
3. 已接受使用分析且仍有效的当前标签页缓存。
4. 没有可用证据时，使用 `utm_source=datus.ai` 和按钮已有的 `utm_content`，不添加 medium 或 campaign。兜底表示官网转入，不代表已经识别了用户最初来源，也不作为 campaign 证据写入缓存。

只要三个字段中任意一个出现在 URL 中，就视作显式到达；即使为空或无效，也不回退混入旧活动。新活动整体替换旧活动，缺失字段不从旧活动补齐。

搜索和 AI 来源的精确白名单见 `src/lib/referrer-attribution.ts`。已知 AI 产品包括 ChatGPT、Claude、Perplexity、Gemini、Copilot、DeepSeek；例如 Claude 为 `utm_source=claude.ai&utm_medium=referral`，ChatGPT 为 `chatgpt.com/referral`。只匹配已确认的产品域名，不把所有 OpenAI 或 Anthropic 站点都当作 AI 推荐。

已知广告点击标识阻止来源推断且清除旧缓存，无显式来源时使用官网兜底。任一已知 UTM 字段（包括 content、term、id、source_platform）存在时都阻止 referrer 推断；其中只有 source、medium、campaign 参与传递。仅传 content 等字段不构成新的三字段 campaign，也不会因此清除仍有效的缓存。来源受浏览器 referrer 可用性限制，不等同于 GA4 的归因结果；无 referrer 时不能猜测 AI 来源。

只有接受官网使用分析后才使用 `sessionStorage`：key 为 `datus_website_campaign`，仅保存三个来源字段和获取时间，从获取时起 30 分钟失效，普通跳转不续期。拒绝、撤回或同意过期会清理缓存。未接受或存储不可用时，仅能使用当前 URL 或当前可识别搜索／AI 来源，否则使用官网兜底，不保证跨页保留。

官网不转发完整 referrer、搜索词、`utm_term`、外部 `utm_content`、登录码、其他查询参数或 URL 片段。动态菜单和新标签页使用同一套已装饰 href；不同标签页不依赖共享存储。

## 6. Blog、Support 与系统边界

Blog、Support 与营销页已统一为相同的官网默认来源和外部来源传递规则。`scripts/build-blog.mjs` 在构建时通过 `studioUrl()` 处理 Studio 链接；`src/site-motion.ts` 在 Blog 加载后启用同一 handoff。

- Blog 页头使用 `utm_content=blog_header`；生成的正文 CTA 使用 `blog_cta`。
- 不再新增历史组合 `utm_source=datus.ai&utm_medium=blog&utm_campaign=get_started`。旧 UTM 的来源三字段由统一 builder 替换，不能从旧模板重新引入。
- 原有 Studio 链接保留目标路径；Support 反馈等功能入口也参与统一来源处理，但不能把它们的目标路径批量改成注册页。

官网能保证的是符合条件的链接携带参数。Studio 是否保留登录、SSO、注册跳转中的参数，以及是否关联到注册成功事件，必须由 Studio 端验证；本仓库没有因此新增访客 ID、采集接口或完整跨域归因系统。

## 7. 开发与发布检查清单

- 新 Studio 开通按钮使用 `studioCtaUrl()`、现有目标常量和共享 CTA 文案；每个页面位置有稳定 content，中文只加一次前缀。
- 同步维护 [CTA 清单](studio-cta-tags.csv)；参数语义或行为变化时同步修改本规范、[传递说明](studio-utm-handoff.md)和相关开发说明。
- 外部素材提供逐平台完整 URL；source、medium、campaign、content 与发布位置一致，无待填占位符，保留目标路径与锚点。
- 检查显式三字段传递、新活动替换、跨页暂存、自然搜索、AI referral、无来源兜底访问、拒绝与撤回、过期和存储不可用。
- 检查中文、移动菜单、新标签页及预渲染；外部来源不能被写进静态 HTML。
- 影响实现时先执行 `npm run build:all`，再执行 `npm run test:studio-campaign`；影响同意或存储时另执行 `npm run test:cookie-consent`。仅修改文档时检查规则与实现一致、示例和链接有效即可。

实现入口：`src/lib/studio-url.mjs`、`src/lib/studio-cta.ts`、`src/lib/studio-campaign.ts`、`src/lib/referrer-attribution.ts`、`src/components/SiteLayout.tsx`。Blog 的生成入口在 `scripts/build-blog.mjs`；同意状态在 `src/cookie-consent/choice.ts`。
