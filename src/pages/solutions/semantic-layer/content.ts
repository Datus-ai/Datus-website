import { UI } from "../../../i18n/ui";
import type { Locale } from '../../../i18n/config';
const en = {
 titleBefore:'A ',titleAccent:'semantic layer',titleAfter:' for every way your team uses data.',
 leadBefore:'A semantic layer defines business metrics, dimensions, and relationships once so people, BI tools, and AI agents use the same definitions. ',leadAfter:' validates compatible Apache Ossie models and compiles supported metric queries into native warehouse SQL. Your team can review the definitions and inspect how results are produced.',
 eyebrow:'Semantic layer solution',
 primary:UI.en.common.tryStudio, secondary:'See how it works',
 visual:{warehouses:'Warehouses',documents:'Documents',sqlEtl:'SQL & ETL',model:'Semantic model',metrics:'Metrics',ontology:'Ontology',relationships:'Relationships',core:'Core specification',execution:'Execution',agents:'Agents',applications:'Applications',bi:'BI',description:'DOSI uses Apache Ossie as its core model specification for execution. Warehouses, documents, and SQL and ETL provide the sources for a shared semantic model of metrics and ontology relationships, which supports agents, applications, and BI.'},
 closing:'Put shared business context to work.',closingLead:'Give your team and agents a semantic model they can understand, review, and reuse.',

};
export const SEMANTIC_LAYER_SOLUTION: Record<Locale,typeof en> = {en,zh:{
 titleBefore:'让团队与 Agent 共用业务定义的',titleAccent:'语义层',titleAfter:'。',
 leadBefore:'语义层集中定义业务指标、维度与关系，让团队、BI 工具和 AI Agent 使用同一套业务口径。',leadAfter:' 校验兼容的 Apache Ossie 模型，将受支持的指标查询编译成数仓原生 SQL，让团队能够审核定义，并核查结果的生成依据。',
 eyebrow:'语义层解决方案',
 primary:UI.zh.common.tryStudio,secondary:'了解工作方式',
 visual:{warehouses:'数仓',documents:'文档',sqlEtl:'SQL 与 ETL',model:'语义模型',metrics:'指标',ontology:'本体',relationships:'业务关系',core:'核心规范',execution:'执行',agents:'Agent',applications:'应用',bi:'BI',description:'DOSI 以 Apache Ossie 为核心模型规范提供执行能力。数仓、文档、SQL 与 ETL 提供建模依据，形成包含指标与本体关系的共享语义模型，供 Agent、应用和 BI 复用。'},
 closing:'让共享的业务上下文进入实际工作。',closingLead:'让团队与 Agent 使用可以理解、审核和复用的语义模型。',

}};
