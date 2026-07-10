# Knowledge: Glossary Directions (candidate topics)

Source of directions: `src/glossary/glossaryData.ts` (in the repo root)
(47 terms in 7 categories). A term with an `article:` link already has a blog
post — **prefer terms without one**. Always re-check `memory/covered-topics.md`
before committing to a direction (the ledger is authoritative; this file is a
snapshot that can drift as posts ship).

## Open directions — glossary terms with NO article yet (31)
Pick from these first. Grouped by glossary category.

**Architecture**
- Data Fabric (`data-fabric`)
- Medallion Architecture (`medallion-architecture`)  ← also referenced-but-unwritten from other posts (high value)
- Lambda vs Kappa (`lambda-vs-kappa`)

**Modeling**
- Dimensional Modeling (`dimensional-modeling`)
- Star Schema (`star-schema`)
- Slowly Changing Dimensions (`slowly-changing-dimensions`)
- One Big Table / OBT (`one-big-table`)
- Data Vault (`data-vault`)

**Storage & Formats**
- Columnar Storage (`columnar-storage`)
- Parquet (`parquet`)
- Delta Lake (`delta-lake`)  ← rounds out the Iceberg/Hudi set already published

**Processing**
- OLAP vs OLTP (`olap-vs-oltp`)
- ETL vs ELT (`etl-vs-elt`)
- Batch vs Streaming (`batch-vs-streaming`)
- Change Data Capture / CDC (`change-data-capture`)
- Backfill (`backfill`)
- Idempotency (`idempotency`)
- Materialized View (`materialized-view`)
- dbt (`dbt`)

**Governance & Quality**
- Data Lineage (`data-lineage`)
- PII & Data Masking (`pii-data-masking`)
- RBAC (`rbac`)
- Data Quality (`data-quality`)

**AI & Agents**
- Embedding (`embedding`)  ← also referenced-but-unwritten ("what-is-embedding-ai")
- Vector Search (`vector-search`)

**Observability**
- Data Observability (`data-observability`)
- Freshness (`freshness`)
- Volume Checks (`volume-checks`)
- Schema Drift (`schema-drift`)
- Anomaly Detection (`anomaly-detection`)
- Data SLA / SLO (`data-sla-slo`)

## Referenced-but-unwritten (internal links already point at these — high SEO value to fill)
Other posts link to these slugs that don't exist yet — writing them closes broken
internal links and satisfies existing demand:
- `what-is-mcp-data-engineering` (MCP glossary entry — linked 3×)
- `what-is-data-contract` (data contracts — linked 3×; note: not in glossaryData yet, consider adding the term too)
- `what-is-medallion-architecture` / `medallion-architecture` (linked 2×)
- `what-is-embedding-ai` / `embedding` (linked 1×)

## How to choose (evaluation rubric)
For 2–3 candidates, weigh:
1. **Search value** — is it a term data teams actually search? (glossary "what-is-X" terms usually are.)
2. **Whitespace** — can we beat the current top results with more depth / an honest table / a failure-mode walkthrough?
3. **Datus fit** — is there a natural, honest bridge to evolvable context / agents / semantic layer? (Almost all of these do: e.g. CDC → freshness → agent monitoring; SCD → grain → schema linking; data lineage → context engine; embeddings/vector search → Tree+Vector memory.)
4. **Portfolio balance** — fills a gap or closes a referenced-but-unwritten link, and isn't a near-duplicate of anything in `memory/covered-topics.md`.

When you publish a term's post, also set its `article: "/blog/<slug>/"` in
`glossaryData.ts` and move it to the "covered" list in `memory/covered-topics.md`.

## Slug naming
Match the corpus: glossary posts use `what-is-<term>` (e.g. `what-is-cdc`,
`what-is-data-lineage`) or the comparison form for "X vs Y" (`olap-vs-oltp`,
`etl-vs-elt`). Lowercase, hyphenated, keyword-rich.
