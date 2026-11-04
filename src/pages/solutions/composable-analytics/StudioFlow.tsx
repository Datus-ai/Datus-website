import { ArrowRight, ArrowUpRight, Check, Database, FileChartColumnIncreasing, Layers3, Share2 } from 'lucide-react';
import { useHref, useT } from '../../../i18n/LocaleContext';
import { COMPOSABLE_CONTENT } from './content';

const DASHBOARD_DOCS = 'https://docs.datus.ai/dev/subagent/gen_visual_dashboard/';
const REPORT_DOCS = 'https://docs.datus.ai/dev/subagent/gen_visual_report/';

export default function StudioFlow() {
  const t = useT(COMPOSABLE_CONTENT).proof;
  const l = useHref();

  return <section className="ca-section" aria-labelledby="ca-proof-title"><div className="container ca-section-inner ca-studio">
    <div className="ca-studio-copy"><span className="eyebrow">{t.eyebrow}</span><h2 id="ca-proof-title">{t.title}</h2><p className="ca-studio-lead">{t.lead}</p>
      <ol className="ca-studio-steps">{t.steps.map(step=><li key={step.label}><span>{step.label}</span><p>{step.body}</p></li>)}</ol>
      <div className="ca-proof-links"><a href={DASHBOARD_DOCS} target="_blank" rel="noopener noreferrer">{t.docs}<ArrowUpRight size={15}/></a><a href={REPORT_DOCS} target="_blank" rel="noopener noreferrer">{t.reportDocs}<ArrowUpRight size={15}/></a><a href={l('/solutions/semantic-layer/')}>{t.semanticLink}<ArrowUpRight size={15}/></a></div>
    </div>
    <div className="ca-studio-wrap"><div className="ca-studio-preview" role="img" aria-label={`${t.previewLabel}: ${t.previewWorkspace}; ${t.previewContext} ${t.previewMetric}; ${t.previewArtifact}`}>
      <div className="ca-studio-top"><img src="/brand-mark.svg" alt="" aria-hidden="true" width="22" height="22"/><strong>Datus Studio</strong><span>{t.previewLabel}</span></div>
      <div className="ca-studio-workspace"><span>{t.previewWorkspace}</span><span className="ca-studio-dots"><i/><i/><i/></span></div>
      <div className="ca-studio-body"><div className="ca-studio-side"><Database size={18}/><Layers3 size={18}/><FileChartColumnIncreasing size={18}/><Share2 size={18}/></div>
        <div className="ca-studio-main"><div className="ca-studio-context"><Layers3 size={16}/><div><small>{t.previewContext}</small><strong>{t.previewMetric}</strong></div><Check size={15}/></div>
          <div className="ca-studio-artifact"><div className="ca-studio-artifact-head"><strong>{t.previewArtifact}</strong><span>{t.previewStatus}</span></div><div className="ca-studio-chart"><div><small>{t.previewMetric}</small><b>{t.previewTotal}</b></div><div className="ca-studio-bars"><i/><i/><i/><i/><i/></div></div><div className="ca-studio-artifact-lines"><i/><i/><i/></div></div>
          <div className="ca-studio-actions"><span>{t.previewShare}</span><span>{t.previewPublish}<ArrowRight size={13}/></span></div>
        </div></div>
    </div><p className="ca-caption">{t.note}</p></div>
  </div></section>;
}
