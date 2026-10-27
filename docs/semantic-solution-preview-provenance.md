# Semantic layer solution visuals

Local redesign on `codex/website-visual-identity`. Updated 2026-10-22.

## Three-step product walkthrough

These are bounded HTML demonstrations of existing product controls, using public-facing Northstar sample content. They do not initialize a project, contact an agent, validate against a server, or save any files. Conversation text, the staged metric correction, and the merge request are illustrative content, rather than a recorded agent run or a real repository change. Approval and merge update only local component state. Other server actions remain disabled. The source product code is not bundled into the marketing site.

Reviewed product snapshot: `Datus-ai/Datus-saas@175ade478bd645afc1a04237e9b7819638c9c3f0`. Local source is `/Users/joanna/Documents/Website/output/datus-saas-source`.

| Marketing step | Actual source and scope |
| --- | --- |
| Existing knowledge | `packages/web-client/src/modules/project/initialize/initialize-modal/index.tsx`, `components/choose-source/index.tsx`, `components/confirm/index.tsx`, `helpers.ts`. The actual modal has workspace/upload source selection, a confirmation view, and an `AGENTS.md` output. It uses the bound datasource and selected files; it is not itself a one-click semantic-model generator. |
| Agent drafting | `packages/web-client/src/modules/ide/components/IdeFileExplorer`, `DatusEditor/SemanticActions`, `helpers/attach-file-to-chat.ts`; `packages/web-common/src/modules/chat/components/{ChatInput,AgentSelector}`. File tabs, attached-context chips, agent selection, Validate and Save & Sync correspond to these controls. The agent node exists in `Datus-agent@43b40d5`, `datus/agent/node/semantic_modeling_agentic_node.py`. |
| Review and evolution | `packages/web-client/src/modules/semantic-hub/components/merge-requests/{mr-detail.tsx,mr-detail.module.less}` and `metrics-tree/detail/lineage.tsx`. The marketing component adapts the existing header, tree diff, inline YAML diff, Checks / Conversation tabs, approval blocker, Approve and Merge actions. NorthstarLineage reuses all 32 nodes and 56 edges in the recorded graph. The final return-handling expression matches the supplied Northstar model; the previous cents-only expression and MR #12 are local fixtures, not historical activity. No backend API or Git operation is performed. |

Product labels were read from the corresponding `locales/en` and `locales/zh-CN` files and collected in `workflowProductCopy.ts`. Marketing translations follow the website terminology rules.

## Northstar excerpts

`northstarSnippets.ts` contains selected, unmodified lines from the supplied `Northstar-Premier-Demo/studio/northstar_premier.yaml`, `northstar_premier.ontology.yaml`, and `independent-reference.sql`. `# …` explicitly marks omitted lines; these excerpts are not complete executable replacement files. No connection settings, credentials, or real customer data are included.

## Reuse diagram and logos

The diagram shows one model, a common DOSI execution point, and example downstream tools. Category labels state the interfaces: SQL/results for BI workflows, MCP for agent clients, REST/Python for applications. BI logos illustrate destinations for query outputs; they do not claim a native DOSI connector or direct integration for every named BI application. Claude Code, Codex and Datus Agent are documented in the local DOSI `docs/agents/index.md` client table. Datus Studio is the existing product workspace.

Brand SVGs are preserved as downloaded; sources are listed in `src/public/integrations/logos/SOURCES.md`. The Datus symbol reuses the website's existing `brand-mark.svg`. No × partnership lockup or endorsement is implied.

## VI background

Rules reviewed: the independent VI repository's `AGENTS.md`, `VISUAL-IDENTITY.md`, `ASSET-CATALOG.md`, and `tokens.json` at `/Users/joanna/Documents/Datus-visual-identity`.

The production background uses exact copies of two approved source SVGs:

- `datus-visual-identity-v1/flat/loop-field-transparent.svg`
- `datus-visual-identity-v1/flat/relationship-map-transparent.svg`

Website copies live in `src/public/solutions/semantic-layer/`. CSS alpha masks preserve their geometry and stroke opacity while applying the VI's purple `#402DF3` on light surfaces and lavender `#B3A4FF` on dark surfaces. Watermark opacity is 10–13%, within the VI's suggested 8–18% range. The code remains actual code, partner logos keep their source artwork, and the background carries no typography, gradients, glow, blur or 3D.

Two built-in imagegen explorations were inspected and rejected for retaining glow/gradient shading, including the attempt referenced to approved motif PNGs. Neither raster is included in or loaded by the website. The final website uses the canonical vector assets to satisfy the approved VI precisely.

## Embedded conversion workbench

The solution page now imports the exact `SemanticConverterWorkbench` component used by `/tools/semantic-model-converter/`. It starts in the import direction through an optional `initialDirection` prop; the standalone tool retains its export default and both directions retain their separate temporary sessions. Source and output editing, file/folder upload, examples, diagnostics, confirmation dialogs, cancellation and local downloads all remain the existing implementation. The recorded marketing replay and its sample snapshot JSON were removed.

Conversion uses the existing public API and the existing privacy notice. A real Cube example import was checked from the embedded UI and returned Success with `model.ossie.yml`. Import/export switching preserved the generated import result. The 56 converter checks and solution-entry TypeScript checks passed. No customer models were used for QA.

