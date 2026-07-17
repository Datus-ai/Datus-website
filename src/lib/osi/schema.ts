// Minimal, hand-authored subset of the OSI (Open Semantic Interchange) 0.2.0.dev0
// core spec — enough to validate the shape of a converted document in the
// browser without shipping the full upstream schema. Kept intentionally lax
// (additionalProperties: true) because the upstream spec is still a draft.
//
// Ref: https://github.com/open-semantic-interchange/OSI/blob/main/core-spec/spec.md
export const OSI_SCHEMA_VERSION = "0.2.0.dev0";

export const osiSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "https://datus.ai/tools/osi-playground/osi.schema.json",
  title: "OSI Core Metadata (subset)",
  type: "object",
  additionalProperties: true,
  required: ["osi_version", "entities"],
  properties: {
    osi_version: { type: "string", pattern: "^0\\.[0-9]+" },
    name: { type: "string" },
    description: { type: "string" },
    entities: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: true,
        required: ["name"],
        properties: {
          name: { type: "string", minLength: 1 },
          description: { type: "string" },
          table: { type: "string" },
          join_keys: {
            type: "array",
            items: {
              type: "object",
              required: ["name"],
              properties: {
                name: { type: "string" },
                type: { type: "string", enum: ["primary", "foreign", "natural"] },
                expr: { type: "string" },
              },
            },
          },
          dimensions: {
            type: "array",
            items: {
              type: "object",
              required: ["name", "type"],
              properties: {
                name: { type: "string", minLength: 1 },
                type: { type: "string", enum: ["categorical", "time", "numeric"] },
                expr: { type: "string" },
                granularity: { type: "string" },
                description: { type: "string" },
              },
            },
          },
          metrics: {
            type: "array",
            items: {
              type: "object",
              required: ["name", "type"],
              properties: {
                name: { type: "string", minLength: 1 },
                type: {
                  type: "string",
                  enum: ["simple", "ratio", "cumulative", "derived", "sum", "count", "count_distinct", "average", "min", "max"],
                },
                expr: { type: "string" },
                description: { type: "string" },
                agg: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
} as const;
