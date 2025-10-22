import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Datus Blog',
  description: 'Insights on AI-Native Data Engineering',
  base: '/blog/', // Required for GitHub Pages deployment

  appearance: false, // Disable theme toggle

  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }]
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
        text: 'Recent Posts',
        items: [
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
