"""Verify the fictional Northstar fixture through DOSI. Never handwrites analysis SQL."""
from pathlib import Path
import argparse,json,math,subprocess
P=Path(__file__).resolve().parent
parser=argparse.ArgumentParser();parser.add_argument('--db',default=str(P/'northstar.duckdb'));args=parser.parse_args()
def run(command):
 p=subprocess.run(['dosi']+command,text=True,capture_output=True,check=True)
 r=json.loads(p.stdout)
 if 'code' in r and 'message' in r:raise RuntimeError(r['message'])
 return r
common=['--mapping',str(P/'northstar.mapping.yaml')]
execution=common+['--connections',str(P/'local-profiles.yaml'),'--execute','--db',str(Path(args.db).resolve()),'--format','json']
validation=run(['validate']+common+['--format','json'])
assert not validation.get('issues') and not validation.get('compile_errors')
fields='Customer.id,Customer.name,Customer.margin,Customer.order_count,Customer.return_rate,Customer.premier,Customer.premier_b'
customers=run(['select','--from','Customer','--fields',fields]+execution)
expected=json.loads((P/'expected-results.json').read_text());wanted={r['customer_id']:r for r in expected['customers']}
assert len(customers['rows'])==len(wanted)==8
for row in customers['rows']:
 w=wanted[row['customer_id']]
 for got,key in [('customer_margin','margin'),('customer_return_rate','return_rate')]:
  assert (row[got] is None and w[key] is None) or (row[got] is not None and w[key] is not None and math.isclose(row[got],w[key],abs_tol=1e-8))
 assert row['customer_orders']==w['orders']
 assert row['customer_premier']==bool(w['premier_a']) and row['customer_premier_b']==bool(w['premier_b'])
eligible=run(['select','--from','Customer','--fields',fields,'--where','Customer.premier = true']+execution)
assert {r['customer_id'] for r in eligible['rows']}=={1,2,5}
assert {r['customer_id'] for r in customers['rows'] if r['customer_premier_b']}=={1}
lines=run(['select','--from','OrderLine','--fields','OrderLine.id,OrderLine.part_of.id,OrderLine.part_of.placed_by.name,OrderLine.purchases.name','--limit','3']+execution)
assert len(lines['rows'])==3 and all('lines_to_orders__orders_to_customers__full_name' in row for row in lines['rows'])
memberships=run(['select','--from','Membership','--fields','Membership.id,Membership.held_by.name,Membership.rule_version,Membership.benefit_version']+execution)
assert {r['membership_term_id'] for r in memberships['rows']}=={'M1','M2','M5'}
assert all(r['rule_version']=='A' and r['benefit_version']=='BENEFITS_V1' for r in memberships['rows'])
paths=run(['paths','--from','Refund','--to','Customer']+common+['--format','json'])
report={'status':'PASS','dosi_cli':subprocess.check_output(['dosi','--version'],text=True).strip(),'data':'Fictional Northstar Living fixture; no real customer data','checks':['Model validation','All 8 customer records match saved independent expectations','Rule A returns customer IDs 1,2,5; B returns 1','Executed multi-hop OrderLine request','Recorded memberships remain rule A and BENEFITS_V1'],'model_validation':validation,'customer_query':customers,'eligible_query':eligible,'line_query':lines,'membership_query':memberships,'refund_paths':paths}
(P/'verification.json').write_text(json.dumps(report,indent=2)+'\n')
print('PASS: model validation, 8 customer records, A/B flags, relationship query and memberships.')
