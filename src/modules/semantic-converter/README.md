# Website semantic model converter

This is an independent website implementation of the Studio Conversion
Workbench. It does not import a SaaS workspace package. Configuration, editable
output files, diagnostics, discard confirmations, snapshots and downloads follow
the Studio flow; project saving is omitted because this tool is anonymous.

- Route: `/tools/semantic-model-converter/`, with a `/zh/` mirror.
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
  this tool. The UI follows the website's dark theme. Ant Design styles are
  extracted per prerendered route to keep first paint and hydration consistent.

Validation:

```sh
npm run test:semantic-converter
npm run typecheck:semantic-converter
npm run build:all
npm run test:semantic-converter-links
npm run preview
```

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
sessions. Share a selection with `direction=import|export` and `platform=<catalog ID>`:

- `https://datus.ai/tools/semantic-model-converter/?direction=import&platform=cube`
- `https://datus.ai/tools/semantic-model-converter/?direction=import&platform=dbt`
- `https://datus.ai/tools/semantic-model-converter/?direction=import&platform=microsoft`
- `https://datus.ai/tools/semantic-model-converter/?direction=export&platform=snowflake&example=retail`
- `https://datus.ai/zh/tools/semantic-model-converter/?direction=export&platform=dbt&example=nvidia`

These parameters preselect editable controls; they do not lock the UI or start a
conversion. No direction means the existing default, export. `example` selects a
public fixture: import uses `cube`, `omni`, `dbt`, `microsoft`; export uses `omni`,
`nvidia`, `retail`. Existing `?direction=import&example=cube` links still work.
An explicit platform takes priority over an example's suggested platform. Import
loads that platform's matching fixture and ignores a conflicting example; a
future supported import platform without a fixture starts with an empty input.
Export examples supply input without overriding an explicit target.

Platforms are validated against the deployed catalog (import requires
`available: true`). Unsupported selections fall back to the usual platform, or
the first available platform if needed, with a localized notice. Catalog failures
retain pending selections for retry; initialization never replaces user edits.

Accepted direction/platform/example changes replace the current history entry
without navigation. Unrelated query parameters, UTM values, fragments, and
history state are preserved. Both locale switchers track the latest URL.
Only validated platform and public fixture IDs are serialized; model contents,
options, filenames, results, and edits are never put in URLs or restored by a
shared link. Editing input removes the example parameter. Conversion uses a
click-time snapshot of all files and options. The website does not save files to a Studio project.

On desktop, Allotment resizes source/result panes and the 230px output file tree.
On narrow screens, input and output stack vertically. Native expression warnings
remain visible; successful file conversion is not warehouse execution validation.
