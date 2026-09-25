#!/usr/bin/env node
// Mechanical pre-flight for one blog post: frontmatter, structure, links,
// length, rhythm and Datus share. It does NOT judge facts or differentiation —
// that is the pre-publish audit (references/pre-publish-audit.md).
//
// Usage (from the repo root):
//   node .claude/skills/datus-blog/tools/check-post.mjs <slug|path> [--type <ArticleType>] [--keyword "<kw>"] [--retro]
//
// --type     GlossaryTerm | GlossaryComparison | Comparison | ToolsList |
//            Research | Pillar | Product | Tutorial  (enables length + Datus-share gates)
// --keyword  primary keyword; checked in the title and description
// --retro    auditing an already-published post: new-post-only rules
//            (slug year, meta lengths, structure, length floor) are reported
//            as WARN — a ported post may legitimately keep its author's
//            structure (references/porting-external-articles.md)
//
// Exit code 1 if any FAIL.

import { readFileSync, existsSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");
const POSTS = join(ROOT, "blog/posts");

// Mirrors references/article-types.md §1.
const TYPES = {
  glossaryterm: { floor: 2000, datus: 0.15 },
  glossarycomparison: { floor: 2200, datus: 0.15 },
  comparison: { floor: 2000, datus: 0.2 },
  toolslist: { floor: 2600, datus: 0.25 },
  research: { floor: 2600, datus: 0.25 },
  pillar: { floor: 3000, datus: 0.2 },
  product: { floor: 1600, datus: 0.4 },
  tutorial: { floor: 2300, datus: 0.3 },
};

const FILLER = [
  "in today's data-driven world", "in today's fast-paced", "it is important to note that",
  "as we all know", "the reality is that", "here's the thing", "but that's not all",
  "let's dive in", "consider the following",
];
const HYPE = ["revolutionary", "game-changing", "game changer", "guaranteed", "only solution"];
const FORBIDDEN_PREFIXES = ["/agent", "/features/", "/use-cases/", "/vs/", "/alternatives/", "/case-studies/"];
// Links that are deliberately dofollow: our own properties, and the official
// Apache Ossie sources used as trust signals (PR #79).
const DOFOLLOW_OK = (u) =>
  /(^|\.)datus\.ai$/.test(u.hostname) ||
  /(^|\.)apache\.org$/.test(u.hostname) ||
  (u.hostname === "github.com" && /^\/(Datus-ai|apache)\//i.test(u.pathname));

// ---------- args ----------
const argv = process.argv.slice(2);
const opt = (name) => {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : undefined;
};
const retro = argv.includes("--retro");
const target = argv.find((a, i) => !a.startsWith("--") && !["--type", "--keyword"].includes(argv[i - 1]));
if (!target) {
  console.error("usage: check-post.mjs <slug|path> [--type T] [--keyword kw] [--retro]");
  process.exit(2);
}
const file = existsSync(target) ? resolve(target) : join(POSTS, `${target}.md`);
if (!existsSync(file)) {
  console.error(`not found: ${file}`);
  process.exit(2);
}
const slug = basename(file, ".md");
const typeKey = (opt("--type") || "").toLowerCase().replace(/[^a-z]/g, "");
const type = TYPES[typeKey];
if (opt("--type") && !type) {
  console.error(`unknown --type ${opt("--type")}; known: ${Object.keys(TYPES).join(", ")}`);
  process.exit(2);
}
const keyword = (opt("--keyword") || "").toLowerCase();

// ---------- report ----------
const rows = [];
const add = (level, id, msg) => rows.push({ level, id, msg });
const pass = (id, msg) => add("PASS", id, msg);
const warn = (id, msg) => add("WARN", id, msg);
const fail = (id, msg) => add("FAIL", id, msg);
const newOnly = (id, msg) => (retro ? warn : fail)(id, msg);

// ---------- frontmatter ----------
const raw = readFileSync(file, "utf8");
const { data: fm, content: body } = matter(raw);

const title = String(fm.title || "");
const desc = String(fm.description || "");
if (!title) fail("F-title", "title missing");
else if (title.length > 60) warn("F-title", `title is ${title.length} chars (house target < ~60)`);
else pass("F-title", `title ${title.length} chars`);

if (!desc) fail("F-desc", "description missing");
else if (desc.length < 150 || desc.length > 160) newOnly("F-desc", `description is ${desc.length} chars (need 150–160)`);
else pass("F-desc", `description ${desc.length} chars`);

if (keyword) {
  if (!title.toLowerCase().includes(keyword)) warn("F-keyword", `title lacks "${keyword}"`);
  else pass("F-keyword", "keyword in title");
  if (!desc.toLowerCase().includes(keyword)) warn("F-keyword", `description lacks "${keyword}"`);
}

const author = String(fm.author || "");
if (!author) newOnly("F-author", "author missing (JSON-LD falls back to Organization) — use \"Evan Paul\"");
else if (/kostja/i.test(author)) fail("F-author", `author "${author}" — use "Evan Paul"`);
else if (author !== "Evan Paul") warn("F-author", `author "${author}" — default byline is "Evan Paul"; keep only if the operator named it`);
else pass("F-author", "author Evan Paul");

const isDate = (v) => v instanceof Date || /^\d{4}-\d{2}-\d{2}$/.test(String(v || ""));
if (!isDate(fm.date)) fail("F-date", "date missing or not YYYY-MM-DD");
if (!isDate(fm.lastmod)) warn("F-date", "lastmod missing or not YYYY-MM-DD");

const head = JSON.stringify(fm.head || []);
if (!/"keywords"/.test(head)) warn("F-keywords", "no keywords meta in head");
for (const bad of ["category", "secondaryCategory", "slug"]) {
  if (bad in fm) warn("F-fields", `frontmatter "${bad}" is unused here (categories live in build-blog.mjs, slug = filename)`);
}

if (/\b20\d{2}\b/.test(slug)) newOnly("F-slug", `slug "${slug}" contains a year`);
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) && !retro) warn("F-slug", `slug "${slug}" is not kebab-case`);

