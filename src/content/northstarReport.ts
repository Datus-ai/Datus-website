// Curated recorded demo data from Northstar-Premier-Demo/expected-results.json.
// Figures describe the fixed demo cohort, not customer or live product results.
export const NORTHSTAR_REPORT = {
  "policy": {
    "A": {
      "minimum_margin_usd": 3000,
      "minimum_orders": 6,
      "maximum_order_return_rate": 0.2
    },
    "B": {
      "minimum_margin_usd": 4000,
      "minimum_orders": 6,
      "maximum_order_return_rate": 0.2
    }
  },
  "customers": [
    {
      "customer_id": 1,
      "full_name": "Maya Chen",
      "booked_revenue": 19051.7,
      "refunds": 899.0,
      "margin": 7325.24,
      "orders": 8,
      "returned_orders": 1,
      "return_rate": 0.125,
      "delivered_units": 30,
      "returned_units": 1,
      "premier_a": 1,
      "premier_b": 1
    },
    {
      "customer_id": 2,
      "full_name": "Daniel Brooks",
      "booked_revenue": 7978.65,
      "refunds": 18.0,
      "margin": 3308.16,
      "orders": 7,
      "returned_orders": 0,
      "return_rate": 0.0,
      "delivered_units": 28,
      "returned_units": 0,
      "premier_a": 1,
      "premier_b": 0
    },
    {
      "customer_id": 3,
      "full_name": "Priya Shah",
      "booked_revenue": 10714.2,
      "refunds": 0.0,
      "margin": 4359.59,
      "orders": 5,
      "returned_orders": 0,
      "return_rate": 0.0,
      "delivered_units": 14,
      "returned_units": 0,
      "premier_a": 0,
      "premier_b": 0
    },
    {
      "customer_id": 4,
      "full_name": "Lucas Martin",
      "booked_revenue": 15036.45,
      "refunds": 2206.1,
      "margin": 5415.29,
      "orders": 9,
      "returned_orders": 3,
      "return_rate": 0.3333333333333333,
      "delivered_units": 35,
      "returned_units": 4,
      "premier_a": 0,
      "premier_b": 0
    },
    {
      "customer_id": 5,
      "full_name": "Sofia Rivera",
      "booked_revenue": 9272.25,
      "refunds": 786.65,
      "margin": 3188.49,
      "orders": 6,
      "returned_orders": 1,
      "return_rate": 0.16666666666666666,
      "delivered_units": 17,
      "returned_units": 1,
      "premier_a": 1,
      "premier_b": 0
    },
    {
      "customer_id": 6,
      "full_name": "Ethan Wilson",
      "booked_revenue": 490.2,
      "refunds": 129.0,
      "margin": 121.79,
      "orders": 3,
      "returned_orders": 1,
      "return_rate": 0.3333333333333333,
      "delivered_units": 4,
      "returned_units": 1,
      "premier_a": 0,
      "premier_b": 0
    },
    {
      "customer_id": 7,
      "full_name": "Amara Okafor",
      "booked_revenue": 5052.35,
      "refunds": 0.0,
      "margin": 2236.51,
      "orders": 4,
      "returned_orders": 0,
      "return_rate": 0.0,
      "delivered_units": 20,
      "returned_units": 0,
      "premier_a": 0,
      "premier_b": 0
    },
    {
      "customer_id": 8,
      "full_name": "Noah Kim",
      "booked_revenue": null,
      "refunds": null,
      "margin": null,
      "orders": 0,
      "returned_orders": 0,
      "return_rate": null,
      "delivered_units": 0,
      "returned_units": 0,
      "premier_a": 0,
      "premier_b": 0
    }
  ]
} as const;
