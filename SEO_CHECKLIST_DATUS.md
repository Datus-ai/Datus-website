# Datus.ai SEO 专用检查清单（已执行版）

更新日期：2026-02-26
范围：主站 React + Blog(VitePress)

## A. 技术基础
- [x] 首页可访问（200）
- [x] Blog 可访问（/blog 与 /blog/）
- [x] robots.txt 可访问且允许核心抓取
- [x] sitemap.xml 可访问
- [x] 首页 canonical 已配置
- [ ] 线上域名 301 归一（需线上网关/Nginx验证）
- [ ] Search Console/Bing 提交验证（需控制台权限）

## B. 首页 SEO
- [x] title 唯一
- [x] meta description
- [x] canonical
- [x] Open Graph
- [x] Twitter Card
- [x] JSON-LD（Organization + WebSite）

## C. Blog SEO（本轮执行）
- [x] vitepress 升级到 1.6.4
- [x] /blog 页面可正常打开（修复白屏链路）
- [x] blog 首页 canonical
- [x] posts 索引页 title/description/canonical
- [x] meet_datus 文章补齐 title/description/og/canonical
- [x] welcome 文章补齐 title/description/og/canonical
- [x] layered-subagent 页面 canonical/og:url 统一为 clean URL（无 .html）
- [x] blog 构建通过并生成 sitemap

## D. 仍建议下一步
- [x] 为现有文章补齐独立 description 与 og:image（已完成主要页面）
- [ ] 跑 Lighthouse（首页 + 2个关键落地页）
- [ ] 评估主站 SSR/预渲染（长期提升抓取稳定性）

## 本次已修改文件
- index.html
- vite.config.ts
- src/public/robots.txt
- src/public/sitemap.xml
- blog/.vitepress/config.mts
- blog/index.md
- blog/posts/index.md
- blog/posts/meet_datus.md
- blog/data-engineering-agent/data-engineering-agent-layered-subagent.md
- blog/public/images/layered-subagent-for-data-engineering-agent.jpeg
- blog/public/images/The-Formula-for-Reliable-Agents.png
