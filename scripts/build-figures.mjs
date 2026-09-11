#!/usr/bin/env node
/**
 * Render blog figure sources (HTML) into PNGs committed with the post.
 *
 * Source:  blog/figures/<post-slug>/<figure-name>.html
 * Output:  blog/public/images/<post-slug>/<figure-name>.png   (served at /images/...)
 *
 *     npm run figures:build              # render every figure
 *     npm run figures:build -- <slug>    # only one post's figures
 *
 * Each source file must wrap its content in an element with id="figure";
 * that element is what gets screenshotted, so the PNG is cropped to the
 * artwork with no page chrome and no manual height bookkeeping.
 *
 * Rendered at deviceScaleFactor 2 for retina. Compress with the tiny-png
 * skill (pngquant) before committing — this script does not compress.
 */
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve, basename, join } from "node:path";
import { mkdir, readdir, stat } from "node:fs/promises";
import puppeteer from "puppeteer";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SRC_DIR = resolve(ROOT, "blog/figures");
const OUT_ROOT = resolve(ROOT, "blog/public/images");

const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));

async function listFigures() {
  const out = [];
  let slugs;
  try {
    slugs = await readdir(SRC_DIR);
  } catch {
    console.error(`No figure sources found at ${SRC_DIR}`);
    return out;
  }
  for (const slug of slugs.sort()) {
    if (slug.startsWith(".")) continue;
    if (!(await stat(join(SRC_DIR, slug))).isDirectory()) continue;
    if (only.length && !only.includes(slug)) continue;
    for (const file of (await readdir(join(SRC_DIR, slug))).sort()) {
      if (file.endsWith(".html")) out.push({ slug, file });
    }
  }
  return out;
}

async function main() {
  const figures = await listFigures();
  if (!figures.length) {
    console.log("Nothing to render.");
    return;
  }
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 2 });
    for (const { slug, file } of figures) {
      const src = pathToFileURL(join(SRC_DIR, slug, file)).href;
      await page.goto(src, { waitUntil: "networkidle0" });
      // Webfonts must be in before we measure, or the crop is wrong.
      await page.evaluate(() => document.fonts.ready);
      const el = await page.$("#figure");
      if (!el) throw new Error(`${slug}/${file}: no element with id="figure"`);
      const outDir = resolve(OUT_ROOT, slug);
      await mkdir(outDir, { recursive: true });
      const out = resolve(outDir, `${basename(file, ".html")}.png`);
      await el.screenshot({ path: out });
      const box = await el.boundingBox();
      console.log(`✓ ${slug}/${basename(file, ".html")}.png  (${Math.round(box.width)}×${Math.round(box.height)} @2x)`);
    }
  } finally {
    await browser.close();
  }
  console.log(`\nDone — ${figures.length} figure(s). Now run the tiny-png skill on the output directories.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
