"""Compare the fictional definitions through DOSI; does not run a language model."""
from pathlib import Path
import argparse,csv,json,math,subprocess
P=Path(__file__).resolve().parent
p=argparse.ArgumentParser();p.add_argument('--db',default=str(P/'example.duckdb'));a=p.parse_args();db=str(Path(a.db).resolve())
with (P/'orders.csv').open() as f:
 rows=list(csv.DictReader(f))
assert len(rows)==4 and all(r['refund_usd']!='' for r in rows),'This policy fixture requires explicit refund values.'
def run(args):
 r=subprocess.run(['dosi']+args,capture_output=True,text=True,check=True);d=json.loads(r.stdout)
 if 'code' in d and 'message' in d:raise RuntimeError(d['message'])
 return d
reports={}
for name,metric in [('comparison-model.yaml','model_revenue,legacy_completed_sales,net_sales'),('reviewed-model.yaml','net_sales'),('existing-model.yaml','revenue')]:
 validation=run(['validate','--model',str(P/name),'--format','json']);assert not validation.get('issues') and not validation.get('compile_errors')
 query=run(['query','--model',str(P/name),'--connections',str(P/'local-profiles.yaml'),'--metrics',metric,'--execute','--db',db,'--format','json']);reports[name]={'validation':validation,'query':query}
assert reports['comparison-model.yaml']['query']['rows']==[{'model_revenue':450.0,'legacy_completed_sales':250.0,'net_sales':230.0}]
assert reports['reviewed-model.yaml']['query']['rows']==[{'net_sales':230.0}]
assert reports['existing-model.yaml']['query']['rows']==[{'revenue':450.0}]
grouped=run(['query','--model',str(P/'reviewed-model.yaml'),'--connections',str(P/'local-profiles.yaml'),'--metrics','net_sales','--group-by','orders.region','--execute','--db',db,'--format','json'])
assert {r['region']:r['net_sales'] for r in grouped['rows']}=={'East':130.0,'West':100.0}
result={'status':'PASS','dosi_cli':subprocess.check_output(['dosi','--version'],text=True).strip(),'scope':'Fictional operational net-sales source-comparison example; all source material and review choices are illustrative.','checks':['Four synthetic records have explicit refund amounts','All three model files structurally validate','Alternative definitions yield 450,250,230','Separate reviewed model returns 230','Reviewed regional values are East 130 and West 100'],'models':reports,'regional_query':grouped,'limits':['No LLM extraction session was executed','Review record is an illustrative method, not a Datus schema or a real approval','Single-user local fixture; no production data-access or cross-consumer certification']}
(P/'verification.json').write_text(json.dumps(result,indent=2)+'\n');print('PASS: source-model 450, legacy equivalent 250, reviewed net sales 230, East 130 / West 100.')
