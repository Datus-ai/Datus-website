import { ArrowUpRight } from 'lucide-react';
import { useHref, useT } from '../i18n/LocaleContext';
import { STACK_INTEGRATIONS } from '../content/stackIntegrations';
import VendorLogo from './VendorLogo';
import '../styles/stack-integrations.css';

export default function StackIntegrations() {
  const t = useT(STACK_INTEGRATIONS);
  const l = useHref();
  return <div className="nordic-integrations stack-integrations">
    {t.rows.map(row=><div className="nordic-integration-row" key={row.name}>
      <h3>{row.name}</h3>
      <div className="stack-integrations__logos">{row.vendors.map(vendor=><div className="stack-integrations__vendor" key={vendor.name}>
        <VendorLogo name={vendor.name} logo={vendor.name==='BYO'?'byo':vendor.logo}/>
        <span className="stack-integrations__mode">{vendor.mode}</span>
      </div>)}</div>
      <aside className="stack-integrations__flow">
        <dl>{[row.read,row.run,row.output].map((value,index)=><div key={t.labels[index]}><dt>{t.labels[index]}</dt><dd>{value}</dd></div>)}</dl>
        <div className="stack-integrations__guides">{row.guides.map(guide=><a key={guide.href} href={l(guide.href)}>{guide.label}<ArrowUpRight size={13} aria-hidden="true"/></a>)}</div>
      </aside>
    </div>)}
  </div>;
}
