import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { AI_BI_CONTENT } from './content';

type DemoCopy = (typeof AI_BI_CONTENT)['en']['demo'];
const SEGMENT_SECONDS = 3;

export default function HeroMontage({ copy }: { copy: DemoCopy }) {
  const video = useRef<HTMLVideoElement>(null);
  const pausedByUser = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const sync = () => {
      if (!visible || motion.matches || pausedByUser.current) element.pause();
      else void element.play().catch(() => setPlaying(false));
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: .15 });
    observer.observe(element);
    motion.addEventListener('change', sync);
    return () => { observer.disconnect(); motion.removeEventListener('change', sync); element.pause(); };
  }, []);

  const toggle = () => {
    const element = video.current;
    if (!element) return;
    pausedByUser.current = !element.paused;
    if (element.paused) void element.play().catch(() => setPlaying(false));
    else element.pause();
  };

  return <figure className="ai-bi-demo" aria-label={copy.label}>
    <div className="ai-bi-demo__video-wrap">
      <video ref={video} muted loop playsInline preload="metadata"
        poster="/product/ai-bi-hero/ai-bi-announcement-poster.jpg" width="1280" height="720"
        aria-hidden="true" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onTimeUpdate={event => setActive(Math.min(copy.stages.length - 1, Math.floor(event.currentTarget.currentTime / SEGMENT_SECONDS)))}>
        <source src="/product/ai-bi-hero/ai-bi-announcement-montage.mp4" type="video/mp4"/>
        {copy.fallback}
      </video>
      <span className="ai-bi-demo__badge">{copy.label}</span>
      <button className="ai-bi-demo__control" type="button" onClick={toggle} aria-label={playing ? copy.pause : copy.play}>
        {playing ? <Pause size={17} fill="currentColor"/> : <Play size={17} fill="currentColor"/>}
      </button>
    </div>
    <div className="ai-bi-demo__stages" aria-hidden="true">{copy.stages.map((stage, index) => <span key={stage} data-active={index === active}>{stage}</span>)}</div>
    <figcaption>{copy.note}</figcaption>
  </figure>;
}
