-- Fictional USD orders. ISO dates represent UTC business dates.
CREATE TABLE orders (order_id INTEGER PRIMARY KEY, order_date TEXT, is_employee INTEGER, amount REAL, refund_amount REAL);
INSERT INTO orders VALUES (1,'2026-10-15',1,200,0), (2,'2026-11-05',1,100,0), (3,'2026-11-06',0,300,30);
