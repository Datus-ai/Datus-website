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
  { slug: "home", title: "The enterprise data context layer",
    subtitle: "An Apache Ossie semantic layer and ontology your data agents can trust — live in days." },
  { slug: "faq", eyebrow: "FAQ", title: "Questions about the enterprise data context layer" },
  { slug: "integrations", eyebrow: "Integrations", title: "Datus works with your entire data stack",
    subtitle: "Warehouses, catalogs, semantic layers, BI tools, and job schedulers." },
  { slug: "databases", eyebrow: "Databases", title: "Eleven native database adapters",
    subtitle: "From embedded SQLite and DuckDB to Snowflake, StarRocks, Hive, Spark and Trino." },
  { slug: "models", eyebrow: "Models", title: "Bring your own LLM provider",
    subtitle: "OpenAI, Claude, Gemini, DeepSeek and more — mixed per workflow node." },
  { slug: "mcp", eyebrow: "MCP", title: "Model Context Protocol server for your warehouse",
    subtitle: "Plug Claude Desktop, Cursor and any MCP client into your data with shared context." },
  { slug: "chatbot", eyebrow: "Web Chatbot", title: "An AI data analyst in your browser",
    subtitle: "Chat with your warehouse from Slack or the browser — governed, traceable answers." },
  { slug: "glossary", eyebrow: "Glossary", title: "The data engineering glossary",
    subtitle: "Plain-language definitions for the modern, AI-native data stack." },
  { slug: "pricing", eyebrow: "Pricing", title: "Free for individuals, custom for enterprises" },
  { slug: "products-cli", eyebrow: "Datus agent", title: "The open-source data CLI for your terminal",
    subtitle: "Generates Apache Ossie semantic models from your schema and SQL history. Apache-2.0." },
  { slug: "products-studio", eyebrow: "Datus Studio", title: "The commercial context-aware co-pilot",
    subtitle: "Humans, BI and agents drive the whole stack in natural language." },
  { slug: "products-enterprise", eyebrow: "Enterprise", title: "Governed context for enterprise agent teams",
    subtitle: "SSO, RBAC, SQL policy and private / VPC deployment on the warehouse you own." },
  { slug: "products-vscode", eyebrow: "VS Code", title: "A data agent and context in your editor" },
  { slug: "blog-index", eyebrow: "Blog", title: "AI-native data engineering",
    subtitle: "Essays and guides on data agents, semantic layers, and evolvable context." },
  { slug: "blog-post", eyebrow: "Blog", title: "Datus Blog",
    subtitle: "Essays and guides from the team building the enterprise data context layer." },
  { slug: "osi-field-mapping", eyebrow: "Apache Ossie", title: "Eight semantic layers, one Apache Ossie spec",
    subtitle: "MetricFlow, Cube, LookML, AtScale, Snowflake, GoodData, Power BI and Databricks — mapped field by field." },
  { slug: "tools-osi-playground", eyebrow: "Apache Ossie Playground", title: "MetricFlow to Apache Ossie, in your browser",
    subtitle: "Validate, convert and diff MetricFlow YAML against the Apache Ossie (OSI) spec." },
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
