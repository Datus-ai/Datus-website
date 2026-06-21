// Static blog generator — replaces VitePress.
// Renders blog/posts/*.md into styled static HTML at /blog/<slug>/ (short URLs),
// builds a lovable-style category index at /blog/, and emits meta-refresh
// redirect stubs at the old /blog/posts/<slug>/ paths for SEO continuity.
//
// Output is written into dist/ (run after `vite build`).

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const POSTS_DIR = join(ROOT, "blog", "posts");
const DIST = join(ROOT, "dist");
const SITE = "https://datus.ai";
const GA_ID = "G-EPVCH78EZP";
const GITHUB_URL = "https://github.com/Datus-ai/Datus-agent";
const STUDIO_URL = "https://studio.datus.ai/overview?utm_source=datus.ai&utm_medium=blog&utm_campaign=get_started";
const SLACK_URL = "https://join.slack.com/t/datus-ai/shared_invite/zt-3g6h4fsdg-iOl5uNoz6A4GOc4xKKWUYg";
const DOCS_URL = "https://docs.datus.ai";

// Mirrors src/config/nav.ts so the static blog nav matches the React SiteNav.
const PRODUCTS_NAV = [
  { label: "Datus CLI", href: "/products/cli/", desc: "Run the modern data stack from your terminal." },
  { label: "VS Code Extension", href: "/products/vscode/", desc: "Bring context and agents into your editor." },
  { label: "Datus Studio", href: "/products/studio/", desc: "The easiest way to start — free, no setup." },
  { label: "Enterprise", href: "/products/enterprise/", desc: "Shared context, governance, long-running agents." },
];

const md = new MarkdownIt({ html: true, linkify: true, typographer: true });
md.use(anchor, { permalink: anchor.permalink.headerLink() });

/* -------- category structure (ported from the old VitePress sidebar) -------- */
const CATEGORIES = [
  { label: "What is Datus", description: "Start here — the problem, the product, and the thesis behind it.",
    slugs: ["meet-the-general-chat-agent", "meet_datus", "agentic-data-stack", "welcome"] },
  { label: "Data Engineering Agent", description: "The category, the comparisons, and how to build with one — our core cluster.",
    slugs: ["sql-was-never-the-hard-part", "what-is-data-engineering-agent-2026", "what-is-data-engineering-agent",
      "contextual-data-engineering", "best-data-engineering-agents-2026", "open-source-data-engineering-agents",
      "build-your-first-data-engineering-agent", "data-engineering-agent-vs-claude-code",
      "data-engineering-agent-vs-sql-copilot", "one-person-data-team", "context-engine-data-engineering-agent-accuracy",
      "mcp-data-engineering", "enterprise-data-engineering-agent", "subagents-domain-specific-data-agents",
      "best-data-engineering-agents", "ai-native-data-platforms", "platform-native-data-agents-compared"] },
  { label: "Semantic Layer", description: "What a semantic layer is, and how it differs from a metric layer, model, ontology, or catalog.",
    slugs: ["what-is-semantic-layer", "what-is-metric-layer", "what-is-semantic-model", "semantic-layer-vs-ontology",
      "open-semantic-interchange-osi", "dbt-semantic-layer-metricflow", "cube-agentic-analytics", "what-is-gooddata"] },
  { label: "Glossary", description: "Core data engineering terms — defined, with how they connect to agents and context.",
    slugs: ["what-is-text-to-sql", "what-is-schema-linking", "rag-data-engineering", "what-is-data-catalog",
      "what-is-data-mesh", "what-is-data-agent"] },
  { label: "Why agents, not copilots", description: "The shift from assistive AI to autonomous data workflows.",
    slugs: ["why-data-engineering-needs-agents-not-just-copilots",
      "agentic-data-engineering-vs-traditional-data-engineering",
      "what-autonomous-data-engineering-actually-looks-like-in-practice"] },
  { label: "Architecture and pipelines", description: "How agentic data systems are built and run.",
    slugs: ["datus-storage-layer", "data-engineering-agent-architecture",
      "ai-data-pipeline-automation-use-cases-architecture-and-tradeoffs",
      "agentic-etl-what-changes-beyond-traditional-etl"] },
  { label: "Why context is everything", description: "Why durable, structured context is what makes agents reliable.",
    slugs: ["why-ai-agents-need-semantic-context-to-work-reliably", "how-structured-context-improves-ai-agent-output",
      "semantic-modeling-for-agentic-analytics-workflows", "why-reliable-data-agents-need-more-than-good-prompts"] },
  { label: "Tooling and integrations", description: "How Datus connects to the rest of your stack.",
    slugs: ["how-mcp-changes-data-workflow-automation", "using-mcp-extensions-in-data-engineering-workflows",
      "beyond-sql-how-datus-integrates-with-your-entire-data-toolchain"] },
  { label: "In practice", description: "Use cases and operating models from real teams.",
    slugs: ["data-engineering-agent-use-cases", "the-operating-model-of-an-agentic-data-team",
      "make-data-agents-truly-usable-ask-explore-and-control-with-confidence"] },
  { label: "Releases", description: "What's new in Datus.",
    slugs: ["datus-0-2-6-release-equipping-the-agent-with-a-brain"] },
];

