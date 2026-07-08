import type { FaqItem } from "../../components/FAQ";

// Page-specific FAQ for /models/ — supported providers, per-node routing,
// switching models, embeddings, tracing. Content adapted from the datus-design
// models template. Owned by this URL only; see datus-faq-spec.md.
export const modelsFaq: FaqItem[] = [
  {
    q: "Which LLM providers does Datus support?",
    a: "Datus supports 11+ providers out of the box: OpenAI, Anthropic Claude, Google Gemini, DeepSeek, Alibaba Qwen, Moonshot Kimi, MiniMax, GLM (Zhipu), Azure OpenAI, OpenAI Codex via OAuth, and OpenRouter for 300+ models behind a single key.",
  },
  {
    q: "Can I use a different model for each step of a workflow?",
    a: "Yes. Per-node model assignment lets you pick a different provider and model for each step — for example, a fast model for planning, a strong reasoning model for SQL generation, and a cheap model for validation.",
  },
  {
    q: "How do I switch the active model from the CLI?",
    a: "Run /model inside the Datus CLI to list configured providers and pick a new active one. The change is written back to ~/.datus/agent.yml, so the next session keeps the same default.",
  },
  {
    q: "What about embeddings?",
    a: "Datus supports OpenAI embeddings, Sentence-Transformers, and Hugging Face models (E5, BGE), so you can keep retrieval entirely local or use a hosted provider as you prefer.",
  },
  {
    q: "Do I need keys from every provider?",
    a: "No — you only configure the providers you actually use. Many teams start with a single key (OpenAI or OpenRouter) and add specialized models later for cost or latency reasons.",
  },
  {
    q: "How do I trace LLM calls?",
    a: "Datus supports LangSmith, Langfuse (with OpenTelemetry / OpenInference) and a local --save_llm_trace flag that dumps every prompt and completion to YAML for offline inspection.",
  },
];
