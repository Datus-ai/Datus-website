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
        text: 'Data Engineering Agent Series',
        items: [
          { text: 'Complete Guide', link: '/data-engineering-agent/' },
          { text: 'Layered Subagent Architecture', link: '/data-engineering-agent/data-engineering-agent-layered-subagent' }
        ]
      },
      {
        text: 'Recent Posts',
        items: [
          { text: 'What Is a Data Engineering Agent? A Practical Guide with Datus', link: '/posts/what-is-data-engineering-agent' },
          { text: 'Data Engineering Agent Architecture: From Prototype to Production with Datus', link: '/posts/data-engineering-agent-architecture' },
          { text: '7 High-Impact Data Engineering Agent Use Cases (Powered by Datus)', link: '/posts/data-engineering-agent-use-cases' },
          { text: 'SQL agents are broken without context. Meet Datus.', link: '/posts/meet_datus' }
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
