import { useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { AI_BI_CONTENT } from './content';

type DemoCopy = (typeof AI_BI_CONTENT)['en']['demo'];

export default function HeroVideo({ copy }: { copy: DemoCopy }) {
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const start = () => {
    const element = video.current;
    if (!element) return;
    void element.play().then(() => setStarted(true)).catch(() => setStarted(true));
  };

  return <figure className="ai-bi-demo" aria-label={copy.label}>
    <div className="ai-bi-demo__video-wrap">
      <video ref={video} controls={started} playsInline preload="none"
        poster="/product/ai-bi-hero/datus-dosi-flash-poster.jpg" width="1280" height="720"
        aria-label={copy.label} onPlay={() => setStarted(true)}>
        <source src="/product/ai-bi-hero/datus-dosi-flash-web.mp4" type="video/mp4"/>
        {copy.fallback}
      </video>
      <span className="ai-bi-demo__badge">{copy.label}</span>
      {!started && <button className="ai-bi-demo__control" type="button" onClick={start}>
        <Play size={17} fill="currentColor" aria-hidden="true"/>{copy.play}
      </button>}
    </div>
    <figcaption>{copy.note}</figcaption>
  </figure>;
}
