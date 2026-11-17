# Data context layer evaluation: Northstar customer fixture

Synthetic data for the Datus blog article, not a customer dataset or a product benchmark.

## Run the reference checks

With Python 3 installed, run `python3 verify.py` from this directory. Only the Python standard library is used. The script creates an in-memory SQLite database and prints six checked results; it makes no network calls and writes no database file.

## Definitions

Window: 2026-10-01 inclusive to 2026-11-01 exclusive. Dates represent UTC calendar days; no timestamp/time-zone conversion is being tested. Each customer belongs to one fixed region in this fixture. All amounts are USD.

- purchasing_v1: distinct customers with at least one completed order in the window. Completed orders remain qualifying; orders marked refunded or cancelled do not. This fixture does not model partial refunds.
- engaged_v1: distinct customers with at least one session in the window.
- purchasing_candidate_v2: a proposed alternative, requiring at least one completed order of at least USD 50 in the window. This is not a USD 50 monthly-total rule.

The candidate uses the same frozen October input as v1 to isolate a definition change. It is not an automatic effective-date implementation. The original definition is preserved as a separate view.

Expected purchasing v1 customers: C001, C004, C005. C001 is counted once despite two orders. C002 only bought in September. C003 is refunded. C006 is cancelled.
Expected engaged customers: C001, C002, C003, C006. C005's November 1 session is outside the window.
Candidate v2 removes C005 (USD 40 order), leaving C001 and C004.

## What the package establishes

The CSV fixture and reference SQL reproduce the expected membership and regional breakdowns. Region grouping is a calculation check, NOT row-level authorization. This package is not an OSI/DOSI model and has not been run through a Datus Agent, Studio or any other vendor. Runtime access, identity propagation, synchronization, export and replay must be tested separately on your actual deployment.

## Record the demo evidence

Use demo-evidence.csv to record the platform, exact model revision, runtime, source snapshot and observation for each check. Leave untested capabilities marked Not tested. Do not enter passwords, tokens or real personal data in the worksheet or export bundle.
