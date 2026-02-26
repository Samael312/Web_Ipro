var caudalVariable, numeroCircuitos, EN_bomba1_P, EN_bomba2_P, EN_bomba1_S, EN_bomba2_S, EN_inver1_S, EN_inver2_S, EN_freecooling, EN_bomba1_R, EN_bomba2_R;

var domain = "";
//var domain = "http://172.17.123.250"

function peticionAjax(texto) {
  var valor;
  $.ajax({
    crossOrigin: true,
    crossDomain: true,
    url: domain + "/cgi-bin/jgetvar.cgi?name=" + texto,
    data: { get_param: 'value' },
    cache: false,
    dataType: 'json',
    async: false,
    success: function (data) { valor = data[0].value; },
    error: function () { valor = null; }
  });
  return valor;
}

$(document).ready(function () {
  // Se obtiene si se ha configurado caudal variable
  // Agregamos un TIMEOUT de 5000ms (5 segundos)
  $.ajax({
    crossOrigin: true,
    crossDomain: true,
    url: domain + "/cgi-bin/jgetvar.cgi?name=ONOFF_GEN",
    data: { get_param: 'value' },
    cache: false,
    dataType: 'json',
    timeout: 5000, // Esperar máximo 5 segundos
    success: function (data) {
      caudalVariable = data[0].value;
      main_table(true); // Hay datos, se cargan normalmente
    },
    error: function () {
      // Si falla o se agota el tiempo, forzamos la vista de "Sin datos"
      console.warn("No se pudieron obtener los datos iniciales o se agotó el tiempo de espera.");
      main_table(false);
    }
  });
});

// Función de ayuda para los valores decimales/temperaturas
function getSensorHtml(hasData, sensorTag) {
  if (hasData) {
    return `<span class='intar-decimal'>${sensorTag}</span>`;
  }
  return `<span style="color:#dc3545; font-weight:bold; background:rgba(255,255,255,0.8); padding:2px 5px; border-radius:4px; font-size:12px; box-shadow: 0px 0px 3px rgba(0,0,0,0.3);">${sensorTag}</span>`;
}

function getCounterHtml(hasData, counterTag) {
  if (hasData) {
    return `<span class='intar-decimal'>${counterTag}</span>`;
  }
  return `<span style="color:#dc3545; font-weight:bold; background:rgba(255,255,255,0.8); padding:2px 5px; border-radius:4px; font-size:12px; box-shadow: 0px 0px 3px rgba(0,0,0,0.3);">${counterTag}</span>`;
}

// Función de ayuda para las imágenes dinámicas/displays
function getDisplayHtml(hasData, displayTag) {
  if (hasData) {
    return `<span class='intar-display'>${displayTag}</span>`;
  }
  return `<span style="color:#dc3545; font-weight:bold; background:rgba(255,255,255,0.8); padding:2px 5px; border-radius:4px; font-size:12px; box-shadow: 0px 0px 3px rgba(0,0,0,0.3);">${displayTag}</span>`;
}

