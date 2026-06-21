#!/usr/bin/env node
/**
 * Generate branded OpenGraph cards (1200x630 PNG) for the main pages.
 *
 * Renders scripts/og-template.html with per-card query params via headless
 * Chromium (Puppeteer) and writes PNGs into src/public/og/ (Vite publicDir,
 * served at /og/...). Run on demand and commit the output:
 *
 *     npm run og:build
 *
 * New/changed cards: edit the CARDS array below and re-run.
 */
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";
import { mkdir } from "node:fs/promises";
import puppeteer from "puppeteer";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const TEMPLATE = pathToFileURL(resolve(__dirname, "og-template.html")).href;
const OUT_DIR = resolve(ROOT, "src/public/og");

const CARDS = [
  { slug: "home", title: "The AI agent for end-to-end data engineering",
    subtitle: "SQL generation, semantic context, and governed workflow automation." },
  { slug: "faq", eyebrow: "FAQ", title: "Questions about the open-source data engineering agent" },
  { slug: "integrations", eyebrow: "Integrations", title: "Datus works with your entire data stack",
    subtitle: "Warehouses, catalogs, semantic layers, BI tools, and job schedulers." },
  { slug: "glossary", eyebrow: "Glossary", title: "The data engineering glossary",
    subtitle: "Plain-language definitions for the modern, AI-native data stack." },
  { slug: "pricing", eyebrow: "Pricing", title: "Free for individuals, custom for enterprises" },
  { slug: "products-cli", eyebrow: "Datus CLI", title: "The data engineering agent for your terminal" },
  { slug: "products-studio", eyebrow: "Datus Studio", title: "The hosted data engineering agent" },
  { slug: "products-enterprise", eyebrow: "Enterprise", title: "Governed data agent teams" },
  { slug: "products-vscode", eyebrow: "VS Code", title: "A data agent and context in your editor" },
  { slug: "blog-index", eyebrow: "Blog", title: "AI-native data engineering",
    subtitle: "Essays and guides on data agents, semantic layers, and evolvable context." },
  { slug: "blog-post", eyebrow: "Blog", title: "Datus Blog",
    subtitle: "Essays and guides from the team building the data engineering agent." },
];

const qs = (c) =>
  new URLSearchParams({
    ...(c.eyebrow ? { eyebrow: c.eyebrow } : {}),
    title: c.title,
    ...(c.subtitle ? { subtitle: c.subtitle } : {}),
    ...(c.tag ? { tag: c.tag } : {}),
  }).toString();

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
    for (const card of CARDS) {
      await page.goto(`${TEMPLATE}?${qs(card)}`, { waitUntil: "networkidle0" });
      await page.waitForFunction("window.__ogReady === true", { timeout: 15000 });
      const out = resolve(OUT_DIR, `${card.slug}-1200x630.png`);
      await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 } });
      console.log(`✓ ${card.slug}-1200x630.png`);
    }
  } finally {
    await browser.close();
  }
  console.log(`\nDone — ${CARDS.length} cards written to src/public/og/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
