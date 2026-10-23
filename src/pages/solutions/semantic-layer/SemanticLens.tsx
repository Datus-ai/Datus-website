import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useT } from '../../../i18n/LocaleContext';
import { UI } from '../../../i18n/ui';
import { SEMANTIC_LAYER_SOLUTION } from './content';
import './semantic-lens.css';

type Point = { x: number; y: number };
type Curve = [Point, Point, Point, Point];
type Label = 'dosi' | 'ossie' | 'warehouses' | 'documents' | 'sqlEtl' | 'model' | 'ontology' | 'core' | 'execution' | 'agents' | 'applications' | 'bi';

// The SVG fallback and the animated canvas share the approved concept's geometry.
function layout(mobile: boolean) {
  const cx = mobile ? 450 : 400, cy = mobile ? 710 : 316;
  const r = mobile ? 195 : 166, core = mobile ? 118 : 67, rim = mobile ? 145 : 86;
  const labels: Record<Label, Point> = mobile ? {
    dosi: { x: cx, y: cy - r - 61 }, ossie: { x: cx, y: cy - 20 },
    warehouses: { x: 180, y: 330 }, documents: { x: 450, y: 330 }, sqlEtl: { x: 720, y: 330 },
    model: { x: 96, y: cy - 150 }, ontology: { x: 600, y: cy + 128 }, core: { x: cx, y: cy + 50 },
    execution: { x: cx, y: cy + 185 }, agents: { x: 180, y: 1050 },
    applications: { x: 450, y: 1050 }, bi: { x: 720, y: 1050 },
  } : {
    dosi: { x: cx, y: cy - r - 31 }, ossie: { x: cx, y: cy - 17 },
    warehouses: { x: 185, y: 224 }, documents: { x: 185, y: 316 }, sqlEtl: { x: 185, y: 408 },
    model: { x: cx - 142, y: cy - 107 }, ontology: { x: cx + 50, y: cy + 83 }, core: { x: cx, y: cy + 18 },
    execution: { x: cx, y: cy + 116 }, agents: { x: 620, y: 224 },
    applications: { x: 620, y: 316 }, bi: { x: 620, y: 408 },
  };
  return { cx, cy, r, core, rim, labels };
}

function curves(mobile: boolean, cx: number, cy: number): Curve[][] {
  return Array.from({ length: 11 }, (_, i) => {
    const spread = i - 5;
    if (mobile) {
      const x = cx + spread * 108;
      return [
        [{ x, y: 135 + Math.cos(i) * 23 }, { x, y: 340 }, { x: cx + spread * 10, y: cy - 250 }, { x: cx + spread * 6, y: cy - 128 }],
        [{ x: cx + spread * 6, y: cy + 128 }, { x: cx + spread * 10, y: cy + 250 }, { x, y: 1110 }, { x, y: 1320 }],
      ];
    }
    return [
      [{ x: -100, y: cy + spread * 108 + Math.sin(i * .8) * 21 }, { x: 145, y: cy + spread * 90 }, { x: cx - 160, y: cy + spread * 6 }, { x: cx - 75, y: cy + spread * 3.4 }],
      [{ x: cx + 75, y: cy + spread * 3.4 }, { x: cx + 166, y: cy + spread * 6 }, { x: 610, y: cy + spread * 65 }, { x: 1000, y: cy + spread * 70 }],
    ];
  });
}

function curvePath([a, b, c, d]: Curve) {
  return `M${a.x} ${a.y}C${b.x} ${b.y} ${c.x} ${c.y} ${d.x} ${d.y}`;
}
function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  return `M${cx + Math.cos(start) * r} ${cy + Math.sin(start) * r}A${r} ${r} 0 ${end - start > Math.PI ? 1 : 0} 1 ${cx + Math.cos(end) * r} ${cy + Math.sin(end) * r}`;
}