/* ------------------------------- helpers ------------------------------- */
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
  .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// The post template already renders the title as the page <h1>. Render the body
// so each post has exactly one <h1> (duplicate top-level headings are an on-page
// SEO issue): drop a leading markdown H1 (the redundant title), then demote any
// remaining body H1 -> H2 — several posts (mis)use single '#' for section
// headings, which would otherwise emit multiple <h1>s.
function renderBody(content) {
  const stripped = content.replace(/^\s*#\s+.+\r?\n+/, "");
  return md.render(stripped).replace(/<(\/?)h1\b/g, "<$1h2");
}

function fmtDate(d) {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date)) return String(d);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

function readPosts() {
  // index.md is the old "All Posts" listing page — superseded by our generated
  // index and already covered by the /blog/posts/ redirect.
  const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md") && f !== "index.md");
  const posts = new Map();
  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const raw = readFileSync(join(POSTS_DIR, file), "utf8");
    const { data, content } = matter(raw);
    posts.set(slug, {
      slug,
      title: data.title || slug,
      description: data.description || "",
      author: data.author || "",
      date: data.date || "",
      lastmod: data.lastmod || data.date || "",
      keywords: extractKeywords(data),
      html: renderBody(content),
    });
  }
  return posts;
}

// frontmatter `head` array may carry a keywords meta — pull it through for SEO.
function extractKeywords(data) {
  if (!Array.isArray(data.head)) return "";
  for (const entry of data.head) {
    if (Array.isArray(entry) && entry[0] === "meta" && entry[1]?.name === "keywords") {
      return entry[1].content || "";
    }
  }
  return "";
}

/* ------------------------------- chrome ------------------------------- */
// Inline lucide SVGs so the static nav matches the React SiteNav icons exactly.
const SVG = {
  chevron: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  github: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>',
  star: '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  burger: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>',
};

function navHtml() {
  const products = PRODUCTS_NAV.map((p) =>
    `<a class="nav-dd__item" href="${p.href}"><span class="nav-dd__item-title">${esc(p.label)}</span><span class="nav-dd__item-desc">${esc(p.desc)}</span></a>`).join("");
  const community = [["GitHub", GITHUB_URL], ["Slack", SLACK_URL], ["Docs", DOCS_URL]].map(([l, h]) =>
    `<a class="nav-dd__item" href="${h}" target="_blank" rel="noopener noreferrer"><span class="nav-dd__item-title">${l}</span></a>`).join("");
  return `<header class="site-nav"><div class="site-nav__inner">
  <a class="site-nav__logo" href="/" aria-label="Datus home"><img src="/logo_dark.svg" alt="Datus" /></a>
  <nav class="site-nav__links" aria-label="Primary">
    <div class="nav-dd"><button class="nav-link" type="button">Products ${SVG.chevron}</button>
      <div class="nav-dd__menu">${products}</div></div>
    <a class="nav-link" href="/integrations/">Integrations</a>
    <a class="nav-link" href="/pricing/">Pricing</a>
    <a class="nav-link" href="/blog/">Blog</a>
    <div class="nav-dd"><button class="nav-link" type="button">Community ${SVG.chevron}</button>
      <div class="nav-dd__menu">${community}</div></div>
  </nav>
  <div class="site-nav__spacer"></div>
  <a class="nav-ghost-btn" href="${GITHUB_URL}" target="_blank" rel="noopener noreferrer">${SVG.github}<span class="star">${SVG.star}</span><span id="gh-stars">1.2k</span></a>
  <a class="btn btn-primary btn-sm" href="${STUDIO_URL}">Get started</a>
  <button class="site-nav__burger" type="button" aria-label="Menu" onclick="this.closest('.site-nav').classList.toggle('open')">${SVG.burger}</button>
</div></header>`;
}

