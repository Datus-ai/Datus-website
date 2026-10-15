import { useT } from '../../i18n/LocaleContext';
import { SEMANTIC_CONVERTER_UI } from '../../i18n/ui';

export function useConverterCopy() {
  return useT(SEMANTIC_CONVERTER_UI);
}
