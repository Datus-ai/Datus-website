import { useMemo, useState } from "react";
import { Copy, Download, RotateCcw, Sparkles } from "lucide-react";

import { OSI_SCHEMA_VERSION } from "../../lib/osi/schema";
import { convertMetricflowYaml } from "../../lib/osi/metricflow-to-osi";
import { validateAsOsi } from "../../lib/osi/validate";
import { diffLines } from "../../lib/osi/diff";
import { SAMPLE_METRICFLOW, SAMPLE_METRICFLOW_INVALID } from "../../lib/osi/samples";

const MAX_INPUT_BYTES = 200 * 1024; // 200KB — protect the main thread

type Tab = "validator" | "converter" | "diff";

function TrafficDots() {
  return (
    <>
      <span className="term__dot term__dot--r" />
      <span className="term__dot term__dot--y" />
      <span className="term__dot term__dot--g" />
    </>
  );
}

const TONE: Record<"sage" | "amber" | "pink", string> = {
  sage: "var(--term-green)",
  amber: "var(--term-amber)",
  pink: "var(--term-pink)",
};

function StatusBadge({ tone, children }: { tone: keyof typeof TONE; children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        borderRadius: 6,
        border: `1px solid ${TONE[tone]}`,
        padding: "3px 9px",
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: TONE[tone],
        background: `color-mix(in oklab, ${TONE[tone]} 14%, transparent)`,
      }}
    >
      {children}
    </span>
  );
}

function DroppedList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div
      style={{
        marginBottom: 12,
        borderRadius: 8,
        border: "1px solid var(--line)",
        background: "color-mix(in oklab, var(--term-amber) 10%, transparent)",
        padding: "8px 12px",
        fontSize: 12,
        color: "var(--ink-dim)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: "var(--ink-faint)",
        }}
      >
        Dropped fields:
      </span>{" "}
      {items.join(", ")}
    </div>
  );
}

