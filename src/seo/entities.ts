import { absoluteUrl, type Locale } from '../i18n/config';

const SITE = 'https://datus.ai/';
const organizationId = `${SITE}#organization`;
const websiteId = `${SITE}#website`;
const agentId = `${SITE}products/cli/#software`;
const studioId = `${SITE}products/studio/#software`;
const dosiId = 'https://dosi.datus.ai/#software';

/** Shared product entities keep their identity across translated page URLs. */
export const ENTITY_COPY: Record<Locale, {
 company: string; agent: string; studio: string; dosi: string;
 pages: Record<string, string>;
}> = {
 en: {
  company: 'The trusted enterprise data context for AI agents. Datus connects business ontology, semantic definitions, and data provenance in shared context that teams can review and agents can use.',
  agent: 'An open-source data Agent for data engineering and analysis. Work with SQL, data pipelines, and reusable business context; semantic modeling is one of its capabilities.',
  studio: 'A shared workspace for agent-driven data engineering and analysis. Bring files, SQL, results, and Agent conversations together in Datus Studio.',
  dosi: 'Datus’s semantic execution runtime, also available independently. DOSI validates compatible Apache Ossie definitions and compiles supported queries into native SQL for the selected data source. Apache Ossie is the open specification; DOSI uses Elastic License 2.0.',
  pages: {
   '/': 'Datus — Trusted Enterprise Data Context for AI Agents',
   '/products/cli/': 'Datus Agent — Open-Source Data Engineering and Analysis',
   '/products/studio/': 'Datus Studio — Workspace for Agent-Driven Data Work',
   '/solutions/semantic-layer/': 'Semantic Layer for AI Agents and Analytics | Datus',
  },
 },
 zh: {
  company: '面向 AI Agent 的可信企业数据上下文。Datus 将业务本体、语义定义与数据来源连接为共享上下文，让团队能够审核，让 Agent 在工作中使用。',
  agent: '支持数据工程与分析的开源数据 Agent，可处理 SQL、数据管道和可复用的业务上下文。语义建模是其能力之一。',
  studio: '团队协作开展 Agent 驱动的数据工程与分析的工作空间。在 Datus Studio 中整合文件、SQL、结果与 Agent 对话。',
  dosi: 'Datus 的语义执行运行时，也可独立使用。DOSI 校验兼容的 Apache Ossie 定义，并将受支持的查询编译为选定数据源的原生 SQL。Apache Ossie 提供开放规范；DOSI 采用 Elastic License 2.0 许可。',
  pages: {
   '/': 'Datus — 面向 AI Agent 的可信企业数据上下文',
   '/products/cli/': 'Datus Agent — 开源的数据工程与分析 Agent',
   '/products/studio/': 'Datus Studio — Agent 驱动的数据工作空间',
   '/solutions/semantic-layer/': '面向团队与 AI Agent 的语义层解决方案 — Datus',
  },
 },
};

export function pageEntityGraph(path: string, locale: Locale) {
 const copy = ENTITY_COPY[locale];
 if (!copy.pages[path]) return null;
 const url = absoluteUrl(path, locale);
 const publisher = { '@id': organizationId };
 const agent = {
  '@type': 'SoftwareApplication', '@id': agentId, name: 'Datus Agent', alternateName: 'Datus CLI',
  url: absoluteUrl('/products/cli/', locale), description: copy.agent,
  applicationCategory: 'DeveloperApplication', operatingSystem: 'macOS, Linux, Windows',
  license: 'https://www.apache.org/licenses/LICENSE-2.0', isAccessibleForFree: true,
  sameAs: 'https://github.com/Datus-ai/Datus-agent', publisher,
 };
 const studio = {
  '@type': 'WebApplication', '@id': studioId, name: 'Datus Studio',
  url: absoluteUrl('/products/studio/', locale), description: copy.studio,
  applicationCategory: 'BusinessApplication', operatingSystem: 'Web browser', publisher,
 };
 const dosi = {
  '@type': 'SoftwareApplication', '@id': dosiId, name: 'DOSI', url: 'https://dosi.datus.ai/',
  description: copy.dosi, applicationCategory: 'DeveloperApplication', license: 'Elastic License 2.0', publisher,
 };
 const products = path === '/' ? [agent, studio, dosi] : path === '/products/cli/' ? [agent] : path === '/products/studio/' ? [studio] : [dosi];
 return {
  '@context': 'https://schema.org',
  '@graph': [
   { '@type': 'Organization', '@id': organizationId, name: 'Datus', url: SITE,
    logo: `${SITE}logo_light.svg`, email: 'contact@datus.ai', description: copy.company,
    sameAs: ['https://github.com/Datus-ai'] },
   { '@type': 'WebSite', '@id': websiteId, name: 'Datus', url: SITE,
    inLanguage: ['en-US', 'zh-CN'], publisher },
   ...products,
   { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: copy.pages[path],
    inLanguage: locale === 'zh' ? 'zh-CN' : 'en-US', isPartOf: { '@id': websiteId }, publisher,
    about: products.map(product => ({ '@id': product['@id'] })) },
  ],
 };
}
