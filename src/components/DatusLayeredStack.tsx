import React from "react";
import { motion } from "motion/react";

// --- Sample data (replace with your own) ---
const CATALOG = ["DataHub", "Amundsen", "Unity Catalog", "AWS Glue"];
const WAREHOUSE = ["StarRocks", "Snowflake", "BigQuery", "Redshift", "Databricks SQL"];
const SCHED = ["Airflow", "Dagster", "Prefect"];
const SEMANTIC = ["MetricFlow", "dbt Semantic Layer", "LookML", "AtScale"];
const BI = ["Looker", "Tableau", "Power BI", "Superset", "Mode"];

const GROUPS = [
  { key: "Catalog", color: "rgba(34,211,238,0.9)", items: CATALOG, placeholder: "Your catalog" },
  { key: "Warehouse", color: "rgba(34,197,94,0.95)", items: WAREHOUSE, placeholder: "Your warehouse" },
  { key: "Scheduler", color: "rgba(234,179,8,0.95)", items: SCHED, placeholder: "Your scheduler" },
  { key: "Semantic", color: "rgba(59,130,246,0.95)", items: SEMANTIC, placeholder: "Your semantic layer" },
  { key: "BI", color: "rgba(147,51,234,0.95)", items: BI, placeholder: "Your BI tool" },
];

// Cross‑cutting planes (vertical extensibility)
const PLANES: Array<{ key: string; items?: string[]; dashed?: boolean }> = [
  { key: "Security & Governance", items: ["Policy", "Access", "Audit", "Lineage/PII"] },
  { key: "Management", items: ["Templates", "RBAC/ABAC", "Cost Guardrails"] },
  { key: "Observability", items: ["Metrics", "Logs", "Traces", "SLA/SLO"] },
  { key: "+ Add plane", dashed: true },
];

// Optional logos mapping
const LOGOS: Record<string, string> = {};

function Chip({ label, dashed }: { label: string; dashed?: boolean }) {
  const src = LOGOS[label];
  return (
    <>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={label} className="h-4 w-4 object-contain" />
      ) : null}
      <span className="text-xs text-white/85">{label}</span>
    </>
  );
}

function PlaneRow({ plane }: { plane: { key: string; items?: string[]; dashed?: boolean } }) {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-2 rounded-xl ${
        plane.dashed ? "border border-dashed border-white/25" : "border border-white/10"
      } ${plane.dashed ? "bg-transparent" : "bg-white/5"} p-3`}
      data-testid={`plane-${plane.key.replace(/\s+/g, "-")}`}
    >
      <div className="mr-2 text-xs font-semibold text-white/85">{plane.key}</div>
      {(plane.items || []).map((l) => (
        <span key={l} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-white/85">
          {l}
        </span>
      ))}
      {plane.dashed ? (
        <span className="rounded-full border border-dashed border-white/30 px-3 py-1 text-xs text-white/70">+ Add capability</span>
      ) : null}
    </div>
  );
}

export default function DatusLayeredStack() {
  return (
    <div className="mx-auto max-w-7xl">

      {/* Columns + connectors + hub */}
      <>





   

        {/* Hub */}
        <div className="mt-6 flex items-center justify-center">
          <div className="relative">
            <div className="absolute -inset-6 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-white/5 to-indigo-500/20 blur-2xl" />
            
          </div>
        </div>
      </>

      
    </div>
  );
}