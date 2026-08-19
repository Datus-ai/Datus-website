import type { Locale } from "../../i18n/config";

export const DB_ADAPTERS_DOCS = "https://docs.datus.ai/database-adapters/";

/* -------------------------------------------------------------------------- */
/*  Content — ported from the datus-design /databases template.               */
/* -------------------------------------------------------------------------- */

export type DbEntry = {
  name: string;
  type: string;
  pkg: string;
  builtIn: boolean;
  since?: string;
  /** Accent override; unset means the decorative cyan/amber/green/pink rotation. */
  tone?: string;
  highlight: string;
};

export interface DatabasesCopy {
  hero: { eyebrow: string; heading: string; lead: string };
  builtIn: string;
  databases: DbEntry[];
  categoriesSection: { eyebrow: string; title: string; lead: string };
  categories: { title: string; body: string }[];
  table: { columns: [string, string, string, string]; docsPrefix: string; docsLabel: string; docsSuffix: string };
  migration: { eyebrow: string; heading: string; lead: string };
  config: { eyebrow: string; title: string; lead: string };
  faqLead: string;
  closing: { heading: string; lead: string; docsCta: string; modelsCta: string; contributeCta: string };
}

// Adapter type strings and package names are identifiers — never translated.
const ADAPTER_META = [
  { name: "SQLite", type: "sqlite", builtIn: true },
  { name: "DuckDB", type: "duckdb", builtIn: true },
  { name: "PostgreSQL", type: "postgresql", pkg: "datus-postgresql", builtIn: false },
  { name: "MySQL", type: "mysql", pkg: "datus-mysql", builtIn: false },
  { name: "Snowflake", type: "snowflake", pkg: "datus-snowflake", builtIn: false },
  { name: "StarRocks", type: "starrocks", pkg: "datus-starrocks", builtIn: false },
  // Amber to match StarRocks — same Cloud Warehouse tier. The positional
  // rotation would land Doris on green, which reads as Lake & Distributed.
  { name: "Apache Doris", type: "doris", pkg: "datus-doris", builtIn: false, tone: "var(--term-amber)" },
  { name: "ClickHouse", type: "clickhouse", pkg: "datus-clickhouse", builtIn: false, since: "v0.2.6" },
  { name: "ClickZetta", type: "clickzetta", pkg: "datus-clickzetta", builtIn: false },
  { name: "Hive", type: "hive", pkg: "datus-hive", builtIn: false, since: "v0.2.6" },
  { name: "Spark", type: "spark", pkg: "datus-spark", builtIn: false, since: "v0.2.6" },
  { name: "Trino", type: "trino", pkg: "datus-trino", builtIn: false, since: "v0.2.6" },
] as const;

/** Join the fixed adapter metadata with the localized one-line highlights. */
function databaseList(builtInLabel: string, highlights: string[]): DbEntry[] {
  return ADAPTER_META.map((m, i) => ({
    name: m.name,
    type: m.type,
    pkg: "pkg" in m ? m.pkg : builtInLabel,
    builtIn: m.builtIn,
    since: "since" in m ? m.since : undefined,
    tone: "tone" in m ? m.tone : undefined,
    highlight: highlights[i],
  }));
}

export const migrationExample = `# datus-agent generates layout hints per target:

# StarRocks
CREATE TABLE orders_agg (
  user_id BIGINT,
  order_day DATE,
  gmv DECIMAL(18,2)
)
DUPLICATE KEY(user_id, order_day)
DISTRIBUTED BY HASH(user_id) BUCKETS 16;

# ClickHouse
CREATE TABLE orders_agg (
  user_id UInt64,
  order_day Date,
  gmv Decimal(18,2)
)
ENGINE = MergeTree
ORDER BY (user_id, order_day);`;

export const datasourceYaml = `agent:
  service:
    databases:
      production:                 # Snowflake
        type: snowflake
        account: \${SNOWFLAKE_ACCOUNT}
        username: \${SNOWFLAKE_USER}
        password: \${SNOWFLAKE_PASSWORD}
        warehouse: \${SNOWFLAKE_WAREHOUSE}
        database: \${SNOWFLAKE_DATABASE}

      analytics:                  # PostgreSQL
        type: postgresql
        host: \${PG_HOST}
        port: 5432
        username: \${PG_USER}
        password: \${PG_PASSWORD}
        database: mydb
        schema: public

      local_demo:                 # DuckDB
        type: duckdb
        uri: ./data/demo.duckdb
        default: true

      bird_benchmark:             # SQLite (glob multi-file)
        type: sqlite
        path_pattern: benchmark/bird/**/*.sqlite`;

