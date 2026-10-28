import type { Locale } from "../i18n/config";

type Resource = {
  category: string; title: string; description: string; cta: string;
  href: string; image: string; variant: "article" | "update" | "release";
};
type ResourcesCopy = { eyebrow: string; heading: string; browse: string; items: [Resource, Resource, Resource] };

// Spotlight selections. Cover paths reuse each post's entry in blog/cover-manifest.json.
export const RESOURCES: Record<Locale, ResourcesCopy> = {
 en:{eyebrow:'Related resources',heading:'In the spotlight',browse:'Explore the blog',items:[
  {category:'From the blog',title:'Introducing DOSI: Executable Business Context for AI Agents',description:'How Datus Agent, Studio, and DOSI turn reviewed business definitions into calculations teams can inspect.',cta:'Read the article',href:'/blog/datus-dosi-executable-business-context/',image:'/images/datus-dosi-executable-business-context/cover-meet-dosi.png',variant:'article'},
  {category:'From the blog',title:'Semantic Layer vs Ontology: Why AI Agents Need Both',description:'Why AI agents need shared metric definitions and business relationships to work together.',cta:'Read the article',href:'/blog/semantic-layer-vs-ontology/',image:'/images/semantic-layer-vs-ontology/resource-cover.svg',variant:'article'},
  {category:'From the blog',title:'Ontology for AI Agents: Five Approaches to Business Context',description:'Five ways to give AI agents business context, from semantic layers to knowledge graphs.',cta:'Read the article',href:'/blog/ontology-for-ai-agents-five-approaches/',image:'/images/ontology-for-ai-agents-five-approaches/cover-business-meaning.svg',variant:'article'},
 ]},
 zh:{eyebrow:'相关资源',heading:'值得关注',browse:'浏览博客',items:[
  {category:'最新博客',title:'DOSI 发布：让业务上下文成为 AI Agent 可执行的定义',description:'了解 Datus Agent、Studio 与 DOSI 如何将团队审核的业务定义用于可检查的计算。',cta:'阅读文章',href:'/blog/datus-dosi-executable-business-context/',image:'/images/datus-dosi-executable-business-context/cover-meet-dosi.png',variant:'article'},
  {category:'博客精选',title:'语义层与本体：为什么 AI Agent 两者都需要',description:'了解共享指标定义与业务关系如何共同为 AI Agent 提供可靠上下文。',cta:'阅读文章',href:'/blog/semantic-layer-vs-ontology/',image:'/images/semantic-layer-vs-ontology/resource-cover.svg',variant:'article'},
  {category:'博客精选',title:'面向 AI Agent 的本体：构建业务上下文的五种方法',description:'比较语义层、开放标准和知识图谱等五种提供业务上下文的方法。',cta:'阅读文章',href:'/blog/ontology-for-ai-agents-five-approaches/',image:'/images/ontology-for-ai-agents-five-approaches/cover-business-meaning.svg',variant:'article'},
 ]},
};
