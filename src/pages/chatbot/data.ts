// AUTO-PORTED from datus-design interfaces.chatbot (Supabase seed). Content is the
// SEO source of truth; do not paraphrase. Rendered by <InterfaceView>.
import type { InterfaceData } from "../../components/InterfaceView";
import type { Locale } from "../../i18n/config";

const EN: InterfaceData = {
  "slug": "chatbot",
  "name": "Datus Web Chatbot",
  "breadcrumb": "Web Chatbot",
  "matrix_slot": "chatbot",
  "seo": {
    "title": "Datus Web Chatbot — AI Data Analyst in Your Browser",
    "jsonLd": {
      "name": "Datus Web Chatbot",
      "@type": "SoftwareApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "@context": "https://schema.org",
      "description": "Browser-based AI data analyst chatbot. Chat with your warehouse via subagents and an evolvable context engine.",
      "operatingSystem": "Web",
      "applicationCategory": "BusinessApplication"
    },
    "ogTitle": "Datus Web Chatbot — AI Data Analyst in Your Browser",
    "description": "Datus Web Chatbot is a browser-based AI data analyst — chat with your warehouse, share subagents with your team, no install. Powered by an evolvable context engine.",
    "ogDescription": "A browser data chatbot for analysts and PMs. Chat with your warehouse, share threads, ship answers — all backed by the Datus context engine."
  },
  "hero": {
    "title": "Datus Chatbot — Analyst-Grade <span class=\"marker-pink\">Chat UI</span> for Everyone",
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
    "description": "Bring the same agent that powers the CLI into Slack and the browser, so analysts and PMs get governed answers without touching a terminal."
  },
  "sections": [
    {
      "kind": "why_carousel",
      "items": [
        {
          "alt": "Slack message bubble with an embedded chart",
          "body": "Not every stakeholder wants a SQL editor or a BI dashboard. They want to ask a question in the tool they already have open — Slack, or a browser tab — and get an answer they can trust.",
          "image": "chatbot-why-slack",
          "title": "Meet Users Where They Work"
        },
        {
          "alt": "Chat response with attached table-name badges and lineage lines",
          "body": "Every reply cites the tables and metrics it used, with lineage back to the semantic layer. No hallucinated column names, no guessing about definitions — the same context the CLI uses.",
          "image": "chatbot-why-trust",
          "title": "Trusted, Traceable Answers"
        },
        {
          "alt": "Browser chat window with a collapsed SQL region",
          "body": "Add <code class=\"font-mono text-[13px] px-1 rounded bg-muted\">--web</code> once. Teammates open a URL and start asking — no pip, no Docker, no login they'll forget by Tuesday.",
          "image": "chatbot-why-browser",
          "title": "Zero Install for Stakeholders"
        }
      ],
      "title": "Why a <span class=\"marker-pink\">Chatbot</span> for Analytics?",
      "description": "Not every stakeholder wants a SQL editor or a BI dashboard. They want to ask a question where they already work — and get an answer they can trust."
    },
    {
      "id": "chatbot-use-cases",
      "kind": "use_cases",
      "items": [
        {
          "id": "self-serve-chat",
          "jobId": "self-serve-chat",
          "title": "Answer PM Questions in Slack Without a Ticket",
          "description": "A PM asks &ldquo;how did last week's launch perform&rdquo; in #growth. The bot replies with governed SQL, a mini chart and lineage — no ticket, no context switch for the data team. The bot wraps a subagent [[/studio#self-serve-chat|packaged in Studio]] and hands business users [[/data-analyst#self-serve-chat|the self-serve surface analysts already trust]]."
        },
        {
          "id": "investigate-anomaly",
          "jobId": "investigate-anomaly",
          "title": "On-Call Data Diagnostics From a Slack DM",
          "description": "Revenue looks wrong at 8am. Ask the bot in Slack; it pulls the freshness check, spots the late job, and tags the owner — before the exec ping hits your DMs. When the trail runs deeper, [[/cli#investigate-anomaly|root-cause continues in the CLI]] using the [[/data-analyst#investigate-anomaly|same anomaly loop analysts run]]."
        },
        {
          "id": "automate-reports",
          "jobId": "automate-reports",
          "title": "Self-Serve Ops Runbooks in Slack",
          "description": "Wrap a subagent as a Slack bot pointed at ops's Skills library. Ops asks &ldquo;which shipments are delayed&rdquo; in plain English; the runbook answers with the same governed SQL every time — [[/api#automate-reports|trigger the same subagent via API]] when the caller is a cron job instead of a person."
        },
        {
          "id": "feedback-loop",
          "jobId": "feedback-loop",
          "title": "Close the Loop From Chat Back to Context",
          "description": "Analysts thumb-up the answers that worked and flag the ones that didn't. Every upvote and issue report — session link attached — flows back to the [[/data-engineer#feedback-loop|data engineer who tunes the subagent]] in [[/studio#feedback-loop|Studio's review queue]], so tomorrow's questions get the sharper answer."
        }
      ],
      "title": "Chatbot <span class=\"marker-amber\">Use Cases</span> Across the Company",
      "columns": 2,
      "description": "Four conversations that used to be tickets — now they happen in the thread where the question was asked."
    },
    {
      "kind": "showcase_split",
      "yaml": {
        "code": "chatbot:\n  channels:\n    - kind: slack\n      workspace: T0123ABCD\n      allowed_channels: [growth, exec]\n    - kind: web\n      port: 8501\n      auth: sso\n  agent:\n    context: growth\n    skills: [mrr, funnel, cohort]\n    policy: read_only",
        "filename": "chatbot.yml"
      },
      "title": "Deploy in <span class=\"marker-pink\">Slack, Web, or Both</span>",
      "description": "One config, two channels. Point the Slack app at your workspace, start the Streamlit web UI, or run both against the same agent and context — every message goes through the same policy layer."
    },
    {
      "kind": "feature_grid",
      "items": [
        {
          "body": "Answers cite the exact tables, metrics and semantic definitions used — no fabricated column names, no vague guesses.",
          "title": "Context-Aware Chat"
        },
        {
          "body": "Every conversation is a shareable URL with full transcript, SQL and tool calls. Reopen tomorrow and pick up exactly where you left off.",
          "title": "Session Recall"
        },
        {
          "body": "Reply gets a share button that respects workspace access policies. Teammates see the exact query and result, no screenshots.",
          "title": "Governed Sharing"
        }
      ],
      "title": "Chatbot Loop: <span class=\"marker-cyan\">Chat, Recall, Share</span>",
      "columns": 3,
      "description": "Three things the Datus chatbot does that a generic LLM chat UI cannot."
    },
    {
      "kind": "how_to",
      "steps": [
        {
          "title": "Install the agent",
          "description": "Grab Datus from PyPI or Homebrew — the same binary powers the CLI, chatbot and API."
        },
        {
          "title": "Enable a channel",
          "description": "Turn on the Streamlit web UI or register the Slack app — one flag, no extra dependencies to install."
        },
        {
          "title": "Share the URL",
          "description": "Send teammates the workspace URL or invite the bot to a Slack channel. They start asking questions in plain English."
        }
      ],
      "title": "Launch the Chatbot in <span class=\"marker-sage\">Under a Minute</span>",
      "schemaName": "Launch the Datus Chatbot",
      "description": "Same install as the CLI. Point it at Slack or the browser and hand teammates a URL.",
      "schemaDescription": "Install Datus, enable the web or Slack channel, and share the URL with your team."
    },
    {
      "kind": "interface_matrix"
    }
  ],
  "faqs": [
    {
      "answer": "Analysts, PMs and business users who want to query the warehouse in plain language from a browser — without learning SQL or installing a CLI.",
      "question": "Who is the Datus Web Chatbot for?"
    },
    {
      "answer": "The Datus chatbot is grounded in your warehouse, catalog, metrics and team-approved answers via the evolvable context engine, so it produces governed SQL and traceable results — not hallucinations.",
      "question": "How is it different from a generic AI chatbot like ChatGPT?"
    },
    {
      "answer": "Yes. The web chatbot ships with the same Apache 2.0 codebase as the CLI — launch it locally with `datus-cli --web`, or use the hosted Datus Studio.",
      "question": "Is it free and open source?"
    },
    {
      "answer": "Yes. Threads have stable URLs that carry the subagent, datasource and full context, so anyone on the team can reopen and continue the conversation.",
      "question": "Can I share a chat thread with my team?"
    }
  ],
  "cta": {
    "title": "Give Your Team a <span class=\"marker-amber\">Browser Data Chatbot</span>",
    "buttons": [
      {
        "href": "https://studio.datus.ai/overview",
        "icon": "arrow-right",
        "label": "Try the web chatbot",
        "variant": "ink",
        "external": true,
        "iconPosition": "right"
      }
    ],
    "description": "Share one URL with analysts and PMs, let them chat with the warehouse, save subagents — no install, no SQL ramp-up required."
  }
};

