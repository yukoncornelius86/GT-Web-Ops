from html.parser import HTMLParser
from pathlib import Path
import subprocess,json
r=Path(__file__).resolve().parents[1]
class Form(HTMLParser):
 def __init__(self):super().__init__();self.fields=[];self.scripts=[];self.form=None;self.security=None;self.options=[]
 def handle_starttag(self,t,a):
  a=dict(a)
  if t in ['input','select','textarea']:self.fields.append((t,a))
  if t=='option':self.options.append(a)
  if t=='script':self.scripts.append(a)
  if t=='form':self.form=a
  if a.get('id')=='bookingTurnstile':self.security=a
old=Form();old.feed(subprocess.check_output(['git','show','a6b6136e6140b86037cd164aa1671162eb38d2dd:sites/thegtcollective/consultation/index.html'],cwd=r).decode());new=Form();new.feed((r/'sites/thegtcollective/consultation/index.html').read_text(encoding='utf8'))
assert sorted(old.fields,key=lambda x:x[1].get('id',x[1].get('value','')))==sorted(new.fields,key=lambda x:x[1].get('id',x[1].get('value','')))
for k in ['scripts','form','security','options']:assert getattr(old,k)==getattr(new,k),k
print('PASS: all field identifiers/types/required flags, option attributes, form action/method, scripts and Turnstile attributes preserved.')
