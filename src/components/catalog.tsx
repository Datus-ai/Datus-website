import type { ReactNode } from "react";

/**
 * Shared presentation primitives for the Integrations / Databases / Models
 * catalog pages. Styled entirely with the existing site.css design tokens
 * (dark navy theme) so these pages reuse the site's look instead of pulling in
 * a second component library. Layout & content are ported from datus-design.
 */

// Section accent tones, cycled the way the design template cycles its markers.
export const TONES = ["var(--term-cyan)", "var(--term-amber)", "var(--term-green)", "var(--term-pink)"];
export const toneAt = (i: number) => TONES[i % TONES.length];

export const panelBg = "rgba(11,18,48,0.4)";
export const sectionBorder = "1px solid var(--line)";

export function Mark({ tone, children }: { tone: string; children: ReactNode }) {
  return <span style={{ color: tone }}>{children}</span>;
}

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.85em",
        padding: "2px 6px",
        borderRadius: 6,
        background: "rgba(124,137,196,0.12)",
        border: "1px solid var(--line)",
        color: "var(--ink-dim)",
        overflowWrap: "anywhere",
      }}
    >
      {children}
    </code>
  );
}

/** A macOS-style window bar (traffic dots + filename + right-aligned meta). */
function WindowBar({ filename, meta }: { filename?: string; meta?: string }) {
  return (
    <div className="term__bar">
      <span className="term__dot term__dot--r" />
      <span className="term__dot term__dot--y" />
      <span className="term__dot term__dot--g" />
      {filename && <span className="term__title">{filename}</span>}
      {meta && (
        <span className="term__title" style={{ marginLeft: "auto" }}>
          {meta}
        </span>
      )}
    </div>
  );
}

export function CodeBlock({ filename, lang, code }: { filename?: string; lang?: string; code: string }) {
  return (
    <div className="term">
      <WindowBar filename={filename} meta={lang} />
      <div className="term__body" style={{ paddingBlock: 16 }}>
        <pre
          style={{
            margin: 0,
            whiteSpace: "pre",
            overflowX: "auto",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            lineHeight: 1.7,
            color: "var(--ink-dim)",
          }}
        >
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

export type SpecRow = { label: string; value: ReactNode; mono?: boolean };

export function SpecCard({
  name,
  tone,
  badge,
  rows,
}: {
  name: ReactNode;
  tone: string;
  badge?: ReactNode;
  rows: SpecRow[];
}) {
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", padding: 22 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 16 }}>
        <div style={{ height: 6, width: 40, borderRadius: 3, background: tone }} />
        {badge && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: tone,
            }}
          >
            {badge}
          </span>
        )}
      </div>
      <h3 style={{ margin: "16px 0 0", fontSize: 16.5, fontWeight: 650, letterSpacing: "-0.01em" }}>
        {name}
      </h3>
      <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
        {rows.map((r) => (
          <div key={r.label} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--ink-faint)",
                width: 68,
                flexShrink: 0,
                paddingTop: 3,
              }}
            >
              {r.label}
            </span>
            {r.mono !== false && typeof r.value === "string" ? (
              <InlineCode>{r.value}</InlineCode>
            ) : (
              <span style={{ fontSize: 13, color: "var(--ink-muted)", lineHeight: 1.5 }}>{r.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FeatureCard({ tone, title, body }: { tone: string; title: string; body: ReactNode }) {
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ height: 6, width: 40, borderRadius: 3, background: tone, marginBottom: 16 }} />
      <h3 className="card__title">{title}</h3>
      <div className="card__body">{body}</div>
    </div>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: ReactNode;
  lead: string;
}) {
  return (
    <div className="section-head" style={{ marginBottom: 28 }}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="h2" style={{ fontSize: "clamp(24px,3vw,34px)" }}>
        {title}
      </h2>
      <p className="lead" style={{ marginTop: 10, maxWidth: 720 }}>
        {lead}
      </p>
    </div>
  );
}

/** A full-bleed section with the shared container + optional alternate panel bg. */
export function CatalogSection({ alt, children }: { alt?: boolean; children: ReactNode }) {
  return (
    <section
      className="section"
      style={{
        paddingBlock: "clamp(48px,6vw,84px)",
        ...(alt ? { background: panelBg, borderBlock: sectionBorder } : {}),
      }}
    >
      <div className="container">{children}</div>
    </section>
  );
}

export type SpecTableColumn = { label: string };
export type SpecTableRow = { key: string; cells: ReactNode[] };

/** Dense spec table rendered inside a window frame (design's SpecTable). */
export function SpecTable({
  filename,
  lang = "yaml",
  columns,
  rows,
}: {
  filename: string;
  lang?: string;
  columns: SpecTableColumn[];
  rows: SpecTableRow[];
}) {
  return (
    <div className="term">
      <WindowBar filename={filename} meta={lang} />
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: 640 }}>
          <thead>
            <tr style={{ borderBottom: sectionBorder }}>
              {columns.map((c) => (
                <th
                  key={c.label}
                  style={{
                    padding: "14px 20px",
                    fontFamily: "var(--font-mono)",
                    fontSize: 10.5,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--ink-faint)",
                    fontWeight: 500,
                  }}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={r.key} style={{ borderBottom: ri < rows.length - 1 ? sectionBorder : undefined }}>
                {r.cells.map((cell, ci) => (
                  <td key={ci} style={{ padding: "14px 20px", fontSize: 13, color: "var(--ink-dim)" }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Small pill/tag row used in the design's "sticker-card" split sections. */
export function TagRow({ tags }: { tags: string[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {tags.map((tag) => (
        <span
          key={tag}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: "5px 10px",
            borderRadius: 999,
            border: sectionBorder,
            color: "var(--ink-dim)",
            background: "rgba(124,137,196,0.08)",
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
