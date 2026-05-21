from fastapi import FastAPI
from fastapi.responses import HTMLResponse
app=FastAPI(title='Blog Studio')
@app.get('/',response_class=HTMLResponse)
def root():
    return '<h1>Blog Studio</h1><p>Use /docs for API.</p>'
