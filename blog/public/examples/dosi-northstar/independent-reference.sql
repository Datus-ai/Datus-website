WITH lc AS (
 SELECT l.order_id,SUM(l.delivered_qty*p.unit_cost_cents) product_cost,SUM(k.payment_fee_cents) fee
 FROM commerce.fct_order_lines l JOIN catalog.dim_product p USING(product_id) JOIN finance.fct_order_line_costs k USING(order_line_id) GROUP BY l.order_id
), rr AS (
 SELECT l.order_id,SUM(r.recoverable_cogs_credit_cents-r.processing_cost_cents) adjustment
 FROM returns.fct_return_events r JOIN commerce.fct_order_lines l USING(order_line_id)
 WHERE r.status='received' AND r.received_at<'2026-10-20' GROUP BY l.order_id
), rf AS (
 SELECT l.order_id,SUM(f.merchandise_refund_cents) refund
 FROM finance.fct_refund_events f JOIN commerce.fct_order_lines l USING(order_line_id)
 WHERE f.status='posted' AND f.posted_at<'2026-10-20' GROUP BY l.order_id
)
SELECT customer_id,SUM(o.order_amount_cents-lc.product_cost-lc.fee-g.shipping_cost_cents+COALESCE(rr.adjustment,0)-COALESCE(rf.refund,0)) margin_cents
FROM commerce.fct_orders o JOIN lc USING(order_id) JOIN logistics.fct_order_logistics g USING(order_id)
LEFT JOIN rr USING(order_id) LEFT JOIN rf USING(order_id)
JOIN crm.dim_customer cu USING(customer_id)
WHERE o.status='delivered' AND o.is_test=0 AND cu.is_employee=0 AND cu.identity_status='resolved'
AND o.delivered_at>='2025-09-20' AND o.delivered_at<'2026-09-20'
GROUP BY customer_id