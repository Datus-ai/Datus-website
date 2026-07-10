// AUTO-PORTED from datus-design interfaces.mcp (Supabase seed). Content is the
// SEO source of truth; do not paraphrase. Rendered by <InterfaceView>.
import type { InterfaceData } from "../../components/InterfaceView";

export const MCP_DATA: InterfaceData = {
  "slug": "mcp",
  "name": "Datus MCP Server",
  "breadcrumb": "MCP",
  "matrix_slot": "mcp",
  "seo": {
    "title": "Datus MCP Server — Bring Your Data Stack into Claude, Cursor & More",
    "jsonLd": {
      "name": "Datus MCP Server",
      "@type": "SoftwareApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "@context": "https://schema.org",
      "description": "Model Context Protocol server exposing the Datus data engineering agent and its evolvable context to MCP-compatible AI clients.",
      "operatingSystem": "macOS, Linux, Windows",
      "applicationCategory": "DeveloperApplication"
    },
    "ogTitle": "Datus MCP Server — Data Agent for Claude, Cursor & MCP Clients",
    "description": "Datus MCP Server exposes the Datus data engineering agent over the Model Context Protocol — connect Claude Desktop, Cursor, Cline and any MCP client to your warehouse with shared evolvable context.",
    "ogDescription": "Plug your warehouse into Claude Desktop, Cursor and any MCP-compatible client. Tools, resources and prompts powered by the Datus context engine."
  },
  "hero": {
    "title": "Datus MCP — <span class=\"marker-cyan\">Model Context Protocol</span> Server for Your Warehouse",
    "visual": {
      "kind": "none"
    },
    "actions": [
      {
        "href": "https://docs.datus.ai/cli/introduction/",
        "icon": "arrow-right",
        "label": "Read the docs",
        "variant": "ink",
        "external": true,
        "iconPosition": "right"
      },
      {
        "href": "#matrix",
        "label": "Compare interfaces",
        "variant": "cream"
      }
    ],
    "description": "Expose the agent over MCP so Claude Desktop, Cursor and Windsurf can query, audit and reason about your warehouse with shared context."
  },
  "sections": [
    {
      "kind": "why_carousel",
      "items": [
        {
          "alt": "A tool palette panel being called by external MCP hosts",
          "body": "Instead of shipping a snapshot of your schema to the model, Datus MCP exposes tools the host calls on demand — the warehouse stays the source of truth, no stale metadata.",
          "image": "mcp-why-tools",
          "title": "Data Tools, Not Data Copies"
        },
        {
          "alt": "A single MCP server connected to three separate application hosts",
          "body": "Claude Desktop, Cursor, Windsurf, Cline — every serious AI client speaks MCP. Datus runs once and the same tools show up in whichever host your team prefers.",
          "image": "mcp-why-hosts",
          "title": "Any MCP Host, One Server"
        },
        {
          "alt": "Audit-badged timeline of every tool invocation",
          "body": "Every tool call passes through the same context, semantic layer and audit log as the CLI. What ships to your host is what your data platform team approved.",
          "image": "mcp-why-governed",
          "title": "Governed by the Same Policy"
        }
      ],
      "title": "Why <span class=\"marker-cyan\">MCP</span> for a Data Agent?",
      "description": "Every serious AI client — Claude Desktop, Cursor, Windsurf, Cline — speaks Model Context Protocol. Datus-MCP turns your warehouse into a native tool source those clients can call directly."
    },
    {
      "id": "mcp-use-cases",
      "kind": "use_cases",
      "items": [
        {
          "id": "ground-external",
          "jobId": "ground-external",
          "title": "Ask Claude Desktop About Your Warehouse",
          "description": "Register Datus once. Claude answers &ldquo;which orders shipped late last week?&rdquo; by calling <code class=\"font-mono text-[13px] px-1 rounded bg-muted\">query_sql</code> against your Snowflake, with lineage in every reply — the [[/api#ground-external|same governed surface API callers hit]], on top of the semantic layer [[/data-engineer|data engineers own]]."
        },
        {
          "id": "author-sql",
          "jobId": "author-sql",
          "title": "Wire Cursor Into Your Semantic Layer",
          "description": "Editing dbt models? Cursor calls <code class=\"font-mono text-[13px] px-1 rounded bg-muted\">explain_metric</code> to surface the definition, owner and lineage — no leaving the editor to grep for docs. It's the [[/cli#author-sql|same authoring tool you drive from the CLI]], reused by [[/data-engineer#author-sql|the engineers who author these models]]."
        },
        {
          "id": "investigate-anomaly",
          "jobId": "investigate-anomaly",
          "title": "Reproducible Analysis in Windsurf",
          "description": "Windsurf drafts SQL by calling <code class=\"font-mono text-[13px] px-1 rounded bg-muted\">draft_sql</code>. You review before it runs; every accepted query lands in the workspace transcript with full lineage — the [[/data-analyst#investigate-anomaly|same anomaly investigation loop analysts follow]], now inside the IDE, or [[/cli#investigate-anomaly|from the CLI]] when the pipeline lives in a shell."
        },
        {
          "id": "any-host",
          "jobId": "any-host",
          "title": "Bring Your Own MCP-Compatible Host",
          "description": "Cline, Continue, or a home-grown MCP client — Datus registers once and the same tools show up wherever the team prefers to work, no extra plumbing. Especially useful when [[/open-source|self-hosting the open-source stack]] and pointing your own host at it."
        }
      ],
      "title": "MCP <span class=\"marker-amber\">Use Cases</span> Across AI Clients",
      "columns": 2,
      "description": "Four host integrations — register Datus once, and the same context tools show up wherever your team already codes."
    },
    {
      "kind": "showcase_split",
      "yaml": {
        "code": "{\n  \"mcpServers\": {\n    \"datus\": {\n      \"command\": \"datus\",\n      \"args\": [\"mcp\", \"serve\"],\n      \"env\": {\n        \"DATUS_WORKSPACE\": \"growth\",\n        \"DATUS_DATASOURCE\": \"warehouse\"\n      }\n    }\n  }\n}",
        "filename": "mcp.json"
      },
      "title": "Any MCP Host, <span class=\"marker-pink\">One Config</span>",
      "description": "The Datus MCP server ships as a single binary. Register it in your client's config once and the same tool set appears in Claude Desktop, Cursor, Windsurf and Cline — no per-host adapter needed."
    },
    {
      "kind": "endpoint_grid",
      "items": [
        {
          "sym": "TOOL",
          "body": "Actions the host invokes with structured arguments — query_sql, draft_sql, explain_metric, list_tables.",
          "tone": "var(--hl-cyan)",
          "title": "Callable tools"
        },
        {
          "sym": "RES",
          "body": "Read-only references — schemas, metric definitions, past sessions — the host can attach to a conversation.",
          "tone": "var(--hl-amber)",
          "title": "Resources"
        },
        {
          "sym": "PROMPT",
          "body": "Reusable prompt templates the host can invoke by name — \"weekly report\", \"cohort analysis\", \"on-call check\".",
          "tone": "var(--hl-sage)",
          "title": "Prompts"
        }
      ],
      "title": "MCP Primitives: <span class=\"marker-cyan\">Tools, Resources, Prompts</span>",
      "description": "The three building blocks of the Model Context Protocol — Datus implements all of them on top of your stack."
    },
    {
      "kind": "feature_grid",
      "items": [
        {
          "body": "Runs vetted SQL through the context and safety layer. Returns rows plus the lineage used to build them.",
          "title": "query_sql"
        },
        {
          "body": "Browse catalog tables and columns. The host attaches results as MCP resources, ready to reference.",
          "title": "list_tables"
        },
        {
          "body": "Semantic definition, lineage and owner for a named metric — grounded in the workspace's Context.",
          "title": "explain_metric"
        },
        {
          "body": "Drafts SQL for review before it runs. The host displays diffs; the user approves before execution.",
          "title": "draft_sql"
        }
      ],
      "title": "MCP Toolbox: <span class=\"marker-cyan\">Curated Data Tools</span> for the AI Host",
      "columns": 4,
      "description": "Four opinionated tools that turn a generic AI client into a data-aware assistant."
    },
    {
      "kind": "how_to",
      "steps": [
        {
          "title": "Install the agent",
          "description": "Grab Datus from PyPI or Homebrew — the same binary powers the CLI, API and MCP server."
        },
        {
          "title": "Register in your client",
          "description": "Add Datus to your MCP host's config file (Claude Desktop, Cursor, Windsurf, Cline — all use the same shape)."
        },
        {
          "title": "Restart and pick a tool",
          "description": "Restart your client, open the tool picker, and start invoking query_sql, explain_metric and the rest."
        }
      ],
      "title": "MCP Setup: <span class=\"marker-sage\">Three Steps to a Live Tool</span>",
      "schemaName": "Register the Datus MCP server",
      "description": "Add the server to your host's config, restart, and start invoking Datus tools.",
      "schemaDescription": "Install Datus, register the MCP server in your host, and pick a tool."
    },
    {
      "kind": "interface_matrix"
    }
  ],
  "faqs": [
    {
      "answer": "Any MCP-compatible client — Claude Desktop, Cursor, Cline, Continue, and custom clients built on the MCP SDK. Datus supports both stdio and HTTP transports.",
      "question": "Which MCP clients does Datus work with?"
    },
    {
      "answer": "The Datus MCP server wraps the warehouse with the same context engine, governance and approved-answer cache used by the CLI — so the host AI sees governed, scoped tools instead of an open SQL connection.",
      "question": "What's the advantage over giving Claude raw warehouse credentials?"
    },
    {
      "answer": "Yes. Configure exposed tools, allowed datasources, and read-only mode per server instance. Run separate `datus-mcp` processes for different teams or audiences.",
      "question": "Can I scope the server to specific datasources or tools?"
    },
    {
      "answer": "Yes — all four surfaces (CLI, chatbot, API, MCP) read from and write back to the same evolvable context store, so improvements made in one show up everywhere.",
      "question": "Does the MCP server share context with the CLI and chatbot?"
    }
  ],
  "cta": {
    "title": "Plug Datus Into <span class=\"marker-pink\">Any MCP Client</span>",
    "buttons": [
      {
        "href": "https://docs.datus.ai/cli/introduction/",
        "icon": "book-open",
        "label": "Read the MCP docs",
        "variant": "ink",
        "external": true,
        "iconPosition": "right"
      }
    ],
    "description": "One server exposes your warehouse, semantic layer and catalog as MCP tools — usable from Claude, Cursor, or any agent that speaks the protocol."
  }
};
