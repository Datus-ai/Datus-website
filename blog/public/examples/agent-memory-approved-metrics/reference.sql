SELECT SUM(CASE WHEN order_date < '2026-11-01' OR is_employee = 0
THEN amount - COALESCE(refund_amount, 0) ELSE 0 END) AS current_net_sales
FROM orders WHERE order_date >= '2026-10-01' AND order_date < '2027-01-01';