// Live GitHub star count (mirrors src/hooks/useGitHubStars.ts) for nav parity.
function navScript() {
  return `<script>(function(){var K="datus:github-stars",T=216e5;function f(c){if(c<1000)return""+c;var t=c/1000;return t>=10?Math.round(t)+"k":t.toFixed(1)+"k";}
function s(c){var e=document.getElementById("gh-stars");if(e)e.textContent=f(c);}
try{var r=JSON.parse(localStorage.getItem(K));if(r&&typeof r.count==="number"){s(r.count);if(r.ts&&Date.now()-r.ts<T)return;}}catch(e){}
fetch("https://api.github.com/repos/Datus-ai/Datus-agent").then(function(x){return x.ok?x.json():null}).then(function(d){if(!d||typeof d.stargazers_count!=="number")return;s(d.stargazers_count);try{localStorage.setItem(K,JSON.stringify({count:d.stargazers_count,ts:Date.now()}))}catch(e){}}).catch(function(){});})();</script>`;
}

function footerHtml() {
  const year = 2026;
  return `<footer class="site-foot"><div class="container" style="display:flex;flex-wrap:wrap;gap:24px;justify-content:space-between;align-items:center">
  <a href="/" aria-label="Datus home"><img src="/logo_dark.svg" alt="Datus" style="height:24px"/></a>
  <nav style="display:flex;gap:20px;flex-wrap:wrap;font-size:14px;color:var(--ink-muted)">
    <a href="/products/cli/">CLI</a><a href="/products/studio/">Studio</a>
    <a href="/integrations/">Integrations</a><a href="/pricing/">Pricing</a>
    <a href="/blog/">Blog</a><a href="/glossary/">Glossary</a><a href="/faq/">FAQ</a>
    <a href="${GITHUB_URL}" target="_blank" rel="noopener noreferrer">GitHub</a>
  </nav>
  <span style="font-size:13px;color:var(--ink-faint)">© ${year} DatusAI, Inc.</span>
</div></footer>`;
}

function gaHtml() {
  return `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag("consent","default",{ad_storage:"denied",analytics_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",wait_for_update:500});</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>gtag("js",new Date());gtag("config","${GA_ID}");</script>`;
}

function shell({
  title, description, canonical, head = "", body,
  type = "website", image = `${SITE}/og/home-1200x630.png`,
  published = "", modified = "",
}) {
  const articleMeta = type === "article"
    ? (published ? `<meta property="article:published_time" content="${published}" />` : "")
      + (modified ? `<meta property="article:modified_time" content="${modified}" />` : "")
    : "";
  return `<!DOCTYPE html>
<html lang="en-US"><head>
<meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<meta name="robots" content="index, follow, max-image-preview:large" />
<link rel="canonical" href="${canonical}" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="stylesheet" href="/blog/blog.css" />
<meta property="og:type" content="${type}" /><meta property="og:site_name" content="Datus" /><meta property="og:locale" content="en_US" />
<meta property="og:title" content="${esc(title)}" /><meta property="og:description" content="${esc(description)}" />
<meta property="og:url" content="${canonical}" /><meta property="og:image" content="${image}" />
<meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" />${articleMeta}
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(title)}" /><meta name="twitter:description" content="${esc(description)}" />
<meta name="twitter:image" content="${image}" />
${head}
${gaHtml()}
</head><body><div class="site-root">${navHtml()}<main>${body}</main>${footerHtml()}</div>${navScript()}</body></html>`;
}

