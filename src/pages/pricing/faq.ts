import type { FaqItem } from "../../components/FAQ";
import type { Locale } from "../../i18n/config";

// Page-specific FAQ for /pricing/ — free tier, Enterprise quote, OSS license,
// BYOK billing, cancellation. Owned by this URL only; see datus-faq-spec.md.
const EN: FaqItem[] = [
  {
    q: "Is Datus really free to use?",
    a: "The core Datus agent is free and open source under Apache 2.0, including CLI, Context Engine, Subagents, and multi-model support. Cloud Personal is also free for hosted exploration. You still pay your own LLM and warehouse costs. Enterprise adds team governance, SSO, audit logs, and SLA-backed support through a custom quote.",
  },
  {
    q: "What is included in Cloud Personal versus Enterprise?",
    a: "Cloud Personal lets you try Datus in the browser without installing the CLI—ideal for demos and light exploration. Enterprise adds shared context stores, access control, audit trails, dedicated support, and deployment options for regulated teams. LinkedIn, Expedia, and Coinbase-class requirements map to Enterprise, not the free tiers.",
  },
  {
    q: "How do I get Enterprise pricing?",
    a: "Enterprise pricing is not listed publicly. Contact the Datus team through the site form or sales email with your team size, warehouses, and compliance needs. Typical buyers need SSO, audit logs, shared context across engineers, and an SLA. POC engagements often start on open source before upgrading.",
  },
  {
    q: "Do I need to pay for LLM usage separately?",
    a: "Yes, for CLI and most self-hosted setups. Datus does not bundle model tokens; you connect your OpenAI, Anthropic, or other provider keys. That keeps inference costs transparent and lets you choose models per Subagent. Cloud Personal may include limited managed usage—check the current pricing page for quotas.",
  },
  {
    q: "Can I cancel or downgrade at any time?",
    a: "Open-source CLI has no subscription—you simply stop using it. Cloud Personal can be abandoned without a contract. Enterprise terms depend on your agreement; standard POCs convert to annual contracts with negotiated exit clauses. There is no lock-in on your data context exports from the CLI.",
  },
  {
    q: "Does the open-source license allow commercial use?",
    a: "Yes. Apache 2.0 permits commercial use, modification, and distribution with attribution. You can run Datus internally or embed derived Subagent APIs in your products, subject to Apache terms. Enterprise is optional unless you need vendor support, SSO, or a managed context store.",
  },
];

const ZH: FaqItem[] = [
  {
    q: "Datus 真的可以免费用吗？",
    a: "Datus 的核心 Agent 基于 Apache 2.0 免费开源，包含 CLI、上下文引擎、子代理与多模型支持。云端个人版同样免费，可用于托管环境下的探索。你仍需自行承担大模型和数仓的费用。企业版通过定制报价额外提供团队治理、SSO、审计日志和带 SLA 的技术支持。",
  },
  {
    q: "云端个人版和企业版分别包含什么？",
    a: "云端个人版让你不装 CLI 就能在浏览器里试用 Datus，适合演示和轻量探索。企业版额外提供共享上下文存储、访问控制、审计留痕、专属支持，以及面向合规团队的部署选项。LinkedIn、Expedia、Coinbase 这一量级的需求对应的是企业版，而不是免费档。",
  },
  {
    q: "怎么获取企业版报价？",
    a: "企业版价格不公开列出。请通过站内表单或销售邮箱联系 Datus 团队，并说明团队规模、使用的数仓和合规要求。典型客户需要 SSO、审计日志、工程师之间共享的上下文，以及 SLA。POC 通常先从开源版开始，之后再升级。",
  },
  {
    q: "大模型用量需要单独付费吗？",
    a: "CLI 和大多数自部署场景下需要。Datus 不打包模型 Token，你自己接入 OpenAI、Anthropic 或其他厂商的 Key。这样推理成本是透明的，也能给不同子代理挑不同模型。云端个人版可能包含少量托管额度——具体配额请以定价页当前信息为准。",
  },
  {
    q: "可以随时取消或降级吗？",
    a: "开源 CLI 没有订阅——不想用了直接停用即可。云端个人版没有合同，随时可以弃用。企业版条款取决于双方协议；标准 POC 通常会转为年度合同，并附带协商好的退出条款。从 CLI 导出的数据上下文不存在任何锁定。",
  },
  {
    q: "开源许可允许商用吗？",
    a: "允许。Apache 2.0 在保留署名的前提下允许商业使用、修改与分发。你可以在公司内部运行 Datus，也可以在遵守 Apache 条款的前提下把衍生的子代理 API 嵌入自己的产品。除非你需要厂商支持、SSO 或托管的上下文存储，否则企业版是可选的。",
  },
];

export const pricingFaq: Record<Locale, FaqItem[]> = { en: EN, zh: ZH };
