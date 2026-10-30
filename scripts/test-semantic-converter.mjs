import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createServer } from 'vite';

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, entries: [] },
  logLevel: 'error',
});
let checks = 0;

function check(fn) {
  fn();
  checks++;
}

try {
  const { getTargets, convertModel, getSources, importModel } =
    await vite.ssrLoadModule('/src/modules/semantic-converter/api.ts');
  const { inspectSource, MAX_SOURCE_BYTES } = await vite.ssrLoadModule(
    '/src/modules/semantic-converter/utils/source.ts',
  );
  const { safeRelativePath, validateArtifacts, workingArtifacts } =
    await vite.ssrLoadModule(
      '/src/modules/semantic-converter/utils/artifacts.ts',
    );
  const { SEMANTIC_CONVERTER_UI: copy } =
    await vite.ssrLoadModule('/src/i18n/ui.ts');

  const { createSession, inputSnapshot, validSourceBundle } =
    await vite.ssrLoadModule(
      '/src/modules/semantic-converter/utils/session.ts',
    );
  const { importExample } = await vite.ssrLoadModule(
    '/src/modules/semantic-converter/examples/index.ts',
  );
  const { readWorkbenchLink, resolveWorkbenchLink, workbenchUrl } =
    await vite.ssrLoadModule('/src/modules/semantic-converter/utils/url-state.ts');
  const targets = { targets: ['omni', 'dbt', 'snowflake'].map((id) => ({ id })) };
  const sources = { sources: [
    ...['cube', 'omni', 'dbt', 'microsoft', 'future'].map((id) => ({ id, available: true })),
    { id: 'snowflake', available: false },
  ] };
  const cases = [
    ['', 'export', 'omni', 'omni', false],
    ['?direction=import&platform=dbt', 'import', 'dbt', 'dbt', false],
    ['?direction=import&example=microsoft', 'import', 'microsoft', 'microsoft', false],
    ['?direction=import&platform=dbt&example=cube', 'import', 'dbt', 'dbt', true],
    ['?direction=export&platform=snowflake&example=nvidia', 'export', 'snowflake', 'nvidia', false],
    ['?direction=export&example=retail', 'export', 'snowflake', 'retail', false],
    ['?platform=dbt', 'export', 'dbt', 'omni', false],
    ['?direction=invalid&platform=dbt', 'export', 'dbt', 'omni', true],
    ['?direction=import&platform=snowflake', 'import', 'cube', 'cube', true],
    ['?direction=export&platform=unknown', 'export', 'omni', 'omni', true],
    ['?direction=import&example=unknown', 'import', 'cube', 'cube', true],
    ['?direction=export&platform=', 'export', 'omni', 'omni', true],
    ['?direction=import&platform=future', 'import', 'future', undefined, false],
  ];
  for (const [search, direction, format, sample, invalid] of cases) {
    check(() => {
      const link = readWorkbenchLink(search);
      const resolved = resolveWorkbenchLink(link, direction === 'import' ? sources : targets);
      assert.equal(link.direction, direction, search);
      assert.equal(resolved.session.formatId, format, search);
      assert.equal(resolved.session.sampleId, sample, search);
      assert.equal(resolved.invalid, invalid, search);
      if (format === 'future') assert.deepEqual(resolved.session.files, []);
      if (direction === 'import' && sample) {
        assert.deepEqual(resolved.session.files, importExample(format), search);
      }
    });
  }
  check(() => {
    const link = readWorkbenchLink('?direction=import&platform=missing');
    const resolved = resolveWorkbenchLink(link, { sources: [{ id: 'dbt', available: true }] });
    assert.equal(resolved.session.formatId, 'dbt');
    assert.equal(resolved.invalid, true);
    assert.equal(resolveWorkbenchLink(link, { sources: [{ id: 'cube', available: false }] }), null);
    assert.equal(readWorkbenchLink('', 'import').direction, 'import');
  });
  check(() => {
    const session = createSession('dbt', importExample('dbt'), 'dbt');
    session.options.model_name = 'private-model';
    const url = new URL(workbenchUrl(
      'https://datus.ai/zh/tools/semantic-model-converter/?utm_source=partner&utm_campaign=launch&review=1&example=cube#converter',
      'import', session,
    ), 'https://datus.ai');
    assert.equal(url.pathname, '/zh/tools/semantic-model-converter/');
    assert.equal(url.hash, '#converter');
    assert.equal(url.searchParams.get('utm_source'), 'partner');
    assert.equal(url.searchParams.get('utm_campaign'), 'launch');
    assert.equal(url.searchParams.get('review'), '1');
    assert.equal(url.searchParams.get('platform'), 'dbt');
    assert.equal(url.searchParams.get('example'), 'dbt');
    assert.ok(!url.href.includes('private-model'));
    session.inputDirty = true;
    assert.equal(new URL(workbenchUrl(url.href, 'import', session), url).searchParams.has('example'), false);
    session.inputDirty = false;
    session.sampleId = 'private-filename.yml';
    assert.equal(new URL(workbenchUrl(url.href, 'import', session), url).searchParams.has('example'), false);
  });
  const originalFetch = globalThis.fetch;
  const originalWindow = globalThis.window;

  try {
    for (const host of [
      'localhost',
      '127.0.0.1',
      '::1',
      '[::1]',
      'datus.ai',
      'www.datus.ai',
      'preview.example',
      'localhost.attacker.example',
    ]) {
      const calls = [];
      globalThis.window = { location: { hostname: host } };
      globalThis.fetch = async (url, options) => {
        calls.push({ url, options });

        return Response.json({
          success: true,
          data: String(url).endsWith('/import')
            ? { target: 'ossie', status: 'success', issues: [], artifacts: [] }
            : options.method === 'POST'
              ? { target: 'dbt', status: 'success', issues: [], artifacts: [] }
              : String(url).endsWith('/sources')
                ? { sources: [{ id: 'cube', available: true }] }
                : { targets: [{ id: 'dbt' }] },
        });
      };

      const { signal } = new AbortController();
      await getTargets(signal);
      await convertModel(
        { source: 'name: sales', target: 'dbt', options: {} },
        signal,
      );

      await getSources(signal);
      await importModel(
        { source_format: 'cube', files: importExample('cube') },
        signal,
      );

      check(() => {
        assert.deepEqual(
          calls.map((call) => call.url),
          [
            'https://studio-dev.datus.ai/api/public/semantic-converter/targets',
            'https://studio-dev.datus.ai/api/public/semantic-converter/convert',
            'https://studio-dev.datus.ai/api/public/semantic-converter/sources',
            'https://studio-dev.datus.ai/api/public/semantic-converter/import',
          ],
          host,
        );
        assert.ok(calls.every((call) => call.options.credentials === 'omit'));
      });
    }
    globalThis.fetch = async () =>
      Response.json({
        success: true,
        data: { target: 'dbt', status: 'success', issues: [], artifacts: [] },
      });
    await assert.rejects(() =>
      importModel(
        { source_format: 'cube', files: importExample('cube') },
        new AbortController().signal,
      ),
    );
    checks++;
    globalThis.fetch = async () =>
      new Response('', { status: 429, headers: { 'Retry-After': '60' } });
    await assert.rejects(
      () =>
        importModel(
          { source_format: 'cube', files: importExample('cube') },
          new AbortController().signal,
        ),
      (error) => error.status === 429 && error.retryAfter === '60',
    );
    checks++;
  } finally {
    globalThis.fetch = originalFetch;

    if (originalWindow === undefined) {
      delete globalThis.window;
    } else {
      globalThis.window = originalWindow;
    }
  }

  for (const path of [
    'views/orders.view.yaml',
    'semantic_manifest.json',
    'models/sales.aml',
  ]) {
    check(() => assert.equal(safeRelativePath(path), true));
  }

  for (const path of [
    '',
    '/absolute.yml',
    '../escape.yml',
    'a/../escape.yml',
    'a\\escape.yml',
    'a//b',
    '.hidden.yml',
    'https://example.com/a',
    'a\u0000.yml',
  ]) {
    check(() => assert.equal(safeRelativePath(path), false));
  }

  check(() =>
    assert.throws(() =>
      validateArtifacts([
        { path: '../escape.yml', content: '', format: 'yaml' },
      ]),
    ),
  );
  check(() =>
    assert.throws(() =>
      validateArtifacts([
        { path: 'a.yml', content: '', format: 'yaml' },
        { path: 'A.yml', content: '', format: 'yaml' },
      ]),
    ),
  );
  check(() =>
    assert.throws(() =>
      validateArtifacts(
        Array.from({ length: 501 }, (_, i) => ({
          path: `${i}.yml`,
          content: '',
          format: 'yaml',
        })),
      ),
    ),
  );
  check(() =>
    assert.throws(() =>
      validateArtifacts([
        { path: 'a.yml', content: '汉'.repeat(4_000_000), format: 'yaml' },
      ]),
    ),
  );
  check(() =>
    assert.deepEqual(
      workingArtifacts(
        [{ path: 'a.yml', content: 'original', format: 'yaml' }],
        { 'a.yml': '' },
      )[0].content,
      '',
    ),
  );
  check(() =>
    assert.deepEqual(inspectSource('datasets: ['), {
      models: [],
      datasets: [],
      dialects: [],
    }),
  );
  check(() =>
    assert.deepEqual(inspectSource('汉'.repeat(MAX_SOURCE_BYTES)), {
      models: [],
      datasets: [],
      dialects: [],
    }),
  );

  const multi = JSON.stringify({
    semantic_model: [
      { name: 'first', datasets: [{ name: 'a' }] },
      { name: 'second', datasets: [{ name: 'b' }] },
    ],
  });
  check(() =>
    assert.deepEqual(inspectSource(multi).models, ['first', 'second']),
  );
  check(() => assert.deepEqual(inspectSource(multi).datasets, []));
  check(() => assert.deepEqual(inspectSource(multi, 'second').datasets, ['b']));

  const bundle = importExample('cube');
  check(() => assert.equal(bundle.length, 3));
  check(() => assert.equal(validSourceBundle(bundle), true));
  check(() => assert.equal(validSourceBundle([]), false));
  check(() => assert.equal(validSourceBundle(bundle, 1024 * 1024, 2), false));
  check(() =>
    assert.equal(
      validSourceBundle([{ path: '汉.yml', content: '' }], 5),
      false,
    ),
  );
  check(() =>
    assert.equal(
      validSourceBundle([{ path: '../a.yml', content: 'a' }]),
      false,
    ),
  );
  check(() =>
    assert.equal(
      validSourceBundle([
        { path: 'a.yml', content: '' },
        { path: 'A.yml', content: '' },
      ]),
      false,
    ),
  );
  const session = createSession('cube', bundle);
  const snapshot = inputSnapshot(session);
  bundle[0].content += '# edit';
  check(() => assert.notEqual(inputSnapshot(session), snapshot));
  check(() => assert.ok(!importExample('cube')[0].content.endsWith('# edit')));
  check(() => assert.equal(importExample('unknown').length, 0));
  for (const id of ['cube', 'omni', 'dbt', 'microsoft']) {
    check(() => assert.equal(validSourceBundle(importExample(id)), true));
  }

  const manifest = JSON.parse(
    readFileSync('src/modules/semantic-converter/samples/sources.json', 'utf8'),
  );

  for (const fixture of manifest.fixtures) {
    const bytes = readFileSync(
      `src/modules/semantic-converter/samples/${fixture.file}`,
    );
    check(() =>
      assert.equal(
        createHash('sha256').update(bytes).digest('hex'),
        fixture.sha256,
      ),
    );
    check(() =>
      assert.match(
        bytes.toString(),
        /Licensed to the Apache Software Foundation/,
      ),
    );
    check(() => assert.ok(inspectSource(bytes.toString()).datasets.length));
  }

  function leafKeys(value, prefix = '') {
    return Object.entries(value)
      .flatMap(([key, item]) =>
        typeof item === 'object'
          ? leafKeys(item, `${prefix}${key}.`)
          : `${prefix}${key}`,
      )
      .sort();
  }

  check(() => assert.deepEqual(leafKeys(copy.en), leafKeys(copy.zh)));
  console.log(`PASS: ${checks} semantic-converter checks`);
} finally {
  await vite.close();
}
