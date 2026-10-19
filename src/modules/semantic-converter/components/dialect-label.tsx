import { Database } from 'lucide-react';

export function DialectLabel({ dialect }: { dialect: string }) {
  const icon = (
    {
      SNOWFLAKE: 'snowflake',
      BIGQUERY: 'bigquery',
      DATABRICKS: 'spark',
      STARROCKS: 'starrocks',
      POSTGRES: 'postgresql',
    } as Record<string, string>
  )[dialect];
  return (
    <span className="sc-dialect">
      {icon ? (
        <img src={`/semantic-converter/icons/${icon}.png`} alt="" />
      ) : (
        <Database size={12} />
      )}
      {dialect}
    </span>
  );
}
