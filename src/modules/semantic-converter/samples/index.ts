import omni from './omni_sales.yml?raw';
import nvidia from './nvidia_sales.yml?raw';
import retail from './tpcds_retail.yml?raw';

export const SAMPLES = [
  {
    id: 'omni',
    filename: 'omni_sales.yml',
    source: omni,
    target: 'omni',
    label: 'Omni Sales · ANSI_SQL',
    path: 'converters/omni/tests/fixtures/fixtureA_ossie.yaml',
  },
  {
    id: 'nvidia',
    filename: 'nvidia_sales.yml',
    source: nvidia,
    target: 'dbt',
    label: 'NVIDIA Sales · ANSI_SQL / SNOWFLAKE',
    path: 'converters/nvidia/tests/fixtures/sales.ossie.yaml',
  },
  {
    id: 'retail',
    filename: 'tpcds_retail.yml',
    source: retail,
    target: 'snowflake',
    label: 'TPC-DS Retail · ANSI_SQL',
    path: 'converters/orionbelt/tests/fixtures/tpcds_ossie.yaml',
  },
];

export const UPSTREAM_REVISION = 'eabe562128c4fe2ca4ec30780fa743317ca8a81e';
