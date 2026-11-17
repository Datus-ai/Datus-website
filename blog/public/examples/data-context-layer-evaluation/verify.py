"""Check the synthetic reference results. No Datus, authentication or cloud test."""
from pathlib import Path
import csv
import json
import sqlite3

HERE = Path(__file__).resolve().parent
conn = sqlite3.connect(":memory:")
conn.executescript("""
CREATE TABLE customers(customer_id TEXT PRIMARY KEY, region TEXT NOT NULL);
CREATE TABLE orders(order_id TEXT PRIMARY KEY, customer_id TEXT, order_date TEXT, status TEXT, amount_usd REAL);
CREATE TABLE sessions(session_id TEXT PRIMARY KEY, customer_id TEXT, session_date TEXT);
""")
for name in ("customers", "orders", "sessions"):
    with (HERE / (name + ".csv")).open(newline="") as stream:
        rows = list(csv.reader(stream))[1:]
    marks = ",".join("?" for _ in rows[0])
    conn.executemany("INSERT INTO " + name + " VALUES (" + marks + ")", rows)
conn.executescript((HERE / "reference.sql").read_text())
actual = {}
for view in ("purchasing_v1", "engaged_v1", "purchasing_candidate_v2"):
    actual[view] = [row[0] for row in conn.execute("SELECT customer_id FROM " + view + " ORDER BY customer_id")]
for view in ("purchasing_v1", "purchasing_candidate_v2"):
    actual[view + "_regions"] = dict(conn.execute("SELECT region, COUNT(*) FROM " + view + " GROUP BY region"))
actual["removed_by_candidate"] = sorted(set(actual["purchasing_v1"]) - set(actual["purchasing_candidate_v2"]))
expected = json.loads((HERE / "expected-results.json").read_text())
if actual != expected:
    raise SystemExit("Reference mismatch: " + json.dumps(actual, indent=2))
print(json.dumps(actual, indent=2))
print("PASS: six reference checks. These do not test product correctness, permissions, agent behavior, or export compatibility.")
