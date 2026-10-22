import type { Locale } from '../i18n/config';
const en={
 eyebrow:'In practice',heading:'Business questions, grounded in your industry.',
 lead:'Connect the definitions and relationships behind everyday decisions. These illustrative scenarios show how teams could put Datus to work.',
 example:'Example question', pauseMotion:'Pause background motion', playMotion:'Play background motion',
 items:[
  {id:'retail',industry:'Retail & e-commerce',title:'See which sales create margin.',question:'Which channels generate margin after returns and fulfillment costs?',body:'Bring orders, refunds, delivery costs, and product costs into a reviewable model. Finance, operations, and AI agents can work from the same contribution-margin definition.',image:'/product/industries/retail.jpg',alt:'An apparel fulfillment workspace with packed orders and a garment return being inspected.'},
  {id:'finance',industry:'Financial services',title:'Trace settlement gaps to their source.',question:'Which merchants have unsettled balances after refunds, disputes, and fees?',body:'Connect merchant, transaction, and settlement definitions. Give finance and operations a consistent way to investigate balances, inspect query logic, and follow results back to source records.',image:'/product/industries/finance.jpg',alt:'Two financial operations analysts reviewing settlement data in a bright, modern office.'},
  {id:'manufacturing',industry:'Manufacturing & supply chain',title:'Understand where delivery commitments slip.',question:'Which orders missed promised dates, and which production lines or suppliers were involved?',body:'Connect work orders, inventory, supplier deliveries, and shipments. Shared definitions of on-time delivery and exceptions help teams and agents investigate the same operational picture.',image:'/product/industries/manufacturing.jpg',alt:'An operations engineer reviewing a tablet beside machinery on a manufacturing production floor.'},
 ],
};
export const INDUSTRY_USE_CASES:Record<Locale,typeof en>={en,zh:{
 eyebrow:'应用场景',heading:'让行业里的业务问题，有据可查。',
 lead:'连接日常决策背后的定义与关系。以下示例展示团队如何使用 Datus，处理各自行业中的业务问题。',example:'问题示例', pauseMotion:'暂停背景动态', playMotion:'播放背景动态',
 items:[
  {id:'retail',industry:'零售与电商',title:'看清哪些销售带来了利润。',question:'扣除退货与履约成本后，哪些渠道仍然贡献利润？',body:'将订单、退款、配送与商品成本汇集到可审核的语义模型中，让财务、运营和 AI Agent 使用同一套贡献利润定义。',image:'/product/industries/retail.jpg',alt:'服装电商的履约工作区，货架上摆放订单包裹，工作人员正在检查退回的衣物。'},
  {id:'finance',industry:'金融服务',title:'追溯结算差异的来源。',question:'计入退款、争议与手续费后，哪些商户仍有未结算余额？',body:'连接商户、交易与结算定义，让财务和运营以一致的口径核查余额、检查查询逻辑，并将结果追溯到源记录。',image:'/product/industries/finance.jpg',alt:'明亮办公室中，两位金融运营分析人员正在核查结算数据。'},
  {id:'manufacturing',industry:'制造与供应链',title:'看清交付承诺在哪个环节落空。',question:'哪些订单未按承诺日期交付，涉及哪些产线或供应商？',body:'连接工单、库存、供应商到货与发运数据，统一准时交付和异常的定义，让团队与 Agent 基于一致的业务信息排查问题。',image:'/product/industries/manufacturing.jpg',alt:'制造车间里，一位运营工程师在设备旁查看平板电脑。'},
 ],
}};
