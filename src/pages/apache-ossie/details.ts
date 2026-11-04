import type { Locale } from '../../i18n/config';

const en = {
 value: {
  eyebrow: 'Why use Apache Ossie?', title: 'Keep business definitions reusable.',
  body: 'Keep using your BI and analytics tools. Ossie provides a shared format for the compatible definitions you want to review, maintain, and reuse across them.',
  headers: ['How teams work today', 'What Ossie adds'],
  tabs: ['Reuse definitions', 'Connect tools', 'Make meaning explicit'],
  diagrams: [
   { nodes: ['BI tool', 'Analytics', 'AI app'], before: ['Metric copy A', 'Metric copy B', 'Metric copy C'], center: 'Shared definitions', after: 'Compatible consumers' },
   { nodes: ['BI models', 'Catalogs', 'Analytics', 'Modeling tools'], before: [], center: 'Apache Ossie', after: 'Supported conversion paths' },
   { nodes: ['SQL', 'Documents', 'Agent prompts'], before: ['Calculations', 'Business terms', 'Instructions'], center: 'Explicit model', after: 'Metrics · relationships · context' }
  ],
  rows: [
   { current: 'Maintain definitions separately in each BI or analytics tool.', benefit: 'Represent compatible datasets, metrics, and relationships in a shared model, reducing repeated modeling work.' },
   { current: 'Maintain a separate translation for each pair of tools.', benefit: 'Build supported conversion paths around one common format, reducing the number of translations to maintain as the stack grows.' },
   { current: 'Describe business logic across SQL, documents, and agent prompts.', benefit: 'Use those sources to build an explicit model of supported calculations, relationships, and context that people and compatible software can inspect.' }
  ],
  note: 'Ossie defines the exchange format; DOSI provides execution for compatible models. Neither replaces your BI tools or warehouse. Conversion coverage and calculation behavior still need validation in the target runtime.',
  link: 'Explore supported conversion paths'
 },
 format: 'Ossie models can be written in YAML or JSON. Each document declares its specification version; check that version against your validator and intended consumer.',
 ontology: {
  eyebrow: 'Semantic models + ontology', title: 'Connect calculations to business concepts.',
  body: 'The core semantic model describes datasets, fields, metrics, and their data relationships. The separate ontology specification describes business concepts, roles, relationships, and rules; mapping documents connect that conceptual model to semantic models.',
  layers: [
   { title: 'Business concepts', example: 'Customer → places → Order', body: 'Describe what things mean and how they relate, beyond a physical table name.' },
   { title: 'Ontology mappings', example: 'Concepts & roles ↔ datasets & fields', body: 'Connect the conceptual business vocabulary to its representation in semantic models.' },
   { title: 'Semantic definitions', example: 'orders.amount → revenue', body: 'Make source mappings and calculation expressions explicit for compatible consumers.' }
  ],
  note: 'Descriptions and synonyms in ai_context help interpretation, but are not a substitute for the ontology specification. Consumers need to document which ontology and mapping features they implement.',
  link: 'Read the upstream ontology specification'
 },
 exchange: {
  eyebrow: 'How interoperability works', title: 'One shared format. Fewer translations.',
  body: 'Instead of maintaining a separate translation for every pair of tools, use Ossie as the common exchange format. A supported converter imports or exports the definitions that its source and destination can represent.',
  tools: ['BI models', 'Modeling tools', 'Catalogs', 'Analytics platforms'],
  center: 'Apache Ossie', caption: 'YAML / JSON · shared definitions',
  action: 'Explore supported conversion paths', source: 'Official converter architecture',
  note: 'The hub is a document format, not a central data service. Arrows represent potential import/export paths, not a promise of bidirectional support for every tool. Review diagnostics and test the target behavior.'
 },
 agents: {
  eyebrow: 'How Datus uses Apache Ossie', title: 'From open definitions to agent action.',
  body: 'DOSI turns compatible Apache Ossie definitions into native SQL. Within Datus, that runtime sits alongside Datus Agent and Studio: agents work with shared business meaning, while teams build, review, and inspect the context behind their work.',
  steps: [
   { title: 'Discover', body: 'Find model names, available fields, metrics, and declared relationships.' },
   { title: 'Interpret', body: 'Use descriptions, synonyms, and instructions to connect a business question to model definitions.' },
   { title: 'Request', body: 'Call a compatible runtime through its supported interface to plan a supported query.' },
   { title: 'Inspect', body: 'Review the selected definitions and generated SQL; check results against the business question.' }
  ],
  note: 'Ossie defines the metadata. MCP, API, and CLI access are supplied by implementations, not automatically by an Ossie file. Shared context helps ground analysis; it does not guarantee an error-free answer.',
  link: 'Inspect DOSI execution',
  architectureNote: 'Apache Ossie (incubating) is an Apache Software Foundation project maintained by its community, not a Datus-owned product. This diagram shows how Datus uses the specification: DOSI executes compatible definitions. Datus and DOSI are independent of the ASF and are not ASF-endorsed products.',
  roles: [{name:'Apache Ossie',body:'The open specification describes semantic models and ontology. It does not execute a query by itself.'},{name:'DOSI',body:'The semantic runtime validates compatible definitions and compiles supported requests into native SQL. It can also be used independently.'},{name:'Datus',body:'Studio provides a shared workspace; Datus Agent carries out data engineering and analysis. Modeling is one part of that workflow.'}]
 },
 project: {
  eyebrow: 'Project, governance & ecosystem', title: 'An open standard, developed in public.',
  body: 'Formerly Open Semantic Interchange (OSI), Apache Ossie is undergoing incubation at the Apache Software Foundation. It has not graduated to an Apache top-level project. The July 10, 2026 project announcement describes the new name and governance home.',
  cards: [
   { title: 'Community governance', body: 'Public development, mailing lists, and discussion and voting on specification changes provide a vendor-neutral place to contribute.', label: 'Read the project announcement', href: 'https://ossie.apache.org/updates/ossie-enters-apache-incubator/' },
   { title: 'Version-aware adoption', body: 'The current core document identifies itself as a 0.2.0.dev0 development draft. This page’s SQL example was checked with DOSI 0.2.0, a separate product version. Pin and validate the specification you adopt.', label: 'Check the current core specification', href: 'https://github.com/apache/ossie/blob/main/core-spec/spec.md' },
   { title: 'Documented ecosystem support', body: 'The official directory includes Datus, Databricks, dbt Labs, Microsoft, Salesforce, and others. Participation, converters, native model reading, and runtime execution are different kinds of support; verify the capability you need.', label: 'Explore the official ecosystem', href: 'https://ossie.apache.org/ecosystem/' }
  ],
  checked: 'Sources checked October 30, 2026. Specification and implementation support continue to evolve.'
 },
 faq: [
  { q: 'What does an Apache Ossie YAML file look like?', a: 'It declares a specification version and model name, then describes datasets and fields, with relationships, metrics, and context as needed. YAML and JSON are both supported. The downloadable example on this page uses the 0.2.0.dev0 document shape and was checked with DOSI 0.2.0. Older examples may use a different wrapper; validate the version before reuse.' },
  { q: 'How does Apache Ossie differ from the dbt Semantic Layer?', a: 'Apache Ossie defines an open format for exchanging semantic metadata. The dbt Semantic Layer provides a modeling and metric-querying system. Supported converters can move compatible definitions between formats; coverage, expressions, and execution behavior still need validation. Our comparison guide explains the different roles.' },
  { q: 'How do AI agents use Apache Ossie metadata?', a: 'Agents can inspect the declared fields, metrics, relationships, descriptions, and AI context, then submit supported requests to a compatible consumer or runtime. DOSI supplies an execution path for compatible definitions. The document itself does not provide an agent protocol or guarantee correct answers.' },
  { q: 'Which companies support Apache Ossie?', a: 'The official ecosystem directory lists participants including Datus, Databricks, dbt Labs, Microsoft, and Salesforce. Inclusion does not mean every organization offers the same integration. Check the linked implementation details for import, export, native reading, and execution support.' },
  { q: 'How does the Ossie hub-and-spoke model work?', a: 'Ossie is the shared document format at the hub; converters connect vendor-specific formats as spokes. This reduces the need to build a separate converter for every pair of tools. It does not require a central data service, and unsupported semantics may still need changes after conversion.' }
 ]
};
export const OSSIE_DETAILS: Record<Locale, typeof en> = { en, zh: {
 value: {
  eyebrow: '为什么采用 Apache Ossie', title: '让业务定义持续复用。',
  body: '继续使用现有 BI 和分析工具。Ossie 为兼容的业务定义提供共同格式，方便团队审核、维护，并在不同工具间复用。',
  headers: ['现有做法', '采用 Ossie 的价值'],
  tabs: ['复用业务定义', '连接不同工具', '明确业务含义'],
  diagrams: [
   { nodes: ['BI 工具', '分析工具', 'AI 应用'], before: ['指标副本 A', '指标副本 B', '指标副本 C'], center: '共享定义', after: '兼容的使用方' },
   { nodes: ['BI 模型', '数据目录', '分析平台', '建模工具'], before: [], center: 'Apache Ossie', after: '受支持的转换路径' },
   { nodes: ['SQL', '文档', 'Agent 提示词'], before: ['计算逻辑', '业务术语', '指引'], center: '显式模型', after: '指标 · 关系 · 上下文' }
  ],
  rows: [
   { current: '在各 BI 或分析工具里分别维护定义。', benefit: '用共同模型承载兼容的数据集、指标与关系，减少重复建模。' },
   { current: '为每两个工具单独维护转换逻辑。', benefit: '围绕共同格式建立受支持的转换路径，减少技术栈扩展时需要维护的转换逻辑。' },
   { current: '在 SQL、文档和 Agent 提示词中分散描述业务逻辑。', benefit: '以这些内容为起点，将支持的计算、关系与上下文整理为显式模型，供团队和兼容工具检查。' }
  ],
  note: 'Ossie 定义交换格式，DOSI 为兼容模型提供执行能力。它们不替代现有 BI 工具或数仓；转换覆盖范围与计算行为仍需在目标运行时中验证。',
  link: '了解受支持的转换路径'
 },
 format: 'Ossie 模型可以使用 YAML 或 JSON。每个文档声明所用的规范版本；请确认校验器和目标使用方支持该版本。',
 ontology: {
  eyebrow: '语义模型与 Ontology', title: '把计算定义连接到业务概念。',
  body: '核心语义模型描述数据集、字段、指标及数据关系。独立的 Ontology 规范描述业务概念、角色、关系和规则；映射文档将概念层连接到语义模型。',
  layers: [
   { title: '业务概念', example: 'Customer → places → Order', body: '描述业务对象的含义和关系，超越物理表名。' },
   { title: 'Ontology 映射', example: '概念与角色 ↔ 数据集与字段', body: '把业务词汇连接到语义模型中的实际表示。' },
   { title: '语义定义', example: 'orders.amount → revenue', body: '明确源数据映射和计算表达式，供兼容的工具使用。' }
  ],
  note: 'ai_context 中的说明和同义词有助于理解定义，但不能替代 Ontology 规范。具体使用方需要说明自己实现了哪些 Ontology 与映射功能。',
  link: '阅读上游 Ontology 规范'
 },
 exchange: {
  eyebrow: '互操作如何发生', title: '一种共同格式，减少重复转换。',
  body: '使用 Ossie 作为共同交换格式，减少为每一对工具单独维护转换逻辑的工作。受支持的转换器负责导入或导出源格式和目标格式能够表达的定义。',
  tools: ['BI 模型', '建模工具', '数据目录', '分析平台'], center: 'Apache Ossie', caption: 'YAML / JSON · 共享定义',
  action: '查看支持的转换路径', source: '官方转换架构说明',
  note: '图中的中心是文档格式，不是集中式数据服务。连线表示可能的导入或导出路径，不代表每个工具都支持双向转换。请检查诊断，并验证目标环境的行为。'
 },
 agents: {
  eyebrow: 'Datus 如何使用 Apache Ossie', title: '从开放定义到 Agent 行动。',
  body: 'DOSI 将兼容的 Apache Ossie 定义编译为原生 SQL。在 Datus 中，这个运行时与 Datus Agent、Studio 共同工作：Agent 使用共享业务含义，团队构建、审核并检查工作背后的上下文。',
  steps: [
   { title: '发现定义', body: '读取模型名称、可用字段、指标和已声明的关系。' },
   { title: '理解问题', body: '结合说明、同义词和指引，将业务问题对应到模型定义。' },
   { title: '提交请求', body: '通过受支持的接口调用兼容运行时，规划受支持的查询。' },
   { title: '检查依据', body: '检查选用的定义、生成的 SQL，并根据业务问题核查结果。' }
  ],
  note: 'Ossie 定义元数据；MCP、API 和 CLI 接入能力由具体实现提供，不是模型文件自带的功能。共享上下文帮助分析建立依据，但不保证答案始终正确。',
  link: '检查 DOSI 执行过程',
  architectureNote: 'Apache Ossie（孵化中）是 Apache 软件基金会（ASF）旗下、由社区维护的项目，不属于 Datus。图中展示的是 Datus 对规范的使用关系：DOSI 执行兼容的定义。Datus 和 DOSI 独立于 ASF，并非 ASF 背书的产品。',
  roles: [{name:'Apache Ossie',body:'开放规范描述语义模型与 Ontology；规范文件本身不执行查询。'},{name:'DOSI',body:'语义运行时校验兼容定义，将受支持的请求编译为原生 SQL，也可以独立使用。'},{name:'Datus',body:'Studio 提供团队工作空间；Datus Agent 开展数据工程与分析，建模是其工作流的一部分。'}]
 },
 project: {
  eyebrow: '项目、治理与生态', title: '在公开协作中发展的开放规范。',
  body: 'Apache Ossie 原名 Open Semantic Interchange（OSI），目前正在 Apache Software Foundation 孵化，尚未成为 Apache 顶级项目。2026 年 7 月 10 日的官方公告介绍了新名称及治理归属。',
  cards: [
   { title: '社区治理', body: '公开开发、邮件列表及规范变更的讨论与投票，为厂商中立的协作提供基础。', label: '阅读官方公告', href: 'https://ossie.apache.org/updates/ossie-enters-apache-incubator/' },
   { title: '按版本采用', body: '当前核心文档标注为 0.2.0.dev0 开发草案。本页 SQL 示例使用 DOSI 0.2.0 验证，这是独立的产品版本。采用时请固定规范版本并校验模型。', label: '检查当前核心规范', href: 'https://github.com/apache/ossie/blob/main/core-spec/spec.md' },
   { title: '核实生态支持', body: '官方目录包含 Datus、Databricks、dbt Labs、Microsoft、Salesforce 等参与方。生态参与、转换器、原生读取和运行时执行是不同层次的支持，应按实际需求核实。', label: '查看官方生态目录', href: 'https://ossie.apache.org/ecosystem/' }
  ],
  checked: '来源核对日期：2026 年 10 月 30 日。规范和各实现的支持范围仍在演进。'
 },
 faq: [
  { q: 'Apache Ossie 的 YAML 文件是什么样的？', a: '文件声明规范版本和模型名称，再描述数据集与字段，并按需包含关系、指标和上下文。YAML 与 JSON 均受支持。本页提供下载的示例使用 0.2.0.dev0 文档结构，并通过 DOSI 0.2.0 验证。旧示例可能采用不同的外层结构，复用前请检查版本并校验。' },
  { q: 'Apache Ossie 与 dbt Semantic Layer 有什么区别？', a: 'Apache Ossie 定义交换语义元数据的开放格式；dbt Semantic Layer 提供建模与指标查询系统。受支持的转换器可以在格式之间移动兼容定义，但仍需验证覆盖范围、表达式和执行行为。相关比较指南进一步解释两者分工。' },
  { q: 'AI Agent 如何使用 Apache Ossie 元数据？', a: 'Agent 可以检查已声明的字段、指标、关系、说明和 AI 上下文，再向兼容的使用方或运行时提交受支持的请求。DOSI 为兼容定义提供执行路径。文档本身不提供 Agent 协议，也不保证答案正确。' },
  { q: '哪些公司支持 Apache Ossie？', a: '官方生态目录列有 Datus、Databricks、dbt Labs、Microsoft、Salesforce 等参与方。被收录不意味着每家提供相同的集成能力。请查看具体实现的说明，分别核实导入、导出、原生读取和执行支持。' },
  { q: 'Ossie 的 hub-and-spoke 模式如何工作？', a: 'Ossie 作为中心的共同文档格式，转换器作为连接各厂商格式的分支，从而减少为每一对工具单独开发转换器的需要。这不要求集中式数据服务；转换后仍可能需要调整目标系统不支持的语义。' }
 ]
}};
