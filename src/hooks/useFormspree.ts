import { useState } from "react";

export type FormspreeStatus = "idle" | "submitting" | "success" | "error";

const FORMSPREE_ENDPOINT = (import.meta as { env?: Record<string, string> }).env
  ?.VITE_FORMSPREE_ENDPOINT;

/**
 * Shared Formspree submit logic — used by the homepage enquiry dialog and the
 * Enterprise-page inline form. Falls back to a simulated success in dev when
 * VITE_FORMSPREE_ENDPOINT is not configured.
 */
export function useFormspree() {
  const [status, setStatus] = useState<FormspreeStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(payload: Record<string, unknown>) {
    if (status === "submitting") return;
    setStatus("submitting");
    setError(null);
    try {
      if (FORMSPREE_ENDPOINT) {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `Submission failed (${res.status})`);
        }
      } else if (import.meta.env.DEV) {
        await new Promise((r) => setTimeout(r, 600));
        if (typeof console !== "undefined") {
          console.warn("[useFormspree] VITE_FORMSPREE_ENDPOINT not set — simulating success.", payload);
        }
      } else {
        throw new Error("Form submission is unavailable right now. Please email contact@datus.ai.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    }
  }

  function reset() {
    setStatus("idle");
    setError(null);
  }

  return { status, error, submit, reset };
}