function StaticLens({ mobile }: { mobile: boolean }) {
  const { cx, cy, r, core, rim } = layout(mobile);
  return <svg className={`sl-lens__fallback sl-lens__fallback--${mobile ? 'mobile' : 'desktop'}`} viewBox={`0 0 900 ${mobile ? 1406.25 : 640}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
    {Array.from({ length: mobile ? 5 : 6 }, (_, i) => {
      const k = i + 1;
      return <path key={k} className="sl-lens__line" opacity={(mobile ? .66 : .62) - k * (mobile ? .09 : .07)} d={arcPath(cx, cy, r + (mobile ? 25 : 17) * k, (mobile ? -1.06 : -1.2) + k * .025, (mobile ? 1.3 : 1.34) + k * (mobile ? .02 : .018))}/>;
    })}
    {!mobile && [0, 1, 2].map(i => <path key={`sweep-${i}`} className="sl-lens__line" opacity={.3 - i * .05} d={arcPath(cx, cy, r + 150 + i * 44, -1.74 + i * .04, 1.69 - i * .03)}/>)}
    {[0,1,2].map(i=><path key={`left-${i}`} className="sl-lens__accent" opacity={.24-i*.055} d={arcPath(cx,cy,r+24+i*17,1.93+i*.035,4.37-i*.035)}/>)}
    <path className="sl-lens__accent" opacity=".6" d={`${arcPath(cx, cy, r, -1.3, 1.35)}${arcPath(cx, cy, r, 1.78, 4.42)}`}/>
    {curves(mobile, cx, cy).flatMap((pair, i) => pair.map((curve, side) => <path key={`${i}-${side}`} className={i === 3 ? 'sl-lens__accent' : 'sl-lens__line'} opacity={i === 3 ? .95 : .75} d={curvePath(curve)}/>))}
    <circle className="sl-lens__core" cx={cx} cy={cy} r={core}/>
    <path className="sl-lens__accent sl-lens__rim" d={`${arcPath(cx, cy, rim, -.6, 1.43)}${arcPath(cx, cy, rim, 2.12, 4.21)}`}/>
  </svg>;
}

export default function SemanticLens() {
  const t = useT(SEMANTIC_LAYER_SOLUTION).visual;
  const ui = useT(UI).common;
  const art = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const elapsed = useRef(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPaused(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const root = art.current, surface = canvas.current;
    const ctx = surface?.getContext('2d');
    if (!root || !surface || !ctx) return;
    let frame = 0, last = 0, active = 3, inView = true, pageVisible = !document.hidden;
    let mobile = false, w = 0, h = 0, bleed = 0, dpr = 1;
    let palette = { bg: '', line: '', brand: '' };

    function colors() {
      const style = getComputedStyle(root!);
      palette = { bg: style.getPropertyValue('--bg').trim(), line: style.getPropertyValue('--lens-line').trim(), brand: style.getPropertyValue('--brand-bright').trim() };
    }
    function stroke(path: () => void, color: string, weight = 1, alpha = 1) {
      ctx!.save(); ctx!.strokeStyle = color; ctx!.lineWidth = weight; ctx!.globalAlpha = alpha;
      ctx!.beginPath(); path(); ctx!.stroke(); ctx!.restore();
    }
    function dot(x: number, y: number, radius: number, color: string, alpha = 1) {
      ctx!.save(); ctx!.fillStyle = color; ctx!.globalAlpha = alpha;
      ctx!.beginPath(); ctx!.arc(x, y, radius, 0, Math.PI * 2); ctx!.fill(); ctx!.restore();
    }
    function draw(now: number) {
      frame = 0;
      if (!w || !h) return;
      const moving = !paused && inView && pageVisible;
      if (moving && last) elapsed.current += Math.min((now - last) / 1000, .05);
      last = moving ? now : 0;
      ctx!.setTransform(1, 0, 0, 1, 0, 0); ctx!.clearRect(0, 0, surface!.width, surface!.height);
      // Keep the compact core and labels fixed; only the flowing field extends beyond the hero.
      ctx!.setTransform(surface!.width / 900, 0, 0, mobile ? surface!.width / 900 : h * dpr / 640, 0, bleed * dpr);
      const { cx, cy, r, core, rim } = layout(mobile);
      for (let k = 1; k < (mobile ? 6 : 7); k++) {
        stroke(() => ctx!.arc(cx, cy, r + (mobile ? 25 : 17) * k, (mobile ? -1.06 : -1.2) + k * .025, (mobile ? 1.3 : 1.34) + k * (mobile ? .02 : .018)), palette.line, mobile ? 1.3 : .8, (mobile ? .66 : .62) - k * (mobile ? .09 : .07));
      }
      if (!mobile) for (let i = 0; i < 3; i++) {
        stroke(() => ctx!.arc(cx, cy, r + 150 + i * 44, -1.74 + i * .04, 1.69 - i * .03), palette.line, .8, .3 - i * .05);
      }
      for(let i=0;i<3;i++) stroke(()=>ctx!.arc(cx,cy,r+24+i*17,1.93+i*.035,4.37-i*.035),palette.brand,mobile?1.3:.8,.24-i*.055);
      stroke(() => ctx!.arc(cx, cy, r, -1.3, 1.35), palette.brand, mobile ? 1.9 : 1.25, .6);
      stroke(() => ctx!.arc(cx, cy, r, 1.78, 4.42), palette.brand, mobile ? 1.9 : 1.25, .6);
      curves(mobile, cx, cy).forEach((pair, i) => pair.forEach(([a, b, c, d], side) => {
        const on = i === active, color = on ? palette.brand : palette.line, alpha = on ? .95 : .75;
        stroke(() => { ctx!.moveTo(a.x, a.y); ctx!.bezierCurveTo(b.x, b.y, c.x, c.y, d.x, d.y); }, color, on ? 1.6 : 1, alpha);
        const t = (elapsed.current * .065 + i * .077 + side * .42) % 1, u = 1 - t;
        dot(u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * d.x, u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * d.y, mobile ? 4 : 2.5, color, alpha);
      }));
      ctx!.fillStyle = palette.bg; ctx!.beginPath(); ctx!.arc(cx, cy, core, 0, Math.PI * 2); ctx!.fill();
      stroke(() => ctx!.arc(cx, cy, core, 0, Math.PI * 2), palette.line, mobile ? 1.7 : 1, .9);
      stroke(() => ctx!.arc(cx, cy, rim, -.6, 1.43), palette.brand, mobile ? 2.7 : 2, .9);
      stroke(() => ctx!.arc(cx, cy, rim, 2.12, 4.21), palette.brand, mobile ? 2.7 : 2, .9);
      dot(cx + Math.cos(elapsed.current * .28) * rim, cy + Math.sin(elapsed.current * .28) * rim, mobile ? 5 : 3.5, palette.brand, .95);
      root!.dataset.ready = 'true';
      if (moving) frame = requestAnimationFrame(draw);
    }
    function requestDraw() { if (!frame) frame = requestAnimationFrame(draw); }
    function resize() {
      w = root!.clientWidth; h = root!.clientHeight; mobile = window.innerWidth <= 650;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      bleed = parseFloat(getComputedStyle(root!).getPropertyValue('--lens-bleed')) || 0;
      surface!.width = Math.round(w * dpr); surface!.height = Math.round((h + bleed * 2) * dpr);
      colors(); cancelAnimationFrame(frame); draw(performance.now());
    }
    function move(event: PointerEvent) {
      const bounds = root!.getBoundingClientRect();
      const position = mobile ? (event.clientX - bounds.left) / bounds.width * 900 : (event.clientY - bounds.top) / bounds.height * 640;
      active = Math.max(0, Math.min(10, Math.round((position - (mobile ? -90 : 6)) / (mobile ? 108 : 62))));
      requestDraw();
    }
    function next() { active = (active + 1) % 11; requestDraw(); }
    function visibility() { pageVisible = !document.hidden; last = 0; requestDraw(); }
    const sizeObserver = new ResizeObserver(resize);
    const viewObserver = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; last = 0; requestDraw(); }, { threshold: .05 });
    const themeObserver = new MutationObserver(() => { colors(); requestDraw(); });
    sizeObserver.observe(root); viewObserver.observe(root);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    root.addEventListener('pointermove', move); root.addEventListener('pointerdown', next);
    document.addEventListener('visibilitychange', visibility);
    resize();
    return () => {
      cancelAnimationFrame(frame); sizeObserver.disconnect(); viewObserver.disconnect(); themeObserver.disconnect();
      root.removeEventListener('pointermove', move); root.removeEventListener('pointerdown', next);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [paused]);

  const desktop = layout(false).labels, mobile = layout(true).labels;
  function position(name: Label): CSSProperties {
    return { '--lens-x': `${desktop[name].x / 9}%`, '--lens-y': `${desktop[name].y / 6.4}%`, '--lens-mobile-x': `${mobile[name].x / 9}%`, '--lens-mobile-y': `${mobile[name].y / 9}vw` } as CSSProperties;
  }
  return <div className="sl-lens">
    <figure ref={art} className="sl-lens__art" aria-labelledby="semantic-lens-description">
      <div className="sl-lens__field">
        <StaticLens mobile={false}/><StaticLens mobile/>
        <canvas ref={canvas} className="sl-lens__canvas" aria-hidden="true"/>
      </div>
      <div className="sl-lens__labels" aria-hidden="true">
        <span className="sl-lens__dosi" style={position('dosi')}>DOSI</span>
        <span className="sl-lens__ossie" style={position('ossie')}>Apache Ossie</span>
        <span className="sl-lens__source" style={position('warehouses')}>{t.warehouses}</span>
        <span className="sl-lens__source" style={position('documents')}>{t.documents}</span>
        <span className="sl-lens__source" style={position('sqlEtl')}>{t.sqlEtl}</span>
        <span className="sl-lens__model" style={position('model')}>{t.model}<em>{t.metrics}</em></span>
        <span className="sl-lens__ontology" style={position('ontology')}>{t.ontology}<em>{t.relationships}</em></span>
        <span className="sl-lens__core-label" style={position('core')}>{t.core}</span>
        <span className="sl-lens__execution" style={position('execution')}>{t.execution}</span>
        <span className="sl-lens__consumer" style={position('agents')}>{t.agents}</span>
        <span className="sl-lens__consumer" style={position('applications')}>{t.applications}</span>
        <span className="sl-lens__consumer" style={position('bi')}>{t.bi}</span>
      </div>
      <figcaption id="semantic-lens-description" className="sr-only">{t.description}</figcaption>
    </figure>
    <button className="sl-lens__motion" type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? ui.playAnimation : ui.pauseAnimation}</button>
  </div>;
}
