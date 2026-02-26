/*
//Vector con los valores del estado del compresor
var CPR_status = ["OFF", "100%", "Anti-short cycle", "Alarm", "33%", "50%", "66%", "Blocked", "Equalizing"];
var caudal_variable = 0, caudal_variable_sec = 0;

var domain = ""
//var domain = "http://192.168.0.170"
var intarconLoaded = false;

//Consultas ajax para ir generando el html
$(document).ready(function () {
  // Renderiza la tabla principal siempre, antes de las respuestas AJAX
  try {
    if (document.getElementById('Main-table')) {
      document.getElementById('Main-table').innerHTML = '';
      main_table();
    }
  } catch (e) { }
  // Asegura carga de intarcon.js y visibilidad del grid aunque no haya circuitos
  load();
  //Se obtiene si se ha configurado caudal variable
  $.ajax({
    crossOrigin: true,
    crossDomain: true,
    url: domain + "/cgi-bin/jgetvar.cgi?name=CAUDAL_VAR_EN",
    data: { get_param: 'value' },
    cache: false,
    dataType: 'json',
    success: function (data) {
      caudal_variable = data[0].value;
      try {
        if (document.getElementById('Main-table')) {
          document.getElementById('Main-table').innerHTML = '';
          main_table();
        }
      } catch (e) { }
    }
  });
  $.ajax({
    crossOrigin: true,
    crossDomain: true,
    url: domain + "/cgi-bin/jgetvar.cgi?name=ENABLE_INV_PUM1S",
    data: { get_param: 'value' },
    cache: false,
    dataType: 'json',
    success: function (data) { caudal_variable_sec = data[0].value; }
  });
  //Se obtiene el numero de circuitos
  $.ajax({
    crossOrigin: true,
    crossDomain: true,
    url: domain + "/cgi-bin/jgetvar.cgi?name=NumeroCircuitos",
    data: { get_param: 'value' },
    cache: false,
    dataType: 'json',
    success: function (data) { circuits(data); }
  });
});

//Funcion que genera la tabla de los datos principales segun la tipologia del equipo y su modo de trabajo
function main_table() {
  var html = "";
  let width = ""
  if (caudal_variable == 0) { width = "33%" } else { width = "25%" };
  html +=
    `<div class="row">
      <h3 class='text-center' style='background-color: #d9daff;'>STATUS (MAIN)</h3>\
      <div class="col-12 table-responsive">       
        <table id='table' class='table table-borderless text-center' style='border:none;'>
          <tr>
            <td style="width:`+ width + `;">
              <table id='tabla_IO' class='table table-borderless'>
                <thead><tr><th colspan='2' class="text-center"> Main Probes </th></tr></thead>
                <tr><th> Tª retorno colector frío </th><td> <span class='intar-decimal'>PB_T_S1/10/0/1/5</span> &degC </td></tr>
                <tr><th> Tª impulsión colector frío </td><td> <span class='intar-decimal'>PB_T_S2/10/0/1/5</span> &degC </td></tr>
                <tr><th> Set Point Frío </td><td> <span class='intar-decimal'>PAR_CONSIGNA_FRIO/10/0/1/5</span> &degC </td></tr>
              </table>
            </td>
            <td style="width:`+ width + `;">
              <table id='tabla_IO' class='table table-borderless'>
                <thead><tr><th colspan='2' class="text-center"> Status </th></tr></thead>
                <tr><th> On-off </th><td><span class='intar-bool'>ONOFF_GEN/<span style='color:blue;'>OFF</span>/<span style='color:red;'>ON</span>/10</span> </td></tr>
                <tr><th> Alarmas </th><td><span class='intar-bool'>ALARMA/<span style='color:blue;'>OFF</span>/<span style='color:red;'>ON</span>/10</span> </td></tr>
                <tr><th> Warnings </td><td><span class='intar-bool'>WARNING/<span style='color:blue;'>OFF</span>/<span style='color:red;'>ON</span>/10</span> </td></tr>
              </table>
            </td>
            <td style="width:`+ width + `;">
              <table id='tabla_IO' class='table table-borderless'>
                <thead><tr><th colspan='2' class="text-center"> Outputs </th></tr></thead>
                <tr><th> Enfriadora ammolite </th><td><span class='intar-bool'>RL_ENABLE_INTAR_BIG/<span style='color:blue;'>OFF</span>/<span style='color: red;'>ON</span>/10</span> </td></tr>
                <tr><th> Enfriadora Intarcon Pequeña </td><td><span class='intar-bool'>RL_ENABLE_INTAR_SMALL/<span style='color:blue;'>OFF</span>/<span style='color: red;'>ON</span>/10</span> </td></tr>
                <tr><th> Enfriadora Carrier </td><td><span class='intar-bool'>RL_ENABLE_CIATESA/<span style='color:blue;'>OFF</span>/<span style='color: red;'>ON</span>/10</span> </td></tr>
              </table>
            </td>`;
  if (caudal_variable == 1) {
    if (caudal_variable_sec == 0) {
      html +=
        `<td style="width:` + width + `;">
          <table id='tabla_IO' class='table table-borderless'>
            <tr><th colspan='2' class="text-center"> VARIABLE FLOW  PRI</th></tr>
            <tr><th> Suction Pressure Pump</td><td> <span class='intar-decimal'>Pb_T_S3/10/0/1/5</span> bar </td></tr>
            <tr><th> Delivery Pressure Pump</td><td> <span class='intar-decimal'>Pb_T_S4/10/0/1/5</span> bar </td></tr>
            <tr><th> Differential Pressure </th><td> <span class='intar-decimal'>PRESION_DIFERENCIAL/100/0/2/5</span> bar </td></tr>
            <tr><th> Water Pump Speed Percentage </td><td> <span class='intar-decimal'>CAUDAL_VAR_SALIDA_PID/1/0/0/5</span> % </td></tr>
          </table>
        </td>`;
    } else {
      html +=
        `<td style="width:` + width + `;">
          <table id='tabla_IO' class='table table-borderless'>
            <tr><th colspan='2' class="text-center"> VARIABLE FLOW SEC </th></tr>
            <tr><th> Suction Pressure Pump</th><td> <span class='intar-decimal'>Pb_T_S5/10/0/1/5</span> bar </td></tr>
            <tr><th> Delivery Pressure Pump</th><td> <span class='intar-decimal'>Pb_T_S6/10/0/1/5</span> bar </td></tr>
            <tr><th> Differential Pressure </th><td> <span class='intar-decimal'>PRESION_DIFERENCIAL_SEC/100/0/2/5</span> bar </td></tr>
            <tr><th> Water Pump Speed Percentage </th><td> <span class='intar-decimal'>PRES_DIFERENCIAL_SALIDA_PID/1/0/0/5</span> % </td></tr>
          </table>
        </td>`;
    }
  }
  html +=
    `</tr>
        </table>
      </div>
    </div>`;

  document.getElementById('Main-table').insertAdjacentHTML('afterBegin', html);
}

//Funcion que genera las tablas de los circuitos en funcion de los circuitos que haya y la to
function circuits(array) {
  var valor = array[0].value;
  var html = "";
  printButtons(valor)

  for (var i = 1; i < (valor + 1); i++) {
    html +=
      "<div id='circuit" + i + "' class='hidden' align='center'>\
        <h3 style='background-color: #d9daff;'>CIRCUIT "+ i + "</h3>\
        <div class='table-responsive'>\
          <table id='tabla_IO' class='table table-borderless text-center'>\
          <thead>\
            <tr>\
              <th colspan='2' style='width:33%;'>Probes</th>\
              <th colspan='2' style='width:33%;'>Compressors status</th>\
              <th colspan='2' style='width:33%;'>Safeties</th>\
            </tr>\
          </thead>\
            <tr>\
              <th>Evaporating transducer</td>\
              <td><span class='intar-decimal'>Pb_T_evap"+ i + "/10/0/1/3</span>&degC/<span class='intar-decimal'>Pb_P_evap" + i + "/10/0/1/10</span>bar</td>\
              <th>Compressor 1</td>\
              <td><span class='intar-select'>Estado_CPR_Cir"+ i + "[1]/CPR_status/3</span></td>\
              <th>LPS C"+ i + " Status</td>\
              <td><span class='intar-bool'>DI_LP_switch_C"+ i + "/<span style='color: red;'>ON</span>/<span style='color: blue';>OFF</span>/10</span></td>\
            </tr>\
            <tr>\
              <th>Condensing transducer</td>\
              <td><span class='intar-decimal'>Pb_T_conde"+ i + "/10/0/1/10</span>&degC/<span class='intar-decimal'>Pb_P_conde" + i + "/10/0/1/10</span>bar</td>\
              <th>Compressor 2</th>\
              <td><span class='intar-select'>Estado_CPR_Cir"+ i + "[2]/CPR_status/3</span></td>\
              <th>HPS C"+ i + " Status</th>\
              <td><span class='intar-bool'>DI_HP_switch_C"+ i + "/<span style='color: red;'>ON</span>/<span style='color: blue;'>OFF</span>/10</span></td>\
            </tr>\
            <tr>\
              <th>Suction Temperature</th>\
              <td><span class='intar-decimal'>Pb_T_aspi"+ i + "/10/0/1/10</span>&degC</td>\
              <th>Compressor 3</th>\
              <td><span class='intar-select'>Estado_CPR_Cir"+ i + "[3]/CPR_status/3</span></td>\
            </tr>\
            <tr>\
              <th>Outlet Temperature</td>\
              <td><span class='intar-decimal'>Pb_T_impulsion"+ i + "/10/0/1/10</span>&degC</td>\
              <th>Compressor 4</th>\
              <td><span class='intar-select'>Estado_CPR_Cir"+ i + "[4]/CPR_status/3</span></td>\
            </tr>\
            <tr>\
              <th>Freon Temperature</th>\
              <td><span class='intar-decimal'>Pb_T_freon"+ i + "/10/0/1/10</span>&degC</td>"
    if (i == 1) {
      html += "	<th>Compressor 5</td>\
                    <td><span class='intar-select'>Estado_CPR_Cir"+ i + "[5]/CPR_status/3</span></td>"
    }
    html +=
      "</tr>\
            <tr>\
              <th>Superheating</th>\
              <td><span class='intar-decimal'>SH_C"+ i + "/10/0/1/10</span>&degK</td>"
    if (i == 1) {
      html += "	<th>Compressor 6</th>\
                    <td><span class='intar-select'>Estado_CPR_Cir"+ i + "[6]/CPR_status/3</span></td>"
    }
    html +=
      "</tr>\
          </table>\
        </div>\
      </div>";
  }
  document.getElementById('Main-content').insertAdjacentHTML('afterEnd', html);
  load();
};

//Funcion para visualizar botones
function printButtons(valor) {
  var html = "";
  //Bucle para generar los botones en funcion del numero de circuitos
  for (var i = 1; i < (valor + 1); i++) {
    html += "<button class='btn circuit-button mb-3' onclick='hide(this,\"" + i + "\")'>CIRCUIT " + i + "</button>";
  };
  document.getElementById('N-circuits').insertAdjacentHTML('afterBegin', html);
}

//Funcion que oculta o muestra los datos de los circuitos
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
};

//Carga de los scripts
function load() {
  if (intarconLoaded) {
    setTimeout(() => {
      document.getElementById('main-load').style.display = "none";
      document.getElementById('Grid-Container').style.display = "";
    }, 250);
    return;
  }
  $.ajax({
    url: 'js/intarcon.js',
    dataType: 'script',
    crossDomain: true,
    success: function () {
      intarconLoaded = true;
      setTimeout(() => {
        document.getElementById('main-load').style.display = "none";
        document.getElementById('Grid-Container').style.display = "";
      }, 2500)
    }
  });
};
*/

