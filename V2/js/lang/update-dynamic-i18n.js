// Permite actualizar solo los textos dinámicos de i18next en caliente desde el navegador
window.updateDynamicTranslations = function(newDynamic) {
  const lang = i18next.language || 'en';
  // Obtiene el bundle actual
  const current = i18next.getResourceBundle(lang, 'translation') || {};
  // Mezcla los textos dinámicos nuevos
  const updated = { ...current, ...newDynamic };
  i18next.addResources(lang, 'translation', updated);
  // Refresca la traducción en la página
  if (window.translatePage) window.translatePage();
  else if (window.forceTranslatePage) window.forceTranslatePage();
  console.log('[i18n] Traducción dinámica actualizada:', updated);
};
// update-dynamic-i18n.js
// Actualiza la clave dynamic_translation de los idiomas recibidos en un JSON de entrada
// Uso: node update-dynamic-i18n.js input.json

const fs = require('fs');

if (process.argv.length < 3) {
  console.error('Uso: node update-dynamic-i18n.js input.json');
  process.exit(1);
}

const inputFile = process.argv[2];
if (!fs.existsSync(inputFile)) {
  console.error('No existe el archivo de entrada:', inputFile);
  process.exit(1);
}

const input = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
const basePath = __dirname + '/../local/';

Object.entries(input).forEach(([lang, newDynamic]) => {
  const file = basePath + lang + '.json';
  if (!fs.existsSync(file)) {
    console.error(`No existe el archivo: ${file}`);
    return;
  }
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  data.dynamic_translation = { ...(data.dynamic_translation || {}), ...newDynamic };
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Actualizado ${file}`);
});
