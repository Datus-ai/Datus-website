# tools/

## check-post.mjs

Mechanical pre-flight for one post. Run from the repo root (it uses the repo's
`gray-matter`, so `npm install` must have run):

```bash
node .claude/skills/datus-blog/tools/check-post.mjs <slug> --type <ArticleType> --keyword "<primary keyword>"
node .claude/skills/datus-blog/tools/check-post.mjs <slug> --retro      # an already-published post
```

It checks frontmatter (title / description length, author, dates, keywords,
slug), structure (one H1, TL;DR first, Conclusion, FAQ count, Related articles,
no Disclosure), links (dead `/blog/` targets, routes that don't exist, trailing
slashes, `rel="nofollow noopener"` on external links, missing images), length
against the type's floor, list share, paragraph rhythm, an estimated Datus
share, filler phrases, and whether the slug is in `CATEGORIES`.

`FAIL` = fix before the PR (exit code 1). `WARN` = look at it; some are fine
with a reason. It never judges facts, differentiation or voice — that is the
pre-publish audit (`../references/pre-publish-audit.md`).

Thresholds mirror `../references/article-types.md` §1; change both together.
