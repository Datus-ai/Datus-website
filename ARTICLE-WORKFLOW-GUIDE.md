# Data Engineering Agent Article Workflow Guide

## 📁 File Organization Structure

```
Datus-website/
├── blog/
│   ├── posts/                          # All blog articles directory
│   │   ├── meet_datus.md              # Existing article
│   │   └── what-is-data-engineering-agent.md  # New article example
│   ├── data-engineering-agent/         # Main landing page directory
│   │   └── index.md                   # Main landing page content
│   ├── public/                         # Blog static assets
│   │   ├── images/                    # Article images location
│   │   │   ├── data-engineering-agent/  # Organize by topic
│   │   │   │   ├── architecture.png
│   │   │   │   ├── comparison-chart.png
│   │   │   │   └── workflow-diagram.png
│   │   │   └── logos/
│   │   ├── logo_dark.svg
│   │   └── favicon.svg
│   └── .vitepress/
│       └── config.mts                  # VitePress configuration
└── src/
    └── public/
        ├── sitemap.xml                 # Site-wide sitemap
        └── robots.txt                  # Site-wide robots
```

## ✍️ Steps to Create a New Article

### 1. Create Article File

**Location**: `blog/posts/your-article-name.md`

**Naming Convention**:
- Use lowercase letters
- Separate words with hyphens `-`
- Use SEO-friendly, keyword-rich names

Examples:
```bash
blog/posts/data-engineering-agent-vs-etl.md
blog/posts/how-data-engineering-agents-work.md
blog/posts/data-engineering-agent-benefits.md
```

### 2. Article Frontmatter Meta Template

Each article must include frontmatter:

```markdown
---
title: Your Article Title (include keywords, under 60 characters)
description: Article description, 150-160 characters, compelling for clicks
keywords: data engineering agent, related keyword 1, related keyword 2
author: Your Name
date: 2025-12-08
lastmod: 2025-12-08
head:
  - - meta
    - property: og:title
      content: Your Article Title
  - - meta
    - property: og:description
      content: Article description
  - - meta
    - property: og:image
      content: https://datus.ai/blog/images/data-engineering-agent/your-image.png
  - - meta
    - property: og:url
      content: https://datus.ai/blog/posts/your-article-name.html
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - link
    - rel: canonical
      href: https://datus.ai/blog/posts/your-article-name.html
---

# Your Article Title

> 📌 This article is part of the [Data Engineering Agent Complete Guide](/data-engineering-agent/) series

## TL;DR

Brief summary (3-5 key points)

## Your Content Starts Here...

[Your article content]

---

## Related Reading

- [Data Engineering Agent Complete Guide](/data-engineering-agent/)
- [What Is a Data Engineering Agent?](/blog/posts/what-is-data-engineering-agent)
- [Other related articles...]

## Next Steps

- [GitHub](https://github.com/Datus-ai/Datus-agent)
- [Documentation](https://docs.datus.ai)
- [Join Slack](https://datusai.slack.com)
```

## 🖼️ How to Add Images

### Method 1: Using Blog Public Directory (Recommended)

#### Step 1: Save Images
```bash
# Create topic directory (if it doesn't exist)
mkdir -p blog/public/images/data-engineering-agent

# Copy image to directory
cp your-image.png blog/public/images/data-engineering-agent/
```

#### Step 2: Reference in Article
```markdown
![Image description](/blog/images/data-engineering-agent/your-image.png)
```

**Complete Example**:
```markdown
## Architecture Diagram

The diagram below shows the core architecture of Data Engineering Agent:

![Data Engineering Agent Architecture Diagram](/blog/images/data-engineering-agent/architecture.png)

*Figure 1: Data Engineering Agent Three-Layer Architecture*
```

### Method 2: Using External CDN

```markdown
![Image description](https://your-cdn.com/image.png)
```

### Image Best Practices

1. **File Naming**: Use descriptive names with hyphens
   ```
   ✅ data-agent-workflow-diagram.png
   ✅ etl-vs-agent-comparison.png
   ❌ image1.png
   ❌ screenshot2025.png
   ```

2. **Image Optimization**:
   - Format: PNG (diagrams), JPG (photos), SVG (icons)
   - Size: < 200KB (compressed)
   - Dimensions: Max width 1200px

3. **Alt Text**: Always add descriptive alt text
   ```markdown
   ![Data Engineering Agent processing pipeline showing context engine, learning loop, and execution layer](/blog/images/agent-pipeline.png)
   ```

4. **Image Directory Organization**:
   ```
   blog/public/images/
   ├── data-engineering-agent/    # Organize by series
   │   ├── architecture.png
   │   ├── workflow.png
   │   └── comparison.png
   ├── logos/
   └── screenshots/
   ```

## 🔗 Internal Linking Strategy

### Link to Main Landing Page
```markdown
Learn more in the [Data Engineering Agent Complete Guide](/data-engineering-agent/)
```

### Link to Other Articles
```markdown
Related reading: [What Is a Data Engineering Agent?](/blog/posts/what-is-data-engineering-agent)
```

### Link to External Resources
```markdown
GitHub Repository: [Datus Agent](https://github.com/Datus-ai/Datus-agent)
```

### Anchor Links (Jump Within Article)
```markdown
Jump to the [Architecture Section](#architecture-diagram) in this article
```

## 📝 Complete Checklist for Publishing New Articles

### Step 1: Create Article
```bash
# Create new file in blog/posts/ directory
touch blog/posts/your-new-article.md
```

### Step 2: Add Images (if needed)
```bash
# Copy images to blog/public/images/data-engineering-agent/
cp ~/Downloads/your-image.png blog/public/images/data-engineering-agent/
```

