from pydantic import BaseModel
from typing import List


class PostData(BaseModel):
    title: str
    slug: str
    subtitle: str = ''
    author: str = ''
    date: str = ''
    category: str = 'Journal'
    tags: List[str] = []
    featured_image: str = ''
    featured_image_alt: str = ''
    seo_title: str = ''
    seo_description: str = ''
    excerpt: str = ''
    status: str = 'draft'
    canonical_url: str = ''
    cta_label: str = 'Request a Vehicle Evaluation'
    cta_url: str = '/#contact'
    custom_html: str = ''
    body: str = ''
