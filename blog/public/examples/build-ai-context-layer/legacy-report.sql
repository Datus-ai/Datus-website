-- Fictional source artifact: a report calculation, not the approved net-sales definition.
SELECT SUM(amount_usd) AS revenue
FROM orders
WHERE status = 'completed';
