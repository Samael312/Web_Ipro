// Inject common head assets (CSS and library scripts) without ES modules
// Include this near the top of <head> in each HTML:
// <script src="js/head.js"></script>
(function injectCommonHead() {
  const d = document;
  const head = d.head || d.getElementsByTagName('head')[0];

  function ensureMetaCharset(charset) {
    if (!charset) return;
    const exists = d.querySelector('meta[charset]');
    if (!exists) {
      const el = d.createElement('meta');
      el.setAttribute('charset', charset);
      head.insertBefore(el, head.firstChild);
    }
  }

  function ensureMetaName(name, content) {
    if (!name || !content) return;
    const exists = d.querySelector(`meta[name="${name}"]`);
    if (!exists) {
      const el = d.createElement('meta');
      el.setAttribute('name', name);
      el.setAttribute('content', content);
      head.appendChild(el);
    }
  }

  function ensureMetaHttpEquiv(httpEquiv, content) {
    if (!httpEquiv || !content) return;
    const exists = d.querySelector(`meta[http-equiv="${httpEquiv}"]`);
    if (!exists) {
      const el = d.createElement('meta');
      el.setAttribute('http-equiv', httpEquiv);
      el.setAttribute('content', content);
      head.appendChild(el);
    }
  }

  function ensureTitle() {
    const defaultTitle = 'KICONTROL ICOENERGIA';
    d.title = defaultTitle;
  }

  function ensureLink(rel, href) {
    if (!href) return;
    const exists = Array.from(d.querySelectorAll(`link[rel="${rel}"]`)).some(l => l.getAttribute('href') === href);
    if (!exists) {
      const el = d.createElement('link');
      el.setAttribute('rel', rel);
      el.setAttribute('href', href);
      head.appendChild(el);
    }
  }

  function ensureScript(src) {
    if (!src) return;
    const exists = Array.from(d.scripts).some(s => s.getAttribute('src') === src);
    if (!exists) {
      const el = d.createElement('script');
      el.setAttribute('src', src);
      head.appendChild(el);
    }
  }

  // Meta tags and title (shared defaults with per-page override via window.PAGE_TITLE or <html data-title="...">)
  ensureMetaCharset('utf-8');
  ensureMetaHttpEquiv('X-UA-Compatible', 'IE=edge');
  ensureMetaName('viewport', 'width=device-width, initial-scale=1, shrink-to-fit=no');
  ensureTitle();

  // CSS
  ensureLink('icon', 'assets/logos/Logo-simple-azul.png');
  ensureLink('stylesheet', 'css/boostrap.css');
  ensureLink('stylesheet', 'css/styles.css');

  // Common JS libraries (load in head to preserve original structure)
  ensureScript('js/lib/bootstrap.bundle.min.js');
  ensureScript('js/lib/jquery.min.js');
  ensureScript('js/lib/jquery-ui.js');
  ensureScript('js/lib/moment.min.js');
  ensureScript('js/lib/j_utility.js');
  ensureScript('js/lib/fontawesome.js');
})();


