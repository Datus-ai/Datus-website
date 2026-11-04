import { useEffect, useRef } from 'react';
import { AI_BI_CONTENT } from './content';

type DemoCopy = (typeof AI_BI_CONTENT)['en']['demo'];

export default function HeroVideo({ copy }: { copy: DemoCopy }) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = video.current;
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        void element.play().catch(() => {});
        observer.disconnect();
      }
    }, { threshold: 0.25 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <figure className="ai-bi-demo" aria-label={copy.label}>
    <div className="ai-bi-demo__video-wrap">
      <video ref={video} controls muted playsInline preload="none"
        poster="/product/ai-bi-hero/datus-dosi-flash-poster.jpg" width="1280" height="720"
        aria-label={copy.label}>
        <source src="/product/ai-bi-hero/datus-dosi-flash-web.mp4" type="video/mp4"/>
        {copy.fallback}
      </video>
      <span className="ai-bi-demo__badge">{copy.label}</span>
    </div>
  </figure>;
}
