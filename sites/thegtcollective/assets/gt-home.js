(() => {
  const grid = document.getElementById('blogGrid');
  const posts = window.GT_BLOG_POSTS || window.BLOG_POSTS || [];
  if (!grid || !posts.length) return;
  const cards = posts.slice(0,3).map(post => {
    const card = document.createElement('article'); card.className = 'blog-card';
    [['blog-meta',`${post.category || 'Journal'} / ${post.date || ''}`],['blog-title',post.title],['blog-excerpt',post.excerpt]].forEach(([cls,text]) => {
      const el = document.createElement('div'); el.className = cls; el.textContent = text || ''; card.append(el);
    });
    const link = document.createElement('a'); link.className = 'blog-link';
    const url = new URL(post.url || '/gallery/',location.origin);
    link.href = url.origin === location.origin ? url.pathname + url.search + url.hash : '/gallery/';
    link.textContent = post.cta || 'Read the story'; card.append(link); return card;
  });
  grid.replaceChildren(...cards);
})();
