-- Synthetic October fixture, date-only records already assigned to UTC days.
-- All windows are [2026-10-01, 2026-11-01). These are SQLite reference queries.
CREATE VIEW purchasing_v1 AS
SELECT DISTINCT c.customer_id, c.region
FROM customers c JOIN orders o ON c.customer_id=o.customer_id
WHERE o.status='completed' AND o.order_date>='2026-10-01' AND o.order_date<'2026-11-01';

CREATE VIEW engaged_v1 AS
SELECT DISTINCT c.customer_id, c.region
FROM customers c JOIN sessions s ON c.customer_id=s.customer_id
WHERE s.session_date>='2026-10-01' AND s.session_date<'2026-11-01';

-- Counterfactual candidate policy: at least one qualifying order >= USD 50.
-- This is an alternate rule on the same snapshot, not a live effective-date migration.
CREATE VIEW purchasing_candidate_v2 AS
SELECT DISTINCT c.customer_id, c.region
FROM customers c JOIN orders o ON c.customer_id=o.customer_id
WHERE o.status='completed' AND o.amount_usd>=50
AND o.order_date>='2026-10-01' AND o.order_date<'2026-11-01';
