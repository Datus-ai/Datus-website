import InterfaceView from "../../components/InterfaceView";
import { useT } from "../../i18n/LocaleContext";
import { CHATBOT_DATA } from "./data";

export default function ChatbotPage() {
  return <InterfaceView data={useT(CHATBOT_DATA)} />;
}
