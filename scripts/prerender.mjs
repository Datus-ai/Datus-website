// Build-time prerender for the marketing pages.
// Spins up Vite in SSR mode, loads src/prerender.tsx (TS/JSX/CSS handled by
// Vite), renders each route to a static HTML string, and injects it into the
// Vite-built shell's <div id="root"></div> in dist/. The client then hydrates.
//
// Before rendering, the `/zh` shells are derived from their English siblings
// (see scripts/lib/i18n-shells.mjs) so the Chinese routes have a document to be
// injected into, and the English ones gain their hreflang cluster.
//
// Run after `vite build`.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { buildLocaleShells } from "./lib/i18n-shells.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = join(ROOT, "dist");
const ROOT_DIV = '<div id="root"></div>';

async function main() {
  if (!existsSync(DIST)) {
    console.error("[prerender] dist/ not found — run `vite build` first.");
    process.exit(1);
  }

  const vite = await createServer({
    root: ROOT,
    logLevel: "warn",
    server: { middlewareMode: true },
    appType: "custom",
  });

  try {
    const i18n = await vite.ssrLoadModule("/src/i18n/build.ts");
    const { built, skipped } = buildLocaleShells(DIST, i18n);
    if (skipped.length) {
      console.warn(`[i18n] no built shell for: ${skipped.join(", ")}`);
    }
    console.log(`[i18n] wrote ${built} /zh shells + /en redirect stubs`);

    const { ROUTES, render } = await vite.ssrLoadModule("/src/prerender.tsx");
    let done = 0;
    for (const { out, node } of ROUTES) {
      const file = join(DIST, out);
      if (!existsSync(file)) {
        console.warn(`[prerender] skip ${out} — built shell not found`);
        continue;
      }
      const html = render(node);
      const shell = readFileSync(file, "utf8");
      if (!shell.includes(ROOT_DIV)) {
        console.warn(`[prerender] skip ${out} — no empty #root to inject into`);
        continue;
      }
      writeFileSync(file, shell.replace(ROOT_DIV, `<div id="root">${html}</div>`));
      done++;
    }
    console.log(`[prerender] prerendered ${done} marketing pages`);
  } finally {
    await vite.close();
  }
}

main().catch((err) => {
  console.error("[prerender] failed:", err);
  process.exit(1);
});
