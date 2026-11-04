import { ArrowRight, ArrowDown } from 'lucide-react';
import { useHref, useT } from '../../../i18n/LocaleContext';
import { DATABRICKS_FLOW } from './databricks-evaluation';

export default function DatabricksFlow() {
 const t=useT(DATABRICKS_FLOW),l=useHref();
 return <figure className="ed-shared-flow ed-shared-flow--api" aria-label={t.title}>
  <figcaption><h3>{t.title}</h3><p>{t.lead}</p></figcaption>
  <div className="ed-api-model"><strong>Apache Ossie</strong><span>{t.model}</span><ArrowDown size={20} aria-hidden="true"/></div>
  <div className="ed-shared-flow__path">
   <div><span>{t.consumers}</span><strong>Power BI<br/>Tableau</strong></div>
   <ArrowRight className="ed-shared-flow__arrow" aria-hidden="true"/>
   <div className="ed-shared-flow__model"><strong>{t.adapter}</strong><span>{t.mapping}</span><small>REST API</small></div>
   <ArrowRight className="ed-shared-flow__arrow" aria-hidden="true"/>
   <div className="ed-shared-flow__runtime"><img src="/brand-mark.svg" alt="" width="30" height="30"/><strong>DOSI</strong><span>{t.runtime}</span></div>
   <ArrowRight className="ed-shared-flow__arrow" aria-hidden="true"/>
   <div className="ed-shared-flow__warehouse"><img src="/integrations/logos/databricks.png" alt="" width="30" height="30"/><strong>Databricks</strong><span>{t.warehouse}</span></div>
  </div>
  <div className="ed-shared-flow__return">{t.result}</div>
  <p className="sf-caption">{t.note}</p><a className="sf-text-link" href={l('/solutions/semantic-layer/')}>{t.link}<ArrowRight size={15}/></a>
 </figure>;
}
