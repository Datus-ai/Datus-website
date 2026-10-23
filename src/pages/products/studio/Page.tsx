import ProductInterfacePreview from "../../../components/ProductInterfacePreview";
import { INTERFACE_PREVIEWS } from "../../../content/interfacePreviews";
import ProductPageTemplate from "../../../components/ProductPageTemplate";
import { useLocale, useT } from "../../../i18n/LocaleContext";
import { UI } from "../../../i18n/ui";
import { studioPage } from "./content";

export default function StudioPage() {
  const data = useT(studioPage);
  const preview = useT(INTERFACE_PREVIEWS);
  const t = UI[useLocale()];
  return (
    <ProductPageTemplate
      data={data}
      afterHero={<section className="section studio-product-preview" aria-label={preview.studioTour} style={{paddingTop:0,paddingBottom:64}}><div className="container" style={{maxWidth:1240}}><ProductInterfacePreview kind="studio"/></div></section>}
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
