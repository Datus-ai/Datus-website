import type { FaqItem } from "../../components/FAQ";
import type { Locale } from "../../i18n/config";

// Page-specific FAQ for /databases/ — supported databases, installing adapters,
// custom drivers, access requirements. Content adapted from the datus-design
// databases template. Owned by this URL only; see datus-faq-spec.md.
const EN: FaqItem[] = [
  {
    q: "Which databases does Datus support out of the box?",
    a: "Datus supports 11+ databases: SQLite, DuckDB, PostgreSQL, MySQL, Snowflake, StarRocks, ClickHouse, ClickZetta, Hive, Spark and Trino. SQLite and DuckDB are built in; the rest ship as installable adapters (datus-postgresql, datus-snowflake, and so on).",
  },
  {
    q: "How do I install a database adapter?",
    a: "Install the adapter package alongside the Datus CLI — for example, pip install datus-snowflake — then add a datasource block in your config with the connection details. The Database Adapters docs cover every option and connection string.",
  },
  {
    q: "Can I connect to a database not on this list?",
    a: "Yes. The adapter interface is open, so any database with a Python driver can be wrapped as a Datus adapter. Open an issue on GitHub or contribute a new adapter following the same pattern as datus-postgresql.",
  },
  {
    q: "Does the agent need read-write access to my warehouse?",
    a: "No. Datus works with read-only credentials for analytics use cases. Write access is only needed for pipeline deployment agents that materialize tables or models.",
  },
  {
    q: "Which adapters were added in v0.2.6?",
    a: "v0.2.6 added Hive, Spark, ClickHouse and Trino, bringing native support for the lake / distributed and columnar OLAP tiers alongside the existing relational and cloud-warehouse adapters.",
  },
];

const ZH: FaqItem[] = [
  {
    q: "Datus 开箱支持哪些数据库？",
    a: "Datus 支持 11 种以上数据库：SQLite、DuckDB、PostgreSQL、MySQL、Snowflake、StarRocks、ClickHouse、ClickZetta、Hive、Spark 和 Trino。其中 SQLite 与 DuckDB 是内置的，其余以可安装适配器的形式提供（datus-postgresql、datus-snowflake 等）。",
  },
  {
    q: "怎么安装数据库适配器？",
    a: "在装好 Datus CLI 之后再安装对应的适配器包——例如 pip install datus-snowflake——然后在配置里加一个带连接信息的 datasource 块。所有可选项和连接串写法都在 Database Adapters 文档里。",
  },
  {
    q: "能连列表之外的数据库吗？",
    a: "可以。适配器接口是开放的，任何有 Python 驱动的数据库都能包装成 Datus 适配器。你可以在 GitHub 上提 issue，也可以照着 datus-postgresql 的模式贡献一个新适配器。",
  },
  {
    q: "Agent 需要对我的数仓有读写权限吗？",
    a: "不需要。分析类场景下，Datus 用只读凭据就能工作。只有需要物化表或模型的管道部署 Agent 才需要写权限。",
  },
  {
    q: "v0.2.6 新增了哪些适配器？",
    a: "v0.2.6 新增了 Hive、Spark、ClickHouse 与 Trino，在原有的关系型和云数仓适配器之外，补齐了对湖 / 分布式以及列式 OLAP 这两层的原生支持。",
  },
];

export const databasesFaq: Record<Locale, FaqItem[]> = { en: EN, zh: ZH };
