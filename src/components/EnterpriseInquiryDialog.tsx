import * as DialogPrimitive from "@radix-ui/react-dialog";
import { CheckCircle2, X } from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

interface FormState {
  name: string;
  email: string;
  company: string;
  role: string;
  message: string;
}

const initialForm: FormState = {
  name: "",
  email: "",
  company: "",
  role: "",
  message: "",
};

const FORMSPREE_ENDPOINT = (import.meta as { env?: Record<string, string> })
  .env?.VITE_FORMSPREE_ENDPOINT;

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.02em",
  color: "#CBD5E1",
  marginBottom: 6,
};

const inputBaseStyle: React.CSSProperties = {
  width: "100%",
  height: 40,
  padding: "0 0.85rem",
  borderRadius: 8,
  background: "rgba(15,23,42,0.6)",
  border: "1px solid rgba(148,163,184,0.18)",
  color: "#F1F5F9",
  fontSize: 14,
  fontWeight: 500,
  outline: "none",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
};

const textareaStyle: React.CSSProperties = {
  ...inputBaseStyle,
  height: "auto",
  minHeight: 96,
  padding: "0.65rem 0.85rem",
  resize: "vertical",
  fontFamily: "inherit",
  lineHeight: 1.5,
};

function focusRing(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = "rgba(244,114,182,0.7)";
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(244,114,182,0.18)";
}

function blurRing(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
  e.currentTarget.style.borderColor = "rgba(148,163,184,0.18)";
  e.currentTarget.style.boxShadow = "none";
}

