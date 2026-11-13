CREATE SCHEMA catalog;

CREATE SCHEMA commerce;

CREATE SCHEMA crm;

CREATE SCHEMA finance;

CREATE SCHEMA logistics;

CREATE SCHEMA membership;

CREATE SCHEMA returns;

CREATE SCHEMA semantic;

CREATE TABLE crm.dim_customer (customer_id BIGINT PRIMARY KEY, full_name VARCHAR, email VARCHAR, city VARCHAR, state VARCHAR, joined_at DATE, is_employee BOOLEAN, identity_status VARCHAR);

CREATE TABLE catalog.dim_product (product_id BIGINT PRIMARY KEY, sku VARCHAR, product_name VARCHAR, category VARCHAR, list_price_cents BIGINT, unit_cost_cents BIGINT, cost_version VARCHAR);

CREATE TABLE commerce.fct_orders (order_id BIGINT PRIMARY KEY, customer_id BIGINT, ordered_at DATE, delivered_at DATE, status VARCHAR, currency VARCHAR, is_test BOOLEAN, order_amount_cents BIGINT, is_returned BOOLEAN);

CREATE TABLE commerce.fct_order_lines (order_line_id BIGINT PRIMARY KEY, order_id BIGINT, product_id BIGINT, delivered_qty BIGINT, gross_sales_cents BIGINT, discount_cents BIGINT, FOREIGN KEY (order_id) REFERENCES commerce.fct_orders(order_id));

CREATE TABLE logistics.fct_order_logistics (order_id BIGINT PRIMARY KEY, shipping_cost_cents BIGINT);

CREATE TABLE finance.fct_order_line_costs (order_line_id BIGINT PRIMARY KEY, cogs_cents BIGINT, allocated_shipping_cents BIGINT, payment_fee_cents BIGINT);

CREATE TABLE returns.fct_return_events (return_event_id BIGINT PRIMARY KEY, order_line_id BIGINT, received_at DATE, status VARCHAR, returned_qty BIGINT, recoverable_cogs_credit_cents BIGINT, processing_cost_cents BIGINT);

CREATE TABLE finance.fct_refund_events (refund_event_id BIGINT PRIMARY KEY, order_line_id BIGINT, return_event_id BIGINT, posted_at DATE, status VARCHAR, merchandise_refund_cents BIGINT);

CREATE TABLE membership.fct_membership_terms (membership_term_id VARCHAR PRIMARY KEY, customer_id BIGINT, rule_version VARCHAR, valid_from DATE, valid_to DATE, benefit_version VARCHAR, status VARCHAR);

