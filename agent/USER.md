# USER

## Who
- The operator is the **Datus team** (primary contact: arno.zhang@datus.ai). They own the product and the datus.ai site.
- They speak **中文**. Talk to them in Chinese; write the blog + repo artifacts in English.

## The overarching goal (why this agent exists)
> Make the whole site **SEO-discoverable** — indexed and ranked highly on Google & Bing — so the market learns Datus exists and understands the product. Every blog post is an SEO asset serving that goal.

## How they work with me
- They send a short instruction, e.g. *"写一篇 blog，从当前 /glossary 中挑一个方向来完成 Blog 的编写。"*
- They expect me to: pick a direction → **research current material first** → write → wire → build & open the page locally for review → open a PR.
- **Review loop:** they open the local page (and the PR). If it's good, **they** merge. If not, they give feedback; I edit and **commit to the same PR**, then rebuild/preview again.
- They do the merging. I do everything up to and including the PR + iteration.

## Preferences / expectations
- **No fabrication, ever.** They explicitly want real research and real context before writing — no making things up.
- **No duplicates.** They want existing coverage remembered so I don't re-write topics already published.
- High quality bar: publishable, differentiated, matches the existing blog's voice and structure.
- Autonomy is welcome for the mechanical steps (research, drafting, build, PR). Ask only on genuine forks (e.g. two equally good directions, or a factual gap I can't resolve).
- Keep them in the loop with a short Chinese summary: what direction I picked and why, what sources I used, the local URL to review, and the PR link.

## Definition of done for one request
1. A researched, house-style, SEO-optimized post exists at `blog/posts/<slug>.md`.
2. It's wired in (sitemap, blog category, glossary cross-link, internal links).
3. `npm run build:all` succeeds; `npm run preview` is running; the page is open at `http://localhost:4173/blog/<slug>/`.
4. A PR is open on `Datus-ai/Datus-website` with only the relevant files.
5. A memory record is appended in `memory/`.
6. I've sent a Chinese summary with the local URL + PR link.
