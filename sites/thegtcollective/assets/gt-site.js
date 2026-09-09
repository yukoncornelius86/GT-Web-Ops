(() => {
  'use strict';
  // Old inquiry links remain valid, including external links and saved bookmarks.
  const params = new URLSearchParams(location.search);
  if ((location.pathname === '/' || location.pathname === '/index.html') && (params.has('service') || params.has('plan'))) {
    location.replace('/consultation/' + location.search);
    return;
  }
  const toggle = document.querySelector('.gt-menu-toggle');
  const nav = document.getElementById('gtPrimaryNav');
  const services = document.querySelector('.gt-service-menu');
  const closeMenu = (restoreFocus = false) => {
    if (!toggle || !nav) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = 'Menu';
    if (services) services.open = false;
    if (restoreFocus) toggle.focus();
  };
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Menu';
  });
  nav?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('click', event => { if (!event.target.closest('.gt-site-header')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (nav?.classList.contains('is-open')) closeMenu(true);
    else if (services?.open) { services.open = false; services.querySelector('summary').focus(); }
  });
  matchMedia('(min-width:1051px)').addEventListener('change', () => closeMenu());
  document.querySelectorAll('[data-gt-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
