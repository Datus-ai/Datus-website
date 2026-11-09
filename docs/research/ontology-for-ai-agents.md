# Ontology for AI agents: research and page decisions

Research date: 2026-11-09. Page: `/solutions/ontology/`, with a Chinese mirror. This is a solution page, not a replacement for the existing ontology educational articles.

## Questions to answer

| Reader question | Page treatment | Evidence |
| --- | --- | --- |
| What does ontology add beyond tables and metric names? | Concepts, relationship roles and mappings to executable definitions. | DOSI ontology reference; Juan Sequeda on the missing mapping layer. |
| How is this different from a semantic layer, knowledge graph or RAG? | A short complementary-role comparison, without claiming ontology replaces retrieval. | Practitioner writing and product architecture. |
| How does business meaning affect an actual query? | The reused Northstar ontology, lineage and recorded execution preview; a conceptual before/after business-knowledge diagram. | Existing Northstar demo artifacts and the DOSI reference. |
| Can an LLM build it all? Who approves it? | Agent assistance, domain-owner review, mapping validation and iterative scope. | Talisman's ontology pipeline; public discussion questions. |
| Must every agent use an ontology or a graph database? | Start where ambiguous concepts and reusable relationships justify it. Avoid universal requirements. | Practitioner recommendations; DOSI implementation. |
| What can teams inspect and what is supported today? | Defined mappings, generated SQL and source references; explicit experimental status. | DOSI documentation. |

## Primary practitioner references

- [Juan Sequeda: ServiceNow is joining Open Semantic Interchange](https://juansequeda.substack.com/p/servicenow-is-joining-open-semantic), June 10, 2026. Supports portable business meaning and starting with a bounded use case. We paraphrase the architectural perspective; we do not reproduce benchmark claims or imply an endorsement of Datus.
- [Jessica Talisman: The Ontology Pipeline](https://moderndata101.substack.com/p/the-ontology-pipeline), March 20, 2025. Supports deliberate vocabulary, metadata and relationship modeling rather than treating an LLM-generated graph as a finished ontology.
- [Sequeda: semantic strategies and the mapping layer](https://www.linkedin.com/posts/juansequeda_most-semantic-strategies-are-missing-one-activity-7361374198776164353-3mCm). Publicly indexed discussion distinguishes business, mapping and technical metadata.

## Public questions that informed the FAQ

Agent Reach / Exa exposed public indexed extracts from these threads. Signed-in Reddit and LinkedIn access was not available; these are discovery signals, not a representative survey or independently verified complete discussion.

- [AI-generated semantic layers](https://www.reddit.com/r/OntologyEngineering/comments/1u53ag4/how_to_use_ai_to_generate_a_semantic_layer/): human review, grain and validation questions.
- [Building an AI knowledge system](https://www.reddit.com/r/OntologyEngineering/comments/1vi6m0m/need_guidance_on_building_an_ai_knowledge/): choosing a narrow vocabulary and reviewing entity merges.
- [LLM-driven ontology toolkit](https://www.reddit.com/r/OntologyEngineering/comments/1saeh9u/weve_been_building_an_llmdriven_ontology_toolkit/): consistent vocabulary and human/machine-readable definitions.
- [Validating an ontology](https://www.reddit.com/r/OntologyEngineering/comments/1rmabzw/validating_an_ontology/): logical validity versus correctness in the application.

Anonymous posts are not presented on the public page as expert testimony. No search-volume or ranking forecast was inferred from these discussions.

## Product evidence and boundaries

- [DOSI ontology reference](https://dosi.datus.ai/reference/ontology/): mapping documents, relationship paths, closed values, metric-relative paths; ontology is experimental and interfaces may change.
- [Datus ontology analyst](https://docs.datus.ai/dev/subagent/ontology_analyst/): actual documented aviation workflow and concept discovery.
- [DOSI engine integration](https://docs.datus.ai/dev/semantic/dosi_engine/): Agent integration and model/mapping configuration.

The page reuses the existing Northstar product preview, opening on ontology and allowing concept, lineage and execution exploration. Execution output is recorded demo evidence, not a new live run. A separate conceptual diagram explains SME knowledge becoming reviewed relationships and semantic definitions. It makes no customer outcome, performance or accounting-validation claim. Ontology and mapping artifacts require preparation and review; the page does not promise automatic ontology creation, arbitrary reasoning or cross-warehouse federation. Practitioner views inform the prose without standalone endorsement cards.

Apache Ossie is the open specification; DOSI is an independently developed runtime licensed under Elastic License 2.0. Datus Agent is open source. These must not be conflated.

## Internal linking

The Solutions navigation, footer and semantic-layer solution page link to the new page. The new page links back to the semantic-layer solution, the Apache Ossie pillar, existing ontology articles and implementation documentation. Existing educational posts retain their intent and URLs.
