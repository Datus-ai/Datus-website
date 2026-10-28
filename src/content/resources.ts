import type { Locale } from "../i18n/config";

type Resource = {
  category: string; title: string; description: string; cta: string;
  href: string; image: string; variant: "article" | "update" | "release";
};
type ResourcesCopy = { eyebrow: string; heading: string; browse: string; items: [Resource, Resource, Resource] };

// Spotlight selections. Cover paths reuse each post's entry in blog/cover-manifest.json.
export const RESOURCES: Record<Locale, ResourcesCopy> = {
 en:{eyebrow:'Related resources',heading:'In the spotlight',browse:'Explore the blog',items:[
  {category:'From the blog',title:'Introducing DOSI: Executable Business Context for AI Agents',description:'How Datus Agent, Studio, and DOSI turn reviewed business definitions into calculations teams can inspect.',cta:'Read the article',href:'/blog/datus-dosi-executable-business-context/',image:'/images/datus-dosi-executable-business-context/cover.svg',variant:'article'},
  {category:'From the blog',title:'Convert Semantic Models to Ossie: Cube, dbt and More',description:'Bring compatible existing models into Apache Ossie with supported conversion paths.',cta:'Read the article',href:'/blog/convert-semantic-models-to-ossie/',image:'/images/convert-semantic-models-to-ossie/editorial-cover.svg',variant:'article'},
  {category:'From the blog',title:'Is the Dashboard Dead?',description:'Where agent-built views fit, and why shared metric definitions still matter.',cta:'Read the article',href:'/blog/is-the-dashboard-dead/',image:'/images/is-the-dashboard-dead/manual-dashboard-architecture.svg',variant:'article'},
 ]},
 zh:{eyebrow:'相关资源',heading:'值得关注',browse:'浏览博客',items:[
  {category:'最新博客',title:'DOSI 发布：让业务上下文成为 AI Agent 可执行的定义',description:'了解 Datus Agent、Studio 与 DOSI 如何将团队审核的业务定义用于可检查的计算。',cta:'阅读文章',href:'/blog/datus-dosi-executable-business-context/',image:'/images/datus-dosi-executable-business-context/cover.svg',variant:'article'},
  {category:'最新博客',title:'将语义模型转换为 Ossie：从 Cube、dbt 等工具出发',description:'通过受支持的转换路径，将兼容的已有模型迁移到 Apache Ossie。',cta:'阅读文章',href:'/blog/convert-semantic-models-to-ossie/',image:'/images/convert-semantic-models-to-ossie/editorial-cover.svg',variant:'article'},
  {category:'最新博客',title:'仪表盘会消失吗？',description:'Agent 生成的视图适合哪些场景，为什么共享指标定义仍然重要。',cta:'阅读文章',href:'/blog/is-the-dashboard-dead/',image:'/images/is-the-dashboard-dead/manual-dashboard-architecture.svg',variant:'article'},
 ]},
};
