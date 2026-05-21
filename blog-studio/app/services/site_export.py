from __future__ import annotations
from pathlib import Path
import json
from .markdown_render import render_markdown


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
    published = [p for p in posts if p.get('status', 'draft') == 'published']
    for p in published:
        html = render_markdown(p.get('body','')) + (p.get('custom_html') or '')
        page = tpl.replace('{{content}}', html).replace('{{title}}', p.get('title',''))
        (blog_dir / f"{p['slug']}.html").write_text(page, encoding='utf-8')
    js = []
    for p in published:
        js.append({
            'title': p.get('title',''), 'slug': p.get('slug',''), 'url': f"/blog/{p.get('slug','')}.html",
            'date': p.get('date',''), 'category': p.get('category',''), 'excerpt': p.get('excerpt',''),
            'image': p.get('featured_image',''), 'imageAlt': p.get('featured_image_alt',''),
            'status':'published', 'tags': p.get('tags',[])
        })
    index_file.write_text('window.BLOG_POSTS = ' + json.dumps(js, indent=2) + ';\n', encoding='utf-8')
    return {'published': len(published), 'site': site}
