-- Six illustrative orders. Completed revenue = 330; four completed orders;
-- average order value = 82.5. Cancelled orders are excluded from the metrics.
CREATE TABLE orders (
  order_id INTEGER,
  customer_id INTEGER,
  order_date DATE,
  status VARCHAR,
  amount DECIMAL(12, 2)
);
INSERT INTO orders VALUES
  (1, 1, DATE '2026-01-05', 'completed', 120),
  (2, 1, DATE '2026-01-20', 'completed', 30),
  (3, 2, DATE '2026-02-10', 'completed', 80),
  (4, 2, DATE '2026-02-15', 'cancelled', 60),
  (5, 3, DATE '2026-02-20', 'completed', 100),
  (6, 1, DATE '2026-03-01', 'cancelled', 40);

CREATE TABLE customers (
  customer_id INTEGER,
  region VARCHAR
);
INSERT INTO customers VALUES
  (1, 'east'),
  (2, 'west'),
  (3, 'east');
