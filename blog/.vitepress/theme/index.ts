import DefaultTheme from 'vitepress/theme'
import BlogHome from './BlogHome.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('BlogHome', BlogHome)
  }
}