export function EnterpriseInquiryDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState<FormState>(initialForm);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function reset() {
    setForm(initialForm);
    setStatus("idle");
    setErrorMsg(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setErrorMsg(null);

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      company: form.company.trim(),
      role: form.role.trim(),
      message: form.message.trim(),
      source: "datus.ai homepage — Talk to Enterprise",
    };

    try {
      if (FORMSPREE_ENDPOINT) {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `Submission failed (${res.status})`);
        }
      } else {
        await new Promise((r) => setTimeout(r, 600));
        if (typeof console !== "undefined") {
          console.warn(
            "[EnterpriseInquiryDialog] VITE_FORMSPREE_ENDPOINT not set — simulating success.",
            payload,
          );
        }
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    }
  }

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          // small delay so the success state doesn't flash during close animation
          setTimeout(reset, 200);
        }
      }}
    >
      <DialogPrimitive.Trigger asChild>{children}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(2,6,23,0.7)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
          className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 51,
            width: "calc(100% - 2rem)",
            maxWidth: 520,
            maxHeight: "calc(100vh - 2rem)",
            overflowY: "auto",
            background:
              "linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(2,6,23,0.98) 100%)",
            border: "1px solid rgba(244,114,182,0.25)",
            borderRadius: 14,
            padding: "1.75rem",
            boxShadow:
              "0 30px 80px -20px rgba(244,114,182,0.18), 0 20px 50px -20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
          className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          <DialogPrimitive.Close
            aria-label="Close"
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              width: 32,
              height: 32,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              border: "1px solid rgba(148,163,184,0.18)",
              background: "rgba(15,23,42,0.6)",
              color: "#94A3B8",
              cursor: "pointer",
            }}
          >
            <X size={16} />
          </DialogPrimitive.Close>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                padding: "1rem 0.5rem 0.25rem",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(244,114,182,0.12)",
                  border: "1px solid rgba(244,114,182,0.4)",
                  marginBottom: "1rem",
                }}
              >
                <CheckCircle2 size={28} style={{ color: "#F9A8D4" }} />
              </div>
              <DialogPrimitive.Title asChild>
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#FFFFFF",
                    margin: 0,
                  }}
                >
                  Thanks — we'll be in touch
                </h3>
              </DialogPrimitive.Title>
              <p
                style={{
                  margin: "0.5rem 0 1.5rem",
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "#94A3B8",
                  maxWidth: 380,
                }}
              >
                We typically respond within one business day. In the meantime,
                feel free to email{" "}
                <a
                  href="mailto:contact@datus.ai"
                  style={{ color: "#F9A8D4", textDecoration: "none" }}
                >
                  contact@datus.ai
                </a>
                .
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  height: 40,
                  padding: "0 1.25rem",
                  borderRadius: 8,
                  background:
                    "linear-gradient(180deg, rgba(244,114,182,0.18) 0%, rgba(15,23,42,0.5) 100%)",
                  border: "1px solid rgba(244,114,182,0.5)",
                  color: "#FFFFFF",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <DialogPrimitive.Title asChild>
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#FFFFFF",
                    margin: "0 0 0.4rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Talk to us about Enterprise & BYOC
                </h3>
              </DialogPrimitive.Title>
              <p
                style={{
                  margin: "0 0 1.4rem",
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: "#94A3B8",
                }}
              >
                Tell us a little about your team and what you're trying to do.
                We'll get back within one business day.
              </p>

              <div style={{ display: "grid", gap: "1rem" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.85rem",
                  }}
                >
                  <div>
                    <label htmlFor="enterprise-name" style={labelStyle}>
                      Full name <span style={{ color: "#F9A8D4" }}>*</span>
                    </label>
                    <input
                      id="enterprise-name"
                      type="text"
                      required
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      onFocus={focusRing}
                      onBlur={blurRing}
                      style={inputBaseStyle}
                    />
                  </div>
                  <div>
                    <label htmlFor="enterprise-company" style={labelStyle}>
                      Company <span style={{ color: "#F9A8D4" }}>*</span>
                    </label>
                    <input
                      id="enterprise-company"
                      type="text"
                      required
                      autoComplete="organization"
                      value={form.company}
                      onChange={(e) => update("company", e.target.value)}
                      onFocus={focusRing}
                      onBlur={blurRing}
                      style={inputBaseStyle}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.85rem",
                  }}
                >
                  <div>
                    <label htmlFor="enterprise-email" style={labelStyle}>
                      Work email <span style={{ color: "#F9A8D4" }}>*</span>
                    </label>
                    <input
                      id="enterprise-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      onFocus={focusRing}
                      onBlur={blurRing}
                      style={inputBaseStyle}
                    />
                  </div>
                  <div>
                    <label htmlFor="enterprise-role" style={labelStyle}>
                      Role / title
                    </label>
                    <input
                      id="enterprise-role"
                      type="text"
                      autoComplete="organization-title"
                      value={form.role}
                      onChange={(e) => update("role", e.target.value)}
                      onFocus={focusRing}
                      onBlur={blurRing}
                      style={inputBaseStyle}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="enterprise-message" style={labelStyle}>
                    What are you trying to do?
                  </label>
                  <textarea
                    id="enterprise-message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    onFocus={focusRing}
                    onBlur={blurRing}
                    placeholder="Stack, scale, timeline, anything we should know…"
                    style={textareaStyle}
                  />
                </div>
              </div>

              {status === "error" && errorMsg && (
                <p
                  style={{
                    marginTop: "0.85rem",
                    marginBottom: 0,
                    fontSize: 12,
                    color: "#FCA5A5",
                  }}
                >
                  {errorMsg}
                </p>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "0.75rem",
                  marginTop: "1.5rem",
                }}
              >
                <DialogPrimitive.Close asChild>
                  <button
                    type="button"
                    style={{
                      height: 40,
                      padding: "0 1rem",
                      borderRadius: 8,
                      background: "transparent",
                      border: "1px solid rgba(148,163,184,0.2)",
                      color: "#CBD5E1",
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </DialogPrimitive.Close>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  style={{
                    height: 40,
                    padding: "0 1.25rem",
                    borderRadius: 8,
                    background:
                      status === "submitting"
                        ? "rgba(244,114,182,0.18)"
                        : "linear-gradient(180deg, rgba(244,114,182,0.28) 0%, rgba(15,23,42,0.55) 100%)",
                    border: "1px solid rgba(244,114,182,0.55)",
                    color: "#FFFFFF",
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: "-0.005em",
                    cursor: status === "submitting" ? "wait" : "pointer",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 16px -8px rgba(244,114,182,0.4)",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  }}
                >
                  {status === "submitting" ? "Sending…" : "Request a meeting"}
                </button>
              </div>
            </form>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export default EnterpriseInquiryDialog;
