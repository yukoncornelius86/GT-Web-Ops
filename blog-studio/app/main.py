from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from .config import load_config, save_config
from .services.posts import list_posts, get_post, save_post, archive_post
from .services.site_export import export_site
from .services.markdown_render import render_markdown
from .services.import_existing import import_existing
from .services.git_ops import run_git

app = FastAPI(title='GT Blog Studio')
templates = Jinja2Templates(directory='/workspace/blog-studio/app/templates')

@app.get('/', response_class=HTMLResponse)
def dashboard(request: Request):
    cfg = load_config(); posts = list_posts()
    pub = len([p for p in posts if p.get('status') == 'published'])
    arc = len([p for p in posts if p.get('status') == 'archived'])
    ok, branch = run_git(['branch','--show-current'])
    _, status = run_git(['status','--short'])
    return templates.TemplateResponse('dashboard.html', {'request': request, 'cfg': cfg, 'posts': posts, 'published': pub, 'archived': arc, 'branch': branch if ok else 'n/a', 'git_status': status})

@app.get('/posts', response_class=HTMLResponse)
def posts_page(request: Request, q: str = '', status: str = ''):
    posts = list_posts()
    if q: posts = [p for p in posts if q.lower() in p.get('title','').lower()]
    if status: posts = [p for p in posts if p.get('status','draft') == status]
    return templates.TemplateResponse('posts.html', {'request': request, 'posts': posts, 'q': q, 'status': status})

@app.get('/editor', response_class=HTMLResponse)
def editor_new(request: Request):
    return templates.TemplateResponse('editor.html', {'request': request, 'post': {}})

@app.get('/editor/{slug}', response_class=HTMLResponse)
def editor_edit(request: Request, slug: str):
    return templates.TemplateResponse('editor.html', {'request': request, 'post': get_post(slug) or {}})

@app.post('/save')
def save(request: Request, title: str = Form(...), slug: str = Form(''), status: str = Form('draft'), body: str = Form(''), excerpt: str = Form(''), category: str = Form('Journal'), tags: str = Form('')):
    data = {'title': title, 'slug': slug, 'status': status, 'body': body, 'excerpt': excerpt, 'category': category, 'tags': [t.strip() for t in tags.split(',') if t.strip()]}
    new_slug = save_post(data)
    return RedirectResponse(f'/editor/{new_slug}', status_code=303)

@app.post('/archive/{slug}')
def archive(slug: str):
    archive_post(slug)
    return RedirectResponse('/posts', status_code=303)

@app.get('/preview/{site}/{slug}', response_class=HTMLResponse)
def preview(request: Request, site: str, slug: str):
    post = get_post(slug) or {}
    html = render_markdown(post.get('body',''))
    return templates.TemplateResponse('preview.html', {'request': request, 'post': post, 'html': html, 'site': site})

@app.post('/export')
def export():
    cfg = load_config(); result = export_site(cfg, list_posts())
    return JSONResponse({'ok': True, 'result': result})

@app.get('/settings', response_class=HTMLResponse)
def settings_page(request: Request):
    return templates.TemplateResponse('settings.html', {'request': request, 'cfg': load_config()})

@app.post('/settings')
def settings_save(request: Request):
    form = dict(request.query_params)
    cfg = load_config(); cfg.update(form); save_config(cfg)
    return RedirectResponse('/settings', status_code=303)

@app.get('/import', response_class=HTMLResponse)
def import_page(request: Request):
    return templates.TemplateResponse('import.html', {'request': request, 'report': None})

@app.post('/import', response_class=HTMLResponse)
def do_import(request: Request):
    site = load_config().get('active_site', 'thegtcafe')
    report = import_existing(site)
    return templates.TemplateResponse('import.html', {'request': request, 'report': report})
