import type { FaqItem } from "../../components/FAQ";
import type { ISupportGuide } from "./content";

export type ISupportMatch = {
  id: string;
  kind: "guide" | "faq";
  title: string;
  category: string;
  faqIndex?: number;
};

/** Search the public page only; titles and categories rank above body matches. */
export function searchSupport(
  query: string,
  guides: ISupportGuide[],
  faqs: FaqItem[],
  faqCategory: string,
): ISupportMatch[] {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];

  const candidates = [
    ...guides.map((guide) => ({
      id: guide.id,
      kind: "guide" as const,
      title: guide.title,
      category: guide.category,
      body: [guide.intro, ...guide.steps, guide.note].join(" "),
    })),
    ...faqs.map((faq, faqIndex) => ({
      id: `faq-${faqIndex}`,
      kind: "faq" as const,
      title: faq.q,
      category: faqCategory,
      body: faq.a,
      faqIndex,
    })),
  ];
  return candidates
    .filter((item) => {
      const text =
        `${item.title} ${item.category} ${item.body}`.toLocaleLowerCase();
      return words.every((word) => text.includes(word));
    })
    .map((item) => ({
      ...item,
      score: words.reduce(
        (score, word) =>
          score +
          (item.title.toLocaleLowerCase().includes(word) ? 5 : 0) +
          (item.category.toLocaleLowerCase().includes(word) ? 3 : 0),
        0,
      ),
    }))
    .sort((a, b) => b.score - a.score);
}
