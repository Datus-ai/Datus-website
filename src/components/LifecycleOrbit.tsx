/**
 * The eight data-engineering lifecycle phases arranged around a central
 * `datus.agent` badge, with a cyan tick that continuously travels the guide
 * ring to signal the always-on loop. Ported from the datus-design homepage,
 * restyled with the site.css dark-navy tokens. Degrades to a 2-column grid on
 * narrow screens (see `.lifecycle-*` rules in site.css).
 */

const PHASES = [
  "SQL Dev",
  "Data Quality",
  "Metric Mgmt",
  "Modeling",
  "SQL Review",
  "Deploy",
  "Monitor",
  "Docs",
];

const chipStyle: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid var(--line-strong)",
  background: "var(--panel-solid)",
  boxShadow: "2px 2px 0 0 var(--line)",
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--ink-dim)",
  whiteSpace: "nowrap",
};

export function LifecycleOrbit() {
  const size = 360;
  const cx = size / 2;
  const cy = size / 2;
  const r = 138;

  return (
    <div>
      {/* Desktop / tablet: circular orbit */}
      <div
        className="lifecycle-orbit"
        style={{ position: "relative", width: size, height: size, margin: "0 auto", maxWidth: "100%" }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ position: "absolute", inset: 0 }}
          aria-hidden
        >
          {/* Dashed guide ring */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="var(--line-strong)"
            strokeWidth="1"
            strokeDasharray="3 6"
          />
          {/* Cyan tick travelling the ring */}
          <g className="cap-orbit-rotate" style={{ transformOrigin: `${cx}px ${cy}px` }}>
            <circle
              cx={cx + r}
              cy={cy}
              r="5"
              fill="var(--term-cyan)"
              stroke="var(--panel-solid)"
              strokeWidth="1.5"
            />
          </g>
        </svg>

        {/* Center badge */}
        <div
          style={{
            position: "absolute",
            left: cx,
            top: cy,
            transform: "translate(-50%,-50%)",
            borderRadius: 999,
            border: "1px solid var(--line-strong)",
            background: "var(--panel-solid)",
            boxShadow: "3px 3px 0 0 var(--line)",
            padding: "12px 20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--ink-faint)",
            }}
          >
            agent
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--ink)" }}>
            datus
          </div>
        </div>

        {/* Phase chips positioned on the orbit */}
        {PHASES.map((p, i) => {
          const angle = (i / PHASES.length) * Math.PI * 2 - Math.PI / 2;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          return (
            <div
              key={p}
              style={{ ...chipStyle, position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)" }}
            >
              <span style={{ color: "var(--ink-faint)", marginRight: 6 }}>{String(i + 1).padStart(2, "0")}</span>
              {p}
            </div>
          );
        })}
      </div>

      {/* Mobile fallback: 2-column grid */}
      <ol
        className="lifecycle-list"
        style={{ listStyle: "none", margin: 0, padding: 0, display: "none", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}
      >
        {PHASES.map((p, i) => (
          <li key={p} style={{ ...chipStyle, boxShadow: "none" }}>
            <span style={{ color: "var(--ink-faint)", marginRight: 6 }}>{String(i + 1).padStart(2, "0")}</span>
            {p}
          </li>
        ))}
      </ol>
    </div>
  );
}
