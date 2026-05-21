from pathlib import Path
from urllib.parse import unquote
import re

SLUG_RE = re.compile(r'^[a-z0-9]+(?:-[a-z0-9]+)*$')


def validate_slug(slug: str) -> bool:
    return bool(SLUG_RE.fullmatch(slug or ''))


def contains_traversal(value: str) -> bool:
    v = unquote((value or '').strip())
    bad = ['..', '\\', '%2e', '%2f']
    return any(b in v.lower() for b in bad) or v.startswith('/')


def safe_join(root: Path, rel: str) -> Path:
    if contains_traversal(rel):
        raise ValueError('invalid path traversal attempt')
    p = (root / rel).resolve()
    r = root.resolve()
    if r not in p.parents and p != r:
        raise ValueError('path escapes allowed root')
    return p
