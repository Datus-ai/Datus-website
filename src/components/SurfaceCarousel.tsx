import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Horizontal "surfaces" marquee used on the homepage. Auto-advances through the
 * slides; the first genuine user interaction (arrow, dot, swipe or wheel) stops
 * the autoplay for good. Ported from the datus-design homepage carousel and
 * restyled with the site.css dark-navy tokens. All slides live in the DOM so
 * every surface's copy is present for crawlers (first-paint SSR).
 */

export type Surface = {
  id: string;
  name: string;
  tagline: string;
  start: string;
  href: string;
  external?: boolean;
};

const mono = "var(--font-mono)";

/* -------------------------------- mocks --------------------------------- */

function MockWindow({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="term" style={{ margin: 0, fontSize: 11 }}>
      <div className="term__bar">
        <span className="term__dot term__dot--r" />
        <span className="term__dot term__dot--y" />
        <span className="term__dot term__dot--g" />
        <span className="term__title" style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

const label: React.CSSProperties = {
  fontFamily: mono,
  fontSize: 9,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "var(--ink-faint)",
};

function Dot({ color }: { color: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        height: 6,
        width: 6,
        borderRadius: 999,
        background: color,
        flexShrink: 0,
      }}
    />
  );
}

function StudioMock() {
  const rows = [
    { r: "NA", v: "$482K", w: "88%" },
    { r: "EU", v: "$317K", w: "58%" },
    { r: "APAC", v: "$184K", w: "34%" },
    { r: "LATAM", v: "$96K", w: "18%" },
  ];
  return (
    <MockWindow title="studio.datus.ai">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", fontFamily: mono }}>
        <div style={{ padding: 16, display: "grid", gap: 12, background: "rgba(11,18,48,0.45)", borderRight: "1px solid var(--line)" }}>
          <div style={label}>chat</div>
          <div style={{ borderRadius: 8, border: "1px solid var(--line)", background: "var(--panel)", padding: "8px 10px" }}>
            <div style={label}>you</div>
            <div style={{ marginTop: 2, color: "var(--ink-dim)" }}>top 10 regions by MRR this quarter</div>
          </div>
          <div style={{ borderRadius: 8, border: "1px solid var(--line)", background: "color-mix(in oklab, var(--term-green) 20%, var(--panel))", padding: "8px 10px" }}>
            <div style={label}>datus</div>
            <div style={{ marginTop: 2, color: "var(--ink-dim)" }}>here you go 👇</div>
          </div>
        </div>
        <div style={{ padding: 16, display: "grid", gap: 8 }}>
          <div style={label}>sql</div>
          <pre style={{ margin: 0, fontSize: 10.5, lineHeight: 1.7, color: "var(--ink-dim)", whiteSpace: "pre" }}>{`SELECT region,
  SUM(mrr) AS revenue
FROM subscriptions
GROUP BY 1
ORDER BY revenue DESC;`}</pre>
        </div>
      </div>
      <div style={{ borderTop: "1px solid var(--line)", padding: 16, fontFamily: mono, fontSize: 10.5 }}>
        <div style={{ ...label, marginBottom: 10 }}>results · 4 rows · 128ms</div>
        <div style={{ display: "grid", gap: 8 }}>
          {rows.map((row) => (
            <div key={row.r} style={{ display: "grid", gridTemplateColumns: "60px 70px 1fr", alignItems: "center", gap: 12 }}>
              <span style={{ color: "var(--ink-muted)" }}>{row.r}</span>
              <span style={{ color: "var(--ink)" }}>{row.v}</span>
              <span style={{ height: 8, borderRadius: 3, background: "color-mix(in oklab, var(--term-cyan) 65%, transparent)", width: row.w }} />
            </div>
          ))}
        </div>
      </div>
    </MockWindow>
  );
}

