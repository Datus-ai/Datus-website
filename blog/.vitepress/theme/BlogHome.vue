<script setup>
import { withBase } from 'vitepress'

// All posts with dates, sorted newest first — used to compute "latest"
const allPosts = [
  { title: 'SQL Was Never the Hard Part: How Datus Turns AI-Generated SQL into Data You Can Trust', description: 'Why reliable AI data engineering needs knowledge, planning, review, controlled execution, and reconciliation, not just SQL generation.', date: '2026-06-11', display: 'Jun 11, 2026', tag: 'Practice', link: '/posts/sql-was-never-the-hard-part' },
  { title: 'What Is a Data Engineering Agent? Definition, Examples & a 2026 Comparison', description: 'Four products now ship as a data engineering agent — but they are not the same thing. Definition, side-by-side comparison, and where persistent context separates agents from chat windows.', date: '2026-05-31', display: 'May 31, 2026', tag: 'Research', link: '/posts/what-is-data-engineering-agent-2026' },
  { title: 'What Is a Semantic Layer? Definition, Examples & How It Differs From a Metric Layer', description: 'The business translation layer between raw tables and analysts: what it includes, how it differs from metric layers and catalogs, and why static models break under AI agents.', date: '2026-05-31', display: 'May 31, 2026', tag: 'Glossary', link: '/posts/what-is-semantic-layer' },
  { title: 'Contextual Data Engineering: Why Every Data Engineering Agent Needs Evolvable Context', description: 'Contextual data engineering explained: schemas, semantics, and feedback loops for durable data agents.', date: '2026-06-01', display: 'Jun 1, 2026', tag: 'Research', link: '/posts/contextual-data-engineering' },
  { title: 'Best Data Engineering Agents in 2026: An Honest Comparison', description: 'Best data engineering agents in 2026 compared by stack fit, context, openness, and enterprise readiness.', date: '2026-06-02', display: 'Jun 2, 2026', tag: 'Comparison', link: '/posts/best-data-engineering-agents-2026' },
  { title: 'Open Source Data Engineering Agents: Why They Exist, When to Use One, and What Your Options Are', description: 'Open-source data engineering agents compared: Datus, Wren AI, Altimate, and when self-hosting is worth it.', date: '2026-06-02', display: 'Jun 2, 2026', tag: 'Comparison', link: '/posts/open-source-data-engineering-agents' },
  { title: 'How to Build Your First Data Engineering Agent in 15 Minutes', description: 'Build a first data engineering agent with Datus: install, ask questions, generate context, and create a subagent.', date: '2026-06-03', display: 'Jun 3, 2026', tag: 'Product', link: '/posts/build-your-first-data-engineering-agent' },
  { title: 'Data Engineering Agent vs. Claude Code: When to Use Which', description: 'Data engineering agent vs Claude Code: when persistent data context matters and when a coding agent is enough.', date: '2026-06-03', display: 'Jun 3, 2026', tag: 'Comparison', link: '/posts/data-engineering-agent-vs-claude-code' },
  { title: 'Data Engineering Agent vs. SQL Copilot: What\'s the Real Difference?', description: 'Data engineering agent vs SQL copilot: persistence, feedback, team context, and when each tool fits.', date: '2026-06-04', display: 'Jun 4, 2026', tag: 'Comparison', link: '/posts/data-engineering-agent-vs-sql-copilot' },
  { title: 'One-Person Data Team: How a Data Engineering Agent Multiplies Your Output', description: 'How a one-person data team uses a data engineering agent to reduce SQL translation work and ship self-service analytics.', date: '2026-06-04', display: 'Jun 4, 2026', tag: 'Product', link: '/posts/one-person-data-team' },
  { title: 'How a Context Engine Makes Data Engineering Agents More Accurate', description: 'How a context engine improves data engineering agent accuracy with schemas, validated SQL, and feedback loops.', date: '2026-06-01', display: 'Jun 1, 2026', tag: 'Research', link: '/posts/context-engine-data-engineering-agent-accuracy' },
  { title: 'MCP and Data Engineering: The Protocol That Connects Your Entire Stack', description: 'MCP for data engineering: how agents connect to databases, orchestrators, quality tools, and context services.', date: '2026-06-02', display: 'Jun 2, 2026', tag: 'Research', link: '/posts/mcp-data-engineering' },
  { title: 'What an Enterprise Data Engineering Agent Actually Needs', description: 'Enterprise data engineering agent requirements: shared context, RBAC, auditability, reliability, and governance.', date: '2026-06-03', display: 'Jun 3, 2026', tag: 'Research', link: '/posts/enterprise-data-engineering-agent' },
  { title: 'Subagents: How to Ship Domain-Specific Data Agents Without Training a Model', description: 'Subagents explained: domain-specific data agents built from scoped context, feedback, and governed access.', date: '2026-06-04', display: 'Jun 4, 2026', tag: 'Product', link: '/posts/subagents-domain-specific-data-agents' },
  { title: 'What Is Text-to-SQL? Definition, How It Works & Why Context Matters', description: 'Text-to-SQL definition, NL2SQL pipeline stages, accuracy limits, and how data engineering agents improve with persistent context.', date: '2026-06-07', display: 'Jun 7, 2026', tag: 'Glossary', link: '/posts/what-is-text-to-sql' },
  { title: 'What Is Schema Linking? Definition, Challenges & How Agents Map NL to Columns', description: 'Schema linking definition for text-to-SQL, common failure modes, and how dual-dimension context improves column resolution.', date: '2026-06-07', display: 'Jun 7, 2026', tag: 'Glossary', link: '/posts/what-is-schema-linking' },
  { title: 'What Is RAG for Data Engineering? Retrieval, Context & Agent Accuracy', description: 'RAG definition for data engineering: retrieving schema, metrics, and SQL history to ground NL2SQL and data engineering agents.', date: '2026-06-07', display: 'Jun 7, 2026', tag: 'Glossary', link: '/posts/rag-data-engineering' },
  { title: 'What Is a Data Catalog? Definition, Tools & How It Differs From Agent Context', description: 'Data catalog definition, popular tools, and why data engineering agents need context engines beyond discovery metadata.', date: '2026-06-07', display: 'Jun 7, 2026', tag: 'Glossary', link: '/posts/what-is-data-catalog' },
  { title: 'What Is Data Mesh? Definition, Principles & How Domain Agents Map to It', description: 'Data mesh definition, four principles, comparison to data fabric, and how subject trees and subagents align with domain ownership.', date: '2026-06-08', display: 'Jun 8, 2026', tag: 'Glossary', link: '/posts/what-is-data-mesh' },
  { title: 'What Is a Data Agent? How It Differs From a Data Engineering Agent', description: 'Data agent definition, types, capabilities, and how a data engineering agent fits as the specialized subclass that builds and evolves data context.', date: '2026-06-08', display: 'Jun 8, 2026', tag: 'Glossary', link: '/posts/what-is-data-agent' },
  { title: 'What Is a Metric Layer? Definition, Examples & How It Differs From a Semantic Layer', description: 'Metric layer definition, MetricFlow examples, semantic layer vs metric layer differences, and why AI agents need standardized metrics.', date: '2026-06-08', display: 'Jun 8, 2026', tag: 'Glossary', link: '/posts/what-is-metric-layer' },
  { title: 'What Is a Semantic Model? Definition, Examples & How It Differs From a Semantic View', description: 'Semantic model definition, key components, how it fits into a semantic layer, and how it differs from warehouse-native semantic views.', date: '2026-06-08', display: 'Jun 8, 2026', tag: 'Glossary', link: '/posts/what-is-semantic-model' },
  { title: 'Semantic Layer vs Ontology: What\'s the Difference and Why It Matters for AI Agents', description: 'How semantic layers and ontologies relate, where they diverge, and why understanding both matters for building AI agents that can trust data.', date: '2026-06-09', display: 'Jun 9, 2026', tag: 'Glossary', link: '/posts/semantic-layer-vs-ontology' },
  { title: 'Open Semantic Interchange (OSI): What the New Standard Means for Data Engineering and AI Agents', description: 'A complete guide to the Open Semantic Interchange (OSI) specification — what it standardizes, who\'s behind it, and why portable semantics matter for AI agents.', date: '2026-06-09', display: 'Jun 9, 2026', tag: 'Research', link: '/posts/open-semantic-interchange-osi' },
  { title: 'dbt Semantic Layer & MetricFlow: A Complete Guide for Data Engineers', description: 'How dbt Semantic Layer and MetricFlow work, what they mean for data engineering teams, and how they fit with data engineering agents.', date: '2026-06-09', display: 'Jun 9, 2026', tag: 'Research', link: '/posts/dbt-semantic-layer-metricflow' },
  { title: 'Cube.dev: From Semantic Layer Pioneer to Agentic Analytics Platform', description: 'How Cube.dev evolved from an open-source semantic layer to the D3 Agentic Analytics platform, and what its trajectory means for data engineering.', date: '2026-06-09', display: 'Jun 9, 2026', tag: 'Research', link: '/posts/cube-agentic-analytics' },
  { title: 'GoodData: How a 17-Year BI Company Became an AI-Native Analytics Platform', description: 'GoodData\'s evolution from cloud BI startup to GoodData.AI — what it reveals about the industry shift toward AI-native analytics and the role of the semantic layer.', date: '2026-06-10', display: 'Jun 10, 2026', tag: 'Research', link: '/posts/what-is-gooddata' },
  { title: 'AI-Native Data Platforms: Why the Next Generation Needs Data Engineering Agents, Not Just Copilots', description: 'What defines an AI-native data platform, how it differs from platforms with bolted-on AI features, and why data engineering agents are the missing infrastructure layer.', date: '2026-06-10', display: 'Jun 10, 2026', tag: 'Research', link: '/posts/ai-native-data-platforms' },
  { title: 'Platform-Native Data Engineering Agents Compared: Cortex Code, Genie Code, and BigQuery DE Agent', description: 'A detailed comparison of Snowflake Cortex Code, Databricks Genie Code, and Google BigQuery Data Engineering Agent — and the case for open, cross-stack alternatives.', date: '2026-06-10', display: 'Jun 10, 2026', tag: 'Research', link: '/posts/platform-native-data-agents-compared' },
  { title: 'Best Data Engineering Agents in 2026: An Honest Comparison', description: 'Best data engineering agents in 2026 compared by stack fit, context, openness, and enterprise readiness.', date: '2026-06-10', display: 'Jun 10, 2026', tag: 'Research', link: '/posts/best-data-engineering-agents' },
  { title: 'Make Data Agents Usable: Ask, Explore, and Control with Confidence', description: 'Ask User, session management, Explore, and action display make Datus agents easier to trust and control.', date: '2026-04-02', display: 'Apr 2, 2026', tag: 'Product', link: '/posts/make-data-agents-truly-usable-ask-explore-and-control-with-confidence' },
  { title: 'Beyond SQL: How Datus Integrates With Your Entire Data Toolchain', description: 'How MCP and Skills connect Datus to your data catalog, metric layer, scripts, and quality workflows.', date: '2026-04-02', display: 'Apr 2, 2026', tag: 'Tooling', link: '/posts/beyond-sql-how-datus-integrates-with-your-entire-data-toolchain' },
  { title: 'Meet the General Chat Agent: Your Data Co-Pilot That Actually Thinks', description: 'A conversational data co-pilot that supports exploration, investigation, documentation, and knowledge-building.', date: '2026-03-25', display: 'Mar 25, 2026', tag: 'Product', link: '/posts/meet-the-general-chat-agent' },
  { title: 'Datus Storage Layer: A Foundation Built for Every Environment', description: 'A pluggable storage adapter layer for enterprise deployments, portable knowledge bases, and backend flexibility.', date: '2026-03-25', display: 'Mar 25, 2026', tag: 'Architecture', link: '/posts/datus-storage-layer' },
  { title: 'Datus 0.2.6: Equipping the Agent with a Brain', description: 'A more general chat agent, stronger planning, deeper exploration, pluggable storage, and broader ecosystem support.', date: '2026-03-20', display: 'Mar 20, 2026', tag: 'Release', link: '/posts/datus-0-2-6-release-equipping-the-agent-with-a-brain' },
  { title: 'Agentic Data Engineering vs Traditional Data Engineering', description: 'How agentic data engineering differs across workflows, tooling, team structure, and reliability.', date: '2026-03-16', display: 'Mar 16, 2026', tag: 'Concepts', link: '/posts/agentic-data-engineering-vs-traditional-data-engineering' },
  { title: 'AI Data Pipeline Automation: Use Cases, Architecture, and Tradeoffs', description: 'What AI data pipeline automation is, where it works, and which tradeoffs matter.', date: '2026-03-16', display: 'Mar 16, 2026', tag: 'Architecture', link: '/posts/ai-data-pipeline-automation-use-cases-architecture-and-tradeoffs' },
  { title: 'Why AI Agents Need Semantic Context to Work Reliably', description: 'Semantic context gives AI agents the definitions, relationships, and constraints for reliable reasoning.', date: '2026-03-16', display: 'Mar 16, 2026', tag: 'Context', link: '/posts/why-ai-agents-need-semantic-context-to-work-reliably' },
  { title: 'How MCP Changes Data Workflow Automation', description: 'How MCP gives AI agents structured tool access and safer execution paths.', date: '2026-03-16', display: 'Mar 16, 2026', tag: 'Tooling', link: '/posts/how-mcp-changes-data-workflow-automation' },
  { title: 'Why Data Engineering Needs Agents, Not Just Copilots', description: 'Why agents matter, how they differ from copilots, and what agentic data engineering looks like.', date: '2026-03-16', display: 'Mar 16, 2026', tag: 'Concepts', link: '/posts/why-data-engineering-needs-agents-not-just-copilots' },
  { title: 'From Human-First Data Systems to the Agentic Data Stack', description: 'The rise of the Agentic Data Stack and why Datus is positioning itself as a data engineering agent.', date: '2026-03-11', display: 'Mar 11, 2026', tag: 'Product', link: '/posts/agentic-data-stack' },
  { title: 'What Is a Data Engineering Agent?', description: 'What a data engineering agent is, why context matters, and how Datus delivers reliable workflows.', date: '2026-03-02', display: 'Mar 2, 2026', tag: 'Concepts', link: '/posts/what-is-data-engineering-agent' },
  { title: 'Data Engineering Agent Architecture: From Prototype to Production', description: 'A practical architecture blueprint for data engineering agents with Datus patterns.', date: '2026-03-02', display: 'Mar 2, 2026', tag: 'Architecture', link: '/posts/data-engineering-agent-architecture' },
  { title: '7 High-Impact Data Engineering Agent Use Cases', description: 'Practical use cases and how Datus helps teams improve speed, quality, and governance.', date: '2026-03-02', display: 'Mar 2, 2026', tag: 'Practice', link: '/posts/data-engineering-agent-use-cases' },
]

