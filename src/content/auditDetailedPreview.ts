import type { Locale } from '../i18n/config';
// Copy for the preserved full-product iteration; keep it separate from report demo.
export const AUDIT_DETAILED_PREVIEW:Record<Locale,{title:string;note:string}>={
 en:{title:'Trace results to their source',note:'Recorded DuckDB results and model lineage. Select a node to inspect its dependencies.'},
 zh:{title:'从结果追溯源数据',note:'DuckDB 结果记录与模型血缘。点击节点，检查相应依赖。'},
};
