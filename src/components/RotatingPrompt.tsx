import { useEffect, useState } from "react";

/**
 * Typewriter that cycles through Datus's end-to-end, semantic-centric verbs —
 * Build metrics / Create dashboard / Generate SQL / Create ETL job /
 * Create subagent chatbot — to show one agent spanning the whole lifecycle.
 */
const PHRASES = [
  "Build metrics for revenue",
  "Create a dashboard for churn",
  "Generate SQL for cohort retention",
  "Create an ETL job for events",
  "Create a subagent chatbot for sales",
];

const TYPE_MS = 55;
const DELETE_MS = 28;
const HOLD_MS = 1500;

export default function RotatingPrompt() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">(
    "typing",
  );

  useEffect(() => {
    const full = PHRASES[index];

    if (phase === "typing") {
      if (text.length < full.length) {
        const t = setTimeout(
          () => setText(full.slice(0, text.length + 1)),
          TYPE_MS,
        );
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("holding"), HOLD_MS);
      return () => clearTimeout(t);
    }

    if (phase === "holding") {
      setPhase("deleting");
      return;
    }

    // deleting
    if (text.length > 0) {
      const t = setTimeout(
        () => setText(full.slice(0, text.length - 1)),
        DELETE_MS,
      );
      return () => clearTimeout(t);
    }
    setPhase("typing");
    setIndex((i) => (i + 1) % PHRASES.length);
  }, [text, phase, index]);

  return (
    <span className="term__line" aria-live="polite">
      <span className="term__prompt">datus&nbsp;&gt;&nbsp;</span>
      <span className="term__cmd">{text}</span>
      <span className="cursor" />
    </span>
  );
}