// ---------- structure ----------
const stripped = body.replace(/```[\s\S]*?```/g, "");
const h1s = stripped.match(/^# .+$/gm) || [];
if (h1s.length !== 1) newOnly("S-h1", `${h1s.length} H1 headings (need exactly 1)`);
const h2s = [...stripped.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());
if (h2s[0] !== "TL;DR") newOnly("S-tldr", `first ## is "${h2s[0] || "none"}", expected "TL;DR"`);
else pass("S-tldr", "TL;DR is the first block");
if (!h2s.includes("Conclusion") && !/takeaway/i.test(h2s.join("|"))) warn("S-conclusion", "no ## Conclusion");
if (!h2s.includes("Related articles")) newOnly("S-related", "no ## Related articles");

const faqStart = stripped.search(/^## Frequently asked questions\s*$/m);
if (faqStart < 0) newOnly("S-faq", "no ## Frequently asked questions");
else {
  const faq = stripped.slice(faqStart).split(/^## (?!Frequently)/m)[0];
  const n = (faq.match(/^### /gm) || []).length;
  if (n < 2) newOnly("S-faq", `${n} FAQ questions (need ≥2 for FAQPage JSON-LD)`);
  else if (n < 4 || n > 6) warn("S-faq", `${n} FAQ questions (target 4–6)`);
  else pass("S-faq", `${n} FAQ questions`);
}
if (/disclosure/i.test(stripped)) newOnly("S-disclosure", "contains a Disclosure block/phrase — not allowed");

// ---------- links ----------
const configTs = readFileSync(join(ROOT, "src/i18n/config.ts"), "utf8");
const routes = new Set([...configTs.matchAll(/^\s*"(\/[^"]*)",?$/gm)].map((m) => m[1]));
routes.add("/blog/").add("/data-engineering-agent/");

const mdLinks = [...body.matchAll(/(?<!!)\[[^\]]*\]\(([^)\s]+)[^)]*\)/g)].map((m) => ({ url: m[1], html: false }));
const htmlLinks = [...body.matchAll(/<a\s[^>]*href="([^"]+)"[^>]*>/g)].map((m) => ({ url: m[1], html: true, tag: m[0] }));
const internal = new Set();
const external = new Set();
const seen = new Set();

for (const { url, html, tag } of [...mdLinks, ...htmlLinks]) {
  if (url.startsWith("#") || url.startsWith("mailto:") || seen.has(url)) continue;
  seen.add(url);
  if (/^https?:\/\//.test(url)) {
    let u;
    try { u = new URL(url); } catch { fail("L-ext", `malformed URL ${url}`); continue; }
    if (u.hostname === "datus.ai") { warn("L-int", `absolute own-site link ${url} — use a root-relative path`); continue; }
    external.add(url);
    if (DOFOLLOW_OK(u)) continue;
    if (!html) warn("L-ext", `external link as Markdown: ${url} — use <a … rel="nofollow noopener">`);
    else if (!/rel="[^"]*nofollow[^"]*"/.test(tag) || !/rel="[^"]*noopener[^"]*"/.test(tag)) fail("L-ext", `external link without rel="nofollow noopener": ${url}`);
    continue;
  }
  if (!url.startsWith("/")) { warn("L-int", `relative link ${url}`); continue; }
  const path = url.split("#")[0].split("?")[0];
  if (FORBIDDEN_PREFIXES.some((p) => path === p || path.startsWith(p.endsWith("/") ? p : `${p}/`))) {
    fail("L-int", `link to a route that does not exist: ${url}`);
    continue;
  }
  const blog = path.match(/^\/blog\/([^/]+)\/?$/);
  if (blog) {
    if (blog[1] === slug) continue;
    internal.add(blog[1]);
    if (!existsSync(join(POSTS, `${blog[1]}.md`))) fail("L-int", `dead internal link ${url}`);
    else if (!path.endsWith("/")) warn("L-int", `missing trailing slash: ${url}`);
    continue;
  }
  if (path.startsWith("/images/")) {
    if (!existsSync(join(ROOT, "blog/public", path))) fail("L-img", `missing image ${path}`);
    continue;
  }
  if (!routes.has(path)) warn("L-int", `unrecognised site path ${url} — confirm the route exists`);
}
for (const m of body.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)) {
  if (m[1].startsWith("/images/") && !existsSync(join(ROOT, "blog/public", m[1]))) fail("L-img", `missing image ${m[1]}`);
  if (m[1].startsWith("/blog/images/")) fail("L-img", `image path ${m[1]} — use /images/<slug>/…`);
}
const ni = internal.size;
(ni < 3 || ni > 6 ? warn : pass)("L-count", `${ni} unique internal blog links (target 3–6)`);
const ne = external.size;
(ne < 2 || ne > 5 ? warn : pass)("L-count", `${ne} unique external links (target 2–5)`);

// ---------- length, rhythm, Datus share ----------
const faqIdx = body.search(/^## Frequently asked questions\s*$/m);
const narrativeSrc = (faqIdx >= 0 ? body.slice(0, faqIdx) : body)
  .replace(/```[\s\S]*?```/g, " ")
  .replace(/^\s*\|.*$/gm, " ")
  .replace(/<[^>]+>/g, " ");
const words = (s) => (s.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").match(/[A-Za-z0-9][A-Za-z0-9'’-]*/g) || []).length;
const narrative = words(narrativeSrc.replace(/^#+ .*$/gm, " "));
if (type) {
  if (narrative < type.floor) newOnly("W-length", `${narrative} narrative words < floor ${type.floor} for ${opt("--type")}`);
  else pass("W-length", `${narrative} narrative words (floor ${type.floor})`);
} else {
  add("INFO", "W-length", `${narrative} narrative words (pass --type to gate)`);
}

const allBlocks = narrativeSrc.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
const blocks = allBlocks.filter((b) => !/^#/.test(b));
const isList = (b) => /^([-*+]|\d+\.)\s/.test(b);
const listWords = blocks.filter(isList).reduce((n, b) => n + words(b), 0);
const listShare = narrative ? listWords / narrative : 0;
(listShare > 0.25 ? warn : pass)("W-lists", `bullet lists are ${(listShare * 100).toFixed(0)}% of the body (≤25%)`);

const paras = blocks.filter((b) => !/^([-*+>]|\d+\.)\s/.test(b));
const sentences = (p) => (p.match(/[.!?](\s|$)/g) || []).length || 1;
const longParas = paras.filter((p) => sentences(p) >= 4).length;
(longParas < 3 ? warn : pass)("W-rhythm", `${longParas} paragraphs of ≥4 sentences (≥3)`);
// A heading, list or blockquote breaks a run of short paragraphs.
let run = 0, worst = 0;
for (const b of allBlocks) {
  if (/^#/.test(b) || isList(b) || b.startsWith(">")) { run = 0; continue; }
  run = sentences(b) <= 2 ? run + 1 : 0;
  worst = Math.max(worst, run);
}
(worst >= 4 ? warn : pass)("W-rhythm", `longest run of short paragraphs: ${worst} (<4)`);

const datusParas = paras.filter((p) => /\bDatus\b/.test(p)).length;
const share = paras.length ? datusParas / paras.length : 0;
const shareMsg = `Datus in ${datusParas}/${paras.length} paragraphs ≈ ${(share * 100).toFixed(0)}%`;
if (type) (share > type.datus ? warn : pass)("W-datus", `${shareMsg} (cap ${type.datus * 100}%, estimate)`);
else add("INFO", "W-datus", shareMsg);

const lower = body.toLowerCase();
const fillers = FILLER.filter((f) => lower.includes(f));
if (fillers.length) warn("W-filler", `filler phrases: ${fillers.join("; ")}`);
const hype = HYPE.filter((h) => lower.includes(h));
if (hype.length) warn("W-hype", `hype words: ${hype.join(", ")}`);
if (/\b(just|merely) a (chatbot|wrapper|toy)\b/i.test(body)) warn("W-g7", "possible disparaging competitor phrasing (G7)");

// ---------- wiring ----------
const buildBlog = readFileSync(join(ROOT, "scripts/build-blog.mjs"), "utf8");
if (!buildBlog.includes(`"${slug}"`)) warn("X-category", `"${slug}" not in any CATEGORIES list in scripts/build-blog.mjs`);
else pass("X-category", "listed in CATEGORIES");
const glossary = readFileSync(join(ROOT, "src/glossary/glossaryData.ts"), "utf8");
if (glossary.includes(`/blog/${slug}/`)) pass("X-glossary", "a glossary term links here");
else add("INFO", "X-glossary", "no glossary term links here (fine unless this is a glossary term's post)");

// ---------- output ----------
const order = { FAIL: 0, WARN: 1, INFO: 2, PASS: 3 };
rows.sort((a, b) => order[a.level] - order[b.level]);
for (const r of rows) console.log(`${r.level.padEnd(4)} | ${r.id.padEnd(12)} | ${r.msg}`);
const count = (l) => rows.filter((r) => r.level === l).length;
console.log(`\n${slug}: ${count("PASS")} pass · ${count("WARN")} warn · ${count("FAIL")} fail${retro ? " (retro)" : ""}`);
process.exit(count("FAIL") ? 1 : 0);
