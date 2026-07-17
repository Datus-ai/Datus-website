import yaml from "js-yaml";
import { OSI_SCHEMA_VERSION } from "./schema";

// Fields on a MetricFlow semantic_model that we intentionally drop when
// mapping into OSI. Surfaced back in the UI as "Dropped fields".
const KNOWN_DROPPED_MODEL_FIELDS = new Set([
  "model", // dbt ref
  "primary_entity",
  "defaults",
  "config",
]);

type AnyRec = Record<string, unknown>;

export type ConversionResult = {
  ok: boolean;
  osiYaml: string;
  osi: AnyRec | null;
  mappedCount: number;
  renamedCount: number;
  droppedFields: string[];
  warnings: string[];
  errors: string[];
};

const AGG_TO_TYPE: Record<string, string> = {
  sum: "sum",
  count: "count",
  count_distinct: "count_distinct",
  average: "average",
  avg: "average",
  min: "min",
  max: "max",
};

function isRec(x: unknown): x is AnyRec {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

function asArray<T = unknown>(x: unknown): T[] {
  return Array.isArray(x) ? (x as T[]) : [];
}

/**
 * Convert a MetricFlow YAML document (as parsed JS object) to an OSI
 * document. Pure function — no I/O, no globals — so it can be unit tested
 * and reused server-side later.
 */
export function metricflowObjectToOsi(input: AnyRec): {
  osi: AnyRec;
  mappedCount: number;
  renamedCount: number;
  droppedFields: string[];
  warnings: string[];
} {
  const droppedFields = new Set<string>();
  const warnings: string[] = [];
  let mappedCount = 0;
  let renamedCount = 0;

  const semanticModels = asArray<AnyRec>(input.semantic_models);
  const topLevelMetrics = asArray<AnyRec>(input.metrics);

  if (semanticModels.length === 0 && topLevelMetrics.length === 0) {
    warnings.push(
      "No `semantic_models` or top-level `metrics` found — is this really a MetricFlow file?",
    );
  }

  // Group top-level metrics onto the first entity that references them
  // (MetricFlow lets metrics reference any measure by name).
  const entities = semanticModels.map((sm) => {
    const entity: AnyRec = { name: String(sm.name ?? "unnamed") };
    mappedCount++;

    if (typeof sm.description === "string") entity.description = sm.description;
    if (isRec(sm.node_relation) && typeof sm.node_relation.alias === "string") {
      entity.table = sm.node_relation.alias;
      renamedCount++;
    } else if (typeof sm.model === "string") {
      // dbt `model:` ref → strip ref() wrapper for OSI `table`
      const m = sm.model.match(/ref\(['"]?([^'")]+)['"]?\)/);
      entity.table = m ? m[1] : sm.model;
      renamedCount++;
    }

    // entities → join_keys
    const mfEntities = asArray<AnyRec>(sm.entities);
    if (mfEntities.length > 0) {
      entity.join_keys = mfEntities.map((e) => {
        mappedCount++;
        renamedCount++;
        const jk: AnyRec = { name: String(e.name ?? "id") };
        if (typeof e.type === "string" && ["primary", "foreign", "natural"].includes(e.type))
          jk.type = e.type;
        if (typeof e.expr === "string") jk.expr = e.expr;
        return jk;
      });
    }

    // dimensions → dimensions
    const mfDims = asArray<AnyRec>(sm.dimensions);
    if (mfDims.length > 0) {
      entity.dimensions = mfDims.map((d) => {
        mappedCount++;
        const dim: AnyRec = { name: String(d.name ?? "unnamed") };
        const t = typeof d.type === "string" ? d.type.toLowerCase() : "categorical";
        dim.type = ["categorical", "time", "numeric"].includes(t) ? t : "categorical";
        if (typeof d.expr === "string") dim.expr = d.expr;
        if (isRec(d.type_params) && typeof d.type_params.time_granularity === "string") {
          dim.granularity = d.type_params.time_granularity;
          renamedCount++;
        }
        if (typeof d.description === "string") dim.description = d.description;
        return dim;
      });
    }

    // measures + top-level metrics → metrics
    const mfMeasures = asArray<AnyRec>(sm.measures);
    const measureNames = new Set(mfMeasures.map((m) => String(m.name ?? "")));
    const metrics: AnyRec[] = [];

    for (const m of mfMeasures) {
      mappedCount++;
      const metric: AnyRec = { name: String(m.name ?? "unnamed") };
      const agg = typeof m.agg === "string" ? m.agg.toLowerCase() : "sum";
      metric.type = AGG_TO_TYPE[agg] ?? "simple";
      if (typeof m.expr === "string") metric.expr = m.expr;
      if (typeof m.description === "string") metric.description = m.description;
      metrics.push(metric);
    }
    // Attach top-level metrics whose type_params.measure lives in this model
    for (const tm of topLevelMetrics) {
      const measureRef =
        isRec(tm.type_params) && typeof tm.type_params.measure === "string"
          ? tm.type_params.measure
          : isRec(tm.type_params) &&
              isRec(tm.type_params.measure) &&
              typeof (tm.type_params.measure as AnyRec).name === "string"
            ? String((tm.type_params.measure as AnyRec).name)
            : null;
      if (measureRef && measureNames.has(measureRef)) {
        mappedCount++;
        renamedCount++;
        const metric: AnyRec = { name: String(tm.name ?? measureRef) };
        const t = typeof tm.type === "string" ? tm.type.toLowerCase() : "simple";
        metric.type = ["simple", "ratio", "cumulative", "derived"].includes(t) ? t : "simple";
        if (typeof tm.description === "string") metric.description = tm.description;
        metrics.push(metric);
      }
    }
    if (metrics.length > 0) entity.metrics = metrics;

    // Track dropped fields
    for (const k of Object.keys(sm)) {
      if (
        ["name", "description", "entities", "dimensions", "measures", "node_relation"].includes(k)
      )
        continue;
      if (KNOWN_DROPPED_MODEL_FIELDS.has(k)) droppedFields.add(k);
      else droppedFields.add(k);
    }

    return entity;
  });

  const osi: AnyRec = {
    osi_version: OSI_SCHEMA_VERSION,
    ...(typeof input.name === "string" ? { name: input.name } : {}),
    entities,
  };

  return {
    osi,
    mappedCount,
    renamedCount,
    droppedFields: Array.from(droppedFields).sort(),
    warnings,
  };
}

/**
 * Top-level entry point used by the UI: parse YAML, convert, and re-serialize.
 */
export function convertMetricflowYaml(yamlSource: string): ConversionResult {
  const errors: string[] = [];
  let parsed: unknown = null;
  try {
    parsed = yaml.load(yamlSource);
  } catch (e) {
    return {
      ok: false,
      osiYaml: "",
      osi: null,
      mappedCount: 0,
      renamedCount: 0,
      droppedFields: [],
      warnings: [],
      errors: [`YAML parse error: ${(e as Error).message}`],
    };
  }

  if (!isRec(parsed)) {
    return {
      ok: false,
      osiYaml: "",
      osi: null,
      mappedCount: 0,
      renamedCount: 0,
      droppedFields: [],
      warnings: [],
      errors: ["Root of the YAML must be a mapping (a key/value document)."],
    };
  }

  const { osi, mappedCount, renamedCount, droppedFields, warnings } =
    metricflowObjectToOsi(parsed);

  const osiYaml = yaml.dump(osi, { lineWidth: 100, noRefs: true, sortKeys: false });

  return {
    ok: errors.length === 0,
    osiYaml,
    osi,
    mappedCount,
    renamedCount,
    droppedFields,
    warnings,
    errors,
  };
}
