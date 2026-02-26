/* TODO */
// Ejemplo de cómo usar la función updateDynamicTranslations para actualizar traducciones dinámicas
const nuevosTextos = {
  "ALARM_1": "Alarma de temperatura",
  "ALARM_2": "Alarma de presión"
};

// Asegúrate de que update-dynamic-i18n.js ya está cargado en la página
window.updateDynamicTranslations(nuevosTextos);

// Supón que recibes el JSON dinámico de algún lado
fetch('/ruta/a/mi/api/que/devuelve/dinamico.json')
  .then(res => res.json())
  .then(data => {
    window.updateDynamicTranslations(data);
  });