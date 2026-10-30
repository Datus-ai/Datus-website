# Website semantic model converter

This is an independent website implementation of the Studio Conversion
Workbench. It does not import a SaaS workspace package. Configuration, editable
output files, diagnostics, discard confirmations, snapshots and downloads follow
the Studio flow; project saving is omitted because this tool is anonymous.

- Canonical hub: `/apache-ossie-converter/`, with a `/zh/` mirror.
  Direction pages and their public names live in `routes.ts`. The former
  `/tools/semantic-model-converter/` route is a redirect-only compatibility alias.
- All hosts, including the live website and localhost previews, temporarily use
  `https://studio-dev.datus.ai`. After the production converter API is deployed,
  restore hostname-based routing in `api.ts` when requested: deployed hosts use
  `https://studio.datus.ai`, while localhost previews keep using dev.
- Calls `GET /api/public/semantic-converter/targets` and
  `POST /api/public/semantic-converter/convert`, without credentials or internal
  tokens. No Python deployment is added.
- `contracts.ts` is a local snapshot of the generated converter API contract.
  Update it together with changes to the deployed protocol.
- Targets and their required fields come from the API. No mock target catalog
  or fallback conversion engine is shipped to users.
- Input supports pasted YAML, `.yml`/`.yaml` uploads and three pinned Apache
  Ossie fixtures. See `samples/README.md`, `LICENSE`, `NOTICE` and `sources.json`.
- Input/output stay in memory. Conversion submits a click-time snapshot and
  supports cancellation. Results are not put in URLs, storage or analytics.
- Single-file downloads preserve the filename; multi-file downloads preserve
  relative paths in ZIP. Downloads include current edits. Blocked outputs and
  unsafe paths cannot be exported.
- Monaco and its workers are bundled on the website origin and loaded only by
  this tool. Forms, dialogs, dropdowns, file trees and both editors follow the
  website's light/dark selection and Nordic CSS tokens. A root theme observer
  updates Ant Design and Monaco in place, retaining session buffers and results.
  The default and prerendered UI are light; no converter-specific preference
  is stored. SSR sample selectors also follow the early theme attribute before
  hydration. Ant Design styles are extracted per prerendered route to keep first paint and hydration consistent.

Validation:

```sh
npm run test:semantic-converter
npm run typecheck:semantic-converter
npm run build:all
npm run test:semantic-converter-links
npm run test:semantic-converter-theme
npm run preview
```

The browser theme checks cover both locales and directions, default/saved/live
selection, preserved source and result editors, dropdowns, portaled popovers and
confirmation dialogs, mobile layout, unavailable storage, and the no-JS fallback.
Screenshots are written to `/tmp/datus-converter-themes/`.

The browser link checks use mocked public catalogs and cover both locales,
refresh, fallback, delayed catalogs, retries, cancellation, mobile links,
URL/history preservation, and hydration.

The unit checks cover API routing on production/preview/localhost hosts, UTF-8
limits, model selection, unsafe/duplicate output paths, edited buffers, sample
hashes and locale parity. Verify real API calls against studio-dev before release.
Production converter API deployment is required before restoring production-host
routing to studio.datus.ai.

## Bidirectional workbench

`GET /sources` and `POST /import` use the same public API origin as export.
Import requires the corresponding backend/SaaS deployment. A missing catalog
shows an unavailable/retry state while the export direction remains usable.
Source options and disabled export-only entries come from that catalog.

Import accepts a complete bundle (up to 50 files / 1 MiB including UTF-8 paths),
local folders preserving relative paths, and pasted definitions. `examples/`
contains independently authored Cube, Omni, compiled dbt and offline Microsoft
BIM test definitions copied from the Studio examples, with no customer data.
These are distinct from the original pinned Apache export fixtures in `samples/`.

Both directions start with a prefilled example and retain separate temporary
sessions. Public landing URLs describe the source and target:

- `https://datus.ai/apache-ossie-converter/cube-to-ossie/`
- `https://datus.ai/apache-ossie-converter/ossie-to-cube/`
- `https://datus.ai/apache-ossie-converter/dbt-to-ossie/`
- `https://datus.ai/apache-ossie-converter/ossie-to-dbt/`
- `https://datus.ai/apache-ossie-converter/omni-to-ossie/`
- `https://datus.ai/apache-ossie-converter/ossie-to-omni/`
- `https://datus.ai/apache-ossie-converter/power-bi-to-ossie/`
- `https://datus.ai/apache-ossie-converter/ossie-to-power-bi/`
- `https://datus.ai/apache-ossie-converter/ossie-to-snowflake/`

Each has an independently prerendered English/Chinese body, title, description,
FAQ, breadcrumb and self-canonical URL. There is no Snowflake-to-Ossie page:
that importer is not supported. Product-facing `power-bi` maps to API ID
`microsoft`. New pairs require dedicated content and a route-registry entry;
other catalog formats remain usable on the general hub through query parameters.

The route sets the initial direction, platform and public fixture before
hydration. Explicit `direction`, `platform` and `example` query values remain
compatible and are validated against the deployed catalog. Once resolved, or
after an accepted control change, supported pairs replace the URL with their
clean path. Only non-default fixtures remain in `?example=...`. The directory
hub stays at its base URL until the visitor selects a configuration. Page copy,
canonical metadata, structured data, language links and CTA placements track
the current path without remounting the workbench or clearing either session.

Legacy EN/ZH URLs redirect to the corresponding hub, preserving query,
campaign parameters and fragments in JavaScript. Their static no-JS fallback
links to the hub; old URLs are noindex and absent from the sitemap. GitHub Pages
has no configurable HTTP 301, so these are immediate client/meta redirects.

Parameters preselect editable controls and never start a conversion. Platforms
are validated against the deployed catalog (import requires `available: true`).
Unsupported selections fall back with a localized notice. Catalog failures
retain pending selections for retry; initialization never replaces user edits.

Only validated platform and public fixture IDs enter share URLs. Model contents,
options, filenames, results and edits stay out of URLs and are not restored by
shared links. Changes replace the current history entry, preserving unrelated
query values, UTM, fragments and history state. Conversion still uses a click-time
snapshot; the website does not save files to a Studio project.

On desktop, Allotment resizes source/result panes and the 230px output file tree.
On narrow screens, input and output stack vertically. Native expression warnings
remain visible; successful file conversion is not warehouse execution validation.
