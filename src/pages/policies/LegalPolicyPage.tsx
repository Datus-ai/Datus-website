import type { ReactNode } from "react";
import SiteLayout from "../../components/SiteLayout";
import Breadcrumb from "../../components/Breadcrumb";
import { useLocale } from "../../i18n/LocaleContext";
import { UI } from "../../i18n/ui";
import "./legal-policy.css";

export type LegalBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

export type LegalDocument = {
  title: string;
  effectiveDate: string;
  sections: { id: string; title: string; blocks: LegalBlock[] }[];
};

function linkedText(text: string): ReactNode[] {
  return text.split(/(https?:\/\/[^\s]+|contact@datus\.ai)/g).map((part, index) => {
    if (part === "contact@datus.ai") {
      return <a key={index} href="mailto:contact@datus.ai">{part}</a>;
    }
    if (part.startsWith("https://") || part.startsWith("http://")) {
      const url = part.replace(/[.,;]+$/, "");
      return <span key={index}><a href={url}>{url}</a>{part.slice(url.length)}</span>;
    }
    return part;
  });
}

export default function LegalPolicyPage({
  document,
  path,
}: {
  document: LegalDocument;
  path: string;
}) {
  const locale = useLocale();
  return (
    <SiteLayout>
      <main className="container legal-policy">
        <Breadcrumb
          currentUrl={path}
          items={[{ label: UI[locale].nav.home, href: "/" }, { label: document.title }]}
        />
        <header className="legal-policy__header">
          <p className="legal-policy__eyebrow">DatusAI, Inc. / Policies</p>
          <h1>{document.title}</h1>
          <p className="legal-policy__date">Effective Date: {document.effectiveDate}</p>
        </header>
        <div className="legal-policy__grid">
          <nav className="legal-policy__toc" aria-label="Table of contents">
            <p>On this page</p>
            <ol>
              {document.sections.map((section) => (
                <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>
              ))}
            </ol>
          </nav>
          <article className="legal-policy__body">
            {document.sections.map((section) => (
              <section key={section.id} id={section.id}>
                <h2>{section.title}</h2>
                {section.blocks.map((block, index) => block.type === "list" ? (
                  <ul key={index}>
                    {block.items.map((item) => <li key={item}>{linkedText(item)}</li>)}
                  </ul>
                ) : (
                  <p key={index}>{linkedText(block.text)}</p>
                ))}
              </section>
            ))}
          </article>
        </div>
      </main>
    </SiteLayout>
  );
}
