import type { FaqItem } from "../../components/FAQ";

// Page-specific FAQ for /pricing/ — free tier, Enterprise quote, OSS license,
// BYOK billing, cancellation. Owned by this URL only; see datus-faq-spec.md.
export const pricingFaq: FaqItem[] = [
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
