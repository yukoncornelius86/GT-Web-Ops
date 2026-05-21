from __future__ import annotations
from pathlib import Path
from datetime import date
import frontmatter
import re

POSTS_DIR = Path('/workspace/blog-studio/content/posts')
ARCHIVE_DIR = Path('/workspace/blog-studio/content/archived')


def slugify(v: str) -> str:
    v = v.lower().strip()
    v = re.sub(r'[^a-z0-9]+', '-', v).strip('-')
    return v or 'untitled'


def post_path(slug: str) -> Path:
    return POSTS_DIR / f'{slug}.md'


def list_posts() -> list[dict]:
    POSTS_DIR.mkdir(parents=True, exist_ok=True)
    out = []
    for p in sorted(POSTS_DIR.glob('*.md')):
        fm = frontmatter.load(p)
        data = dict(fm.metadata)
        data['body'] = fm.content
        data.setdefault('slug', p.stem)
        data.setdefault('title', p.stem.replace('-', ' ').title())
        data['last_modified'] = p.stat().st_mtime
        out.append(data)
    return out


def get_post(slug: str) -> dict | None:
    p = post_path(slug)
    if not p.exists():
        return None
    fm = frontmatter.load(p)
    data = dict(fm.metadata)
    data['body'] = fm.content
    data.setdefault('slug', slug)
    return data


def save_post(data: dict) -> str:
    POSTS_DIR.mkdir(parents=True, exist_ok=True)
    slug = slugify(data.get('slug') or data['title'])
    data['slug'] = slug
    data.setdefault('date', str(date.today()))
    body = data.pop('body', '')
    post = frontmatter.Post(body, **data)
    post_path(slug).write_text(frontmatter.dumps(post), encoding='utf-8')
    return slug


def archive_post(slug: str) -> None:
    p = post_path(slug)
    if not p.exists():
        return
    ARCHIVE_DIR.mkdir(parents=True, exist_ok=True)
    fm = frontmatter.load(p)
    fm['status'] = 'archived'
    (ARCHIVE_DIR / p.name).write_text(frontmatter.dumps(fm), encoding='utf-8')
    p.unlink()
