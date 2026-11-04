import type { Locale } from '../../../i18n/config';

export type Engine = 'databricks' | 'bigquery' | 'duckdb';

type LocalCopy = {
  eyebrow: string; heading: string; lead: string; setupLink: string;
  facts: string[];
  diagram: { label: string; input: string; review: string; model: string; access: string; engine: string; target: string; sql: string; result: string; caption: string };
  value: { eyebrow: string; heading: string; lead: string; items: { title: string; body: string }[] };
  comparison: {
    label: string;
    native: { title: string; inputs: string; context: string; consumers: string; warehouse: string; note: string };
    datus: { title: string; inputs: string; context: string; consumers: string; warehouse: string; note: string };
    caption: string;
    sources: { label: string; href: string }[];
  };
  example: { eyebrow: string; heading: string; lead: string; profile: string; command: string; note: string };
  steps: { eyebrow: string; heading: string; lead: string; items: { title: string; body: string }[]; boundary: string; docsLabel: string; agentLabel?: string };
  use: { eyebrow: string; heading: string; lead: string; items: { title: string; body: string }[] };
  faq: { heading: string; lead: string; items: { q: string; a: string }[] };
  resources: { heading: string; items: { title: string; body: string; href: string }[] };
  closing: { heading: string; lead: string; docsLabel: string };
};

export type EnginePageData = {
  slug: Engine;
  name: string;
  path: string;
  docs: string;
  agentDocs?: string;
  profile: string;
  command: string;
  copy: Record<Locale, LocalCopy>;
};

