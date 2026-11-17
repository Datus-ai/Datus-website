#!/usr/bin/env python3
"""Run DOSI-compiled, PostgreSQL-target SQL unchanged on a SQLite sample.
Requires Python 3 and the dosi binary. Does not call a cloud service or an Agent.
ISO business dates and this small SQL subset are compatible with SQLite.
This does not certify PostgreSQL behavior or live Studio governance.
"""
import json
import shutil
import sqlite3
import subprocess
from pathlib import Path

root = Path(__file__).resolve().parent
binary = shutil.which('dosi')
if not binary:
    raise SystemExit('Install DOSI and put dosi on PATH to run these checks.')

def dosi(*args):
    return json.loads(subprocess.check_output([
        binary, '--model', str(root / 'model.yaml'), '--format', 'json', *args
    ], text=True))

validation = dosi('validate')
assert not any(validation.get(k) for k in ('issues', 'compile_errors', 'warnings')), validation
metrics = ['legacy_net_sales', 'current_net_sales', 'restated_net_sales']
compiled = dosi('query', '--metrics', ','.join(metrics), '--dialect', 'postgres',
    '--where', "orders.order_date >= '2026-10-01' AND orders.order_date < '2027-01-01'")
conn = sqlite3.connect(':memory:')
conn.executescript((root / 'seed.sql').read_text())
checks = []

def check(name, expected):
    values = list(conn.execute(compiled['sql']).fetchone())
    reference = conn.execute((root / 'reference.sql').read_text()).fetchone()[0]
    assert values == expected, (name, values, expected)
    assert reference == expected[1], (name, reference)
    checks.append({'case': name, 'expected': expected, 'actual': values, 'independent_reference': reference})

check('Three published sample orders', [570, 470, 270])
conn.execute("INSERT INTO orders VALUES (4,'2026-10-31',1,50,0)")
conn.execute("INSERT INTO orders VALUES (5,'2026-11-01',1,70,0)")
check('Employee orders before and on the effective date', [690, 520, 270])
conn.execute("INSERT INTO orders VALUES (6,'2026-11-02',0,40,NULL)")
check('Missing refund counts as zero for an included order', [730, 560, 310])
conn.execute("INSERT INTO orders VALUES (7,'2027-01-01',0,1000,0)")
check('Exclusive quarter end removes the January order', [730, 560, 310])
print(json.dumps({'dosi_version': subprocess.check_output([binary, '--version'], text=True).strip(),
    'execution': 'Unmodified PostgreSQL-target SQL, executed locally with SQLite',
    'validation': validation, 'metric_order': metrics, 'compiled_sql': compiled['sql'],
    'checks': checks, 'limitations': 'No live Studio, Agent, Hub or warehouse integration test.'}, indent=2))
