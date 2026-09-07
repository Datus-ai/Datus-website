# Knowledge: Porting an already-published article into the blog

Sometimes a piece is published somewhere else first — Medium, WeChat, a
conference write-up, an operator draft — and the job is to land it on
datus.ai at the house standard. The direction is already decided, so Step 1 of
the SOP is skipped, but **Step 2 (research) is not**: a published article is a
*draft with authority*, not a source of truth. Its facts were true when it
shipped and drift fast.

Do this, then rejoin the main SOP at Step 3 (write).

## 1. Get the full source text

`curl` on Medium returns a Cloudflare interstitial (`Attention Required!`,
~5 KB) and WebFetch gets a 403. Two things that do work, in order of fidelity:

1. **The author's RSS feed — best.** `https://medium.com/feed/@<handle>` returns
   the last ~10 posts with **full `content:encoded` HTML**: exact code blocks,
   exact tables, real `<img src>` URLs, and the true `pubDate`. Extract with the
   stdlib:
   ```bash
   curl -s -A "Mozilla/5.0" "https://medium.com/feed/@<handle>" -o feed.xml
   python3 - <<'EOF'
   import xml.etree.ElementTree as ET
   ns={'content':'http://purl.org/rss/1.0/modules/content/'}
   for it in ET.parse('feed.xml').getroot().iter('item'):
       print(it.findtext('title'), it.findtext('pubDate'))
       # it.find('content:encoded', ns).text  → full article HTML
   EOF
   ```
2. **A reader proxy — fallback.** `https://r.jina.ai/<url>` returns readable
   markdown and works when the feed doesn't (article older than the feed window).
   It **mangles what a tutorial depends on**: code blocks merge with their
   output, tables lose structure, em-dashes become hyphens, and inline images can
   vanish. Use it to read, not to copy from.

Never work from a paywalled excerpt or from memory of the article.

## 2. Pull the images at full resolution

The RSS HTML gives `https://cdn-images-1.medium.com/max/1024/<id>` — that's a
1024px derivative. Strip the resize segment for the original:

```bash
curl -s -A "Mozilla/5.0" "https://miro.medium.com/v2/<id>" -o img/<id>.png
```

- **Give the file a real extension.** Reading an image saved as `.orig` (or with
  no extension) makes the Read tool treat it as text and dump ~130k tokens of
  binary. Rename to `.png`/`.jpg` *before* looking at it.
- **Actually look at every image** before writing alt text or a caption. The
  alt text must describe what the diagram shows; a generic "diagram" alt is a
  wasted SEO signal, and you cannot spot an image/copy contradiction (see §3)
  without seeing it.
- Skip the author avatar and Medium's tracking pixel
  (`medium.com/_/stat?event=post.clientViewed`) — both appear as `<img>` in the feed.
- Place as `blog/public/images/<slug>/<descriptive-name>.png` and reference
  **`/images/<slug>/<name>.png`** (site root, not `/blog/images/…`). The first
  body image is auto-promoted to the hero, so put the best one right after TL;DR.
- **Compress before committing.** Medium originals run 1–2 MB each; five of them
  is a 5–6 MB page. Run the `tiny-png` skill (`pngquant`, ~65% off flat-colour
  diagrams, lossless-looking). Keep PNG for diagrams and anything containing
  small text — JPEG saves little and blurs the code in screenshots.

## 3. Re-check every fact against the current source

This is where most of the value is added. Numbers in a month-old post are
already stale, and the article can contradict **itself** or its own diagrams.
Real examples from the two Dosi ports (Sep 2026):