function CliMock() {
  return (
    <MockWindow title="~ / datus">
      <div style={{ padding: 16, fontFamily: mono, fontSize: 11, lineHeight: 1.7, display: "grid", gap: 6 }}>
        <div><span style={{ color: "var(--ink-faint)" }}>$</span> pip install datus-agent</div>
        <div style={{ color: "var(--ink-muted)", paddingLeft: 12 }}>✓ installed datus-agent 0.3.5</div>
        <div style={{ paddingTop: 4 }}><span style={{ color: "var(--ink-faint)" }}>$</span> datus</div>
        <div style={{ paddingLeft: 12, display: "flex", alignItems: "center", gap: 8 }}><Dot color="var(--term-green)" /> connected snowflake · dbt · datahub</div>
        <div style={{ paddingLeft: 12, display: "flex", alignItems: "center", gap: 8 }}><Dot color="var(--term-cyan)" /> 1,284 tables loaded into context</div>
        <div style={{ paddingTop: 6 }}>
          <span style={{ color: "var(--term-amber)" }}>datus{">"}</span> monthly active users, last 6 months
        </div>
        <pre style={{ margin: "2px 0 0", paddingLeft: 12, fontSize: 10.5, lineHeight: 1.6, color: "var(--ink-dim)", whiteSpace: "pre" }}>{`▸ SELECT date_trunc('month', event_at) AS m,
         COUNT(DISTINCT user_id) AS mau
  FROM events GROUP BY 1 ORDER BY 1;`}</pre>
        <div style={{ paddingTop: 4, color: "var(--ink-muted)" }}>✓ 6 rows · 42ms</div>
        <div style={{ paddingLeft: 12, display: "grid", gap: 2, fontSize: 10.5 }}>
          <div>2025-08&nbsp;&nbsp;&nbsp;28,412</div>
          <div>2025-09&nbsp;&nbsp;&nbsp;31,207&nbsp;&nbsp;&nbsp;<span style={{ color: "var(--term-green)" }}>↑ 10%</span></div>
          <div>2025-12&nbsp;&nbsp;&nbsp;34,588&nbsp;&nbsp;&nbsp;<span style={{ color: "var(--term-green)" }}>↑ 11%</span></div>
          <div>2026-01&nbsp;&nbsp;&nbsp;38,904&nbsp;&nbsp;&nbsp;<span style={{ color: "var(--term-green)" }}>↑ 24%</span></div>
        </div>
      </div>
    </MockWindow>
  );
}

function Avatar({ letter, tone }: { letter: string; tone: string }) {
  return (
    <div
      style={{
        height: 24,
        width: 24,
        borderRadius: 7,
        border: "1px solid var(--line-strong)",
        background: `color-mix(in oklab, ${tone} 45%, var(--panel))`,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 10,
        fontWeight: 700,
        color: "var(--ink)",
      }}
    >
      {letter}
    </div>
  );
}

