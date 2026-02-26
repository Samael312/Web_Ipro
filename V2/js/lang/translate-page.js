// js/lang/translate-page.js
// Aplica la traducción de la página usando i18n si está disponible


function forceTranslatePage(context) {
  console.log('[i18n] forceTranslatePage llamada', context || '');
  if (window.i18n && typeof i18n.translatePage === 'function') {
    console.log('[i18n] Ejecutando i18n.translatePage');
    i18n.translatePage();
  } else {
    console.warn('[i18n] i18n.translatePage no disponible');
  }
}

document.addEventListener('DOMContentLoaded', forceTranslatePage);
window.forceTranslatePage = forceTranslatePage;
