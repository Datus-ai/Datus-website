import { useState } from 'react';
import { ArrowRight, Bot, ChevronDown, Database, FileCode2, FileText, Folder, MessageSquare, Plus, Save, ShieldCheck, Sparkles, UploadCloud, X } from 'lucide-react';
import { useT } from '../../../i18n/LocaleContext';
import { WORKFLOW_PRODUCT_UI } from './workflowProductCopy';
import { NORTHSTAR_MODEL_EXCERPT, NORTHSTAR_SQL_EXCERPT } from './northstarSnippets';
import './source-based-workflow.css';

const files=['independent-reference.sql','schema.sql','README.txt'];

/** Layout and controls follow project/initialize/{choose-source,confirm,initialize-modal}. */
export function GatherKnowledge() {
 const t=useT(WORKFLOW_PRODUCT_UI),[confirm,setConfirm]=useState(false),[upload,setUpload]=useState(false),[checked,setChecked]=useState<string[]>(files.slice(0,2));
 return <div className="sw-init-desktop"><div className="sw-init-modal"><header><Sparkles size={22}/><div><h3>{t.initializeTitle}</h3><p>{t.initializeSubtitle}</p></div></header>
  {!confirm?<div className="sw-init-body"><div className="sw-segment"><button aria-pressed={!upload} onClick={()=>setUpload(false)}><Folder size={15}/>{t.fromWorkspace}</button><button aria-pressed={upload} onClick={()=>setUpload(true)}><UploadCloud size={15}/>{t.upload}</button></div><p className="sw-init-hint"><span>{t.selected.replace('{{n}}',String(checked.length))}</span>{t.combinedHint}</p>
   {upload?<div className="sw-drop-zone"><UploadCloud size={29}/><p>{t.dropHint}</p><small>{t.formats}</small></div>:<div className="sw-init-tree"><div><ChevronDown size={14}/><Folder size={15}/>Northstar</div>{files.map(file=><label key={file}><input type="checkbox" checked={checked.includes(file)} onChange={()=>setChecked(current=>current.includes(file)?current.filter(x=>x!==file):[...current,file])}/>{file.endsWith('.sql')?<FileCode2 size={15}/>:<FileText size={15}/>} {file}</label>)}</div>}
  </div>:<div className="sw-init-body sw-confirm"><p>{t.sourcesToAnalyze}</p><div className="sw-confirm-files"><Database size={17}/><span>Northstar</span>{checked.map(file=><span key={file}><FileCode2 size={14}/>{file}</span>)}</div><p>{t.docsToGenerate}</p><div className="sw-generated-doc"><FileText size={22}/><div><strong>AGENTS.md</strong><span>{t.agentsDesc}</span></div><i>{t.newTag}</i></div></div>}
  <footer><button className="sw-outline" onClick={()=>setConfirm(false)} disabled={!confirm}>{t.back}</button><div className="sw-init-steps"><span data-active={!confirm}>1<small>{t.stepChoose}</small></span><i/><span data-active={confirm}>2<small>{t.stepConfirm}</small></span></div>{!confirm?<button className="sw-primary" onClick={()=>setConfirm(true)}>{t.next}<ArrowRight size={14}/></button>:<button className="sw-primary" disabled><Sparkles size={14}/>{t.start}</button>}</footer>
 </div></div>;
}

/** File explorer/editor and attached-context composer follow IDE + web-common ChatInput. */
export function DraftModel() {
 const t=useT(WORKFLOW_PRODUCT_UI),[file,setFile]=useState('northstar_premier.yaml'),[attached,setAttached]=useState<string|null>('independent-reference.sql');
 return <div className="sw-author-workspace"><aside className="sw-file-tree"><p>{t.files}</p><strong><Folder size={15}/>Northstar</strong><span><FileText size={14}/>AGENTS.md</span>{['independent-reference.sql','northstar_premier.yaml'].map(name=><button key={name} aria-pressed={file===name} onClick={()=>setFile(name)}><FileCode2 size={14}/>{name}</button>)}<small>subject/semantic_models/</small></aside>
  <div className="sw-author-editor"><div className="sw-editor-tab"><FileCode2 size={14}/>{file}<span>{t.source}</span></div><div className="sw-semantic-actions"><button className="sw-outline" disabled><ShieldCheck size={12}/>{t.validate}</button><button className="sw-primary" disabled><Save size={12}/>{t.saveSync}</button></div><pre tabIndex={0} aria-label={file}>{file.endsWith('.sql')?NORTHSTAR_SQL_EXCERPT:NORTHSTAR_MODEL_EXCERPT}</pre><button className="sw-attach" onClick={()=>setAttached(file)}><Plus size={14}/>{t.addToChat}</button></div>
  <aside className="sw-author-chat"><div className="sw-chat-heading"><MessageSquare size={15}/>{t.newChat}<Plus size={14}/></div><div className="sw-chat-turn"><span><Bot size={15}/>Datus Agent</span><p>{t.draftReply}</p></div><div className="sw-chat-composer">{attached&&<span className="sw-context-chip"><FileCode2 size={12}/>{attached}<button aria-label={t.cancel} onClick={()=>setAttached(null)}><X size={11}/></button></span>}<p>{t.draftRequest}</p><div><span><Sparkles size={12}/>semantic_modeling<ChevronDown size={11}/></span><span><Database size={12}/>Northstar</span></div></div></aside>
 </div>;
}

export { default as ReviewModel } from './SemanticHubReview';
