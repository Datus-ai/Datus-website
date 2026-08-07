import InterfaceView from "../../components/InterfaceView";
import { useT } from "../../i18n/LocaleContext";
import { MCP_DATA } from "./data";

export default function McpPage() {
  return <InterfaceView data={useT(MCP_DATA)} />;
}
