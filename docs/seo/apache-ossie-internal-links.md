# Apache Ossie content roles and internal links

Updated October 30, 2026. This describes the local `codex/apache-ossie-pillar` work; no release, redirects or Apache outreach have occurred.

| Page | Intent | Link role |
| --- | --- | --- |
| `/apache-ossie/` (+ Chinese mirror) | Current standard overview | Receives definition-intent links; links to tutorials, implementations, tools, comparisons and historical context. |
| `/blog/open-semantic-interchange-osi/` | OSI origins, Apache transition and adoption | Keeps its URL and original publication date. Links to the pillar for current schema and examples. Historical/naming/governance references may continue to point here. |
| `/blog/first-native-apache-ossie-engine/` | Execution implementation | Current standard references point to the pillar; practical steps point to the quickstart; history links remain explicit. |
| `/blog/apache-ossie-dosi-quickstart/` | Runnable tutorial | Links to the pillar for concepts and retains task-specific implementation documentation. |
| Import/export blog guides | Conversion tasks | Definition references point to the pillar; actual work points to the converter; direction-specific guides cross-link. |
| Cube/dbt comparison articles and tools list | Evaluation | General definition links point to the pillar; comparisons retain their own intent and current support caveats. |
| `/blog/semantic-model-examples/` | Worked model and verified sample results | Links up to the pillar; keeps its independently tested example and original artifact versions. |
| Converter, field mapping and OSI Playground | Performing a task or checking mappings | Introductory standard-guide links point to the pillar; existing tool actions and official references remain. |
| Homepage, footer and Semantic Layer solution | Discovery and product adoption | Provide a recognizable pillar entry, while product CTAs retain their own destinations and tags. |
| `dosi.datus.ai` | Technical implementation docs | Remains separate. No relocation or canonical changes are required for the main-domain pillar. |

## Rules

- A topic owner is a content role, not a cross-page `rel=canonical`. Each distinct article, tool and locale stays self-canonical.
- Do not replace every historical OSI link or every official reference with the pillar. Link by the task the sentence describes.
- Do not add UTM to internal navigation or move published blog URLs. Shared Studio CTA attribution remains unchanged.
- The old overview was editorially refreshed as a history/adoption article; it is not redirected or removed. The engine article retains its execution intent and search URL.
- Correct dated support assertions when refreshing a comparison. Offline converters, product-native import/export and runtime support are separate claims.
- Detailed fact-check scope in this refresh: Cube/dbt converter support and blanketing claims about native import/export in the affected comparisons. This is not a blanket recertification of every product, price or benchmark in all legacy posts.

## Verification

Build both locales and the static blog; check canonical/hreflang/sitemap contracts; ensure new link targets exist and the changed articles retain their original `date`. Confirm five property selections highlight both YAML and JSON, switching format preserves selection, downloads parse to equivalent models, and both model representations remain in prerendered HTML. After release, compare complete 28-day GSC windows against the recorded baseline; do not present the new linking pattern as a guaranteed rank gain.

## Research references

- https://ossie.apache.org/updates/ossie-enters-apache-incubator/
- https://ossie.apache.org/ecosystem/
- https://github.com/apache/ossie-converters/tree/main/cube
- https://github.com/apache/ossie-converters/tree/main/dbt
- https://github.com/apache/ossie/blob/main/CONTRIBUTING.md

## Wider definition-link pass

The surrounding article corpus was also reviewed for links to the old overview. Definition-intent references were repointed to the new pillar, preserving their sentence wording. Explicit naming/history, historical launch, and working-group references retain the history article. These are link-only updates outside the focused refreshes above; they do not imply that unrelated facts in every legacy post were re-audited.
