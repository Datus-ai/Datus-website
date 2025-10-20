import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Datus Blog',
  description: 'Insights on AI-Native Data Engineering',
  // base: '/blog/', // Only needed for production deployment

  appearance: 'dark', // Force dark mode to match main site

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
          { text: 'Welcome to Datus Blog', link: '/posts/welcome' }
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