/* ------------------------------- pages ------------------------------- */
function postPage(post) {
  const canonical = `${SITE}/blog/${post.slug}/`;
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Article",
    headline: post.title, description: post.description,
    datePublished: post.date ? new Date(post.date).toISOString() : undefined,
    dateModified: post.lastmod ? new Date(post.lastmod).toISOString() : undefined,
    author: post.author ? { "@type": "Person", name: post.author } : { "@type": "Organization", name: "Datus" },
    publisher: { "@type": "Organization", name: "Datus", logo: { "@type": "ImageObject", url: `${SITE}/logo_dark.svg` } },
    mainEntityOfPage: canonical,
  };
  const head =
    (post.keywords ? `<meta name="keywords" content="${esc(post.keywords)}" />\n` : "") +
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;
  const meta = [post.author, fmtDate(post.date)].filter(Boolean).join(" · ");
  const body = `<article class="section" style="padding-top:48px">
  <div class="container" style="max-width:760px">
    <a class="link-arrow" href="/blog/" style="margin-bottom:20px">← All posts</a>
    <h1 class="post-title">${esc(post.title)}</h1>
    ${meta ? `<p class="post-meta">${esc(meta)}</p>` : ""}
    <div class="prose">${post.html}</div>
    <div class="post-cta">
      <a class="btn btn-primary btn-lg" href="${STUDIO_URL}">Try Studio free</a>
      <a class="btn btn-ghost btn-lg" href="${GITHUB_URL}" target="_blank" rel="noopener noreferrer">★ Star on GitHub</a>
    </div>
  </div></article>`;
  return shell({
    title: `${post.title} | Datus Blog`, description: post.description, canonical, head, body,
    type: "article",
    published: post.date ? new Date(post.date).toISOString() : "",
    modified: post.lastmod ? new Date(post.lastmod).toISOString() : "",
  });
}

function indexPage(posts) {
  const known = new Set(CATEGORIES.flatMap((c) => c.slugs));
  const extras = [...posts.keys()].filter((s) => !known.has(s));
  const cats = extras.length
    ? [...CATEGORIES, { label: "More essays", description: "", slugs: extras }]
    : CATEGORIES;

  const sections = cats.map((cat) => {
    const items = cat.slugs.filter((s) => posts.has(s)).map((s) => posts.get(s));
    if (!items.length) return "";
    const cards = items.map((p) => `<a class="post-row" href="/blog/${p.slug}/">
      <div class="post-row__main"><h3 class="post-row__title">${esc(p.title)}</h3>
      <p class="post-row__desc">${esc(p.description)}</p></div>
      <span class="post-row__date">${fmtDate(p.date)}</span></a>`).join("");
    return `<section class="blog-cat" id="${slugify(cat.label)}">
      <div class="blog-cat__head"><h2 class="blog-cat__label">${esc(cat.label)}</h2>
      ${cat.description ? `<p class="blog-cat__desc">${esc(cat.description)}</p>` : ""}</div>
      <div class="post-list">${cards}</div></section>`;
  }).join("");

  const tabs = cats.map((c) => `<a class="blog-tab" href="#${slugify(c.label)}">${esc(c.label)}</a>`).join("");

  const body = `<section class="section" style="padding-top:64px;padding-bottom:32px">
    <div class="container" style="max-width:880px">
      <span class="eyebrow">Datus Blog</span>
      <h1 style="font-size:clamp(32px,4.6vw,52px);line-height:1.06;letter-spacing:-0.03em;font-weight:750;margin:18px 0 0">
        A working catalog on agents, semantics, and context.</h1>
      <p class="lead">Essays and guides on data engineering agents, semantic layers, MCP, and text-to-SQL.</p>
      <div class="blog-tabs">${tabs}</div>
    </div></section>
    <div class="container" style="max-width:880px">${sections}</div>`;
  return shell({
    title: "Datus Blog — AI-Native Data Engineering",
    description: "Essays and guides on data engineering agents, semantic layers, MCP, text-to-SQL, and evolvable context — from the team building Datus.",
    canonical: `${SITE}/blog/`, body,
  });
}

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function redirectStub(oldPath, target) {
  return `<!DOCTYPE html><html lang="en-US"><head><meta charset="UTF-8" />
<title>Redirecting…</title><link rel="canonical" href="${SITE}${target}" />
<meta name="robots" content="noindex, follow" />
<meta http-equiv="refresh" content="0; url=${target}" />
<script>location.replace(${JSON.stringify(target)});</script>
</head><body>Redirecting to <a href="${target}">${target}</a>…</body></html>`;
}

