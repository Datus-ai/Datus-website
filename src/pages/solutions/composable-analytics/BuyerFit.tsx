import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useHref, useT } from '../../../i18n/LocaleContext';
import { COMPOSABLE_CONTENT } from './content';

export default function BuyerFit() {
  const t = useT(COMPOSABLE_CONTENT).selection;
  const l = useHref();

  return <section className="ca-section ca-section--tinted" aria-labelledby="ca-fit-title"><div className="container ca-section-inner">
    <div className="ca-section-head"><span className="eyebrow">{t.eyebrow}</span><h2 id="ca-fit-title">{t.title}</h2><p>{t.lead}</p></div>
    <div className="ca-fit-grid">{t.groups.map(group=><article className="ca-fit-card" key={group.label}>
      <h3>{group.label}</h3><p>{group.description}</p>
      <div className="ca-fit-brands">{group.items.map(item=><a key={item.name} href={l(item.href)}><img src={`/integrations/logos/${item.logo}`} alt="" aria-hidden="true" width="24" height="24" loading="lazy"/><span>{item.name}</span><ArrowUpRight size={14}/></a>)}</div>
    </article>)}</div>
    <div className="ca-criteria"><h3>{t.criteriaTitle}</h3><div>{t.criteria.map(item=><article key={item.q}><CheckCircle2 size={18}/><h4>{item.q}</h4><p>{item.a}</p></article>)}</div></div>
  </div></section>;
}
