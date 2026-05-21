from __future__ import annotations
from pathlib import Path
import yaml

REPO_ROOT = Path('/workspace')
CONFIG_PATH = REPO_ROOT / 'blog-studio/config/blog-studio.yml'

DEFAULTS = {
    'workspace_root': '/workspace',
    'active_site': 'thegtcafe',
    'site_source_folder': 'sites/{site}',
    'blog_output_folder': 'sites/{site}/blog',
    'assets_output_folder': 'sites/{site}/assets/blog',
    'blog_index_output_file': 'sites/{site}/blog-posts.js',
    'article_template_file': 'sites/{site}/templates/blog-article-template.html',
    'production_site_url': 'https://thegtcafe.com',
    'local_preview_url': 'http://localhost:8080',
    'default_author': 'Mike Zanni',
    'default_category': 'Journal',
    'default_cta_label': 'Request a Vehicle Evaluation',
    'default_cta_url': '/#contact',
    'enable_sitemap_generation': True,
    'enable_rss_generation': True,
    'enable_image_copy': True,
    'enable_git_actions': False,
    'git_remote': 'origin',
    'git_branch': 'main',
    'advanced_mode': False,
}


def load_config() -> dict:
    if not CONFIG_PATH.exists():
        save_config(DEFAULTS)
        return DEFAULTS.copy()
    cfg = yaml.safe_load(CONFIG_PATH.read_text()) or {}
    merged = DEFAULTS.copy()
    merged.update(cfg)
    return merged


def save_config(config: dict) -> None:
    CONFIG_PATH.parent.mkdir(parents=True, exist_ok=True)
    CONFIG_PATH.write_text(yaml.safe_dump(config, sort_keys=False))


def resolve_setting_path(cfg: dict, key: str) -> Path:
    site = cfg['active_site']
    raw = str(cfg[key]).format(site=site)
    return Path(cfg['workspace_root']) / raw
