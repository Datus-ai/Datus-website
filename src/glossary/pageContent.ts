import { UI } from "../i18n/ui";
import type { Locale } from "../i18n/config";

type GlossaryCopy = {
  eyebrow: string;
  title: string;
  subtitle: (count: number) => string;
  meta: (categories: number, terms: number, updated: string) => string;
  termsSuffix: (n: number) => string;
  readGuide: string;
  ctaTitle: string;
  ctaBody: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

export const GLOSSARY_PAGE_COPY: Record<Locale, GlossaryCopy> = {
  en: {
    eyebrow: "Glossary",
    title: "Data engineering glossary",
    subtitle: (count) =>
      `Plain-language definitions of the ${count} concepts Datus agents work with day to day — from semantic layer and lakehouse to schema linking, MCP, and RAG. One page, no fluff.`,
    meta: (categories, terms, updated) =>
      `${categories} categories · ${terms} terms · Updated ${updated}`,
    termsSuffix: (n) => `${n} terms`,
    readGuide: "Read the full guide →",
    ctaTitle: "From definitions to a working agent",
    ctaBody:
      "Datus turns these concepts into an evolvable Context Engine — so your data engineering agent understands your warehouse, not just the words.",
    ctaPrimary: UI.en.common.tryStudio,
    ctaSecondary: "Read the docs",
  },
  zh: {
    eyebrow: "术语表",
    title: "数据工程术语表",
    subtitle: (count) =>
      `用大白话解释 Datus Agent 每天打交道的 ${count} 个概念——从语义层、湖仓，到 Schema Linking、MCP 与 RAG。一页看完，不灌水。`,
    meta: (categories, terms, updated) =>
      `${categories} 个分类 · ${terms} 个词条 · 更新于 ${updated}`,
    termsSuffix: (n) => `${n} 个词条`,
    readGuide: "阅读完整指南 →",
    ctaTitle: "从定义到一个真正能干活的 Agent",
    ctaBody:
      "Datus 把这些概念变成一套可演进的上下文引擎——让你的数据工程 Agent 真正理解你的数仓，而不只是认得这些词。",
    ctaPrimary: UI.zh.common.tryStudio,
    ctaSecondary: "阅读文档",
  },
};
