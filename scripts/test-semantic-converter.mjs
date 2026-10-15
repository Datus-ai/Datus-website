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
  const { getTargets, convertModel } = await vite.ssrLoadModule(
    '/src/modules/semantic-converter/api.ts',
  );
  const { inspectSource, MAX_SOURCE_BYTES } = await vite.ssrLoadModule(
    '/src/modules/semantic-converter/utils/source.ts',
  );
  const { safeRelativePath, validateArtifacts, workingArtifacts } =
    await vite.ssrLoadModule(
      '/src/modules/semantic-converter/utils/artifacts.ts',
    );
  const { SEMANTIC_CONVERTER_UI: copy } =
    await vite.ssrLoadModule('/src/i18n/ui.ts');

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
          data:
            options.method === 'POST'
              ? { target: 'dbt', status: 'success', issues: [], artifacts: [] }
              : { targets: [{ id: 'dbt' }] },
        });
      };

      const { signal } = new AbortController();
      await getTargets(signal);
      await convertModel(
        { source: 'name: sales', target: 'dbt', options: {} },
        signal,
      );

      check(() => {
        assert.deepEqual(
          calls.map((call) => call.url),
          [
            'https://studio-dev.datus.ai/api/public/semantic-converter/targets',
            'https://studio-dev.datus.ai/api/public/semantic-converter/convert',
          ],
          host,
        );
        assert.ok(calls.every((call) => call.options.credentials === 'omit'));
      });
    }
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
