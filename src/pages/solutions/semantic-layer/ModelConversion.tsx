import { ArrowUpRight } from 'lucide-react';
import { useHref, useT } from '../../../i18n/LocaleContext';
import { SemanticConverterWorkbench } from '../../../modules/semantic-converter/components/workbench';
import { CONVERSION_COPY } from './conversionCopy';
import './model-conversion.css';

/** The same complete workbench as the tools route, initially focused on import. */
export default function ModelConversion(){
 const t=useT(CONVERSION_COPY),l=useHref();
 return <div className="solution-converter"><div className="solution-converter__intro"><div><h3>{t.title}</h3><p>{t.lead}</p></div><a className="solution-link" href={l('/tools/semantic-model-converter/?direction=import')}>{t.openTool}<ArrowUpRight size={14}/></a></div><SemanticConverterWorkbench initialDirection="import"/></div>;
}
