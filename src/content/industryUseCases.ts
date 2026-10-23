import type { Locale } from '../i18n/config';
const en={
 eyebrow:'In practice',heading:'Business context for the decisions your industry makes.',
 lead:'Connect the definitions and relationships behind everyday decisions. These illustrative scenarios show how teams could put Datus to work.',
 example:'Illustrative scenario · example question', pauseMotion:'Pause background motion', playMotion:'Play background motion',
 items:[
  {id:'retail',industry:'Retail & e-commerce',title:'See which sales create margin.',question:'Which channels generate margin after returns and fulfillment costs?',body:'Connect customers, orders, returns, and fulfillment with a reviewed margin definition. Agents can investigate channel performance; teams can trace the calculation back to costs and source records.',href:'/solutions/semantic-layer/#model-reuse',link:'Explore model reuse',image:'/product/industries/retail.jpg',alt:'An apparel fulfillment workspace with packed orders and a garment return being inspected.'},
  {id:'finance',industry:'Financial services',title:'Trace settlement gaps to their source.',question:'Which merchants have unsettled balances after refunds, disputes, and fees?',body:'Connect merchants, payments, disputes, and settlements with reviewed balance definitions. Agents can help investigate differences; finance teams can inspect query logic and trace the result to transactions.',href:'/solutions/semantic-layer/#solution-workflow',link:'Inspect the execution approach',image:'/product/industries/finance.jpg',alt:'Two financial operations analysts reviewing settlement data in a bright, modern office.'},
  {id:'manufacturing',industry:'Manufacturing & supply chain',title:'Understand where delivery commitments slip.',question:'Which orders missed promised dates, and which production lines or suppliers were involved?',body:'Connect suppliers, work orders, and shipments with reviewed delivery definitions. Agents can help investigate exceptions; operations teams can inspect the rules and underlying production records.',href:'/solutions/semantic-layer/#modeling-workspace',link:'Explore model review',image:'/product/industries/manufacturing.jpg',alt:'An operations engineer reviewing a tablet beside machinery on a manufacturing production floor.'},
 ],
};
export const INDUSTRY_USE_CASES:Record<Locale,typeof en>={en,zh:{
 eyebrow:'应用场景',heading:'用业务上下文，支撑行业中的每一次决策。',
 lead:'连接日常决策背后的定义与关系。以下示例展示团队如何使用 Datus，处理各自行业中的业务问题。',example:'示意场景 · 问题示例', pauseMotion:'暂停背景动态', playMotion:'播放背景动态',
 items:[
  {id:'retail',industry:'零售与电商',title:'看清哪些销售带来了利润。',question:'扣除退货与履约成本后，哪些渠道仍然贡献利润？',body:'连接客户、订单、退货与履约关系，统一团队认可的利润定义。Agent 可以调查渠道表现，团队可以沿计算规则追溯到成本与源记录。',href:'/solutions/semantic-layer/#model-reuse',link:'了解模型如何复用',image:'/product/industries/retail.jpg',alt:'服装电商的履约工作区，货架上摆放订单包裹，工作人员正在检查退回的衣物。'},
  {id:'finance',industry:'金融服务',title:'追溯结算差异的来源。',question:'计入退款、争议与手续费后，哪些商户仍有未结算余额？',body:'连接商户、支付、争议与结算关系，统一团队认可的余额定义。Agent 可以辅助调查差异，财务团队可以检查查询逻辑，并追溯到具体交易。',href:'/solutions/semantic-layer/#solution-workflow',link:'检查执行方式',image:'/product/industries/finance.jpg',alt:'明亮办公室中，两位金融运营分析人员正在核查结算数据。'},
  {id:'manufacturing',industry:'制造与供应链',title:'看清交付承诺在哪个环节落空。',question:'哪些订单未按承诺日期交付，涉及哪些产线或供应商？',body:'连接供应商、工单与发运关系，统一团队认可的交付定义。Agent 可以辅助调查异常，运营团队可以检查规则及对应的生产记录。',href:'/solutions/semantic-layer/#modeling-workspace',link:'了解模型审核流程',image:'/product/industries/manufacturing.jpg',alt:'制造车间里，一位运营工程师在设备旁查看平板电脑。'},
 ],
}};
