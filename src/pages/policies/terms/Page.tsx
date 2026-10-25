import LegalPolicyPage, { type LegalDocument } from "../LegalPolicyPage";
import document from "./content.json";

export default function TermsPage() {
  return <LegalPolicyPage document={document as LegalDocument} path="/policies/terms/" dateLabel="Last updated" linkPrivacyStatement />;
}
