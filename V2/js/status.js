// Vector con los valores del estado del compresor
var CPR_status = ["OFF", "100%", "Anti-short cycle", "Alarm", "33%", "50%", "66%", "Blocked", "Equalizing"];
var caudal_variable, caudal_variable_sec;

var domain = "";
//var domain = "http://172.17.123.250"

// Función de ayuda para generar las etiquetas o el mensaje de error
function getTagHtml(hasData, innerContent, cssClass) {
  if (hasData) {
    return `<span class='${cssClass}'>${innerContent}</span>`;
  }
  return `<span style="color:#dc3545; font-weight:bold; background:rgba(255,255,255,0.8); padding:2px 5px; border-radius:4px; font-size:12px; box-shadow: 0px 0px 3px rgba(0,0,0,0.3);">Sin datos</span>`;
}

// Consultas ajax para ir generando el html
$(document).ready(function () {
  // Configuración base para las peticiones
  var ajaxConfig = {
    crossOrigin: true,
    crossDomain: true,
    data: { get_param: 'value' },
    cache: false,
    dataType: 'json',
    timeout: 5000 // Timeout de 5 segundos
  };

  // Preparamos las 3 peticiones
  var req1 = $.ajax(Object.assign({ url: domain + "/cgi-bin/jgetvar.cgi?name=CAUDAL_VAR_EN" }, ajaxConfig));
  var req2 = $.ajax(Object.assign({ url: domain + "/cgi-bin/jgetvar.cgi?name=ENABLE_INV_PUM1S" }, ajaxConfig));
  var req3 = $.ajax(Object.assign({ url: domain + "/cgi-bin/jgetvar.cgi?name=NumeroCircuitos" }, ajaxConfig));

  // Esperamos a que TODAS las peticiones terminen
  $.when(req1, req2, req3)
    .done(function (res1, res2, res3) {
      // Si todo va bien, obtenemos los datos
      caudal_variable = res1[0][0].value;
      caudal_variable_sec = res2[0][0].value;
      var numCircuitos = res3[0][0].value;

      main_table(true);
      circuits(numCircuitos, true);
    })
    .fail(function () {
      // Si ocurre un error o salta el timeout
      console.warn("Fallo al obtener los datos iniciales o se agotó el tiempo. Mostrando vista 'Sin datos'.");
      caudal_variable = 0;
      caudal_variable_sec = 0;
      
      main_table(false);
      circuits(1, false); // Dibujamos al menos 1 circuito en blanco para mantener la estructura
    });
});

