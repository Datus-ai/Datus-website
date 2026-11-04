import type { Locale } from '../../../i18n/config';

export const SNOWFLAKE_DOCS = 'https://dosi.datus.ai/connectors/snowflake/';
export const AGENT_SNOWFLAKE_DOCS = 'https://docs.datus.ai/dev/configuration/datasources/snowflake/';
export const MODEL_DOWNLOAD = '/examples/snowflake/orders-model.yaml';
export const MODEL_EXCERPT = `semantic_model:
  - name: orders_model
    datasets:
      - name: orders
        source: main.orders
        # Fields and relationships omitted.
    metrics:
      - name: revenue
        expression:
          dialects:
            - dialect: ANSI_SQL
              expression: SUM(orders.amount)`;
// Recorded by running the installed DOSI compiler against the full linked fixture.
// No Snowflake connection or warehouse execution was used to obtain this SQL.
export const SNOWFLAKE_SQL = `SELECT
  orders.status AS status,
  SUM(orders.amount) AS revenue
FROM main.orders AS orders
GROUP BY orders.status`;
export const SNOWFLAKE_CONNECTION = `datasources:
  snowflake:
    type: snowflake
    account: \${SNOWFLAKE_ACCOUNT}
    username: \${SNOWFLAKE_USER}
    warehouse: COMPUTE_WH
    database: ANALYTICS
    schema: MAIN
    private_key_file: /path/to/snowflake_key.p8`;
export const SNOWFLAKE_COMMAND = `dosi query --model orders-model.yaml \\
  --metrics revenue --group-by orders.status \\
  --dialect snowflake`;

type Copy = {
 eyebrow:string; heading:string; lead:string; setupLink:string; back:string; comparisonLink:string;
 architecture:{label:string;inputs:string;authoring:string;model:string;consumer:string;interface:string;engine:string;planning:string;warehouse:string;sql:string;returnPath:string;caption:string};
 facts:string[]; why:{eyebrow:string;heading:string;lead:string;diagram:{label:string;native:{tag:string;title:string;consumers:string;boundary:string;model:string;modelDetail:string;warehouse:string;summary:string};datus:{tag:string;title:string;consumers:string;outside:string;boundary:string;model:string;modelDetail:string;engine:string;engineDetail:string;warehouse:string;summary:string};note:string;source:string;explainer:string};items:{title:string;body:string}[]};
 proof:{eyebrow:string;heading:string;lead:string;tabs:string[];titles:string[];descriptions:string[];files:string[];caption:string;download:string;command:string;docs:string};
 steps:{eyebrow:string;heading:string;lead:string;items:{title:string;body:string}[];docs:string;note:string;agent:string};
 usage:{eyebrow:string;heading:string;lead:string;items:{title:string;body:string;link:string;href:string}[]};
 faq:{heading:string;lead:string;items:{q:string;a:string}[]};
 resources:{heading:string;items:{title:string;body:string;href:string}[]};
 closing:{heading:string;lead:string;secondary:string};
};

