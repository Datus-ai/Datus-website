import LegalPolicyPage, { type LegalDocument } from "../LegalPolicyPage";
import document from "./content.json";

export default function PrivacyPolicyPage() {
  return <LegalPolicyPage document={document as LegalDocument} path="/policies/privacy/" />;
}
