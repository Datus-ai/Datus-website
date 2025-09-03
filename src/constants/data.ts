export const phases = [
  { name: "Intake", color: "border-b-4 border-b-cyan-400" },
  { name: "Discovery", color: "border-b-4 border-b-blue-400" },
  { name: "Prepare", color: "border-b-4 border-b-blue-500" },
  { name: "Validate", color: "border-b-4 border-b-indigo-400" },
  {
    name: "Orchestrate",
    color: "border-b-4 border-b-purple-400",
  },
  { name: "Analyze", color: "border-b-4 border-b-purple-500" },
  { name: "Deliver", color: "border-b-4 border-b-violet-400" },
  { name: "Learn", color: "border-b-4 border-b-pink-400" },
];

export const actors = [
  {
    name: "Stakeholder",
    color: "bg-slate-50 border-slate-200",
    isEmphasis: false,
    activities: {
      Intake: "Ask question & define assumptions, deadline/outcome",
      Discovery: "Share known questions",
      Prepare: "Approve key assumptions",
      Validate: "Confirm anomalies vs business reality",
      Orchestrate: "Set refresh rate vs cost",
      Analyze: "Ask follow-ups; review insights",
      Deliver: "Act on plan; acknowledge",
      Learn: "Provide feedback",
    },
  },
  {
    name: "Data/Analytics Engineer",
    color: "bg-slate-50 border-slate-200",
    isEmphasis: false,
    activities: {
      Intake: "Clarify scope; confirm timeline",
      Discovery: "Pick canonical datasets",
      Prepare: "Model raw—curated; create metrics",
      Validate: "Rules & reconcile; triage issues",
      Orchestrate: "Deploy pipeline; APIs; automate",
      Analyze: "Explore; version queries",
      Deliver: "Tailored narrative; runbook",
      Learn: "Template & reuse",
    },
  },
  {
    name: "Datus Agent",
    color: "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-400",
    isEmphasis: true,
    activities: {
      Intake: "Parse intent; predict auth & others",
      Discovery: "Semantic search; quality & suggestions",
      Prepare: "Auto clean & explain transforms",
      Validate: "Deep checks; auto-fixes; learn suggestions",
      Orchestrate: "Partition/index/MV advisor; self heal",
      Analyze: "Grounded NL->SQL; provenance & auto-cache",
      Deliver: "Multi-channel output; schedule webhooks",
      Learn: "Self improve prompts & rules",
    },
  },
  {
    name: "Platform & Governance",
    color: "bg-slate-50 border-slate-200",
    isEmphasis: false,
    activities: {
      Intake: "Access pre-checks; create project space",
      Discovery: "Surface lineage, usage, costs",
      Prepare: "Inspect/DQ jobs; fill missing",
      Validate: "Reference data; backfills; sign-off",
      Orchestrate: "Schedulers; caches; change control",
      Analyze: "Dashboards & query caches",
      Deliver: "Integration; logs & audit",
      Learn: "Evidence retained; policy updates",
    },
  },
];

export const sqlCode = `-- Prompt → SQL with metadata-aware reasoning

You: "Show daily active addresses and top 100 outflows
in the last 30 days."

Datus → SQL
→ Generated for StarRocks (works with other dialects 
too)
WITH tx AS (
    SELECT from_address, to_address, amount, DATE(ts) AS d
    FROM eth.transactions
    WHERE ts >= NOW() - INTERVAL 7 DAY
), daily_active AS (
    SELECT 
        COUNT(DISTINCT from_address) + COUNT(DISTINCT 
to_address) AS active_addresses
    FROM tx GROUP BY d
), top_out AS (
    SELECT from_address, SUM(amount) AS total_out
    FROM tx GROUP BY from_address
    ORDER BY total_out DESC LIMIT 100
)
SELECT * FROM daily_active;`;

export const featuresData = [
  {
    icon: "Brain",
    iconColor: "text-blue-400",
    title: "AI-Powered Intelligence",
    description: "Semantic search, auto-clean transforms, and grounded natural language to SQL conversion",
    gradient: "from-blue-500/20 to-purple-500/20",
  },
  {
    icon: "Database",
    iconColor: "text-purple-400", 
    title: "Universal Integration",
    description: "Works with your existing data lake, warehouse, and tools. No vendor lock-in.",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: "Shield",
    iconColor: "text-cyan-400",
    title: "Quality & Governance",
    description: "Deep data quality checks, auto-fixes, and comprehensive audit trails",
    gradient: "from-cyan-500/20 to-blue-500/20",
  },
];