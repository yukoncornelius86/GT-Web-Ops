from __future__ import annotations
from pathlib import Path
import json
from datetime import datetime
from .markdown_render import render_markdown


def _site_base_url(cfg: dict, site: str) -> str:
    site_urls = cfg.get('site_urls') or {}
    if isinstance(site_urls, dict) and site_urls.get(site):
        return str(site_urls[site]).rstrip('/')
    if site == 'thegtcollective':
        return 'https://thegtcollective.com'
    if site == 'thegtcafe':
        return 'https://thegtcafe.com'
    return cfg.get('production_site_url', '').rstrip('/')


def _post_target(post: dict, fallback_site: str) -> str:
    return str(post.get('target_site') or post.get('site') or fallback_site)


def _write_sitemap(cfg: dict, published: list[dict], root: Path, site: str) -> None:
    if str(cfg.get('enable_sitemap_generation', True)).lower() not in {'true', '1', 'yes', 'on'}:
        return
    base = _site_base_url(cfg, site)
    lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    lines.append(f"  <url><loc>{base}/</loc></url>")
    for p in published:
        lines.append(f"  <url><loc>{base}/blog/{p.get('slug')}.html</loc></url>")
    lines.append('</urlset>')
    (root / f'sites/{site}/sitemap.xml').write_text('\n'.join(lines), encoding='utf-8')


def _write_rss(cfg: dict, published: list[dict], root: Path, site: str) -> None:
    if str(cfg.get('enable_rss_generation', True)).lower() not in {'true', '1', 'yes', 'on'}:
        return
    base = _site_base_url(cfg, site)
    now = datetime.utcnow().strftime('%a, %d %b %Y %H:%M:%S GMT')
    items = []
    for p in published:
        items.append(f"<item><title>{p.get('title','')}</title><link>{base}/blog/{p.get('slug')}.html</link><description>{p.get('excerpt','')}</description></item>")
    xml = f"<?xml version=\"1.0\"?><rss version=\"2.0\"><channel><title>{site} Blog</title><link>{base}</link><description>{site} posts</description><lastBuildDate>{now}</lastBuildDate>{''.join(items)}</channel></rss>"
    (root / f'sites/{site}/rss.xml').write_text(xml, encoding='utf-8')


def export_site(cfg: dict, posts: list[dict]) -> dict:
    site = cfg['active_site']
    root = Path(cfg['workspace_root'])
    blog_dir = root / f'sites/{site}/blog'
    assets_dir = root / f'sites/{site}/assets/blog'
    index_file = root / f'sites/{site}/blog-posts.js'
    template_file = root / f'sites/{site}/templates/blog-article-template.html'
    blog_dir.mkdir(parents=True, exist_ok=True)
    assets_dir.mkdir(parents=True, exist_ok=True)
    tpl = template_file.read_text(encoding='utf-8') if template_file.exists() else '<html><body>{{content}}</body></html>'
    published = [
        p for p in posts
        if p.get('status', 'draft') == 'published' and _post_target(p, site) == site
    ]
    for p in published:
        html = render_markdown(p.get('body', '')) + (p.get('custom_html') or '')
        page = (
            tpl
            .replace('{{content}}', html)
            .replace('{{title}}', p.get('title', ''))
            .replace('{{excerpt}}', p.get('excerpt', ''))
            .replace('{{category}}', p.get('category', 'Journal'))
            .replace('{{date}}', p.get('date', ''))
            .replace('{{canonical_url}}', p.get('canonical_url') or f"{_site_base_url(cfg, site)}/blog/{p.get('slug')}.html")
            .replace('{{cta_label}}', p.get('cta_label') or 'Back to Journal')
            .replace('{{cta_url}}', p.get('cta_url') or '/#journal')
        )
        (blog_dir / f"{p['slug']}.html").write_text(page, encoding='utf-8')
    js = []
    for p in published:
        js.append({
            'title': p.get('title', ''), 'slug': p.get('slug', ''), 'url': f"/blog/{p.get('slug', '')}.html",
            'date': p.get('date', ''), 'category': p.get('category', ''), 'excerpt': p.get('excerpt', ''),
            'image': p.get('featured_image', ''), 'imageAlt': p.get('featured_image_alt', ''),
            'status': 'published', 'tags': p.get('tags', [])
        })
    index_file.write_text('window.BLOG_POSTS = ' + json.dumps(js, indent=2) + ';\n', encoding='utf-8')
    _write_sitemap(cfg, published, root, site)
    _write_rss(cfg, published, root, site)
    return {'published': len(published), 'site': site}
