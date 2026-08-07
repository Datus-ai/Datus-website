// Chinese overlay for the glossary. Keyed by the English data's `id` (category)
// and `slug` (term) so the two files can never drift apart structurally — only
// the prose is duplicated, and `glossaryFor()` fails loudly if a key is missing.
//
// Anchors (`#slug`) are shared with English by design: /glossary/ and
// /zh/glossary/ are the same document in two languages, so a deep link works in
// both. Established English terms (Parquet, RAG, MCP…) stay in English with the
// Chinese reading alongside where one is in common use.

export const GLOSSARY_UPDATED_ZH = "2026 年 6 月";

export const CATEGORY_NAMES_ZH: Record<string, string> = {
  architecture: "架构",
  modeling: "建模",
  "storage-formats": "存储与格式",
  processing: "处理",
  "governance-quality": "治理与质量",
  "ai-agents": "AI 与 Agent",
  observability: "可观测性",
};

export const TERMS_ZH: Record<string, { term: string; definition: string }> = {
  /* ── Architecture ── */
  "data-warehouse": {
    term: "数据仓库 (Data Warehouse)",
    definition:
      "面向结构化分析数据的中心化、查询优化存储。Schema 先定义好，数据以清洗后的形态载入，供 BI 与报表使用。",
  },
  "data-lake": {
    term: "数据湖 (Data Lake)",
    definition:
      "以原始形态存放文件（JSON、CSV、Parquet、日志）的对象存储。便宜且灵活，但需要纪律才能保持可查询。",
  },
  lakehouse: {
    term: "湖仓 (Lakehouse)",
    definition:
      "一种混合形态：借助 Iceberg、Delta、Hudi 等开放格式，直接在数据湖之上提供数仓级的表语义（ACID、Schema、时间旅行）。",
  },
  "data-mesh": {
    term: "数据网格 (Data Mesh)",
    definition:
      "一种组织模式：由业务域团队把自己的数据当作产品来负责，而不是由中心团队独揽一个庞大的单体数仓。",
  },
  "data-fabric": {
    term: "数据编织 (Data Fabric)",
    definition:
      "由元数据驱动的一层，把分散的数据源缝合起来，使它们可以像同一个系统那样被查询和治理。",
  },
  "medallion-architecture": {
    term: "奖章架构 (Medallion Architecture)",
    definition:
      "由 Databricks 推广的分层约定——Bronze（原始）、Silver（清洗）、Gold（聚合）——用于逐层提炼湖仓数据。",
  },
  "lambda-vs-kappa": {
    term: "Lambda 与 Kappa",
    definition:
      "两种流式架构。Lambda 并行跑批处理与流处理两条管道；Kappa 把一切都当作一条流式管道，需要时回放历史数据。",
  },

  /* ── Modeling ── */
  "semantic-layer": {
    term: "语义层 (Semantic Layer)",
    definition:
      "位于原始表与消费方之间、对业务实体与指标（营收、活跃用户、流失）的共享定义。它保证每个看板、Notebook 和 AI Agent 用同一种方式算出同一个数。",
  },
  "metric-layer": {
    term: "指标层 (Metric Layer)",
    definition:
      "语义层中更窄的一种形态，专注于指标定义——通常用 YAML 或 MetricFlow、Cube 这类 DSL 表达。",
  },
  "dimensional-modeling": {
    term: "维度建模 (Dimensional Modeling)",
    definition:
      "Kimball 风格的设计，把数据拆成事实表（事件、度量）与维度表（谁/什么/在哪）。星型和雪花型是它最主要的两种形态。",
  },
  "star-schema": {
    term: "星型模型 (Star Schema)",
    definition:
      "一张事实表被若干反范式的维度表环绕。结构简单、BI 查询快，是最常见的数仓布局。",
  },
  "slowly-changing-dimensions": {
    term: "缓慢变化维 (SCD)",
    definition:
      "追踪维度值随时间变化的几种模式。Type 1 直接覆盖，Type 2 用 valid-from / valid-to 列保留历史，Type 3 保留一列前值。",
  },
  "one-big-table": {
    term: "一张大宽表 (OBT)",
    definition:
      "把事实与维度预先 join 成一张宽表的建模风格。用存储和灵活性换取查询的简单与列式引擎上的速度。",
  },
  "data-vault": {
    term: "Data Vault",
    definition:
      "使用 hub（业务键）、link（关系）与 satellite（描述属性）的建模方法。针对可审计性与频繁的 Schema 变更做了优化。",
  },

  /* ── Storage & Formats ── */
  "columnar-storage": {
    term: "列式存储 (Columnar Storage)",
    definition:
      "按列而非按行存放数据，使得只涉及少数字段、却要扫过千万行的分析查询只读它真正需要的部分。",
  },
  parquet: {
    term: "Parquet",
    definition:
      "带压缩与谓词下推的开放列式文件格式。事实上已成为数仓、数据湖与计算引擎之间的交换格式。",
  },
  "apache-iceberg": {
    term: "Apache Iceberg",
    definition:
      "一种开放表格式，在对象存储中的 Parquet 文件之上补充了 Schema 演进、隐藏分区与快照隔离。",
  },
  "delta-lake": {
    term: "Delta Lake",
    definition:
      "Databricks 推出的表格式，在 Parquet 之上叠加 ACID 事务日志，让数据湖也能做 MERGE、时间旅行与流式读取。",
  },
  "apache-hudi": {
    term: "Apache Hudi",
    definition:
      "一种聚焦 upsert 与增量处理的开放表格式——专为记录落库之后仍会频繁变更的场景设计。",
  },
  "lakehouse-catalog": {
    term: "湖仓目录 (Lakehouse Catalog)",
    definition:
      "面向引擎的元数据服务，把表名映射到它的 Schema 与文件位置，让查询引擎能在湖仓上跑 SQL。实现包括 Hive Metastore、AWS Glue、Databricks Unity Catalog、Apache Polaris 与 Snowflake Horizon。",
  },
  "olap-vs-oltp": {
    term: "OLAP 与 OLTP",
    definition:
      "OLTP 系统（Postgres、MySQL）为应用侧大量小规模读写做优化；OLAP 系统（Snowflake、ClickHouse、BigQuery）则为跨历史数据的大扫描与聚合做优化。",
  },

  /* ── Processing ── */
  "etl-vs-elt": {
    term: "ETL 与 ELT",
    definition:
      "ETL 在载入数仓之前先做转换；ELT 先把原始数据装进数仓，再用 SQL 在数仓内部转换。得益于便宜的数仓算力，ELT 已是现代数据栈的主流。",
  },
  "batch-vs-streaming": {
    term: "批处理与流处理",
    definition:
      "批处理作业按调度对一批数据运行；流处理作业在事件到达时持续处理。如今大多数平台两者混用。",
  },
  "change-data-capture": {
    term: "变更数据捕获 (CDC)",
    definition:
      "近实时地把业务数据库中的行级插入、更新与删除流式导出，通常通过读取它的事务日志实现。",
  },
  backfill: {
    term: "回补 (Backfill)",
    definition:
      "对历史数据重跑一遍管道——通常发生在逻辑变更、Schema 修复之后，或者为过去的日期补上一个新列。",
  },
  idempotency: {
    term: "幂等性 (Idempotency)",
    definition:
      "管道某一步的性质：跑两次和跑一次结果相同。这是安全重试与回补的前提。",
  },
  "materialized-view": {
    term: "物化视图 (Materialized View)",
    definition:
      "结果被物理存下来、并由引擎负责保持新鲜的查询。以存储与写入开销换取重复读取的速度。",
  },
  dbt: {
    term: "dbt",
    definition:
      "把转换逻辑定义成受版本管理的 SQL 模型、并在数仓内部执行的框架。如今已是 ELT 中 T 的事实标准。",
  },

  /* ── Governance & Quality ── */
  "data-catalog": {
    term: "数据目录 (Data Catalog)",
    definition:
      "覆盖整个数据平台的可检索清单，包含表、列、负责人与文档。它回答的是「我们有哪些数据、它们在哪」。",
  },
  "data-contract": {
    term: "数据契约 (Data Contract)",
    definition:
      "数据生产方与消费方之间可被机器校验的约定，规定某个数据集的 Schema、语义、新鲜度与归属。",
  },
  "data-lineage": {
    term: "数据血缘 (Data Lineage)",
    definition:
      "数据从源系统经过各层转换、最终流向表与看板的关系图。用于影响面分析与排障。",
  },
  "pii-data-masking": {
    term: "PII 与数据脱敏",
    definition:
      "个人可识别信息——姓名、邮箱、身份标识——必须受到保护。脱敏会替换或哈希这些值，让分析师可以安全地工作。",
  },
  rbac: {
    term: "RBAC（基于角色的访问控制）",
    definition:
      "权限授予角色（分析师、工程师、高管），用户通过被分配角色来继承访问权限。",
  },
  "data-quality": {
    term: "数据质量 (Data Quality)",
    definition:
      "在一张表被用于决策之前，确认它可用的一组检查——新鲜度、完整性、唯一性、有效性与分布。",
  },

  /* ── AI & Agents ── */
  "text-to-sql": {
    term: "Text-to-SQL",
    definition:
      "基于真实 Schema，把自然语言问题生成为 SQL。效果高度依赖 Schema Linking、业务上下文与反馈闭环。",
  },
  "schema-linking": {
    term: "Schema Linking",
    definition:
      "在写任何 SQL 之前，模型判断这个问题究竟涉及哪些表和列的那一步。往往是准确率最大的一个杠杆。",
  },
  "retrieval-augmented-generation": {
    term: "检索增强生成 (RAG)",
    definition:
      "在查询时把相关上下文——表文档、历史查询、术语条目——拉进模型的提示词，而不是依赖它训练时记住的东西。",
  },
  "model-context-protocol": {
    term: "Model Context Protocol (MCP)",
    definition:
      "一份开放协议，用于把工具、数据与上下文暴露给 Claude、Cursor、IDE 等大模型客户端。一个服务端即可为多个 AI 前端供能。",
  },
  embedding: {
    term: "Embedding",
    definition:
      "文本（或一张表、一条查询）的数值向量表示，让语义相近的条目彼此靠近。这是向量检索的骨架。",
  },
  "vector-search": {
    term: "向量检索 (Vector Search)",
    definition:
      "找出 Embedding 与查询 Embedding 最接近的那些条目。用于为 AI Agent 召回相关的表、示例与文档。",
  },
  "data-engineering-agent": {
    term: "数据工程 Agent",
    definition:
      "由大模型驱动、端到端规划并执行数据工作流的系统——Schema 发现、SQL 生成、校验与迭代——而不只是补全一条查询。",
  },

  /* ── Observability ── */
  "data-observability": {
    term: "数据可观测性 (Data Observability)",
    definition:
      "围绕五大支柱持续监控表与管道的健康度：新鲜度、数据量、Schema、分布与血缘。",
  },
  freshness: {
    term: "新鲜度 (Freshness)",
    definition:
      "相对于预期节奏，一张表最近一次更新是什么时候。一张日更表 36 小时没动，就是一次新鲜度事故。",
  },
  "volume-checks": {
    term: "数据量检查 (Volume Checks)",
    definition:
      "当某个周期内的行数远远偏离历史区间时告警——通常这是上游作业部分失败的第一个信号。",
  },
  "schema-drift": {
    term: "Schema 漂移 (Schema Drift)",
    definition:
      "列的类型、名称或存在与否发生了未经通知的变更。往往会悄悄搞坏下游模型，直到有人看到一张全是 NULL 的图。",
  },
  "anomaly-detection": {
    term: "异常检测 (Anomaly Detection)",
    definition:
      "基于统计或机器学习的检查，用来发现指标或分布上的异常波动，而不是依赖手写的阈值。",
  },
  "data-sla-slo": {
    term: "数据 SLA / SLO",
    definition:
      "对某个数据集做出的明确承诺——例如「这张表 99% 的日子会在 UTC 早上 6 点前就绪」。这一实践借鉴自软件可靠性工程。",
  },
};