const latestPosts = allPosts
  .slice()
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 5)

const sections = [
  {
    label: 'What is Datus',
    description: 'Start here. The problem, the product, and the thesis behind it.',
    posts: [
      { title: 'Meet the General Chat Agent: Your Data Co-Pilot That Actually Thinks', date: 'Mar 25, 2026', link: '/posts/meet-the-general-chat-agent' },
      { title: 'SQL Agents Are Broken Without Context. Meet Datus.', date: 'Oct 21, 2025', link: '/posts/meet_datus' },
      { title: 'From Human-First Data Systems to the Agentic Data Stack', date: 'Mar 11, 2026', link: '/posts/agentic-data-stack' },
    ]
  },
  {
    label: 'Data Engineering Agent',
    description: 'The category, the comparisons, and how to build with one — our core cluster.',
    posts: [
      { title: 'SQL Was Never the Hard Part: How Datus Turns AI-Generated SQL into Data You Can Trust', date: 'Jun 11, 2026', link: '/posts/sql-was-never-the-hard-part' },
      { title: 'What Is a Data Engineering Agent? Definition, Examples & a 2026 Comparison', date: 'May 31, 2026', link: '/posts/what-is-data-engineering-agent-2026' },
      { title: 'What Is a Data Engineering Agent? A Practical Guide with Datus', date: 'Mar 2, 2026', link: '/posts/what-is-data-engineering-agent' },
      { title: 'Contextual Data Engineering: Why Every Agent Needs Evolvable Context', date: 'Jun 1, 2026', link: '/posts/contextual-data-engineering' },
      { title: 'Best Data Engineering Agents in 2026: An Honest Comparison', date: 'Jun 2, 2026', link: '/posts/best-data-engineering-agents-2026' },
      { title: 'Open Source Data Engineering Agents', date: 'Jun 2, 2026', link: '/posts/open-source-data-engineering-agents' },
      { title: 'How to Build Your First Data Engineering Agent in 15 Minutes', date: 'Jun 3, 2026', link: '/posts/build-your-first-data-engineering-agent' },
      { title: 'Data Engineering Agent vs. Claude Code: When to Use Which', date: 'Jun 3, 2026', link: '/posts/data-engineering-agent-vs-claude-code' },
      { title: 'Data Engineering Agent vs. SQL Copilot: What\'s the Real Difference?', date: 'Jun 4, 2026', link: '/posts/data-engineering-agent-vs-sql-copilot' },
      { title: 'One-Person Data Team: How a Data Engineering Agent Multiplies Your Output', date: 'Jun 4, 2026', link: '/posts/one-person-data-team' },
      { title: 'How a Context Engine Makes Data Engineering Agents More Accurate', date: 'Jun 1, 2026', link: '/posts/context-engine-data-engineering-agent-accuracy' },
      { title: 'MCP and Data Engineering: The Protocol That Connects Your Entire Stack', date: 'Jun 2, 2026', link: '/posts/mcp-data-engineering' },
      { title: 'What an Enterprise Data Engineering Agent Actually Needs', date: 'Jun 3, 2026', link: '/posts/enterprise-data-engineering-agent' },
      { title: 'Subagents: How to Ship Domain-Specific Data Agents Without Training a Model', date: 'Jun 4, 2026', link: '/posts/subagents-domain-specific-data-agents' },
      { title: 'Best Data Engineering Agents in 2026: An Honest Comparison', date: 'Jun 10, 2026', link: '/posts/best-data-engineering-agents' },
      { title: 'AI-Native Data Platforms: Why the Next Generation Needs Agents, Not Just Copilots', date: 'Jun 10, 2026', link: '/posts/ai-native-data-platforms' },
      { title: 'Platform-Native Data Engineering Agents Compared: Cortex Code, Genie Code, and BigQuery DE Agent', date: 'Jun 10, 2026', link: '/posts/platform-native-data-agents-compared' },
    ]
  },
  {
    label: 'Semantic Layer',
    description: 'What a semantic layer is, and how it differs from a metric layer, model, ontology, or catalog.',
    posts: [
      { title: 'What Is a Semantic Layer? Definition, Examples & How It Differs From a Metric Layer', date: 'May 31, 2026', link: '/posts/what-is-semantic-layer' },
      { title: 'What Is a Metric Layer? Definition, Examples & How It Differs From a Semantic Layer', date: 'Jun 8, 2026', link: '/posts/what-is-metric-layer' },
      { title: 'What Is a Semantic Model? Definition, Examples & How It Differs From a Semantic View', date: 'Jun 8, 2026', link: '/posts/what-is-semantic-model' },
      { title: 'Semantic Layer vs Ontology: What Differs and Why It Matters for AI Agents', date: 'Jun 9, 2026', link: '/posts/semantic-layer-vs-ontology' },
      { title: 'Open Semantic Interchange (OSI): What the New Standard Means for AI Agents', date: 'Jun 9, 2026', link: '/posts/open-semantic-interchange-osi' },
      { title: 'dbt Semantic Layer & MetricFlow: A Complete Guide for Data Engineers', date: 'Jun 9, 2026', link: '/posts/dbt-semantic-layer-metricflow' },
      { title: 'Cube.dev: From Semantic Layer Pioneer to Agentic Analytics Platform', date: 'Jun 9, 2026', link: '/posts/cube-agentic-analytics' },
      { title: 'GoodData: How a 17-Year BI Company Became an AI-Native Analytics Platform', date: 'Jun 10, 2026', link: '/posts/what-is-gooddata' },
    ]
  },
  {
    label: 'Glossary',
    description: 'Core data engineering terms — defined, with how they connect to agents and context.',
    posts: [
      { title: 'What Is Text-to-SQL? Definition, How It Works & Why Context Matters', date: 'Jun 7, 2026', link: '/posts/what-is-text-to-sql' },
      { title: 'What Is Schema Linking? Definition, Challenges & How Agents Map NL to Columns', date: 'Jun 7, 2026', link: '/posts/what-is-schema-linking' },
      { title: 'What Is RAG for Data Engineering? Retrieval, Context & Agent Accuracy', date: 'Jun 7, 2026', link: '/posts/rag-data-engineering' },
      { title: 'What Is a Data Catalog? Definition, Tools & How It Differs From Agent Context', date: 'Jun 7, 2026', link: '/posts/what-is-data-catalog' },
      { title: 'What Is Data Mesh? Definition, Principles & How Domain Agents Map to It', date: 'Jun 8, 2026', link: '/posts/what-is-data-mesh' },
      { title: 'What Is a Data Agent? How It Differs From a Data Engineering Agent', date: 'Jun 8, 2026', link: '/posts/what-is-data-agent' },
    ]
  },
  {
    label: 'Why agents, not copilots',
    description: 'The shift from assistive AI to autonomous data workflows.',
    posts: [
      { title: 'Why Data Engineering Needs Agents, Not Just Copilots', date: 'Mar 16, 2026', link: '/posts/why-data-engineering-needs-agents-not-just-copilots' },
      { title: 'Agentic Data Engineering vs Traditional Data Engineering', date: 'Mar 16, 2026', link: '/posts/agentic-data-engineering-vs-traditional-data-engineering' },
      { title: 'What Autonomous Data Engineering Actually Looks Like in Practice', date: 'Mar 16, 2026', link: '/posts/what-autonomous-data-engineering-actually-looks-like-in-practice' },
    ]
  },
  {
    label: 'Architecture and pipelines',
    description: 'How Datus works under the hood — agent design, storage, ETL, and pipeline automation.',
    posts: [
      { title: 'Datus Storage Layer: A Foundation Built for Every Environment', date: 'Mar 25, 2026', link: '/posts/datus-storage-layer' },
      { title: 'Data Engineering Agent Architecture: From Prototype to Production', date: 'Mar 2, 2026', link: '/posts/data-engineering-agent-architecture' },
      { title: 'AI Data Pipeline Automation: Use Cases, Architecture, and Tradeoffs', date: 'Mar 16, 2026', link: '/posts/ai-data-pipeline-automation-use-cases-architecture-and-tradeoffs' },
      { title: 'Agentic ETL: What Changes Beyond Traditional ETL', date: 'Mar 16, 2026', link: '/posts/agentic-etl-what-changes-beyond-traditional-etl' },
    ]
  },
  {
    label: 'Why context is everything',
    description: 'Semantic models, structured context, and what makes agents reliable.',
    posts: [
      { title: 'Why AI Agents Need Semantic Context to Work Reliably', date: 'Mar 16, 2026', link: '/posts/why-ai-agents-need-semantic-context-to-work-reliably' },
      { title: 'How Structured Context Improves AI Agent Output', date: 'Mar 16, 2026', link: '/posts/how-structured-context-improves-ai-agent-output' },
      { title: 'Semantic Modeling for Agentic Analytics Workflows', date: 'Mar 16, 2026', link: '/posts/semantic-modeling-for-agentic-analytics-workflows' },
      { title: 'Why Reliable Data Agents Need More Than Good Prompts', date: 'Mar 16, 2026', link: '/posts/why-reliable-data-agents-need-more-than-good-prompts' },
    ]
  },
  {
    label: 'Tooling and integrations',
    description: 'MCP, extensions, and how agents connect to real data systems.',
    posts: [
      { title: 'How MCP Changes Data Workflow Automation', date: 'Mar 16, 2026', link: '/posts/how-mcp-changes-data-workflow-automation' },
      { title: 'Using MCP Extensions in Data Engineering Workflows', date: 'Mar 16, 2026', link: '/posts/using-mcp-extensions-in-data-engineering-workflows' },
    ]
  },
  {
    label: 'In practice',
    description: 'Real use cases and how agentic data teams operate.',
    posts: [
      { title: '7 High-Impact Data Engineering Agent Use Cases', date: 'Mar 2, 2026', link: '/posts/data-engineering-agent-use-cases' },
      { title: 'The Operating Model of an Agentic Data Team', date: 'Mar 16, 2026', link: '/posts/the-operating-model-of-an-agentic-data-team' },
    ]
  },
  {
    label: 'Releases',
    posts: [
      { title: 'Datus 0.2.6: Equipping the Agent with a Brain', date: 'Mar 20, 2026', link: '/posts/datus-0-2-6-release-equipping-the-agent-with-a-brain' },
      { title: 'Welcome to Datus Blog', date: 'Jan 20, 2025', link: '/posts/welcome' },
    ]
  }
]
</script>

