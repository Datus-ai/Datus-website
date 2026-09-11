# Knowledge: Fetching a WeChat (公众号) article

Datus core developers publish first on the **数据杂货铺** WeChat official
account (`mp.weixin.qq.com/s/<id>`). Porting one of those posts starts with
getting the real text out — and that is the part that silently fails.

Read this together with `porting-external-articles.md`, which owns everything
after "you have the source text".

## 1. WebFetch does NOT work — don't trust what it returns

WebFetch on an `mp.weixin.qq.com/s/...` URL returns a **200 with a decoy page**,
not an error:

> **环境异常** — 当前环境异常，完成验证后即可继续访问 …「去验证」

A summarizer handed that page will happily report "this is a verification page,
there is no article", which reads like a fact and is not one. Any time a
`mp.weixin.qq.com` fetch comes back talking about 环境异常 / 去验证 / a
verification button, the fetch failed — fall back to §2 rather than reporting
the article as unavailable.

## 2. What works: `curl` with a desktop UA

WeChat serves the full article HTML to a plain desktop user agent. No cookies,
no login, no proxy.

```bash
cd "$SCRATCHPAD"   # never litter the repo with the raw HTML
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
for id in JkO-TWItu7cfctpfVAk1LA IlaJ7P-zSC098sG3OmkUPg; do
  curl -sL -A "$UA" "https://mp.weixin.qq.com/s/$id" -o "$id.html"
done
```

A real article is **~3 MB** of HTML (most of it inline JS). A few KB means you
got the decoy page; retry, and check the UA is actually being sent.

## 3. Pull the metadata out of the page's inline JS

The interesting fields are JS variables, not meta tags:

```bash
grep -o "var msg_title = [^;]*"   "$id.html" | head -1   # 'xxx'.html(false)
grep -o 'var create_time = "[0-9]*"' "$id.html" | head -1 # unix seconds
grep -o 'var nickname = [^;]*'    "$id.html" | head -1   # 数据杂货铺
date -r <create_time> "+%Y-%m-%d"                        # macOS; GNU: date -d @<ts>
```

`create_time` is the **original publication date**, and it is the post's
`date:`. The piece was written then; backdating is honest and it keeps a batch
of ports naturally staggered instead of stacking them all on today.

Pair it with `lastmod:` = the day the datus.ai edition actually ships (stagger
these too, in the same order). The two fields then say exactly the right thing:
authored on the WeChat date, published here with re-checked facts on the
lastmod date. It matters mechanically as well —
`scripts/build-blog.mjs` renders the byline and `datePublished` from `date`, but
sorts the `/blog` "Latest" rail and writes `<lastmod>` in the sitemap from
`lastmod`, so a backdated post still surfaces as new.

One consequence to watch: a fact you corrected forward (§3) can end up
future-dated relative to the byline — "the extension shipped in May 2026" under
an April byline. That is what `lastmod` is for, so keep the correct fact, but
flag it to the operator rather than letting it pass silently.

## 4. Extract the body text

The body lives in `<div class="rich_media_content" id="js_content">`, built out
of nested `<section>`/`<span>` with inline styles. Strip it with the stdlib —
don't try to read the raw HTML:

```bash
python3 - <<'PY'
import re, html, glob
for f in sorted(glob.glob("*.html")):
    s = open(f, encoding='utf-8', errors='ignore').read()
    m = (re.search(r'<div class="rich_media_content[^"]*"[^>]*>(.*?)</div>\s*<script', s, re.S)
         or re.search(r'id="js_content"[^>]*>(.*)', s, re.S))
    t = m.group(1) if m else ""
    t = re.sub(r'<(script|style).*?</\1>', '', t, flags=re.S)
    t = re.sub(r'<br\s*/?>', '\n', t)
    t = re.sub(r'</(p|section|h\d|li|tr)>', '\n', t)
    t = re.sub(r'<[^>]+>', '', t)
    t = html.unescape(t)
    t = re.sub(r'\n{3,}', '\n\n', t)
    t = re.sub(r'[ \t\xa0]+', ' ', t)
    open(f.replace('.html', '.txt'), 'w').write(t.strip())
PY
```

Expect 4–8 KB of Chinese text per article. Then `cat` the `.txt` — a 40 KB+
batch will blow past the tool-output cap, so print one or two files per call.

What the stripper loses, and what to do about it:

- **Headings.** WeChat encodes them as styled `<section>`, so they come back as
  bare lines. Recover the outline from the article's own numbered list / 总结
  section, and check against the rendered page in a browser if unsure.
- **Footnote links.** `[1] https://…` reference lists survive at the bottom —
  they are the author's external sources; keep them as `nofollow noopener` links.
