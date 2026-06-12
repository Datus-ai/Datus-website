import EnterpriseForm from "../../../components/EnterpriseForm";
import ProductPageTemplate from "../../../components/ProductPageTemplate";
import { enterprisePage } from "./content";

export default function EnterprisePage() {
  return (
    <ProductPageTemplate data={{ ...enterprisePage, formSlot: <EnterpriseForm /> }} />
  );
}
