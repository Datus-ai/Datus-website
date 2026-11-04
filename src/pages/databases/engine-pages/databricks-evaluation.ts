import type { Locale } from '../../../i18n/config';
const en = {
 eyebrow: 'Choosing a Databricks semantic layer', heading: 'Define shared metrics in DOSI. Reuse them across BI.',
 lead: 'Keep your Databricks data foundation. Define shared metrics in an Apache Ossie model, let DOSI compile and execute them, and serve results to BI workflows through an API integration.',
 items: [
  {title:'Gold tables or semantic definitions?',body:'Keep data preparation and reusable tables in your existing pipelines. A semantic model describes how to calculate and group business metrics over those outputs. With DOSI, reviewed Apache Ossie definitions reference your Databricks data; Databricks still runs the resulting SQL.',label:'Explore semantic model examples',href:'/blog/semantic-model-examples/'},
  {title:'One metric definition for Power BI, Tableau and other BI tools',body:'Define the calculation once in the model used by DOSI. DOSI compiles the requested metrics, dimensions and filters into Databricks SQL. An integration layer maps BI requests to the DOSI API, which executes the query on Databricks and returns results. Keep metric calculations in DOSI while Power BI, Tableau and other BI tools present the data. This approach requires a BI-specific adapter.',label:'Explore DOSI interfaces',href:'https://dosi.datus.ai/'},
  {title:'Maintain shared KPIs in one reviewed model',body:'Your data team owns the metrics in an Apache Ossie model; DOSI uses those definitions to plan and execute requests. Review changes centrally and have consuming workflows request the same metrics. This gives dashboards and agents a shared calculation source, with fewer separately maintained formulas.',label:'Review the semantic layer approach',href:'/solutions/semantic-layer/'},
 ],
 faq:[
  {q:'Is Unity Catalog metadata already a semantic layer?',a:'Catalog metadata and semantic calculations have different roles. Unity Catalog metric views add reusable measures and dimensions; table names and descriptions alone do not define every KPI. DOSI uses a separate compatible Apache Ossie model to make metric calculations explicit before compiling a query for Databricks SQL.'},
  {q:'Does a semantic layer replace my Gold layer or dbt transformations?',a:'No. Curated Gold tables and views can remain the source data. The semantic model defines business calculations, dimensions and relationships over that foundation. Decide which transformations belong in prepared data and which calculations should remain reusable across query groupings.'},
  {q:'Will catalog descriptions alone give my AI agent the right metrics?',a:'Descriptions help interpretation, but the agent also needs an explicit calculation and a supported way to request it. In a DOSI workflow, expose the reviewed model through the supported agent interface and inspect the generated SQL. A warehouse connection alone does not make an agent use that model or guarantee a correct answer.'},
 ]
};
export const DATABRICKS_EVALUATION:Record<Locale,typeof en>={en,zh:{
 eyebrow:'选择 Databricks 语义层',heading:'在 DOSI 统一定义指标，让多个 BI 复用。',lead:'保留 Databricks 的数据基础，用 Apache Ossie 模型统一定义指标，由 DOSI 编译并执行，再通过 API 集成向不同 BI 工作流提供结果。',
 items:[
  {title:'Gold 表与语义定义如何分工？',body:'继续使用现有流水线准备数据和可复用的表。语义模型描述如何基于这些输出计算指标、按维度分组。使用 DOSI 时，审核后的 Apache Ossie 定义引用 Databricks 数据，生成的 SQL 仍由 Databricks 执行。',label:'查看语义模型示例',href:'/blog/semantic-model-examples/'},
  {title:'Power BI、Tableau 等 BI 共用一套指标',body:'在 DOSI 使用的模型中定义一次计算。DOSI 根据请求的指标、维度和筛选条件，生成 Databricks SQL。集成适配层将 BI 请求映射为 DOSI API 请求，由 DOSI 在 Databricks 上执行查询并返回结果。指标计算保留在 DOSI，Power BI、Tableau 等 BI 负责展示数据；此方案需要为 BI 工具配置或开发适配层。',label:'了解 DOSI 接口',href:'https://dosi.datus.ai/'},
  {title:'在统一审核的模型中维护共享 KPI',body:'数据团队在 Apache Ossie 模型中维护指标，DOSI 按这些定义规划和执行请求。集中审核变更，让各使用流程请求相同的指标，为报表和 Agent 提供共享计算来源，减少分别维护的公式。',label:'了解语义层方案',href:'/solutions/semantic-layer/'},
 ],
 faq:[
  {q:'Unity Catalog 中的元数据已经是语义层了吗？',a:'数据目录元数据与语义计算承担不同职责。Unity Catalog Metric Views 提供可复用的度量与维度，表名和说明本身不足以定义所有 KPI。DOSI 使用独立的兼容 Apache Ossie 模型明确指标计算，再编译为 Databricks SQL 查询。'},
  {q:'语义层会替代 Gold 层或 dbt 转换吗？',a:'不会。整理好的 Gold 表与 View 仍可作为数据来源，语义模型在此基础上定义业务计算、维度和关系。需要明确哪些转换应在数据准备阶段完成，哪些计算需要随查询分组复用。'},
  {q:'只提供数据目录说明，AI Agent 就能正确使用指标吗？',a:'说明有助于理解，但 Agent 还需要明确的计算定义，以及受支持的指标请求方式。在 DOSI 流程中，通过受支持的 Agent 接口提供审核后的模型，并检查生成的 SQL。数仓连接本身不会让 Agent 自动使用该模型，也不保证答案正确。'},
 ]
}};

export const DATABRICKS_FLOW = {
 en: {title:'One shared model. Metrics served through DOSI.', lead:'Apache Ossie (incubating) defines the shared model. A BI adapter sends metric requests to DOSI; DOSI compiles compatible definitions into SQL, executes it on Databricks and returns results.', model:'Shared metrics · dimensions · relationships',runtime:'Validate · compile · execute',warehouse:'Execute native SQL',consumers:'BI & reporting',adapter:'BI integration adapter',mapping:'Map metrics, dimensions & filters',request:'Metric requests →',result:'← Results through DOSI and the adapter',note:'Integration architecture: the BI adapter must be configured or developed for the target tool, including authentication, request mapping and refresh. This is not a built-in Power BI or Tableau connector.',link:'Explore the open semantic layer'},
 zh: {title:'一个共享模型，通过 DOSI 提供指标服务。',lead:'Apache Ossie（孵化中）定义共享模型。BI 适配层向 DOSI 发送指标请求；DOSI 将兼容定义编译为 SQL，在 Databricks 上执行并返回结果。',model:'共享指标 · 维度 · 关系',runtime:'验证 · 编译 · 执行',warehouse:'执行原生 SQL',consumers:'BI 与报表',adapter:'BI 集成适配层',mapping:'映射指标、维度与筛选条件',request:'指标请求 →',result:'← 结果经 DOSI 与适配层返回',note:'集成方案示意：需为目标 BI 工具配置或开发适配层，处理认证、请求映射和刷新；此处不代表已有内置 Power BI 或 Tableau 连接器。',link:'了解开放语义层'}
};