const databricks: EnginePageData = {
  slug: 'databricks', name: 'Databricks', path: '/databases/databricks/',
  docs: 'https://dosi.datus.ai/connectors/databricks/',
  profile: `datasources:
  databricks:
    type: databricks
    host: \${DATABRICKS_HOST}
    warehouse: \${DATABRICKS_WAREHOUSE_ID}
    password: \${DATABRICKS_TOKEN}
    catalog: analytics
    schema: reporting`,
  command: `dosi query --model model.yaml \\
  --metrics revenue --group-by orders.status \\
  --execute --connection databricks`,
  copy: {
    en: {
      eyebrow: 'DOSI + Databricks SQL', heading: 'A semantic layer for Databricks data and AI agents.',
      lead: 'Keep your data and compute in Databricks. Define metrics in a team-reviewed Apache Ossie model, then let DOSI plan the query and send native SQL to your Databricks SQL warehouse.',
      setupLink: 'See the connection steps',
      facts: ['Apache Ossie definitions', 'Databricks SQL warehouse', 'MCP · API · CLI'],
      diagram: { label: 'How the pieces connect', input: 'Existing SQL + business rules', review: 'Team review', model: 'Apache Ossie model', access: 'Agents + apps · MCP / API / CLI', engine: 'DOSI', target: 'Databricks SQL warehouse', sql: 'Native SQL via Statement Execution API', result: 'Results return through DOSI to your tools', caption: 'Definitions live outside the warehouse; the configured Databricks SQL warehouse executes the query.' },
      value: { eyebrow: 'Where Datus fits', heading: 'Two ways to give agents business context.', lead: 'Genie Ontology brings governed Unity Catalog semantics together with context inferred from Databricks assets. DOSI takes a different route: a team-reviewed Apache Ossie model sits outside the warehouse, and DOSI compiles metric requests into Databricks SQL.', items: [
        { title: 'Review the metric once', body: 'Describe the dataset, metric expression, dimensions and relationships in an Apache Ossie model. Your team can review the definition before publishing it to agents or applications.' },
        { title: 'Use the tools your team already has', body: 'DOSI exposes compatible definitions through MCP, API and CLI interfaces. It does not require you to move the underlying Databricks tables into a new warehouse.' },
        { title: 'See the warehouse query', body: 'DOSI compiles the selected metric request to Databricks SQL and sends it to the SQL warehouse. Inspect the model, generated SQL and results in your workflow.' },
      ] },
      comparison: {
        label: 'Databricks Genie Ontology and Datus/DOSI architecture comparison',
        native: { title: 'Databricks + Genie Ontology', inputs: 'Unity Catalog Semantics + inferred context from queries, dashboards and agents', context: 'Genie Ontology', consumers: 'Genie One / Code / Agents · external agents via MCP', warehouse: 'Databricks SQL warehouse', note: 'Context is curated and inferred within the Databricks platform.' },
        datus: { title: 'Databricks + Datus / DOSI', inputs: 'Team-reviewed Apache Ossie model', context: 'DOSI semantic layer', consumers: 'Agents and apps · MCP / API / CLI', warehouse: 'Databricks SQL warehouse', note: 'The semantic model is managed separately and can be reused with supported SQL backends.' },
        caption: 'DOSI is a semantic layer, not an ontology product. Both paths use Databricks for query execution.',
        sources: [{ label: 'DOSI Databricks connector docs', href: 'https://dosi.datus.ai/connectors/databricks/' }],
      },
      example: { eyebrow: 'A concrete workflow', heading: 'From a reviewed metric to a warehouse query.', lead: 'Configure a SQL warehouse, validate your Apache Ossie model, then request a metric such as revenue by order status.', profile: 'dosi-connections.yaml', command: 'DOSI CLI · example request', note: 'The command requires your own validated model.yaml and a running SQL warehouse. This page does not execute a Databricks query or present fabricated results.' },
      steps: { eyebrow: 'Connect Databricks SQL', heading: 'Use a SQL warehouse as the execution endpoint.', lead: 'DOSI connects through the Databricks Statement Execution API. The connection needs a workspace host, SQL warehouse ID, token and appropriate catalog access.', items: [
        { title: 'Choose a SQL warehouse', body: 'Copy the warehouse ID from Databricks connection details. Grant the token holder access to the warehouse and the catalog or schema your model references.' },
        { title: 'Keep credentials out of the model', body: 'Set the workspace host, warehouse ID and token in a DOSI connection profile. Reference the token through an environment variable rather than committing it.' },
        { title: 'Validate and run a metric', body: 'Review the model, run the sample request with --connection databricks, and inspect the SQL and result. A stopped warehouse may need time to start.' },
      ], boundary: 'DOSI connects to your Databricks SQL warehouse through the Statement Execution API. Queries run with the permissions of the configured token.', docsLabel: 'DOSI Databricks connector docs' },
      use: { eyebrow: 'Useful for teams', heading: 'One meaning, several consumers.', lead: 'The goal is to make reviewed business definitions available where people and agents ask questions.', items: [
        { title: 'Agent-assisted analysis', body: 'An agent can ask DOSI for a named metric instead of inferring its meaning from table and column names alone.' },
        { title: 'Shared reporting logic', body: 'Applications and analysts can refer to the same model while Databricks remains the query engine and source of results.' },
      ] },
      faq: { heading: 'Databricks semantic layer FAQ', lead: 'The scope and setup details that matter before you connect.', items: [
        { q: 'Does DOSI replace Databricks SQL?', a: 'No. DOSI reads a compatible semantic model, compiles a metric request and sends SQL to the Databricks SQL warehouse you configure. Databricks executes the query.' },
        { q: 'How does DOSI differ from Genie Ontology?', a: 'Genie Ontology combines governed Unity Catalog semantics with inferred context for Genie experiences and external agents via MCP. DOSI uses a separately managed, team-reviewed Apache Ossie semantic model to plan metric queries across supported SQL backends. DOSI is not an ontology product; on this page, Databricks remains the query engine.' },
        { q: 'Can I reuse existing Databricks metric definitions?', a: 'Yes—start with exported definitions. Metric View YAML contains sources, dimensions or fields, measures, filters and joins. DESCRIBE TABLE EXTENDED <catalog.schema.metric_view> AS JSON exposes the YAML in view_text. SQL files and exported dashboard .lvdash.json files can also supply calculation evidence. Give these files and the relevant source schema to Datus Agent as context for drafting an Apache Ossie semantic model. Supported Metric View definitions can also use the Apache Ossie Databricks converter. Review mappings, calculation grain and unsupported features, then validate the model with DOSI and compare representative results in Databricks. This is a file-based conversion workflow, not automatic live synchronization.' },
      ] },
      resources: { heading: 'Explore the workflow', items: [
        { title: 'Semantic layer solution', body: 'How DOSI turns reviewed definitions into SQL for teams and agents.', href: '/solutions/semantic-layer/' },
        { title: 'Snowflake semantic layer', body: 'See the same model-first approach with a Snowflake warehouse.', href: '/databases/snowflake/' },
        { title: 'DOSI connector reference', body: 'Authentication, setup and limitations for Databricks SQL.', href: 'https://dosi.datus.ai/connectors/databricks/' },
      ] },
      closing: { heading: 'Start with a metric your team already trusts.', lead: 'Turn that definition into a reviewable model, then connect DOSI to your Databricks SQL warehouse.', docsLabel: 'Read connector docs' },
    },
    zh: {
      eyebrow: 'DOSI + Databricks SQL', heading: '为 Databricks 数据和 AI Agent 构建语义层。',
      lead: '数据和计算仍留在 Databricks。团队先审核 Apache Ossie 模型中的指标定义，再由 DOSI 规划查询，向 Databricks SQL Warehouse 发送原生 SQL。',
      setupLink: '查看连接步骤',
      facts: ['Apache Ossie 定义', 'Databricks SQL Warehouse', 'MCP · API · CLI'],
      diagram: { label: '各部分如何协作', input: '已有 SQL 与业务规则', review: '团队审核', model: 'Apache Ossie 模型', access: 'Agent 与应用 · MCP / API / CLI', engine: 'DOSI', target: 'Databricks SQL Warehouse', sql: '通过 Statement Execution API 发送原生 SQL', result: '结果经 DOSI 返回给工具', caption: '定义独立于数仓；由配置的 Databricks SQL Warehouse 执行查询。' },
      value: { eyebrow: 'Datus 的作用', heading: '为 Agent 提供业务上下文的两种架构。', lead: 'Genie Ontology 结合 Unity Catalog 中治理过的语义，以及从 Databricks 资产推断的上下文。DOSI 则使用独立于数仓、由团队审核的 Apache Ossie 模型，并把指标请求编译为 Databricks SQL。', items: [
        { title: '先审核指标定义', body: '在 Apache Ossie 模型中描述数据集、指标表达式、维度和关系。团队审核后，再供 Agent 或应用使用。' },
        { title: '沿用现有工具', body: 'DOSI 通过 MCP、API 和 CLI 提供兼容模型的访问方式。底层 Databricks 表无需迁入另一个数仓。' },
        { title: '看清执行过程', body: 'DOSI 将指标请求编译成 Databricks SQL，并发送给 SQL Warehouse。你可以在工作流中核查模型、SQL 和结果。' },
      ] },
      comparison: {
        label: 'Databricks Genie Ontology 与 Datus/DOSI 架构对比',
        native: { title: 'Databricks + Genie Ontology', inputs: 'Unity Catalog Semantics + 从查询、仪表板和 Agent 推断的上下文', context: 'Genie Ontology', consumers: 'Genie One / Code / Agents · 外部 Agent 可通过 MCP 访问', warehouse: 'Databricks SQL Warehouse', note: '在 Databricks 平台内治理并推断上下文。' },
        datus: { title: 'Databricks + Datus / DOSI', inputs: '团队审核的 Apache Ossie 模型', context: 'DOSI 语义层', consumers: 'Agent 与应用 · MCP / API / CLI', warehouse: 'Databricks SQL Warehouse', note: '语义模型独立管理，并可在受支持的 SQL 后端复用。' },
        caption: 'DOSI 是语义层，而不是本体产品；两条路径都由 Databricks 执行查询。',
        sources: [{ label: 'DOSI Databricks 连接器文档', href: 'https://dosi.datus.ai/connectors/databricks/' }],
      },
      example: { eyebrow: '具体流程', heading: '从审核过的指标到数仓查询。', lead: '配置 SQL Warehouse、验证 Apache Ossie 模型，再请求“按订单状态统计收入”等指标。', profile: 'dosi-connections.yaml', command: 'DOSI CLI · 示例请求', note: '命令需要你自己的、已验证的 model.yaml，以及正在运行的 SQL Warehouse。本页面没有执行 Databricks 查询，也没有展示虚构结果。' },
      steps: { eyebrow: '连接 Databricks SQL', heading: '由 SQL Warehouse 执行查询。', lead: 'DOSI 通过 Databricks Statement Execution API 连接。需要工作空间主机名、SQL Warehouse ID、令牌及相应的数据访问权限。', items: [
        { title: '选择 SQL Warehouse', body: '从 Databricks 连接信息中复制 Warehouse ID。确保令牌持有者有权访问 Warehouse，以及模型引用的 catalog 和 schema。' },
        { title: '把凭据放在模型外', body: '在 DOSI 连接配置中填写主机名、Warehouse ID 和令牌。用环境变量引用令牌，不要把它提交进代码库。' },
        { title: '验证并执行指标', body: '审核模型，使用 --connection databricks 运行示例请求，再检查 SQL 和结果。已停止的 Warehouse 可能需要启动时间。' },
      ], boundary: 'DOSI 通过 Statement Execution API 连接你的 Databricks SQL Warehouse，查询使用配置令牌对应的访问权限。', docsLabel: 'DOSI Databricks 连接器文档' },
      use: { eyebrow: '团队如何使用', heading: '同一业务含义，供多个工具调用。', lead: '让团队审核过的业务定义出现在人和 Agent 提问的地方。', items: [
        { title: 'Agent 辅助分析', body: 'Agent 可以向 DOSI 请求已命名的指标，不必仅凭表名和列名猜测业务含义。' },
        { title: '共享报表逻辑', body: '应用和分析师可以引用同一模型；Databricks 仍是查询引擎和结果来源。' },
      ] },
      faq: { heading: 'Databricks 语义层常见问题', lead: '连接前需要了解的范围与配置。', items: [
        { q: 'DOSI 会取代 Databricks SQL 吗？', a: '不会。DOSI 读取兼容的语义模型、编译指标请求，并将 SQL 发送到你配置的 Databricks SQL Warehouse；查询仍由 Databricks 执行。' },
        { q: 'DOSI 与 Genie Ontology 有什么区别？', a: 'Genie Ontology 结合 Unity Catalog 中治理过的语义和推断的上下文，供 Genie 体验及通过 MCP 接入的外部 Agent 使用。DOSI 则使用独立管理、由团队审核的 Apache Ossie 语义模型，在受支持的 SQL 后端规划指标查询。DOSI 不是本体产品；在本页面的架构中，Databricks 仍负责执行查询。' },
        { q: '可以复用现有 Databricks 指标定义吗？', a: '可以，从导出的定义文件开始。Metric View YAML 包含数据源、维度或字段、度量、筛选条件和关联；DESCRIBE TABLE EXTENDED <catalog.schema.metric_view> AS JSON 可在 view_text 中返回 YAML。SQL 文件和导出的仪表板 .lvdash.json 文件也能提供计算依据。将这些文件与相关源数据表结构交给 Datus Agent，作为起草 Apache Ossie 语义模型的上下文。受支持的 Metric View 定义还可使用 Apache Ossie Databricks 转换器。审核映射、计算粒度和未支持的功能后，用 DOSI 验证模型，并在 Databricks 中核对代表性查询结果。这是基于文件的转换流程，不是自动实时同步。' },
      ] },
      resources: { heading: '继续了解', items: [
        { title: '语义层解决方案', body: '了解 DOSI 如何把审核过的定义转为供团队和 Agent 使用的 SQL。', href: '/solutions/semantic-layer/' },
        { title: 'Snowflake 语义层', body: '查看相同的模型优先方法如何应用于 Snowflake 数仓。', href: '/databases/snowflake/' },
        { title: 'DOSI 连接器参考', body: '查看 Databricks SQL 的认证、配置和限制。', href: 'https://dosi.datus.ai/connectors/databricks/' },
      ] },
      closing: { heading: '从团队信任的一个指标开始。', lead: '把定义整理为可审核的模型，再将 DOSI 连接到 Databricks SQL Warehouse。', docsLabel: '阅读连接器文档' },
    },
  },
};