function ChatbotMock() {
  const bars = [20, 32, 44, 58, 78, 92, 66];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <MockWindow title="#growth · slack">
      <div style={{ padding: 16, fontFamily: mono, fontSize: 11, display: "grid", gap: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <Avatar letter="A" tone="var(--term-cyan)" />
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontWeight: 700, color: "var(--ink)" }}>aria</span>
              <span style={{ fontSize: 9, color: "var(--ink-faint)" }}>9:41</span>
            </div>
            <div style={{ color: "var(--ink-dim)" }}>@datus what changed in signups this week?</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Avatar letter="D" tone="var(--term-amber)" />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontWeight: 700, color: "var(--ink)" }}>datus</span>
              <span style={{ fontSize: 8, padding: "0 4px", border: "1px solid var(--line-strong)", color: "var(--ink-faint)", letterSpacing: "0.14em" }}>APP</span>
              <span style={{ fontSize: 9, color: "var(--ink-faint)" }}>9:41</span>
            </div>
            <div style={{ color: "var(--ink-dim)" }}>
              signups this week: <span style={{ fontWeight: 700, color: "var(--ink)" }}>2,914</span> <span style={{ color: "var(--term-green)" }}>(+18% wow)</span>
            </div>
            <div style={{ marginTop: 8, borderRadius: 8, border: "1px solid var(--line)", background: "var(--panel)", padding: 12 }}>
              <div style={{ ...label, marginBottom: 8 }}>daily signups</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 56 }}>
                {bars.map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, border: "1px solid var(--line-strong)", background: "color-mix(in oklab, var(--term-cyan) 55%, transparent)" }} />
                ))}
              </div>
              <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between", fontSize: 8.5, color: "var(--ink-faint)" }}>
                {days.map((d) => <span key={d}>{d}</span>)}
              </div>
            </div>
            <div style={{ marginTop: 8, color: "var(--ink-muted)", fontSize: 10.5 }}>
              ↑ mostly driven by <span style={{ textDecoration: "underline dotted" }}>google / cpc</span>
            </div>
            <span style={{ marginTop: 8, display: "inline-block", fontSize: 10, padding: "4px 8px", borderRadius: 6, border: "1px solid var(--line-strong)", background: "var(--panel)", color: "var(--ink-dim)" }}>
              open in studio ↗
            </span>
          </div>
        </div>
      </div>
    </MockWindow>
  );
}

