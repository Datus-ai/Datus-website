import { useState } from 'react';
import { ArrowUpRight, Bot, Braces, Database, FileCode2, FileText, FolderOpen, Table2 } from 'lucide-react';
import ProductInterfacePreview, { STUDIO_PREVIEW_SQL } from '../../../components/ProductInterfacePreview';
import { INTERFACE_PREVIEWS } from '../../../content/interfacePreviews';
import { useHref, useT } from '../../../i18n/LocaleContext';
import { AI_BI_CONTENT } from './content';
import './context-experience.css';

const icons = [FolderOpen, Bot, FileCode2, Table2];
const DOC_DASHBOARD = 'https://docs.datus.ai/latest/getting_started/dashboard_copilot/';
const DOC_CHARTS = 'https://docs.datus.ai/dev/vscode_extension/introduction/';

function MobileStudioPreview({step,onStepChange}:{step:number;onStepChange:(step:number)=>void}) {
  const t=useT(INTERFACE_PREVIEWS);
  const labels=[t.studioFilesStep,t.studioAgentStep,t.studioSqlStep,t.studioResultsStep];
  return <div className="ai-bi-context-mobile" aria-label="Datus Studio"><div className="ai-bi-context-mobile__top"><strong>Datus Studio</strong><span>{t.project}</span></div>
    <div className="ai-bi-context-mobile__tabs" role="group" aria-label={t.studioTour}>{labels.map((label,index)=><button type="button" key={label} aria-pressed={step===index} onClick={()=>onStepChange(index)}><span>{String(index+1).padStart(2,'0')}</span>{label}</button>)}</div>
    <div className="ai-bi-context-mobile__screen" key={step}>
      {step===0&&<><div className="ai-bi-context-mobile__file"><FolderOpen size={17}/>commerce <span>business-rules.md</span></div><pre>{t.studioDocument}</pre><div className="ai-bi-context-mobile__context"><Database size={15}/>{t.context}: orders · customers · revenue</div></>}
      {step===1&&<><div className="ai-bi-context-mobile__agent"><Bot size={16}/>{t.assistant}</div><div className="ai-bi-context-mobile__prompt">{t.ask}</div><div className="ai-bi-context-mobile__attachment"><FileText size={14}/>business-rules.md <span>{t.attachedContext}</span></div><p>{t.reply}</p><div className="ai-bi-context-mobile__tools"><Braces size={14}/>context_search_tools <span>→</span> db_tools</div></>}
      {step===2&&<><div className="ai-bi-context-mobile__file"><FileCode2 size={16}/>revenue.sql <span>SQL</span></div><pre>{STUDIO_PREVIEW_SQL}</pre><div className="ai-bi-context-mobile__context"><FileCode2 size={15}/>business-rules.md → revenue.sql</div></>}
      {step===3&&<><div className="ai-bi-context-mobile__file"><Table2 size={16}/>{t.results} <span>{t.rows}</span></div><div className="ai-bi-context-mobile__table"><table><thead><tr><th>status</th><th>revenue</th></tr></thead><tbody><tr><td>completed</td><td>350.00</td></tr><tr><td>cancelled</td><td>100.00</td></tr></tbody></table></div><p>{t.reply}</p></>}
    </div>
  </div>;
}

export default function ContextProductExperience() {
  const t = useT(AI_BI_CONTENT).context;
  const l = useHref();
  const [step, setStep] = useState(0);

  return <section className="ai-bi-band" aria-labelledby="ai-bi-context-title"><div className="container ai-bi-section ai-bi-context-experience">
    <div className="ai-bi-section-head"><span className="eyebrow">{t.eyebrow}</span><h2 id="ai-bi-context-title">{t.title}</h2><p className="lead">{t.lead}</p></div>
    <div className="ai-bi-context-experience__steps" role="group" aria-label={t.title}>
      {t.steps.map((item, index) => { const Icon = icons[index]; return <button key={item.number} type="button" aria-pressed={step === index} onClick={() => setStep(index)}><span className="ai-bi-context-experience__step-top"><Icon size={19}/>{item.number}</span><strong>{item.title}</strong><span className="ai-bi-context-experience__step-body">{item.body}</span></button>; })}
    </div>
    <div className="ai-bi-context-experience__preview"><div className="ai-bi-context-experience__desktop"><ProductInterfacePreview kind="studio" studioStep={step} onStudioStepChange={setStep}/></div><MobileStudioPreview step={step} onStepChange={setStep}/></div>
    <p className="ai-bi-caption">{t.previewNote}</p>
    <div className="ai-bi-context-experience__bottom"><p>{t.proof}</p><div><a href={l('/solutions/semantic-layer/')}>{t.link}<ArrowUpRight size={15}/></a><a href={l('/products/studio/')}>{t.studio}<ArrowUpRight size={15}/></a><a href={DOC_DASHBOARD} target="_blank" rel="noopener noreferrer">{t.dashboard}<ArrowUpRight size={15}/></a><a href={DOC_CHARTS} target="_blank" rel="noopener noreferrer">{t.vscode}<ArrowUpRight size={15}/></a></div></div>
  </div></section>;
}