- **Figure captions.** Usually inline (`图 1 · …`) and survive as text.

## 5. Images — download them, compress them, ship them

**Every real figure in the article goes into the post.** Do not drop the images
and ship a text-only port: the diagrams are the author's own explanation of the
argument and they carry it better than another paragraph would.

Article images are `<img data-src="https://mmbiz.qpic.cn/...">` (the real URL is
in `data-src`, not `src`). `mmbiz.qpic.cn` **hotlink-blocks** by referer, so a
plain `curl` gets a placeholder; send a referer:

```bash
grep -o 'data-src="https://mmbiz.qpic.cn/[^"]*"' "$id.html" \
  | sed 's/data-src="//;s/"$//' | sort -u > urls.txt
i=0; while read u; do i=$((i+1))
  curl -s -A "$UA" -e "https://mp.weixin.qq.com/" "$u" -o "img/$i.bin"
done < urls.txt
file -b --mime-type img/*.bin          # image/png or image/jpeg
```

Then:

1. **Rename to a real extension immediately.** Reading an image saved as `.bin`
   makes the Read tool treat it as text and dump ~130k tokens of binary.
2. **Look at every image** before writing alt text. WeChat figures are usually
   captioned inline in the body (`图 1 · …`), which tells you where each one
   belongs.
3. **Drop the furniture:** the 小助手 / 公众号 QR codes at the foot of every
   article, the author avatar, and any "扫码加群" card. They are the WeChat
   equivalent of Medium's clap CTA and they are meaningless on datus.ai.
4. **Compress with the `tiny-png` skill** (pngquant) before committing — WeChat
   originals run 250 KB–1 MB each. Keep PNG for diagrams and anything with small
   text.
5. Place as `blog/public/images/<slug>/<descriptive-name>.png` and reference
   **`/images/<slug>/<name>.png`** (site root, *not* `/blog/images/…`). The first
   body image is auto-promoted to the hero, so put the best one right after
   TL;DR. Commit them in the same PR as the post.

The figures are Chinese-language slides. **Redraw the diagrams in English** —
see `translating-figures.md` for the HTML → `npm run figures:build` → tiny-png
pipeline, and for the images that must never be redrawn (product UI screenshots,
chat logs, anything evidential). Every figure, redrawn or not, gets **English alt
text and an English caption** (`*Figure 1 — 13 months, from the first
conversation to DataAgent in production.*`).

## 6. These posts are Chinese; the blog is English

`porting-external-articles.md` §4 says "preserve the body verbatim". For a
WeChat port that means **preserve the argument, the structure, the section
order, the examples, the numbers and the author's judgement calls** — including
the mildly contrarian ones — while translating into the house English voice.
It does not license a rewrite: if a paragraph is gone, a section is reordered,
or an opinion is softened, that is a deviation and it belongs in the PR body.

## 7. Strip the serialization — a blog post is not an issue of a newsletter

A WeChat account is a running series read in date order. A blog post is a page
someone lands on cold from a search result, possibly a year later. Everything
that only makes sense inside the series has to go:

| In the WeChat original | In the post |
|---|---|
| **A link back to the WeChat article** (the "first published on…" note, any `mp.weixin.qq.com` URL) | **Never.** No back-link, no first-publication note. The datus.ai page stands on its own. |
| "上周在阿里云做了一个分享", "上周末在上海 DataAI Meetup" | Drop the framing or state it plainly and timelessly ("In a talk on Agentic Lakehouse…"), never "last week" |
| "一个月前引入了 Plugin System", "过去半年我们…" | An absolute date or a plain statement ("Datus introduced its plugin system in 2026") |
| "前面讲 OSI 时提到", "开头那位工程师" | Fine *within* the post — these are internal back-references and they still resolve |
| "参考之前那篇文章", "上一篇讲过" | Either an internal link to the post that covers it, or cut |
| "后续来逐步介绍这个实战", "可以稍等等再分享" | Cut. A promise of a future WeChat post is noise on datus.ai |
| "获取完整的 PPT，请加小助手", "关注公众号" | Cut. Replace with the real product/docs CTA if one is warranted |
| "五一之后发布插件" (a future release that has since shipped) | Correct it in place against the current site — see `porting-external-articles.md` §3 |

The test: **would this sentence still make sense to a reader who has never seen
the WeChat account, arriving from Google eighteen months from now?** If not,
rewrite it or cut it. Only the substance of the argument survives.

The `/blog` tree is **English-only** (CLAUDE.md §1.1) — a WeChat port never gets
a `/zh` mirror and never a `zh-Hans` alternate.
