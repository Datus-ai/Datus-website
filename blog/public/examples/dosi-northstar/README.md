# Northstar: verified DOSI semantic layer example

Synthetic retail data. Verified 2026-11-13 with Python 3.12.14 on macOS ARM64.
DOSI engine 0.1.13, DuckDB 1.5.6, PyYAML 6.0.3. This is a single-database
functional verification, not a performance or multi-warehouse benchmark.

## Reproduce

Use Python 3.12. Create a new environment in this directory:

    python3.12 -m venv .venv
    .venv/bin/python -m pip install -r requirements.txt
    .venv/bin/python setup_demo.py
    .venv/bin/python demo.py verify
    .venv/bin/python demo.py customers
    .venv/bin/python demo.py rule-a
    .venv/bin/python demo.py rule-b

On Windows use .venv/Scripts/python.exe instead. Installation requires network
access and packages compatible with your platform. Verification itself uses only
local files. The seed refuses to overwrite an existing northstar.duckdb; use a
fresh extraction to rerun the full seed sequence.

The archive deliberately excludes the generated database and virtual environment.
It includes nine raw CSVs, schema, semantic model, ontology overlay, independent
SQL, expected results and actual executed evidence. Re-running verify replaces
verification.json and model-validation.json; dated SQL snapshots describe the
original verified run. Source SQL freezes the order cohort and event cutoff.

## What is checked

Nine verification groups cover model validation, eight customer classifications,
source row counts and logical foreign keys, independent margin reconciliation,
shipping allocation, A/B rollups, lineage, all mapped entity queries and global
multi-fact metrics. No external LLM or cloud warehouse participates.

## Boundaries

The model pins Ossie 0.2.0.dev0 and DATUS extension 1.11, not the latest spec.
The ontology is a DOSI overlay; it is not claimed to be portable Ossie core.
Customer selection is compiled and executed by DOSI. The final cohort rollup is
explicit DuckDB SQL around that exact customer query. This release rejects the
ambiguous refund-to-customer path for the direct composed cohort query; the
verifier does not disguise that as a native DOSI aggregation. Inspect both SQLs.
No cloud execution, federation, MCP client or production workload was tested.
Membership approval and benefit activation are not performed by this example.

DOSI is Elastic License 2.0; Apache Ossie is the open specification. Dependency
licenses remain their own. Dataset and model files are a synthetic demonstration,
not real customer records. SHA256SUMS covers inputs and saved evidence.