### Step 3: Write Article Content
- [ ] Add complete meta information (title, description, keywords, date)
- [ ] Include TL;DR section
- [ ] Link back to main landing page at the beginning
- [ ] Add related reading at the end
- [ ] All images have alt text
- [ ] At least 2 internal links

### Step 4: Update sitemap.xml

Edit `src/public/sitemap.xml` and add:

```xml
<!-- Blog Posts -->
<url>
  <loc>https://datus.ai/blog/posts/your-new-article.html</loc>
  <lastmod>2025-12-08</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

### Step 5: Update VitePress Config (Optional)

If you want to show it in the sidebar, edit `blog/.vitepress/config.mts`:

```typescript
sidebar: [
  {
    text: 'Data Engineering Agent Series',
    items: [
      { text: 'Complete Guide', link: '/data-engineering-agent/' },
      { text: 'What Is an Agent?', link: '/posts/what-is-data-engineering-agent' },
      { text: 'Your New Article', link: '/posts/your-new-article' }  // Add this line
    ]
  },
  {
    text: 'Recent Posts',
    items: [
      { text: 'SQL agents are broken without context. Meet Datus.', link: '/posts/meet_datus' }
    ]
  }
]
```

### Step 6: Update Main Landing Page

Edit `blog/data-engineering-agent/index.md` and add link in the "Related Articles" section:

```markdown
## Learn More About Data Engineering Agent

### Fundamentals
- [What Is a Data Engineering Agent?](/blog/posts/what-is-data-engineering-agent)
- [Your New Article Title](/blog/posts/your-new-article)  <!-- Add this line -->
```

### Step 7: Build and Preview

```bash
# Full build
npm run build:all

# Local preview
npm run preview
```

### Step 8: Verification

Open browser and check:
- [ ] http://localhost:4173/blog/posts/your-new-article.html is accessible
- [ ] Images display correctly
- [ ] Internal links work properly
- [ ] Meta tags are correct (view page source in browser)

### Step 9: Commit Code

```bash
git add .
git commit -m "Add new article: Your Article Title"
git push
```

## 🎨 Quick Article Template Creation Script

Create `scripts/create-article.sh`:

```bash
#!/bin/bash

# Usage: ./scripts/create-article.sh "Article Title"

TITLE="$1"
if [ -z "$TITLE" ]; then
  echo "Usage: ./scripts/create-article.sh \"Article Title\""
  exit 1
fi

SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
FILE="blog/posts/${SLUG}.md"
DATE=$(date +%Y-%m-%d)

cat > "$FILE" <<EOF
---
title: ${TITLE}
description:
keywords: data engineering agent
date: ${DATE}
lastmod: ${DATE}
head:
  - - meta
    - property: og:title
      content: ${TITLE}
  - - meta
    - property: og:url
      content: https://datus.ai/blog/posts/${SLUG}.html
  - - link
    - rel: canonical
      href: https://datus.ai/blog/posts/${SLUG}.html
---

# ${TITLE}

> 📌 This article is part of the [Data Engineering Agent Complete Guide](/data-engineering-agent/) series

## TL;DR

## Introduction

[Your content here]

## Conclusion

---

## Related Reading

- [Data Engineering Agent Complete Guide](/data-engineering-agent/)
- [What Is a Data Engineering Agent?](/blog/posts/what-is-data-engineering-agent)

## Next Steps

- [GitHub](https://github.com/Datus-ai/Datus-agent)
- [Documentation](https://docs.datus.ai)
- [Join Slack](https://datusai.slack.com)
EOF

echo "✅ Created: $FILE"
echo "📝 Next steps:"
echo "   1. Edit the article: $FILE"
echo "   2. Add images to: blog/public/images/data-engineering-agent/"
echo "   3. Update sitemap.xml"
echo "   4. Update main landing page"
echo "   5. Run: npm run build:all"
```

Usage:
```bash
chmod +x scripts/create-article.sh
./scripts/create-article.sh "Data Engineering Agent vs Traditional ETL"
```

## 📊 URL Structure Reference Table

| Content Type | Source File Location | Built URL |
|--------------|---------------------|-----------|
| Main Landing Page | `blog/data-engineering-agent/index.md` | `/data-engineering-agent/` |
| Blog Article | `blog/posts/article-name.md` | `/blog/posts/article-name.html` |
| Blog Homepage | `blog/index.md` | `/blog/` |
| Article Images | `blog/public/images/folder/image.png` | `/blog/images/folder/image.png` |
| Main Site Assets | `src/public/file.xml` | `/file.xml` |

## 🔍 FAQ

### Q: Images not displaying?
A: Check if the path is correct:
- Images are in `blog/public/images/`
- Reference using `/blog/images/` (note the leading slash)

### Q: Internal links showing 404?
A: Check link format:
- Main landing page: `/data-engineering-agent/`
- Blog articles: `/blog/posts/article-name` or `/blog/posts/article-name.html`

### Q: Article not showing in sidebar?
A: You need to manually add it to `sidebar` in `blog/.vitepress/config.mts`

### Q: When to update sitemap?
A: You need to manually update `src/public/sitemap.xml` every time you publish a new article

## 📌 Quick Reference

### Key Commands
```bash
# Build
npm run build:all

# Preview
npm run preview

# Build blog only
npm run build:blog
```

### Key Files
```
blog/posts/                        # Articles directory
blog/public/images/                # Images directory
blog/.vitepress/config.mts         # Blog configuration
src/public/sitemap.xml             # Site sitemap
```

### Article Access URLs
```
Local: http://localhost:4173/blog/posts/article-name.html
Production: https://datus.ai/blog/posts/article-name.html
```

---

**Tip**: Reference the existing article `blog/posts/what-is-data-engineering-agent.md` as a template!
