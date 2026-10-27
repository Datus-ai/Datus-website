import type { Locale } from '../i18n/config';
const en = {
 steps: [
  {title:'Start with what your business already knows',description:'Bring together knowledge from documents, warehouse schemas, and SQL & ETL scripts.'},
  {title:'Turn scattered knowledge into a connected model',description:'Datus Agent drafts semantic models and connects business concepts into an ontology.'},
  {title:'Make business meaning a team decision',description:'Your team reviews definitions, relationships, and rules before putting them to work.'},
  {title:'Put shared definitions into execution',description:'DOSI turns compatible Apache Ossie models into native SQL for your data stack.'},
  {title:'Keep context useful as your business evolves',description:'Bring reviewed changes back into shared context for the next question.'},
 ],
 controls:'Knowledge-to-execution steps', pause:'Pause animation', play:'Play animation', next:'Next step',
 sources:['Documents','Warehouse schemas','SQL & ETL'], fragments:['Business rules','Tables & fields','Existing logic'],
 gathered:'Gather existing knowledge', model:'Ontology + semantic model', draft:'Draft model',
 customer:'Customer', order:'Order', metric:'Revenue', relationship:'places', measured:'measured by', sourceMapping:'Mapped to source fields',
 review:'Team review', rule:'Premier customer', criteria:['Margin ≥ $3,000','At least 6 orders','Return rate ≤ 20%'],
 checked:['Definitions checked','Relationships checked','Rules confirmed'], reviewed:'Reviewed definition',
 question:'Which customers qualify for Premier?', spec:'Apache Ossie model', engine:'DOSI Engine', sql:'Native SQL',
 warehouse:'Your warehouse', results:'Results', result:'3 qualifying customers', trace:'Definition → SQL → source lineage',
 change:'Business rules evolve', changedRule:'Margin ≥ $4,000', reviewedChange:'Team-reviewed update',
 shared:'Shared context', nextQuestion:'The next question uses the reviewed definition', feedback:'Reviewed changes improve the next workflow',
};
export const KNOWLEDGE_JOURNEY:Record<Locale,typeof en>={en,zh:{
 steps:[
  {title:'从业务已有的知识出发',description:'汇集文档、数仓表结构以及 SQL 与 ETL 脚本中的业务知识。'},
  {title:'将分散的知识连接成模型',description:'Datus Agent 起草语义模型，将业务概念连接成本体。'},
  {title:'由团队确认业务含义',description:'在投入使用前，由团队审核定义、关系与业务规则。'},
  {title:'让共享定义进入执行',description:'DOSI 将兼容的 Apache Ossie 模型编译为适合你的技术栈的原生 SQL。'},
  {title:'让上下文随业务持续演进',description:'将审核后的变更反馈到共享上下文，供下一个问题复用。'},
 ],
 controls:'从知识到执行的步骤',pause:'暂停动画',play:'播放动画',next:'下一步',
 sources:['文档','数仓表结构','SQL 与 ETL'],fragments:['业务规则','表与字段','已有逻辑'],
 gathered:'汇集已有知识',model:'本体与语义模型',draft:'模型草稿',
 customer:'客户',order:'订单',metric:'营收',relationship:'下单',measured:'衡量',sourceMapping:'映射至源字段',
 review:'团队审核',rule:'Premier 客户',criteria:['贡献利润 ≥ $3,000','订单数 ≥ 6','退货率 ≤ 20%'],
 checked:['检查定义','检查关系','确认规则'],reviewed:'已审核的定义',
 question:'哪些客户符合 Premier 资格？',spec:'Apache Ossie 模型',engine:'DOSI Engine',sql:'原生 SQL',
 warehouse:'你的数仓',results:'查询结果',result:'3 位符合资格的客户',trace:'定义 → SQL → 源数据血缘',
 change:'业务规则发生变化',changedRule:'贡献利润 ≥ $4,000',reviewedChange:'团队已审核的变更',
 shared:'共享上下文',nextQuestion:'下一个问题使用审核后的定义',feedback:'审核后的变更完善下一次工作流',
}};
export type JourneyCopy=typeof en;
