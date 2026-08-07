import type { FaqItem } from "../../components/FAQ";
import type { Locale } from "../../i18n/config";

// Page-specific FAQ for /models/ — supported providers, per-node routing,
// switching models, embeddings, tracing. Content adapted from the datus-design
// models template. Owned by this URL only; see datus-faq-spec.md.
const EN: FaqItem[] = [
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

const ZH: FaqItem[] = [
  {
    q: "Datus 支持哪些大模型厂商？",
    a: "Datus 开箱支持 11 家以上厂商：OpenAI、Anthropic Claude、Google Gemini、DeepSeek、阿里 Qwen、月之暗面 Kimi、MiniMax、智谱 GLM、Azure OpenAI、通过 OAuth 接入的 OpenAI Codex，以及一个 Key 就能用上 300+ 模型的 OpenRouter。",
  },
  {
    q: "工作流的每一步能用不同的模型吗？",
    a: "可以。按节点分配模型让你给每一步挑不同的厂商和模型——比如规划用快模型、生成 SQL 用推理强的模型、校验用便宜的模型。",
  },
  {
    q: "怎么在 CLI 里切换当前模型？",
    a: "在 Datus CLI 里执行 /model，会列出已配置的厂商供你选择新的当前模型。改动会写回 ~/.datus/agent.yml，下次会话仍沿用这个默认值。",
  },
  {
    q: "Embedding 呢？",
    a: "Datus 支持 OpenAI Embeddings、Sentence-Transformers 以及 Hugging Face 上的模型（E5、BGE），检索既可以完全本地跑，也可以按需接托管厂商。",
  },
  {
    q: "每家厂商的 Key 都要配吗？",
    a: "不用——只配你真正会用到的。很多团队一开始只用一个 Key（OpenAI 或 OpenRouter），之后再出于成本或延迟考虑补上专用模型。",
  },
  {
    q: "怎么追踪大模型调用？",
    a: "Datus 支持 LangSmith、Langfuse（配合 OpenTelemetry / OpenInference），也提供本地的 --save_llm_trace 参数，把每一次 prompt 和 completion 导出成 YAML 供离线排查。",
  },
];

export const modelsFaq: Record<Locale, FaqItem[]> = { en: EN, zh: ZH };
