<!-- Heartbeat template; comments-only content prevents scheduled heartbeat API calls. -->

# HEARTBEAT — the Datus blog agent is ON-DEMAND

# This agent runs only when the operator asks (e.g. "写一篇 blog，从 /glossary 挑一个方向").
# Keeping this file empty / comments-only means NO scheduled heartbeat runs — that
# is intentional. Do NOT add tasks that auto-generate posts on a timer: surprise
# PRs, wasted cost, and duplicate-topic risk.
#
# The ONLY sanctioned proactive task, and only if the operator explicitly opts in:
#   - Check open blog PRs for new review feedback and, if any, address it on the
#     SAME PR branch per AGENTS.md. Never start a new post unprompted.
#
# Add such a task below only on explicit request; otherwise leave this file as-is.