const EN: DatabasesCopy = {
  hero: {
    eyebrow: "Databases",
    heading: "Supported Databases",
    lead: "Twelve native database adapters, from embedded SQLite and DuckDB to cloud warehouses (Snowflake, StarRocks, Apache Doris, ClickZetta) and lake engines (Hive, Spark, Trino, ClickHouse). All plug in via Python entry points — no adapter code required on your side.",
  },
  builtIn: "Built-in",
  databases: databaseList("Built-in", [
    "Zero-config file store — perfect for demos and tests.",
    "Embedded OLAP for local analytics on Parquet / CSV.",
    "Six SSL modes, multi-schema, materialized views.",
    "INFORMATION_SCHEMA + SHOW CREATE for rich metadata.",
    "Native SDK with Arrow transport for fast reads.",
    "Multi-catalog + materialized views, MySQL-wire.",
    "Lakehousing, materialized views and hybrid search.",
    "HTTP protocol; database ≡ schema, lightweight DELETE.",
    "Workspace + Volume/Stage ops; lakehouse partner.",
    "HiveServer2 / Thrift with LDAP & Kerberos auth.",
    "Spark Thrift Server; NONE / PLAIN / Kerberos auth.",
    "Cross-catalog queries over HTTP/HTTPS SSL.",
  ]),
  categoriesSection: {
    eyebrow: "One interface",
    title: "Four Categories, one interface",
    lead: "Every adapter implements the same CRUD, DDL, metadata and sampling contract — so subagents work identically across your OLTP, warehouse and lake engines.",
  },
  categories: [
    { title: "Relational", body: "PostgreSQL, MySQL — the classic OLTP stack with rich metadata endpoints." },
    { title: "Cloud Warehouse", body: "Snowflake, StarRocks, Apache Doris, ClickZetta — MPP engines with catalog + workspace models." },
    { title: "Lake & Distributed", body: "Hive, Spark, Trino — Thrift and HTTP engines over your data lake." },
    { title: "Analytical & Embedded", body: "DuckDB, ClickHouse, SQLite — from local files to columnar OLAP." },
  ],
  table: {
    columns: ["Database", "Type", "Package", "Highlight"],
    docsPrefix: "See the ",
    docsLabel: "Database Adapters documentation",
    docsSuffix: " for configuration, connection strings, and advanced options.",
  },
  migration: {
    eyebrow: "Migration",
    heading: "Cross-database Migration hints",
    lead: "Every adapter implements MigrationTargetMixin so subagents can generate DDL for the target dialect, propose OLAP-friendly layouts, and validate the result with a dry-run.",
  },
  config: {
    eyebrow: "Configuration",
    title: "Drop-in datasource config",
    lead: "One YAML file wires every warehouse. Environment variables keep credentials out of source control.",
  },
  faqLead: "Supported databases, installing adapters, custom drivers, and access requirements.",
  closing: {
    heading: "Connect Your Warehouse in Minutes",
    lead: "Native adapters for Snowflake, Postgres, MySQL and more — drop in credentials and the agent starts reasoning over your real schema.",
    docsCta: "Database Adapters docs",
    modelsCta: "Explore models",
    contributeCta: "Contribute an adapter",
  },
};

const ZH: DatabasesCopy = {
  hero: {
    eyebrow: "数据库",
    heading: "支持的数据库",
    lead: "十二个原生数据库适配器，从嵌入式的 SQLite、DuckDB，到云数仓（Snowflake、StarRocks、Apache Doris、ClickZetta），再到湖上引擎（Hive、Spark、Trino、ClickHouse）。全部通过 Python entry points 接入——你这边不用写任何适配器代码。",
  },
  builtIn: "内置",
  databases: databaseList("内置", [
    "零配置的文件型存储——做演示和测试再合适不过。",
    "嵌入式 OLAP，在本地直接分析 Parquet / CSV。",
    "六种 SSL 模式，支持多 schema 与物化视图。",
    "通过 INFORMATION_SCHEMA + SHOW CREATE 获取丰富元数据。",
    "原生 SDK 配合 Arrow 传输，读取更快。",
    "多 catalog + 物化视图，走 MySQL 协议。",
    "湖仓一体、物化视图与混合检索。",
    "HTTP 协议；database 等同 schema，支持轻量 DELETE。",
    "工作空间 + Volume/Stage 操作；湖仓生态伙伴。",
    "HiveServer2 / Thrift，支持 LDAP 与 Kerberos 认证。",
    "Spark Thrift Server；支持 NONE / PLAIN / Kerberos 认证。",
    "通过 HTTP/HTTPS SSL 做跨 catalog 查询。",
  ]),
  categoriesSection: {
    eyebrow: "统一接口",
    title: "四类引擎，一套接口",
    lead: "每个适配器都实现同一套 CRUD、DDL、元数据与采样契约——所以子代理在你的 OLTP、数仓和湖上引擎之间表现完全一致。",
  },
  categories: [
    { title: "关系型", body: "PostgreSQL、MySQL——经典 OLTP 组合，元数据接口丰富。" },
    { title: "云数仓", body: "Snowflake、StarRocks、Apache Doris、ClickZetta——带 catalog 与工作空间模型的 MPP 引擎。" },
    { title: "湖与分布式", body: "Hive、Spark、Trino——架在数据湖之上的 Thrift 与 HTTP 引擎。" },
    { title: "分析型与嵌入式", body: "DuckDB、ClickHouse、SQLite——从本地文件到列式 OLAP。" },
  ],
  table: {
    columns: ["数据库", "类型", "安装包", "特点"],
    docsPrefix: "配置方式、连接串与高级选项，详见",
    docsLabel: "Database Adapters 文档",
    docsSuffix: "。",
  },
  migration: {
    eyebrow: "迁移",
    heading: "跨数据库迁移提示",
    lead: "每个适配器都实现了 MigrationTargetMixin，因此子代理可以为目标方言生成 DDL、给出对 OLAP 友好的表结构建议，并用 dry-run 校验结果。",
  },
  config: {
    eyebrow: "配置",
    title: "开箱即用的数据源配置",
    lead: "一份 YAML 接上所有数仓。用环境变量把凭据挡在代码仓库之外。",
  },
  faqLead: "支持的数据库、适配器安装、自定义驱动，以及权限要求。",
  closing: {
    heading: "几分钟接上你的数仓",
    lead: "Snowflake、Postgres、MySQL 等都有原生适配器——填上凭据，Agent 就能基于你真实的表结构开始推理。",
    docsCta: "Database Adapters 文档",
    modelsCta: "了解支持的模型",
    contributeCta: "贡献一个适配器",
  },
};

export const databasesPage: Record<Locale, DatabasesCopy> = { en: EN, zh: ZH };
