# Apache Superset integration page: source and keyword brief

Date: 2026-11-10. Proposed route: `/integrations/superset/` with `/zh/integrations/superset/`. Local branch: `codex/integration-superset`.

## Title decision

H1: **Apache Superset AI Agent Integration**. Title: **Apache Superset AI Agent Integration | Datus**.

OpenSEO / DataForSEO US-English estimates returned 9 rows from 16 requested terms. Monthly volume / KD: `superset ai` 390/46; `superset dashboard` 210/10; `superset ai agent` 30/0; `apache superset ai` 20/unknown; `superset integration`, `superset metrics`, `superset semantic layer` each 10/unknown. Broader `ai report generator` 390/0 and `ai dashboard generator` 110/0 belong to broader intent owners, not this integration page.

Two depth-10 SERP checks (`superset ai agent`, `superset ai`) mixed Apache BI content with a separate AI coding-agent product previously called Superset. Including Apache in the H1 disambiguates the product. KD 0 is an estimate, not proof of effortless ranking. Missing metrics are unknown, not zero. No variant volumes were summed and no keywords were saved.

## Product source snapshot

- Datus Agent source inspected at commit `46ca6abef989e667368e6b9a4146c0e9f39d23f5`.
- Datus Plugins source inspected at commit `b4bf2c70c2647cf878a00dc04306b45d6a0b18e6`.
- Superset plugin README and `skills/superset-query-export/references/datus-rebuild.md`: resolve selected source dashboard; preserve complete SQL and analytical intent; reuse compatible maintained metrics; author missing selected definitions when allowed; validate before destination generation.
- `datus_superset_plugin/exporter.py`: per-query SQL files, source snapshots, checksums, status and manifest.
- `superset-dashboard-authoring/SKILL.md`: author assets in Superset, read them back, verify queries; this is distinct from creating a Datus dashboard.
- Host `dashboard-bootstrap/references/visual-dashboard.md`: metric policy, verified scope, definition checks and exact destination handoff to `gen_visual_dashboard`.
- Host visual report/dashboard guides and node implementations: report snapshots versus backend-supported dashboard filtering.

Primary source links:

- https://github.com/Datus-ai/Datus-Plugins/tree/b4bf2c70c2647cf878a00dc04306b45d6a0b18e6/datus-superset-plugin
- https://github.com/Datus-ai/Datus-agent/tree/46ca6abef989e667368e6b9a4146c0e9f39d23f5/datus/resources/skills/dashboard-bootstrap
- https://docs.datus.ai/dev/getting_started/dashboard_copilot/
- https://docs.datus.ai/dev/getting_started/data_engineering_quickstart/
- https://docs.datus.ai/dev/subagent/gen_visual_report/
- https://docs.datus.ai/dev/subagent/gen_visual_dashboard/

## Content boundaries

1. BI SQL export and context construction are not automatic approval of a metric's business meaning. Preserve source identity, selected filters, grain and calculation intent.
2. Converting to a Datus dashboard does not modify Superset source assets. Creating assets inside Superset uses the separate authoring workflow.
3. Datus HTML reports are snapshots. Datus HTML dashboards require the configured query backend; the documented CLI workflow uses `datus --web`.
4. Source and destination chart equivalence requires per-chart validation. Do not promise pixel-perfect migration, universal import coverage, or automatic reconciliation of all business rules.
5. Page previews are explanatory diagrams/layouts with no fabricated customer results. The page itself does not connect to a Superset deployment.
6. Apache Superset and Apache Ossie are ASF projects. Datus and DOSI are independent products. DOSI is Elastic License 2.0; only Datus Agent is described as open source.

## Structure and linking

Hero → selectable source/definition/output workflow → distinct Superset/report/dashboard output previews → reuse and provenance benefits → setup → FAQ → Studio CTA → related pages. Link from the Integrations hub and a dedicated footer Integrations group; keep vendor-specific Superset out of the main navigation. Broader semantic-layer and composable-analytics content retain their own intent.
