// Single source of truth for the /glossary page AND its JSON-LD structured data.
// Definitions are kept verbatim in sync with https://datus.lovable.app/glossary.

export interface GlossaryTerm {
  term: string;
  slug: string;
  definition: string;
  /** Optional link to a full glossary article for this term. */
  article?: string;
}

export interface GlossaryCategory {
  name: string;
  id: string;
  terms: GlossaryTerm[];
}

export const GLOSSARY_UPDATED = "June 2026";

export const glossary: GlossaryCategory[] = [
  {
    name: "Architecture",
    id: "architecture",
    terms: [
      {
        term: "Data Warehouse",
        slug: "data-warehouse",
        definition:
          "A central, query-optimized store for structured analytical data. Schema is defined up front and data is loaded in cleaned form for BI and reporting.",
        article: "/blog/what-is-data-warehouse/",
      },
      {
        term: "Data Lake",
        slug: "data-lake",
        definition:
          "Object storage that holds raw files — JSON, CSV, Parquet, logs — in their original form. Cheap and flexible, but requires discipline to stay queryable.",
        article: "/blog/what-is-data-lake/",
      },
      {
        term: "Lakehouse",
        slug: "lakehouse",
        definition:
          "A hybrid that puts warehouse-style table semantics (ACID, schema, time travel) directly on top of a data lake via open formats like Iceberg, Delta, or Hudi.",
        article: "/blog/what-is-lakehouse/",
      },
      {
        term: "Data Mesh",
        slug: "data-mesh",
        definition:
          "An organizational pattern where domain teams own their data as products, instead of a central team owning one monolithic warehouse.",
        article: "/blog/what-is-data-mesh/",
      },
      {
        term: "Data Fabric",
        slug: "data-fabric",
        definition:
          "A metadata-driven layer that stitches together distributed data sources so they can be queried and governed as if they were one system.",
      },
      {
        term: "Medallion Architecture",
        slug: "medallion-architecture",
        definition:
          "A layered convention — Bronze (raw), Silver (cleaned), Gold (aggregated) — popularized by Databricks for incrementally refining lakehouse data.",
      },
      {
        term: "Lambda vs Kappa",
        slug: "lambda-vs-kappa",
        definition:
          "Two streaming architectures. Lambda runs batch and streaming pipelines in parallel; Kappa treats everything as a single streaming pipeline and replays history when needed.",
      },
    ],
  },
  {
    name: "Modeling",
    id: "modeling",
    terms: [
      {
        term: "Semantic Layer",
        slug: "semantic-layer",
        definition:
          "A shared definition of business entities and metrics (revenue, active user, churn) that sits between raw tables and consumers. Ensures every dashboard, notebook, and AI agent computes the same number the same way.",
        article: "/blog/what-is-semantic-layer/",
      },
      {
        term: "Metric Layer",
        slug: "metric-layer",
        definition:
          "A narrower form of the semantic layer focused specifically on metric definitions — typically expressed in YAML or a DSL like MetricFlow or Cube.",
        article: "/blog/what-is-metric-layer/",
      },
      {
        term: "Dimensional Modeling",
        slug: "dimensional-modeling",
        definition:
          "Kimball-style design that splits data into fact tables (events, measurements) and dimension tables (who/what/where). Star and snowflake schemas are its two main shapes.",
      },
      {
        term: "Star Schema",
        slug: "star-schema",
        definition:
          "A fact table surrounded by denormalized dimension tables. Simple, fast for BI, and the most common warehouse layout.",
      },
      {
        term: "Slowly Changing Dimensions",
        slug: "slowly-changing-dimensions",
        definition:
          "Patterns for tracking how dimension values change over time. Type 1 overwrites, Type 2 keeps history with valid-from/valid-to columns, Type 3 keeps a previous-value column.",
      },
      {
        term: "One Big Table (OBT)",
        slug: "one-big-table",
        definition:
          "A modeling style that pre-joins facts and dimensions into a single wide table. Trades storage and flexibility for query simplicity and speed on columnar engines.",
      },
      {
        term: "Data Vault",
        slug: "data-vault",
        definition:
          "A modeling approach using hubs (business keys), links (relationships), and satellites (descriptive attributes). Optimized for auditability and frequent schema change.",
      },
    ],
  },
  {
    name: "Storage & Formats",
    id: "storage-formats",
    terms: [
      {
        term: "Columnar Storage",
        slug: "columnar-storage",
        definition:
          "Storing data by column instead of by row, so analytical queries that touch a few fields over millions of rows only read what they need.",
      },
      {
        term: "Parquet",
        slug: "parquet",
        definition:
          "An open columnar file format with compression and predicate pushdown. The de facto interchange format between warehouses, lakes, and processing engines.",
      },
      {
        term: "Apache Iceberg",
        slug: "apache-iceberg",
        definition:
          "An open table format that adds schema evolution, hidden partitioning, and snapshot isolation on top of Parquet files in object storage.",
      },
      {
        term: "Delta Lake",
        slug: "delta-lake",
        definition:
          "A table format from Databricks that layers an ACID transaction log on Parquet, enabling MERGE, time travel, and streaming reads on a data lake.",
      },
      {
        term: "Apache Hudi",
        slug: "apache-hudi",
        definition:
          "An open table format focused on upserts and incremental processing — designed for use cases where records change frequently after they land.",
      },
      {
        term: "OLAP vs OLTP",
        slug: "olap-vs-oltp",
        definition:
          "OLTP systems (Postgres, MySQL) optimize for many small reads and writes from applications. OLAP systems (Snowflake, ClickHouse, BigQuery) optimize for large scans and aggregations across history.",
      },
    ],
  },
  {
    name: "Processing",
    id: "processing",
    terms: [
      {
        term: "ETL vs ELT",
        slug: "etl-vs-elt",
        definition:
          "ETL transforms data before loading it into the warehouse; ELT loads raw data first and transforms it inside the warehouse using SQL. ELT dominates the modern stack thanks to cheap warehouse compute.",
      },
      {
        term: "Batch vs Streaming",
        slug: "batch-vs-streaming",
        definition:
          "Batch jobs run on a schedule over a chunk of data; streaming jobs process events continuously as they arrive. Most platforms now mix both.",
      },
      {
        term: "Change Data Capture (CDC)",
        slug: "change-data-capture",
        definition:
          "Streaming row-level inserts, updates, and deletes out of an operational database in near real time, usually by reading its transaction log.",
      },
      {
        term: "Backfill",
        slug: "backfill",
        definition:
          "Re-running a pipeline over historical data — typically after a logic change, a schema fix, or to populate a new column for past dates.",
      },
      {
        term: "Idempotency",
        slug: "idempotency",
        definition:
          "A property of a pipeline step where running it twice produces the same result as running it once. Critical for safe retries and backfills.",
      },
      {
        term: "Materialized View",
        slug: "materialized-view",
        definition:
          "A query whose result is physically stored and kept fresh by the engine. Speeds up repeated reads at the cost of storage and write overhead.",
      },
      {
        term: "dbt",
        slug: "dbt",
        definition:
          "A framework for defining transformations as version-controlled SQL models that run inside the warehouse. Now the standard for the T in ELT.",
      },
    ],
  },
  {
    name: "Governance & Quality",
    id: "governance-quality",
    terms: [
      {
        term: "Data Catalog",
        slug: "data-catalog",
        definition:
          "A searchable inventory of tables, columns, owners, and documentation across the data platform. Answers “what data do we have and where does it live?”",
      },
      {
        term: "Data Contract",
        slug: "data-contract",
        definition:
          "A machine-checked agreement between a data producer and its consumers, specifying schema, semantics, freshness, and ownership of a dataset.",
      },
      {
        term: "Data Lineage",
        slug: "data-lineage",
        definition:
          "The graph of how data flows from source systems through transformations to final tables and dashboards. Used for impact analysis and debugging.",
      },
      {
        term: "PII & Data Masking",
        slug: "pii-data-masking",
        definition:
          "Personally Identifiable Information — names, emails, IDs — that must be protected. Masking replaces or hashes these values so analysts can work safely.",
      },
      {
        term: "RBAC",
        slug: "rbac",
        definition:
          "Role-Based Access Control. Permissions are granted to roles (analyst, engineer, exec) and users inherit access by being assigned a role.",
      },
      {
        term: "Data Quality",
        slug: "data-quality",
        definition:
          "The set of checks — freshness, completeness, uniqueness, validity, distribution — that confirm a table is fit to use before it powers a decision.",
      },
    ],
  },
  {
    name: "AI & Agents",
    id: "ai-agents",
    terms: [
      {
        term: "Text-to-SQL",
        slug: "text-to-sql",
        definition:
          "Generating SQL from a natural-language question grounded in a real schema. Quality depends heavily on schema linking, business context, and feedback loops.",
      },
      {
        term: "Schema Linking",
        slug: "schema-linking",
        definition:
          "The step where the model figures out which tables and columns a question is actually about, before any SQL is written. Often the single biggest accuracy lever.",
      },
      {
        term: "Retrieval-Augmented Generation (RAG)",
        slug: "retrieval-augmented-generation",
        definition:
          "Pulling relevant context — table docs, prior queries, glossary entries — into the model's prompt at query time, instead of relying on what it memorized during training.",
      },
      {
        term: "Model Context Protocol (MCP)",
        slug: "model-context-protocol",
        definition:
          "An open protocol for exposing tools, data, and context to LLM clients like Claude, Cursor, and IDEs. Lets one server power many AI front ends.",
      },
      {
        term: "Embedding",
        slug: "embedding",
        definition:
          "A numerical vector representation of text (or a table, or a query) that places semantically similar items near each other. The backbone of vector search.",
      },
      {
        term: "Vector Search",
        slug: "vector-search",
        definition:
          "Finding the items whose embeddings are closest to a query embedding. Used to retrieve relevant tables, examples, and documentation for AI agents.",
      },
      {
        term: "Data Engineering Agent",
        slug: "data-engineering-agent",
        definition:
          "An LLM-driven system that plans and executes data workflows end-to-end — schema discovery, SQL generation, validation, and iteration — instead of just autocompleting a single query.",
      },
    ],
  },
  {
    name: "Observability",
    id: "observability",
    terms: [
      {
        term: "Data Observability",
        slug: "data-observability",
        definition:
          "Continuous monitoring of the health of tables and pipelines across five pillars: freshness, volume, schema, distribution, and lineage.",
      },
      {
        term: "Freshness",
        slug: "freshness",
        definition:
          "How recently a table was updated relative to its expected cadence. A daily table that hasn't moved in 36 hours is a freshness incident.",
      },
      {
        term: "Volume Checks",
        slug: "volume-checks",
        definition:
          "Alerts when a table's row count for a period falls far outside its historical range — usually the first sign that an upstream job partially failed.",
      },
      {
        term: "Schema Drift",
        slug: "schema-drift",
        definition:
          "An unannounced change to a column's type, name, or presence. Often breaks downstream models silently until someone reads a NULL chart.",
      },
      {
        term: "Anomaly Detection",
        slug: "anomaly-detection",
        definition:
          "Statistical or ML-based checks that flag unexpected shifts in a metric or distribution, instead of relying on hand-written thresholds.",
      },
      {
        term: "Data SLA / SLO",
        slug: "data-sla-slo",
        definition:
          "An explicit promise about a dataset — e.g. “this table is fresh by 6am UTC 99% of days.” Borrowed from software reliability practice.",
      },
    ],
  },
];

// Flat list of all terms (used for JSON-LD and counts).
export const allTerms: GlossaryTerm[] = glossary.flatMap((c) => c.terms);
