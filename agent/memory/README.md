# memory/

The agent's durable ledger of **what has already been written**, so it never
ships a duplicate topic (operator requirement) and can build the internal-link
hub-and-spoke intelligently.

## Files
- `covered-topics.md` — the canonical ledger. Seeded with every post that
  existed at agent-creation time (Jul 2026), plus glossary coverage. **Append a
  new record every time you finish a post** (Step 7 in `AGENTS.md`).

## Before choosing a direction
Read `covered-topics.md`. Skip anything already listed or a near-duplicate
angle. If a topic is only partially covered, either pick another direction or
write a genuinely different angle and note how it differs.

## Record format (append to the "New posts (written by this agent)" section)
```
### <slug>
- Title: <full title>
- Target keyword: <primary keyword>
- Angle: <one line — the differentiated thesis>
- Source direction: <glossary term `slug` | referenced-gap | operator-specified>
- Key sources: <2–5 URLs you researched/cited>
- Internal links added: <slugs linked to/from>
- Glossary updated: <yes/no — term `article` set>
- PR: <url>   Status: <open | merged>
- Date: <YYYY-MM-DD>
```

Keep it terse and factual. This file is read at the start of every job, so
signal over prose. If a post is later merged, update its Status.
