// Build-time prerender for the marketing pages.
// Spins up Vite in SSR mode, loads src/prerender.tsx (TS/JSX/CSS handled by
// Vite), renders each route to a static HTML string, and injects it into the
// Vite-built shell's <div id="root"></div> in dist/. The client then hydrates.
//
// Run after `vite build`.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

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
