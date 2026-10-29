# Repository instructions

Read and follow [CLAUDE.md](./CLAUDE.md) before editing this repository. It contains the shared bilingual URL contract, terminology, SEO requirements, review checklist, and approved website motion conventions.

In particular, §6 requires autoplay countdowns to use the active tab's existing underline and requires shared section entrance effects throughout the website. Reuse the listed implementations instead of creating parallel animation systems.

§7 requires a continuous header/hero boundary without a dividing line on every page, in both themes and locales.

Build and development commands are in [DEVELOPMENT.md](./DEVELOPMENT.md). Honor the user's active branch/worktree boundaries and keep local design iterations uncommitted until requested.

UTM and Studio CTA changes must follow [docs/utm-conventions.md](./docs/utm-conventions.md). Website CTA placement belongs in `utm_content`; preserve external source/medium/campaign through the shared helpers. Use `utm_source=datus.ai` only as a fallback when no valid campaign is available; marketing, Support and Blog share this rule. Update the CTA inventory and relevant docs when adding or changing tags.
