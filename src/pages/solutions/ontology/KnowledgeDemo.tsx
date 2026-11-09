import { UserRound, Bot, Check, Package, Truck, Undo2, FileCode2 } from 'lucide-react';
import { useT } from '../../../i18n/LocaleContext';
import { ONTOLOGY_CONTENT } from './content';

/** Conceptual diagrams: no query results or accounting outcomes are simulated. */
export default function KnowledgeDemo(){
 const copy=useT(ONTOLOGY_CONTENT),t=copy.knowledgeDiagram,v=copy.visuals;
 const consumer=(x:number,label:string,human=false)=><g transform={`translate(${x} 376)`}><circle r="27" className="ke-consumer"/>{human?<UserRound x={-12} y={-13} size={24}/>:<Bot x={-12} y={-13} size={24}/>}<text y="50" textAnchor="middle">{label}</text></g>;
 return <section className="onto-band" id="shared-expertise"><div className="container onto-section">
 <span className="eyebrow">{v.valueEyebrow}</span><h2>{v.valueTitle}</h2><p className="onto-lead">{v.valueLead}</p>
 <p className="onto-business-question">{v.question}</p>
 <div className="onto-expertise-visuals">
 <figure className="ke-before"><h3>{t.beforeLabel}</h3><svg viewBox="0 0 540 450" role="img" aria-label={t.beforeAlt}>
 <g className="ke-knowledge-cloud"><path d="M143 73Q126 31 176 26Q207 2 241 26Q285 0 317 29Q374 19 386 65Q419 97 377 121H164Q123 115 143 73Z"/><UserRound x={245} y={43} size={50}/><text x="270" y="116" textAnchor="middle">{t.expert}</text></g>
 {t.rules.map((rule,i)=><g key={rule} transform={`translate(${148+i*83} 151)`}><rect x="-40" y="-16" width="80" height="30" rx="15"/><text textAnchor="middle" y="4" className="ke-small">{rule}</text></g>)}
 {[90,270,450].map((x,i)=><g key={x}><path className="ke-ask-track" d={`M${x} 345 Q${x} 230 250 184`}/><path className="ke-ask-pulse" style={{animationDelay:`${i*.8}s`}} d={`M${x} 345 Q${x} 230 250 184`}/><g transform={`translate(${x-42} ${i===1?238:258})`}><rect width="84" height="30" rx="15"/><text x="42" y="20" textAnchor="middle" className="ke-small">{t.ask}</text></g><g transform={`translate(${x} 320)`}><FileCode2 x={-10} y={-15} size={20}/><text y="14" textAnchor="middle" className="ke-small">{t.sql}</text></g></g>)}
 {consumer(90,t.analyst,true)}{consumer(270,t.agent)}{consumer(450,t.agent)}
 </svg><figcaption>{t.beforeOutcome}</figcaption></figure>
 <figure className="ke-after"><h3>{t.afterLabel}</h3><svg viewBox="0 0 540 450" role="img" aria-label={t.afterAlt}>
 <g transform="translate(73 32)"><UserRound x={-16} y={-16} size={32}/><text x="28" y="6">{t.expert}</text></g><path className="ke-path" d="M265 32H450Q478 32 478 63V80"/><g transform="translate(335 32)"><rect x="-18" y="-15" width="123" height="30" rx="15"/><Check x={-10} y={-8} size={16}/><text x="11" y="5" className="ke-small">{t.review}</text></g>
 <rect className="ke-shared" x="40" y="77" width="460" height="166" rx="18"/><text x="63" y="104" className="ke-shared-label">{t.shared}</text>
 <path className="ke-path" d="M185 145H354M185 158Q235 201 354 201"/><path className="ke-shared-pulse" d="M185 145H354M185 158Q235 201 354 201"/>
 <g transform="translate(111 145)"><Package x={-15} y={-16} size={30}/><text y="37" textAnchor="middle">{t.order}</text></g>
 <g transform="translate(410 139)"><Truck x={-14} y={-13} size={28}/><text x="-25" y="30" textAnchor="middle">{t.shipment}</text></g>
 <g transform="translate(410 201)"><Undo2 x={-13} y={-11} size={26}/><text x="-25" y="30" textAnchor="middle">{t.returns}</text></g>
 <text className="ke-small" x="260" y="133" textAnchor="middle">{t.fulfilled}</text><text className="ke-small" x="260" y="207" textAnchor="middle">{t.adjusted}</text>
 <path className="ke-path" d="M270 243V249M270 271V278M270 311V329Q270 338 90 338V349M270 329V349M270 329Q270 338 450 338V349"/>
 <text x="270" y="266" textAnchor="middle" className="ke-small">{t.metric}</text>
 <rect className="ke-runtime" x="179" y="279" width="182" height="34" rx="17"/><text className="ke-runtime-label" x="270" y="301" textAnchor="middle">{t.runtime}</text>
 {[90,270,450].map((x,i)=><path key={x} className="ke-shared-pulse" style={{animationDelay:`${i*.5}s`}} d={`M270 313Q270 335 ${x} 338V349`}/>)}
 {consumer(90,t.analyst,true)}{consumer(270,t.agent)}{consumer(450,t.agent)}<text x="270" y="447" textAnchor="middle" className="ke-small">{t.evidence}</text>
 </svg><figcaption>{t.afterOutcome}</figcaption></figure>
 </div><p className="onto-note">{t.note}</p>
 </div></section>;
}
