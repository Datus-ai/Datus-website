import ProductPageTemplate from "../../../components/ProductPageTemplate";
import { useLocale, useT } from "../../../i18n/LocaleContext";
import { UI } from "../../../i18n/ui";
import { studioPage } from "./content";

export default function StudioPage() {
  const data = useT(studioPage);
  const t = UI[useLocale()];
  return (
    <ProductPageTemplate
      data={data}
      breadcrumb={{
        currentUrl: "/products/studio/",
        items: [
          { label: t.nav.home, href: "/" },
          { label: t.nav.products, noSchema: true },
          { label: t.products.studio },
        ],
      }}
    />
  );
}