// Funcion que genera la tabla de los datos principales segun la tipologia del equipo y su modo de trabajo
function main_table(hasData) {
  var html = "";
  let width = (caudal_variable == 0) ? "33%" : "25%";
  
  html +=
    `<div class="row">
      <h3 class='text-center' style='background-color: #d9daff;'>STATUS (MAIN)</h3>
      <div class="col-12 table-responsive">       
        <table id='table' class='table table-borderless text-center' style='border:none;'>
          <tr>
            <td style="width:${width};">
              <table id='tabla_IO' class='table table-borderless'>
                <thead><tr><th colspan='2' class="text-center"> Main Probes </th></tr></thead>
                <tr><th> Inlet Temperature </th><td> ${getTagHtml(hasData, 'Pb_T_retorno/10/0/1/5', 'intar-decimal')} &degC </td></tr>
                <tr><th> Outlet Temperature </td><td> ${getTagHtml(hasData, 'Pb_T_impulsion/10/0/1/5', 'intar-decimal')} &degC </td></tr>
                <tr><th> Set Point </td><td> ${getTagHtml(hasData, 'SET_GLICOL/10/0/1/5', 'intar-decimal')} &degC </td></tr>
              </table>
            </td>
            <td style="width:${width};">
              <table id='tabla_IO' class='table table-borderless'>
                <thead><tr><th colspan='2' class="text-center"> Status </th></tr></thead>
                <tr><th> On-off </th><td>${getTagHtml(hasData, "ONOFF_GEN/<span style='color:blue;'>OFF</span>/<span style='color:red;'>ON</span>/10", 'intar-bool')} </td></tr>
                <tr><th> Alarm </th><td>${getTagHtml(hasData, "ALARMA/<span style='color:blue;'>OFF</span>/<span style='color:red;'>ON</span>/10", 'intar-bool')} </td></tr>
                <tr><th> Warning </td><td>${getTagHtml(hasData, "WARNING/<span style='color:blue;'>OFF</span>/<span style='color:red;'>ON</span>/10", 'intar-bool')} </td></tr>
                <tr><th> Cooling </th><td>${getTagHtml(hasData, "COMPRESOR/<span style='color:blue;'>OFF</span>/<span style='color: red;'>ON</span>/10", 'intar-bool')} </td></tr>
              </table>
            </td>
            <td style="width:${width};">
              <table id='tabla_IO' class='table table-borderless'>
                <thead><tr><th colspan='2' class="text-center"> Outputs </th></tr></thead>
                <tr><th> Flow-switch </td><td>${getTagHtml(hasData, "DI_flow_switch/<span style='color:blue;'>OFF</span>/<span style='color:red;'>ON</span>", 'intar-bool')}</td></tr>
                <tr><th> Pump1 </th><td>${getTagHtml(hasData, "RELE_BOMBA1/<span style='color:blue;'>OFF</span>/<span style='color: red;'>ON</span>/10", 'intar-bool')} </td></tr>
                <tr><th> Pump2 </td><td>${getTagHtml(hasData, "RELE_BOMBA2/<span style='color:blue;'>OFF</span>/<span style='color: red;'>ON</span>/10", 'intar-bool')} </td></tr>
              </table>
            </td>`;
  
  if (caudal_variable == 1) {
    if (caudal_variable_sec == 0) {
      html +=
        `<td style="width:${width};">
          <table id='tabla_IO' class='table table-borderless'>
            <tr><th colspan='2' class="text-center"> VARIABLE FLOW  PRI</th></tr>
            <tr><th> Suction Pressure Pump</td><td> ${getTagHtml(hasData, 'Pb_P_aspi_pump/10/0/1/5', 'intar-decimal')} bar </td></tr>
            <tr><th> Delivery Pressure Pump</td><td> ${getTagHtml(hasData, 'Pb_P_impu_pump/10/0/1/5', 'intar-decimal')} bar </td></tr>
            <tr><th> Differential Pressure </th><td> ${getTagHtml(hasData, 'PRESION_DIFERENCIAL/100/0/2/5', 'intar-decimal')} bar </td></tr>
            <tr><th> Water Pump Speed Percentage </td><td> ${getTagHtml(hasData, 'CAUDAL_VAR_SALIDA_PID/1/0/0/5', 'intar-decimal')} % </td></tr>
          </table>
        </td>`;
    } else {
      html +=
        `<td style="width:${width};">
          <table id='tabla_IO' class='table table-borderless'>
            <tr><th colspan='2' class="text-center"> VARIABLE FLOW SEC </th></tr>
            <tr><th> Suction Pressure Pump</th><td> ${getTagHtml(hasData, 'Pb_P_aspi_pump2/10/0/1/5', 'intar-decimal')} bar </td></tr>
            <tr><th> Delivery Pressure Pump</th><td> ${getTagHtml(hasData, 'Pb_P_impu_pump2/10/0/1/5', 'intar-decimal')} bar </td></tr>
            <tr><th> Differential Pressure </th><td> ${getTagHtml(hasData, 'PRESION_DIFERENCIAL_SEC/100/0/2/5', 'intar-decimal')} bar </td></tr>
            <tr><th> Water Pump Speed Percentage </th><td> ${getTagHtml(hasData, 'PRES_DIFERENCIAL_SALIDA_PID/1/0/0/5', 'intar-decimal')} % </td></tr>
          </table>
        </td>`;
    }
  }
  
  html +=
    `     </tr>
        </table>
      </div>
    </div>`;

  document.getElementById('Main-table').innerHTML = "";
  document.getElementById('Main-table').insertAdjacentHTML('afterBegin', html);
}

