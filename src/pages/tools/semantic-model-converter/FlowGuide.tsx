import { useHref, useLocale, useT } from '../../../i18n/LocaleContext';
import { UI } from '../../../i18n/ui';
import { studioCtaUrl } from '../../../lib/studio-cta';
import { CONVERTER_PATH, CONVERTER_FLOWS, type ConverterFlow } from '../../../modules/semantic-converter/routes';
import { platformUi, platformCopy } from './platforms';
import { flowGuides } from './guides';

export function ConverterDirectory({ active }: { active?: string }) {
  const t = useT(platformUi);
  const l = useHref();
  return (
    <nav aria-label={t.directory}>
      <ul className="converter-links">
        {CONVERTER_FLOWS.map((item) => (
          <li key={item.slug}>
            <a href={l(`${CONVERTER_PATH}${item.slug}/`)} aria-current={active === item.slug ? 'page' : undefined}>{item.name}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function FlowGuide({ flow }: { flow: ConverterFlow }) {
  const t = useT(platformUi);
  const copy = useT(flowGuides)[flow.slug];
  const resource = useT(platformCopy)[flow.platformSlug];
  const locale = useLocale();
  const l = useHref();
  return (
    <>
      <section className="section">
        <div className="container converter-prose">
          <h2>{t.format}</h2>
          <p>{copy.intro}</p>
          <h3>{t.input}</h3><p>{copy.source}</p>
          <h3>{t.output}</h3><p>{copy.output}</p>
          <h2>{t.steps}</h2>
          <ol className="converter-steps">
            {copy.steps.map((text) => <li key={text}><p>{text}</p></li>)}
          </ol>
        </div>
      </section>
      <section className="section converter-alt">
        <div className="container converter-prose">
          <h2>{t.checks}</h2>
          {copy.checks.map((text) => <p key={text}>{text}</p>)}
        </div>
      </section>
      <section className="section">
        <div className="container converter-prose">
          <h2>{t.resources}</h2>
          <ul className="converter-links">
            <li><a href={l(CONVERTER_PATH)}>{t.all}</a></li>
            <li><a href={resource.guide}>{t.guide}</a></li>
            <li><a href={studioCtaUrl('https://studio.datus.ai/', `apache_ossie_converter_${flow.slug.replaceAll('-', '_')}_resources`, locale)}>{UI[locale].common.tryStudio}</a></li>
          </ul>
        </div>
      </section>
    </>
  );
}
