from pathlib import Path
import argparse,csv,duckdb
P=Path(__file__).resolve().parent
p=argparse.ArgumentParser();p.add_argument('--db',default=str(P/'example.duckdb'));a=p.parse_args();d=Path(a.db)
if d.exists():raise SystemExit('Refusing to overwrite an existing database.')
c=duckdb.connect(str(d));c.execute('CREATE TABLE orders(order_id VARCHAR PRIMARY KEY, region VARCHAR, status VARCHAR, amount_usd DECIMAL(12,2), refund_usd DECIMAL(12,2), completed_date DATE)')
with (P/'orders.csv').open() as f:
 rows=[[None if value=='' else value for value in row] for row in list(csv.reader(f))[1:]]
c.executemany('INSERT INTO orders VALUES (?, ?, ?, ?, ?, ?)',rows);c.close();print('Created fictional fixture database.')
