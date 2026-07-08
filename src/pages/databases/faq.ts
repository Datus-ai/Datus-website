import type { FaqItem } from "../../components/FAQ";

// Page-specific FAQ for /databases/ — supported databases, installing adapters,
// custom drivers, access requirements. Content adapted from the datus-design
// databases template. Owned by this URL only; see datus-faq-spec.md.
export const databasesFaq: FaqItem[] = [
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
