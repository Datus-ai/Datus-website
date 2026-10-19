# Vendor import examples

These small, authored test definitions are copied from the Datus Studio import
workbench. They contain no customer data and are not represented as verbatim
Apache fixtures. All files in a JSON array form one complete import bundle.

- `cube.json`: orders, customers and a commerce view; expected clean import.
- `omni.json`: orders/customers views, relationships and a sales topic; clean import.
- `dbt.json`: a compiled MetricFlow semantic manifest; clean import, not raw dbt YAML.
- `microsoft.json`: an offline BIM model; expected native-expression review diagnostics.

Verify with the deployed converter's source catalog. Source-specific import
limitations are documented by Apache at:

- https://github.com/apache/ossie/blob/main/converters/README.md
- https://github.com/apache/ossie-converters

Changing examples should include a real conversion check, not only JSON parsing.
