# Apache Ossie examples

These three test fixtures are copied unchanged from Apache Ossie at the revision
and paths pinned in `sources.json`. The original Apache-2.0 headers, LICENSE and
NOTICE are retained. They contain test data and require no StarRocks adaptation.

- **Omni Sales** → Omni: success, multiple YAML files.
- **NVIDIA Sales** → dbt MetricFlow Manifest: success, one JSON file.
- **TPC-DS Retail** → Snowflake Cortex Analyst: partial, with metadata warnings.

Success means offline conversion checks passed; target import and execution still
need verification. The default target is a convenience, not a claim that every
example can be converted losslessly to every target.

Upstream references:
- https://github.com/apache/ossie/blob/main/converters/README.md
- https://github.com/apache/ossie-converters
