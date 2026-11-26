"""Recreate the sample database from the CSV files shipped with this demo."""
from pathlib import Path
import argparse,csv,json
import duckdb
P=Path(__file__).resolve().parent
parser=argparse.ArgumentParser();parser.add_argument('--database',default=str(P/'northstar.duckdb'));args=parser.parse_args()
target=Path(args.database)
if target.exists():raise SystemExit('Database already exists; refusing to overwrite it. Choose a new --database path.')
con=duckdb.connect(str(target));con.execute((P/'schema.sql').read_text())
for name,schema in json.loads((P/'source-map.json').read_text()).items():
 with (P/'source-tables'/(name+'.csv')).open() as f:
  reader=csv.reader(f);headers=next(reader);rows=[[None if value=='' else value for value in row] for row in reader]
  if rows:con.executemany(f'INSERT INTO {schema}.{name} VALUES ('+','.join('?' for _ in headers)+')',rows)
con.close();print('Created',target)
