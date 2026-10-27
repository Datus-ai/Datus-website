import type { Locale } from '../../../i18n/config';

const en = {
 title: 'Start with the work you already do.',
 lead: 'Your SQL, dashboards, and new business questions already contain modeling knowledge. Datus Agent helps turn it into reusable semantic definitions.',
 paths: [
  {
   title: 'Extract from existing SQL',
   body: 'Use historical queries and SQL files as evidence. Capture reusable calculations, filters, dimensions, and source mappings in a semantic model.',
   visualLabel: 'Existing SQL',
   evidence: 'Calculations, filters & grouping',
  },
  {
   title: 'Build from BI dashboards',
   body: 'Start with selected queries from a supported BI dashboard. Recover the logic behind its charts and bring those definitions into a shared model.',
   visualLabel: 'Dashboard query logic',
   evidence: 'Chart queries & source data',
  },
  {
   title: 'Model as you build',
   body: 'Describe a new business requirement. Work with Datus Agent to define datasets, relationships, and metrics alongside development, then validate the model.',
   visualLabel: 'New business requirement',
   request: 'Define monthly revenue by customer region. Preserve the agreed return policy.',
   evidence: 'Business requirements & live schema',
  },
 ],
 outputTitle: 'Shared semantic definitions',
 outputTerms: ['Datasets', 'Metrics', 'Dimensions', 'Relationships'],
 review: 'Draft with Datus Agent. Review definitions and validate the model before using it.',
 reviewLink: 'See the modeling workflow',
 ossieTitle: 'What is Apache Ossie?',
 ossieBody: 'Apache Ossie (incubating), formerly Open Semantic Interchange (OSI), is an open specification for exchanging semantic metadata. Its YAML format describes datasets, dimensions, metrics, and relationships independently of any one analytics platform.',
 ossieLink: 'Meet the open standard',
};

export const MODEL_ORIGINS_COPY: Record<Locale, typeof en> = { en, zh: {
 title: '从日常数据工作中，沉淀业务定义。',
 lead: '已有 SQL、BI 看板和新的业务问题，都包含建模所需的知识。Datus Agent 帮你将它们整理为可复用的语义定义。',
 paths: [
  {
   title: '从历史 SQL 提炼',
   body: '以历史查询和 SQL 文件为依据，将可复用的计算、筛选条件、维度与数据源映射整理为语义模型。',
   visualLabel: '已有 SQL',
   evidence: '计算逻辑、筛选条件与分组方式',
  },
  {
   title: '从 BI 看板梳理',
   body: '从受支持的 BI 看板中选择查询，梳理图表背后的计算逻辑，将分散的业务定义汇入共享模型。',
   visualLabel: '看板查询逻辑',
   evidence: '图表查询与源数据',
  },
  {
   title: '在新需求开发中沉淀',
   body: '描述新的业务需求，与 Datus Agent 在开发过程中一起定义数据集、业务关系与指标，再校验模型，让定义随工作成果一起沉淀。',
   visualLabel: '新的业务需求',
   request: '按客户地区定义月度收入指标，沿用团队确认的退货口径。',
   evidence: '业务需求与实时表结构',
  },
 ],
 outputTitle: '共享的语义定义',
 outputTerms: ['数据集', '指标', '维度', '业务关系'],
 review: '由 Datus Agent 辅助起草，团队审核定义、校验模型后再使用。',
 reviewLink: '查看建模流程',
 ossieTitle: 'Apache Ossie 是什么？',
 ossieBody: 'Apache Ossie（孵化中）的前身是 Open Semantic Interchange（OSI），是用于交换语义元数据的开放规范。它以 YAML 描述数据集、维度、指标和关系，让业务定义独立于单一分析平台。',
 ossieLink: '了解开放标准',
} };
