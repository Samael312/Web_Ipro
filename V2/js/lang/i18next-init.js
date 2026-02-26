// js/lang/i18next-init.js
// Inicialización de i18next para el sistema


(function(window) {
  // Idiomas soportados
  const resources = {
    en: { translation: {} },
    es: { translation: {} }
  };

  // Cargar recursos desde archivos JSON (puedes adaptar a .po si lo deseas)
  function loadResource(lang, cb) {
    fetch('local/' + lang + '.json')
      .then(r => r.json())
      .then(data => {
        if (data && (data.static_translation || data.dynamic_translation)) {
          const merged = {
            ...(data.static_translation || {}),
            ...(data.dynamic_translation || {})
          };
          resources[lang] = { translation: merged };
          console.log('[i18n] Traducciones cargadas para', lang, merged, 'desde', 'local/' + lang + '.json');
        } else {
          console.error('[i18n] El archivo no tiene las claves "static_translation" o "dynamic_translation"', lang, data);
        }
        cb();
      })
      .catch((err) => {
        console.error('[i18n] Error al cargar', 'local/' + lang + '.json', err);
        cb();
      });
  }

  function getInitialLang() {
    if (typeof window.getLang === 'function') {
      return window.getLang();
    }
    try {
      const lang = localStorage.getItem('selected_lang');
      return lang ? lang : 'en';
    } catch {
      return 'en';
    }
  }

  function initI18n(lang, cb) {
    i18next.init({
      lng: lang,
      fallbackLng: 'en',
      resources,
      debug: false
    }, cb);
  }

  function translatePage() {
    console.log('[i18n] translatePage llamada');
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      const key = el.getAttribute('data-i18n');
      const translated = i18next.t(key);
      if (translated) {
        el.textContent = translated;
        console.log('[i18n] Traducido', key, '→', translated);
      } else {
        console.warn('[i18n] Sin traducción para', key);
      }
    });
  }

  function setLanguage(lang) {
    if (i18next.language === lang) return;
    loadResource(lang, function() {
      i18next.changeLanguage(lang, translatePage);
    });
  }

  // Inicialización automática
  const lang = getInitialLang();
  loadResource(lang, function() {
    initI18n(lang, translatePage);
  });

  window.i18n = {
    setLanguage,
    translatePage,
    getCurrentLang: function() { return i18next.language; }
  };
})(window);