/* ------------------------------- css ------------------------------- */
function blogCss() {
  const base = readFileSync(join(ROOT, "src", "styles", "site.css"), "utf8");
  const prose = `
/* blog index */
.blog-tabs{display:flex;flex-wrap:wrap;gap:8px;margin-top:26px}
.blog-tab{font-family:var(--font-mono);font-size:13px;color:var(--ink-muted);padding:7px 13px;border-radius:999px;border:1px solid var(--line);background:var(--panel)}
.blog-tab:hover{color:#fff;border-color:var(--brand-bright)}
.blog-cat{padding-block:36px;border-top:1px solid var(--line);scroll-margin-top:var(--nav-h)}
.blog-cat__label{font-size:22px;font-weight:700;margin:0}
.blog-cat__desc{color:var(--ink-muted);font-size:14.5px;margin:6px 0 0;max-width:60ch}
.post-list{display:grid;gap:2px;margin-top:18px}
.post-row{display:flex;gap:20px;justify-content:space-between;align-items:baseline;padding:16px;border-radius:12px;transition:background .15s ease}
.post-row:hover{background:var(--panel)}
.post-row__title{font-size:16.5px;font-weight:650;margin:0;color:var(--ink)}
.post-row__desc{font-size:14px;color:var(--ink-muted);margin:5px 0 0;line-height:1.55;max-width:66ch}
.post-row__date{font-family:var(--font-mono);font-size:12.5px;color:var(--ink-faint);white-space:nowrap;flex-shrink:0}
/* article */
.post-title{font-size:clamp(28px,3.6vw,42px);line-height:1.12;letter-spacing:-0.02em;font-weight:750;margin:14px 0 0}
.post-meta{font-family:var(--font-mono);font-size:13px;color:var(--ink-faint);margin:14px 0 0}
.post-cta{display:flex;gap:12px;flex-wrap:wrap;margin-top:48px;padding-top:32px;border-top:1px solid var(--line)}
.prose{margin-top:32px;color:var(--ink-dim);font-size:16.5px;line-height:1.75}
.prose h2{font-size:26px;font-weight:700;letter-spacing:-0.01em;color:var(--ink);margin:42px 0 14px;line-height:1.2}
.prose h3{font-size:20px;font-weight:650;color:var(--ink);margin:32px 0 12px}
.prose h4{font-size:17px;font-weight:650;color:var(--ink);margin:26px 0 10px}
.prose p{margin:0 0 18px}
.prose a{color:var(--brand-bright);text-decoration:underline;text-underline-offset:2px}
.prose a.header-anchor{text-decoration:none;color:inherit}
.prose ul,.prose ol{margin:0 0 18px;padding-left:24px;display:grid;gap:8px}
.prose li{padding-left:4px}
.prose strong{color:var(--ink);font-weight:650}
.prose blockquote{margin:24px 0;padding:4px 18px;border-left:3px solid var(--brand);color:var(--ink-muted);background:var(--panel);border-radius:0 8px 8px 0}
.prose code{font-family:var(--font-mono);font-size:0.88em;background:rgba(124,137,196,.14);padding:2px 6px;border-radius:5px;color:#dfe3ff}
.prose pre{margin:22px 0;padding:16px 18px;border-radius:12px;background:#070d22;border:1px solid var(--line-strong);overflow-x:auto}
.prose pre code{background:none;padding:0;font-size:13.5px;line-height:1.6;color:#dfe3ff}
.prose img{max-width:100%;height:auto;border-radius:12px;border:1px solid var(--line);margin:24px 0}
.prose table{width:100%;border-collapse:collapse;margin:24px 0;font-size:14.5px}
.prose th,.prose td{border:1px solid var(--line-strong);padding:10px 12px;text-align:left}
.prose th{background:var(--panel);color:var(--ink);font-weight:650}
.prose hr{border:none;border-top:1px solid var(--line);margin:36px 0}
@media (max-width:640px){.post-row{flex-direction:column;gap:6px}.post-row__date{order:-1}}
`;
  return base + "\n" + prose;
}

