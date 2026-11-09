# Apache Ossie pillar — implementation notes

Branch: `codex/apache-ossie-pillar`, based on `origin/main` at `e826dd6`.

Approved plan: https://docs.google.com/document/d/1UiBOFInm-33uu9HHQqYzFIF1FVelI29_ZeLLAlBqFeo/edit

## Intent and page roles

- `/apache-ossie/` and `/zh/apache-ossie/`: current-standard overview, DOSI execution boundary, compatibility, and learning paths.
- `/blog/first-native-apache-ossie-engine/`: execution implementation. Preserve its URL and search history.
- `/blog/open-semantic-interchange-osi/`: background and adoption context. the refreshed article now focuses on origins, governance, historical documents, and adoption.
- Tutorials, converters and comparisons retain their task-specific content and self-canonicals. Contextual guide links do not replace functional tool or official-spec links.
- DOSI documentation remains on its own host; no changes to that repository or to the Apache ecosystem are included.

## Example provenance

`src/public/examples/apache-ossie/orders.yaml` is the single source for the downloadable file and rendered model. It uses the root-model structure documented by current Apache Ossie/DOSI guidance, rather than the legacy `semantic_model` wrapper.

Checked on October 30, 2026 with the official DOSI 0.2.0 macOS arm64 lean binary. The archive was verified against its release manifest SHA-256 and extracted only under `/tmp`; the user's installed DOSI was not replaced.

```sh
dosi validate --model orders.yaml
dosi query --model orders.yaml --metrics revenue --group-by orders.status --dialect duckdb
```

Validation reports one valid model. Actual generated SQL (formatting on the page adds line breaks):

```sql
SELECT orders.status AS status, SUM(orders.amount) AS revenue FROM main.orders AS orders GROUP BY orders.status
```

The initial model/command/compiler-output panel has been replaced with the supplied DOSI YouTube walkthrough (rvTLpOCUVLo). The small orders model remains available as a source artifact; the visible format comparison now uses the Northstar educational subset; the SQL-generation checks above record its provenance. No query runs in the page.

## Checks

Run `npm run build:all` and `npm run test:seo`. Review both locales and themes, narrow viewports, keyboard navigation of the manual property controls, YAML/JSON switching, the model download, source handoff to Studio, and complete prerendered HTML without JavaScript. The shared reveal system respects reduced motion; this page has no autoplay tabs.

## Overview coverage added October 30, 2026

The overview now explains YAML/JSON, upstream ontology and mapping documents, converter hub-and-spoke exchange, an agent metadata-to-runtime workflow, public governance/incubation, and version-aware ecosystem support. The five supplied follow-up questions are answered in visible FAQ copy as well as its shared JSON-LD. The existing dbt comparison remains the detailed comparison destination.

Source links: the upstream core specification, `ontology/ontology.md`, `apache/ossie-converters#hub-and-spoke-model`, the July 10, 2026 incubation announcement, and the official ecosystem directory. The announcement date is not presented as the formal admission date. Ecosystem participation is distinguished from import/export, native reading, and execution support. No unverified latest-release number or universal accuracy guarantee is asserted.

## Educational-first organization

The main narrative now introduces the standard, origin timeline, governance, named ecosystem participants and contribution paths before any DOSI execution section. YAML and JSON are now switched within the Northstar attribute explorer, from the same parsed model; there is no second manually maintained model. Converter examples reflect the website workbench, not a blanket claim of upstream interoperability: Cube/Omni YAML, compiled dbt semantic manifest, and offline Power BI BIM inputs; Snowflake Cortex Analyst, dbt semantic manifest and Omni outputs. The tool performs conversion only on its own page after explicit submission.

Launch history is anchored to Snowflake's September 23, 2025 press release; repository opening and renaming use the July 10, 2026 Apache update. Current community/working-group participation and contribution paths link the official community and CONTRIBUTING pages. Participants are taken from the official ecosystem directory; Google was not present there when checked and is not listed in this page.

## Supporting illustration and VI reuse

The standard and ontology cards include flat vector explanations beside their existing copy. Background watermarks reuse the approved Shared definition, Relationship map, Loop field, Agent-native Responsive field (V-03), and Audit-ready Trace paths (AR-1) geometry. The last two transparent SVGs are copied unchanged from the standalone `Datus-visual-identity/datus-visual-identity-v1/flat/` catalog. Masks use the site's theme accent; these decorative layers are hidden from assistive technology and print, ignore pointer events, and remain below opaque code and explanatory surfaces. No product behavior is implied by their decorative placement.

## Northstar attribute explorer and walkthrough

`northstar-explained.yaml` is an educational subset of the user-provided Northstar Premier `studio/northstar_premier.yaml`. It preserves the chosen customer/order/order-line sources, field expressions, two relationship definitions and booked_revenue. Its outer wrapper is normalized to the current root-document format. AI context is explicitly marked as a new educational annotation, not an exact source excerpt. DOSI 0.2.0 `validate` accepted one semantic model; no warehouse query was executed. Five manual, keyboard-accessible property buttons highlight matching YAML lines and scroll only the code viewport. All lines remain in prerendered HTML.

The execution section embeds the supplied walkthrough using youtube-nocookie.com with lazy loading, no autoplay, fullscreen support and a YouTube fallback link. The hero has four balanced bundles of lines connecting fields/dimensions, metrics, relationships and business context to the same model core.
