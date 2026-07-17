import { ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import SiteLayout from "../../components/SiteLayout";
import Breadcrumb from "../../components/Breadcrumb";
import FAQ from "../../components/FAQ";
import { DOCS_URL, GITHUB_URL } from "../../config/nav";
import {
  CatalogSection,
  CodeBlock,
  FeatureCard,
  InlineCode,
  SectionHead,
  SpecCard,
  SpecTable,
  TagRow,
  toneAt,
} from "../../components/catalog";
import { databasesFaq } from "./faq";

const DB_ADAPTERS_DOCS = "https://docs.datus.ai/database-adapters/";

/* -------------------------------------------------------------------------- */
/*  Content — ported from the datus-design /databases template.               */
/* -------------------------------------------------------------------------- */

type DbEntry = {
  name: string;
  type: string;
  pkg: string;
  builtIn: boolean;
  since?: string;
  highlight: string;
};

const databases: DbEntry[] = [
  { name: "SQLite", type: "sqlite", pkg: "Built-in", builtIn: true, highlight: "Zero-config file store — perfect for demos and tests." },
  { name: "DuckDB", type: "duckdb", pkg: "Built-in", builtIn: true, highlight: "Embedded OLAP for local analytics on Parquet / CSV." },
  { name: "PostgreSQL", type: "postgresql", pkg: "datus-postgresql", builtIn: false, highlight: "Six SSL modes, multi-schema, materialized views." },
  { name: "MySQL", type: "mysql", pkg: "datus-mysql", builtIn: false, highlight: "INFORMATION_SCHEMA + SHOW CREATE for rich metadata." },
  { name: "Snowflake", type: "snowflake", pkg: "datus-snowflake", builtIn: false, highlight: "Native SDK with Arrow transport for fast reads." },
  { name: "StarRocks", type: "starrocks", pkg: "datus-starrocks", builtIn: false, highlight: "Multi-catalog + materialized views, MySQL-wire." },
  { name: "ClickHouse", type: "clickhouse", pkg: "datus-clickhouse", builtIn: false, since: "v0.2.6", highlight: "HTTP protocol; database ≡ schema, lightweight DELETE." },
  { name: "ClickZetta", type: "clickzetta", pkg: "datus-clickzetta", builtIn: false, highlight: "Workspace + Volume/Stage ops; lakehouse partner." },
  { name: "Hive", type: "hive", pkg: "datus-hive", builtIn: false, since: "v0.2.6", highlight: "HiveServer2 / Thrift with LDAP & Kerberos auth." },
  { name: "Spark", type: "spark", pkg: "datus-spark", builtIn: false, since: "v0.2.6", highlight: "Spark Thrift Server; NONE / PLAIN / Kerberos auth." },
  { name: "Trino", type: "trino", pkg: "datus-trino", builtIn: false, since: "v0.2.6", highlight: "Cross-catalog queries over HTTP/HTTPS SSL." },
];

const dbCategories = [
  { title: "Relational", body: "PostgreSQL, MySQL — the classic OLTP stack with rich metadata endpoints." },
  { title: "Cloud Warehouse", body: "Snowflake, StarRocks, ClickZetta — MPP engines with catalog + workspace models." },
  { title: "Lake & Distributed", body: "Hive, Spark, Trino — Thrift and HTTP engines over your data lake." },
  { title: "Analytical & Embedded", body: "DuckDB, ClickHouse, SQLite — from local files to columnar OLAP." },
];

const migrationExample = `# datus-agent generates layout hints per target:

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

const datasourceYaml = `agent:
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

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function DatabasesPage() {
  return (
    <SiteLayout>
      <Breadcrumb
        currentUrl="/databases/"
        items={[
          { label: "Home", href: "/" },
          { label: "Integrations", noSchema: true },
          { label: "Databases" },
        ]}
      />

      {/* Hero */}
      <section className="section" style={{ paddingTop: 72, paddingBottom: 40 }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <span className="eyebrow">Databases</span>
          <h1
            style={{
              fontSize: "clamp(32px,4.6vw,52px)",
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              fontWeight: 750,
              margin: "20px 0 0",
            }}
          >
            Supported Databases
          </h1>
          <p className="lead" style={{ maxWidth: 680 }}>
            Eleven native database adapters, from embedded SQLite and DuckDB to cloud warehouses
            (Snowflake, StarRocks, ClickZetta) and lake engines (Hive, Spark, Trino, ClickHouse).
            All plug in via Python entry points — no adapter code required on your side.
          </p>
        </div>
      </section>

      {/* DATABASE GRID */}
      <CatalogSection alt>
        <div className="grid grid-4">
          {databases.map((db, i) => {
            const tone = toneAt(i);
            return (
              <SpecCard
                key={db.type}
                name={db.name}
                tone={tone}
                badge={
                  db.builtIn ? (
                    <><CheckCircle2 size={12} /> Built-in</>
                  ) : db.since ? (
                    <span style={{ color: "var(--ink-muted)" }}>{db.since}</span>
                  ) : undefined
                }
                rows={[
                  { label: "Type", value: db.type },
                  { label: "Package", value: db.pkg },
                  { label: "Highlight", value: db.highlight, mono: false },
                ]}
              />
            );
          })}
        </div>
      </CatalogSection>

      {/* CATEGORY SPLIT */}
      <CatalogSection>
        <SectionHead
          eyebrow="One interface"
          title={<>Four Categories, one interface</>}
          lead="Every adapter implements the same CRUD, DDL, metadata and sampling contract — so subagents work identically across your OLTP, warehouse and lake engines."
        />
        <div className="grid grid-4">
          {dbCategories.map((c, i) => (
            <FeatureCard key={c.title} tone={toneAt(i)} title={c.title} body={c.body} />
          ))}
        </div>
      </CatalogSection>

      {/* TABLE VIEW */}
      <CatalogSection alt>
        <SpecTable
          filename="databases.yml"
          columns={[{ label: "Database" }, { label: "Type" }, { label: "Package" }, { label: "Highlight" }]}
          rows={databases.map((db) => ({
            key: db.type,
            cells: [
              <span style={{ fontSize: 14, fontWeight: 650, color: "var(--ink)" }}>{db.name}</span>,
              <InlineCode>{db.type}</InlineCode>,
              db.builtIn ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-dim)" }}>
                  <CheckCircle2 size={12} style={{ color: "var(--term-cyan)" }} /> Built-in
                </span>
              ) : (
                <InlineCode>{db.pkg}</InlineCode>
              ),
              <span style={{ color: "var(--ink-muted)" }}>{db.highlight}</span>,
            ],
          }))}
        />
        <p className="muted" style={{ marginTop: 20, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8 }}>
          <ExternalLink size={15} />
          <span>
            See the{" "}
            <a href={DB_ADAPTERS_DOCS} target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand-bright)", textDecoration: "underline", textUnderlineOffset: 2 }}>
              Database Adapters documentation
            </a>{" "}
            for configuration, connection strings, and advanced options.
          </span>
        </p>
      </CatalogSection>

      {/* MIGRATION CAPABILITIES */}
      <CatalogSection>
        <div className="card" style={{ padding: "32px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 32, alignItems: "flex-start" }}>
            <div style={{ flex: "1 1 320px", minWidth: 280 }}>
              <span className="eyebrow">Migration</span>
              <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,32px)" }}>
                Cross-database Migration hints
              </h2>
              <p className="lead" style={{ marginTop: 10 }}>
                Every adapter implements MigrationTargetMixin so subagents can generate DDL for the
                target dialect, propose OLAP-friendly layouts, and validate the result with a dry-run.
              </p>
              <div style={{ marginTop: 18 }}>
                <TagRow tags={["get_migration_capabilities()", "suggest_table_layout()", "validate_ddl()"]} />
              </div>
            </div>
            <div style={{ flex: "1 1 360px", minWidth: 300, width: "100%" }}>
              <CodeBlock filename="layout-suggestions.sql" lang="sql" code={migrationExample} />
            </div>
          </div>
        </div>
      </CatalogSection>

      {/* DATASOURCE CONFIG */}
      <CatalogSection alt>
        <SectionHead
          eyebrow="Configuration"
          title={<>Drop-in datasource config</>}
          lead="One YAML file wires every warehouse. Environment variables keep credentials out of source control."
        />
        <CodeBlock filename="agent.yml" lang="yaml" code={datasourceYaml} />
      </CatalogSection>

      {/* FAQ */}
      <FAQ
        items={databasesFaq}
        currentUrl="/databases/"
        lead="Supported databases, installing adapters, custom drivers, and access requirements."
      />

      {/* Closing CTA */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "48px 32px",
              background:
                "radial-gradient(700px 300px at 50% -20%, var(--brand-soft), transparent 70%), var(--panel)",
              borderColor: "var(--line-strong)",
            }}
          >
            <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,34px)" }}>
              Connect Your Warehouse in Minutes
            </h2>
            <p className="lead" style={{ marginInline: "auto", maxWidth: 600 }}>
              Native adapters for Snowflake, Postgres, MySQL and more — drop in credentials and the
              agent starts reasoning over your real schema.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 26 }}>
              <a className="btn btn-lg btn-primary" href={DB_ADAPTERS_DOCS} target="_blank" rel="noopener noreferrer">
                Database Adapters docs <ArrowRight size={17} />
              </a>
              <a className="btn btn-lg btn-ghost" href="/models/">
                Explore models <ArrowRight size={17} />
              </a>
              <a className="btn btn-lg btn-ghost" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                Contribute an adapter
              </a>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
