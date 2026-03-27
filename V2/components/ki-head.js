/**
 * ki-head.js — Inyecta en <head> los recursos comunes de kiControl.
 *
 * Uso: incluir este script como PRIMER <script> del <head>:
 *
 *   <script src="components/ki-head.js"></script>
 *
 * Para cargar scripts específicos de cada página (dixell.js, scripts.js, main.js…)
 * una vez que jQuery y CLIENT_CONFIG ya estén disponibles, usar kiReady():
 *
 *   <script>
 *     kiReady([
 *       'js/lib/dixell.js',
 *       'js/scripts.js',
 *       'js/main.js',
 *     ]);
 *   </script>
 *
 * kiReady() puede llamarse en cualquier momento: si las deps ya están listas
 * ejecuta inmediatamente, si no, espera al evento interno 'ki:deps-ready'.
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     Recursos a inyectar en <head>.
     El orden de los arrays es el orden de inserción.
  ───────────────────────────────────────────── */
  const CSS_FILES = [
    'css/boostrap.css',
    'css/styles.css',
  ];

  /* Scripts que NO dependen de config.js */
  const JS_LIBS = [
    'js/lib/bootstrap.bundle.min.js',
    'js/lib/jquery.min.js',
    'js/lib/jquery-ui.js',
    'js/lib/moment.min.js',
    'js/lib/j_utility.js',
    'js/lib/fontawesome.js',
  ];

  /* Scripts que SÍ deben cargarse después de config.js */
  const JS_COMPONENTS = [
    'components/ki-topnav.js',
    'components/ki-sidebar.js',
  ];

  /* ─────────────────────────────────────────────
     Helpers
  ───────────────────────────────────────────── */
  function addLink(href) {
    const el = document.createElement('link');
    el.rel  = 'stylesheet';
    el.href = href;
    document.head.appendChild(el);
  }

  function addScript(src, onload) {
    const el = document.createElement('script');
    el.src = src;
    if (onload) el.onload = onload;
    document.head.appendChild(el);
  }

  /* ─────────────────────────────────────────────
     Favicon
  ───────────────────────────────────────────── */
  const favicon = document.createElement('link');
  favicon.rel  = 'icon';
  favicon.href = 'assets/logos/Logo-simple-azul.png';
  document.head.appendChild(favicon);

  /* ─────────────────────────────────────────────
     Meta viewport (por si la página no lo tiene)
  ───────────────────────────────────────────── */
  if (!document.querySelector('meta[name="viewport"]')) {
    const meta = document.createElement('meta');
    meta.name    = 'viewport';
    meta.content = 'width=device-width, initial-scale=1, shrink-to-fit=no';
    document.head.prepend(meta);
  }

  /* ─────────────────────────────────────────────
     CSS
  ───────────────────────────────────────────── */
  CSS_FILES.forEach(addLink);

  /* ─────────────────────────────────────────────
     Librerías JS (en cadena para respetar orden)
  ───────────────────────────────────────────── */
  function loadScriptsSequentially(list, index, callback) {
    if (index >= list.length) { callback(); return; }
    addScript(list[index], () => loadScriptsSequentially(list, index + 1, callback));
  }

  loadScriptsSequentially(JS_LIBS, 0, function () {
    /* libs listas → config.js */
    addScript('js/config.js', function () {
      
      /* Aplica el título */
      if (window.CLIENT_CONFIG?.proyecto?.titulo) {
        document.title = CLIENT_CONFIG.proyecto.titulo;
      }

      /* config lista → componentes visuales, en cadena para garantizar orden */
      loadScriptsSequentially(JS_COMPONENTS, 0, function () {

        /* Ahora sí: custom elements definidos + CLIENT_CONFIG disponible */
        window._kiConfigReady = true;
        window.dispatchEvent(new CustomEvent('ki:config-ready'));
        window._kiDepsReady = true;
        window.dispatchEvent(new CustomEvent('ki:deps-ready'));

        /* Ejecuta la cola de scripts de página registrada con kiReady() */
        if (window._kiReadyQueue) {
          window._kiReadyQueue.forEach(function (list) {
            loadScriptsSequentially(list, 0, function () {});
          });
          window._kiReadyQueue = null;
        }
      });
    });
  });

  /**
   * kiReady(scriptList)
   * Carga los scripts de página en orden, garantizando que jQuery
   * y CLIENT_CONFIG ya están disponibles.
   *
   * @param {string[]} scriptList - rutas relativas a cargar en orden
   */
  window.kiReady = function (scriptList) {
    if (window._kiDepsReady) {
      /* Las deps ya están listas: carga directa */
      loadScriptsSequentially(scriptList, 0, function () {});
    } else {
      /* Encola para cuando ki:deps-ready se dispare */
      window._kiReadyQueue = window._kiReadyQueue || [];
      window._kiReadyQueue.push(scriptList);
    }
  };

})();