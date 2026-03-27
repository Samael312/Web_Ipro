// =============================================================================
//  status.js  —  PÁGINA DE ESTADO  (archivo GENÉRICO)
//  Los tags de topología se configuran en js/config.js → CLIENT_CONFIG.status
// =============================================================================

var CPR_status = ["OFF", "100%", "Anti-short cycle", "Alarm", "33%", "50%", "66%", "Blocked", "Equalizing"];
var caudal_variable, caudal_variable_sec;

var domain = CLIENT_CONFIG.domain || "";

// --- Helper HTML ---
function getTagHtml(hasData, innerContent, cssClass) {
  if (hasData) return `<span class='${cssClass}'>${innerContent}</span>`;
  return `<span style="color:#dc3545;font-weight:bold;background:rgba(255,255,255,0.8);
          padding:2px 5px;border-radius:4px;font-size:12px;
          box-shadow:0 0 3px rgba(0,0,0,0.3);">Sin datos</span>`;
}

// --- Arranque: lee los 3 tags de topología desde config ---
$(document).ready(function () {
  const cfg = CLIENT_CONFIG.status;

  const ajaxConfig = {
    crossOrigin: true, crossDomain: true,
    data: { get_param: 'value' }, cache: false, dataType: 'json', timeout: 5000,
  };

  const req1 = $.ajax(Object.assign({ url: domain + "/cgi-bin/jgetvar.cgi?name=" + cfg.tagCaudalVar    }, ajaxConfig));
  const req2 = $.ajax(Object.assign({ url: domain + "/cgi-bin/jgetvar.cgi?name=" + cfg.tagCaudalVarSec }, ajaxConfig));
  const req3 = $.ajax(Object.assign({ url: domain + "/cgi-bin/jgetvar.cgi?name=" + cfg.tagNumCircuitos }, ajaxConfig));

  $.when(req1, req2, req3)
    .done(function (res1, res2, res3) {
      caudal_variable     = res1[0][0].value;
      caudal_variable_sec = res2[0][0].value;
      const numCircuitos  = res3[0][0].value;
      main_table(true);
      circuits(numCircuitos, true);
    })
    .fail(function () {
      console.warn("Sin datos del controlador. Mostrando vista vacía.");
      caudal_variable     = 0;
      caudal_variable_sec = 0;
      main_table(false);
      circuits(1, false);
    });
});

// =============================================================================
//  TABLA PRINCIPAL
// =============================================================================

