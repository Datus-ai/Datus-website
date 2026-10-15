import type { Locale } from "../i18n/config";

type Resource = {
  category: string; title: string; description: string; cta: string;
  href: string; image: string; variant: "article" | "update" | "release";
};
type ResourcesCopy = { eyebrow: string; heading: string; browse: string; items: [Resource, Resource, Resource] };

// Curated homepage selection. Refresh these three slots when new resources ship.
// Release details verified against https://docs.datus.ai/dev/release_notes/ on 2026-10-13.
export const RESOURCES: Record<Locale, ResourcesCopy> = {
  en: {
    eyebrow: "Related resources", heading: "In the spotlight", browse: "Explore the blog",
    items: [
      { category: "From the blog", title: "What Is Conversational BI? From Questions to Trusted Metrics", description: "How shared definitions keep metrics consistent as the conversation evolves.", cta: "Read the article", href: "/blog/what-is-conversational-bi/", image: "/images/what-is-conversational-bi/resource-cover.png", variant: "article" },
      { category: "Product update", title: "The Semantic Layer in the Agent Loop", description: "The September update: semantic models, ontology, and a feedback loop that improves context.", cta: "Explore the update", href: "/blog/semantic-layer-in-the-agent-loop/", image: "/images/semantic-layer-in-the-agent-loop/resource-cover.svg", variant: "update" },
      { category: "Release notes", title: "Datus 0.4.2: Images join the conversation", description: "Read local images with multimodal models, and explore the latest improvements and fixes.", cta: "Read release notes", href: "https://docs.datus.ai/dev/release_notes/#042", image: "/images/releases/datus-0-4-2/resource-cover.svg", variant: "release" },
    ],
  },
  zh: {
    eyebrow: "相关资源", heading: "值得关注", browse: "浏览博客",
    items: [
      { category: "博客精选", title: "什么是对话式 BI？从提问到可信指标", description: "了解共享定义如何让多轮对话中的指标保持一致。", cta: "阅读文章", href: "/blog/what-is-conversational-bi/", image: "/images/what-is-conversational-bi/resource-cover.png", variant: "article" },
      { category: "产品更新", title: "让语义层进入 Agent 工作闭环", description: "九月更新：将语义模型、本体与反馈闭环结合，让上下文持续演进。", cta: "了解产品更新", href: "/blog/semantic-layer-in-the-agent-loop/", image: "/images/semantic-layer-in-the-agent-loop/resource-cover.svg", variant: "update" },
      { category: "版本说明", title: "Datus 0.4.2：让图像加入对话", description: "通过多模态模型读取本地图像，查看最新功能改进与问题修复。", cta: "阅读版本说明", href: "https://docs.datus.ai/dev/release_notes/#042", image: "/images/releases/datus-0-4-2/resource-cover.svg", variant: "release" },
    ],
  },
};
