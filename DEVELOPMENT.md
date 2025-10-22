# Development Guide

## Quick Start

**Development (Daily Use)**
```bash
npm run dev  # http://localhost:5173
```
Hot reload enabled. Changes take effect immediately.

**Preview (Before Deploy)**
```bash
npm run build:all && npm run preview  # http://localhost:4173
```
Tests production build. Requires rebuild after changes.

## Adding a Blog Post

1. **Create file**: `blog/posts/my-post.md`
```markdown
---
title: My Post Title
date: 2025-10-22
---
# Content here...
```

2. **Update sidebar**: `blog/.vitepress/config.mts`
```typescript
items: [
  { text: 'My Post Title', link: '/posts/my-post' },
  // ... existing posts
]
```

3. **Update homepage**: `blog/index.md`
```markdown
- [My Post Title](/posts/my-post) - October 22, 2025
```

4. **Preview**: `npm run dev` → visit `/blog/`

## Key Commands

- `npm run dev` - Development mode
- `npm run build:all` - Build everything
- `npm run preview` - Preview production build

## Deployment

Push to `main` branch → GitHub Actions automatically deploys to GitHub Pages.
