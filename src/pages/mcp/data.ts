// AUTO-PORTED from datus-design interfaces.mcp (Supabase seed). Content is the
// SEO source of truth; do not paraphrase. Rendered by <InterfaceView>.
import type { InterfaceData } from "../../components/InterfaceView";
import type { Locale } from "../../i18n/config";

const EN: InterfaceData = {
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

// Chinese mirror of the same payload. Structure, ids, tool names, YAML and
// `[[path|anchor]]` link tokens are identical — only prose is translated, so
// /zh/mcp/ renders the same page with the same internal links.
const ZH: InterfaceData = {
  "slug": "mcp",
  "name": "Datus MCP Server",
  "breadcrumb": "MCP",
  "matrix_slot": "mcp",
  "seo": {
    "title": "Datus MCP Server — 把数据栈接入 Claude、Cursor 等客户端",
    "description": "Datus MCP Server 通过 Model Context Protocol 暴露 Datus 数据工程 Agent——让 Claude Desktop、Cursor、Cline 以及任意 MCP 客户端连上你的数仓，共享可演进的上下文。"
  },
  "hero": {
    "title": "Datus MCP — 面向你数仓的 <span class=\"marker-cyan\">Model Context Protocol</span> 服务",
    "actions": [
      {
        "href": "https://docs.datus.ai/cli/introduction/",
        "icon": "arrow-right",
        "label": "阅读文档",
        "external": true
      },
      {
        "href": "#matrix",
        "label": "对比各个入口"
      }
    ],
    "description": "把 Agent 通过 MCP 暴露出去，让 Claude Desktop、Cursor 和 Windsurf 都能带着共享上下文查询、审计并推理你的数仓。"
  },
  "sections": [
    {
      "kind": "why_carousel",
      "items": [
        {
          "body": "Datus MCP 不会把表结构快照塞给模型，而是暴露一组工具供宿主按需调用——数仓始终是唯一事实来源，不存在过期元数据。",
          "title": "给的是数据工具，不是数据副本"
        },
        {
          "body": "Claude Desktop、Cursor、Windsurf、Cline——但凡正经的 AI 客户端都讲 MCP。Datus 跑一次，同一套工具就出现在团队偏好的任何宿主里。",
          "title": "任意 MCP 宿主，一个服务端"
        },
        {
          "body": "每一次工具调用都会经过与 CLI 相同的上下文、语义层与审计日志。送到宿主那边的，就是数据平台团队批准过的东西。",
          "title": "受同一套策略治理"
        }
      ],
      "title": "数据 Agent 为什么要用 <span class=\"marker-cyan\">MCP</span>？",
      "description": "但凡正经的 AI 客户端——Claude Desktop、Cursor、Windsurf、Cline——都讲 Model Context Protocol。Datus-MCP 把你的数仓变成这些客户端可以直接调用的原生工具源。"
    },
    {
      "id": "mcp-use-cases",
      "kind": "use_cases",
      "items": [
        {
          "id": "ground-external",
          "jobId": "ground-external",
          "title": "在 Claude Desktop 里问你的数仓",
          "description": "注册一次 Datus。当你问「上周哪些订单延迟发货了？」，Claude 会调用 <code class=\"font-mono text-[13px] px-1 rounded bg-muted\">query_sql</code> 去查你的 Snowflake，并在每次回答里带上血缘——这是 [[/api#ground-external|API 调用方看到的同一个受治理接口]]，也建立在 [[/data-engineer|数据工程师维护的语义层]]之上。"
        },
        {
          "id": "author-sql",
          "jobId": "author-sql",
          "title": "把 Cursor 接进你的语义层",
          "description": "在改 dbt 模型？Cursor 会调用 <code class=\"font-mono text-[13px] px-1 rounded bg-muted\">explain_metric</code> 直接给出定义、负责人与血缘——不用离开编辑器去翻文档。这就是 [[/cli#author-sql|你在 CLI 里用的同一个编写工具]]，也被 [[/data-engineer#author-sql|编写这些模型的工程师]]复用。"
        },
        {
          "id": "investigate-anomaly",
          "jobId": "investigate-anomaly",
          "title": "在 Windsurf 里做可复现的分析",
          "description": "Windsurf 通过调用 <code class=\"font-mono text-[13px] px-1 rounded bg-muted\">draft_sql</code> 起草 SQL。执行前你先审阅；每条被采纳的查询都会带着完整血缘写入工作区记录——这就是 [[/data-analyst#investigate-anomaly|分析师排查异常的同一套流程]]，只是搬进了 IDE，管道在 shell 里时也可以 [[/cli#investigate-anomaly|从 CLI 走]]。"
        },
        {
          "id": "any-host",
          "jobId": "any-host",
          "title": "自带任意兼容 MCP 的宿主",
          "description": "Cline、Continue，或者你自研的 MCP 客户端——Datus 注册一次，同一套工具就出现在团队偏好的任何地方，不用额外接线。在 [[/open-source|自部署开源版]]并把自家宿主指向它时尤其好用。"
        }
      ],
      "title": "跨 AI 客户端的 MCP <span class=\"marker-amber\">使用场景</span>",
      "columns": 2,
      "description": "四种宿主集成——注册一次 Datus，同一套上下文工具就出现在团队日常写代码的地方。"
    },
    {
      "kind": "showcase_split",
      "yaml": {
        "code": "{\n  \"mcpServers\": {\n    \"datus\": {\n      \"command\": \"datus\",\n      \"args\": [\"mcp\", \"serve\"],\n      \"env\": {\n        \"DATUS_WORKSPACE\": \"growth\",\n        \"DATUS_DATASOURCE\": \"warehouse\"\n      }\n    }\n  }\n}",
        "filename": "mcp.json"
      },
      "title": "任意 MCP 宿主，<span class=\"marker-pink\">一份配置</span>",
      "description": "Datus MCP 服务端只是一个二进制。在客户端配置里注册一次，同一套工具就会出现在 Claude Desktop、Cursor、Windsurf 和 Cline 里——不需要为每个宿主写适配。"
    },
    {
      "kind": "endpoint_grid",
      "items": [
        {
          "sym": "TOOL",
          "body": "宿主携带结构化参数调用的动作——query_sql、draft_sql、explain_metric、list_tables。",
          "tone": "var(--hl-cyan)",
          "title": "可调用工具"
        },
        {
          "sym": "RES",
          "body": "只读引用——表结构、指标定义、历史会话——宿主可以把它们附加到对话里。",
          "tone": "var(--hl-amber)",
          "title": "资源"
        },
        {
          "sym": "PROMPT",
          "body": "宿主可按名称调用的可复用提示词模板——「周报」「同期群分析」「值班巡检」。",
          "tone": "var(--hl-sage)",
          "title": "提示词"
        }
      ],
      "title": "MCP 三要素：<span class=\"marker-cyan\">工具、资源、提示词</span>",
      "description": "Model Context Protocol 的三块基石——Datus 在你的技术栈之上把它们全部实现了。"
    },
    {
      "kind": "feature_grid",
      "items": [
        {
          "body": "把审核过的 SQL 送过上下文与安全层执行，返回数据行以及构建它们所用的血缘。",
          "title": "query_sql"
        },
        {
          "body": "浏览数据目录中的表与列。宿主会把结果作为 MCP 资源附加上去，随时可引用。",
          "title": "list_tables"
        },
        {
          "body": "给出某个指标的语义定义、血缘与负责人——全部锚定在该工作区的上下文里。",
          "title": "explain_metric"
        },
        {
          "body": "先起草 SQL 供审阅再执行。宿主展示 diff，由用户确认后才运行。",
          "title": "draft_sql"
        }
      ],
      "title": "MCP 工具箱：<span class=\"marker-cyan\">为 AI 宿主精选的数据工具</span>",
      "columns": 4,
      "description": "四个有主张的工具，把通用 AI 客户端变成懂数据的助手。"
    },
    {
      "kind": "how_to",
      "steps": [
        {
          "title": "安装 Agent",
          "description": "从 PyPI 或 Homebrew 装上 Datus——CLI、API 与 MCP 服务端用的是同一个二进制。"
        },
        {
          "title": "在客户端里注册",
          "description": "把 Datus 加到 MCP 宿主的配置文件里（Claude Desktop、Cursor、Windsurf、Cline 用的都是同一套格式）。"
        },
        {
          "title": "重启并挑个工具",
          "description": "重启客户端，打开工具选择器，就可以开始调用 query_sql、explain_metric 等等了。"
        }
      ],
      "title": "MCP 接入：<span class=\"marker-sage\">三步跑通一个工具</span>",
      "schemaName": "注册 Datus MCP 服务端",
      "description": "把服务端加进宿主配置，重启，然后开始调用 Datus 工具。",
      "schemaDescription": "安装 Datus，在宿主里注册 MCP 服务端，然后挑一个工具。"
    },
    {
      "kind": "interface_matrix"
    }
  ],
  "faqs": [
    {
      "answer": "任何兼容 MCP 的客户端——Claude Desktop、Cursor、Cline、Continue，以及基于 MCP SDK 自研的客户端。Datus 同时支持 stdio 与 HTTP 两种传输方式。",
      "question": "Datus 能配合哪些 MCP 客户端？"
    },
    {
      "answer": "Datus MCP 服务端用与 CLI 相同的上下文引擎、治理策略和已审核答案缓存把数仓包了一层——所以宿主 AI 看到的是受治理、有范围限制的工具，而不是一条敞开的 SQL 连接。",
      "question": "相比直接把数仓账号给 Claude，这有什么好处？"
    },
    {
      "answer": "可以。每个服务实例都能单独配置暴露哪些工具、允许哪些数据源，以及是否只读。也可以为不同团队或受众启动多个 `datus-mcp` 进程。",
      "question": "能把服务端限制到特定数据源或工具吗？"
    },
    {
      "answer": "共享。CLI、Chatbot、API、MCP 这四种入口都从同一份可演进的上下文存储读取并写回，因此在任何一处的改进都会在其他地方生效。",
      "question": "MCP 服务端和 CLI、Chatbot 共享上下文吗？"
    }
  ],
  "cta": {
    "title": "把 Datus 接进<span class=\"marker-pink\">任意 MCP 客户端</span>",
    "buttons": [
      {
        "href": "https://docs.datus.ai/cli/introduction/",
        "icon": "book-open",
        "label": "阅读 MCP 文档",
        "external": true
      }
    ],
    "description": "一个服务端就能把你的数仓、语义层与数据目录暴露成 MCP 工具——Claude、Cursor，或者任何会讲这套协议的 Agent 都能用。"
  }
};

export const MCP_DATA: Record<Locale, InterfaceData> = { en: EN, zh: ZH };
