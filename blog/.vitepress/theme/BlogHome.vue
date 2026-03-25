<script setup>
import { withBase } from 'vitepress'

// All posts with dates, sorted newest first — used to compute "latest"
const allPosts = [
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

// Posts from the last 30 days
const now = new Date('2026-03-25')
const thirtyDaysAgo = new Date(now)
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
const latestPosts = allPosts.filter(p => new Date(p.date) >= thirtyDaysAgo)

const sections = [
  {
    label: 'What is Datus',
    description: 'Start here. The problem, the product, and the thesis behind it.',
    posts: [
      { title: 'Meet the General Chat Agent: Your Data Co-Pilot That Actually Thinks', date: 'Mar 25, 2026', link: '/posts/meet-the-general-chat-agent' },
      { title: 'SQL Agents Are Broken Without Context. Meet Datus.', date: 'Oct 21, 2025', link: '/posts/meet_datus' },
      { title: 'What Is a Data Engineering Agent?', date: 'Mar 2, 2026', link: '/posts/what-is-data-engineering-agent' },
      { title: 'From Human-First Data Systems to the Agentic Data Stack', date: 'Mar 11, 2026', link: '/posts/agentic-data-stack' },
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
      <a href="https://datus.ai" class="bottom-link">Main site</a>
    </div>
  </div>
</template>