// Chinese mirror of the same payload. Structure, ids, YAML and
// `[[path|anchor]]` link tokens are identical — only prose is translated.
const ZH: InterfaceData = {
  "slug": "chatbot",
  "name": "Datus Web Chatbot",
  "breadcrumb": "Web Chatbot",
  "matrix_slot": "chatbot",
  "seo": {
    "title": "Datus Web Chatbot — 浏览器里的 AI 数据分析师",
    "description": "Datus Web Chatbot 是浏览器里的 AI 数据分析师——和数仓对话、把子代理共享给团队，免安装。底层由可演进的上下文引擎驱动。"
  },
  "hero": {
    "title": "Datus Chatbot — 人人可用的<span class=\"marker-pink\">分析师级对话界面</span>",
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
    "description": "把驱动 CLI 的同一个 Agent 带进 Slack 和浏览器，让分析师和产品经理不碰终端也能拿到受治理的答案。"
  },
  "sections": [
    {
      "kind": "why_carousel",
      "items": [
        {
          "body": "不是每个业务方都想用 SQL 编辑器或 BI 看板。他们只想在已经打开的工具里——Slack，或者一个浏览器标签页——问一句，然后拿到一个可信的答案。",
          "title": "到用户干活的地方去"
        },
        {
          "body": "每条回复都会标出它用到的表和指标，并回溯到语义层的血缘。不会编造列名，也不用猜口径——用的就是 CLI 那套上下文。",
          "title": "可信、可追溯的答案"
        },
        {
          "body": "加一次 <code class=\"font-mono text-[13px] px-1 rounded bg-muted\">--web</code> 就够了。同事打开一个网址就能提问——不用 pip、不用 Docker，也不用记一个周二就会忘的账号。",
          "title": "业务方零安装"
        }
      ],
      "title": "分析场景为什么要用 <span class=\"marker-pink\">Chatbot</span>？",
      "description": "不是每个业务方都想用 SQL 编辑器或 BI 看板。他们只想在已经在用的地方问一句，然后拿到一个可信的答案。"
    },
    {
      "id": "chatbot-use-cases",
      "kind": "use_cases",
      "items": [
        {
          "id": "self-serve-chat",
          "jobId": "self-serve-chat",
          "title": "在 Slack 里回答产品经理的问题，不用提工单",
          "description": "产品经理在 #growth 里问「上周那次上线效果怎么样」。机器人直接回上受治理的 SQL、一张小图和血缘——不用提工单，数据团队也不用切换上下文。这个机器人包的是一个 [[/studio#self-serve-chat|在 Studio 里打包好的子代理]]，把 [[/data-analyst#self-serve-chat|分析师本来就信任的自助入口]]交到业务方手里。"
        },
        {
          "id": "investigate-anomaly",
          "jobId": "investigate-anomaly",
          "title": "在 Slack 私聊里做值班数据诊断",
          "description": "早上八点营收数字看着不对。在 Slack 里问一下机器人，它会拉出新鲜度检查、找到跑晚了的作业，并 @ 上负责人——赶在老板的私信到达之前。线索更深时，可以 [[/cli#investigate-anomaly|回到 CLI 继续做根因分析]]，用的还是 [[/data-analyst#investigate-anomaly|分析师那套异常排查流程]]。"
        },
        {
          "id": "automate-reports",
          "jobId": "automate-reports",
          "title": "Slack 里的自助运营 Runbook",
          "description": "把一个子代理包成 Slack 机器人，指向运营团队的 Skills 库。运营用大白话问「哪些发货延迟了」，Runbook 每次都用同一套受治理的 SQL 作答——当调用方是定时任务而不是人时，可以 [[/api#automate-reports|通过 API 触发同一个子代理]]。"
        },
        {
          "id": "feedback-loop",
          "jobId": "feedback-loop",
          "title": "把对话里的反馈闭环回上下文",
          "description": "分析师给管用的答案点赞，给不对的答案打标。每一次点赞和问题反馈——都附带会话链接——都会流回 [[/studio#feedback-loop|Studio 的评审队列]]，交给 [[/data-engineer#feedback-loop|调优这个子代理的数据工程师]]，让明天的问题得到更好的答案。"
        }
      ],
      "title": "全公司范围的 Chatbot <span class=\"marker-amber\">使用场景</span>",
      "columns": 2,
      "description": "四类原本要走工单的对话——现在就发生在提问的那个会话里。"
    },
    {
      "kind": "showcase_split",
      "yaml": {
        "code": "chatbot:\n  channels:\n    - kind: slack\n      workspace: T0123ABCD\n      allowed_channels: [growth, exec]\n    - kind: web\n      port: 8501\n      auth: sso\n  agent:\n    context: growth\n    skills: [mrr, funnel, cohort]\n    policy: read_only",
        "filename": "chatbot.yml"
      },
      "title": "部署到 <span class=\"marker-pink\">Slack、Web，或者两者都要</span>",
      "description": "一份配置，两个渠道。把 Slack 应用指向你的工作区，启动 Streamlit Web UI，或者让两者都跑在同一个 Agent 和同一份上下文上——每条消息都会经过同一层策略校验。"
    },
    {
      "kind": "feature_grid",
      "items": [
        {
          "body": "答案会标明用到了哪些表、指标与语义定义——不编造列名，也不含糊其辞。",
          "title": "带上下文的对话"
        },
        {
          "body": "每次对话都是一个可分享的网址，带完整记录、SQL 与工具调用。明天再打开，还能从刚才那一步接着走。",
          "title": "会话可回溯"
        },
        {
          "body": "每条回复都带一个遵循工作区权限策略的分享按钮。同事看到的是原始查询和结果，不是截图。",
          "title": "受治理的分享"
        }
      ],
      "title": "Chatbot 闭环：<span class=\"marker-cyan\">对话、回溯、分享</span>",
      "columns": 3,
      "description": "Datus Chatbot 能做而通用大模型对话界面做不到的三件事。"
    },
    {
      "kind": "how_to",
      "steps": [
        {
          "title": "安装 Agent",
          "description": "从 PyPI 或 Homebrew 装上 Datus——CLI、Chatbot 与 API 用的是同一个二进制。"
        },
        {
          "title": "开启一个渠道",
          "description": "打开 Streamlit Web UI 或注册 Slack 应用——一个开关搞定，不用额外装依赖。"
        },
        {
          "title": "把网址发出去",
          "description": "把工作区网址发给同事，或者把机器人拉进 Slack 频道。他们用大白话就能开始提问。"
        }
      ],
      "title": "<span class=\"marker-sage\">一分钟内</span>把 Chatbot 跑起来",
      "schemaName": "启动 Datus Chatbot",
      "description": "和 CLI 一样的安装方式。指向 Slack 或浏览器，然后把网址交给同事。",
      "schemaDescription": "安装 Datus，开启 Web 或 Slack 渠道，然后把网址分享给团队。"
    },
    {
      "kind": "interface_matrix"
    }
  ],
  "faqs": [
    {
      "answer": "面向分析师、产品经理和业务用户——他们想在浏览器里用大白话查数仓，而不必学 SQL 或安装 CLI。",
      "question": "Datus Web Chatbot 是给谁用的？"
    },
    {
      "answer": "Datus Chatbot 通过可演进的上下文引擎锚定在你的数仓、数据目录、指标与团队已认可的答案上，因此产出的是受治理的 SQL 和可追溯的结果，而不是幻觉。",
      "question": "它和 ChatGPT 这类通用 AI 聊天机器人有什么不同？"
    },
    {
      "answer": "是的。Web Chatbot 与 CLI 共用同一份 Apache 2.0 代码——用 `datus-cli --web` 就能在本地启动，也可以直接用托管的 Datus Studio。",
      "question": "它是免费且开源的吗？"
    },
    {
      "answer": "可以。每个会话都有稳定的网址，携带子代理、数据源与完整上下文，团队里任何人都能重新打开并继续这段对话。",
      "question": "对话可以分享给团队吗？"
    }
  ],
  "cta": {
    "title": "给你的团队一个<span class=\"marker-amber\">浏览器数据聊天助手</span>",
    "buttons": [
      {
        "href": "https://studio.datus.ai/overview",
        "icon": "arrow-right",
        "label": "试用 Web Chatbot",
        "external": true
      }
    ],
    "description": "把一个网址发给分析师和产品经理，让他们直接和数仓对话、保存子代理——不用安装，也不用先学 SQL。"
  }
};

export const CHATBOT_DATA: Record<Locale, InterfaceData> = { en: EN, zh: ZH };
