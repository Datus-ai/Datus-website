# Knowledge: Translating a figure into English

A ported article often carries diagrams whose labels are Chinese. A wall of
Chinese text inside an English page is bad for the reader and worthless for
search — the figure's words are exactly the terms the page should be ranking
for, and an image the reader cannot read is worse than no image.

So: **redraw the diagram in English.** Do not drop it, do not ship it in
Chinese, and do not paste a translation into the caption and leave the picture
untouched.

## 1. What can be redrawn, and what cannot

| Kind of image | What to do |
|---|---|
| **A diagram the author drew** — flow, timeline, comparison columns, layer stack, boxes and arrows | Redraw it in English (§2–§4). This is the common case. |
| **A product UI screenshot** in a Chinese locale | **Do not redraw it.** A hand-built replica of a UI is a UI that does not exist — that is fabrication, not translation. Ask the operator to re-capture the screen with the product in English. Until then, ship the original with English alt text and say so in the PR. |
| **A screenshot of notes, a chat log, a dashboard of real data** | Same rule. Never reconstruct. Either it runs as-is or it is cut, and the prose carries the content. |
| **QR codes, 小助手 cards, author avatars** | Cut — see `fetching-wechat-articles.md` §5. |

The line is simple: **a diagram is an argument, and an argument can be restated
in another language. A screenshot is evidence, and evidence cannot be redrawn.**

## 2. The pipeline

HTML source → headless Chromium screenshot → pngquant → commit. The repo
already has everything; there is nothing to install.

```
blog/figures/<post-slug>/<figure-name>.html   ← you author this (committed)
              ↓  npm run figures:build
blog/public/images/<post-slug>/<figure-name>.png   ← rendered @2x (committed)
              ↓  tiny-png skill
blog/public/images/<post-slug>/<figure-name>.png   ← compressed in place
```

Referenced from the post as `/images/<post-slug>/<figure-name>.png` — site root,
**not** `/blog/images/…`.

Both the HTML source and the PNG are committed. The source is what makes the
figure editable a year later; without it, the next person is back to redrawing
from a screenshot.

```bash
npm run figures:build                        # every figure
npm run figures:build -- <post-slug>         # just one post's
bash ~/.claude/skills/tiny-png/compress.sh blog/public/images/<post-slug>
```

`scripts/build-figures.mjs` screenshots **the element with `id="figure"`**, so
the PNG is cropped to the artwork — you never set a height, and the image has
no page chrome around it. It renders at `deviceScaleFactor: 2`, so a 1080px-wide
figure lands as a 2160px PNG that stays crisp on retina. It does not compress;
run the `tiny-png` skill afterwards (typically −70%).

## 3. Writing a figure source

Start by copying the closest existing file in `blog/figures/`. The skeleton:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="../_figure.css" />
<style>
  /* only what is specific to this figure */
</style>
</head>
<body>
<div id="figure">
  <h1>Sentence-case title, same claim the original made</h1>
  …
  <p class="caption">Optional one-line takeaway.</p>
</div>
</body>
</html>
```

`blog/figures/_figure.css` holds the shared tokens — 1080px width, Inter, the
ink/muted/line greys, and the green / blue / pink / amber / red pairs that mirror
the colour coding of the original decks. Use those variables rather than new hex
values, or the figures stop looking like one set.

Rules that matter:

- **Light background, always.** Blog pages are light and a PNG is not
  theme-aware. `#fff` ground, dark ink.
- **One `#figure` element**, and everything inside it. That is the crop.
- **1080px wide** (the `_figure.css` default). Post body is narrower, so the
  figure downsamples — which is why 2x matters and why body text below ~12.5px
  becomes unreadable in the post.
- **Web fonts are awaited** (`document.fonts.ready`) before the crop is measured.
  If you add a font, keep the `<link>` tags — a missing font changes the layout
  and therefore the crop.
- **No JavaScript**, no external images, no CDN beyond Google Fonts. A figure
  that needs a script is a figure that will silently break.

## 4. Translate the diagram, don't redesign it

Same rule as the body copy: this is the author's figure.

- Keep the **structure** — same rows, same columns, same order, same arrows.
- Keep the **colour coding**. If the original made the strictest layer green and
  the loosest pink, keep that; the colours carry meaning across the figure set.
- Keep the **title's claim**. "选对场景：按确定性分层使用 Datus 能力" →
  "Match the scenario: layering capabilities by determinism". Not a new title.
- Translate every label, including the small print under the boxes and the
  footer line — that footer is usually the figure's actual punchline.
- **Terminology comes from CLAUDE.md §2**, in reverse. 语义层 → semantic layer,
  指标 → metric, 归因 → attribution, 子代理 → subagent. Product names
  (Reference SQL, Reference Template, Skills) stay as they are.
- Numbers, dates and version strings are copied, never re-derived. If a date in
  the figure disagrees with the post, the post is what gets checked — see
  `porting-external-articles.md` §3.

## 5. Alt text and captions

Every figure still needs both, and they do different jobs:

- **Alt text** describes what the diagram *shows*, in a full sentence, naming
  the boxes — it is what a screen reader and a crawler get. A generic "diagram"
  alt is a wasted signal.
- **Caption** (`*italic line under the image*`) carries the takeaway, usually a
  translation of the figure's own footer.

Write them from the English figure, and re-read them after any redraw: alt text
written against the Chinese original can end up describing labels that no longer
exist.

## 6. Check the result before committing

1. **Look at the PNG.** Read it with the Read tool — clipped text, an overflowing
   box or a stray scrollbar is obvious in the image and invisible in the HTML.
2. Watch for **English running longer than Chinese**. It usually does, by a lot.
   Boxes that fit four Chinese characters will not fit "Reference SQL +
   knowledge base" — widen the column or shorten the label, never shrink the
   font below the floor in §3.
3. **Check it in the page**, not just standalone: `npm run build:all`, then the
   post at `http://localhost:4173/blog/<slug>/`. The first body image becomes
   the hero, so a wide flat figure there will be cropped differently than you
   expect.
4. Compress last, and put the before/after numbers in the PR.