The restored section heading is “Your business definitions. Independent of your stack.” Only the words open and vendor-neutral in the body are emphasized. The two sections now explain converting existing supported models into Ossie, then DOSI using compatible Ossie definitions as its execution foundation, followed by starting a Datus workflow. DOSI’s ELv2 license remains distinct from the open specification.

The Apache Ossie explanation was checked against https://ossie.apache.org/ on 2026-10-22: an open, vendor-neutral specification for semantic metadata exchange, formerly Open Semantic Interchange (OSI).

## Interaction and appearance

Product surfaces use white and neutral `#1e1e1e` in light/dark mode, separate from the VI page backgrounds. Downstream logos sit along wave paths with phased, non-rotating drift. They pause offscreen, when the document is hidden, on user pause and for reduced motion. Manual tabs have keyboard navigation. Bounded pointer hints run twice; the team review walkthrough repeats the next-action hint until that action is selected, then moves it to the next control. The converter uses the shared tool’s real request/loading states. The hero’s existing field extends behind the transparent header at the page top; the header becomes solid after scrolling.

## Earlier browser verification

Production build and solution-entry TypeScript check passed. Static HTML checks cover full EN/ZH body copy, unique element IDs, locale language tags, self-canonicals and the three-way hreflang cluster. Browser checks cover 320, 390, 768 and 1440 px widths without document overflow; light/dark product surfaces; no broken logo assets; conversion tab clicks and arrow-key navigation; local Open → Approved → Merged → Replay transitions in English and Chinese; waveform pause control. No console or hydration warnings appeared in the QA tab. These checks do not validate a real MR or deploy a model.

## Connected downstream artwork

The reuse graphic measures the DOSI hub and each wave’s actual port positions with ResizeObserver. Both strokes of every downstream wave now connect to the hub across desktop, tablet and stacked mobile layouts. The right relationship-map watermark was removed; the left loop motif remains on desktop and is hidden in the stacked mobile layout to keep all tool waves clear. This replaces fixed routing coordinates that could drift away from the tool waves at different viewport sizes.

## Website motion and review guidance — 2026-10-22

“Open definitions. Native execution.” now rotates through its four tabs every 6.5 seconds. The existing thick tab underline is the countdown track, with a single purple stroke showing time remaining. The shared timer and stroke pause offscreen, in a hidden document, or on Pause; resuming preserves progress, and manual selection starts a fresh countdown. Keyboard navigation pauses autoplay. Reduced-motion visitors navigate manually.

The Review with your team walkthrough guides the next action in sequence: Review YAML changes → Approve → Merge → Replay. Cues do not intercept clicks or perform any action themselves. These continue to be local demonstration states only.

Major sections across React marketing pages and generated blog pages share a subtle entrance effect. The homepage retains its existing custom hero entrance. Static/no-JavaScript HTML stays visible; reduced motion, printing, keyboard focus and fragment navigation reveal content immediately. These conventions are recorded in `CLAUDE.md` §6 and linked from `AGENTS.md`.

The production build, solution-entry/static-motion TypeScript check, and whitespace check passed for these changes. Generated English and Chinese solution HTML retain full copy, correct locale metadata and a single countdown underline for four tabs. Blog content pages load the shared entrance script and styles; legacy noindex redirect stubs remain redirects.

The local preview was restored at `http://127.0.0.1:4179/` and returned HTTP 200. Fresh browser verification of this motion revision remains incomplete: the browser security layer rejected observation of the prior connection-error tab, including after the operator refreshed it. No alternate browser surface was used to bypass that restriction. The viewport/browser checks above belong to the earlier revision and do not establish visual verification of these latest animations.

## Source mapping and calculation audit — 2026-10-22

Checked GitHub `Datus-ai/Datus-saas` main at `3bd08785ddfdf8759accd6df60f733ae2dd34194`, rather than relying solely on the earlier local snapshot. This audit does not change the model preview UI.

- `packages/web-client/src/components/semantic-explorer/views/overview/index.tsx` renders dataset cards with physical sources and fields, connected to metric cards with their expressions. Selecting a metric highlights related datasets and fields.
- `packages/web-client/src/components/semantic-explorer/components/detail-drawer/index.tsx` displays source SQL for query-backed datasets, or an expression and dialect for calculations, plus related upstream/downstream nodes. Field details show the containing dataset and metrics computed from the field.
- `packages/web-client/src/components/semantic-explorer/components/ontology-drawer/concept-form.tsx` displays the mapped dataset and editable concept properties with their mappings. This is distinct from the semantic overview.
- `packages/web-client/src/components/metric-editor/metric-form/index.tsx` and `expression-editor/index.tsx` provide SQL expressions per dialect or a composed metric formula; generated SQL for composed/advanced metrics is read-only. `metric-sources/index.tsx` shows referenced metrics and fields, with an expandable/searchable model-field reference.

The solution page's current `SemanticModelPreview` is a marketing composition, not a reproduction of those product views. Its three-column Source → Semantic model → Ontology table has no exact counterpart in these checked components. Its calculation cards show supplied Northstar expressions but do not reproduce the actual metric editor. Any subsequent fidelity update should use the existing overview/drawer/editor structures and correct dataset-field mappings rather than imply that this table is a product screen.

## Header and hero continuity — 2026-10-22

The shared navigation base and Nordic/home overrides now have no bottom border, so the header/hero boundary is continuous across React pages and generated blogs. This is a permanent rule in `CLAUDE.md` §7 and `AGENTS.md`; it does not remove internal product UI borders. The full production build passed after the stylesheet update.
