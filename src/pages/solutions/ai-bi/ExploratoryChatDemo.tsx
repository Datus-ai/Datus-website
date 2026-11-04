import { useEffect, useRef, useState } from 'react';
import { ArrowUp, AtSign, Braces, Check, CircleHelp, Code2, Menu, Moon, Package, PanelLeftClose, Plus, RotateCcw, Sparkles, Sun } from 'lucide-react';
import { AI_BI_CONTENT } from './content';
import './exploratory-chat.css';

type Copy = (typeof AI_BI_CONTENT)['en']['scenarios'];

export default function ExploratoryChatDemo({ t, channel }: { t: Copy; channel: number }) {
  const frame = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [replay, setReplay] = useState(0);
  const [stage, setStage] = useState(3);
  const [typed, setTyped] = useState('');
  const [animating, setAnimating] = useState(false);
  const prompt = t.explore.prompt;
  const brand = t.channels[channel];

  useEffect(() => {
    if (!frame.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: .25 });
    observer.observe(frame.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) { setStage(3); setTyped(prompt); setAnimating(false); return; }
    setStage(0);
    setTyped('');
    setAnimating(true);
    let count = 0;
    const timers: number[] = [];
    const type = window.setInterval(() => {
      count = Math.min(count + 2, prompt.length);
      setTyped(prompt.slice(0, count));
      if (count >= prompt.length) {
        window.clearInterval(type);
        timers.push(window.setTimeout(() => setStage(1), 330));
        timers.push(window.setTimeout(() => setStage(2), 1150));
        timers.push(window.setTimeout(() => { setStage(3); setAnimating(false); }, 2500));
      }
    }, 35);
    return () => { window.clearInterval(type); timers.forEach(window.clearTimeout); };
  }, [channel, prompt, replay, visible]);

  return <div className={`ai-bi-chat ai-bi-chat--${['datus', 'chatgpt', 'claude'][channel]}`} ref={frame} data-stage={stage}>
    <div className="ai-bi-chat__shell">
      {channel === 0 && <div className="ai-bi-chat__appbar" aria-hidden="true"><div className="ai-bi-chat__appbar-logo"><img className="ai-bi-chat__logo-light" src="/logo_light.svg" alt=""/><img className="ai-bi-chat__logo-dark" src="/logo_dark.svg" alt=""/></div><div className="ai-bi-chat__appbar-actions"><span><Code2 size={13}/>{t.chat.apiIntegration}</span><span><Package size={13}/>{t.chat.published}</span><span className="ai-bi-chat__appbar-theme"><Sun size={12}/><Moon size={12}/></span><span className="ai-bi-chat__avatar">J</span></div></div>}
      <aside className="ai-bi-chat__sidebar" aria-hidden="true">
        {channel !== 0 && <div className="ai-bi-chat__identity"><img src={channel === 1 ? '/integrations/logos/openai.svg' : '/integrations/logos/claude.svg'} alt=""/><strong>{brand}</strong></div>}
        <div className="ai-bi-chat__new"><Plus size={14}/>{t.chat.newChat}</div>
        {channel === 0 && stage === 0 ? <div className="ai-bi-chat__empty-sessions">{t.chat.noSessions}</div> : <><small>{t.chat.recents}</small><div className="ai-bi-chat__recent">{t.chat.recentTitle}</div></>}
        {channel === 0 && <div className="ai-bi-chat__sidebar-bottom"><span><Sun size={12}/><Moon size={12}/></span><span>EN</span><PanelLeftClose size={14}/></div>}
      </aside>
      <div className="ai-bi-chat__main">
        <div className="ai-bi-chat__topbar"><span><Menu size={15}/><strong>{brand}</strong></span><small>{channel === 0 ? t.chat.subagent : channel === 1 ? t.chat.chatgptModel : t.chat.claudeModel}</small></div>
        <div className="ai-bi-chat__conversation" aria-live="off">
          {stage === 0 && <div className="ai-bi-chat__welcome">
            <div className="ai-bi-chat__orb" aria-hidden="true">{channel === 0 ? <img src="/product/ai-bi-chat/orb.png" alt=""/> : channel === 1 ? '◎' : '✳'}</div>
            <h4>{channel === 0 ? t.chat.datusGreeting : channel === 1 ? t.chat.chatgptGreeting : t.chat.claudeGreeting}</h4>
            <div className="ai-bi-chat__suggestions"><span>{t.chat.tryAsking}</span><div>{t.chat.suggestions.map(question => <span key={question}><Sparkles size={13}/>{question}</span>)}</div></div>
          </div>}
          {stage >= 1 && <div className="ai-bi-chat__thread">
            <div className="ai-bi-chat__message ai-bi-chat__message--user"><span>{t.you}</span><p>{prompt}</p></div>
            {stage >= 2 && <div className="ai-bi-chat__work">{stage === 2 ? <span className="ai-bi-chat__pulse"/> : <Check size={13}/>}<strong>{brand}</strong><span>{stage === 2 ? (channel === 0 ? t.chat.datusQuery : t.chat.externalQuery) : t.chat.queryComplete}</span></div>}
            {stage >= 3 && <div className="ai-bi-chat__message ai-bi-chat__message--answer"><div className="ai-bi-chat__assistant"><span>{channel === 0 ? '◕' : channel === 1 ? '◎' : '✳'}</span><strong>{brand}</strong></div><p>{t.explore.answer}</p><div className="ai-bi-chat__evidence"><span><Check size={13}/>{t.chat.ruleChecked}</span><span><Braces size={13}/>{t.chat.sqlChecked}</span><span>{t.chat.sourceChecked}</span></div><small>{t.explore.evidence}</small></div>}
          </div>}
        </div>
        <div className="ai-bi-chat__bottom">
          <div className="ai-bi-chat__composer">{channel === 0 && <div className="ai-bi-chat__composer-top"><span><AtSign size={12}/></span><span><Plus size={12}/></span></div>}<div className="ai-bi-chat__composer-text">{stage === 0 ? <>{typed}<span className="ai-bi-chat__caret"/></> : t.chat.followUp}</div><div className="ai-bi-chat__composer-tools"><span className="ai-bi-chat__context">{channel === 0 ? t.chat.access : <><Plus size={13}/>{t.chat.attach}</>}</span><span>{channel === 0 ? t.chat.modelLabel : channel === 1 ? t.chat.chatgptModel : t.chat.claudeModel}<CircleHelp size={12}/></span><span className="ai-bi-chat__send"><ArrowUp size={13}/></span></div></div>
          <button type="button" className="ai-bi-chat__replay" onClick={() => setReplay(value => value + 1)} disabled={animating} aria-label={t.chat.replay}><RotateCcw size={13}/>{t.chat.replay}</button>
        </div>
      </div>
    </div>
    <p className="ai-bi-chat__disclosure">{channel === 0 ? t.localNote : t.externalNote}</p>
  </div>;
}