// Funcion que genera las tablas de los circuitos en funcion de los circuitos que haya y la tipología
function circuits(valor, hasData) {
  var html = "";
  printButtons(valor);

  for (var i = 1; i < (valor + 1); i++) {
    html +=
      `<div id='circuit${i}' class='hidden' align='center'>
        <h3 style='background-color: #d9daff;'>CIRCUIT ${i}</h3>
        <div class='table-responsive'>
          <table id='tabla_IO' class='table table-borderless text-center'>
          <thead>
            <tr>
              <th colspan='2' style='width:33%;'>Probes</th>
              <th colspan='2' style='width:33%;'>Compressors status</th>
              <th colspan='2' style='width:33%;'>Safeties</th>
            </tr>
          </thead>
            <tr>
              <th>Evaporating transducer</td>
              <td>${getTagHtml(hasData, `Pb_T_evap${i}/10/0/1/3`, 'intar-decimal')}&degC / ${getTagHtml(hasData, `Pb_P_evap${i}/10/0/1/10`, 'intar-decimal')}bar</td>
              <th>Compressor 1</td>
              <td>${getTagHtml(hasData, `Estado_CPR_Cir${i}[1]/CPR_status/3`, 'intar-select')}</td>
              <th>LPS C${i} Status</td>
              <td>${getTagHtml(hasData, `DI_LP_switch_C${i}/<span style='color: red;'>ON</span>/<span style='color: blue';>OFF</span>/10`, 'intar-bool')}</td>
            </tr>
            <tr>
              <th>Condensing transducer</td>
              <td>${getTagHtml(hasData, `Pb_T_conde${i}/10/0/1/10`, 'intar-decimal')}&degC / ${getTagHtml(hasData, `Pb_P_conde${i}/10/0/1/10`, 'intar-decimal')}bar</td>
              <th>Compressor 2</th>
              <td>${getTagHtml(hasData, `Estado_CPR_Cir${i}[2]/CPR_status/3`, 'intar-select')}</td>
              <th>HPS C${i} Status</th>
              <td>${getTagHtml(hasData, `DI_HP_switch_C${i}/<span style='color: red;'>ON</span>/<span style='color: blue;'>OFF</span>/10`, 'intar-bool')}</td>
            </tr>
            <tr>
              <th>Suction Temperature</th>
              <td>${getTagHtml(hasData, `Pb_T_aspi${i}/10/0/1/10`, 'intar-decimal')}&degC</td>
              <th>Compressor 3</th>
              <td>${getTagHtml(hasData, `Estado_CPR_Cir${i}[3]/CPR_status/3`, 'intar-select')}</td>
            </tr>
            <tr>
              <th>Outlet Temperature</td>
              <td>${getTagHtml(hasData, `Pb_T_impulsion${i}/10/0/1/10`, 'intar-decimal')}&degC</td>
              <th>Compressor 4</th>
              <td>${getTagHtml(hasData, `Estado_CPR_Cir${i}[4]/CPR_status/3`, 'intar-select')}</td>
            </tr>
            <tr>
              <th>Freon Temperature</th>
              <td>${getTagHtml(hasData, `Pb_T_freon${i}/10/0/1/10`, 'intar-decimal')}&degC</td>`;
              
    if (i == 1) {
      html += `<th>Compressor 5</td>
               <td>${getTagHtml(hasData, `Estado_CPR_Cir${i}[5]/CPR_status/3`, 'intar-select')}</td>`;
    }
    
    html +=
      `     </tr>
            <tr>
              <th>Superheating</th>
              <td>${getTagHtml(hasData, `SH_C${i}/10/0/1/10`, 'intar-decimal')}&degK</td>`;
              
    if (i == 1) {
      html += `<th>Compressor 6</th>
               <td>${getTagHtml(hasData, `Estado_CPR_Cir${i}[6]/CPR_status/3`, 'intar-select')}</td>`;
    }
    
    html +=
      `     </tr>
          </table>
        </div>
      </div>`;
  }
  
  // Limpiamos los elementos contiguos por si ocurre un recargado en caliente
  var mainContent = document.getElementById('Main-content');
  while (mainContent.nextElementSibling && mainContent.nextElementSibling.id.startsWith('circuit')) {
    mainContent.nextElementSibling.remove();
  }
  
  mainContent.insertAdjacentHTML('afterEnd', html);
  load(hasData);
}

// Funcion para visualizar botones
function printButtons(valor) {
  var html = "";
  // Bucle para generar los botones en funcion del numero de circuitos
  for (var i = 1; i < (valor + 1); i++) {
    html += "<button class='btn circuit-button mb-3' onclick='hide(this,\"" + i + "\")'>CIRCUIT " + i + "</button> ";
  }
  document.getElementById('N-circuits').innerHTML = "";
  document.getElementById('N-circuits').insertAdjacentHTML('afterBegin', html);
}

// Funcion que oculta o muestra los datos de los circuitos
function hide(id, value) {
  var div_id = document.getElementById('circuit' + value);
  if (div_id.className == 'hidden') {
    $(div_id).removeClass('hidden');
    id.style.backgroundColor = '#1a82ba';
  }
  else {
    div_id.className = 'hidden';
    id.style.backgroundColor = 'gray';
  }
}

// Carga de los scripts
function load(hasData) {
  if (!hasData) {
    // Si no hay datos, ocultamos el loader de inmediato
    document.getElementById('main-load').style.display = "none";
    if (document.getElementById('Grid-Container')) document.getElementById('Grid-Container').style.display = "";
    return;
  }

  $.ajax({
    url: 'js/intarcon.js',
    dataType: 'script',
    crossDomain: true,
    timeout: 5000,
    success: function () {
      setTimeout(() => {
        document.getElementById('main-load').style.display = "none";
        // Si tienes el Grid-Container en tu HTML (como en el script anterior), lo activamos.
        if (document.getElementById('Grid-Container')) document.getElementById('Grid-Container').style.display = "";
      }, 2500)
    },
    error: function () {
      console.warn("No se pudo cargar intarcon.js, forzando vista 'Sin datos'.");
      main_table(false);
      circuits(1, false);
    }
  });
}