import type { Locale } from '../../../i18n/config';
const en = {
 eyebrow: 'Choosing a BigQuery semantic layer', heading: 'One semantic model across your BigQuery workflows.',
 lead: 'Decide where shared metrics are defined, how existing models contribute, and how BI tools and agents consume them.',
 items: [
  {title:'Where should business definitions live?',body:'Keep existing dbt transformations and BigQuery tables. Define the metrics you want agents and applications to share in a reviewed model. Check how changes reach each consumer; connecting to the same warehouse does not automatically synchronize LookML, dbt metrics and Ossie.',label:'Explore the semantic layer approach',href:'/solutions/semantic-layer/'},
  {title:'How do existing dbt models and views fit?',body:'Use curated BigQuery tables or views as the data foundation. Keep transformations in dbt, and describe shared metric expressions, dimensions and relationships in the semantic model. Start with a small set of definitions and validate them against existing reporting logic.',label:'See semantic model examples',href:'/blog/semantic-model-examples/'},
  {title:'Which tools will consume the metrics?',body:'Separate a warehouse connection from a semantic-model integration. An application must call the supported DOSI interface to use its definitions. A BI tool querying BigQuery directly does not automatically use the Ossie model. Prove one complete consumer-to-query path first.',label:'Using DOSI in agents',href:'https://dosi.datus.ai/agents/'},
 ],
 faq:[
  {q:'Do I need Looker to use a semantic layer on BigQuery?',a:'No. Looker is one modeling and consumption path. Datus/DOSI uses compatible Apache Ossie definitions and queries BigQuery separately. You can retain existing BI workflows while evaluating shared definitions for agents or applications; this does not automatically make existing Looker dashboards consume DOSI metrics.'},
  {q:'Can I reuse dbt models and BigQuery views?',a:'They can provide the data foundation for a semantic model. Start with curated outputs and document their grain, metric expressions and relationships. Keeping dbt transformations does not require moving the data. Automatic conversion of every existing definition or LookML feature is not promised.'},
 ]
};
export const BIGQUERY_EVALUATION: Record<Locale,typeof en>={en,zh:{
 eyebrow:'选择 BigQuery 语义层',heading:'让 BigQuery 工作流使用同一套语义定义。',lead:'明确共享指标在哪里定义、已有模型如何复用，以及 BI 工具和 Agent 如何使用这些定义。',
 items:[
  {title:'业务定义应该维护在哪里？',body:'保留现有 dbt 转换与 BigQuery 表，把需要供 Agent 和应用共享的指标整理为可审核模型。确认定义变更如何传到各使用方；连接同一个数仓，不代表 LookML、dbt 指标与 Ossie 会自动同步。',label:'了解语义层方案',href:'/solutions/semantic-layer/'},
  {title:'已有 dbt 模型和 View 如何复用？',body:'将整理好的 BigQuery 表或 View 作为数据基础，继续用 dbt 处理转换，在语义模型中描述共享的指标表达式、维度与关系。先从少量定义开始，与已有报表口径对照验证。',label:'查看语义模型示例',href:'/blog/semantic-model-examples/'},
  {title:'哪些工具真正使用这些指标？',body:'数仓连接与语义模型集成是两回事。应用需要调用受支持的 DOSI 接口，才能使用其中的定义。直接查询 BigQuery 的 BI 工具不会自动使用 Ossie 模型。先验证一条从使用方到查询结果的完整路径。',label:'在 Agent 中使用 DOSI',href:'https://dosi.datus.ai/agents/'},
 ],
 faq:[
  {q:'在 BigQuery 上使用语义层，必须使用 Looker 吗？',a:'不必。Looker 是一种建模和使用路径。Datus／DOSI 使用兼容的 Apache Ossie 定义，通过独立路径查询 BigQuery。可以保留现有 BI 流程，同时为 Agent 或应用评估共享定义；这不意味着已有 Looker 仪表板会自动使用 DOSI 指标。'},
  {q:'已有的 dbt 模型和 BigQuery View 能继续使用吗？',a:'它们可以作为语义模型的数据基础。从整理好的输出开始，明确粒度、指标表达式和关系。保留 dbt 转换不需要迁移数据，但不承诺自动转换所有已有定义或 LookML 功能。'},
 ]
}};
