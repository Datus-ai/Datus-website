import ProductPageTemplate from "../../../components/ProductPageTemplate";
import { studioPage } from "./content";

export default function StudioPage() {
  return (
    <ProductPageTemplate
      data={studioPage}
      breadcrumb={{
        currentUrl: "/products/studio/",
        items: [
          { label: "Home", href: "/" },
          { label: "Products", noSchema: true },
          { label: "Datus Studio" },
        ],
      }}
    />
  );
}