const bigquery: EnginePageData = {
  slug: 'bigquery', name: 'BigQuery', path: '/databases/bigquery/',
  docs: 'https://dosi.datus.ai/connectors/bigquery/',
  agentDocs: 'https://docs.datus.ai/dev/configuration/datasources/bigquery/',
  profile: `datasources:
  bigquery:
    type: bigquery
    project: \${BIGQUERY_PROJECT}
    dataset: analytics
    credentials_path: /path/to/service-account.json
    location: US
    billing_project_id: \${BIGQUERY_BILLING_PROJECT}`,
  command: `dosi query --model model.yaml \\
  --metrics revenue --group-by orders.status \\
  --execute --connection bigquery`,
  copy: {
    en: {
      eyebrow: 'Datus + Google BigQuery', heading: 'A semantic layer for BigQuery, with business meaning built in.',
      lead: 'Keep data in BigQuery while your team reviews metrics in an Apache Ossie model. DOSI compiles a metric request into GoogleSQL and sends it to BigQuery; Datus Agent has a separate native BigQuery adapter for data work.',
      setupLink: 'See the connection steps',
      facts: ['Project + dataset aware', 'Native BigQuery queries', 'Experimental DOSI execution'],
      diagram: { label: 'How the pieces connect', input: 'Existing SQL + business rules', review: 'Team review', model: 'Apache Ossie model', access: 'Agents + apps · MCP / API / CLI', engine: 'DOSI', target: 'BigQuery project + dataset', sql: 'GoogleSQL via jobs.query', result: 'Results return through DOSI to your tools', caption: 'DOSI sends a query to the configured BigQuery project; BigQuery owns execution and billing.' },
      value: { eyebrow: 'Where Datus fits', heading: 'Two ways to model metrics over BigQuery.', lead: 'Looker can model BigQuery data in LookML for dashboards and applications. DOSI uses a separately reviewed Apache Ossie model to serve named metrics through agent-friendly interfaces; BigQuery still executes the query.', items: [
        { title: 'Make the definition reviewable', body: 'Describe revenue, dimensions and relationships in an Apache Ossie model. Teams can check the business logic before applications or agents reuse it.' },
        { title: 'Preserve the BigQuery boundary', body: 'Queries run in your configured BigQuery project and dataset. DOSI does not copy the underlying tables into another analytics store.' },
        { title: 'Separate the two connection paths', body: 'Datus Agent has a native BigQuery adapter for metadata and data tasks. DOSI has its own BigQuery execution connector for semantic metric queries.' },
      ] },
      comparison: {
        label: 'BigQuery with Looker and BigQuery with Datus/DOSI architecture comparison',
        native: { title: 'BigQuery + Looker', inputs: 'BigQuery tables + LookML model', context: 'Looker semantic model', consumers: 'Looker dashboards and applications', warehouse: 'BigQuery query jobs', note: 'Looker is a separate Google BI product that connects to BigQuery.' },
        datus: { title: 'BigQuery + Datus / DOSI', inputs: 'Team-reviewed Apache Ossie model', context: 'DOSI semantic layer', consumers: 'Agents and apps · MCP / API / CLI', warehouse: 'BigQuery jobs.query', note: 'The model is managed separately; DOSI BigQuery execution is experimental.' },
        caption: 'Both paths keep query execution in BigQuery. BigQuery also supports SQL views for reusable query logic.',
        sources: [
          { label: 'Google: Looker with BigQuery', href: 'https://docs.cloud.google.com/bigquery/docs/looker' },
          { label: 'DOSI BigQuery connector', href: 'https://dosi.datus.ai/connectors/bigquery/' },
        ],
      },
      example: { eyebrow: 'A concrete workflow', heading: 'A metric request, an explicit project, an inspectable query.', lead: 'Provide a reviewed model and a BigQuery connection profile before asking DOSI for a named metric.', profile: 'dosi-connections.yaml', command: 'DOSI CLI · example request', note: 'This is a configuration and command example, not a live BigQuery run. Use your own validated model and service account. The DOSI BigQuery executor is currently experimental.' },
      steps: { eyebrow: 'Connect BigQuery', heading: 'Set the data project and billing project deliberately.', lead: 'The DOSI connector uses a service-account JSON key and the BigQuery jobs.query API. A BigQuery project is the catalog; its dataset is the next namespace level.', items: [
        { title: 'Grant the right access', body: 'Allow the service account to read the referenced data and create jobs in the billing project. Choose the correct dataset location, such as US or EU.' },
        { title: 'Configure one credential source', body: 'Set credentials_path, credentials_info or credentials_base64 in the DOSI profile, but not more than one. DOSI does not use Application Default Credentials for this connector.' },
        { title: 'Validate the model and query', body: 'Check the dataset names and metric definitions, then run a bounded request and inspect the SQL, result and BigQuery job cost.' },
      ], boundary: 'DOSI BigQuery execution is documented as experimental. Datus Agent’s native BigQuery adapter is separate and supports its own authentication options; do not assume a setting from one connection path works in the other.', docsLabel: 'DOSI BigQuery connector docs', agentLabel: 'Datus Agent BigQuery adapter docs' },
      use: { eyebrow: 'Useful for teams', heading: 'Share a definition without moving the data.', lead: 'A common model is useful when multiple people and tools ask the same business question of BigQuery.', items: [
        { title: 'Consistent metrics for AI analysis', body: 'Give agents a named metric to call, with a definition your team can inspect, rather than leaving them to infer a calculation from table names.' },
        { title: 'Explicit project boundaries', body: 'Keep data-project, dataset, job location and billing-project choices visible in configuration so a query runs in the intended context.' },
      ] },
      faq: { heading: 'BigQuery semantic layer FAQ', lead: 'How shared semantic definitions fit your BigQuery stack.', items: [
        { q: 'How is DOSI different from Looker on BigQuery?', a: 'Looker uses a LookML model to serve BI dashboards and applications over BigQuery. DOSI reads a separately managed Apache Ossie model and exposes named metrics through MCP, API and CLI interfaces. Both use BigQuery for query execution.' },
        { q: 'Does DOSI store a copy of my BigQuery tables?', a: 'No. DOSI compiles a metric request and sends SQL to the BigQuery project configured in its connection profile. BigQuery executes the job.' },
        { q: 'How does an Apache Ossie model connect business metrics to BigQuery?', a: 'The model maps business datasets to BigQuery tables or views and defines metric expressions, dimensions and relationships. DOSI uses those definitions to compile a metric request into GoogleSQL, then sends it to the configured BigQuery project. Teams can inspect the shared definition alongside the generated SQL and results.' },
      ] },
      resources: { heading: 'Explore the workflow', items: [
        { title: 'Semantic layer solution', body: 'See how reviewed definitions become queries for teams and agents.', href: '/solutions/semantic-layer/' },
        { title: 'Databricks semantic layer', body: 'Compare the setup for another cloud analytics engine.', href: '/databases/databricks/' },
        { title: 'BigQuery connector reference', body: 'See service-account, project and dataset configuration.', href: 'https://dosi.datus.ai/connectors/bigquery/' },
      ] },
      closing: { heading: 'Start with a BigQuery metric your team can verify.', lead: 'Review the definition, set a bounded query context and inspect what runs in BigQuery.', docsLabel: 'Read connector docs' },
    },
    zh: {
      eyebrow: 'Datus + Google BigQuery', heading: '为 BigQuery 数据建立有业务含义的语义层。',
      lead: '数据保留在 BigQuery。团队在 Apache Ossie 模型中审核指标，DOSI 将指标请求编译为 GoogleSQL 并发送给 BigQuery。Datus Agent 另有独立的 BigQuery 原生适配器。',
      setupLink: '查看连接步骤',
      facts: ['明确项目与数据集', '原生 BigQuery 查询', 'DOSI 执行仍为实验性'],
      diagram: { label: '各部分如何协作', input: '已有 SQL 与业务规则', review: '团队审核', model: 'Apache Ossie 模型', access: 'Agent 与应用 · MCP / API / CLI', engine: 'DOSI', target: 'BigQuery 项目与数据集', sql: '通过 jobs.query 执行 GoogleSQL', result: '结果经 DOSI 返回给工具', caption: 'DOSI 向指定的 BigQuery 项目发送查询；执行和计费由 BigQuery 负责。' },
      value: { eyebrow: 'Datus 的作用', heading: '在 BigQuery 之上建模指标的两种架构。', lead: 'Looker 可以用 LookML 为 BigQuery 数据建模，供仪表板和应用使用。DOSI 则使用单独审核的 Apache Ossie 模型，通过面向 Agent 的接口提供已命名指标；查询仍由 BigQuery 执行。', items: [
        { title: '让定义可审核', body: '在 Apache Ossie 模型中描述收入、维度和关系。团队确认业务逻辑后，再让应用和 Agent 复用。' },
        { title: '数据仍在 BigQuery', body: '查询在你配置的 BigQuery 项目和数据集中运行。DOSI 不会把底层表复制进另一个分析存储。' },
        { title: '区分两条接入路径', body: 'Datus Agent 用原生 BigQuery 适配器处理元数据和数据任务；DOSI 则有独立的 BigQuery 执行连接器，用于语义指标查询。' },
      ] },
      comparison: {
        label: 'BigQuery + Looker 与 BigQuery + Datus/DOSI 架构对比',
        native: { title: 'BigQuery + Looker', inputs: 'BigQuery 表 + LookML 模型', context: 'Looker 语义模型', consumers: 'Looker 仪表板与应用', warehouse: 'BigQuery 查询作业', note: 'Looker 是独立的 Google BI 产品，可连接 BigQuery。' },
        datus: { title: 'BigQuery + Datus / DOSI', inputs: '团队审核的 Apache Ossie 模型', context: 'DOSI 语义层', consumers: 'Agent 与应用 · MCP / API / CLI', warehouse: 'BigQuery jobs.query', note: '模型独立管理；DOSI 的 BigQuery 执行能力仍为实验性。' },
        caption: '两条路径都由 BigQuery 执行查询。BigQuery 也支持用 SQL View 复用查询逻辑。',
        sources: [
          { label: 'Google：Looker 与 BigQuery', href: 'https://docs.cloud.google.com/bigquery/docs/looker' },
          { label: 'DOSI BigQuery 连接器', href: 'https://dosi.datus.ai/connectors/bigquery/' },
        ],
      },
      example: { eyebrow: '具体流程', heading: '明确项目，发送指标请求，核查查询。', lead: '先准备审核过的模型与 BigQuery 连接配置，再向 DOSI 请求已命名的指标。', profile: 'dosi-connections.yaml', command: 'DOSI CLI · 示例请求', note: '这里展示配置与命令示例，并未实时运行 BigQuery。请使用你自己的已验证模型和服务账号。DOSI BigQuery 执行连接器目前仍为实验性。' },
      steps: { eyebrow: '连接 BigQuery', heading: '明确数据项目与计费项目。', lead: 'DOSI 连接器使用服务账号 JSON 密钥和 BigQuery jobs.query API。BigQuery 项目对应 catalog，数据集是下一级命名空间。', items: [
        { title: '配置访问权限', body: '服务账号需要读取相关数据，并能在计费项目创建作业。确认数据集所在地区，例如 US 或 EU。' },
        { title: '只选择一种凭据来源', body: '在 DOSI 配置中使用 credentials_path、credentials_info 或 credentials_base64，三选一。该连接器不使用 Application Default Credentials。' },
        { title: '验证模型与查询', body: '检查数据集名称和指标定义，执行范围明确的请求，再核查 SQL、结果和 BigQuery 作业费用。' },
      ], boundary: 'DOSI BigQuery 执行能力在文档中标为实验性。Datus Agent 的 BigQuery 原生适配器是另一条路径，支持的认证方式并不完全相同；不要将两者配置混用。', docsLabel: 'DOSI BigQuery 连接器文档', agentLabel: 'Datus Agent BigQuery 适配器文档' },
      use: { eyebrow: '团队如何使用', heading: '共享定义，数据仍留在原处。', lead: '当多人和多个工具反复查询 BigQuery 中同一个业务问题时，统一模型尤其有用。', items: [
        { title: '让 AI 分析使用一致指标', body: '让 Agent 调用团队可核查的已命名指标，而不是仅靠表名猜测计算方式。' },
        { title: '明确项目边界', body: '在配置中写清数据项目、数据集、作业地区和计费项目，确保查询运行在预期环境。' },
      ] },
      faq: { heading: 'BigQuery 语义层常见问题', lead: '共享语义定义如何融入 BigQuery 技术栈。', items: [
        { q: '在 BigQuery 上，DOSI 与 Looker 有什么区别？', a: 'Looker 使用 LookML 模型，为 BigQuery 上的 BI 仪表板和应用提供定义。DOSI 读取独立管理的 Apache Ossie 模型，通过 MCP、API 和 CLI 提供已命名指标。两者都将查询交给 BigQuery 执行。' },
        { q: 'DOSI 会复制 BigQuery 表吗？', a: '不会。DOSI 编译指标请求，并向连接配置指定的 BigQuery 项目发送 SQL；作业由 BigQuery 执行。' },
        { q: 'Apache Ossie 模型如何将业务指标关联到 BigQuery？', a: '模型将业务数据集映射到 BigQuery 表或 View，并定义指标表达式、维度和关系。DOSI 根据这些定义将指标请求编译为 GoogleSQL，再发送到配置的 BigQuery 项目。团队可以结合共享定义、生成的 SQL 与结果检查计算依据。' },
      ] },
      resources: { heading: '继续了解', items: [
        { title: '语义层解决方案', body: '了解如何把审核过的定义变成团队和 Agent 可用的查询。', href: '/solutions/semantic-layer/' },
        { title: 'Databricks 语义层', body: '比较另一种云分析引擎的连接方式。', href: '/databases/databricks/' },
        { title: 'BigQuery 连接器参考', body: '查看服务账号、项目与数据集配置。', href: 'https://dosi.datus.ai/connectors/bigquery/' },
      ] },
      closing: { heading: '先从团队能验证的 BigQuery 指标开始。', lead: '审核定义，限定查询范围，检查 BigQuery 实际执行的内容。', docsLabel: '阅读连接器文档' },
    },
  },
};

