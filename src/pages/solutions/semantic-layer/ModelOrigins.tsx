import { ArrowDown, ArrowUpRight, ChartNoAxesCombined, FileCode2, MessagesSquare, Network } from 'lucide-react';
import { useT } from '../../../i18n/LocaleContext';
import { MODEL_ORIGINS_COPY } from './modelOriginsCopy';
import './model-origins.css';

/** Three parallel sources of modeling evidence, rather than a migration tool. */
export default function ModelOrigins() {
 const t = useT(MODEL_ORIGINS_COPY);
 const icons = [FileCode2, ChartNoAxesCombined, MessagesSquare];
 return <div className="model-origins" aria-labelledby="model-origins-title">
  <div className="model-origins__intro"><h3 id="model-origins-title">{t.title}</h3><p>{t.lead}</p></div>
  <div className="model-origins__paths">
   {t.paths.map((path, i) => {
    const Icon = icons[i];
    return <article className="model-origin" key={path.title}>
     <div className="model-origin__source"><Icon size={20} strokeWidth={1.5} aria-hidden="true"/><span>{path.visualLabel}</span></div>
     <div className={`model-origin__visual model-origin__visual--${i}`} aria-hidden="true">
      {i === 0 ? <pre><code><span>SELECT</span> customer_region,{String.fromCharCode(10)}{'  '}<span>SUM</span>(net_revenue){String.fromCharCode(10)}<span>FROM</span> sales{String.fromCharCode(10)}<span>GROUP BY</span> customer_region</code></pre>
       : i === 1 ? <div className="model-origin__dashboard"><div className="model-origin__bars">{[35, 58, 46, 76, 64, 90].map((height, j) => <i key={j} style={{ height: `${height}%` }}/>)}</div><div className="model-origin__chart-query"><FileCode2 size={16}/><code>SUM(net_revenue)</code></div></div>
       : <div className="model-origin__request"><MessagesSquare size={19} strokeWidth={1.5}/><p>{path.request}</p></div>}
     </div>
     <h4>{path.title}</h4><p className="model-origin__body">{path.body}</p>
     <span className="model-origin__evidence">{path.evidence}</span>
     <ArrowDown className="model-origin__arrow" size={19} strokeWidth={1.4} aria-hidden="true"/>
    </article>;
   })}
  </div>
  <div className="model-origins__shared">
   <div className="model-origins__result"><Network size={25} strokeWidth={1.4} aria-hidden="true"/><div><h4>{t.outputTitle}</h4><ul>{t.outputTerms.map(term => <li key={term}>{term}</li>)}</ul></div></div>
   <div className="model-origins__review"><p>{t.review}</p><a className="solution-link" href="#modeling-workspace">{t.reviewLink}<ArrowUpRight size={14} aria-hidden="true"/></a></div>
  </div>
 </div>;
}
