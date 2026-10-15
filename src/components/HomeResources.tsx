import { ArrowUpRight } from "lucide-react";
import { useHref, useT } from "../i18n/LocaleContext";
import { RESOURCES } from "../content/resources";

export default function HomeResources() {
  const t = useT(RESOURCES);
  const l = useHref();
  return <section id="resources" className="nordic-section nordic-wrap nordic-resources" aria-labelledby="resources-heading">
    <div className="nordic-resources__head">
      <div><span className="nordic-label">{t.eyebrow}</span><h2 id="resources-heading">{t.heading}</h2></div>
      <a className="nordic-text-link" href={l('/blog/')}>{t.browse}<ArrowUpRight size={17}/></a>
    </div>
    <div className="nordic-resources__grid">
      {t.items.map(item => <article className={`nordic-resource nordic-resource--${item.variant}`} key={item.href}>
        <a className="nordic-resource__link" href={l(item.href)}>
          <div className="nordic-resource__image" aria-hidden="true">
            <img src={item.image} alt="" loading="lazy" width="640" height="426"/>
            {item.variant === 'release' && <span className="nordic-resource__version">0.4.2<span>Datus agent</span></span>}
          </div>
          <div className="nordic-resource__body">
            <span className="nordic-label">{item.category}</span>
            <h3>{item.title}</h3><p>{item.description}</p>
            <span className="nordic-resource__cta">{item.cta}<ArrowUpRight size={18}/></span>
          </div>
        </a>
      </article>)}
    </div>
  </section>;
}
