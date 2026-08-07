import EnterpriseForm from "../../../components/EnterpriseForm";
import ProductPageTemplate from "../../../components/ProductPageTemplate";
import { useLocale, useT } from "../../../i18n/LocaleContext";
import { UI } from "../../../i18n/ui";
import { enterprisePage } from "./content";

export default function EnterprisePage() {
  const data = useT(enterprisePage);
  const t = UI[useLocale()];
  return (
    <ProductPageTemplate
      data={{ ...data, formSlot: <EnterpriseForm /> }}
      breadcrumb={{
        currentUrl: "/products/enterprise/",
        items: [
          { label: t.nav.home, href: "/" },
          { label: t.nav.products, noSchema: true },
          { label: t.products.enterprise },
        ],
      }}
    />
  );
}
