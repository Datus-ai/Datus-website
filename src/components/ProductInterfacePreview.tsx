import { createContext, useCallback, useContext, useEffect, useRef, useState, type Dispatch, type SetStateAction, type CSSProperties } from 'react';
import { Bot, ChevronRight, Code2, Database, FileCode2, Folder, GitBranch, Layers3, Maximize2, MessageSquare, Network, Pause, Play, Plug, Search, Settings2, Terminal, X } from 'lucide-react';
import { useT } from '../i18n/LocaleContext';
import { INTERFACE_PREVIEWS, type PreviewCopy } from '../content/interfacePreviews';
import '../styles/product-interface-preview.css';
import '../styles/tab-countdown.css';
import NorthstarInterfacePreview from './NorthstarInterfacePreview';
import IntegrationInterfacePreview from './IntegrationInterfacePreview';
import InterfaceClickHint from './InterfaceClickHint';
export type InterfaceKind = 'dosi' | 'studio' | 'agent' | 'connect';
type PreviewState = { view: string; selected: string; file: string; active: string; mode: string; language: string; version: string; studioStep: number; studioPaused: boolean; dosiPaused: boolean };
const PreviewContext = createContext<{state: PreviewState; setState: Dispatch<SetStateAction<PreviewState>>; dosiRunning:boolean; dosiDuration:number} | null>(null);
function usePreviewField<K extends keyof PreviewState>(key: K): [PreviewState[K], (value: PreviewState[K]) => void] {
 const context = useContext(PreviewContext)!;
 const setState=context.setState;
 const update=useCallback((value:PreviewState[K])=>setState(previous=>({...previous,[key]:value})),[key,setState]);
 return [context.state[key], update];
}
const sql = `SELECT\n  status,\n  SUM(amount) AS revenue\nFROM orders\nGROUP BY status\nORDER BY revenue DESC;`;
function Code({children}:{children:string}) {return <pre className="pi-code">{children.split('\n').map((line,i)=><div key={i}><span className="pi-line-number" aria-hidden="true">{i+1}</span><span>{line || ' '}</span></div>)}</pre>}
function Header({name,t}:{name:string;t:PreviewCopy}) {return <header className="pi-header"><span className="pi-brand"><Layers3 size={20}/>{name}</span><span className="pi-divider"/><span>{t.project}</span><span className="pi-header-end"><Search size={15}/><Settings2 size={15}/><span className="pi-avatar">D</span></span></header>}
function Dosi({t}:{t:PreviewCopy}) {
 const [view,setView]=usePreviewField('view');const [selected,setSelected]=usePreviewField('selected');
 const playback=useContext(PreviewContext)!;
 return <NorthstarInterfacePreview running={playback.dosiRunning} duration={playback.dosiDuration} t={t} view={view} setView={setView} selected={selected} setSelected={setSelected}/>;
}
function Studio({t}:{t:PreviewCopy}) {
 const [file,setFile]=usePreviewField('file');
 const [step,setStep]=usePreviewField('studioStep');
 const [paused,setPaused]=usePreviewField('studioPaused');
 const [visible,setVisible]=useState(false);
 const [reduceMotion,setReduceMotion]=useState(true);
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const update=()=>setReduceMotion(media.matches);update();media.addEventListener('change',update);
  const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.25});
  if(root.current)observer.observe(root.current);
  return()=>{observer.disconnect();media.removeEventListener('change',update)};
 },[]);
 useEffect(()=>{
  if(paused||!visible||reduceMotion)return;
  const timer=window.setTimeout(()=>{const next=(step+1)%4;setStep(next);if(next===2)setFile('revenue.sql');if(next===0)setFile('business-rules.md')},2800);
  return()=>window.clearTimeout(timer);
 },[paused,visible,reduceMotion,step,setFile]);
 function chooseFile(value:string){setFile(value);setPaused(true);setStep(value==='revenue.sql'?2:0)}
 const steps=[t.studioFilesStep,t.studioAgentStep,t.studioSqlStep,t.studioResultsStep];
 return <div ref={root} className="pi-studio-demo" data-tour-step={step} data-tour-motion={!paused&&visible&&!reduceMotion}>
  <Header name="Datus Studio" t={t}/>
  <div className="pi-studio-tour" role="group" aria-label={t.studioTour}>
   {steps.map((label,i)=><button key={label} aria-pressed={step===i} onClick={()=>{setStep(i);setPaused(true);if(i===0)setFile('business-rules.md');if(i===2)setFile('revenue.sql')}}><span className="pi-tour-dot"/>{label}{i===1&&step===0&&<InterfaceClickHint/>}{step===i&&<span className="tab-countdown-line" aria-hidden="true" data-running={!paused&&visible&&!reduceMotion} style={{"--tab-duration":"2800ms"} as CSSProperties} key={`${step}-${paused}-${visible}-${reduceMotion}`}/>}</button>)}
   <button className="pi-tour-play" aria-label={paused?t.tourPlay:t.tourPause} onClick={()=>setPaused(!paused)}>{paused?<Play size={13}/>:<Pause size={13}/>}</button>
  </div>
  <div className="pi-studio-layout"><svg className="pi-workspace-flow" viewBox="0 0 1080 521" aria-hidden="true">{step===1?<path d="M174 160 V74 Q174 62 188 62 H920 Q940 62 940 82 V158"/>:step===2?<path d="M925 266 C790 266 760 170 566 170"/>:step===3?<path d="M566 245 V383"/>:null}</svg><nav className="pi-rail" aria-label={t.workbench}><Layers3/><FileCode2/><Database/><GitBranch/><Settings2/></nav>
   <aside className="pi-sidebar"><p>{t.files}</p><strong><Folder size={14}/> commerce</strong>{['business-rules.md','revenue.sql','commerce.yaml','agent.yml'].map(x=><button key={x} aria-pressed={file===x} onClick={()=>chooseFile(x)}><FileCode2 size={13}/>{x}</button>)}<span>{t.context}</span><div>▦ orders</div><div>▦ customers</div><div>ƒ revenue</div><div>◇ Order</div></aside>
   <main className="pi-editor"><div className="pi-file-tabs">{['business-rules.md','revenue.sql','commerce.yaml','agent.yml'].map(x=><button key={x} aria-pressed={file===x} onClick={()=>chooseFile(x)}>{x}</button>)}</div><div className="pi-editor-title"><Code2 size={14}/>{file}<span>UTF-8</span></div>
    <Code>{file==='business-rules.md'?t.studioDocument:file==='revenue.sql'?sql:file==='commerce.yaml'?`semantic_model:
  name: commerce
  datasets:
    - name: orders
      source: orders
  metrics:
    - name: revenue
      expression: SUM(orders.amount)`:`agent:
  agentic_nodes:
    gen_sql:
      system_prompt: gen_sql
      tools: db_tools.*, context_search_tools.*
      max_turns: 30`}</Code>
    <div className="pi-results"><div className="pi-toolbar"><strong>{t.results}</strong><span>{t.rows}</span></div><table><thead><tr><th>status</th><th>revenue</th></tr></thead><tbody><tr><td>completed</td><td>350.00</td></tr><tr><td>cancelled</td><td>100.00</td></tr></tbody></table></div>
   </main><aside className="pi-chat"><strong><Bot size={17}/>{t.assistant}</strong><div className="pi-user-message">{t.ask}</div><div className="pi-context-attachment"><FileCode2 size={12}/>business-rules.md<span>{t.attachedContext}</span></div><p>{t.reply}</p><div className="pi-tool-call"><ChevronRight size={13}/> context_search_tools</div><div className="pi-tool-call"><ChevronRight size={13}/> db_tools</div><pre>revenue.sql<br/>SUM(amount) AS revenue</pre><span className="pi-chat-input">{t.prompt}<MessageSquare size={15}/></span></aside>
  </div>
 </div>;
}
const agents=[{id:'explore',icon:Search,tools:'db_tools.*, context_search_tools.*'},{id:'semantic',icon:Network,tools:'semantic_tools.*, context_search_tools.*'},{id:'gen_sql',icon:Code2,tools:'db_tools.*, context_search_tools.*'}];
function Agent({t}:{t:PreviewCopy}) {
 const [active,setActive]=usePreviewField('active');const item=agents.find(x=>x.id===active)!;
 const description=active==='explore'?t.explore:active==='semantic'?t.semantic:t.sql;
 return <><Header name="Datus Agent" t={t}/><div className="pi-agent-toolbar"><strong>{t.builder}</strong><span>agent.yml</span></div><div className="pi-agent-layout"><main className="pi-agent-canvas"><div className="pi-main-agent"><Bot size={26}/><strong>{t.main}</strong><span>{t.delegate}</span></div><svg viewBox="0 0 650 180" aria-hidden="true"><path d="M325 0 V80 H114 V180 M325 80 V180 M325 80 H536 V180"/></svg><div className="pi-subagents">{agents.map(a=><button key={a.id} aria-pressed={active===a.id} onClick={()=>setActive(a.id)}><a.icon size={23}/><strong>{a.id}</strong><span>{a.id==='explore'?t.explore:a.id==='semantic'?t.semantic:t.sql}</span></button>)}</div><p>{t.agentHint}</p><div className="pi-shared-context"><Layers3 size={18}/>{t.context}<span>tables · metrics · Reference SQL</span></div></main><aside className="pi-agent-config"><span>{t.config}</span><h4>{active}</h4><p>{description}</p><label>{t.scope}</label><div className="pi-chips"><span>commerce</span><span>orders</span><span>revenue</span></div><label>{t.tools}</label><pre>{item.tools.replace(', ','\n')}</pre><Code>{`node_class: ${active}\nscoped_context:\n  tables: [orders, customers]\n  metrics: [revenue]\nmax_turns: 30`}</Code></aside></div></>
}
function Connect({t}:{t:PreviewCopy}) {
 const [mode,setMode]=usePreviewField('mode');
 const [language,setLanguage]=usePreviewField('language');
 const [version,setVersion]=usePreviewField('version');
 return <IntegrationInterfacePreview t={t} mode={mode} setMode={setMode} language={language} setLanguage={setLanguage} version={version} setVersion={setVersion}/>;
}
function ConnectionTabs({t}:{t:PreviewCopy}) {
 const [mode,setMode]=usePreviewField('mode');
 const ids=['mcp','api','cli'];
 return <div className="pi-external-tabs" role="group" aria-label={t.connections}>{ids.map((id,i)=><button key={id} type="button" aria-pressed={mode===id} onClick={()=>setMode(id)} onKeyDown={e=>{
   const next=e.key==='ArrowRight'?(i+1)%3:e.key==='ArrowLeft'?(i+2)%3:e.key==='Home'?0:e.key==='End'?2:null;
   if(next===null)return;e.preventDefault();setMode(ids[next]);(e.currentTarget.parentElement?.children[next] as HTMLButtonElement)?.focus();
 }}>{id==='mcp'?<Plug size={16}/>:id==='api'?<Code2 size={16}/>:<Terminal size={16}/>} {id.toUpperCase()}{id==='api'&&mode==='mcp'&&<InterfaceClickHint/>}</button>)}</div>
}
function Screen({kind,t}:{kind:InterfaceKind;t:PreviewCopy}) {return kind==='dosi'?<Dosi t={t}/>:kind==='studio'?<Studio t={t}/>:kind==='agent'?<Agent t={t}/>:<Connect t={t}/>}
function ScaledScreen({kind,t,onInteract}:{kind:InterfaceKind;t:PreviewCopy;onInteract?:()=>void}) {
 const ref=useRef<HTMLDivElement>(null);const [width,setWidth]=useState(1080);
 useEffect(()=>{const el=ref.current;if(!el)return;const observer=new ResizeObserver(([entry])=>{if(entry.contentRect.width>0)setWidth(entry.contentRect.width)});observer.observe(el);return()=>observer.disconnect()},[]);
 return <div ref={ref} className="pi-viewport" onPointerDownCapture={onInteract} onKeyDownCapture={onInteract}><div className="pi-screen" style={{transform:`scale(${width/1080})`}}><Screen kind={kind} t={t}/></div></div>
}
export default function ProductInterfacePreview({kind}:{kind:InterfaceKind}) {
 const [state,setState]=useState<PreviewState>({view:'lineage',selected:'Customer',file:'business-rules.md',active:'explore',mode:'mcp',language:'curl',version:'latest',studioStep:0,studioPaused:false,dosiPaused:false});
 const t=useT(INTERFACE_PREVIEWS);const dialog=useRef<HTMLDialogElement>(null);
 const figure=useRef<HTMLElement>(null);const [visible,setVisible]=useState(false);
 useEffect(()=>{const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.15});if(figure.current)observer.observe(figure.current);return()=>observer.disconnect()},[]);
 const [reduced,setReduced]=useState(true);
 useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[]);
 useEffect(()=>{
  if(kind!=='dosi'||!visible||state.dosiPaused||reduced)return;
  const timer=window.setTimeout(()=>setState(previous=>({...previous,view:previous.view==='lineage'?'ontology':previous.view==='ontology'?'execution':'lineage'})),state.view==='lineage'?4000:state.view==='ontology'?6500:8500);
  return()=>window.clearTimeout(timer);
 },[kind,visible,state.dosiPaused,state.view,reduced]);
 const pauseDosi=useCallback(()=>{if(kind==='dosi')setState(previous=>previous.dosiPaused?previous:{...previous,dosiPaused:true})},[kind]);
 const dosiDuration=state.view==='lineage'?4000:state.view==='ontology'?6500:8500;
 return <PreviewContext.Provider value={{state,setState,dosiRunning:kind==='dosi'&&visible&&!state.dosiPaused&&!reduced,dosiDuration}}><figure ref={figure} className="pi-preview" data-kind={kind} data-preview-visible={visible}>{kind==='connect'&&<ConnectionTabs t={t}/>}<ScaledScreen kind={kind} t={t} onInteract={pauseDosi}/><figcaption className="pi-preview-actions">{kind==='dosi'&&<button type="button" onClick={()=>setState(previous=>({...previous,dosiPaused:!previous.dosiPaused}))} aria-label={state.dosiPaused?t.tourPlay:t.tourPause}>{state.dosiPaused?<Play size={14}/>:<Pause size={14}/>} {state.dosiPaused?t.tourPlay:t.tourPause}</button>}<button type="button" onClick={()=>dialog.current?.showModal()}><Maximize2 size={14}/>{t.expand}</button></figcaption><dialog ref={dialog} className="pi-dialog" aria-label={t.expand}><div className="pi-dialog-bar">{kind==='connect'?<ConnectionTabs t={t}/>:<span>{kind==='dosi'?'Datus · Northstar Living':kind==='studio'?'Datus Studio':'Datus Agent'}</span>}<button type="button" onClick={()=>dialog.current?.close()} aria-label={t.close}><X size={21}/></button></div><div className="pi-dialog-scroll"><ScaledScreen kind={kind} t={t} onInteract={pauseDosi}/></div></dialog></figure></PreviewContext.Provider>
}
