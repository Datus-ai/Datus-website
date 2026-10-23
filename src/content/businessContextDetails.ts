import type { Locale } from '../i18n/config';
const en={
 spec:'Apache Ossie',core:'Open model specification',
 facets:[
  {name:'Metrics',detail:'Reusable calculations',example:'revenue · margin'},
  {name:'Dimensions',detail:'Attributes and time',example:'city · joined_at'},
  {name:'Relationships',detail:'How datasets connect',example:'orders → customers'},
  {name:'Sources & keys',detail:'Physical mappings and identity',example:'source · primary_key'},
  {name:'Business descriptions',detail:'Names with business meaning',example:'label · description'},
  {name:'AI context',detail:'Guidance for agents',example:'synonyms · instructions · examples'},
 ],
 ontology:'Northstar business context',choose:'Select a business concept',mapped:'Mapped dataset',properties:'Business properties',relations:'Business relationships',membership:'Qualification and membership are separate concepts.',
};
export const BUSINESS_CONTEXT_DETAILS:Record<Locale,typeof en>={en,zh:{
 spec:'Apache Ossie',core:'开放的模型规范',
 facets:[
  {name:'指标',detail:'可复用的计算定义',example:'营收 · 利润'},
  {name:'维度',detail:'业务属性与时间',example:'city · joined_at'},
  {name:'数据集关系',detail:'数据集之间如何关联',example:'orders → customers'},
  {name:'源映射与键',detail:'对应源数据与唯一标识',example:'source · primary_key'},
  {name:'业务描述',detail:'让名称承载业务含义',example:'label · description'},
  {name:'AI 上下文',detail:'为 Agent 提供业务指引',example:'同义词 · 使用说明 · 示例'},
 ],
 ontology:'Northstar 业务上下文',choose:'选择一个业务概念',mapped:'映射的数据集',properties:'业务属性',relations:'业务关系',membership:'资格条件与会员身份分别建模。',
}};