function main_table(hasData) {
  var html = "";
  html +=
    `<div style="" class="row" id="Grid-Container"><div style="position: relative;">
      <img src="layout01.png" style="width: 100%;height: calc(100vh - 88px);">
      
      <div style="position:absolute; top:32%; left:47%; background:rgba(255, 255, 255, 0); padding:8px; border-radius:6px;">
        ${getSensorHtml(hasData, 'Pb_T_S1/10/0/1/5')}
      </div>
      <div style="position:absolute; top:46%; left:32%; background:rgba(255, 255, 255, 0); padding:8px; border-radius:6px;">
        ${getSensorHtml(hasData, 'Pb_T_S2/10/0/1/5')}
      </div>
      <div style="position:absolute; top:29%; left:75%; background:rgba(255, 255, 255, 0); padding:8px; border-radius:6px;">
        ${getSensorHtml(hasData, 'Pb_T_S3/10/0/1/5')}
      </div>
      <div style="position:absolute; top:9%; left:35%; background:rgba(255, 255, 255, 0); padding:8px; border-radius:6px;">
        ${getSensorHtml(hasData, 'Pb_T_S4/10/0/1/5')}
      </div>
      <div style="position:absolute; top:31%; left:6%; background:rgba(255, 255, 255, 0); padding:8px; border-radius:6px;">
        ${getSensorHtml(hasData, 'Pb_T_S5/10/0/1/5')}
      </div>
      <div style="position:absolute; top:53%; left:24%; background:rgba(255, 255, 255, 0); padding:8px; border-radius:6px;">
        ${getSensorHtml(hasData, 'Pb_T_S6/10/0/1/5')}
      </div>
      <div style="position:absolute; top:5%; left:5%; background:rgba(255, 255, 255, 0); padding:8px; border-radius:6px;">
        ${getSensorHtml(hasData, 'Pb_T_S7/10/0/1/5')}
      </div>
      <div style="position:absolute; top:7%; left:65%; background:rgba(255, 255, 255, 0); padding:8px; border-radius:6px;">
        ${getSensorHtml(hasData, 'Pb_T_S14/10/0/1/5')}
      </div>
      <div style="position:absolute; top:9%; left:65%; background:rgba(255, 255, 255, 0); padding:8px; border-radius:6px;">
        ${getSensorHtml(hasData, 'Pb_T_S15/10/0/1/5')}
      </div>
      <div style="position:absolute; top:24%; left:90%; background:rgba(255, 255, 255, 0); padding:8px; border-radius:6px;">
        ${getSensorHtml(hasData, 'Pb_T_S24/10/0/1/5')}
      </div>
      <div style="position:absolute; top:26%; left:90%; background:rgba(255, 255, 255, 0); padding:8px; border-radius:6px;">
        ${getSensorHtml(hasData, 'Pb_T_S25/10/0/1/5')}
      </div>
      <div style="position:absolute; top:57%; left:8%; background:rgba(255, 255, 255, 0); padding:8px; border-radius:6px;">
        ${getSensorHtml(hasData, 'Pb_T_S26/10/0/1/5')}
      </div>
      <div style="position:absolute; top:6%; left:85%; background:rgba(255, 255, 255, 0); padding:8px; border-radius:6px;">
        ${getSensorHtml(hasData, 'Pb_T_S27/10/0/1/5')}
      </div>
      
      <div style="position:absolute; top:38%; left:50%; background:rgba(255,255,255,0); padding:8px; border-radius:6px;">
        ${getDisplayHtml(hasData, 'RL_BOMBAS_G1')}
      </div>
      <div style="position:absolute; top:60%; left:49%; background:rgba(255,255,255,0); padding:8px; border-radius:6px;">
        ${getDisplayHtml(hasData, 'RL_BOMBAS_G2')}
      </div>
      <div style="position:absolute; top:35%; left:33%; background:rgba(255,255,255,0); padding:8px; border-radius:6px;">
        ${getDisplayHtml(hasData, 'RL_BOMBAS_G3')}
      </div>
      <div style="position:absolute; top:45%; left:78%; background:rgba(255,255,255,0); padding:8px; border-radius:6px;">
        ${getDisplayHtml(hasData, 'RL_BOMBAS_G4')}
      </div>
      <div style="position:absolute; top:60%; left:84%; background:rgba(255,255,255,0); padding:8px; border-radius:6px; transform: rotate(90deg);">
        ${getDisplayHtml(hasData, 'RL_BOMBAS_G5')}
      </div>
      <div style="position:absolute; top:21%; left:6%; background:rgba(255,255,255,0); padding:8px; border-radius:6px;">
        ${getDisplayHtml(hasData, 'RL_BOMBA_G6')}
      </div>
      <div style="position:absolute; top:20%; left: 58%; background:rgba(255,255,255,0); padding:8px; border-radius:6px;">
        ${getDisplayHtml(hasData, 'RL_ENABLE_INTAR_BIG')}
      </div>
      <div style="position:absolute; top:20%; left:29%; background:rgba(255,255,255,0); padding:8px; border-radius:6px;">
        ${getDisplayHtml(hasData, 'RL_ENABLE_INTAR_SMALL')}
      </div>
      <div style="position:absolute; top:40%; left:85%; background:rgba(255,255,255,0); padding:8px; border-radius:6px;">
        ${getDisplayHtml(hasData, 'RL_ENABLE_BDC_KEYTER')}
      </div>
      <div style="position:absolute; top:42%; left:68%; background:rgba(255,255,255,0); padding:8px; border-radius:6px;">
        ${getDisplayHtml(hasData, 'RL_ELECT_HEATER_REC')}
      </div>
      <div style="position:absolute; top:84%; left:29%; background:rgba(255,255,255,0); padding:8px; border-radius:6px;">
        ${getCounterHtml(hasData, 'ST_LITROS_C1/10/0/1/5')}
      </div>
      <div style="position:absolute; top:74%; left:15%; background:rgba(255,255,255,0); padding:8px; border-radius:6px;">
        ${getCounterHtml(hasData, 'ST_LITROS_C2/10/0/1/5')}
      </div>
      <div style="position:absolute; top:89%; left:29%; background:rgba(255,255,255,0); padding:8px; border-radius:6px;">
        ${getCounterHtml(hasData, 'ST_LITROS_C3/10/0/1/5')}
      </div>
      <div style="position:absolute; top:17%; left:3%; background:rgba(255,255,255,0); padding:8px; border-radius:6px;">
        ${getCounterHtml(hasData, 'ST_LITROS_C4/10/0/1/5')}
      </div>
      <div style="position:absolute; top:65%; left:5%; background:rgba(255,255,255,0); padding:8px; border-radius:6px;">
        ${getCounterHtml(hasData, 'ST_LITROS_C5/10/0/1/5')}
      </div>
      <div style="position:absolute; top:78%; left:29%; background:rgba(255,255,255,0); padding:8px; border-radius:6px;">
        ${getCounterHtml(hasData, 'ST_LITROS_C6/10/0/1/5')}
      </div>
    </div>`;

  document.getElementById('Grid-Container').innerHTML = ""; // Limpia el contenedor por seguridad
  document.getElementById('Grid-Container').insertAdjacentHTML('afterBegin', html);
  load(hasData);
};

// Carga de los scripts adicionales
function load(hasData) {
  if (!hasData) {
    // Si no hay datos, no intentamos cargar intarcon.js, simplemente ocultamos el "Loading" y mostramos el mapa
    document.getElementById('main-load').style.display = "none";
    document.getElementById('Grid-Container').style.display = "";
    return;
  }

  $.ajax({
    url: 'js/intarcon.js',
    dataType: 'script',
    crossDomain: true,
    timeout: 5000, // Timeout por si intarcon.js tarda mucho en cargar
    success: function () {
      setTimeout(() => {
        document.getElementById('main-load').style.display = "none";
        document.getElementById('Grid-Container').style.display = "";
      }, 2500)
    },
    error: function () {
      console.warn("Error cargando intarcon.js. Volviendo a pintar sin datos...");
      // Si el script falla, repintamos toda la vista usando "Sin datos"
      main_table(false);
    }
  });
};