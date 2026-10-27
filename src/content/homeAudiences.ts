import type { Locale } from '../i18n/config';
const en={
 eyebrow:'Agent-native',heading:'Build with context. Put it to work.',
 lead:'Develop data systems, create visual analysis, and answer business questions from one shared business context.',
 paths:[
  {name:'For data engineers',title:'A data Agent for the work behind the answer.',body:'Use Datus Agent in Studio to explore data, develop and debug SQL, build semantic models, and inspect results in one workspace.',href:'/products/cli/',link:'Explore Datus Agent'},
  {name:'For analysts',title:'From a question to a dashboard or HTML report.',body:'Build dashboards that respond to filters, or publish reports that preserve reviewed findings. Refine both with Datus Agent in Studio.',href:'/products/studio/',link:'Explore Datus Studio'},
  {name:'For business users',title:'Bring business context into the assistant you use.',body:'Use configured MCP connections to ask questions in ChatGPT, Claude, or another compatible client, grounded in your team’s definitions.',href:'/mcp/',link:'Explore MCP connections'},
 ],
 analyst:{workspace:'Datus Studio',assistant:'Datus Agent',dashboard:'Dashboard',report:'HTML report',request:'Build a dashboard and an HTML report of Premier customer margin.',response:'I’ll use the shared model and keep the query with the report.',files:'Analysis files',render:'Report preview',title:'Premier customer review',qualified:'Qualified customers',margin:'Customer margin',sample:'Northstar · recorded sample',reportBody:'Review the qualifying customers using the same business definitions. The report keeps the query and the calculation together.',artifact:'reports/premier/render/app.jsx',dashboardFile:'dashboards/premier/render/app.jsx',prompt:'Continue refining this analysis…'},
 business:{example:'Example via MCP',context:'Datus business context',request:'Which customers qualify for Premier, and what is their margin?',reply:'Using the shared Premier definition, these three customers qualify in the recorded Northstar example.',tools:'Datus · semantic query',evidence:'View calculation & SQL',metric:'Metric definition',sql:'Generated SQL',input:'Ask a business question…',clients:'MCP clients',clientHint:'Connect your preferred compatible client.',values:['Customer','Margin'],responseTitle:'Grounded in shared definitions'},
};
export const HOME_AUDIENCES:Record<Locale,typeof en>={en,zh:{
 eyebrow:'融入 Agent 工作流程',heading:'用共享上下文开发，也用它开展分析。',
 lead:'开发数据系统、生成可视化分析、回答业务问题——复用同一份业务上下文。',
 paths:[
  {name:'数据工程师',title:'从数据开发到结果检查，在同一工作区完成。',body:'在 Studio 中使用 Datus Agent 探索数据、开发和调试 SQL、构建语义模型，并检查执行结果。',href:'/products/cli/',link:'了解 Datus Agent'},
  {name:'分析师',title:'从一个问题，生成仪表盘或 HTML 报告。',body:'构建可筛选探索的仪表盘，或发布保留分析结果的报告。在 Studio 中与 Datus Agent 一起完善查询、图表与结论。',href:'/products/studio/',link:'了解 Datus Studio'},
  {name:'业务用户',title:'在常用的助手中，使用团队的业务上下文。',body:'通过已配置的 MCP 连接，在 ChatGPT、Claude 或其他兼容客户端中提问，让分析基于团队维护的业务定义。',href:'/mcp/',link:'了解 MCP 接入方式'},
 ],
 analyst:{workspace:'Datus Studio',assistant:'Datus Agent',dashboard:'仪表盘',report:'HTML 报告',request:'请为 Premier 客户利润生成仪表盘和 HTML 报告。',response:'我会使用共享模型，并将查询与报告保存在一起。',files:'分析文件',render:'报告预览',title:'Premier 客户分析',qualified:'符合条件的客户',margin:'客户利润',sample:'Northstar · 执行记录示例',reportBody:'使用同一套业务定义，查看符合条件的客户。报告保留了查询与计算依据，方便继续检查和完善。',artifact:'reports/premier/render/app.jsx',dashboardFile:'dashboards/premier/render/app.jsx',prompt:'继续完善这份分析…'},
 business:{example:'通过 MCP 接入的示意',context:'Datus 业务上下文',request:'哪些客户符合 Premier 条件？他们分别贡献了多少利润？',reply:'根据共享的 Premier 定义，在 Northstar 执行记录示例中，以下三位客户符合条件。',tools:'Datus · 语义查询',evidence:'查看计算口径与 SQL',metric:'指标定义',sql:'生成的 SQL',input:'提出一个业务问题…',clients:'MCP 客户端',clientHint:'连接你常用的兼容客户端。',values:['客户','利润'],responseTitle:'基于共享业务定义'},
}};
