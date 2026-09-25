# Setup, credentials and manual mode

First-time setup takes 1–2 hours and needs someone with admin access to the
Google Cloud project, Search Console and GA4.

## 1. Where things live

| What | Where | In git? |
|---|---|---|
| Skill, scripts, registries | `.claude/skills/datus-seo-weekly/` | yes |
| `node_modules` | `.claude/skills/datus-seo-weekly/scripts/node_modules` | no (root `.gitignore`) |
| Credentials | `$DATUS_SEO_HOME/.env` (default `~/.datus-seo-weekly/.env`) | **never** |
| Fetched data, bundles, blog catalog | `$DATUS_SEO_HOME/data/` | **never** |
| Reports | `$DATUS_SEO_HOME/reports/` | **never** |

The repo is public. If a teammate needs last week's report, share the file
directly, not through git.

## 2. Google service account (shared by GSC and GA4)

1. In Google Cloud Console, pick or create a project and enable the
   **Google Search Console API** and the **Google Analytics Data API**.
2. Create a service account and download its JSON key. Keep the file outside
   the repo.
3. Search Console → Settings → Users and permissions → add the service
   account's email to the `https://datus.ai/` property (read access is
   enough; the scripts only use `webmasters.readonly`).
4. GA4 → Admin → Property access management → add the same email as
   **Viewer** on the datus.ai property (not the docs / studio properties).

## 3. `.env`

```bash
mkdir -p ~/.datus-seo-weekly
cp .claude/skills/datus-seo-weekly/scripts/.env.example ~/.datus-seo-weekly/.env
chmod 600 ~/.datus-seo-weekly/.env
```

| Variable | Value |
|---|---|
| `GSC_SITE_URL` | exactly the GSC property, e.g. `https://datus.ai/` (a Domain property is `sc-domain:datus.ai`) |
| `GSC_CLIENT_EMAIL` | the service account email |
| `GSC_PRIVATE_KEY` | `private_key` from the JSON key, with the `\n` escapes kept, in double quotes |
| `GA4_PROPERTY_ID` | the numeric property ID |
| `GA4_CLIENT_EMAIL` / `GA4_PRIVATE_KEY` | leave empty to reuse the GSC account |
| `GSC_DATA_STATE` | `final` (default) or `all` |
| `REPORT_WEEK_END` | optional; a Sunday |

Use `DATUS_SEO_HOME=/some/path` to keep a different home (e.g. a shared drive).

## 4. Manual mode (no API access)

1. GSC → Performance → Search results → Compare "last 7 days" vs "previous 7
   days" (align to Mon–Sun) → export Queries, Pages, Countries, Devices.
2. GA4 (optional) → Reports → Acquisition → Traffic acquisition and Landing
   page → compare the same weeks → export CSV; plus Engagement → Events.
3. Run `npm run sync-blog` so the blog catalog is current.
4. Give the files to the agent together with the operator block
   (`templates/content-weekly-block.txt`). The agent follows
   `report-template.md`, labels the report 📋, and computes brand / cluster
   splits by hand using `registries/`.

## 5. Troubleshooting

| Symptom | Fix |
|---|---|
| GSC 403 / "User does not have sufficient permission" | The service account isn't on the property, or `GSC_SITE_URL` doesn't match the property string exactly (trailing slash, `sc-domain:`) |
| GA4 `PERMISSION_DENIED` | Wrong property ID, or the account isn't a Viewer on it |
| GA4 returns rows but everything is 0 for "previous" | Check the range names; `parseDualPeriodRows` expects the `current` / `previous` names the scripts send |
| `blog-catalog.json` is empty | Run from inside the repo; the scripts locate `blog/posts/` relative to the skill directory |
| Timeouts from mainland China | Google APIs need a VPN |
| Offline self-test | `npm test` in `scripts/` (no credentials needed) |
