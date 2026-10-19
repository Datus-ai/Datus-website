import type { IImportFile } from '../contracts';
import cube from './cube.json';
import omni from './omni.json';
import dbt from './dbt.json';
import microsoft from './microsoft.json';

// Authored public test definitions, not customer models or exports of live systems.
export const IMPORT_EXAMPLES: {
  id: string;
  label: string;
  files: IImportFile[];
}[] = [
  { id: 'cube', label: 'Cube · Commerce (3 files)', files: cube },
  { id: 'omni', label: 'Omni · Sales (4 files)', files: omni },
  { id: 'dbt', label: 'dbt · Compiled Semantic Manifest', files: dbt },
  {
    id: 'microsoft',
    label: 'Power BI · Offline BIM (Needs Review)',
    files: microsoft,
  },
];

export function importExample(format: string): IImportFile[] {
  return (
    IMPORT_EXAMPLES.find((item) => item.id === format)?.files.map((file) => ({
      ...file,
    })) ?? []
  );
}
