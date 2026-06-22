import ProductPageTemplate from "../../../components/ProductPageTemplate";
import { vscodePage } from "./content";

export default function VscodePage() {
  return (
    <ProductPageTemplate
      data={vscodePage}
      breadcrumb={{
        currentUrl: "/products/vscode/",
        items: [
          { label: "Home", href: "/" },
          { label: "Products", noSchema: true },
          { label: "VS Code Extension" },
        ],
      }}
    />
  );
}