const duckdb: EnginePageData = {
  slug: 'duckdb', name: 'DuckDB', path: '/databases/duckdb/',
  docs: 'https://dosi.datus.ai/connectors/duckdb/',
  agentDocs: 'https://docs.datus.ai/dev/configuration/datasources/duckdb/',
  profile: `datasources:
  local_duckdb:
    type: duckdb
    uri: duckdb:////absolute/path/analytics.duckdb`,
  command: `dosi query --model model.yaml \\
  --metrics revenue --group-by orders.status \\
  --execute --connection local_duckdb`,
  copy: {
    en: {
      eyebrow: 'Datus + DuckDB', heading: 'A semantic layer for local DuckDB analysis.',
      lead: 'Define a metric against a DuckDB file, review it with your team, and run it locally through DOSI. Use the same explicit business meaning in agent workflows without requiring a cloud warehouse for the first iteration.',
      setupLink: 'See the local setup',
      facts: ['Local file or in-memory', 'In-process execution', 'Native Arrow results'],
      diagram: { label: 'How the pieces connect', input: 'Local data + existing SQL', review: 'Team review', model: 'Apache Ossie model', access: 'Agents + apps · MCP / API / CLI', engine: 'DOSI', target: 'DuckDB file', sql: 'In-process SQL execution', result: 'Results return through DOSI to your tools', caption: 'The default DOSI build executes locally with its bundled DuckDB library; your model remains separate from the data file.' },
      value: { eyebrow: 'Where Datus fits', heading: 'DuckDB SQL objects and a separate semantic model.', lead: 'DuckDB views and macros reuse SQL logic inside the database. DOSI adds a team-reviewed Apache Ossie model for named metrics that agents and applications can request, while DuckDB remains the local execution engine.', items: [
        { title: 'Start with a small, real model', body: 'Map a local orders dataset to the metric and dimensions you want to share. Review the calculation before any agent relies on it.' },
        { title: 'Inspect locally', body: 'The default DOSI build opens DuckDB in process and returns Arrow-native results. You can inspect the generated SQL and result without provisioning a remote warehouse.' },
        { title: 'Bring in Datus Agent', body: 'DuckDB is also a built-in Datus Agent adapter. The Agent can work with the local database while DOSI handles the separate semantic execution path.' },
      ] },
      comparison: {
        label: 'DuckDB SQL views and macros versus DuckDB with Datus/DOSI architecture comparison',
        native: { title: 'DuckDB views + macros', inputs: 'Local tables or files + authored SQL', context: 'Views and macros', consumers: 'SQL clients, notebooks and apps', warehouse: 'DuckDB in-process', note: 'Reusable SQL definitions live in DuckDB catalog objects.' },
        datus: { title: 'DuckDB + Datus / DOSI', inputs: 'Team-reviewed Apache Ossie model', context: 'DOSI semantic layer', consumers: 'Agents and apps · MCP / API / CLI', warehouse: 'DuckDB in-process', note: 'The semantic model is managed separately from the DuckDB file.' },
        caption: 'Views and macros reuse SQL; DOSI adds explicit metric and dimension definitions. DuckDB executes both paths.',
        sources: [
          { label: 'DuckDB views', href: 'https://duckdb.org/docs/current/sql/statements/create_view' },
          { label: 'DuckDB macros', href: 'https://duckdb.org/docs/current/sql/statements/create_macro' },
          { label: 'DOSI DuckDB connector', href: 'https://dosi.datus.ai/connectors/duckdb/' },
        ],
      },
      example: { eyebrow: 'A concrete workflow', heading: 'Use a local file as your first execution target.', lead: 'Point DOSI at a DuckDB database file, validate your model, then ask for a metric by a named dimension.', profile: 'dosi-connections.yaml', command: 'DOSI CLI · example request', note: 'Replace the sample path and model.yaml with your own file and validated model. This example shows the invocation, not an invented output. The default DOSI build bundles DuckDB; the lean build has different requirements.' },
      steps: { eyebrow: 'Connect DuckDB', heading: 'From file to first metric query.', lead: 'The default DOSI build includes an in-process DuckDB executor. A file-backed connection uses a duckdb: URI; omit the URI for an in-memory connection.', items: [
        { title: 'Choose a database file', body: 'Use an absolute DuckDB file path while getting started. Confirm the file is accessible and contains the tables your model references.' },
        { title: 'Write and review the model', body: 'Define the dataset, metric, dimension and relevant relationships in an Apache Ossie model. Validate the model before asking DOSI to execute it.' },
        { title: 'Run a bounded query', body: 'Use --connection local_duckdb and inspect generated SQL and Arrow-backed results. Keep the DuckDB file and model under your own versioning and access controls.' },
      ], boundary: 'The default DOSI download bundles DuckDB. The lean build instead requires a compatible DuckDB CLI on PATH and cannot persist an in-memory batch across separate processes. Datus Agent’s built-in DuckDB adapter is a related but separate path.', docsLabel: 'DOSI DuckDB connector docs', agentLabel: 'Datus Agent DuckDB adapter docs' },
      use: { eyebrow: 'Useful for teams', heading: 'A practical place to begin semantic modeling.', lead: 'Local execution makes the first model easier to inspect before a wider rollout.', items: [
        { title: 'Prototype a metric', body: 'Try the definition against a local dataset, compare the result to known numbers and revise the model before sharing it.' },
        { title: 'Give agents a named calculation', body: 'Expose the reviewed metric through DOSI interfaces so an agent can request it without recreating the calculation from column names.' },
      ] },
      faq: { heading: 'DuckDB semantic layer FAQ', lead: 'How local execution works with DOSI and Datus Agent.', items: [
        { q: 'How does DOSI differ from DuckDB views and macros?', a: 'Views and macros let you reuse SQL within DuckDB. DOSI keeps metric and dimension definitions in a separately reviewed Apache Ossie model and exposes them through MCP, API and CLI. DuckDB still executes the generated query.' },
        { q: 'Do I need a cloud warehouse to try DOSI with DuckDB?', a: 'No. The default DOSI build includes DuckDB for local in-process execution. Connect to a local file or use an in-memory database where appropriate.' },
        { q: 'Can I use the same DuckDB file with Datus Agent?', a: 'Datus Agent includes a DuckDB adapter. Configure its datasource separately from DOSI’s semantic connection, then use each path for the task it supports.' },
        { q: 'Does the lean DOSI build work the same way?', a: 'No. The lean build invokes a DuckDB CLI installed on your PATH and has different in-memory behavior. Consult the connector guide before choosing it.' },
      ] },
      resources: { heading: 'Explore the workflow', items: [
        { title: 'Semantic layer solution', body: 'How DOSI serves reviewed models to people, applications and agents.', href: '/solutions/semantic-layer/' },
        { title: 'BigQuery semantic layer', body: 'See how the model-first pattern extends to a managed warehouse.', href: '/databases/bigquery/' },
        { title: 'DuckDB connector reference', body: 'File URI, in-memory and lean-build behavior.', href: 'https://dosi.datus.ai/connectors/duckdb/' },
      ] },
      closing: { heading: 'Try the first metric on a local DuckDB file.', lead: 'Start with a definition and a dataset your team can verify, then decide where to reuse it.', docsLabel: 'Read connector docs' },
    },
    zh: {
      eyebrow: 'Datus + DuckDB', heading: '为本地 DuckDB 分析建立语义层。',
      lead: '针对 DuckDB 文件定义指标，让团队审核后通过 DOSI 在本地运行。在 Agent 工作流中复用明确的业务含义，初次验证无需先配置云数仓。',
      setupLink: '查看本地配置',
      facts: ['本地文件或内存数据库', '进程内执行', '原生 Arrow 结果'],
      diagram: { label: '各部分如何协作', input: '本地数据与已有 SQL', review: '团队审核', model: 'Apache Ossie 模型', access: 'Agent 与应用 · MCP / API / CLI', engine: 'DOSI', target: 'DuckDB 文件', sql: '进程内执行 SQL', result: '结果经 DOSI 返回给工具', caption: 'DOSI 默认构建通过自带的 DuckDB 库在本地执行；模型与数据文件分开保存。' },
      value: { eyebrow: 'Datus 的作用', heading: 'DuckDB SQL 对象与独立语义模型。', lead: 'DuckDB 的 View 和 Macro 可以在数据库内复用 SQL 逻辑。DOSI 则增加由团队审核的 Apache Ossie 模型，让 Agent 和应用请求已命名指标；本地执行仍由 DuckDB 完成。', items: [
        { title: '从一个真实模型开始', body: '把本地订单数据集映射到要共享的指标与维度。让团队先审核计算方式，再交给 Agent 使用。' },
        { title: '在本地核查', body: 'DOSI 默认构建在进程内打开 DuckDB，并返回原生 Arrow 结果。无需配置远程数仓，也能查看生成的 SQL 与结果。' },
        { title: '接入 Datus Agent', body: 'Datus Agent 也内置 DuckDB 适配器。Agent 可以处理本地数据库任务，DOSI 则负责独立的语义执行路径。' },
      ] },
      comparison: {
        label: 'DuckDB View 与 Macro、以及 DuckDB + Datus/DOSI 架构对比',
        native: { title: 'DuckDB View + Macro', inputs: '本地表或文件 + 人工编写的 SQL', context: 'View 与 Macro', consumers: 'SQL 客户端、Notebook 与应用', warehouse: 'DuckDB 进程内执行', note: '可复用的 SQL 定义保存在 DuckDB 数据目录对象中。' },
        datus: { title: 'DuckDB + Datus / DOSI', inputs: '团队审核的 Apache Ossie 模型', context: 'DOSI 语义层', consumers: 'Agent 与应用 · MCP / API / CLI', warehouse: 'DuckDB 进程内执行', note: '语义模型与 DuckDB 文件分开管理。' },
        caption: 'View 和 Macro 复用 SQL；DOSI 增加明确的指标与维度定义。两条路径都由 DuckDB 执行。',
        sources: [
          { label: 'DuckDB View 文档', href: 'https://duckdb.org/docs/current/sql/statements/create_view' },
          { label: 'DuckDB Macro 文档', href: 'https://duckdb.org/docs/current/sql/statements/create_macro' },
          { label: 'DOSI DuckDB 连接器', href: 'https://dosi.datus.ai/connectors/duckdb/' },
        ],
      },
      example: { eyebrow: '具体流程', heading: '先以本地文件作为执行目标。', lead: '让 DOSI 指向 DuckDB 数据库文件，验证模型，再按指定维度请求指标。', profile: 'dosi-connections.yaml', command: 'DOSI CLI · 示例请求', note: '请将示例路径和 model.yaml 替换为你自己的文件与已验证模型。这里展示调用方式，没有虚构执行结果。DOSI 默认构建自带 DuckDB；精简构建的要求不同。' },
      steps: { eyebrow: '连接 DuckDB', heading: '从本地文件到第一条指标查询。', lead: 'DOSI 默认构建包含进程内 DuckDB 执行器。文件连接使用 duckdb: URI；不写 URI 则使用内存数据库。', items: [
        { title: '选好数据库文件', body: '初次配置建议使用 DuckDB 文件的绝对路径。确认进程能访问该文件，且文件包含模型引用的表。' },
        { title: '编写并审核模型', body: '在 Apache Ossie 模型中定义数据集、指标、维度和相关关系。让 DOSI 执行前，先验证模型。' },
        { title: '执行范围明确的查询', body: '使用 --connection local_duckdb，检查生成的 SQL 和 Arrow 结果。数据库文件和模型应由你自己的版本与访问控制管理。' },
      ], boundary: 'DOSI 默认下载版自带 DuckDB。精简构建需要在 PATH 中另行安装兼容的 DuckDB CLI，而且不能跨独立进程保留内存批处理状态。Datus Agent 内置的 DuckDB 适配器是相关但独立的路径。', docsLabel: 'DOSI DuckDB 连接器文档', agentLabel: 'Datus Agent DuckDB 适配器文档' },
      use: { eyebrow: '团队如何使用', heading: '从本地开始验证语义模型。', lead: '先在本地核查模型，再决定如何推广给团队。', items: [
        { title: '试做一个指标', body: '用本地数据集执行定义，与已知数字对照，再修改模型，最后分享。' },
        { title: '让 Agent 使用已命名的计算', body: '通过 DOSI 接口提供审核过的指标，让 Agent 直接请求，而不必依据列名重新猜测计算方式。' },
      ] },
      faq: { heading: 'DuckDB 语义层常见问题', lead: 'DOSI 和 Datus Agent 如何使用本地数据库。', items: [
        { q: 'DOSI 与 DuckDB View、Macro 有什么区别？', a: 'View 和 Macro 让你在 DuckDB 内复用 SQL。DOSI 把指标和维度定义放在单独审核的 Apache Ossie 模型中，通过 MCP、API 和 CLI 提供给工具；生成的查询仍由 DuckDB 执行。' },
        { q: '使用 DOSI 和 DuckDB 一定需要云数仓吗？', a: '不需要。DOSI 默认构建包含 DuckDB 进程内执行能力，可连接本地文件，也可按需使用内存数据库。' },
        { q: 'Datus Agent 也能使用同一个 DuckDB 文件吗？', a: 'Datus Agent 内置 DuckDB 适配器。它的数据源配置与 DOSI 的语义连接需分别设置，再按各自支持的任务使用。' },
        { q: 'DOSI 精简构建的行为一样吗？', a: '不一样。精简构建会调用 PATH 中安装的 DuckDB CLI，对内存数据库的使用也有限制。选用前请查看连接器指南。' },
      ] },
      resources: { heading: '继续了解', items: [
        { title: '语义层解决方案', body: '了解 DOSI 如何让团队、应用和 Agent 使用审核过的模型。', href: '/solutions/semantic-layer/' },
        { title: 'BigQuery 语义层', body: '查看同样的建模方法如何用于托管数仓。', href: '/databases/bigquery/' },
        { title: 'DuckDB 连接器参考', body: '查看文件 URI、内存数据库和精简构建的行为。', href: 'https://dosi.datus.ai/connectors/duckdb/' },
      ] },
      closing: { heading: '用本地 DuckDB 文件试做第一个指标。', lead: '从团队能核查的定义与数据集开始，再决定在哪里复用。', docsLabel: '阅读连接器文档' },
    },
  },
};

export const ENGINE_PAGES: Record<Engine, EnginePageData> = { databricks, bigquery, duckdb };
