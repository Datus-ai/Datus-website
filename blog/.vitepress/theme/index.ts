import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import BlogHome from './BlogHome.vue'
import PostMeta from './PostMeta.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(PostMeta)
    })
  },
  enhanceApp({ app }) {
    app.component('BlogHome', BlogHome)
  }
}
