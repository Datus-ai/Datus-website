import type { FaqItem } from "../../../components/FAQ";

// Page-specific FAQ for /tools/osi-playground/. Content ported verbatim from the
// datus-design template (osi-faqs.ts OSI_FAQS). Owned by this URL only; see
// datus-faq-spec.md.
export const osiPlaygroundFaq: FaqItem[] = [
  {
    q: "What is the Open Semantic Interchange (OSI)?",
    a: "The Open Semantic Interchange is a vendor-neutral YAML specification for describing metrics, dimensions, and entities in a semantic layer. Backed by Snowflake, dbt Labs, Salesforce and others, OSI lets you define a metric once and query it from Snowflake Cortex, Cube, Looker, AtScale, ThoughtSpot and more without redefining 'Revenue' in every tool.",
  },
  {
    q: "How do I convert MetricFlow YAML to OSI?",
    a: "Paste your MetricFlow YAML into the Converter tab above. The Datus OSI Playground runs entirely in your browser: it parses your semantic_models, measures and dimensions, maps them to OSI entities, metrics and dimensions, and gives you a downloadable .yaml file plus a list of any fields that were dropped in translation.",
  },
  {
    q: "Is my YAML sent to a server?",
    a: "No. The Validator, Converter and Diff all run 100% in your browser using js-yaml. Your semantic definitions never leave your machine — there is no upload, no sign-up, and no logging. You can verify this in your browser's DevTools Network tab.",
  },
  {
    q: "Which OSI version does the Playground validate against?",
    a: "The Playground currently validates against OSI v0.2.0.dev0, the working draft of the core metadata specification. The OSI spec is still evolving toward a stable 1.0, so we track the upstream schema and re-publish the Playground when the spec moves. The active version is stamped at the top of every Validator result.",
  },
  {
    q: "What is the difference between OSI and MetricFlow?",
    a: "MetricFlow is dbt Labs' semantic layer YAML format — it's tightly integrated with the dbt project and generates SQL through the MetricFlow engine. OSI is a vendor-neutral interchange format: it doesn't run queries itself, it standardizes how metric and dimension definitions are shared across tools. In practice, teams author metrics in MetricFlow or Cube and export to OSI so downstream BI and AI tools can consume them without vendor lock-in.",
  },
  {
    q: "Does the Converter support every MetricFlow feature?",
    a: "The MVP covers the most common surface: semantic_models to entities, measures to metrics, dimensions to dimensions, entities to join_keys, and top-level metrics whose type_params.measure lives on a converted model. Advanced features (saved queries, cumulative metrics with grain-to-date, complex ratio metrics) are on the roadmap; any fields dropped in conversion are surfaced explicitly in the result panel so you never lose them silently.",
  },
  {
    q: "How does Datus use OSI internally?",
    a: "Datus is a data engineering agent that grounds every SQL query, pipeline and dashboard answer in your semantic layer. We treat OSI as the neutral wire format between Datus and whichever semantic layer you already run — dbt MetricFlow, Cube, Looker LookML or a home-grown YAML store — so the agent stays accurate as your stack changes. See our Features page for how the context engine reads OSI.",
  },
  {
    q: "Is the OSI Playground open source?",
    a: "The upstream OSI specification is Apache 2.0 (github.com/open-semantic-interchange/OSI). The Datus Playground is a free hosted tool built by the Datus team — the Datus data engineering agent itself is also Apache 2.0 and you can self-host the whole stack, semantic-layer support included.",
  },
];