function download(name: string, contents: string) {
  const blob = new Blob([contents], { type: "text/yaml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

const barTitleStyle: React.CSSProperties = {
  marginLeft: "auto",
  fontSize: 12.5,
  color: "var(--ink-faint)",
};

export function OsiPlayground() {
  const [input, setInput] = useState(SAMPLE_METRICFLOW);
  const [tab, setTab] = useState<Tab>("converter");
  const [copied, setCopied] = useState(false);

  const oversize = input.length > MAX_INPUT_BYTES;

  const conversion = useMemo(
    () => (oversize ? null : convertMetricflowYaml(input)),
    [input, oversize],
  );

  const validation = useMemo(
    () => (oversize ? null : validateAsOsi(input)),
    [input, oversize],
  );

  const diffParts = useMemo(() => {
    if (!conversion || !conversion.osiYaml) return [];
    return diffLines(input, conversion.osiYaml);
  }, [conversion, input]);

  const diffSummary = useMemo(() => {
    let added = 0;
    let removed = 0;
    for (const p of diffParts) {
      const lines = p.value.split("\n").filter(Boolean).length;
      if (p.added) added += lines;
      if (p.removed) removed += lines;
    }
    return { added, removed };
  }, [diffParts]);

  const copyOsi = async () => {
    if (!conversion) return;
    await navigator.clipboard.writeText(conversion.osiYaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const outMeta =
    tab === "validator"
      ? `OSI v${OSI_SCHEMA_VERSION}`
      : tab === "converter"
        ? conversion && conversion.errors.length === 0
          ? `${conversion.mappedCount} mapped · ${conversion.renamedCount} renamed`
          : "—"
        : `+${diffSummary.added} · −${diffSummary.removed} lines`;

  const miniTab = (value: Tab, label: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={tab === value}
      className="osi-tab-mini"
      onClick={() => setTab(value)}
    >
      {label}
    </button>
  );

  return (
    <div className="osi-pg">
      {/* INPUT WINDOW */}
      <div className="term osi-win" style={{ fontFamily: "var(--font-sans)" }}>
        <div className="term__bar">
          <TrafficDots />
          <span className="term__title">metricflow.yml</span>
          <span className="term__title" style={{ marginLeft: "auto" }}>
            {(input.length / 1024).toFixed(1)} KB
          </span>
        </div>
        <div className="osi-bar">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" className="osi-btn" onClick={() => setInput(SAMPLE_METRICFLOW)}>
              <Sparkles size={12} /> Load example
            </button>
            <button
              type="button"
              className="osi-btn"
              onClick={() => setInput(SAMPLE_METRICFLOW_INVALID)}
            >
              Load invalid
            </button>
          </div>
          <button type="button" className="osi-btn" onClick={() => setInput("")}>
            <RotateCcw size={12} /> Clear
          </button>
        </div>
        <textarea
          className="osi-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          placeholder="Paste your MetricFlow YAML here…"
          aria-label="MetricFlow YAML input"
        />
        {oversize && (
          <div
            style={{
              borderTop: "1px solid var(--line)",
              background: "color-mix(in oklab, var(--term-pink) 13%, transparent)",
              padding: "8px 12px",
              fontSize: 12,
              color: "var(--ink-dim)",
            }}
          >
            Input is over 200 KB — trimmed for browser-side processing.
          </div>
        )}
      </div>

      {/* OUTPUT WINDOW — tab switcher lives in the title bar, meta on the right */}
      <div className="term osi-win" style={{ fontFamily: "var(--font-sans)" }}>
        <div className="term__bar">
          <div className="osi-seg" role="tablist" aria-label="OSI Playground tools">
            {miniTab("validator", "Validator")}
            {miniTab("converter", "Converter")}
            {miniTab("diff", "Diff")}
          </div>
          <span style={barTitleStyle}>{outMeta}</span>
        </div>

        {tab === "converter" && (
          <div className="osi-bar">
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "var(--ink-faint)",
              }}
            >
              OSI v{OSI_SCHEMA_VERSION}
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" className="osi-btn" onClick={copyOsi} disabled={!conversion?.osiYaml}>
                <Copy size={12} /> {copied ? "Copied" : "Copy"}
              </button>
              <button
                type="button"
                className="osi-btn"
                onClick={() => conversion && download("osi.yml", conversion.osiYaml)}
                disabled={!conversion?.osiYaml}
              >
                <Download size={12} /> Download
              </button>
            </div>
          </div>
        )}

        <div className="osi-body">
          {/* VALIDATOR */}
          {tab === "validator" &&
            (!validation ? null : validation.kind === "yaml-error" ? (
              <div style={{ display: "grid", gap: 12, alignContent: "start" }}>
                <StatusBadge tone="pink">✗ YAML error</StatusBadge>
                <pre className="osi-pre" style={{ color: "var(--ink-dim)" }}>
                  {validation.message}
                </pre>
              </div>
            ) : validation.kind === "not-object" ? (
              <div style={{ display: "grid", gap: 12, alignContent: "start" }}>
                <StatusBadge tone="pink">✗ Invalid root</StatusBadge>
                <p style={{ fontSize: 13, color: "var(--ink-dim)", margin: 0 }}>{validation.message}</p>
              </div>
            ) : validation.kind === "valid" ? (
              <div style={{ display: "grid", gap: 12, alignContent: "start" }}>
                <StatusBadge tone="sage">✓ Valid OSI</StatusBadge>
                <p style={{ fontSize: 13, color: "var(--ink-muted)", margin: 0 }}>
                  This document conforms to the OSI v{OSI_SCHEMA_VERSION} core schema (subset).{" "}
                  {validation.warnings[0] ?? ""}
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 12, alignContent: "start" }}>
                <StatusBadge tone="amber">
                  ⚠ {validation.errors.length} issue{validation.errors.length === 1 ? "" : "s"}
                </StatusBadge>
                {validation.warnings.map((w, i) => (
                  <p key={i} style={{ fontSize: 12, color: "var(--ink-faint)", margin: 0 }}>
                    {w}
                  </p>
                ))}
                <ul style={{ margin: "6px 0 0", padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
                  {validation.errors.slice(0, 20).map((err, i) => (
                    <li
                      key={i}
                      style={{
                        borderRadius: 8,
                        border: "1px solid var(--line)",
                        background: "rgba(11,18,48,0.4)",
                        padding: "8px 12px",
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          textTransform: "uppercase",
                          letterSpacing: "0.14em",
                          color: "var(--ink-faint)",
                        }}
                      >
                        {err.instancePath || "/"}
                      </div>
                      <div style={{ color: "var(--ink-dim)" }}>{err.message}</div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          {/* CONVERTER */}
          {tab === "converter" && (
            <>
              {conversion && <DroppedList items={conversion.droppedFields} />}
              {conversion?.errors.length ? (
                <>
                  <StatusBadge tone="pink">✗ Conversion failed</StatusBadge>
                  <pre className="osi-pre" style={{ marginTop: 8 }}>
                    {conversion.errors.join("\n")}
                  </pre>
                </>
              ) : (
                <pre className="osi-pre">
                  <code>{conversion?.osiYaml ?? ""}</code>
                </pre>
              )}
            </>
          )}

          {/* DIFF */}
          {tab === "diff" &&
            (diffParts.length === 0 ? (
              <p style={{ fontSize: 13, color: "var(--ink-faint)", margin: 0 }}>
                Paste a MetricFlow YAML on the left to see the line-by-line diff.
              </p>
            ) : (
              <pre className="osi-pre" style={{ whiteSpace: "pre" }}>
                {diffParts.map((p, i) => {
                  const bg = p.added
                    ? "color-mix(in oklab, var(--term-green) 20%, transparent)"
                    : p.removed
                      ? "color-mix(in oklab, var(--term-pink) 20%, transparent)"
                      : "transparent";
                  const prefix = p.added ? "+ " : p.removed ? "− " : "  ";
                  return (
                    <span key={i} style={{ background: bg, display: "block", whiteSpace: "pre-wrap" }}>
                      {p.value
                        .split("\n")
                        .filter((_, idx, arr) => !(idx === arr.length - 1 && arr[idx] === ""))
                        .map((line, li) => (
                          <span key={li} style={{ display: "block" }}>
                            <span style={{ color: "var(--ink-faint)", userSelect: "none" }}>{prefix}</span>
                            {line}
                          </span>
                        ))}
                    </span>
                  );
                })}
              </pre>
            ))}
        </div>
      </div>
    </div>
  );
}