export const SNOWFLAKE_PAGE:Record<Locale,Copy> = {
 en:{
  eyebrow:'Datus + Snowflake',heading:'A semantic layer for Snowflake, built for AI agents.',
  lead:'Keep Snowflake as your data warehouse and query engine. Give agents reviewed business definitions they can reuse, then let DOSI compile supported metric requests into native Snowflake SQL.',
  setupLink:'See setup steps',back:'All databases',comparisonLink:'Already use Snowflake Semantic Views? See how this fits.',
  architecture:{label:'How the pieces connect',inputs:'Existing SQL + docs',authoring:'Datus Agent + team review',model:'Apache Ossie model',consumer:'AI agents + apps',interface:'MCP · API · CLI',engine:'DOSI',planning:'Metric planning',warehouse:'Snowflake warehouse',sql:'Native SQL',returnPath:'Results return through DOSI to agents + apps',caption:'DOSI plans the query; your configured Snowflake warehouse executes it.'},
  facts:['Apache Ossie definitions','Native SQL pushdown','MCP · API · CLI'],
  why:{eyebrow:'Where Datus fits',heading:'Already using Snowflake Semantic Views?',lead:'Semantic Views define business meaning as native Snowflake objects. Datus uses a separate, team-reviewed Apache Ossie model that DOSI makes available to agents and applications. The two approaches can coexist; this workflow does not automatically import or replace Snowflake Semantic Views.',diagram:{
   label:'Compare the two Snowflake semantic architectures',
   native:{tag:'Warehouse-native',title:'Snowflake + Semantic Views',consumers:'Cortex Agents · BI · SQL',boundary:'Inside Snowflake',model:'Semantic View',modelDetail:'Schema-level object',warehouse:'Tables + warehouse',summary:'Snowflake stores the definition and executes the query.'},
   datus:{tag:'Portable definition',title:'Snowflake + Datus',consumers:'AI agents + apps · MCP / API / CLI',outside:'Outside Snowflake',boundary:'Inside Snowflake',model:'Apache Ossie model',modelDetail:'Reviewed by your team',engine:'DOSI',engineDetail:'Compiles native SQL',warehouse:'Tables + warehouse',summary:'DOSI uses a separate model; Snowflake executes the SQL.'},
   note:'Two valid paths. Datus does not automatically import, query, or replace Snowflake Semantic Views.',source:'How Snowflake Semantic Views work',explainer:'Learn about Snowflake’s Ossie bridge',
  },items:[
   {title:'Start with knowledge you already have',body:'Datus Agent helps gather candidate definitions from existing SQL, business documents, and warehouse structure. Your team reviews the model before agents reuse it.'},
   {title:'Keep the model usable across tools',body:'Apache Ossie (incubating) is an open specification. DOSI can execute compatible models for Snowflake and other supported SQL dialects, without binding every agent to one warehouse-native semantic object.'},
   {title:'Inspect native execution',body:'DOSI turns a supported metric request into Snowflake SQL. Review the definition, generated SQL, and lineage; the configured Snowflake warehouse executes the query.'},
  ]},
  proof:{eyebrow:'From business meaning to SQL',heading:'One definition. A query you can inspect.',lead:'A compact example of the execution path: an Apache Ossie definition, SQL produced by DOSI, and a Snowflake connection profile.',tabs:['The definition','The SQL','The connection'],titles:['Define business meaning in Apache Ossie.','See what will run in Snowflake.','Use your Snowflake execution context.'],descriptions:[
   'Name a metric and map it to source fields. The example uses an orders model; your team owns the business logic and reviews changes before reuse.',
   'DOSI compiles the selected metric and dimension into Snowflake SQL. Inspect the query before using an execution-enabled connection.',
   'Select the account, warehouse, database, and schema explicitly. The DOSI connector uses key-pair authentication through the Snowflake SQL API.',
  ],files:['orders-model.yaml · excerpt','Snowflake SQL · compiler output','dosi-connections.yaml'],caption:'SQL generated locally with DOSI from the linked model. No Snowflake query runs on this page. The YAML excerpt omits fields and relationships; download the full model to use the command.',download:'Download the full example model',command:'Reproduce the SQL',docs:'Snowflake connector reference'},
  steps:{eyebrow:'Connect your warehouse',heading:'A clear path from setup to your first query.',lead:'Start in Studio for a team workspace, or configure DOSI directly for semantic execution. These setup steps describe the standalone DOSI connector.',items:[
   {title:'Prepare access',body:'Choose a Snowflake user and grant access to the warehouse and data needed for your workload. Register a key pair for that user; keep the private key and passphrase out of shared source files.'},
   {title:'Add the connection profile',body:'Set the account, user, warehouse, and data namespace. Point private_key_file at a PKCS#8 private key. Store secrets using environment variables or your approved secret-management process.'},
   {title:'Review, then execute',body:'Compile a model and inspect the SQL first. With the connector enabled, use --execute --connection snowflake to submit a supported query to your warehouse.'},
  ],docs:'Read the Snowflake setup guide',note:'Execution depends on the connector included in your DOSI build and the permissions of the configured Snowflake user. Current limits include large multi-partition results and some window calculations; check the connector reference before adopting a workload.',agent:'Looking for the Datus Agent adapter setup?'},
  usage:{eyebrow:'One context, different ways to work',heading:'Make Snowflake business context useful beyond one query.',lead:'Choose the interface that fits the work. Keep shared definitions and inspectable execution underneath.',items:[
   {title:'Data teams',body:'Bring files, SQL, results, and Agent conversations together in Studio. Use Datus Agent for data engineering and analysis, with semantic modeling as one of its capabilities.',link:'Explore Datus Studio',href:'/products/studio/'},
   {title:'Agents and developers',body:'Use supported DOSI MCP, API, and CLI interfaces to discover models and request metrics. Snowflake executes the supported SQL; your application decides how to present the result.',link:'Explore agent access',href:'https://dosi.datus.ai/agents/'},
  ]},
  faq:{heading:'Snowflake, with the details that matter.',lead:'What connects, where queries run, and how the pieces fit.',items:[
   {q:'What does a semantic layer add to Snowflake?',a:'It connects tables and fields to shared business definitions: metrics, dimensions, calculations, and relationships. Datus helps teams review that context and make it available to agents. DOSI compiles compatible Apache Ossie definitions into native SQL for Snowflake.'},
   {q:'Where do queries execute?',a:'For the standalone DOSI Snowflake connector, DOSI submits native SQL through Snowflake’s SQL API. The configured Snowflake warehouse runs the query. DOSI handles planning and normalizes the returned result; this is not a claim that query results never leave Snowflake.'},
   {q:'Can Datus use my existing Snowflake Semantic Views?',a:'This workflow does not automatically import, query, or publish Snowflake Semantic Views. They are native Snowflake objects; Datus uses a separate Apache Ossie model that DOSI compiles into Snowflake SQL. Teams can compare and review definitions when deciding how to use both approaches.'},
   {q:'What authentication does DOSI use?',a:'The documented standalone Snowflake connector uses key-pair JWT authentication with a PKCS#8 private key. Its connection profile includes account, username, and private_key_file, with optional warehouse, database, schema, role, and key passphrase settings. The Datus Agent adapter has separate setup documentation.'},
   {q:'Does Open mean DOSI is open-source?',a:'Open refers to the Apache Ossie specification and reviewable, reusable definitions. DOSI uses Elastic License 2.0. Datus Agent is the open-source data Agent; the runtime and Agent have different licenses.'},
   {q:'Do permissions and workload limits still apply?',a:'Yes. Requests use the configured Snowflake identity and its access. The DOSI connector documents limitations, including large multi-partition result sets and certain window operations. Reusing a model across data sources does not imply unrestricted cross-warehouse federated queries.'},
  ]},
  resources:{heading:'Go deeper, when you need to.',items:[
   {title:'The semantic layer, end to end',body:'See how business definitions become shared context for teams and agents.',href:'/solutions/semantic-layer/'},
   {title:'Connect Snowflake with DOSI',body:'Authentication, profile fields, execution, and current connector limits.',href:SNOWFLAKE_DOCS},
   {title:'See all supported databases',body:'Explore the Datus Agent adapter directory and configuration guides.',href:'/databases/'},
  ]},
  closing:{heading:'Put your Snowflake context to work.',lead:'Start in Datus Studio, or connect the standalone DOSI runtime to your warehouse.',secondary:'Set up DOSI for Snowflake'},
 },
 zh:{
  eyebrow:'Datus + Snowflake',heading:'为 Snowflake 构建语义层，让 AI Agent 理解业务。',
  lead:'Snowflake 继续承担数据存储和查询执行。让 Agent 使用经过团队审核的业务定义，再由 DOSI 将受支持的指标请求编译为 Snowflake 原生 SQL。',
  setupLink:'查看接入步骤',back:'全部数据库',comparisonLink:'已在使用 Snowflake Semantic Views？了解两种方式如何配合。',
  architecture:{label:'各部分如何连接',inputs:'已有 SQL 与文档',authoring:'Datus Agent + 团队审核',model:'Apache Ossie 模型',consumer:'AI Agent 与应用',interface:'MCP · API · CLI',engine:'DOSI',planning:'指标查询规划',warehouse:'Snowflake 数仓',sql:'原生 SQL',returnPath:'结果经 DOSI 返回 Agent 与应用',caption:'DOSI 规划查询，由配置好的 Snowflake 数仓执行。'},
  facts:['Apache Ossie 定义','原生 SQL 下推','MCP · API · CLI'],
  why:{eyebrow:'Datus 如何配合 Snowflake',heading:'已经在使用 Snowflake Semantic Views？',lead:'Semantic Views 是 Snowflake 内的原生业务定义。Datus 使用独立的 Apache Ossie 模型，经过团队审核后，由 DOSI 提供给 Agent 和应用使用。两种方式可以并行；当前流程不会自动导入或替代 Snowflake Semantic Views。',diagram:{
   label:'对比两种 Snowflake 语义架构',
   native:{tag:'数仓原生定义',title:'Snowflake + Semantic Views',consumers:'Cortex Agents · BI · SQL',boundary:'Snowflake 内部',model:'Semantic View',modelDetail:'Schema 级对象',warehouse:'数据表与数仓',summary:'业务定义存于 Snowflake，查询也由 Snowflake 执行。'},
   datus:{tag:'可复用的模型定义',title:'Snowflake + Datus',consumers:'AI Agent 与应用 · MCP / API / CLI',outside:'Snowflake 外部',boundary:'Snowflake 内部',model:'Apache Ossie 模型',modelDetail:'经过团队审核',engine:'DOSI',engineDetail:'编译原生 SQL',warehouse:'数据表与数仓',summary:'DOSI 使用独立模型，由 Snowflake 执行 SQL。'},
   note:'两种方式可以并行。Datus 当前不会自动导入、查询或替代 Snowflake Semantic Views。',source:'了解 Snowflake Semantic Views',explainer:'了解 Snowflake 的 Ossie 转换方式',
  },items:[
   {title:'从已有知识开始',body:'Datus Agent 辅助从已有 SQL、业务文档和数仓表结构中整理候选定义。团队审核模型后，再供 Agent 复用。'},
   {title:'让模型跨工具使用',body:'Apache Ossie（孵化中）是开放规范。DOSI 可以在 Snowflake 和其他受支持的 SQL 方言中执行兼容的模型，Agent 无需依赖同一个数仓原生语义对象。'},
   {title:'核查原生 SQL 执行',body:'DOSI 将受支持的指标请求转为 Snowflake SQL。你可以核查定义、生成的 SQL 与血缘；查询由配置好的 Snowflake 数仓执行。'},
  ]},
  proof:{eyebrow:'从业务含义到 SQL',heading:'一份定义，一条可以核查的查询。',lead:'通过一个简短示例，查看 Apache Ossie 定义、DOSI 生成的 SQL，以及 Snowflake 连接配置。',tabs:['业务定义','生成的 SQL','连接配置'],titles:['用 Apache Ossie 定义业务含义。','查看将在 Snowflake 中执行的 SQL。','明确 Snowflake 的执行环境。'],descriptions:[
   '为指标命名，并映射到源数据字段。示例使用订单模型；团队维护业务逻辑，并在复用前审核变更。',
   'DOSI 将选定的指标与维度编译为 Snowflake SQL。先核查查询，再通过已启用执行能力的连接运行。',
   '明确选择账号、数仓、数据库和 Schema。DOSI 通过 Snowflake SQL API 连接，使用密钥对认证。',
  ],files:['orders-model.yaml · 节选','Snowflake SQL · 编译器输出','dosi-connections.yaml'],caption:'SQL 由本地 DOSI 根据所链接的模型生成，本页面不执行 Snowflake 查询。YAML 节选省略了字段与关系；运行命令前请下载完整模型。',download:'下载完整示例模型',command:'复现 SQL 编译结果',docs:'Snowflake 连接参考'},
  steps:{eyebrow:'连接你的数仓',heading:'从接入到第一次查询，路径清晰。',lead:'团队可以从 Studio 工作空间开始，也可以直接配置 DOSI 进行语义执行。以下步骤针对独立使用的 DOSI 连接器。',items:[
   {title:'准备访问权限',body:'选择 Snowflake 用户，并授予工作负载所需的数仓和数据访问权限。为该用户注册密钥对，将私钥和口令保存在共享源码之外。'},
   {title:'添加连接配置',body:'设置账号、用户、数仓和数据命名空间。将 private_key_file 指向 PKCS#8 私钥，使用环境变量或团队认可的密钥管理方式保存凭据。'},
   {title:'先核查，再执行',body:'先编译模型并检查 SQL。启用相应连接器后，使用 --execute --connection snowflake，将受支持的查询提交给数仓。'},
  ],docs:'阅读 Snowflake 接入指南',note:'执行能力取决于 DOSI 构建所包含的连接器，以及所配置 Snowflake 用户的权限。目前存在大规模多分区结果和部分窗口计算等限制，接入具体工作负载前请查看连接参考。',agent:'需要配置 Datus Agent 的 Snowflake 适配器？'},
  usage:{eyebrow:'共享上下文，支持不同工作方式',heading:'让 Snowflake 业务上下文服务更多工作。',lead:'按工作需要选择界面，底层复用共享定义与可核查的执行过程。',items:[
   {title:'数据团队',body:'在 Studio 中整合文件、SQL、结果与 Agent 对话。使用 Datus Agent 开展数据工程与分析，语义建模是其能力之一。',link:'了解 Datus Studio',href:'/products/studio/'},
   {title:'Agent 与开发者',body:'通过受支持的 DOSI MCP、API 与 CLI 接口发现模型、查询指标。Snowflake 执行受支持的 SQL，应用决定如何呈现结果。',link:'了解 Agent 接入',href:'https://dosi.datus.ai/agents/'},
  ]},
  faq:{heading:'关于 Snowflake 接入，你可能想了解这些。',lead:'连接方式、执行位置与产品之间的关系。',items:[
   {q:'语义层为 Snowflake 增加了什么？',a:'语义层将表和字段连接到共享的业务定义，包括指标、维度、计算与关系。Datus 帮助团队审核上下文，并让 Agent 在工作中使用。DOSI 将兼容的 Apache Ossie 定义编译为 Snowflake 原生 SQL。'},
   {q:'查询在哪里执行？',a:'独立使用的 DOSI Snowflake 连接器通过 Snowflake SQL API 提交原生 SQL，由所配置的 Snowflake 数仓执行。DOSI 负责查询规划与结果规范化，这不意味着查询结果永远不会离开 Snowflake。'},
   {q:'Datus 能直接使用现有的 Snowflake Semantic Views 吗？',a:'当前流程不会自动导入、查询或发布 Snowflake Semantic Views。它们是 Snowflake 的原生对象；Datus 使用独立的 Apache Ossie 模型，由 DOSI 将其编译为 Snowflake SQL。团队可以核对定义，再决定如何并行使用这两种方式。'},
   {q:'DOSI 使用什么认证方式？',a:'文档中的独立 Snowflake 连接器使用密钥对 JWT 认证，需要 PKCS#8 私钥。配置包括 account、username 和 private_key_file，也可设置数仓、数据库、Schema、角色与私钥口令。Datus Agent 适配器另有接入文档。'},
   {q:'Open 是否意味着 DOSI 是开源项目？',a:'Open 指 Apache Ossie 的开放规范，以及可审核、可复用的业务定义。DOSI 采用 Elastic License 2.0 许可。Datus Agent 是开源的数据 Agent，两者采用不同的许可。'},
   {q:'权限与工作负载限制仍然适用吗？',a:'适用。请求使用所配置 Snowflake 用户的身份和权限。DOSI 文档说明了连接器的限制，包括大规模多分区结果集与部分窗口操作。跨数据源复用模型，并不意味着可以执行任意跨数仓联邦查询。'},
  ]},
  resources:{heading:'需要更多细节时，从这里继续。',items:[
   {title:'了解完整的语义层方案',body:'查看业务定义如何成为团队与 Agent 共用的上下文。',href:'/solutions/semantic-layer/'},
   {title:'用 DOSI 连接 Snowflake',body:'了解认证、连接字段、执行方式与当前限制。',href:SNOWFLAKE_DOCS},
   {title:'查看全部支持的数据库',body:'浏览 Datus Agent 适配器目录与配置指南。',href:'/databases/'},
  ]},
  closing:{heading:'让 Snowflake 业务上下文投入使用。',lead:'从 Datus Studio 开始，或将独立的 DOSI 运行时连接到你的数仓。',secondary:'配置 DOSI 的 Snowflake 连接'},
 },
};
