import { useHref, useT } from '../../../i18n/LocaleContext';
import { SELECTION_COPY } from './selectionCopy';
import './selection-guide.css';
export default function SelectionGuide(){
 const t=useT(SELECTION_COPY);
 const l=useHref();
 return <section id="choose-dosi" className="solution-band" aria-labelledby="choose-dosi-title"><div className="container solution-section selection-guide">
  <h2 id="choose-dosi-title">{t.title}</h2><p className="lead">{t.lead}</p>
  <p className="selection-guide__scope">{t.scope}</p>
  <div className="selection-guide__scroll" role="region" aria-label={t.caption} tabIndex={0}><table><caption>{t.caption}</caption><thead><tr><th scope="col">{t.caption}</th>{t.products.map(p=><th scope="col" key={p}>{p}</th>)}</tr></thead><tbody>{t.rows.map(([label,...cells])=><tr key={label}><th scope="row">{label}</th>{cells.map((cell,i)=><td key={i}>{cell}</td>)}</tr>)}</tbody></table></div>
  <details className="selection-guide__sources"><summary>{t.sourceLabel}</summary><ul>{t.sources.map(s=><li key={s.href}><a href={s.href}>{s.label}</a></li>)}</ul></details>
  <h3 className="selection-guide__evidence-title">{t.evidenceTitle}</h3><p className="lead">{t.evidenceLead}</p>
  <div className="solution-columns">{t.evidence.map((item,i)=><article key={item.href}><span className="eyebrow">0{i+1}</span><h3>{item.title}</h3><p>{item.body}</p><a className="solution-link" href={l(item.href)}>{item.label} ↗</a></article>)}</div>
  <p className="selection-guide__boundary">{t.boundary}</p>
 </div></section>;
}
