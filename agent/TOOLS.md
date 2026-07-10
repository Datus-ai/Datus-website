# TOOLS.md — Environment notes for the Datus blog agent

Environment-specific setup this job assumes. The tools/skills themselves and the
procedure are described in `AGENTS.md` + `knowledge/`; this file is just the local
prerequisites. **Keep secrets OUT of this file** (it is tracked in git).

## Working directory
- Run all shell commands from the **repo root** (the parent of this `agent/` dir).
- The blog is **static**: preview with `npm run build:all` then `npm run preview`
  → `http://localhost:4173/blog/<slug>/`. `npm run dev` does NOT render posts.

## Required capabilities (the workflow depends on these)
- **Web search / browsing** — REQUIRED for the "research first, never fabricate"
  step (`knowledge/seo-and-research.md`). If it's unavailable, stop and tell the
  operator; do not invent facts.
- **Shell** — `git`, `gh` (GitHub CLI), Node/`npm`. `gh auth status` must be
  logged in before the PR step.
- **File editing** — create/edit the post and wiring files.
- **Open a browser** — `open <url>` to show the operator the local page.

## Repo facts
- Remote `Datus-ai/Datus-website`, base branch `main`.
- Post source → built URL: `blog/posts/<slug>.md` → `/blog/<slug>/`.
- Commit only files the post touches — never `git add -A` (untracked `.idea/`,
  `pnpm-lock.yaml`, `pnpm-workspace.yaml` live in the repo).

## Do NOT put here
Tokens, API keys, passwords, private hostnames/IPs. Those belong in the
environment or a secret store, never in this git-tracked file.
