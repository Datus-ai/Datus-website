SELECT region,
  SUM(CASE WHEN status = 'completed' AND is_test = 0
      THEN amount - COALESCE(refund_amount, 0)
      ELSE 0 END) AS net_order_revenue
FROM orders
WHERE order_date >= '2026-10-01'
  AND order_date < '2026-11-01'
GROUP BY region;