/* --------------------------- reference pages --------------------------- */
// The /blog/data-engineering-agent/ guide + subpage were standalone VitePress
// pages (not under posts/). Re-render them through the same pipeline so their
// indexed URLs keep working after VitePress is removed.
function buildReferencePages() {
  const dir = join(ROOT, "blog", "data-engineering-agent");
  if (!existsSync(dir)) return [];
  const out = [];
  const files = readdirSync(dir).filter((f) => f.endsWith(".md"));
  for (const file of files) {
    const { data, content } = matter(readFileSync(join(dir, file), "utf8"));
    const isIndex = file === "index.md";
    const sub = isIndex ? "" : `${file.replace(/\.md$/, "")}/`;
    const urlPath = `/blog/data-engineering-agent/${sub}`;
    const canonical = `${SITE}${urlPath}`;
    const post = {
      slug: "", title: data.title || "Data Engineering Agent",
      description: data.description || "", author: data.author || "",
      date: data.date || "", lastmod: data.lastmod || data.date || "",
      keywords: extractKeywords(data), html: renderBody(content),
    };
    const body = `<article class="section" style="padding-top:48px"><div class="container" style="max-width:760px">
      <a class="link-arrow" href="/blog/" style="margin-bottom:20px">← All posts</a>
      <h1 class="post-title">${esc(post.title)}</h1>
      <div class="prose">${post.html}</div>
      <div class="post-cta"><a class="btn btn-primary btn-lg" href="${STUDIO_URL}">Try Studio free</a>
      <a class="btn btn-ghost btn-lg" href="${GITHUB_URL}" target="_blank" rel="noopener noreferrer">★ Star on GitHub</a></div>
    </div></article>`;
    const html = shell({
      title: `${post.title} | Datus`, description: post.description, canonical, body,
      type: "article",
      published: post.date ? new Date(post.date).toISOString() : "",
      modified: post.lastmod ? new Date(post.lastmod).toISOString() : "",
    });
    write(join(DIST, "blog", "data-engineering-agent", sub, "index.html"), html);
    out.push({ urlPath, isIndex, html });
  }
  // Keep the root /data-engineering-agent/ copy (was duplicated by the old build).
  const idx = out.find((p) => p.isIndex);
  if (idx) write(join(DIST, "data-engineering-agent", "index.html"), idx.html);
  return out;
}

/* ------------------------------- write ------------------------------- */
function write(file, content) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

// YYYY-MM-DD for sitemap <lastmod>; falls back to the build date.
function isoDate(d, fallback) {
  if (!d) return fallback;
  const date = new Date(d);
  return isNaN(date) ? fallback : date.toISOString().slice(0, 10);
}

const BUILD_DATE = "2026-06-11";

// Wrap {loc, lastmod} entries into a <urlset> document.
function urlset(entries) {
  const body = entries.map((u) =>
    `  <url><loc>${SITE}${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

// Marketing pages — stable, low-churn URLs.
function buildPagesSitemap() {
  const entries = [
    "/", "/products/cli/", "/products/vscode/", "/products/studio/", "/products/enterprise/",
    "/integrations/", "/pricing/", "/glossary/", "/faq/",
  ].map((loc) => ({ loc, lastmod: BUILD_DATE }));
  return urlset(entries);
}

// Blog section — the index, every post (with its real lastmod), and the
// standalone reference pages.
function buildBlogSitemap(posts, refs = []) {
  const entries = [
    { loc: "/blog/", lastmod: BUILD_DATE },
    ...[...posts.values()].map((p) => ({ loc: `/blog/${p.slug}/`, lastmod: isoDate(p.lastmod, BUILD_DATE) })),
    ...refs.map((r) => ({ loc: r.urlPath, lastmod: BUILD_DATE })),
  ];
  return urlset(entries);
}

// Top-level index that points crawlers at the child sitemaps.
function buildSitemapIndex(children) {
  const body = children.map((loc) =>
    `  <sitemap><loc>${SITE}${loc}</loc><lastmod>${BUILD_DATE}</lastmod></sitemap>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>\n`;
}

function main() {
  if (!existsSync(DIST)) {
    console.error("[build-blog] dist/ not found — run `vite build` first.");
    process.exit(1);
  }
  const posts = readPosts();
  write(join(DIST, "blog", "blog.css"), blogCss());

  for (const post of posts.values()) {
    write(join(DIST, "blog", post.slug, "index.html"), postPage(post));
    // legacy /blog/posts/<slug> -> /blog/<slug>
    write(join(DIST, "blog", "posts", post.slug, "index.html"),
      redirectStub(`/blog/posts/${post.slug}`, `/blog/${post.slug}/`));
  }
  // legacy /blog/posts/ index -> /blog/
  write(join(DIST, "blog", "posts", "index.html"), redirectStub("/blog/posts/", "/blog/"));
  write(join(DIST, "blog", "index.html"), indexPage(posts));

  const refs = buildReferencePages();

  // Sitemaps: a top-level index + a child per section. Overwrites the static
  // fallback sitemap.xml copied from src/public.
  write(join(DIST, "sitemap-pages.xml"), buildPagesSitemap());
  write(join(DIST, "blog", "sitemap.xml"), buildBlogSitemap(posts, refs));
  write(join(DIST, "sitemap.xml"), buildSitemapIndex(["/sitemap-pages.xml", "/blog/sitemap.xml"]));

  console.log(`[build-blog] generated ${posts.size} posts + ${refs.length} reference pages + index + redirects + sitemap index`);
}

main();
