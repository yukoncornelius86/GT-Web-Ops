"""Compare preserved website contracts against the uploaded patch's pinned base."""
from html.parser import HTMLParser
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
BASE = 'a6b6136e6140b86037cd164aa1671162eb38d2dd'
SITE = ROOT / 'sites/thegtcollective'

def original(name):
    return subprocess.check_output(['git', 'show', f'{BASE}:sites/thegtcollective/{name}'], cwd=ROOT).decode().replace('\r\n', '\n')

class Contract(HTMLParser):
    def __init__(self):
        super().__init__()
        self.options = []
        self.current = None
    def handle_starttag(self, tag, attrs):
        if tag == 'option':
            self.current = [dict(attrs), '']
    def handle_data(self, value):
        if self.current is not None:
            self.current[1] += value
    def handle_endtag(self, tag):
        if tag == 'option' and self.current is not None:
            self.options.append(self.current)
            self.current = None

old = original('consultation/index.html')
new = (SITE / 'consultation/index.html').read_text(encoding='utf8')
a, b = Contract(), Contract()
a.feed(old)
b.feed(new)
assert a.options == b.options, 'Option labels/values/order changed'
privacy = 'By sending this request, you agree to be contacted about your vehicle.'
assert privacy in old and privacy in new
assert (SITE / 'assets/gt-inquiry.js').read_text(encoding='utf8') == original('assets/gt-inquiry.js').replace('\r\n', '\n')
assert (SITE / 'assets/gt-traffic.js').read_text(encoding='utf8') == original('assets/gt-traffic.js').replace('\r\n', '\n')
changed = subprocess.check_output(['git', '-c', 'core.autocrlf=false', 'diff', BASE, '--name-only', '--', 'sites/thegtcollective'], cwd=ROOT).decode().splitlines()
for path in changed:
    if not path.endswith('.html'):
        continue
    name = path.removeprefix('sites/thegtcollective/')
    previous, current = original(name), (ROOT / path).read_text(encoding='utf8')
    for kind in ['HEADER', 'FOOTER']:
        pattern = rf'<!-- GT SHARED {kind} START -->.*?<!-- GT SHARED {kind} END -->'
        assert re.search(pattern, previous, re.S)[0] == re.search(pattern, current, re.S)[0], (name, kind)
    assert re.findall(r'\$[\d,]+(?:\.\d\d)?', previous) == re.findall(r'\$[\d,]+(?:\.\d\d)?', current), (name, 'prices')
    assert re.findall(r'<img\b[^>]*\bsrc="([^"]+)"', previous) == re.findall(r'<img\b[^>]*\bsrc="([^"]+)"', current), (name, 'images')
print('PASS: option labels/order, privacy wording, inquiry JS, analytics JS, navigation, prices and image sources preserved against pinned base.')