function main_table(hasData) {
  let width = (caudal_variable == 0) ? "33%" : "25%";
  let html = `
    <div class="row">
      <h3 class='text-center' style='background-color:#d9daff;'>STATUS (MAIN)</h3>
      <div class="col-12 table-responsive">
        <table class='table table-borderless text-center' style='border:none;'>
          <tr>
            <td style="width:${width};">
              <table class='table table-borderless'>
                <thead><tr><th colspan='2' class="text-center">Main Probes</th></tr></thead>
                <tr><th>Inlet Temperature</th><td>${getTagHtml(hasData, 'Pb_T_retorno/10/0/1/5', 'intar-decimal')} &degC</td></tr>
                <tr><th>Outlet Temperature</th><td>${getTagHtml(hasData, 'Pb_T_impulsion/10/0/1/5', 'intar-decimal')} &degC</td></tr>
                <tr><th>Set Point</th><td>${getTagHtml(hasData, 'SET_GLICOL/10/0/1/5', 'intar-decimal')} &degC</td></tr>
              </table>
            </td>
            <td style="width:${width};">
              <table class='table table-borderless'>
                <thead><tr><th colspan='2' class="text-center">Status</th></tr></thead>
                <tr><th>On-off</th><td>${getTagHtml(hasData, "ONOFF_GEN/<span style='color:blue;'>OFF</span>/<span style='color:red;'>ON</span>/10", 'intar-bool')}</td></tr>
                <tr><th>Alarm</th><td>${getTagHtml(hasData, "ALARMA/<span style='color:blue;'>OFF</span>/<span style='color:red;'>ON</span>/10", 'intar-bool')}</td></tr>
                <tr><th>Warning</th><td>${getTagHtml(hasData, "WARNING/<span style='color:blue;'>OFF</span>/<span style='color:red;'>ON</span>/10", 'intar-bool')}</td></tr>
                <tr><th>Cooling</th><td>${getTagHtml(hasData, "COMPRESOR/<span style='color:blue;'>OFF</span>/<span style='color:red;'>ON</span>/10", 'intar-bool')}</td></tr>
              </table>
            </td>
            <td style="width:${width};">
              <table class='table table-borderless'>
                <thead><tr><th colspan='2' class="text-center">Outputs</th></tr></thead>
                <tr><th>Flow-switch</th><td>${getTagHtml(hasData, "DI_flow_switch/<span style='color:blue;'>OFF</span>/<span style='color:red;'>ON</span>", 'intar-bool')}</td></tr>
                <tr><th>Pump1</th><td>${getTagHtml(hasData, "RELE_BOMBA1/<span style='color:blue;'>OFF</span>/<span style='color:red;'>ON</span>/10", 'intar-bool')}</td></tr>
                <tr><th>Pump2</th><td>${getTagHtml(hasData, "RELE_BOMBA2/<span style='color:blue;'>OFF</span>/<span style='color:red;'>ON</span>/10", 'intar-bool')}</td></tr>
              </table>
            </td>`;

  if (caudal_variable == 1) {
    if (caudal_variable_sec == 0) {
      html += `
            <td style="width:${width};">
              <table class='table table-borderless'>
                <tr><th colspan='2' class="text-center">VARIABLE FLOW PRI</th></tr>
                <tr><th>Suction Pressure Pump</th><td>${getTagHtml(hasData, 'Pb_P_aspi_pump/10/0/1/5', 'intar-decimal')} bar</td></tr>
                <tr><th>Delivery Pressure Pump</th><td>${getTagHtml(hasData, 'Pb_P_impu_pump/10/0/1/5', 'intar-decimal')} bar</td></tr>
                <tr><th>Differential Pressure</th><td>${getTagHtml(hasData, 'PRESION_DIFERENCIAL/100/0/2/5', 'intar-decimal')} bar</td></tr>
                <tr><th>Water Pump Speed %</th><td>${getTagHtml(hasData, 'CAUDAL_VAR_SALIDA_PID/1/0/0/5', 'intar-decimal')} %</td></tr>
              </table>
            </td>`;
    } else {
      html += `
            <td style="width:${width};">
              <table class='table table-borderless'>
                <tr><th colspan='2' class="text-center">VARIABLE FLOW SEC</th></tr>
                <tr><th>Suction Pressure Pump</th><td>${getTagHtml(hasData, 'Pb_P_aspi_pump2/10/0/1/5', 'intar-decimal')} bar</td></tr>
                <tr><th>Delivery Pressure Pump</th><td>${getTagHtml(hasData, 'Pb_P_impu_pump2/10/0/1/5', 'intar-decimal')} bar</td></tr>
                <tr><th>Differential Pressure</th><td>${getTagHtml(hasData, 'PRESION_DIFERENCIAL_SEC/100/0/2/5', 'intar-decimal')} bar</td></tr>
                <tr><th>Water Pump Speed %</th><td>${getTagHtml(hasData, 'PRES_DIFERENCIAL_SALIDA_PID/1/0/0/5', 'intar-decimal')} %</td></tr>
              </table>
            </td>`;
    }
  }

  html += `     </tr>
        </table>
      </div>
    </div>`;

  document.getElementById('Main-table').innerHTML = "";
  document.getElementById('Main-table').insertAdjacentHTML('afterBegin', html);
}

// =============================================================================
//  CIRCUITOS
// =============================================================================

