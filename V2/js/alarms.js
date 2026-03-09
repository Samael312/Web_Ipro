// Variables
var modal_login = document.getElementById('login-modal');
var alarmList = [], warningList = [], alarmListHisto = [];
var alarmStartHour = [], alarmStartMinute = [];
var alarmStartHourHisto = [], alarmStartMinuteHisto = [];

var domain = "";
//var domain = "http://172.17.123.250"

// Función de ayuda para generar las etiquetas o el mensaje de error
function getTagHtml(hasData, innerContent, cssClass) {
  if (hasData) {
    return `<span class='${cssClass}'>${innerContent}</span>`;
  }
  return `<span style="color:#dc3545; font-weight:bold; background:rgba(255,255,255,0.8); padding:2px 5px; border-radius:4px; font-size:12px; box-shadow: 0px 0px 3px rgba(0,0,0,0.3);">Sin datos</span>`;
}

// Petición asíncrona encapsulada en una Promesa (Reemplaza al antiguo 'async: false')
function fetchVar(texto) {
  return new Promise((resolve, reject) => {
    $.ajax({
      crossOrigin: true,
      crossDomain: true,
      url: domain + "/cgi-bin/jgetvar.cgi?name=" + texto,
      data: { get_param: 'value' },
      cache: false,
      dataType: 'json',
      timeout: 3000, // Timeout de 3 segundos por petición individual
      success: function (data) { resolve(data[0].value); },
      error: function () { reject("Error/Timeout fetch: " + texto); }
    });
  });
}

// Función principal de carga
$(document).ready(async function () {
  try {
    // 1. Cargamos el script de configuración PRIMERO (es vital para traducir los códigos de alarma)
    await $.ajax({
      url: 'js/input-output-config.js',
      dataType: 'script',
      crossDomain: true,
      timeout: 5000
    });

    // 2. Realizamos las peticiones secuenciales para no saturar el servidor (iPRO)
    // pero usando async/await para NO congelar la pantalla del navegador.
    for (let i = 1; i <= 10; i++) {
      alarmList[i] = await fetchVar(`List_alarms[${i}]`);
      warningList[i] = await fetchVar(`List_warnings[${i}]`);
      alarmListHisto[i] = await fetchVar(`List_alarms_histo[${i}]`);
      alarmStartHour[i] = await fetchVar(`Hora_Inicio_Alarmas_Activas[${i}]`);
      alarmStartMinute[i] = await fetchVar(`Minuto_Inicio_Alarmas_Activas[${i}]`);
      alarmStartHourHisto[i] = await fetchVar(`List_alarms_Histo_Hour[${i}]`);
      alarmStartMinuteHisto[i] = await fetchVar(`List_alarms_Histo_Minute[${i}]`);
    }

    // 3. Petición final (usada como check de disponibilidad extra)
    await fetchVar("ONOFF_GEN");

    // Si llega hasta aquí sin caer en el 'catch', todo cargó bien
    alarmTable(true);

  } catch (error) {
    console.warn("Fallo al obtener los datos de alarmas o se agotó el tiempo: ", error);
    alarmTable(false); // Cargamos la tabla en modo "Sin datos"
  }
});

// Función para procesar y dibujar las tablas
function alarmTable(hasData) {

  // Sub-función genérica para no repetir el código en cada tabla ( DRY: Don't Repeat Yourself )
  function renderTable(tableId, emptyDivId, list, startHour, startMinute, dict, type) {
    var html = "";
    
    // CASO 1: Falla la conexión (Modo seguro)
    if (!hasData) {
      document.getElementById(emptyDivId).style.display = "none";
      html = `<tr><td colspan="${type === 'warning' ? '2' : '3'}" class="text-center">${getTagHtml(false, '', '')}</td></tr>`;
      document.getElementById(tableId).innerHTML = html;
      return;
    }

    // CASO 2: Conexión OK, pero no hay alarmas activas en esta categoría
    if (list[1] == 0 || list[1] == undefined) {
      document.getElementById(emptyDivId).style.display = ""; // Muestra el texto "No hay alarmas" de tu HTML
      document.getElementById(tableId).innerHTML = ""; // Limpiamos la tabla
    } 
    // CASO 3: Conexión OK y existen alarmas
    else {
      document.getElementById(emptyDivId).style.display = "none";
      
      if (type === 'warning') {
        html += `<thead><tr><th class='text-center'>#</th><th>Warning</th></tr></thead><tbody>`;
        for (let i = 1; i <= 10; i++) {
          if (list[i] != 0 && list[i] != undefined) {
            html += `<tr><td class='text-center'>${i}</td><td>${dict[list[i]] || 'Unknown Warning'}</td></tr>`;
          }
        }
      } else {
        html += `<thead><tr><th class='text-center'>#</th><th>Time</th><th>Alarm</th></tr></thead><tbody>`;
        for (let i = 1; i <= 10; i++) {
          if (list[i] != 0 && list[i] != undefined) {
            // Formateamos la hora para que siempre tenga 2 dígitos (ej: 09:05 en lugar de 9:5)
            let hh = startHour[i] !== undefined ? String(startHour[i]).padStart(2, '0') : '00';
            let mm = startMinute[i] !== undefined ? String(startMinute[i]).padStart(2, '0') : '00';
            
            html += `<tr><td class='text-center'>${i}</td><td>${hh}:${mm}</td><td>${dict[list[i]] || 'Unknown Alarm'}</td></tr>`;
          }
        }
      }
      html += `</tbody>`;
      document.getElementById(tableId).innerHTML = html;
    }
  }

  // Ejecutamos el renderizado para las 3 tablas pasándole sus respectivos vectores
  // Aseguramos que usamos los diccionarios cargados de 'input-output-config.js' (usando || {} por seguridad)
  renderTable('alarm-table', 'alarm-list', alarmList, alarmStartHour, alarmStartMinute, window.activeAlarmsList || {}, 'alarm');
  renderTable('alarm-table-histo', 'alarm-histo', alarmListHisto, alarmStartHourHisto, alarmStartMinuteHisto, window.activeAlarmsList || {}, 'alarm');
  renderTable('warning-table', 'warn-list', warningList, null, null, window.activeWarningsList || {}, 'warning');

  // Ocultamos el spinner y mostramos los datos
  document.getElementById('main-load').style.display = "none";
  if (document.getElementById('Grid-Container')) {
    document.getElementById('Grid-Container').style.display = ""; 
  }
}