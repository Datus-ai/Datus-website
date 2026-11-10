import type { Locale } from '../../../i18n/config';
const en = {
  "eyebrow": "Datus + Apache Superset",
  "title": "Apache Superset AI Agent Integration",
  "lead": "Turn the SQL and business logic behind your Superset dashboards into reusable metrics and Agent context. Ask follow-up questions, build a Datus dashboard, or create an HTML report from the knowledge your team already has.",
  "primary": "Get Started Free",
  "secondary": "See the workflow",
  "heroNodes": [
    "Superset dashboards",
    "Selected SQL + chart intent",
    "Reviewed metrics + Reference SQL",
    "Datus agents, reports + dashboards"
  ],
  "heroLabel": "Superset chart evidence becomes shared definitions for Datus analysis and visual outputs",
  "heroNote": "Keep Superset in your stack. Choose which knowledge and outputs to bring into Datus.",
  "workflow": {
    "eyebrow": "From dashboard to shared context",
    "title": "Bring the definitions behind the charts with you.",
    "lead": "Select the dashboard and charts, confirm the scope, then let Datus build from the exported query evidence. Existing metrics are reused when they match; missing metrics can be authored and validated for the selected scope.",
    "tabs": [
      "Select the source",
      "Review the definitions",
      "Choose the output"
    ],
    "panels": [
      {
        "title": "Start from the actual Superset dashboard.",
        "body": "The plugin resolves the dashboard, charts, datasets, and underlying database connection. Your team confirms which queries become Reference SQL and which supply metric evidence.",
        "labels": [
          "Dashboard + chart inventory",
          "Physical datasource match",
          "Confirmed query selection"
        ],
        "code": "Superset dashboard\n  ├─ selected chart queries\n  ├─ dataset / database identity\n  └─ measures, filters, time grain"
      },
      {
        "title": "Preserve the calculation, not just the chart title.",
        "body": "Datus exports complete selected SQL with a manifest, then builds reusable context. For a Datus dashboard target, it checks existing DOSI definitions and creates only missing selected metrics before visual generation.",
        "labels": [
          "Reference SQL + source evidence",
          "Reuse or author required metrics",
          "Validate + rediscover definitions"
        ],
        "code": "reference_sql/superset/<dashboard-slug>/\n  manifest.json\n  <chart-query>.sql\n  _source/\n\nsemantic_modeling → reviewed DOSI metrics"
      },
      {
        "title": "Use the context in the format the task needs.",
        "body": "Continue with a dashboard-scoped analysis agent, request a narrative HTML report, or rebuild selected views as a Datus dashboard. The target determines the generation path.",
        "labels": [
          "Ad-hoc questions + attribution",
          "HTML report for a briefing",
          "Datus dashboard for exploration"
        ],
        "code": "Superset evidence + maintained metrics\n  ├─ analysis subagents\n  ├─ gen_visual_report\n  └─ gen_visual_dashboard"
      }
    ],
    "note": "Explanatory workflow based on the plugin and Agent source. Source filters, permissions, and unsupported chart behavior must be checked; visual similarity alone does not establish equivalent calculations.",
    "docs": "Follow the dashboard bootstrap tutorial"
  },
  "outputs": {
    "eyebrow": "Three destinations, different jobs",
    "title": "Keep the dashboard. Extend what you can do with it.",
    "lead": "Choose where the result belongs. A Superset dashboard, a Datus HTML report, and a Datus HTML dashboard have different interaction and hosting needs.",
    "tabs": [
      "Superset dashboard",
      "Datus HTML report",
      "Datus HTML dashboard"
    ],
    "items": [
      {
        "title": "Create and maintain assets in Superset.",
        "body": "Ask Datus Agent to use the Superset authoring plugin to inspect or create datasets, charts, and dashboard layouts. The agent reads assets back and checks representative queries.",
        "badge": "Lives in Superset",
        "detail": "Uses your Superset deployment and data connections.",
        "label": "Read the Superset authoring walkthrough",
        "href": "https://docs.datus.ai/dev/getting_started/data_engineering_quickstart/"
      },
      {
        "title": "Explain the answer in a shareable report.",
        "body": "Generate a narrative HTML page with a summary, charts, and tables using selected metrics or SQL evidence. The data is captured when the report is built; readers do not trigger live queries by changing filters.",
        "badge": "Snapshot + narrative",
        "detail": "A report answers a question and can be refined section by section.",
        "label": "Explore HTML report generation",
        "href": "https://docs.datus.ai/dev/subagent/gen_visual_report/"
      },
      {
        "title": "Rebuild selected views for interactive exploration.",
        "body": "Convert a Superset dashboard into a Datus project dashboard using the shared bootstrap workflow. The destination reuses compatible metrics, authors missing selected definitions when allowed, and validates the resulting queries.",
        "badge": "Filters + live queries",
        "detail": "Datus HTML dashboards need the configured query backend; in the CLI workflow this is datus --web.",
        "label": "Explore Datus HTML dashboards",
        "href": "https://docs.datus.ai/dev/subagent/gen_visual_dashboard/"
      }
    ],
    "previewTitle": "Illustrative output structure",
    "chartLabels": [
      "By region",
      "Monthly trend",
      "Details"
    ],
    "reportHeadings": [
      "Executive summary",
      "What changed",
      "Evidence + next steps"
    ],
    "filter": "Date / region filters",
    "previewNote": "Illustrative layouts; no live dataset or generated customer results are shown."
  },
  "value": {
    "eyebrow": "Why bring BI knowledge into Datus?",
    "title": "Use the work behind one dashboard across more questions.",
    "cards": [
      {
        "title": "Reuse maintained definitions",
        "body": "The rebuild flow checks existing metrics before creating missing ones. Similar names alone do not prove the definitions match."
      },
      {
        "title": "Carry the source evidence",
        "body": "Keep chart-to-query references and exported SQL with the generated context, so the team can review where a calculation came from."
      },
      {
        "title": "Choose the right surface",
        "body": "Leave ongoing BI reporting in Superset, use a report for a briefing, or build a Datus dashboard for a new exploration workflow."
      }
    ]
  },
  "setup": {
    "eyebrow": "Connect your environment",
    "title": "Connect Superset. Confirm the source. Start with one dashboard.",
    "steps": [
      "Install and enable the Superset plugin with an authorized profile.",
      "Configure the physical database used by the selected Superset datasets as a Datus datasource.",
      "Choose the dashboard, confirm the import scope, and review generated context before wider use."
    ],
    "note": "The plugin supports Apache Superset 4.x and later. Authentication, source identity, and per-chart coverage are checked for the selected deployment.",
    "link": "Open the setup and bootstrap guide"
  },
  "faqTitle": "Apache Superset integration questions",
  "faqs": [
    {
      "q": "Can Datus turn Superset dashboard logic into metrics?",
      "a": "Datus can export selected chart queries and use them as evidence for Reference SQL and semantic modeling. The dashboard bootstrap workflow requires a confirmed scope and a matching physical datasource. For a Datus dashboard target, compatible existing metrics are reused and missing selected metrics can be authored. Review the calculation, filters, and time grain rather than assuming the chart title defines the metric."
    },
    {
      "q": "Can I convert a Superset dashboard into a Datus dashboard?",
      "a": "The current plugin includes guidance for this target, coordinated by the shared dashboard-bootstrap workflow. It resolves the source, exports selected SQL, prepares the necessary metrics, and hands the evidence to gen_visual_dashboard. Coverage is checked per chart. Filters, permissions, unsupported calculations, and requested layout differences need explicit validation before treating the destination as equivalent."
    },
    {
      "q": "How is a Datus report different from a Datus dashboard?",
      "a": "A Datus HTML report is a narrative snapshot with results captured during generation. A Datus HTML dashboard is an interactive data view whose supported filters send queries to a configured backend. In the CLI workflow that backend is served by datus --web. Both can use metrics and SQL, but they serve different reading and exploration tasks."
    },
    {
      "q": "Does importing context modify my Superset dashboard?",
      "a": "The Datus-target reconstruction workflow keeps source BI assets read-only apart from exporting selected evidence into local files. Creating or changing a dashboard inside Superset uses the separate Superset authoring workflow, where writes require confirmation. Choose the output destination explicitly so the agent applies the appropriate source and write boundaries."
    },
    {
      "q": "Where do the data queries run?",
      "a": "Queries use the configured datasource and its access permissions. Superset source discovery resolves the actual database behind a dataset; the Superset server address is not itself the warehouse connection. Datus dashboard filters need the configured query backend. Generated files alone do not replace that backend or prove that the source and destination queries produce equivalent results."
    }
  ],
  "closingTitle": "Put your existing BI knowledge to work.",
  "closingLead": "Start with one Superset dashboard and a question your team wants to answer.",
  "relatedTitle": "Continue exploring",
  "related": [
    {
      "title": "All integrations",
      "href": "/integrations/"
    },
    {
      "title": "Semantic layer solution",
      "href": "/solutions/semantic-layer/"
    },
    {
      "title": "Composable analytics",
      "href": "/solutions/composable-analytics/"
    },
    {
      "title": "Datus Studio",
      "href": "/products/studio/"
    }
  ]
};
export const SUPERSET_CONTENT: Record<Locale, typeof en> = { en, zh: {
  "eyebrow": "Datus + Apache Superset",
  "title": "Apache Superset AI Agent 集成",
  "lead": "将 Superset 看板背后的 SQL 与业务逻辑转为可复用的指标和 Agent 上下文。基于团队已有知识追问分析、构建 Datus 看板，或生成 HTML 报告。",
  "primary": "免费开始使用",
  "secondary": "查看工作流程",
  "heroNodes": [
    "Superset 看板",
    "选定 SQL + 图表分析意图",
    "经审核的指标 + Reference SQL",
    "Datus Agent、报告与看板"
  ],
  "heroLabel": "将 Superset 图表依据转为共享定义，用于 Datus 分析与可视化产出",
  "heroNote": "继续使用 Superset，自主选择带入 Datus 的知识与输出形式。",
  "workflow": {
    "eyebrow": "从看板到共享上下文",
    "title": "把图表背后的定义一起带过来。",
    "lead": "选择看板和图表、确认范围，再由 Datus 基于导出的查询依据构建上下文。匹配的已有指标会被复用；缺失指标可以在选定范围内创建并验证。",
    "tabs": [
      "选择来源",
      "审核定义",
      "选择输出"
    ],
    "panels": [
      {
        "title": "从真实的 Superset 看板开始。",
        "body": "插件解析看板、图表、数据集及底层数据库连接。团队确认哪些查询作为 Reference SQL，哪些查询提供指标依据。",
        "labels": [
          "看板与图表清单",
          "物理数据源匹配",
          "已确认的查询选择"
        ],
        "code": "Superset dashboard\n  ├─ selected chart queries\n  ├─ dataset / database identity\n  └─ measures, filters, time grain"
      },
      {
        "title": "保留计算含义，而不只是图表标题。",
        "body": "Datus 导出完整的选定 SQL 与清单，再构建可复用的上下文。目标为 Datus 看板时，会先核对已有 DOSI 定义，仅补齐选中范围缺失的指标，再生成可视化。",
        "labels": [
          "Reference SQL + 来源依据",
          "复用或创建所需指标",
          "验证并重新发现定义"
        ],
        "code": "reference_sql/superset/<dashboard-slug>/\n  manifest.json\n  <chart-query>.sql\n  _source/\n\nsemantic_modeling → reviewed DOSI metrics"
      },
      {
        "title": "按任务选择上下文的使用方式。",
        "body": "可以继续使用限定看板范围的分析 Agent，生成叙述式 HTML 报告，或把选定视图重建为 Datus 看板。输出目标决定具体生成路径。",
        "labels": [
          "追问分析与指标归因",
          "用于汇报的 HTML 报告",
          "用于探索的 Datus 看板"
        ],
        "code": "Superset evidence + maintained metrics\n  ├─ analysis subagents\n  ├─ gen_visual_report\n  └─ gen_visual_dashboard"
      }
    ],
    "note": "依据插件与 Agent 源码绘制的流程示意。仍需核对源筛选条件、权限与不受支持的图表行为；外观相似不代表计算等价。",
    "docs": "查看看板上下文构建教程"
  },
  "outputs": {
    "eyebrow": "三种输出，各有用途",
    "title": "保留已有看板，拓展它能支持的工作。",
    "lead": "按结果的用途选择输出位置。Superset 看板、Datus HTML 报告与 Datus HTML 看板的交互方式和运行条件不同。",
    "tabs": [
      "Superset 看板",
      "Datus HTML 报告",
      "Datus HTML 看板"
    ],
    "items": [
      {
        "title": "在 Superset 内创建和维护可视化。",
        "body": "让 Datus Agent 使用 Superset 创作插件查看或创建数据集、图表和看板布局，并回读产出、检查代表性查询。",
        "badge": "保存在 Superset",
        "detail": "使用现有 Superset 部署与数据连接。",
        "label": "查看 Superset 看板创作教程",
        "href": "https://docs.datus.ai/dev/getting_started/data_engineering_quickstart/"
      },
      {
        "title": "用可分享的报告解释答案。",
        "body": "基于选定指标或 SQL 依据生成包含摘要、图表和表格的叙述式 HTML 页面。数据在生成时写入，读者不会通过切换筛选条件发起实时查询。",
        "badge": "数据快照 + 叙述",
        "detail": "围绕一个问题形成报告，并可按章节继续修改。",
        "label": "了解 HTML 报告生成",
        "href": "https://docs.datus.ai/dev/subagent/gen_visual_report/"
      },
      {
        "title": "为交互探索重建选定视图。",
        "body": "通过共享的上下文构建流程，将 Superset 看板转换为 Datus 项目看板。目标流程复用兼容指标，在允许时补齐缺失定义，并验证生成的查询。",
        "badge": "筛选 + 实时查询",
        "detail": "Datus HTML 看板需要配置查询后端；CLI 工作流程中由 datus --web 提供。",
        "label": "了解 Datus HTML 看板",
        "href": "https://docs.datus.ai/dev/subagent/gen_visual_dashboard/"
      }
    ],
    "previewTitle": "输出结构示意",
    "chartLabels": [
      "按地区",
      "月度趋势",
      "明细"
    ],
    "reportHeadings": [
      "管理摘要",
      "变化解读",
      "依据与后续行动"
    ],
    "filter": "日期／地区筛选",
    "previewNote": "此处展示布局示意，不包含实时数据或生成的客户结果。"
  },
  "value": {
    "eyebrow": "为什么把 BI 知识带入 Datus？",
    "title": "让一张看板背后的工作服务更多问题。",
    "cards": [
      {
        "title": "复用已维护的定义",
        "body": "重建流程先核对已有指标，再补齐缺失定义。名称相近，并不能证明计算含义一致。"
      },
      {
        "title": "保留来源依据",
        "body": "将图表与查询的对应关系、导出 SQL 和生成的上下文一起保留，方便团队审核计算来源。"
      },
      {
        "title": "选择合适的输出界面",
        "body": "日常 BI 报表继续保留在 Superset，用报告完成汇报，或用 Datus 看板开展新的交互探索。"
      }
    ]
  },
  "setup": {
    "eyebrow": "接入现有环境",
    "title": "连接 Superset，确认来源，从一张看板开始。",
    "steps": [
      "安装并启用 Superset 插件，配置已授权的连接。",
      "将所选 Superset 数据集实际使用的数据库配置为 Datus 数据源。",
      "选择看板、确认导入范围，并在扩大使用前审核生成的上下文。"
    ],
    "note": "插件面向 Apache Superset 4.x 及更高版本，具体部署需要核对认证、来源身份和逐图表覆盖情况。",
    "link": "查看接入与上下文构建指南"
  },
  "faqTitle": "Apache Superset 集成常见问题",
  "faqs": [
    {
      "q": "Datus 能把 Superset 看板逻辑转为指标吗？",
      "a": "Datus 可以导出选中图表的查询，将其作为 Reference SQL 与语义建模的依据。看板上下文构建需要确认范围并匹配物理数据源。目标为 Datus 看板时，匹配的已有指标会被复用，缺失的选定指标可以创建。仍应审核计算、筛选条件与时间粒度，不能只根据图表标题推断指标定义。"
    },
    {
      "q": "可以把 Superset 看板转换为 Datus 看板吗？",
      "a": "当前插件提供这一目标的操作指引，由共享的 dashboard-bootstrap 工作流程协调。流程解析来源、导出选定 SQL、准备所需指标，再交给 gen_visual_dashboard。覆盖范围需要逐图表检查；筛选、权限、不受支持的计算和布局差异，需要明确验证后才能认定目标与来源等价。"
    },
    {
      "q": "Datus 报告与 Datus 看板有什么区别？",
      "a": "Datus HTML 报告是叙述式数据快照，结果在生成时写入。Datus HTML 看板则是交互数据视图，受支持的筛选操作会向配置的后端发起查询。CLI 工作流程中后端由 datus --web 提供。两者都可以使用指标与 SQL，但分别适合阅读汇报与持续探索。"
    },
    {
      "q": "导入上下文会修改 Superset 原有看板吗？",
      "a": "以 Datus 为目标的重建流程保持源 BI 资源只读，仅将选定依据导出到本地文件。在 Superset 内创建或修改看板，使用单独的 Superset 创作流程，写操作需要确认。请明确输出目标，让 Agent 使用对应的来源与写入边界。"
    },
    {
      "q": "数据查询在哪里执行？",
      "a": "查询使用配置的数据源及其访问权限。Superset 来源发现会解析数据集背后的真实数据库，Superset 服务地址本身不是数仓连接。Datus 看板的筛选需要配置查询后端。仅生成文件不能替代后端，也不能证明源与目标查询的结果等价。"
    }
  ],
  "closingTitle": "让已有 BI 知识进入更多工作流程。",
  "closingLead": "从一张 Superset 看板和团队想回答的问题开始。",
  "relatedTitle": "继续了解",
  "related": [
    {
      "title": "全部集成",
      "href": "/integrations/"
    },
    {
      "title": "语义层解决方案",
      "href": "/solutions/semantic-layer/"
    },
    {
      "title": "可组合分析",
      "href": "/solutions/composable-analytics/"
    },
    {
      "title": "Datus Studio",
      "href": "/products/studio/"
    }
  ]
} };
