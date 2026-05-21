from pathlib import Path
import json
from .posts import save_post


def import_existing(site: str) -> dict:
    root = Path('/workspace')
    report = {'found':0,'imported':0,'skipped':0,'errors':0,'files_needing_review':[]}
    js = root / f'sites/{site}/blog-posts.js'
    if js.exists():
        txt = js.read_text(encoding='utf-8')
        start = txt.find('[')
        end = txt.rfind(']')
        if start != -1 and end != -1:
            try:
                arr = json.loads(txt[start:end+1])
                report['found'] += len(arr)
                for item in arr:
                    if not item.get('slug'):
                        report['skipped'] += 1
                        continue
                    save_post({
                        'title': item.get('title', item['slug']), 'slug': item['slug'], 'excerpt': item.get('excerpt',''),
                        'category': item.get('category','Journal'), 'status': item.get('status','published'),
                        'featured_image': item.get('image',''), 'featured_image_alt': item.get('imageAlt',''),
                        'tags': item.get('tags',[]), 'date': item.get('date',''), 'body': item.get('excerpt','')
                    })
                    report['imported'] += 1
            except Exception:
                report['errors'] += 1
                report['files_needing_review'].append(str(js))
    return report
