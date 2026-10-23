import type { Locale } from "../i18n/config";

type Resource = {
  category: string; title: string; description: string; cta: string;
  href: string; image: string; variant: "article" | "update" | "release";
};
type ResourcesCopy = { eyebrow: string; heading: string; browse: string; items: [Resource, Resource, Resource] };

// Latest publication batch (2026-10-19), verified on the public blog 2026-10-23.
// Cover paths reuse each post's entry in blog/cover-manifest.json.
export const RESOURCES: Record<Locale, ResourcesCopy> = {
 en:{eyebrow:'Related resources',heading:'In the spotlight',browse:'Explore the blog',items:[
  {category:'From the blog',title:'Composable Analytics: Agent-Built Views, Governed Metrics',description:'How agents assemble visual reports while reusing governed metric definitions.',cta:'Read the article',href:'/blog/composable-analytics-agent-built-dashboards/',image:'/images/composable-analytics-agent-built-dashboards/cover.svg',variant:'article'},
  {category:'From the blog',title:'Convert Semantic Models to Ossie: Cube, dbt and More',description:'Bring compatible existing models into Apache Ossie with supported conversion paths.',cta:'Read the article',href:'/blog/convert-semantic-models-to-ossie/',image:'/images/convert-semantic-models-to-ossie/editorial-cover.svg',variant:'article'},
  {category:'From the blog',title:'Is the Dashboard Dead?',description:'Where agent-built views fit, and why shared metric definitions still matter.',cta:'Read the article',href:'/blog/is-the-dashboard-dead/',image:'/images/is-the-dashboard-dead/manual-dashboard-architecture.svg',variant:'article'},
 ]},
 zh:{eyebrow:'相关资源',heading:'值得关注',browse:'浏览博客',items:[
  {category:'最新博客',title:'可组合分析：Agent 构建视图，复用受治理的指标',description:'了解 Agent 如何生成可视化报告，并复用团队维护的指标定义。',cta:'阅读文章',href:'/blog/composable-analytics-agent-built-dashboards/',image:'/images/composable-analytics-agent-built-dashboards/cover.svg',variant:'article'},
  {category:'最新博客',title:'将语义模型转换为 Ossie：从 Cube、dbt 等工具出发',description:'通过受支持的转换路径，将兼容的已有模型迁移到 Apache Ossie。',cta:'阅读文章',href:'/blog/convert-semantic-models-to-ossie/',image:'/images/convert-semantic-models-to-ossie/editorial-cover.svg',variant:'article'},
  {category:'最新博客',title:'仪表盘会消失吗？',description:'Agent 生成的视图适合哪些场景，为什么共享指标定义仍然重要。',cta:'阅读文章',href:'/blog/is-the-dashboard-dead/',image:'/images/is-the-dashboard-dead/manual-dashboard-architecture.svg',variant:'article'},
 ]},
};
