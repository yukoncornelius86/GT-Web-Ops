from datetime import date
from fastapi import FastAPI, Request, Form, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from .config import load_config, save_config
from .services.posts import list_posts, get_post, save_post, archive_post
from .services.site_export import export_site
from .services.markdown_render import render_markdown
from .services.import_existing import import_existing
from .services.git_ops import run_git
from .services.security import validate_slug, contains_traversal

app = FastAPI(title='GT Blog Studio')
app.mount('/static', StaticFiles(directory='/workspace/blog-studio/app/static'), name='static')
templates = Jinja2Templates(directory='/workspace/blog-studio/app/templates')


def _git_enabled(cfg: dict):
    if str(cfg.get('enable_git_actions', False)).lower() not in {'true','1','yes','on'}:
        raise HTTPException(status_code=403, detail='Git actions are disabled. High-impact admin feature.')

@app.get('/', response_class=HTMLResponse)
def dashboard(request: Request):
    cfg = load_config(); posts = list_posts()
    pub = len([p for p in posts if p.get('status') == 'published'])
    drf = len([p for p in posts if p.get('status', 'draft') == 'draft'])
    arc = len([p for p in posts if p.get('status') == 'archived'])
    ok, branch = run_git(['branch', '--show-current'])
    _, status = run_git(['status', '--short'])
    _, last_commit = run_git(['log', '-1', '--oneline'])
    return templates.TemplateResponse('dashboard.html', {'request': request, 'cfg': cfg, 'posts': posts, 'published': pub, 'drafts': drf, 'archived': arc, 'branch': branch if ok else 'n/a', 'git_status': status, 'last_commit': last_commit})

@app.get('/editor/{slug}', response_class=HTMLResponse)
def editor_edit(request: Request, slug: str):
    if not validate_slug(slug):
        raise HTTPException(status_code=400, detail='Invalid slug format')
    return templates.TemplateResponse('editor.html', {'request': request, 'post': get_post(slug) or {}})

@app.get('/editor', response_class=HTMLResponse)
def editor_new(request: Request):
    return templates.TemplateResponse('editor.html', {'request': request, 'post': {'date': str(date.today()), 'status': 'draft', 'cta_label': 'Request a Vehicle Evaluation', 'cta_url': '/#contact'}})

@app.post('/save')
def save(title: str = Form(...), slug: str = Form(''), status: str = Form('draft'), body: str = Form(''), **kwargs):
    if slug and not validate_slug(slug):
        raise HTTPException(status_code=400, detail='Invalid slug format; use lowercase letters, numbers, hyphens only')
    for v in kwargs.values():
        if isinstance(v, str) and contains_traversal(v):
            raise HTTPException(status_code=400, detail='Invalid traversal-like path in form input')
    data = {'title': title, 'slug': slug, 'status': status, 'body': body, **kwargs}
    new_slug = save_post(data)
    return RedirectResponse(f'/editor/{new_slug}', status_code=303)

@app.post('/archive/{slug}')
def archive(slug: str):
    if not validate_slug(slug):
        raise HTTPException(status_code=400, detail='Invalid slug format')
    archive_post(slug)
    return RedirectResponse('/posts', status_code=303)

@app.post('/export')
def export():
    return JSONResponse({'ok': True, 'result': export_site(load_config(), list_posts())})

@app.post('/git/pull')
def git_pull():
    cfg = load_config(); _git_enabled(cfg)
    return {'ok': run_git(['pull', cfg.get('git_remote','origin'), cfg.get('git_branch','main')])}

@app.post('/git/push')
def git_push():
    cfg = load_config(); _git_enabled(cfg)
    return {'ok': run_git(['push', cfg.get('git_remote','origin'), cfg.get('git_branch','main')])}

@app.post('/git/commit')
def git_commit(message: str = Form(...)):
    cfg = load_config(); _git_enabled(cfg)
    return {'ok': run_git(['commit','-m',message])}

@app.get('/posts', response_class=HTMLResponse)
def posts_page(request: Request, q: str = '', status: str = '', category: str = ''):
    posts = list_posts()
    if q: posts = [p for p in posts if q.lower() in p.get('title', '').lower()]
    if status: posts = [p for p in posts if p.get('status', 'draft') == status]
    if category: posts = [p for p in posts if p.get('category', '') == category]
    categories = sorted({p.get('category', 'Journal') for p in list_posts()})
    return templates.TemplateResponse('posts.html', {'request': request, 'posts': posts, 'q': q, 'status': status, 'category': category, 'categories': categories})

@app.get('/preview/{site}/{slug}', response_class=HTMLResponse)
def preview(request: Request, site: str, slug: str):
    if not validate_slug(slug): raise HTTPException(status_code=400, detail='Invalid slug')
    post = get_post(slug) or {}
    html = render_markdown(post.get('body', '')) + (post.get('custom_html') or '')
    return templates.TemplateResponse('preview.html', {'request': request, 'post': post, 'html': html, 'site': site})

@app.get('/settings', response_class=HTMLResponse)
def settings_page(request: Request):
    return templates.TemplateResponse('settings.html', {'request': request, 'cfg': load_config()})

@app.post('/settings')
async def settings_save(request: Request):
    form = dict(await request.form())
    if any(contains_traversal(str(v)) for v in form.values()):
        raise HTTPException(status_code=400, detail='Invalid path values in settings')
    cfg = load_config(); cfg.update(form); save_config(cfg)
    return RedirectResponse('/settings', status_code=303)

@app.get('/import', response_class=HTMLResponse)
def import_page(request: Request):
    return templates.TemplateResponse('import.html', {'request': request, 'report': None})

@app.post('/import', response_class=HTMLResponse)
def do_import(request: Request):
    site = load_config().get('active_site', 'thegtcafe')
    return templates.TemplateResponse('import.html', {'request': request, 'report': import_existing(site)})
