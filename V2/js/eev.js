//Vector con los valores del estado del compresor
var CPR_status = "OFF/100%/Anti-short cycle/Alarm/33%/50%/66%/Blocked/Equalizing/VFD regulating"
//Variables para almacenar el modo de trabajo para consulta por las funciones de creacion del html
var EN_EVD1, EN_EVD2, EN_EVD3, EN_EVD4, EN_EVD5;

var domain = ""
//var domain = "http://192.168.0.170"

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
    success: function (data) {
      valor = data[0].value;
    }
  });
  return valor;
}

$(document).ready(function () {
  EN_EVD1 = peticionAjax("PAR_ADR_EEV[1]");
  EN_EVD2 = peticionAjax("PAR_ADR_EEV[2]");
  EN_EVD3 = peticionAjax("PAR_ADR_EEV[3]");
  EN_EVD4 = peticionAjax("PAR_ADR_EEV[4]");
  EN_EVD5 = peticionAjax("PAR_ADR_EEV[5]");

  //Se obtiene si se ha configurado caudal variable
  $.ajax({
    crossOrigin: true,
    crossDomain: true,
    url: domain + "/cgi-bin/jgetvar.cgi?name=CAUDAL_VAR_EN",
    data: { get_param: 'value' },
    cache: false,
    dataType: 'json',
    success: function (data) {
      caudalVariable = data[0].value;
      eev_table();
    }
  });
});

