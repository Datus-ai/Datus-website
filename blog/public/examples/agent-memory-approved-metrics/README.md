# Agent memory and a changed metric: reproducible calculation example

All data and policy decisions are fictional. The three original orders produce:

- Legacy policy (include employee orders): 570.
- Prospective policy (exclude employee orders dated November 1 onward): 470.
- Restated policy (exclude employee orders throughout the quarter): 270.

Dates are UTC business dates. The query covers 2026-10-01 inclusive through
2027-01-01 exclusive. Refunds reduce included orders; missing refunds are zero.
This is an operating metric example, not an accounting recommendation.

## Run

With Python 3 and DOSI installed, run `python3 verify.py` in this folder.
The script validates the model, compiles three named metrics with DOSI, executes
the emitted PostgreSQL-target SQL unchanged in an in-memory SQLite database,
and compares the prospective result with independently written reference SQL.
It adds boundary, missing-refund, and out-of-period cases after the base check.

The simple SQL subset and ISO text dates in this example work in SQLite. This
is not a PostgreSQL integration test, a live Studio demonstration, or evidence
that an Agent automatically chooses the correct policy. No network, credentials,
or production database are needed. `verified-results.json` records the local run.
