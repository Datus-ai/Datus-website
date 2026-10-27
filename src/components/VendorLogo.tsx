const LOGOS: Record<string, string> = {
  OpenAI: "openai", Anthropic: "anthropic", Gemini: "gemini", DeepSeek: "deepseek",
  Qwen: "qwen", Ollama: "ollama", Bedrock: "bedrock", Snowflake: "snowflake",
  BigQuery: "bigquery", Redshift: "redshift", Postgres: "postgresql", DuckDB: "duckdb",
  dbt: "dbt", SQLMesh: "sqlmesh", Cube: "cube", "dbt Semantic Layer": "dbt",
  LookML: "looker", DataHub: "datahub", OpenMetadata: "openmetadata",
  "Unity Catalog": "unity-catalog", Metabase: "metabase", Superset: "superset",
  Tableau: "tableau", Airflow: "airflow", Dagster: "dagster", Prefect: "prefect",
};

export default function VendorLogo({ name, logo = LOGOS[name], title = name }: { name: string; logo?: string; title?: string }) {
  return <figure className="nordic-vendor-logo" title={title}>
    <span className={`nordic-vendor-logo__mark nordic-vendor-logo__mark--${logo}`}><img src={`/integrations/logos/${logo}.svg`} alt="" aria-hidden="true" loading="lazy" width="36" height="36"/></span>
    <figcaption>{name}</figcaption>
  </figure>;
}
