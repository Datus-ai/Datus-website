NORTHSTAR DATA ONTOLOGY EXAMPLE

All records and people are fictional. This is an inspectable, read-only analytics
fixture, not an approval, benefit activation or access-control system.

Tested with DOSI CLI 0.2.2. Install the matching CLI from the official DOSI guide.
For database setup, install Python and duckdb (the fixture was rebuilt with
DuckDB Python 1.5.6). The verification script uses Python's standard library.

From the extracted directory:
  python setup_demo.py --database northstar.duckdb
  python verify.py --db northstar.duckdb

The database setup refuses to overwrite an existing file. Use another filename
if repeating setup. verify.py executes DOSI commands, not handwritten warehouse
analysis SQL. It saves compiled SQL and outputs to verification.json.

Files:
  northstar.ontology.yaml: 11 business concepts and 11 relationship roles
  northstar.mapping.yaml: separate bindings to the semantic model
  model.yaml: source datasets and measurements, including DATUS extensions
  schema.sql, source-map.json, source-tables/: 9 synthetic physical tables
  expected-results.json: saved fictional reference values
  local-profiles.yaml: explicitly empty profiles; no credentials or remote hosts
  verify.py: validation and read-only supported queries through DOSI CLI
  verification.json: executed results from the checked fixture

Eligibility A: margin >= USD 3000, distinct delivered orders >= 6,
order return rate <= 20%. Rule B raises margin to USD 4000.
Cohort: delivered orders [2025-09-20, 2026-09-20); received returns and posted
refunds before 2026-10-20 UTC. Source exclusions and fixed fields are in model.yaml.
Amounts are source USD cents, displayed customer margins are USD.
The inline benefit catalogue and entitlement interpretation add no transaction
or redemption records. Membership terms are distinct from qualification flags.

These three model/mapping files were extracted from the operator's local Northstar
fixture and split into separate documents. Current runtime compatibility was
checked for the included requests only. No cross-runtime, all-feature or
production-security certification is implied.
