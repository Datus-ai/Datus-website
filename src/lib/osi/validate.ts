import yaml from "js-yaml";
import { OSI_SCHEMA_VERSION } from "./schema";
import { convertMetricflowYaml } from "./metricflow-to-osi";

// A tiny, dependency-free validator for the OSI core-schema subset defined in
// ./schema.ts. It intentionally re-implements only the handful of constraints
// that schema declares (required keys, string / array shapes, enum values) so
// the Playground can run in the browser and during SSR prerender without
// pulling a full JSON-Schema engine into the build. Error objects mirror the
// `{ instancePath, message }` shape the UI renders.

export type OsiError = { instancePath: string; message: string };

type AnyRec = Record<string, unknown>;

const isRec = (x: unknown): x is AnyRec =>
  typeof x === "object" && x !== null && !Array.isArray(x);

const DIM_TYPES = ["categorical", "time", "numeric"];
const JOIN_TYPES = ["primary", "foreign", "natural"];
const METRIC_TYPES = [
  "simple",
  "ratio",
  "cumulative",
  "derived",
  "sum",
  "count",
  "count_distinct",
  "average",
  "min",
  "max",
];

const MISSING = (prop: string): string => `must have required property '${prop}'`;
const ENUM = "must be equal to one of the allowed values";

/** Validate a parsed OSI document against the core-schema subset. */
export function validateOsiObject(doc: unknown): OsiError[] {
  const errors: OsiError[] = [];
  if (!isRec(doc)) {
    errors.push({ instancePath: "", message: "must be object" });
    return errors;
  }

  if (!("osi_version" in doc)) {
    errors.push({ instancePath: "", message: MISSING("osi_version") });
  } else if (typeof doc.osi_version !== "string" || !/^0\.[0-9]+/.test(doc.osi_version)) {
    errors.push({ instancePath: "/osi_version", message: 'must match pattern "^0\\.[0-9]+"' });
  }

  if (!("entities" in doc)) {
    errors.push({ instancePath: "", message: MISSING("entities") });
  } else if (!Array.isArray(doc.entities)) {
    errors.push({ instancePath: "/entities", message: "must be array" });
  } else {
    if (doc.entities.length < 1) {
      errors.push({ instancePath: "/entities", message: "must NOT have fewer than 1 items" });
    }
    doc.entities.forEach((ent, ei) => {
      const base = `/entities/${ei}`;
      if (!isRec(ent)) {
        errors.push({ instancePath: base, message: "must be object" });
        return;
      }
      if (!("name" in ent)) {
        errors.push({ instancePath: base, message: MISSING("name") });
      } else if (typeof ent.name !== "string" || ent.name.length < 1) {
        errors.push({ instancePath: `${base}/name`, message: "must NOT have fewer than 1 characters" });
      }

      if ("join_keys" in ent) validateJoinKeys(ent.join_keys, `${base}/join_keys`, errors);
      if ("dimensions" in ent) validateDimensions(ent.dimensions, `${base}/dimensions`, errors);
      if ("metrics" in ent) validateMetrics(ent.metrics, `${base}/metrics`, errors);
    });
  }

  return errors;
}

function validateJoinKeys(v: unknown, base: string, errors: OsiError[]): void {
  if (!Array.isArray(v)) {
    errors.push({ instancePath: base, message: "must be array" });
    return;
  }
  v.forEach((jk, i) => {
    const p = `${base}/${i}`;
    if (!isRec(jk)) return;
    if (!("name" in jk)) errors.push({ instancePath: p, message: MISSING("name") });
    if ("type" in jk && !JOIN_TYPES.includes(String(jk.type)))
      errors.push({ instancePath: `${p}/type`, message: ENUM });
  });
}

function validateDimensions(v: unknown, base: string, errors: OsiError[]): void {
  if (!Array.isArray(v)) {
    errors.push({ instancePath: base, message: "must be array" });
    return;
  }
  v.forEach((d, i) => {
    const p = `${base}/${i}`;
    if (!isRec(d)) return;
    if (!("name" in d)) errors.push({ instancePath: p, message: MISSING("name") });
    if (!("type" in d)) errors.push({ instancePath: p, message: MISSING("type") });
    else if (!DIM_TYPES.includes(String(d.type)))
      errors.push({ instancePath: `${p}/type`, message: ENUM });
  });
}

function validateMetrics(v: unknown, base: string, errors: OsiError[]): void {
  if (!Array.isArray(v)) {
    errors.push({ instancePath: base, message: "must be array" });
    return;
  }
  v.forEach((m, i) => {
    const p = `${base}/${i}`;
    if (!isRec(m)) return;
    if (!("name" in m)) errors.push({ instancePath: p, message: MISSING("name") });
    if (!("type" in m)) errors.push({ instancePath: p, message: MISSING("type") });
    else if (!METRIC_TYPES.includes(String(m.type)))
      errors.push({ instancePath: `${p}/type`, message: ENUM });
  });
}

export type ValidationResult =
  | { kind: "yaml-error"; message: string }
  | { kind: "not-object"; message: string }
  | { kind: "valid"; warnings: string[] }
  | { kind: "invalid"; errors: OsiError[]; warnings: string[] };

/**
 * Validate a raw YAML string as OSI. If the source looks like a MetricFlow
 * document, it is converted to OSI first and the converted result validated
 * (matching the Playground's behavior).
 */
export function validateAsOsi(source: string): ValidationResult {
  let parsed: unknown;
  try {
    parsed = yaml.load(source);
  } catch (e) {
    return { kind: "yaml-error", message: (e as Error).message };
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return { kind: "not-object", message: "Root must be a YAML mapping." };
  }

  const isMetricflow = "semantic_models" in (parsed as AnyRec);
  const warnings: string[] = [];
  let target: unknown = parsed;
  if (isMetricflow) {
    warnings.push(
      "Detected MetricFlow input — validated the converted OSI document, not the source.",
    );
    target = convertMetricflowYaml(source).osi;
  }

  const errors = validateOsiObject(target);
  if (errors.length === 0) return { kind: "valid", warnings };
  return { kind: "invalid", errors, warnings };
}

export { OSI_SCHEMA_VERSION };
