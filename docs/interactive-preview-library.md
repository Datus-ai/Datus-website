# Reusable animated previews

These are source components, not exported screenshots. Keep older variants when
changing a homepage demo. Reuse their copy dictionaries, CSS, fixture data and
motion logic together. Do not add duplicate public pages merely to archive them.

## How it works variants

| Variant | Source | Status |
|---|---|---|
| Simple animated schematic | `src/components/KnowledgeJourney.tsx` | Active homepage. Five animated SVG scenes; responsive mobile scenes. |
| Full product UI walkthrough | `src/components/FullContextJourney.tsx`, `FullContextJourney` | Preserved previous homepage: left step tabs, full-size product frames, no expand control. |
| Compact expandable product UI | `src/components/FullContextJourney.tsx`, `CompactContextJourney` | Preserved alternate composition: smaller frames with explicit expansion. |

The full variant uses the `how-it-works` anchor: mount one version at a time.
All variants require the site's locale provider, theme tokens and countdown CSS.
Product variants also use `home-narrative.css` and the solution/product preview
styles imported by the homepage. Both English and Chinese copy remain in
`src/content/homeNarrative.ts`, `src/content/knowledgeJourney.ts` and shared UI
copy in `src/i18n/ui.ts`. `useTimedTabs` synchronizes the active underline with
rotation and preserves elapsed time on pause. Reduced motion disables autoplay.

## Other reusable previews

- `HomeNarrative.tsx`: `LaunchOverview` (animated common input → four-layer Datus
  boundary → common output; switches to release video when configured),
  `BusinessModel`, and `RuntimeEvidence` (model, generated SQL, lineage).
- `ProductInterfacePreview.tsx`: Studio workspace, Agent/subagent building,
  DOSI lineage/ontology/execution, MCP/API/CLI interface compositions.
- `pages/solutions/semantic-layer/SourceBasedWorkflow.tsx`: discovery, model
  drafting and team review, based on product source.
- `pages/solutions/semantic-layer/SemanticHubReview.tsx`: YAML Diff → Approve →
  Merge demonstration. Preview actions are local, not real repository changes.
- `NorthstarLineage.tsx`: reusable lineage graph and node inspector.

The schematic is explanatory. Product frames use source-based controls and
Northstar fixture/recorded artifacts; they do not execute live queries or claim
that preview approvals were performed by a real team. Preserve provenance copy.
Architecture packets illustrate direction, not measured traffic or latency.

Local proof captures from earlier iterations remain in
`output/homepage-open-context/`, including `workflow-full-dark-desktop.png`.
These are QA artifacts, not assets to ship as interactive UI.

- `AuditRuntimePreview.tsx`: four source-based Audit-ready fragments (review,
  compilation input, SQL, results/lineage), selected by the homepage's 01–04 tabs.
  `RuntimeEvidence` retains the earlier three-tab composition for future reuse.

- `AuditRuntimeDetailedPreview.tsx` preserves the full four-step UI before the
  simplified report-based iteration. Active `AuditRuntimePreview.tsx` is now the
  small, full-width composition with a report Calculation & Sources inspector.
- `BusinessContextIllustration.tsx` contains the three small explanatory scenes.
- Local architecture choices: `output/architecture-directions/index.html`.

- `BusinessModelLayeredPreview.tsx` preserves the previous stacked-layer layout.

- `BusinessDefinitionDetails.tsx`: rich Ossie metadata constellation and selectable
  Northstar business ontology; previous small scenes are retained in
  `BusinessContextBasicIllustration.tsx`.
- `AgentConsumptionPreviews.tsx`: analyst artifact views and a configured MCP
  consumer illustration; `WorkingPathsTwoAudiencePreview.tsx` keeps the earlier
  two-path layout.
- `src/public/brand/product-modules/{studio,agent,dosi,ossie}.svg`: original flat
  module drawings reused in the architecture and local three-way comparison.

- `AgentConsumptionBasicPreviews.tsx` and
  `agent-consumption-basic-previews.css` preserve the initial simple analyst and
  assistant examples. Their selectors use `aud-basic-`; use an
  `hp-audiences-basic` wrapper when composing that older version. Active report
  previews now use `northstarReport.ts` (curated recorded customer economics),
  with cohort selection, KPIs, margin ranking, contribution share, return-rate
  comparison, customer details and an HTML report composition. They do not
  fabricate a time series or execute a live query.

- `AgentConsumptionRichPreviews.tsx` and
  `agent-consumption-rich-previews.css` preserve the earlier three-way rich
  report composition (`aud-rich-` selectors, `hp-audiences-rich` wrapper).
  Active `AgentConsumptionPreviews.tsx` now deliberately separates a
  parameterized dashboard illustration, a saved report snapshot, and a
  third-party-client answer. `audienceScenarioUi.ts` owns the paired EN/ZH
  scenario copy; `audience-scenarios.css` styles these distinct compositions.
