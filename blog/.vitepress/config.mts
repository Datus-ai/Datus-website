import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Datus Blog',
  description: 'Insights on AI-Native Data Engineering',
  lang: 'en-US',
  base: '/blog/',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: 'https://datus.ai',
    transformItems(items) {
      return items.map((item) => {
        const raw = item.url || '/'
        const normalized = raw.startsWith('/') ? raw : `/${raw}`
        const url = normalized.startsWith('/blog/') ? normalized : `/blog${normalized}`
        return { ...item, url }
      })
    }
  },

  appearance: false,

  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'icon', href: '/blog/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large' }],
    ['meta', { property: 'og:site_name', content: 'Datus Blog' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:image', content: 'https://datus.ai/logo_dark.svg' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    // Google Analytics
    ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-EPVCH78EZP' }],
    ['script', {}, `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-EPVCH78EZP');`]
  ],

  themeConfig: {
    logo: '/logo_dark.svg',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'All Posts', link: '/posts/' },
      { text: 'Main Site', link: 'https://datus.ai/' }
    ],

    sidebar: [
      {
        text: 'What is Datus',
        items: [
          { text: 'The General Chat Agent', link: '/posts/meet-the-general-chat-agent' },
          { text: 'Meet Datus', link: '/posts/meet_datus' },
          { text: 'What Is a Data Engineering Agent?', link: '/posts/what-is-data-engineering-agent' },
          { text: 'From Human-First to the Agentic Data Stack', link: '/posts/agentic-data-stack' }
        ]
      },
      {
        text: 'Why agents, not copilots',
        items: [
          { text: 'Agents, Not Just Copilots', link: '/posts/why-data-engineering-needs-agents-not-just-copilots' },
          { text: 'Agentic vs Traditional Data Engineering', link: '/posts/agentic-data-engineering-vs-traditional-data-engineering' },
          { text: 'Autonomous Data Engineering in Practice', link: '/posts/what-autonomous-data-engineering-actually-looks-like-in-practice' }
        ]
      },
      {
        text: 'Architecture and pipelines',
        items: [
          { text: 'Storage Layer: Built for Every Environment', link: '/posts/datus-storage-layer' },
          { text: 'Agent Architecture: Prototype to Production', link: '/posts/data-engineering-agent-architecture' },
          { text: 'AI Data Pipeline Automation', link: '/posts/ai-data-pipeline-automation-use-cases-architecture-and-tradeoffs' },
          { text: 'Agentic ETL: What Changes', link: '/posts/agentic-etl-what-changes-beyond-traditional-etl' }
        ]
      },
      {
        text: 'Why context is everything',
        items: [
          { text: 'Semantic Context for Reliable Agents', link: '/posts/why-ai-agents-need-semantic-context-to-work-reliably' },
          { text: 'Structured Context Improves Agent Output', link: '/posts/how-structured-context-improves-ai-agent-output' },
          { text: 'Semantic Modeling for Agentic Analytics', link: '/posts/semantic-modeling-for-agentic-analytics-workflows' },
          { text: 'More Than Good Prompts', link: '/posts/why-reliable-data-agents-need-more-than-good-prompts' }
        ]
      },
      {
        text: 'Tooling and integrations',
        items: [
          { text: 'How MCP Changes Data Workflows', link: '/posts/how-mcp-changes-data-workflow-automation' },
          { text: 'Using MCP Extensions', link: '/posts/using-mcp-extensions-in-data-engineering-workflows' }
        ]
      },
      {
        text: 'In practice',
        items: [
          { text: '7 High-Impact Agent Use Cases', link: '/posts/data-engineering-agent-use-cases' },
          { text: 'Operating Model of an Agentic Data Team', link: '/posts/the-operating-model-of-an-agentic-data-team' }
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'Data Engineering Agent: Complete Guide', link: '/data-engineering-agent/' },
          { text: 'Layered Subagent Architecture', link: '/data-engineering-agent/data-engineering-agent-layered-subagent' }
        ]
      },
      {
        text: 'Releases',
        items: [
          { text: 'Datus 0.2.6: Agent with a Brain', link: '/posts/datus-0-2-6-release-equipping-the-agent-with-a-brain' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Datus-ai/Datus-agent' }
    ],

    footer: {
      message: 'Built with VitePress',
      copyright: 'Copyright © 2025 Datus.ai'
    }
  }
})
