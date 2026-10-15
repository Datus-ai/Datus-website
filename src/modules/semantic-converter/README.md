# Website semantic model converter

This is an independent website implementation of the Studio Conversion
Workbench. It does not import a SaaS workspace package. Configuration, editable
output files, diagnostics, discard confirmations, snapshots and downloads follow
the Studio flow; project saving is omitted because this tool is anonymous.

- Route: `/tools/semantic-model-converter/`, with a `/zh/` mirror.
- Runtime hostname `localhost`, `127.0.0.1` or IPv6 loopback uses
  `https://studio-dev.datus.ai`; other hosts use `https://studio.datus.ai`.
  A localhost production preview also uses dev.
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
npm run preview
```

The unit checks cover hostname selection, UTF-8 limits, model selection,
unsafe/duplicate output paths, edited buffers, sample hashes and locale parity.
Verify real API calls from localhost against studio-dev before release; production
requires the public endpoints to be deployed on studio.datus.ai.
