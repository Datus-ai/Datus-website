# Knowledge: Porting an already-published article into the blog

Sometimes a piece is published somewhere else first — Medium, WeChat, a
conference write-up, an operator draft — and the job is to land it on datus.ai
at the house standard.

These pieces are typically written by **Datus core developers**, so the split is:

- **The body copy is authoritative.** It is the author's argument in the
  author's voice, and that is the differentiator. Preserve it (§4).
- **The facts in it are perishable.** Versions, counts and product claims were
  true when it shipped and drift within weeks. Re-check them (§3).

So Step 1 of the SOP is skipped — the direction is decided — while Step 2 turns
into fact-verification rather than open research. Then rejoin the main SOP at
Step 3.

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

| Claim in the article | Checked against | What shipped |
|---|---|---|
| "15 SQL dialects" (post 1) / "13+" (post 2, and baked into a diagram) | connectors page listed **16** with executors (Redshift compiles, no executor yet) | `16 SQL dialects` — the number swapped inside the author's own sentence |
| tutorial pinned `dosi 0.1.8` | install page showed **0.1.9** | `0.1.9`, in the prose and in the pasted `dosi info` output |
| "Dosi is an **open** execution engine for Apache Ossie" | footer: Elastic License 2.0; our own `introducing-dosi` says "not open source yet" | one word dropped — "Dosi is an execution engine for Apache Ossie" |
| "Dosi exposes **11** tools" | reference table listed 14; the official walkthrough's `tools/list` returned 10 — it varies by build | "exposes a set of tools, ranging from `list_metrics` to `attribute_metric`" (his sentence, minus the brittle count) |
| "cold start is close to **200 times** faster… around **10 to 20** times faster" | benchmark page: 220–237x cold, 10–22x warm | **left exactly as written.** The author is understating his own benchmark; that is his call to make, and it is not false |
| ratio attribution "**LMDI** can decompose…" | docs name the strategies `term_wise` / `mix_shift` | **left as written.** It is a statement about the method, not a claim about shipped code |
| "dimension attribution, which we call **TermWise Attribution**" | docs' strategy value is `term_wise` | **left as written.** TermWise is the team's own name for it — not an error |

The last three rows are the lesson: on the first pass of these ports all three
were "corrected", and all three had to be reverted. Before editing a core
developer's claim about their own product, ask whether the source really
contradicts them, or just words it differently.

Procedure:

1. Open the primary source for **every** number, version, count, licence and
   product claim — the vendor's own docs, not a search snippet.
2. **Verify the commands actually work as written.** Read the CLI/API reference
   for flag order and names, and `curl -sI` every URL a reader is told to fetch
   (an installer, a sample dataset, a docs page). `/tutorial/` in one source
   article was already a 404.
3. When the article and its own diagram disagree, the copy carries the current
   number and the image stays as-is — a diagram is the author's snapshot and
   redrawing it is not your call. First check whether it is really a
   disagreement: a figure labelled "13+ SQL dialects" is still true when there
   are 16, so nothing needs saying. Only if the figure states a number the copy
   now contradicts outright, note it once in a FAQ.
4. Fix the fact in **both** the port and, if it is wrong on the site too, the
   existing post — see the CLI-FAQ precedent in `seo-and-research.md`.
5. Where the original reports one agent run (tool-call counts, narrative
   phrasing), attribute it as one recorded run. Deterministic parts (a fixed
   dataset's CLI output) can be stated as reproducible; agent prose cannot.

## 4. Preserve the body. Add structure around it, don't rewrite it

**These articles are written by Datus core developers.** Their wording, their
emphasis and their judgement calls are the asset — including the unpopular
opinions and the first-person engineering account, which is exactly what a
generic explainer cannot copy. A port is **not** a rewrite.

The default is the author's body copy, **verbatim**. Target ≥95% of the body's
sentences unchanged, and be able to say which ones aren't. What you are allowed
to add or change:

**Add, around the body:**

- `## TL;DR` at the top — build it from the author's *own* summary section or
  closing bullets, so even the TL;DR is in their words.
- `## Frequently asked questions` (≥2 `###`) at the end, for the `FAQPage`
  JSON-LD. Derive every answer from claims the article already makes — a FAQ is
  the article's own substance in searcher-question form, not new opinions under
  someone else's byline.
- `## Related articles` at the end.
- Images in the author's original positions, with real alt text (see §2).
- The first-publication note (§5).

**Change, inside the body — mechanical only:**

- Heading levels, so the post has exactly one H1 (Medium `###`/`####` usually
  become `##`/`###`). Keep the author's heading *text*.
- External links → raw HTML with `rel="nofollow noopener"`. The anchor text
  stays identical.
- Internal links: **wrap words the author already wrote**
  (`[semantic layer](/blog/what-is-semantic-layer/)`). Never add a sentence to
  create a link slot. Anything the house standard still wants beyond that goes
  in `## Related articles`.
- Code blocks: restore the language tag and the line breaks a reader proxy
  destroyed, and verify the commands (§3). Formatting, not wording.
- Obvious typos and mangled punctuation (`concept-"group by month"-has` →
  em-dashes, `an possible output` → `a possible output`).
- Cut Medium furniture: "Get X's stories in your inbox", "Press enter or click
  to view image in full size", clap/follow CTAs.
- Leave an agent/CLI transcript as a fenced block. Do not reformat the author's
  ASCII tables into markdown tables — a transcript reads as more honest when it
  looks like a transcript.

**Do not** invent sections (a checklist, a comparison table, a "requirements"
frame), re-order the argument, or paraphrase for tone — even to hit the house
template. Where the template and the author disagree, the author wins and you
say so in the PR. `blog-standard.md` §2's skeleton is for posts written from
scratch.

**Fact fixes are surgical.** A stale number is corrected **in place**, keeping
the author's sentence (`15 SQL dialects` → `16 SQL dialects`). Where the author
states something the docs contradict, prefer the smallest edit that removes the
false claim — dropping one word ("Dosi is an ~~open~~ execution engine", because
the site's own `introducing-dosi` says it is not open source) beats rewriting the
paragraph. A version-dependent count the author measured on their build
("exposes 11 tools") is better made non-brittle than re-guessed. And check
whether the "error" is really an error first: `TermWise Attribution` is the
team's own product name for the documented `term_wise` strategy, and `LMDI` was
a statement about the method, not a claim about the shipped code — both were
over-corrected on the first pass of the Sep 2026 ports and had to be restored.

Every surviving deviation goes in the PR body as a list, because the post ships
under the author's byline and they should be able to review exactly what changed
about their own words.

## 5. Disclose the original, and mind duplicate content

> **WeChat ports are the exception.** Do not add the first-publication note and
> do not link back to `mp.weixin.qq.com` at all — see
> `fetching-wechat-articles.md` §7. The rest of this section still applies.

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
