import type { Locale } from '../i18n/config';

type StackRow = { name: string; vendors: { name: string; mode: string; logo?: string }[]; read: string; run: string; output: string; guides: { label: string; href: string }[] };
type StackCopy = { navigation: string; labels: string[]; rows: StackRow[] };
const docs = 'https://docs.datus.ai/dev/';
export const STACK_INTEGRATIONS: Record<Locale, StackCopy> = {
  en: {
    navigation: 'Integration categories',
    labels: ['Reads', 'Runs in', 'Produces'],
    rows: [
      { name: 'Models', vendors: ['OpenAI','Anthropic','Gemini','DeepSeek','Qwen','Ollama','Bedrock'].map(name=>({name,mode:'LLM endpoint'})).concat([{name:'BYO',mode:'Your endpoint'}]), read: 'Task prompts and permitted business context.', run: 'Your configured hosted or local model endpoint.', output: 'Model drafts, SQL and explanations.', guides: [{label:'Configure a model',href:docs+'configuration/agent/'}] },
      { name: 'Warehouses', vendors: ['Snowflake','BigQuery','Redshift','Postgres','DuckDB'].map(name=>({name,mode:'Adapter'})), read: 'Schemas, metadata and permitted query results.', run: 'SQL runs on the selected data source through its adapter.', output: 'SQL and query results for your workflow.', guides: [{label:'Connect a data source',href:docs+'configuration/datasources/'}] },
      { name: 'Modeling', vendors: [{name:'dbt',mode:'Manifest / SQL'},{name:'SQLMesh',mode:'SQL files'}], read: 'Project SQL and supported model definitions.', run: 'Datus Agent builds context; supported converters process model files.', output: 'Reviewable semantic models and conversion diagnostics.', guides: [{label:'Build semantic models',href:docs+'subagent/semantic_modeling/'},{label:'Convert a model',href:'/apache-ossie-converter/'}] },
      { name: 'Semantic layers', vendors: [{name:'Cube',mode:'Converter'},{name:'dbt Semantic Layer',mode:'Converter'},{name:'LookML',mode:'Model files'}], read: 'Metric definitions and model files supplied by your team.', run: 'Supported formats convert to Apache Ossie. DOSI compiles compatible models for your source.', output: 'Shared definitions, native SQL and metric results.', guides: [{label:'See supported conversion formats',href:'/apache-ossie-converter/'}] },
      { name: 'Catalogs', vendors: ['DataHub','OpenMetadata','Unity Catalog'].map(name=>({name,mode:'Metadata exports'})), read: 'Descriptions and metadata exported from your catalog.', run: 'Datus Agent uses the files you provide as business context.', output: 'Context for model review and source mappings.', guides: [{label:'Add context to a model',href:docs+'subagent/semantic_modeling/'}] },
      { name: 'BI', vendors: [{name:'Metabase',mode:'SQL files'},{name:'Superset',mode:'BI adapter'},{name:'Tableau',mode:'SQL files'}], read: 'Superset chart SQL, or SQL files supplied from other BI tools.', run: 'Datus Agent works against your configured data source.', output: 'SQL and results to use in existing BI workflows.', guides: [{label:'Connect a BI adapter',href:docs+'adapters/bi_adapters/'}] },
      { name: 'Orchestration', vendors: [{name:'Airflow',mode:'Plugin'},{name:'Dagster',mode:'Code files'},{name:'Prefect',mode:'Code files'}], read: 'Airflow DAGs, runs and logs; project files from other schedulers.', run: 'The Airflow plugin calls its REST API. Other code is reviewed as project context.', output: 'DAG analysis, code and configured Airflow operations.', guides: [{label:'Set up the Airflow plugin',href:docs+'plugin/airflow/'}] },
    ],
  },
  zh: {
    navigation: '集成类别',
    labels: ['读取内容', '执行位置', '输出内容'],
    rows: [
      { name:'模型', vendors:['OpenAI','Anthropic','Gemini','DeepSeek','Qwen','Ollama','Bedrock'].map(name=>({name,mode:'模型端点'})).concat([{name:'BYO',mode:'自定义端点'}]), read:'任务提示与获准使用的业务上下文。',run:'你配置的云端或本地模型端点。',output:'模型草稿、SQL 与解释。',guides:[{label:'配置模型',href:docs+'configuration/agent/'}]},
      { name:'数仓',vendors:['Snowflake','BigQuery','Redshift','Postgres','DuckDB'].map(name=>({name,mode:'适配器'})),read:'表结构、元数据与权限范围内的查询结果。',run:'通过适配器，在选定的数据源中执行 SQL。',output:'供后续工作使用的 SQL 与查询结果。',guides:[{label:'连接数据源',href:docs+'configuration/datasources/'}]},
      {name:'建模',vendors:[{name:'dbt',mode:'Manifest / SQL'},{name:'SQLMesh',mode:'SQL 文件'}],read:'项目中的 SQL 与受支持的模型定义。',run:'Datus Agent 构建上下文，转换工具处理支持格式的模型文件。',output:'可审核的语义模型与转换诊断。',guides:[{label:'构建语义模型',href:docs+'subagent/semantic_modeling/'},{label:'转换模型',href:'/apache-ossie-converter/'}]},
      {name:'语义层',vendors:[{name:'Cube',mode:'转换工具'},{name:'dbt Semantic Layer',mode:'转换工具'},{name:'LookML',mode:'模型文件'}],read:'团队提供的指标定义与模型文件。',run:'将支持的格式转换为 Apache Ossie，由 DOSI 为选定数据源编译兼容模型。',output:'共享定义、原生 SQL 与指标结果。',guides:[{label:'查看支持的转换格式',href:'/apache-ossie-converter/'}]},
      {name:'数据目录',vendors:['DataHub','OpenMetadata','Unity Catalog'].map(name=>({name,mode:'元数据导出'})),read:'从数据目录导出的描述与元数据。',run:'Datus Agent 将你提供的文件作为业务上下文。',output:'供模型审核与源数据映射使用的上下文。',guides:[{label:'为模型添加上下文',href:docs+'subagent/semantic_modeling/'}]},
      {name:'BI',vendors:[{name:'Metabase',mode:'SQL 文件'},{name:'Superset',mode:'BI 适配器'},{name:'Tableau',mode:'SQL 文件'}],read:'Superset 图表 SQL，或从其他 BI 工具提供的 SQL 文件。',run:'Datus Agent 使用你配置的数据源。',output:'可用于现有 BI 工作流程的 SQL 与结果。',guides:[{label:'连接 BI 适配器',href:docs+'adapters/bi_adapters/'}]},
      {name:'编排调度',vendors:[{name:'Airflow',mode:'插件'},{name:'Dagster',mode:'代码文件'},{name:'Prefect',mode:'代码文件'}],read:'Airflow DAG、运行记录与日志，以及其他调度工具的项目文件。',run:'Airflow 插件调用其 REST API，其他代码作为项目上下文供审核。',output:'DAG 分析、代码与已配置的 Airflow 操作。',guides:[{label:'配置 Airflow 插件',href:docs+'plugin/airflow/'}]},
    ],
  },
};