function circuits(valor, hasData) {
  let html = "";
  printButtons(valor);

  for (let i = 1; i <= valor; i++) {
    html += `
      <div id='circuit${i}' class='hidden' align='center'>
        <h3 style='background-color:#d9daff;'>CIRCUIT ${i}</h3>
        <div class='table-responsive'>
          <table class='table table-borderless text-center'>
            <thead>
              <tr>
                <th colspan='2' style='width:33%;'>Probes</th>
                <th colspan='2' style='width:33%;'>Compressors status</th>
                <th colspan='2' style='width:33%;'>Safeties</th>
              </tr>
            </thead>
            <tr>
              <th>Evaporating transducer</th>
              <td>${getTagHtml(hasData, `Pb_T_evap${i}/10/0/1/3`, 'intar-decimal')}&degC /
                  ${getTagHtml(hasData, `Pb_P_evap${i}/10/0/1/10`, 'intar-decimal')}bar</td>
              <th>Compressor 1</th>
              <td>${getTagHtml(hasData, `Estado_CPR_Cir${i}[1]/CPR_status/3`, 'intar-select')}</td>
              <th>LPS C${i} Status</th>
              <td>${getTagHtml(hasData, `DI_LP_switch_C${i}/<span style='color:red;'>ON</span>/<span style='color:blue;'>OFF</span>/10`, 'intar-bool')}</td>
            </tr>
            <tr>
              <th>Condensing transducer</th>
              <td>${getTagHtml(hasData, `Pb_T_conde${i}/10/0/1/10`, 'intar-decimal')}&degC /
                  ${getTagHtml(hasData, `Pb_P_conde${i}/10/0/1/10`, 'intar-decimal')}bar</td>
              <th>Compressor 2</th>
              <td>${getTagHtml(hasData, `Estado_CPR_Cir${i}[2]/CPR_status/3`, 'intar-select')}</td>
              <th>HPS C${i} Status</th>
              <td>${getTagHtml(hasData, `DI_HP_switch_C${i}/<span style='color:red;'>ON</span>/<span style='color:blue;'>OFF</span>/10`, 'intar-bool')}</td>
            </tr>
            <tr>
              <th>Suction Temperature</th>
              <td>${getTagHtml(hasData, `Pb_T_aspi${i}/10/0/1/10`, 'intar-decimal')}&degC</td>
              <th>Compressor 3</th>
              <td>${getTagHtml(hasData, `Estado_CPR_Cir${i}[3]/CPR_status/3`, 'intar-select')}</td>
            </tr>
            <tr>
              <th>Outlet Temperature</th>
              <td>${getTagHtml(hasData, `Pb_T_impulsion${i}/10/0/1/10`, 'intar-decimal')}&degC</td>
              <th>Compressor 4</th>
              <td>${getTagHtml(hasData, `Estado_CPR_Cir${i}[4]/CPR_status/3`, 'intar-select')}</td>
            </tr>
            <tr>
              <th>Freon Temperature</th>
              <td>${getTagHtml(hasData, `Pb_T_freon${i}/10/0/1/10`, 'intar-decimal')}&degC</td>
              ${i == 1 ? `<th>Compressor 5</th><td>${getTagHtml(hasData, `Estado_CPR_Cir${i}[5]/CPR_status/3`, 'intar-select')}</td>` : ''}
            </tr>
            <tr>
              <th>Superheating</th>
              <td>${getTagHtml(hasData, `SH_C${i}/10/0/1/10`, 'intar-decimal')}&degK</td>
              ${i == 1 ? `<th>Compressor 6</th><td>${getTagHtml(hasData, `Estado_CPR_Cir${i}[6]/CPR_status/3`, 'intar-select')}</td>` : ''}
            </tr>
          </table>
        </div>
      </div>`;
  }

  // Limpiar circuitos anteriores
  const mainContent = document.getElementById('Main-content');
  while (mainContent.nextElementSibling && mainContent.nextElementSibling.id.startsWith('circuit')) {
    mainContent.nextElementSibling.remove();
  }
  mainContent.insertAdjacentHTML('afterEnd', html);
  load(hasData);
}

function printButtons(valor) {
  let html = "";
  for (let i = 1; i <= valor; i++) {
    html += `<button class='btn circuit-button mb-3' onclick='hide(this,"${i}")'>CIRCUIT ${i}</button> `;
  }
  document.getElementById('N-circuits').innerHTML = "";
  document.getElementById('N-circuits').insertAdjacentHTML('afterBegin', html);
}

function hide(id, value) {
  const div = document.getElementById('circuit' + value);
  if (div.className == 'hidden') {
    $(div).removeClass('hidden');
    id.style.backgroundColor = '#1a82ba';
  } else {
    div.className = 'hidden';
    id.style.backgroundColor = 'gray';
  }
}

function load(hasData) {
  if (!hasData) {
    document.getElementById('main-load').style.display = "none";
    const grid = document.getElementById('Grid-Container');
    if (grid) grid.style.display = "";
    return;
  }
  $.ajax({
    url: 'js/intarcon.js', dataType: 'script', crossDomain: true, timeout: 5000,
    success: function () {
      setTimeout(() => {
        document.getElementById('main-load').style.display = "none";
        const grid = document.getElementById('Grid-Container');
        if (grid) grid.style.display = "";
      }, 2500);
    },
    error: function () {
      console.warn("No se pudo cargar intarcon.js. Vista sin datos.");
      main_table(false);
      circuits(1, false);
    }
  });
}
