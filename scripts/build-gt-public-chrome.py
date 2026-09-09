"""Regenerate shared public headers/footers. Does not touch private or client routes."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'sites/thegtcollective'
PAGES = [
    'index.html', 'preservation-mechanical-services.html', 'gt-stewardship.html',
    'auction-preparation-listing-support.html', 'services/preservation-cleaning/index.html',
    'paint-correction-leonardtown-md.html', 'ceramic-coating-leonardtown-md.html',
    'undercarriage-preservation-leonardtown-md.html', 'founders-letter.html', 'privacy-policy.html',
    'gallery/index.html', 'process/index.html', 'philosophy/index.html', 'expectations/index.html',
    'faq/index.html', 'consultation/index.html',
    'blog/1988-porsche-911-dry-ice-cleaning.html', 'blog/2013-porsche-cayenne-lanolin-undercoating.html'
]

def build():
    header = (ROOT / 'scripts/site-fragments/header.html').read_text(encoding='utf8').strip()
    footer = (ROOT / 'scripts/site-fragments/footer.html').read_text(encoding='utf8').strip()
    for name in PAGES:
        p = SITE / name
        s = p.read_text(encoding='utf8')
        match = re.search(r'<main\b[^>]*\bid="([^"]+)"', s)
        if not match: raise ValueError('Main landmark ID missing: ' + name)
        for kind, fragment in [('HEADER', header.replace('{{MAIN_ID}}', match[1])), ('FOOTER', footer)]:
            pattern = rf'<!-- GT SHARED {kind} START -->.*?<!-- GT SHARED {kind} END -->'
            s, count = re.subn(pattern, lambda _:fragment, s, count=1, flags=re.S)
            if count != 1: raise ValueError('Shared marker missing: ' + name + ' ' + kind)
        p.write_text(s, encoding='utf8')
    print(f'Updated shared navigation on {len(PAGES)} public pages.')

if __name__ == '__main__': build()
