BUILDING AN AI CONTEXT LAYER — FICTIONAL SOURCE-COMPARISON FIXTURE

All records, policy material and review choices are illustrative, not real
Finance approvals. The source model and SQL describe different calculations.
The model executions are actual DOSI requests; no LLM extraction was run.

Requirements: DOSI CLI 0.2.2; Python with duckdb (tested with DuckDB Python 1.5.6).
From the extracted directory:
  python setup.py --db example.duckdb
  python verify.py --db example.duckdb

setup.py refuses to overwrite an existing database. The verifier uses DOSI's
query interface and an explicitly empty local profile file. It does not issue
handwritten analysis SQL to the database or connect to a remote service.

SOURCE ARTIFACTS
  finance-policy.md — intended operational net sales in this exercise
  legacy-report.sql — completed sales before refunds, not run as a raw query
  existing-model.yaml — original metric named revenue, all order amounts
  orders.csv — four fictional records; all refund values explicitly supplied

REVIEW AND EXECUTION ARTIFACTS
  review-decision.json — suggested review record, NOT a Datus config schema
  comparison-model.yaml — diagnostic metrics reproducing all three definitions
  reviewed-model.yaml — selected net-sales definition for this teaching case
  verification.json — executed SQL, totals, grouped results and limits

Expected values: original model 450 USD, legacy-equivalent completed sales
250 USD, reviewed operational net sales 230 USD; East 130 and West 100.
Refunds are attributed back to completion date for this example; this is not
an accounting revenue-recognition or refund-posting-date model.
This fixture is not an ingestion service, business-policy authority, production
approval workflow, row/column access-control test or universal null-handling model.
The verifier checks explicit refund values in these records before execution.
