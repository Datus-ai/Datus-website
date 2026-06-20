import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { CONTACT_EMAIL } from "../config/nav";
import { useFormspree } from "../hooks/useFormspree";

const DATA_STACKS = [
  "Snowflake", "Databricks", "BigQuery", "Redshift", "StarRocks", "ClickHouse",
  "Doris", "Greenplum", "PostgreSQL", "MySQL", "Hive", "Spark", "Trino", "Other",
];

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12.5,
  fontWeight: 600,
  letterSpacing: "0.02em",
  color: "var(--ink-dim)",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 42,
  padding: "0 12px",
  borderRadius: 8,
  background: "#070d22",
  border: "1px solid var(--line-strong)",
  color: "var(--ink)",
  fontSize: 14,
  outline: "none",
};

export default function EnterpriseForm() {
  const { status, error, submit } = useFormspree();
  const [form, setForm] = useState({ name: "", email: "", company: "", problem: "" });
  const [stacks, setStacks] = useState<string[]>([]);

  function toggleStack(s: string) {
    setStacks((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submit({
      name: form.name.trim(),
      email: form.email.trim(),
      company: form.company.trim(),
      data_stack: stacks.join(", "),
      problem: form.problem.trim(),
      source: "datus.ai — Enterprise page form",
    });
  }

  if (status === "success") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "20px 0" }}>
        <CheckCircle2 size={40} style={{ color: "var(--term-green)", marginBottom: 14 }} />
        <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Thanks — we'll be in touch</h3>
        <p className="muted" style={{ marginTop: 8, maxWidth: 420 }}>
          We typically respond within one business day. Or email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--brand-bright)" }}>{CONTACT_EMAIL}</a>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ marginTop: 26, display: "grid", gap: 16, maxWidth: 560 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <label style={labelStyle} htmlFor="ent-name">Full name *</label>
          <input id="ent-name" style={inputStyle} required autoComplete="name"
            value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </div>
        <div>
          <label style={labelStyle} htmlFor="ent-company">Company *</label>
          <input id="ent-company" style={inputStyle} required autoComplete="organization"
            value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} />
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="ent-email">Work email *</label>
        <input id="ent-email" type="email" style={inputStyle} required autoComplete="email"
          value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
      </div>

      <div>
        <label style={labelStyle}>Data stack</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {DATA_STACKS.map((s) => {
            const on = stacks.includes(s);
            return (
              <button key={s} type="button" onClick={() => toggleStack(s)}
                style={{
                  fontFamily: "var(--font-mono)", fontSize: 13, cursor: "pointer",
                  padding: "7px 13px", borderRadius: 999,
                  border: `1px solid ${on ? "var(--brand-bright)" : "var(--line-strong)"}`,
                  background: on ? "var(--brand-soft)" : "transparent",
                  color: on ? "#fff" : "var(--ink-muted)",
                }}>
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label style={labelStyle} htmlFor="ent-problem">What are you trying to solve? (optional)</label>
        <textarea id="ent-problem" rows={3}
          style={{ ...inputStyle, height: "auto", padding: "10px 12px", resize: "vertical", fontFamily: "inherit" }}
          value={form.problem} onChange={(e) => setForm((f) => ({ ...f, problem: e.target.value }))} />
      </div>

      {status === "error" && error && (
        <p style={{ color: "#fca5a5", fontSize: 13, margin: 0 }}>{error}</p>
      )}

      <div>
        <button type="submit" className="btn btn-primary btn-lg" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Request a meeting"}
        </button>
      </div>
    </form>
  );
}
