import { useCurrentPath, useLocale } from '../i18n/LocaleContext';
import { pageEntityGraph } from '../seo/entities';

/** Rendered on the server as well as the client, without duplicate head schemas. */
export default function PageEntities() {
 const graph = pageEntityGraph(useCurrentPath(), useLocale());
 return graph ? <script id="datus-entity-graph" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, '\\u003c') }}/> : null;
}