function eev_table() {
  var html = "";
  if (EN_EVD1 === 0 && EN_EVD2 === 0 && EN_EVD3 === 0 && EN_EVD4 === 0 && EN_EVD5 === 0) {
    document.getElementById('not-eev').style.display = "block";
  } else {
    /************** EEV1 ********************************/
    if (EN_EVD1 > 0) {
      html +=
        "<div class='col-lg-4 col-sm-4 mb-3'>\
      <div class='card card-body h-100'>\
        <h4 class='card-title text-center'>DRIVER 1</h4>\
        <table>\
          <tr><th>Evaporating Temperature:</th><td><span class='intar-decimal'>Pb_T_evap1/10/0/1/5</span> &degC/<span class='intar-decimal'>Pb_P_evap1/10/0/1/5</span> bar</td></tr>\
          <tr><th>Suction Temperature:</th><td><span class='intar-decimal'>Pb_T_aspi1/10/0/1/5</span> &degC</td></tr>\
          <tr><th>Super-Heating (SH):</th><td><span class='intar-decimal'>SH_C1/10/0/1/5</span> &degK</td></tr>\
          <tr><th>Opening:</th><td><span class='intar-decimal'>AO_EEV_cir1/1/0/0/5</span> %</td></tr>\
          <tr><th>SH Set Point:</th><td><span class='intar-decimal'>PAR_EEV_SH/10/0/1/5</span> &degK</td></tr>\
          <tr><th>Current SH Set Point:</th><td><span class='intar-decimal'>SET_SH_FINAL/10/0/1/5</span> &degK</td></tr>\
        </table>\
      </div>\
    </div>"
    }
    /************** EEV2 ********************************/
    if (EN_EVD2 > 0) {
      html +=
        "<div class='col-lg-4 col-sm-4 mb-3'>\
      <div class='card card-body h-100'>\
        <h4 class='card-title text-center'>DRIVER 2</h4>\
        <table>\
          <tr><th>Evaporating Temperature:</th><td><span class='intar-decimal'>Pb_T_evap2/10/0/1/5</span> &degC/<span class='intar-decimal'>Pb_P_evap2/10/0/1/5</span> bar</td></tr>\
          <tr><th>Suction Temperature:</th><td><span class='intar-decimal'>Pb_T_aspi2/10/0/1/5</span> &degC</td></tr>\
          <tr><th>Super-Heating (SH):</th><td><span class='intar-decimal'>SH_C2/10/0/1/5</span> &degK</td></tr>\
          <tr><th>Opening:</th><td><span class='intar-decimal'>AO_EEV_cir2/1/0/0/5</span> %</td></tr>\
          <tr><th>SH Set Point:</th><td><span class='intar-decimal'>PAR_EEV_SH/10/0/1/5</span> &degK</td></tr>\
          <tr><th>Current SH Set Point:</th><td><span class='intar-decimal'>SET_SH_FINAL2/10/0/1/5</span> &degK</td></tr>\
        </table>\
      </div>\
    </div>"
    }
    /************** EEV3 ********************************/
    if (EN_EVD3 > 0) {
      html +=
        "<div class='col-lg-4 col-sm-4 mb-3'>\
      <div class='card card-body h-100'>\
        <h4 class='card-title text-center'>DRIVER 3</h4>\
        <table>\
          <tr><th>Evaporating Temperature:</th><td><span class='intar-decimal'>Pb_T_evap3/10/0/1/5</span> &degC/<span class='intar-decimal'>Pb_P_evap3/10/0/1/5</span> bar</td></tr>\
          <tr><th>Suction Temperature:</th><td><span class='intar-decimal'>Pb_T_aspi3/10/0/1/5</span> &degC</td></tr>\
          <tr><th>Super-Heating (SH):</th><td><span class='intar-decimal'>SH_C3/10/0/1/5</span> &degK</td></tr>\
          <tr><th>Opening:</th><td><span class='intar-decimal'>AO_EEV_cir3/1/0/0/5</span> %</td></tr>\
          <tr><th>SH Set Point:</th><td><span class='intar-decimal'>PAR_EEV_SH/10/0/1/5</span> &degK</td></tr>\
          <tr><th>Current SH Set Point:</th><td><span class='intar-decimal'>SET_SH_FINAL3/10/0/1/5</span> &degK</td></tr>\
        </table>\
      </div>\
    </div>"
    }
    /************** EEV4 ********************************/
    if (EN_EVD4 > 0) {
      html +=
        "<div class='col-lg-4 col-sm-4 mb-3'>\
      <div class='card card-body h-100'>\
        <h4 class='card-title text-center'>DRIVER 4</h4>\
        <table>\
          <tr><th>Evaporating Temperature:</th><td><span class='intar-decimal'>Pb_T_evap4/10/0/1/5</span> &degC/<span class='intar-decimal'>Pb_P_evap4/10/0/1/5</span> bar</td></tr>\
          <tr><th>Suction Temperature:</th><td><span class='intar-decimal'>Pb_T_aspi4/10/0/1/5</span> &degC</td></tr>\
          <tr><th>Super-Heating (SH):</th><td><span class='intar-decimal'>SH_C4/10/0/1/5</span> &degK</td></tr>\
          <tr><th>Opening:</td><td><span class='intar-decimal'>AO_EEV_cir4/1/0/0/5</span> %</td></tr>\
          <tr><th>SH Set Point:</th><td><span class='intar-decimal'>PAR_EEV_SH/10/0/1/5</span> &degK</td></tr>\
          <tr><th>Current SH Set Point:</th><td><span class='intar-decimal'>SET_SH_FINAL4/10/0/1/5</span> &degK</td></tr>\
        </table>\
      </div>\
    </div>"
    }
    /************** EEV5 ********************************/
    if (EN_EVD5 > 0) {
      html +=
        "<div class='col-lg-4 col-sm-4 mb-3'>\
      <div class='card card-body h-100'>\
        <h4 class='card-title text-center'>DRIVER 5</h4>\
        <table>\
          <tr><th>Evaporating Temperature:</th><td><span class='intar-decimal'>Pb_T_evap5/10/0/1/5</span> &degC/<span class='intar-decimal'>Pb_P_evap5/10/0/1/5</span> bar</td></tr>\
          <tr><th>Suction Temperature:</th><td><span class='intar-decimal'>Pb_T_aspi5/10/0/1/5</span> &degC</td></tr>\
          <tr><th>Super-Heating (SH):</th><td><span class='intar-decimal'>SH_C5/10/0/1/5</span> &degK</td></tr>\
          <tr><th>Opening:</th><td><span class='intar-decimal'>AO_EEV_cir5/1/0/0/5</span> %</td></tr>\
          <tr><th>SH Set Point:</th><td><span class='intar-decimal'>PAR_EEV_SH/10/0/1/5</span> &degK</td></tr>\
          <tr><th>Current SH Set Point:</th><td><span class='intar-decimal'>SET_SH_FINAL5/10/0/1/5</span> &degK</td></tr>\
        </table>\
      </div>\
    </div>"
    }
    document.getElementById('Grid-Container').insertAdjacentHTML('afterBegin', html);
  }

  load();
};

//Carga de los scripts
function load() {
  //Carga de las funciones intar
  $.ajax({ url: 'js/intarcon.js', dataType: 'script', crossDomain: true, success: function () { } });
  $.ajax({ url: 'js/input-output-config.js', dataType: 'script', crossDomain: true, success: function () { } });
  document.getElementById('main-load').style.display = "none";
}