function McpMock() {
  return (
    <MockWindow title="claude · mcp">
      <div style={{ padding: 16, fontFamily: mono, fontSize: 11, display: "grid", gap: 12 }}>
        <div style={{ borderRadius: 8, border: "1px solid var(--line)", background: "var(--panel)", padding: 12 }}>
          <div style={{ ...label, marginBottom: 8 }}>mcp servers</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Dot color="var(--term-green)" />
              <span style={{ fontWeight: 700, color: "var(--ink)" }}>datus</span>
              <span style={{ color: "var(--ink-muted)" }}>connected</span>
            </div>
            <span style={{ fontSize: 10, color: "var(--ink-muted)" }}>tools 6 · resources 1,284</span>
          </div>
        </div>
        <div style={{ color: "var(--ink-dim)" }}>
          <span style={{ color: "var(--ink-faint)" }}>{">"}</span> summarize the orders table
        </div>
        <div style={{ borderRadius: 8, border: "1px solid var(--line)", background: "color-mix(in oklab, var(--term-amber) 12%, var(--panel))", padding: 12, display: "grid", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--ink-muted)" }}>
            <Dot color="var(--term-amber)" /> datus.get_schema (orders)
          </div>
          <pre style={{ margin: 0, paddingLeft: 16, fontSize: 10.5, lineHeight: 1.7, color: "var(--ink-dim)", whiteSpace: "pre" }}>{`id           uuid          pk
user_id      uuid          fk → users
amount       numeric(10,2)
status       text
created_at   timestamptz`}</pre>
          <div style={{ paddingLeft: 16, color: "var(--ink-muted)", fontSize: 10.5 }}>1.2M rows · fresh 4m ago</div>
        </div>
        <div style={{ color: "var(--ink-dim)", lineHeight: 1.6 }}>
          the <span style={{ fontWeight: 700, color: "var(--ink)" }}>orders</span> table tracks purchases per user, ~1.2M rows, updated every few minutes from the ingestion pipeline.
        </div>
      </div>
    </MockWindow>
  );
}

function SurfaceMock({ id }: { id: string }) {
  switch (id) {
    case "studio": return <StudioMock />;
    case "cli": return <CliMock />;
    case "chatbot": return <ChatbotMock />;
    case "mcp": return <McpMock />;
    default: return null;
  }
}

/* ------------------------------ carousel -------------------------------- */

const AUTOPLAY_MS = 4500;

export function SurfaceCarousel({ items }: { items: Surface[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const rafRef = useRef<number | null>(null);

  // Keep the active-index (dots) in sync with the scroll position.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const w = el.clientWidth;
        if (w > 0) setActive(Math.round(el.scrollLeft / w));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Any genuine user input on the track stops autoplay permanently.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const stop = () => setPaused(true);
    el.addEventListener("pointerdown", stop);
    el.addEventListener("wheel", stop, { passive: true });
    el.addEventListener("touchstart", stop, { passive: true });
    return () => {
      el.removeEventListener("pointerdown", stop);
      el.removeEventListener("wheel", stop);
      el.removeEventListener("touchstart", stop);
    };
  }, []);

  // Autoplay: advance one slide until the user takes over.
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      const el = scrollerRef.current;
      if (!el) return;
      const w = el.clientWidth;
      if (w <= 0) return;
      const cur = Math.round(el.scrollLeft / w);
      const next = (cur + 1) % items.length;
      el.scrollTo({ left: next * w, behavior: "smooth" });
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, items.length]);

  const goTo = (i: number) => {
    setPaused(true);
    const el = scrollerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(items.length - 1, i));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div style={{ position: "relative", marginTop: 8 }}>
      <div
        ref={scrollerRef}
        className="surface-scroller"
        style={{
          display: "flex",
          overflowX: "auto",
          overflowY: "hidden",
          scrollSnapType: "x mandatory",
          borderRadius: 18,
          border: "1px solid var(--line)",
          background: "var(--panel)",
          scrollbarWidth: "none",
        }}
      >
        {items.map((s, i) => (
          <article
            key={s.id}
            style={{ flex: "0 0 100%", width: "100%", scrollSnapAlign: "center" }}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${items.length}: ${s.name}`}
          >
            <div className="surface-slide" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "stretch" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "clamp(24px,3vw,44px)",
                  background: "rgba(11,18,48,0.5)",
                  borderRight: "1px solid var(--line)",
                }}
              >
                <p style={{ margin: 0, fontFamily: mono, fontSize: 11, letterSpacing: "0.2em", color: "var(--ink-faint)" }}>
                  {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </p>
                <h3 style={{ margin: "14px 0 0", fontSize: "clamp(24px,2.4vw,32px)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--ink)" }}>
                  {s.name}
                </h3>
                <p style={{ margin: "12px 0 0", fontSize: 15, lineHeight: 1.65, color: "var(--ink-muted)", maxWidth: 460 }}>
                  {s.tagline}
                </p>
                <p style={{ margin: "20px 0 0", fontFamily: mono, fontSize: 12.5, color: "var(--ink-dim)" }}>
                  <span style={{ color: "var(--ink-faint)" }}>▸</span> {s.start}
                </p>
                <div style={{ marginTop: 22 }}>
                  <a
                    className="link-arrow"
                    href={s.href}
                    target={s.external ? "_blank" : undefined}
                    rel={s.external ? "noopener noreferrer" : undefined}
                  >
                    Explore {s.name} <ChevronRight size={15} />
                  </a>
                </div>
              </div>
              <div style={{ padding: "clamp(20px,2.4vw,36px)", display: "flex", flexDirection: "column", justifyContent: "center", background: "var(--bg, transparent)" }}>
                <SurfaceMock id={s.id} />
              </div>
            </div>
          </article>
        ))}
      </div>

      <button
        type="button"
        onClick={() => goTo(active - 1)}
        disabled={active === 0}
        aria-label="Previous surface"
        className="surface-arrow"
        style={{ left: 12 }}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={() => goTo(active + 1)}
        disabled={active === items.length - 1}
        aria-label="Next surface"
        className="surface-arrow"
        style={{ right: 12 }}
      >
        <ChevronRight size={20} />
      </button>

      <div style={{ marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        {items.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === active}
            style={{
              height: 8,
              width: i === active ? 32 : 8,
              borderRadius: 999,
              border: 0,
              padding: 0,
              cursor: "pointer",
              transition: "width 0.25s ease, background 0.25s ease",
              background: i === active ? "var(--term-cyan)" : "var(--line-strong)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