var intarconLoaded = false;

$(document).ready(function () {
  try {
    if (document.getElementById('Main-table')) {
      document.getElementById('Main-table').innerHTML = '';
      renderMainTable();
    }
  } catch (e) { }
  loadIntarcon(function () {
    var ml = document.getElementById('main-load');
    var gc = document.getElementById('Grid-Container');
    if (ml) ml.style.display = "none";
    if (gc) gc.style.display = "";
  });
});

function renderMainTable() {
  var html = "";
  var width = "33%";
  html +=
    `<div class="row">
      <h3 class='text-center' style='background-color: #d9daff;'>STATUS (MAIN)</h3>\
      <div class="col-12 table-responsive">       
        <table id='table' class='table table-borderless text-center' style='border:none;'>
          <tr>
            <td style="width:`+ width + `;">
              <table id='tabla_IO' class='table table-borderless'>
                <thead><tr><th colspan='2' class="text-center"> Main Probes </th></tr></thead>
                <tr><th> Tª retorno colector frío </th><td> <span class='intar-decimal'>PB_T_S1/10/0/1/5</span> &degC </td></tr>
                <tr><th> Tª impulsión colector frío </td><td> <span class='intar-decimal'>PB_T_S2/10/0/1/5</span> &degC </td></tr>
                <tr><th> Set Point Frío </td><td> <span class='intar-decimal'>PAR_CONSIGNA_FRIO/10/0/1/5</span> &degC </td></tr>
              </table>
            </td>
            <td style="width:`+ width + `;">
              <table id='tabla_IO' class='table table-borderless'>
                <thead><tr><th colspan='2' class="text-center"> Status </th></tr></thead>
                <tr><th> On-off </th><td><span class='intar-bool'>ONOFF_GEN/<span style='color:blue;'>OFF</span>/<span style='color:red;'>ON</span>/10</span> </td></tr>
                <tr><th> Alarmas </th><td><span class='intar-bool'>ALARMA/<span style='color:blue;'>OFF</span>/<span style='color:red;'>ON</span>/10</span> </td></tr>
                <tr><th> Warnings </td><td><span class='intar-bool'>WARNING/<span style='color:blue;'>OFF</span>/<span style='color:red;'>ON</span>/10</span> </td></tr>
              </table>
            </td>
            <td style="width:`+ width + `;">
              <table id='tabla_IO' class='table table-borderless'>
                <thead><tr><th colspan='2' class="text-center"> Outputs </th></tr></thead>
                <tr><th> Enfriadora ammolite </th><td><span class='intar-bool'>RL_ENABLE_INTAR_BIG/<span style='color:blue;'>OFF</span>/<span style='color: red;'>ON</span>/10</span> </td></tr>
                <tr><th> Enfriadora Intarcon Pequeña </td><td><span class='intar-bool'>RL_ENABLE_INTAR_SMALL/<span style='color:blue;'>OFF</span>/<span style='color: red;'>ON</span>/10</span> </td></tr>
                <tr><th> Enfriadora Carrier </td><td><span class='intar-bool'>RL_ENABLE_CIATESA/<span style='color:blue;'>OFF</span>/<span style='color: red;'>ON</span>/10</span> </td></tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </div>`;
  document.getElementById('Main-table').insertAdjacentHTML('afterBegin', html);
}

function loadIntarcon(done) {
  if (intarconLoaded) { if (typeof done === 'function') done(); return; }
  $.ajax({
    url: 'js/intarcon.js',
    dataType: 'script',
    crossDomain: true,
    success: function () { intarconLoaded = true; if (typeof done === 'function') done(); }
  });
}