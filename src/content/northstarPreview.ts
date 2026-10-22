// Curated from the supplied Northstar demo. Fictional data; recorded DOSI output.
export const NORTHSTAR = {
  "concepts": [
    {
      "name": "Customer",
      "dataset": "customers",
      "keys": [
        "customer_id"
      ],
      "properties": [
        {
          "name": "id",
          "field": "customers.customer_id",
          "type": "Integer"
        },
        {
          "name": "name",
          "field": "customers.full_name",
          "type": "String"
        },
        {
          "name": "email",
          "field": "customers.email",
          "type": "String"
        },
        {
          "name": "city",
          "field": "customers.city",
          "type": "String"
        },
        {
          "name": "margin",
          "field": "customers.customer_margin",
          "type": "Decimal"
        },
        {
          "name": "order_count",
          "field": "customers.customer_orders",
          "type": "Integer"
        },
        {
          "name": "return_rate",
          "field": "customers.customer_return_rate",
          "type": "Decimal"
        },
        {
          "name": "premier",
          "field": "customers.customer_premier",
          "type": "Boolean"
        },
        {
          "name": "premier_b",
          "field": "customers.customer_premier_b",
          "type": "Boolean"
        }
      ],
      "sources": [
        "crm.dim_customer"
      ],
      "sourceKind": "table"
    },
    {
      "name": "Order",
      "dataset": "orders",
      "keys": [
        "order_id"
      ],
      "properties": [
        {
          "name": "id",
          "field": "orders.order_id",
          "type": "Integer"
        },
        {
          "name": "delivered_at",
          "field": "orders.delivered_at",
          "type": "Date"
        },
        {
          "name": "amount_cents",
          "field": "orders.order_amount_cents",
          "type": "Integer"
        },
        {
          "name": "is_returned",
          "field": "orders.is_returned",
          "type": "Boolean"
        }
      ],
      "sources": [
        "commerce.fct_orders",
        "crm.dim_customer",
        "commerce.fct_order_lines"
      ],
      "sourceKind": "query"
    },
    {
      "name": "OrderLine",
      "dataset": "lines",
      "keys": [
        "order_line_id"
      ],
      "properties": [
        {
          "name": "id",
          "field": "lines.order_line_id",
          "type": "Integer"
        },
        {
          "name": "quantity",
          "field": "lines.delivered_qty",
          "type": "Integer"
        },
        {
          "name": "gross_cents",
          "field": "lines.gross_sales_cents",
          "type": "Integer"
        },
        {
          "name": "discount_cents",
          "field": "lines.discount_cents",
          "type": "Integer"
        }
      ],
      "sources": [
        "commerce.fct_order_lines",
        "commerce.fct_orders",
        "crm.dim_customer"
      ],
      "sourceKind": "query"
    },
    {
      "name": "Product",
      "dataset": "products",
      "keys": [
        "product_id"
      ],
      "properties": [
        {
          "name": "id",
          "field": "products.product_id",
          "type": "Integer"
        },
        {
          "name": "name",
          "field": "products.product_name",
          "type": "String"
        },
        {
          "name": "category",
          "field": "products.category",
          "type": "String"
        },
        {
          "name": "unit_cost_cents",
          "field": "products.unit_cost_cents",
          "type": "Integer"
        },
        {
          "name": "cost_version",
          "field": "products.cost_version",
          "type": "String"
        }
      ],
      "sources": [
        "catalog.dim_product"
      ],
      "sourceKind": "table"
    },
    {
      "name": "Delivery",
      "dataset": "deliveries",
      "keys": [
        "order_id"
      ],
      "properties": [
        {
          "name": "id",
          "field": "deliveries.order_id",
          "type": "Integer"
        },
        {
          "name": "shipping_cost_cents",
          "field": "deliveries.shipping_cost_cents",
          "type": "Integer"
        }
      ],
      "sources": [
        "logistics.fct_order_logistics",
        "commerce.fct_orders",
        "crm.dim_customer"
      ],
      "sourceKind": "query"
    },
    {
      "name": "LineCost",
      "dataset": "line_costs",
      "keys": [
        "order_line_id"
      ],
      "properties": [
        {
          "name": "id",
          "field": "line_costs.order_line_id",
          "type": "Integer"
        },
        {
          "name": "product_cost_cents",
          "field": "line_costs.cogs_cents",
          "type": "Integer"
        },
        {
          "name": "allocated_shipping_cents",
          "field": "line_costs.allocated_shipping_cents",
          "type": "Integer"
        },
        {
          "name": "payment_fee_cents",
          "field": "line_costs.payment_fee_cents",
          "type": "Integer"
        }
      ],
      "sources": [
        "finance.fct_order_line_costs",
        "commerce.fct_order_lines",
        "commerce.fct_orders",
        "crm.dim_customer"
      ],
      "sourceKind": "query"
    },
    {
      "name": "Return",
      "dataset": "returns",
      "keys": [
        "return_event_id"
      ],
      "properties": [
        {
          "name": "id",
          "field": "returns.return_event_id",
          "type": "Integer"
        },
        {
          "name": "quantity",
          "field": "returns.returned_qty",
          "type": "Integer"
        },
        {
          "name": "received_at",
          "field": "returns.received_at",
          "type": "Date"
        },
        {
          "name": "recovered_cost_cents",
          "field": "returns.recoverable_cogs_credit_cents",
          "type": "Integer"
        },
        {
          "name": "handling_cents",
          "field": "returns.processing_cost_cents",
          "type": "Integer"
        }
      ],
      "sources": [
        "returns.fct_return_events",
        "commerce.fct_order_lines",
        "commerce.fct_orders",
        "crm.dim_customer"
      ],
      "sourceKind": "query"
    },
    {
      "name": "Refund",
      "dataset": "refunds",
      "keys": [
        "refund_event_id"
      ],
      "properties": [
        {
          "name": "id",
          "field": "refunds.refund_event_id",
          "type": "Integer"
        },
        {
          "name": "amount_cents",
          "field": "refunds.merchandise_refund_cents",
          "type": "Integer"
        },
        {
          "name": "posted_at",
          "field": "refunds.posted_at",
          "type": "Date"
        }
      ],
      "sources": [
        "finance.fct_refund_events",
        "commerce.fct_order_lines",
        "commerce.fct_orders",
        "crm.dim_customer"
      ],
      "sourceKind": "query"
    },
    {
      "name": "Membership",
      "dataset": "memberships",
      "keys": [
        "membership_term_id"
      ],
      "properties": [
        {
          "name": "id",
          "field": "memberships.membership_term_id",
          "type": "String"
        },
        {
          "name": "valid_from",
          "field": "memberships.valid_from",
          "type": "Date"
        },
        {
          "name": "valid_to",
          "field": "memberships.valid_to",
          "type": "Date"
        },
        {
          "name": "rule_version",
          "field": "memberships.rule_version",
          "type": "String"
        },
        {
          "name": "benefit_version",
          "field": "memberships.benefit_version",
          "type": "String"
        }
      ],
      "sources": [
        "membership.fct_membership_terms"
      ],
      "sourceKind": "table"
    },
    {
      "name": "Benefit",
      "dataset": "benefits",
      "keys": [
        "benefit_id"
      ],
      "properties": [
        {
          "name": "id",
          "field": "benefits.benefit_id",
          "type": "String"
        },
        {
          "name": "description",
          "field": "benefits.description",
          "type": "String"
        }
      ],
      "sources": [],
      "sourceKind": "query"
    },
    {
      "name": "BenefitEntitlement",
      "dataset": "entitlements",
      "keys": [
        "entitlement_id"
      ],
      "properties": [
        {
          "name": "id",
          "field": "entitlements.entitlement_id",
          "type": "String"
        }
      ],
      "sources": [
        "membership.fct_membership_terms"
      ],
      "sourceKind": "query"
    }
  ],
  "relationships": [
    {
      "source": "Order",
      "target": "Customer",
      "name": "placed_by",
      "multiplicity": "ManyToOne",
      "realized_by": [
        "join:orders_to_customers"
      ]
    },
    {
      "source": "OrderLine",
      "target": "Order",
      "name": "part_of",
      "multiplicity": "ManyToOne",
      "realized_by": [
        "join:lines_to_orders"
      ]
    },
    {
      "source": "OrderLine",
      "target": "Product",
      "name": "purchases",
      "multiplicity": "ManyToOne",
      "realized_by": [
        "join:lines_to_products"
      ]
    },
    {
      "source": "Delivery",
      "target": "Order",
      "name": "fulfills",
      "multiplicity": "ManyToOne",
      "realized_by": [
        "join:deliveries_to_orders"
      ]
    },
    {
      "source": "LineCost",
      "target": "OrderLine",
      "name": "costs_of",
      "multiplicity": "ManyToOne",
      "realized_by": [
        "join:line_costs_to_lines"
      ]
    },
    {
      "source": "Return",
      "target": "OrderLine",
      "name": "returns_item",
      "multiplicity": "ManyToOne",
      "realized_by": [
        "join:returns_to_lines"
      ]
    },
    {
      "source": "Refund",
      "target": "OrderLine",
      "name": "credits",
      "multiplicity": "ManyToOne",
      "realized_by": [
        "join:refunds_to_lines"
      ]
    },
    {
      "source": "Refund",
      "target": "Return",
      "name": "triggered_by",
      "multiplicity": "ManyToOne",
      "realized_by": [
        "join:refunds_to_returns"
      ]
    },
    {
      "source": "Membership",
      "target": "Customer",
      "name": "held_by",
      "multiplicity": "ManyToOne",
      "realized_by": [
        "join:memberships_to_customers"
      ]
    },
    {
      "source": "BenefitEntitlement",
      "target": "Membership",
      "name": "granted_by",
      "multiplicity": "ManyToOne",
      "realized_by": [
        "join:entitlements_to_memberships"
      ]
    },
    {
      "source": "BenefitEntitlement",
      "target": "Benefit",
      "name": "provides",
      "multiplicity": "ManyToOne",
      "realized_by": [
        "join:entitlements_to_benefits"
      ]
    }
  ],
  "request": {
    "from": "customers",
    "fields": [
      "customers.customer_id",
      "customers.full_name",
      "customers.customer_margin",
      "customers.customer_orders",
      "customers.customer_return_rate"
    ],
    "where_sql": "customers.customer_premier = true",
    "limit": 10000
  },
  "compiledSql": "SELECT\n  customers.customer_id AS customer_id,\n  customers.full_name AS full_name,\n  CASE WHEN COALESCE(f0.fixed_order_count,\n  0) > 0 THEN COALESCE(f1.fixed_booked_revenue,\n  0) - COALESCE(f2.fixed_refund_amount,\n  0) - COALESCE(f3.fixed_product_cost,\n  0) + COALESCE(f4.fixed_recovered_product_cost,\n  0) - COALESCE(f5.fixed_outbound_shipping,\n  0) - COALESCE(f3.fixed_payment_fees,\n  0) - COALESCE(f4.fixed_return_handling,\n  0) END AS customer_margin,\n  COALESCE(COALESCE(f0.fixed_order_count,\n  0),\n  0) AS customer_orders,\n  COALESCE(COALESCE(f0.fixed_returned_order_count,\n  0),\n  0) * 1.0 / NULLIF(COALESCE(f0.fixed_order_count,\n  0),\n  0) AS customer_return_rate\nFROM crm.dim_customer AS customers\nLEFT JOIN (SELECT\n  orders.customer_id AS customer_id,\n  COUNT(DISTINCT orders.order_id) AS fixed_order_count,\n  COUNT(DISTINCT CASE WHEN orders.is_returned THEN orders.order_id END) AS fixed_returned_order_count\nFROM (SELECT\n  o.*\nFROM commerce.fct_orders AS o JOIN crm.dim_customer AS c USING (customer_id)\nWHERE o.status = 'delivered' AND NOT o.is_test AND o.delivered_at >= CAST('2025-09-20' AS DATE) AND o.delivered_at < CAST('2026-09-20' AS DATE) AND NOT c.is_employee AND c.identity_status = 'resolved' AND EXISTS(SELECT\n  1\nFROM commerce.fct_order_lines AS l\nWHERE l.order_id = o.order_id AND l.delivered_qty > 0)) AS orders\nGROUP BY orders.customer_id) AS f0\nON customers.customer_id = f0.customer_id\nLEFT JOIN (SELECT\n  customers.customer_id AS customer_id,\n  SUM((lines.gross_sales_cents - lines.discount_cents) * 0.01) AS fixed_booked_revenue\nFROM (SELECT\n  l.*\nFROM commerce.fct_order_lines AS l JOIN commerce.fct_orders AS o\nON l.order_id = o.order_id JOIN crm.dim_customer AS c\nON o.customer_id = c.customer_id\nWHERE o.status = 'delivered' AND NOT o.is_test AND o.delivered_at >= CAST('2025-09-20' AS DATE) AND o.delivered_at < CAST('2026-09-20' AS DATE) AND NOT c.is_employee AND c.identity_status = 'resolved' AND l.delivered_qty > 0) AS lines\nLEFT JOIN (SELECT\n  o.*\nFROM commerce.fct_orders AS o JOIN crm.dim_customer AS c USING (customer_id)\nWHERE o.status = 'delivered' AND NOT o.is_test AND o.delivered_at >= CAST('2025-09-20' AS DATE) AND o.delivered_at < CAST('2026-09-20' AS DATE) AND NOT c.is_employee AND c.identity_status = 'resolved' AND EXISTS(SELECT\n  1\nFROM commerce.fct_order_lines AS l\nWHERE l.order_id = o.order_id AND l.delivered_qty > 0)) AS orders\nON lines.order_id = orders.order_id\nLEFT JOIN crm.dim_customer AS customers\nON orders.customer_id = customers.customer_id\nGROUP BY customers.customer_id) AS f1\nON customers.customer_id = f1.customer_id\nLEFT JOIN (SELECT\n  refunds.customer_id AS customer_id,\n  SUM(refunds.merchandise_refund_cents * 0.01) AS fixed_refund_amount\nFROM (SELECT\n  a.*,\n  o.customer_id AS customer_id\nFROM finance.fct_refund_events AS a JOIN commerce.fct_order_lines AS l\nON a.order_line_id = l.order_line_id JOIN commerce.fct_orders AS o\nON l.order_id = o.order_id JOIN crm.dim_customer AS c\nON o.customer_id = c.customer_id\nWHERE o.status = 'delivered' AND NOT o.is_test AND o.delivered_at >= CAST('2025-09-20' AS DATE) AND o.delivered_at < CAST('2026-09-20' AS DATE) AND NOT c.is_employee AND c.identity_status = 'resolved' AND l.delivered_qty > 0 AND a.status = 'posted' AND a.posted_at < CAST('2026-10-20' AS DATE)) AS refunds\nGROUP BY refunds.customer_id) AS f2\nON customers.customer_id = f2.customer_id\nLEFT JOIN (SELECT\n  customers.customer_id AS customer_id,\n  SUM(line_costs.cogs_cents * 0.01) AS fixed_product_cost,\n  SUM(line_costs.payment_fee_cents * 0.01) AS fixed_payment_fees\nFROM (SELECT\n  a.*\nFROM finance.fct_order_line_costs AS a JOIN commerce.fct_order_lines AS l\nON a.order_line_id = l.order_line_id JOIN commerce.fct_orders AS o\nON l.order_id = o.order_id JOIN crm.dim_customer AS c\nON o.customer_id = c.customer_id\nWHERE o.status = 'delivered' AND NOT o.is_test AND o.delivered_at >= CAST('2025-09-20' AS DATE) AND o.delivered_at < CAST('2026-09-20' AS DATE) AND NOT c.is_employee AND c.identity_status = 'resolved' AND l.delivered_qty > 0) AS line_costs\nLEFT JOIN (SELECT\n  l.*\nFROM commerce.fct_order_lines AS l JOIN commerce.fct_orders AS o\nON l.order_id = o.order_id JOIN crm.dim_customer AS c\nON o.customer_id = c.customer_id\nWHERE o.status = 'delivered' AND NOT o.is_test AND o.delivered_at >= CAST('2025-09-20' AS DATE) AND o.delivered_at < CAST('2026-09-20' AS DATE) AND NOT c.is_employee AND c.identity_status = 'resolved' AND l.delivered_qty > 0) AS lines\nON line_costs.order_line_id = lines.order_line_id\nLEFT JOIN (SELECT\n  o.*\nFROM commerce.fct_orders AS o JOIN crm.dim_customer AS c USING (customer_id)\nWHERE o.status = 'delivered' AND NOT o.is_test AND o.delivered_at >= CAST('2025-09-20' AS DATE) AND o.delivered_at < CAST('2026-09-20' AS DATE) AND NOT c.is_employee AND c.identity_status = 'resolved' AND EXISTS(SELECT\n  1\nFROM commerce.fct_order_lines AS l\nWHERE l.order_id = o.order_id AND l.delivered_qty > 0)) AS orders\nON lines.order_id = orders.order_id\nLEFT JOIN crm.dim_customer AS customers\nON orders.customer_id = customers.customer_id\nGROUP BY customers.customer_id) AS f3\nON customers.customer_id = f3.customer_id\nLEFT JOIN (SELECT\n  customers.customer_id AS customer_id,\n  SUM(returns.recoverable_cogs_credit_cents * 0.01) AS fixed_recovered_product_cost,\n  SUM(returns.processing_cost_cents * 0.01) AS fixed_return_handling\nFROM (SELECT\n  a.*\nFROM returns.fct_return_events AS a JOIN commerce.fct_order_lines AS l\nON a.order_line_id = l.order_line_id JOIN commerce.fct_orders AS o\nON l.order_id = o.order_id JOIN crm.dim_customer AS c\nON o.customer_id = c.customer_id\nWHERE o.status = 'delivered' AND NOT o.is_test AND o.delivered_at >= CAST('2025-09-20' AS DATE) AND o.delivered_at < CAST('2026-09-20' AS DATE) AND NOT c.is_employee AND c.identity_status = 'resolved' AND l.delivered_qty > 0 AND a.status = 'received' AND a.received_at < CAST('2026-10-20' AS DATE)) AS returns\nLEFT JOIN (SELECT\n  l.*\nFROM commerce.fct_order_lines AS l JOIN commerce.fct_orders AS o\nON l.order_id = o.order_id JOIN crm.dim_customer AS c\nON o.customer_id = c.customer_id\nWHERE o.status = 'delivered' AND NOT o.is_test AND o.delivered_at >= CAST('2025-09-20' AS DATE) AND o.delivered_at < CAST('2026-09-20' AS DATE) AND NOT c.is_employee AND c.identity_status = 'resolved' AND l.delivered_qty > 0) AS lines\nON returns.order_line_id = lines.order_line_id\nLEFT JOIN (SELECT\n  o.*\nFROM commerce.fct_orders AS o JOIN crm.dim_customer AS c USING (customer_id)\nWHERE o.status = 'delivered' AND NOT o.is_test AND o.delivered_at >= CAST('2025-09-20' AS DATE) AND o.delivered_at < CAST('2026-09-20' AS DATE) AND NOT c.is_employee AND c.identity_status = 'resolved' AND EXISTS(SELECT\n  1\nFROM commerce.fct_order_lines AS l\nWHERE l.order_id = o.order_id AND l.delivered_qty > 0)) AS orders\nON lines.order_id = orders.order_id\nLEFT JOIN crm.dim_customer AS customers\nON orders.customer_id = customers.customer_id\nGROUP BY customers.customer_id) AS f4\nON customers.customer_id = f4.customer_id\nLEFT JOIN (SELECT\n  customers.customer_id AS customer_id,\n  SUM(deliveries.shipping_cost_cents * 0.01) AS fixed_outbound_shipping\nFROM (SELECT\n  d.*\nFROM logistics.fct_order_logistics AS d JOIN commerce.fct_orders AS o USING (order_id) JOIN crm.dim_customer AS c USING (customer_id)\nWHERE o.status = 'delivered' AND NOT o.is_test AND o.delivered_at >= CAST('2025-09-20' AS DATE) AND o.delivered_at < CAST('2026-09-20' AS DATE) AND NOT c.is_employee AND c.identity_status = 'resolved') AS deliveries\nLEFT JOIN (SELECT\n  o.*\nFROM commerce.fct_orders AS o JOIN crm.dim_customer AS c USING (customer_id)\nWHERE o.status = 'delivered' AND NOT o.is_test AND o.delivered_at >= CAST('2025-09-20' AS DATE) AND o.delivered_at < CAST('2026-09-20' AS DATE) AND NOT c.is_employee AND c.identity_status = 'resolved' AND EXISTS(SELECT\n  1\nFROM commerce.fct_order_lines AS l\nWHERE l.order_id = o.order_id AND l.delivered_qty > 0)) AS orders\nON deliveries.order_id = orders.order_id\nLEFT JOIN crm.dim_customer AS customers\nON orders.customer_id = customers.customer_id\nGROUP BY customers.customer_id) AS f5\nON customers.customer_id = f5.customer_id\nWHERE (COALESCE((CASE WHEN COALESCE(f0.fixed_order_count,\n  0) > 0 THEN COALESCE(f1.fixed_booked_revenue,\n  0) - COALESCE(f2.fixed_refund_amount,\n  0) - COALESCE(f3.fixed_product_cost,\n  0) + COALESCE(f4.fixed_recovered_product_cost,\n  0) - COALESCE(f5.fixed_outbound_shipping,\n  0) - COALESCE(f3.fixed_payment_fees,\n  0) - COALESCE(f4.fixed_return_handling,\n  0) END) >= 3000 AND COALESCE(f0.fixed_order_count,\n  0) >= 6 AND (COALESCE(COALESCE(f0.fixed_returned_order_count,\n  0),\n  0) * 1.0 / NULLIF(COALESCE(f0.fixed_order_count,\n  0),\n  0)) <= 0.20,\n  FALSE)) = TRUE\nLIMIT 10000",
  "columns": [
    "customer_id",
    "full_name",
    "customer_margin",
    "customer_orders",
    "customer_return_rate"
  ],
  "rows": [
    {
      "customer_id": 1,
      "full_name": "Maya Chen",
      "customer_margin": 7325.24,
      "customer_orders": 8,
      "customer_return_rate": 0.125
    },
    {
      "customer_id": 5,
      "full_name": "Sofia Rivera",
      "customer_margin": 3188.49,
      "customer_orders": 6,
      "customer_return_rate": 0.16666666666666666
    },
    {
      "customer_id": 2,
      "full_name": "Daniel Brooks",
      "customer_margin": 3308.16,
      "customer_orders": 7,
      "customer_return_rate": 0.0
    }
  ],
  "dialect": "duckdb",
  "sourceTables": [
    "crm.dim_customer",
    "catalog.dim_product",
    "commerce.fct_orders",
    "commerce.fct_order_lines",
    "logistics.fct_order_logistics",
    "finance.fct_order_line_costs",
    "returns.fct_return_events",
    "finance.fct_refund_events",
    "membership.fct_membership_terms"
  ]
} as const;
