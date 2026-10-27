import { MousePointer2 } from 'lucide-react';
import { useT } from '../i18n/LocaleContext';
import { INTERFACE_PREVIEWS } from '../content/interfacePreviews';
export default function InterfaceClickHint({label}:{label?:string}={}){const t=useT(INTERFACE_PREVIEWS);return <span className="pi-click-guide" aria-hidden="true"><MousePointer2 size={20}/><span>{label??t.clickExplore}</span></span>}
