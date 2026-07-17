export const SAMPLE_METRICFLOW = `# MetricFlow semantic model — paste your own or edit this one.
semantic_models:
  - name: orders
    description: Fact table of customer orders
    model: ref('fct_orders')
    entities:
      - name: order_id
        type: primary
      - name: customer_id
        type: foreign
    dimensions:
      - name: order_date
        type: time
        type_params:
          time_granularity: day
      - name: status
        type: categorical
    measures:
      - name: order_total
        agg: sum
        expr: amount_usd
        description: Gross order value in USD
      - name: order_count
        agg: count
        expr: order_id

metrics:
  - name: revenue
    type: simple
    description: Total revenue across all orders
    type_params:
      measure: order_total
`;

export const SAMPLE_METRICFLOW_INVALID = `# Missing required 'name' on the semantic_model — Validator should flag this.
semantic_models:
  - description: broken model
    measures:
      - name: order_total
        agg: sum
`;
