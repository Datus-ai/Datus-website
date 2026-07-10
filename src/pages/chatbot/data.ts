// AUTO-PORTED from datus-design interfaces.chatbot (Supabase seed). Content is the
// SEO source of truth; do not paraphrase. Rendered by <InterfaceView>.
import type { InterfaceData } from "../../components/InterfaceView";

export const CHATBOT_DATA: InterfaceData = {
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
