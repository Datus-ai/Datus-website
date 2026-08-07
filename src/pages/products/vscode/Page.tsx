import ProductPageTemplate from "../../../components/ProductPageTemplate";
import { useLocale, useT } from "../../../i18n/LocaleContext";
import { UI } from "../../../i18n/ui";
import { vscodePage } from "./content";

export default function VscodePage() {
  const data = useT(vscodePage);
  const t = UI[useLocale()];
  return (
    <ProductPageTemplate
      data={data}
      breadcrumb={{
        currentUrl: "/products/vscode/",
        items: [
          { label: t.nav.home, href: "/" },
          { label: t.nav.products, noSchema: true },
          { label: t.products.vscode },
        ],
      }}
    />
  );
}
