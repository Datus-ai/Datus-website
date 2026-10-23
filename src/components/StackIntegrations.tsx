import { ArrowUpRight } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { useHref, useT } from '../i18n/LocaleContext';
import { STACK_INTEGRATIONS } from '../content/stackIntegrations';
import VendorLogo from './VendorLogo';
import '../styles/stack-integrations.css';

export default function StackIntegrations() {
  const t = useT(STACK_INTEGRATIONS);
  const l = useHref();
  const id=useId(),[compact,setCompact]=useState(false),[active,setActive]=useState(0);
  useEffect(()=>{const query=window.matchMedia('(min-width:1024px) and (max-height:950px)');const update=()=>setCompact(query.matches);update();query.addEventListener('change',update);return()=>query.removeEventListener('change',update)},[]);
  return <div className="nordic-integrations stack-integrations">
    {compact&&<div className="stack-integrations__tabs" role="tablist" aria-label={t.navigation}>{t.rows.map((row,index)=><button type="button" role="tab" id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`} aria-selected={active===index} tabIndex={active===index?0:-1} key={row.name} onClick={()=>setActive(index)} onKeyDown={event=>{const next=event.key==='ArrowRight'?(index+1)%t.rows.length:event.key==='ArrowLeft'?(index+t.rows.length-1)%t.rows.length:event.key==='Home'?0:event.key==='End'?t.rows.length-1:null;if(next===null)return;event.preventDefault();setActive(next);(event.currentTarget.parentElement?.children[next] as HTMLButtonElement)?.focus()}}>{row.name}</button>)}</div>}
    {t.rows.map((row,index)=><div className="nordic-integration-row" key={row.name} id={`${id}-panel-${index}`} role={compact?'tabpanel':undefined} aria-labelledby={compact?`${id}-tab-${index}`:undefined} tabIndex={compact?0:undefined} hidden={compact&&active!==index}>
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
