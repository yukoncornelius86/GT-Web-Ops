"""Release checks for the public site's navigation, metadata, and local asset graph."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,urljoin,unquote
from collections import Counter
import re,json,xml.etree.ElementTree as ET,importlib.util

ROOT=Path(__file__).resolve().parents[1]; SITE=ROOT/'sites/thegtcollective'
spec=importlib.util.spec_from_file_location('chrome',ROOT/'scripts/build-gt-public-chrome.py');chrome=importlib.util.module_from_spec(spec);spec.loader.exec_module(chrome)
errors=[];checked=0
class Page(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.links=[];self.assets=[];self.canonical=[];self.h1=0;self.ld=False;self.json=[];self.fields=[];self.labels=[]
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if a.get('id'):self.ids.append(a['id'])
  if t=='h1':self.h1+=1
  if t=='a' and a.get('href'):self.links.append(a['href'])
  if t in ['img','script'] and a.get('src'):self.assets.append(a['src'])
  if t=='link' and a.get('rel')=='stylesheet':self.assets.append(a['href'])
  if t=='link' and a.get('rel')=='canonical':self.canonical.append(a['href'])
  if t=='meta' and a.get('property')=='og:image':self.assets.append(a['content'])
  if t=='label' and a.get('for'):self.labels.append(a['for'])
  if t in ['input','select','textarea'] and a.get('type') not in ['hidden','checkbox']:self.fields.append(a)
  if t=='script' and a.get('type')=='application/ld+json':self.ld=True
 def handle_endtag(self,t):
  if t=='script':self.ld=False
 def handle_data(self,d):
  if self.ld:
   try:self.json.append(json.loads(d))
   except Exception:errors.append('Invalid JSON-LD')

cache={}
def parsed(p):
 if p not in cache:
  parser=Page();parser.feed(p.read_text(encoding='utf8'));cache[p]=parser
 return cache[p]

for name in chrome.PAGES:
 p=SITE/name;s=p.read_text(encoding='utf8');obj=parsed(p)
 for identifier,n in Counter(obj.ids).items():
  if n>1:errors.append(f'{name}: duplicate id {identifier}')
 if obj.h1!=1:errors.append(f'{name}: {obj.h1} H1s')
 if len(obj.canonical)!=1:errors.append(f'{name}: canonical count {len(obj.canonical)}')
 if s.count('GT SHARED HEADER START')!=1 or s.count('GT SHARED FOOTER START')!=1:errors.append(f'{name}: shared navigation missing')
 if re.search(r'\$1,?000',s):errors.append(f'{name}: old guidance')
 for target in obj.links+obj.assets:
  if target.startswith(('mailto:','tel:','data:')):continue
  u=urlsplit(urljoin('https://thegtcollective.com/'+name,target))
  if u.netloc!='thegtcollective.com':continue
  target_path=SITE/unquote(u.path.lstrip('/'))
  if target_path.is_dir():target_path=target_path/'index.html'
  if not target_path.exists():errors.append(f'{name}: missing target {target}');continue
  checked+=1
  if u.fragment and target_path.suffix=='.html' and u.fragment not in parsed(target_path).ids:errors.append(f'{name}: missing anchor {target}')
 if name=='consultation/index.html':
  for field in obj.fields:
   if field.get('id') not in obj.labels:errors.append('Form label missing: '+str(field))
  if 'data-action="booking_modal"' not in s:errors.append('Turnstile action changed')
  if '/file-drop/' in re.search(r'<form.*?</form>',s,re.S)[0]:errors.append('Invitation upload detour returned')

for loc in ET.parse(SITE/'sitemap.xml').getroot():
 url=loc.find('{http://www.sitemaps.org/schemas/sitemap/0.9}loc').text
 p=SITE/urlsplit(url).path.lstrip('/')
 if p.is_dir():p=p/'index.html'
 if not p.exists():errors.append('Sitemap missing page: '+url)

for name in ['assets/gt-inquiry.js','assets/gt-site.js']:
 if '/__qa/' in (SITE/name).read_text():errors.append('QA endpoint in production file: '+name)
if errors:print('\n'.join(errors));raise SystemExit(1)
print(f'PASS: {len(chrome.PAGES)} public pages, {checked} internal links/assets, sitemap, form labels, metadata, and price-guidance removal.')
