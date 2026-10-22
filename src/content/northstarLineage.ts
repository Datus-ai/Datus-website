// Recorded topology from Northstar-Premier-Demo/complete-lineage.json.
// Preserves all 32 nodes and 56 dependency edges; layout is presentation-only.
export const NORTHSTAR_LINEAGE = {
  "nodes": [
    {
      "id": "table:crm.dim_customer",
      "name": "crm.dim_customer",
      "kind": "physical_table",
      "layer": 0,
      "expression": ""
    },
    {
      "id": "table:catalog.dim_product",
      "name": "catalog.dim_product",
      "kind": "physical_table",
      "layer": 0,
      "expression": ""
    },
    {
      "id": "table:commerce.fct_orders",
      "name": "commerce.fct_orders",
      "kind": "physical_table",
      "layer": 0,
      "expression": ""
    },
    {
      "id": "table:commerce.fct_order_lines",
      "name": "commerce.fct_order_lines",
      "kind": "physical_table",
      "layer": 0,
      "expression": ""
    },
    {
      "id": "table:logistics.fct_order_logistics",
      "name": "logistics.fct_order_logistics",
      "kind": "physical_table",
      "layer": 0,
      "expression": ""
    },
    {
      "id": "table:finance.fct_order_line_costs",
      "name": "finance.fct_order_line_costs",
      "kind": "physical_table",
      "layer": 0,
      "expression": ""
    },
    {
      "id": "table:returns.fct_return_events",
      "name": "returns.fct_return_events",
      "kind": "physical_table",
      "layer": 0,
      "expression": ""
    },
    {
      "id": "table:finance.fct_refund_events",
      "name": "finance.fct_refund_events",
      "kind": "physical_table",
      "layer": 0,
      "expression": ""
    },
    {
      "id": "table:membership.fct_membership_terms",
      "name": "membership.fct_membership_terms",
      "kind": "physical_table",
      "layer": 0,
      "expression": ""
    },
    {
      "id": "dataset:customers",
      "name": "customers",
      "kind": "dataset",
      "layer": 1,
      "expression": "crm.dim_customer"
    },
    {
      "id": "dataset:products",
      "name": "products",
      "kind": "dataset",
      "layer": 1,
      "expression": "catalog.dim_product"
    },
    {
      "id": "dataset:orders",
      "name": "orders",
      "kind": "dataset",
      "layer": 1,
      "expression": "SELECT o.* FROM commerce.fct_orders o JOIN crm.dim_customer c USING(customer_id) WHERE o.status='delivered' AND NOT o.is_test AND o.delivered_at>=DATE '2025-09-20' AND o.delivered_at<DATE '2026-09-20' AND NOT c.is_employee AND c.identity_status='resolved' AND EXISTS (SELECT 1 FROM commerce.fct_order_lines l WHERE l.order_id=o.order_id AND l.delivered_qty>0)"
    },
    {
      "id": "dataset:lines",
      "name": "lines",
      "kind": "dataset",
      "layer": 1,
      "expression": "SELECT l.* FROM commerce.fct_order_lines l JOIN commerce.fct_orders o ON l.order_id=o.order_id JOIN crm.dim_customer c ON o.customer_id=c.customer_id WHERE o.status='delivered' AND NOT o.is_test AND o.delivered_at>=DATE '2025-09-20' AND o.delivered_at<DATE '2026-09-20' AND NOT c.is_employee AND c.identity_status='resolved' AND l.delivered_qty>0"
    },
    {
      "id": "dataset:deliveries",
      "name": "deliveries",
      "kind": "dataset",
      "layer": 1,
      "expression": "SELECT d.* FROM logistics.fct_order_logistics d JOIN commerce.fct_orders o USING(order_id) JOIN crm.dim_customer c USING(customer_id) WHERE o.status='delivered' AND NOT o.is_test AND o.delivered_at>=DATE '2025-09-20' AND o.delivered_at<DATE '2026-09-20' AND NOT c.is_employee AND c.identity_status='resolved'"
    },
    {
      "id": "dataset:line_costs",
      "name": "line_costs",
      "kind": "dataset",
      "layer": 1,
      "expression": "SELECT a.* FROM finance.fct_order_line_costs a JOIN commerce.fct_order_lines l ON a.order_line_id=l.order_line_id JOIN commerce.fct_orders o ON l.order_id=o.order_id JOIN crm.dim_customer c ON o.customer_id=c.customer_id WHERE o.status='delivered' AND NOT o.is_test AND o.delivered_at>=DATE '2025-09-20' AND o.delivered_at<DATE '2026-09-20' AND NOT c.is_employee AND c.identity_status='resolved' AND l.delivered_qty>0"
    },
    {
      "id": "dataset:returns",
      "name": "returns",
      "kind": "dataset",
      "layer": 1,
      "expression": "SELECT a.* FROM returns.fct_return_events a JOIN commerce.fct_order_lines l ON a.order_line_id=l.order_line_id JOIN commerce.fct_orders o ON l.order_id=o.order_id JOIN crm.dim_customer c ON o.customer_id=c.customer_id WHERE o.status='delivered' AND NOT o.is_test AND o.delivered_at>=DATE '2025-09-20' AND o.delivered_at<DATE '2026-09-20' AND NOT c.is_employee AND c.identity_status='resolved' AND l.delivered_qty>0 AND a.status='received' AND a.received_at<DATE '2026-10-20'"
    },
    {
      "id": "dataset:refunds",
      "name": "refunds",
      "kind": "dataset",
      "layer": 1,
      "expression": "SELECT a.*, o.customer_id AS customer_id FROM finance.fct_refund_events a JOIN commerce.fct_order_lines l ON a.order_line_id=l.order_line_id JOIN commerce.fct_orders o ON l.order_id=o.order_id JOIN crm.dim_customer c ON o.customer_id=c.customer_id WHERE o.status='delivered' AND NOT o.is_test AND o.delivered_at>=DATE '2025-09-20' AND o.delivered_at<DATE '2026-09-20' AND NOT c.is_employee AND c.identity_status='resolved' AND l.delivered_qty>0 AND a.status='posted' AND a.posted_at<DATE '2026-10-20'"
    },
    {
      "id": "dataset:memberships",
      "name": "memberships",
      "kind": "dataset",
      "layer": 1,
      "expression": "membership.fct_membership_terms"
    },
    {
      "id": "dataset:benefits",
      "name": "benefits",
      "kind": "dataset",
      "layer": 1,
      "expression": "SELECT 'STANDARD_DELIVERY' AS benefit_id, 'Two standard deliveries per membership year' AS description UNION ALL SELECT 'PRIORITY_SUPPORT' AS benefit_id, 'Priority customer support' AS description UNION ALL SELECT 'EARLY_ACCESS' AS benefit_id, 'Early access to collections' AS description UNION ALL SELECT 'DESIGN_CONSULTATION' AS benefit_id, 'One design consultation per membership year' AS description"
    },
    {
      "id": "dataset:entitlements",
      "name": "entitlements",
      "kind": "dataset",
      "layer": 1,
      "expression": "SELECT m.membership_term_id || ':' || b.benefit_id AS entitlement_id,m.membership_term_id,b.benefit_id FROM membership.fct_membership_terms m CROSS JOIN (SELECT 'STANDARD_DELIVERY' AS benefit_id, 'Two standard deliveries per membership year' AS description UNION ALL SELECT 'PRIORITY_SUPPORT' AS benefit_id, 'Priority customer support' AS description UNION ALL SELECT 'EARLY_ACCESS' AS benefit_id, 'Early access to collections' AS description UNION ALL SELECT 'DESIGN_CONSULTATION' AS benefit_id, 'One design consultation per membership year' AS description) b WHERE m.benefit_version='BENEFITS_V1'"
    },
    {
      "id": "metric:booked_revenue",
      "name": "booked_revenue",
      "kind": "metric_atomic",
      "layer": 2,
      "expression": "SUM((lines.gross_sales_cents-lines.discount_cents)*0.01)"
    },
    {
      "id": "metric:refund_amount",
      "name": "refund_amount",
      "kind": "metric_atomic",
      "layer": 2,
      "expression": "SUM(refunds.merchandise_refund_cents*0.01)"
    },
    {
      "id": "metric:product_cost",
      "name": "product_cost",
      "kind": "metric_atomic",
      "layer": 2,
      "expression": "SUM(line_costs.cogs_cents*0.01)"
    },
    {
      "id": "metric:recovered_product_cost",
      "name": "recovered_product_cost",
      "kind": "metric_atomic",
      "layer": 2,
      "expression": "SUM(returns.recoverable_cogs_credit_cents*0.01)"
    },
    {
      "id": "metric:outbound_shipping",
      "name": "outbound_shipping",
      "kind": "metric_atomic",
      "layer": 2,
      "expression": "SUM(deliveries.shipping_cost_cents*0.01)"
    },
    {
      "id": "metric:payment_fees",
      "name": "payment_fees",
      "kind": "metric_atomic",
      "layer": 2,
      "expression": "SUM(line_costs.payment_fee_cents*0.01)"
    },
    {
      "id": "metric:return_handling",
      "name": "return_handling",
      "kind": "metric_atomic",
      "layer": 2,
      "expression": "SUM(returns.processing_cost_cents*0.01)"
    },
    {
      "id": "metric:order_count",
      "name": "order_count",
      "kind": "metric_atomic",
      "layer": 2,
      "expression": "COUNT(DISTINCT orders.order_id)"
    },
    {
      "id": "metric:returned_order_count",
      "name": "returned_order_count",
      "kind": "metric_atomic",
      "layer": 2,
      "expression": "COUNT(DISTINCT CASE WHEN orders.is_returned THEN orders.order_id END)"
    },
    {
      "id": "metric:qualified_customer_count",
      "name": "qualified_customer_count",
      "kind": "metric_atomic",
      "layer": 2,
      "expression": "COUNT(DISTINCT customers.customer_id)"
    },
    {
      "id": "metric:contribution_margin",
      "name": "contribution_margin",
      "kind": "metric_derived",
      "layer": 3,
      "expression": "COALESCE(booked_revenue,0)-COALESCE(refund_amount,0)-COALESCE(product_cost,0)+COALESCE(recovered_product_cost,0)-COALESCE(outbound_shipping,0)-COALESCE(payment_fees,0)-COALESCE(return_handling,0)"
    },
    {
      "id": "metric:order_return_rate",
      "name": "order_return_rate",
      "kind": "metric_derived",
      "layer": 3,
      "expression": "returned_order_count*1.0/NULLIF(order_count,0)"
    }
  ],
  "edges": [
    {
      "id": "reads_table:table:crm.dim_customer->dataset:customers",
      "source": "table:crm.dim_customer",
      "target": "dataset:customers",
      "kind": "reads_table"
    },
    {
      "id": "reads_table:table:catalog.dim_product->dataset:products",
      "source": "table:catalog.dim_product",
      "target": "dataset:products",
      "kind": "reads_table"
    },
    {
      "id": "reads_table:table:commerce.fct_orders->dataset:orders",
      "source": "table:commerce.fct_orders",
      "target": "dataset:orders",
      "kind": "reads_table"
    },
    {
      "id": "reads_table:table:crm.dim_customer->dataset:orders",
      "source": "table:crm.dim_customer",
      "target": "dataset:orders",
      "kind": "reads_table"
    },
    {
      "id": "reads_table:table:commerce.fct_order_lines->dataset:orders",
      "source": "table:commerce.fct_order_lines",
      "target": "dataset:orders",
      "kind": "reads_table"
    },
    {
      "id": "reads_table:table:commerce.fct_order_lines->dataset:lines",
      "source": "table:commerce.fct_order_lines",
      "target": "dataset:lines",
      "kind": "reads_table"
    },
    {
      "id": "reads_table:table:commerce.fct_orders->dataset:lines",
      "source": "table:commerce.fct_orders",
      "target": "dataset:lines",
      "kind": "reads_table"
    },
    {
      "id": "reads_table:table:crm.dim_customer->dataset:lines",
      "source": "table:crm.dim_customer",
      "target": "dataset:lines",
      "kind": "reads_table"
    },
    {
      "id": "reads_table:table:logistics.fct_order_logistics->dataset:deliveries",
      "source": "table:logistics.fct_order_logistics",
      "target": "dataset:deliveries",
      "kind": "reads_table"
    },
    {
      "id": "reads_table:table:commerce.fct_orders->dataset:deliveries",
      "source": "table:commerce.fct_orders",
      "target": "dataset:deliveries",
      "kind": "reads_table"
    },
    {
      "id": "reads_table:table:crm.dim_customer->dataset:deliveries",
      "source": "table:crm.dim_customer",
      "target": "dataset:deliveries",
      "kind": "reads_table"
    },
    {
      "id": "reads_table:table:finance.fct_order_line_costs->dataset:line_costs",
      "source": "table:finance.fct_order_line_costs",
      "target": "dataset:line_costs",
      "kind": "reads_table"
    },
    {
      "id": "reads_table:table:commerce.fct_order_lines->dataset:line_costs",
      "source": "table:commerce.fct_order_lines",
      "target": "dataset:line_costs",
      "kind": "reads_table"
    },
    {
      "id": "reads_table:table:commerce.fct_orders->dataset:line_costs",
      "source": "table:commerce.fct_orders",
      "target": "dataset:line_costs",
      "kind": "reads_table"
    },
    {
      "id": "reads_table:table:crm.dim_customer->dataset:line_costs",
      "source": "table:crm.dim_customer",
      "target": "dataset:line_costs",
      "kind": "reads_table"
    },
    {
      "id": "reads_table:table:returns.fct_return_events->dataset:returns",
      "source": "table:returns.fct_return_events",
      "target": "dataset:returns",
      "kind": "reads_table"
    },
    {
      "id": "reads_table:table:commerce.fct_order_lines->dataset:returns",
      "source": "table:commerce.fct_order_lines",
      "target": "dataset:returns",
      "kind": "reads_table"
    },
    {
      "id": "reads_table:table:commerce.fct_orders->dataset:returns",
      "source": "table:commerce.fct_orders",
      "target": "dataset:returns",
      "kind": "reads_table"
    },
    {
      "id": "reads_table:table:crm.dim_customer->dataset:returns",
      "source": "table:crm.dim_customer",
      "target": "dataset:returns",
      "kind": "reads_table"
    },
    {
      "id": "reads_table:table:finance.fct_refund_events->dataset:refunds",
      "source": "table:finance.fct_refund_events",
      "target": "dataset:refunds",
      "kind": "reads_table"
    },
    {
      "id": "reads_table:table:commerce.fct_order_lines->dataset:refunds",
      "source": "table:commerce.fct_order_lines",
      "target": "dataset:refunds",
      "kind": "reads_table"
    },
    {
      "id": "reads_table:table:commerce.fct_orders->dataset:refunds",
      "source": "table:commerce.fct_orders",
      "target": "dataset:refunds",
      "kind": "reads_table"
    },
    {
      "id": "reads_table:table:crm.dim_customer->dataset:refunds",
      "source": "table:crm.dim_customer",
      "target": "dataset:refunds",
      "kind": "reads_table"
    },
    {
      "id": "reads_table:table:membership.fct_membership_terms->dataset:memberships",
      "source": "table:membership.fct_membership_terms",
      "target": "dataset:memberships",
      "kind": "reads_table"
    },
    {
      "id": "reads_table:table:membership.fct_membership_terms->dataset:entitlements",
      "source": "table:membership.fct_membership_terms",
      "target": "dataset:entitlements",
      "kind": "reads_table"
    },
    {
      "id": "join:lines_to_orders",
      "source": "dataset:lines",
      "target": "dataset:orders",
      "kind": "join"
    },
    {
      "id": "join:orders_to_customers",
      "source": "dataset:orders",
      "target": "dataset:customers",
      "kind": "join"
    },
    {
      "id": "join:lines_to_products",
      "source": "dataset:lines",
      "target": "dataset:products",
      "kind": "join"
    },
    {
      "id": "join:line_costs_to_lines",
      "source": "dataset:line_costs",
      "target": "dataset:lines",
      "kind": "join"
    },
    {
      "id": "join:deliveries_to_orders",
      "source": "dataset:deliveries",
      "target": "dataset:orders",
      "kind": "join"
    },
    {
      "id": "join:returns_to_lines",
      "source": "dataset:returns",
      "target": "dataset:lines",
      "kind": "join"
    },
    {
      "id": "join:refunds_to_lines",
      "source": "dataset:refunds",
      "target": "dataset:lines",
      "kind": "join"
    },
    {
      "id": "join:memberships_to_customers",
      "source": "dataset:memberships",
      "target": "dataset:customers",
      "kind": "join"
    },
    {
      "id": "join:entitlements_to_memberships",
      "source": "dataset:entitlements",
      "target": "dataset:memberships",
      "kind": "join"
    },
    {
      "id": "join:entitlements_to_benefits",
      "source": "dataset:entitlements",
      "target": "dataset:benefits",
      "kind": "join"
    },
    {
      "id": "join:refunds_to_returns",
      "source": "dataset:refunds",
      "target": "dataset:returns",
      "kind": "join"
    },
    {
      "id": "join:refunds_customer_grain_alignment",
      "source": "dataset:refunds",
      "target": "dataset:customers",
      "kind": "join"
    },
    {
      "id": "aggregates:dataset:lines->metric:booked_revenue",
      "source": "dataset:lines",
      "target": "metric:booked_revenue",
      "kind": "aggregates"
    },
    {
      "id": "aggregates:dataset:refunds->metric:refund_amount",
      "source": "dataset:refunds",
      "target": "metric:refund_amount",
      "kind": "aggregates"
    },
    {
      "id": "aggregates:dataset:line_costs->metric:product_cost",
      "source": "dataset:line_costs",
      "target": "metric:product_cost",
      "kind": "aggregates"
    },
    {
      "id": "aggregates:dataset:returns->metric:recovered_product_cost",
      "source": "dataset:returns",
      "target": "metric:recovered_product_cost",
      "kind": "aggregates"
    },
    {
      "id": "aggregates:dataset:deliveries->metric:outbound_shipping",
      "source": "dataset:deliveries",
      "target": "metric:outbound_shipping",
      "kind": "aggregates"
    },
    {
      "id": "aggregates:dataset:line_costs->metric:payment_fees",
      "source": "dataset:line_costs",
      "target": "metric:payment_fees",
      "kind": "aggregates"
    },
    {
      "id": "aggregates:dataset:returns->metric:return_handling",
      "source": "dataset:returns",
      "target": "metric:return_handling",
      "kind": "aggregates"
    },
    {
      "id": "aggregates:dataset:orders->metric:order_count",
      "source": "dataset:orders",
      "target": "metric:order_count",
      "kind": "aggregates"
    },
    {
      "id": "aggregates:dataset:orders->metric:returned_order_count",
      "source": "dataset:orders",
      "target": "metric:returned_order_count",
      "kind": "aggregates"
    },
    {
      "id": "aggregates:dataset:customers->metric:qualified_customer_count",
      "source": "dataset:customers",
      "target": "metric:qualified_customer_count",
      "kind": "aggregates"
    },
    {
      "id": "compose_member:metric:booked_revenue->metric:contribution_margin#0",
      "source": "metric:booked_revenue",
      "target": "metric:contribution_margin",
      "kind": "compose_member"
    },
    {
      "id": "compose_member:metric:refund_amount->metric:contribution_margin#1",
      "source": "metric:refund_amount",
      "target": "metric:contribution_margin",
      "kind": "compose_member"
    },
    {
      "id": "compose_member:metric:product_cost->metric:contribution_margin#2",
      "source": "metric:product_cost",
      "target": "metric:contribution_margin",
      "kind": "compose_member"
    },
    {
      "id": "compose_member:metric:recovered_product_cost->metric:contribution_margin#3",
      "source": "metric:recovered_product_cost",
      "target": "metric:contribution_margin",
      "kind": "compose_member"
    },
    {
      "id": "compose_member:metric:outbound_shipping->metric:contribution_margin#4",
      "source": "metric:outbound_shipping",
      "target": "metric:contribution_margin",
      "kind": "compose_member"
    },
    {
      "id": "compose_member:metric:payment_fees->metric:contribution_margin#5",
      "source": "metric:payment_fees",
      "target": "metric:contribution_margin",
      "kind": "compose_member"
    },
    {
      "id": "compose_member:metric:return_handling->metric:contribution_margin#6",
      "source": "metric:return_handling",
      "target": "metric:contribution_margin",
      "kind": "compose_member"
    },
    {
      "id": "compose_member:metric:returned_order_count->metric:order_return_rate#0",
      "source": "metric:returned_order_count",
      "target": "metric:order_return_rate",
      "kind": "compose_member"
    },
    {
      "id": "compose_member:metric:order_count->metric:order_return_rate#1",
      "source": "metric:order_count",
      "target": "metric:order_return_rate",
      "kind": "compose_member"
    }
  ]
};