| Claim in the article | Reality when ported | What was published |
|---|---|---|
| "15 SQL dialects" (post 1) / "13+" (post 2, and baked into a diagram) | connectors page listed **16** with executors, Redshift compiles but has no executor | 16, with the Redshift caveat; a FAQ explains why the diagram says 13 |
| "cold start close to 200x faster" | benchmark page: **220–237x** cold, **10–22x** warm | the published ranges, with the fixture + single-box caveats |
| "Dosi exposes 11 MCP tools" | reference table listed 14; the official walkthrough's `tools/list` returned 10 | tool *families*, and "check `tools/list`" — no fixed count |
| ratio attribution "uses LMDI" | docs name the strategies `term_wise` and `mix_shift` (`mix_effect`/`rate_effect`) | the documented names |
| "Dosi is an open execution engine" | footer: **Elastic License 2.0** (source-available) | "source-available under Elastic License 2.0"; a FAQ separates it from Apache-2.0 Ossie and Datus Agent |
| tutorial pinned `dosi 0.1.8` | install page showed **0.1.9** | 0.1.9, and the version stated as "tested against" |

Procedure:

1. Open the primary source for **every** number, version, count, licence and
   product claim — the vendor's own docs, not a search snippet.
2. **Verify the commands actually work as written.** Read the CLI/API reference
   for flag order and names, and `curl -sI` every URL a reader is told to fetch
   (an installer, a sample dataset, a docs page). `/tutorial/` in one source
   article was already a 404.
3. When the article and its own diagram disagree, **the copy carries the current
   number** and the image stays as-is — images are the author's snapshot. Say so
   once, briefly (a caption parenthetical or a FAQ), rather than silently
   shipping a contradiction.
4. Fix the fact in **both** the port and, if it is wrong on the site too, the
   existing post — see the CLI-FAQ precedent in `seo-and-research.md`.
5. Where the original reports one agent run (tool-call counts, narrative
   phrasing), attribute it as one recorded run. Deterministic parts (a fixed
   dataset's CLI output) can be stated as reproducible; agent prose cannot.

## 4. Restructure to the house standard — don't transcribe

A port is a rewrite, not a copy-paste. It still owes the full
`blog-standard.md` shape: frontmatter, `## TL;DR` first, a bold definition
opener, numbered `##` sections, ≥1 comparison table, `## Frequently asked
questions` (≥2 `###`), `## Related articles`, 3–6 internal links, external links
as `rel="nofollow noopener"`.

- Keep the author's **byline** (`author:` = the real author) and their arguments,
  including the unpopular ones — the first-person engineering account is the
  differentiator a generic explainer can't copy.
- Cut Medium furniture: the "Get X's stories in your inbox" block, "Press enter
  or click to view image in full size", clap/follow CTAs.
- Turn loose prose into the artifacts the corpus rewards: the article's five
  summary bullets become the TL;DR; a spec-vs-runtime distinction becomes a
  table; an implicit argument becomes a numbered checklist section.
- Convert the source's own conclusions into FAQ answers — a searcher's question
  ("do I really need a fast semantic layer?") is usually already answered
  somewhere in the body.

## 5. Disclose the original, and mind duplicate content

- Add one line near the top, after the opener:
  > A version of this article was first published on
  > <a href="…" rel="nofollow noopener">Medium</a>. …
  Say if figures were re-checked. This is honest and it explains the overlap to
  a reader who has seen both.
- **Each locale/page is self-canonical** (§4 of CLAUDE.md) and the build sets
  `canonical` to `/blog/<slug>/` — never point a canonical at the external site,
  or you hand the ranking to them.
- The external copy is the duplicate-content risk, and only the author can fix
  it there. **Tell the operator** to either set a canonical to the datus.ai URL
  on the original (Medium supports this for imported stories) or trim it to an
  excerpt linking here. Substantial restructuring plus corrected facts already
  makes the datus.ai version the better page; the canonical makes it explicit.
- Check `memory/covered-topics.md` as usual. A port is exempt from "pick a new
  direction" but **not** from the anti-duplication rule: if a sibling post
  already owns the angle, state the difference in the memory record and
  cross-link both ways.

## 6. Record the provenance in memory

Use the normal record format, with `Source direction:` naming the external URL
and its original publication date, so a later run can tell a port from an
original and can find the source again.
