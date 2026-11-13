import type { Locale } from '../../../i18n/config';
const sources = [
 {label:'DOSI: semantics',href:'https://dosi.datus.ai/semantics/'},
 {label:'DOSI: REST API',href:'https://dosi.datus.ai/rest-api/'},
 {label:'DOSI: connections',href:'https://dosi.datus.ai/connectors/'},
 {label:'DOSI: license',href:'https://dosi.datus.ai/#start-here'},
 {label:'Cube Core: architecture & license',href:'https://github.com/cube-js/cube#readme'},
 {label:'dbt: Semantic Layer architecture',href:'https://docs.getdbt.com/docs/use-dbt-semantic-layer/sl-architecture'},
 {label:'dbt: Semantic Layer APIs',href:'https://docs.getdbt.com/docs/dbt-apis/sl-api-overview'},
];
const en = {
 title:'When to choose DOSI',
 lead:'Choose DOSI when you want an independently usable runtime for compatible Apache Ossie definitions, inspectable SQL, and interfaces your agents can call. Evaluate the model, connector, and integration path together.',
 caption:'Selection criteria', products:['DOSI','Cube Core / Cube','MetricFlow / dbt Semantic Layer'],
 scope:'Reviewed 4 November 2026 against primary documentation. This compares runtimes and distinguishes their hosted services; it is not a performance benchmark.',
 rows:[
 ['Model format','Compatible Apache Ossie YAML / JSON, with documented DATUS extensions.','Cube semantic models: measures, dimensions, joins, and access rules.','Semantic models and metrics declared in dbt YAML.'],
 ['Deployment','Use DOSI directly in Datus Studio through the commercial Datus platform, or run the CLI or semantic API server independently.','Self-host Cube Core; managed deployment is available in commercial Cube.','Local MetricFlow; hosted service layer through the dbt platform.'],
 ['Interfaces','CLI, MCP, and REST; inspect compiled SQL or request execution.','SQL, REST, and GraphQL data APIs.','MetricFlow CLI; GraphQL, JDBC, and Python SDK through the hosted Semantic Layer.'],
 ['Execution','Compiles to the selected dialect; a configured, supported connector executes the query.','Queries connected sources and can serve pre-aggregated data through its caching layer.','Generates SQL from metric definitions; the hosted service dispatches queries to the data platform.'],
 ['What to check','Spec / extension compatibility, connector coverage, and your BI integration path. Portability does not imply federation.','Model migration, pre-aggregation freshness, and operational requirements for your deployment.','Supported adapters, dbt project dependencies, and which interfaces require the hosted service.'],
 ['License','Elastic License 2.0. The open Ossie specification does not make DOSI open-source.','Cube Core backend: Apache 2.0; client: MIT. Commercial Cube has separate terms.','MetricFlow: Apache 2.0. Hosted service and APIs have separate commercial terms.'],
 ],
 evidenceTitle:'Inspect the execution path before you adopt it.',
 evidenceLead:'Start with a representative model and query from your team. Review the definitions, inspect the generated SQL, and compare executed results with your agreed calculation.',
 evidence:[
 {title:'Review the model',body:'Check grain, joins, metric expressions, and extension behavior against the semantics contract.',label:'Read the semantics contract',href:'https://dosi.datus.ai/semantics/'},
 {title:'Inspect native SQL',body:'The compile endpoint returns SQL without executing it. Successful compilation alone is not an execution test.',label:'Inspect the compile and execute APIs',href:'https://dosi.datus.ai/rest-api/'},
 {title:'Verify on your source',body:'Use a supported connection and known test data. Record the DOSI and database versions, inputs, SQL, and checked results.',label:'Run the verified Northstar example',href:'/blog/dosi-semantic-layer-northstar-example/'},
 ],
 boundary:'Warehouse portability means reusing compatible definitions with the appropriate source mappings and dialect. It does not mean that one query automatically joins data across warehouses. BI consumption also depends on the chosen API or adapter; model compatibility is not a native BI connector.',
 sourceLabel:'Primary documentation',sources,
};
export const SELECTION_COPY:Record<Locale,typeof en>={en,zh:{
 title:'什么情况下选择 DOSI',lead:'如果你希望独立运行兼容 Apache Ossie 定义的 Runtime、检查生成的 SQL，并让 Agent 通过接口调用语义执行能力，可以考虑 DOSI。评估时，应同时确认模型、数据源连接与下游接入方式。',
 caption:'选型维度',products:en.products,scope:'依据官方资料核验于 2026 年 11 月 4 日。以下区分执行引擎与配套托管服务，不属于性能基准测试。',
 rows:[
 ['模型格式','兼容的 Apache Ossie YAML / JSON，以及已文档化的 DATUS 扩展。','Cube 语义模型：度量、维度、关联与访问规则。','通过 dbt YAML 定义语义模型与指标。'],
 ['部署方式','可通过商业版 Datus 平台的 Datus Studio 直接使用 DOSI，也可独立运行 CLI 或语义 API 服务。','可自行部署 Cube Core；商业版 Cube 提供托管部署。','本地运行 MetricFlow；dbt 平台提供托管服务层。'],
 ['调用接口','CLI、MCP 与 REST；可以检查编译 SQL 或请求执行。','SQL、REST 与 GraphQL 数据 API。','MetricFlow CLI；托管语义层提供 GraphQL、JDBC 与 Python SDK。'],
 ['执行方式','编译为所选方言；通过配置好的受支持连接执行查询。','查询已连接的数据源，也可通过缓存层提供预聚合数据。','根据指标定义生成 SQL；托管服务将查询发送至数据平台。'],
 ['评估边界','确认规范与扩展兼容性、连接支持范围和 BI 接入方式。可移植性不等于联邦查询。','确认模型迁移、预聚合数据新鲜度与部署运维要求。','确认受支持的适配器、dbt 项目依赖，以及哪些接口需要托管服务。'],
 ['许可证','Elastic License 2.0。Ossie 规范开放不代表 DOSI 开源。','Cube Core 后端为 Apache 2.0，客户端为 MIT；商业版 Cube 另有条款。','MetricFlow 为 Apache 2.0；托管服务与 API 另有商业条款。'],
 ],
 evidenceTitle:'采用之前，先核查执行过程。',evidenceLead:'从团队有代表性的模型与查询开始：审核定义，检查生成的 SQL，再将实际执行结果与团队认可的计算口径核对。',
 evidence:[
 {title:'审核模型',body:'依据语义契约检查粒度、关联、指标表达式与扩展行为。',label:'查看语义契约',href:'https://dosi.datus.ai/semantics/'},
 {title:'检查原生 SQL',body:'编译接口返回 SQL，不执行查询。编译成功本身不能证明执行已通过验证。',label:'查看编译与执行 API',href:'https://dosi.datus.ai/rest-api/'},
 {title:'在数据源上验证',body:'使用受支持的连接与已知测试数据，记录 DOSI 和数据库版本、输入、SQL 及核对后的结果。',label:'运行已验证的 Northstar 示例',href:'/blog/dosi-semantic-layer-northstar-example/'},
 ],
 boundary:'跨数仓复用指通过适当的源数据映射与 SQL 方言复用兼容定义，不代表单次查询会自动跨数仓关联数据。BI 消费还取决于所选 API 或适配器；模型兼容不等于拥有原生 BI 连接器。',
 sourceLabel:'官方参考资料',sources:sources.map((s,i)=>({...s,label:['DOSI：语义契约','DOSI：REST API','DOSI：数据源连接','DOSI：许可证说明','Cube Core：架构与许可证','dbt：语义层架构','dbt：语义层 API'][i]})),
}};
