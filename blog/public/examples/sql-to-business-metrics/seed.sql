-- Fictional USD orders for an illustrative calculation, not customer data.
CREATE TABLE orders (order_id INTEGER PRIMARY KEY, region TEXT, order_date TEXT, status TEXT, is_test INTEGER, amount REAL, refund_amount REAL);
INSERT INTO orders VALUES
(1,'North','2026-10-02','completed',0,120,20),
(2,'North','2026-10-05','completed',0,80,NULL),
(3,'South','2026-10-07','completed',0,100,10),
(4,'North','2026-10-12','completed',0,30,0),
(5,'South','2026-10-15','cancelled',0,50,0),
(6,'South','2026-10-18','completed',1,500,0),
(7,'North','2026-11-03','completed',0,60,0),
(8,'South','2026-11-05','completed',0,40,5);