<template>
  <div class="blog-home">
    <header class="blog-header">
      <h1 class="blog-title">Datus Blog</h1>
      <p class="blog-description">
        How we think about data engineering agents, structured context,
        and turning workflows into reliable execution.
      </p>
    </header>

    <!-- Latest posts — auto-scrolling marquee, pauses on hover -->
    <div class="latest-section">
      <div class="section-label">Latest</div>
      <div class="latest-scroll" ref="scrollRef">
        <div class="latest-track">
          <!-- Duplicate cards for seamless loop -->
          <a
            v-for="(post, i) in [...latestPosts, ...latestPosts]"
            :key="post.link + '-' + i"
            :href="withBase(post.link)"
            class="latest-card"
          >
            <div class="latest-tag">{{ post.tag }}</div>
            <div class="latest-title">{{ post.title }}</div>
            <div class="latest-desc">{{ post.description }}</div>
            <div class="latest-date">{{ post.display }}</div>
          </a>
        </div>
      </div>
    </div>

    <!-- Categorized sections -->
    <div v-for="section in sections" :key="section.label" class="post-section">
      <div class="section-label">{{ section.label }}</div>
      <p v-if="section.description" class="section-description">{{ section.description }}</p>
      <ul class="post-list">
        <li v-for="post in section.posts" :key="post.link" class="post-item">
          <a :href="withBase(post.link)" class="post-link">
            <span class="post-title">{{ post.title }}</span>
            <span v-if="post.date" class="post-date">{{ post.date }}</span>
          </a>
        </li>
      </ul>
    </div>

    <div class="bottom-links">
      <a :href="withBase('/posts/')" class="bottom-link">All posts</a>
      <a href="https://docs.datus.ai" class="bottom-link">Docs</a>
      <a href="https://github.com/Datus-ai/Datus-agent" class="bottom-link">GitHub</a>
      <a href="https://studio.datus.ai/overview" class="bottom-link">Studio</a>
      <a href="https://datus.ai" class="bottom-link">Main site</a>
    </div>
  </div>
</template>
