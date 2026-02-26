var caudalVariable, numeroCircuitos, EN_bomba1_P, EN_bomba2_P, EN_bomba1_S, EN_bomba2_S, EN_inver1_S, EN_inver2_S, EN_freecooling, EN_bomba1_R, EN_bomba2_R;

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
    success: function (data) { valor = data[0].value; }
  });
  return valor;
}

$(document).ready(function () {
  numeroCircuitos = peticionAjax("NumeroCircuitos");
  EN_bomba1_P = peticionAjax("ENABLE_BOMBA1P");
  EN_bomba2_P = peticionAjax("ENABLE_BOMBA2P");
  EN_bomba1_S = peticionAjax("ENABLE_BOMBA1S");
  EN_bomba2_S = peticionAjax("ENABLE_BOMBA2S");
  EN_inver1_S = peticionAjax("ENABLE_INV_PUM1S");
  EN_inver2_S = peticionAjax("ENABLE_INV_PUM2S");
  EN_freecooling = peticionAjax("ENABLE_FREECOOLING");
  EN_bomba1_R = peticionAjax("ENABLE_BOMBA1R");
  EN_bomba2_R = peticionAjax("ENABLE_BOMBA2R");
  work_mode = peticionAjax("PAR_WORKING_MODE");

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
      main_table();
    }
  });
});

function main_table() {
  var html = "";
  /************** MAIN ********************************/
  html +=
    `<div class='col-lg-4 col-sm-4 mb-3'>
      <div class='card card-body h-100'>
        <h4 class='card-title text-center'>MAIN</h4>
        <table>
          <tr><th>Working mode:</th><td><span class='intar-display'>PAR_WORKING_MODE|assets/img/img-cooling-mode.png|assets/img/img-heating-mode.png|50|50|5</span></td></tr>`
      if(work_mode == 0){
        html +=
          `<tr><th>Inlet Temperature:</th><td><span class='intar-decimal'>Pb_T_retorno/10/0/1/5</span> &degC</td></tr>
          <tr><th>Outlet Temperature:</th><td><span class='intar-decimal'>Pb_T_impulsion/10/0/1/5</span> &degC</td></tr>`
      }
      if(work_mode == 1){
        html +=
          `<tr><th>Inlet Temperature:</th><td><span class='intar-decimal'>Pb_T_hotwater_inlet/10/0/1/5</span> &degC</td></tr>
          <tr><th>Outlet Temperature:</th><td><span class='intar-decimal'>Pb_T_hotwater_outlet/10/0/1/5</span> &degC</td></tr>`
      }
      html +=  
          `<tr><th>Current Set Point:</th><td><span class='intar-decimal'>SET_GLICOL_FINAL/10/0/1/5</span> &degC</td></tr>
          <tr><th>Current BandWidth:</th><td><span class='intar-decimal'>CAUDAL_VAR_BAND_FINAL/10/0/1/5</span> &degC</td></tr>
        </table>
      </div>
    </div>`
  /************** PRIMARY ********************************/
  if (EN_bomba1_P == 1 || EN_bomba2_P == 1) {
    html +=
      `<div class='col-lg-4 col-sm-4 mb-3'>
        <div class='card card-body h-100'>
          <h4 class='card-title text-center'>PRIMARY</h4>
          <table>`
    if (EN_bomba1_P == 1) {
      html +=
        `<tr><th>Pump1:</th><td><span class='intar-display'>RELE_BOMBA1|assets/img/img-bomba-off.png|assets/img/img-bomba-on.png|50|50|5</span></td></tr>`
    }
    if (EN_bomba2_P == 1) {
      html +=
        `<tr><th>Pump2:</th><td><span class='intar-display'>RELE_BOMBA2|assets/img/img-bomba-off.png|assets/img/img-bomba-on.png|50|50|5</span></td></tr>`
    }
    if (caudalVariable == 1) {
      html +=
        `<tr><th>Delivery Transd.:</th><td><span class='intar-decimal'>Pb_P_impu_pump/10/0/1/5</span> bar </td></tr>
        <tr><th>Suction Transd.:</th><td><span class='intar-decimal'>Pb_P_aspi_pump/10/0/1/5</span> bar </td></tr>
        <tr><th>Differential Pressure:</th><td><span class='intar-decimal'>PRESION_DIFERENCIAL/100/0/2/5</span> bar </td></tr>
        <tr><th>Dif.Pressure Set Point:</th><td><span class='intar-decimal'>CAUDAL_VAR_SET_PRESION/100/0/2/5</span> bar </td></tr>`
    }
    html +=
        `<tr><td><span class='intar-display'>DI_FLOW_SWITCH|assets/img/img-fls-off.png|assets/img/img-fls-on.png|50|40|5</span></td></tr>
      </table>
      </div>
    </div>`
  }
  /************** SECONDARY ********************************/
  if (EN_bomba1_S == 1 || EN_bomba2_S == 1) {
    html +=
      `<div class='col-lg-4 col-sm-4 mb-3'>
        <div class='card card-body h-100'>
          <h4 class='card-title text-center'>SECONDARY</h4>
          <table>`
    if (EN_bomba1_S == 1) {
      html +=
        `<tr><th>Pump1:</td><td><span class='intar-display'>RELE_BOMBA1_S|assets/img/img-bomba-off.png|assets/img/img-bomba-on.png|50|50|5</span>`
    }
    if (EN_inver1_S == 1) {
      html +=
        `<span class='intar-decimal'>AO_bomba1S_inv/1/0/0/5</span>%`
    }
    html +=
      `</td></tr>`
    if (EN_bomba2_S == 1) {
      html +=
        `<tr><th>Pump2:</th><td><span class='intar-display'>RELE_BOMBA2_S|assets/img/img-bomba-off.png|assets/img/img-bomba-on.png|50|50|5</span>`
    }
    if (EN_inver2_S == 1) {
      html +=
        `<span class='intar-decimal'>AO_bomba2S_inv/1/0/0/5</span>%`
    }
    html +=
      `</td></tr>`
    if (EN_inver1_S == 1 || EN_inver2_S == 1) {
      html +=
        `<tr><th>Delivery Transd.:</th><td><span class='intar-decimal'>Pb_P_impu_pump2/10/0/1/5</span> bar </td></tr>
        <tr><th>Suction Transd.:</th><td><span class='intar-decimal'>Pb_P_aspi_pump2/10/0/1/5</span> bar </td></tr>
        <tr><th>Differential Pressure:</th><td><span class='intar-decimal'>PRESION_DIFERENCIAL_SEC/100/0/2/5</span> bar </td></tr>
        <tr><th>Dif.Pressure Set Point:</th><td><span class='intar-decimal'>CAUDAL_VAR_SET_PRESION/100/0/2/5</span> bar </td></tr>`
    }
    html +=
      `</table>
      </div>
    </div>`
  }
    /************** HEAT PUMPS ********************************/
    if (EN_bomba1_R == 1 || EN_bomba2_R == 1) {
      html +=
        `<div class='col-lg-4 col-sm-4 mb-3'>
          <div class='card card-body h-100'>
            <h4 class='card-title text-center'>HEAT</h4>
            <table>`
      if (EN_bomba1_R == 1) {
        html +=
          `<tr><th>Pump1:</th><td><span class='intar-display'>RELE_BOMBA1_CALOR|assets/img/img-bomba-off.png|assets/img/img-bomba-on.png|50|50|5</span></td></tr>`
      }
      if (EN_bomba2_R == 1) {
        html +=
          `<tr><th>Pump2:</th><td><span class='intar-display'>RELE_BOMBA2_CALOR|assets/img/img-bomba-off.png|assets/img/img-bomba-on.png|50|50|5</span></td></tr>`
      }
      html +=
          `<tr><td><span class='intar-display'>DI_FLOW_SWITCH_HEAT|assets/img/img-fls-off.png|assets/img/img-fls-on.png|50|40|5</span></td></tr>
        </table>
        </div>
      </div>`
    }
  /************** CIRCUIT 1 ********************************/
  if (numeroCircuitos >= 1) {
    html +=
      `<div class='col-lg-4 col-sm-4 mb-3'>
        <div class='card card-body h-100'>
          <h4 class='card-title text-center'>CIRCUIT 1</h4>
          <table>
            <tr><th>Evap. Transd.:</th><td><span class='intar-decimal'>Pb_T_evap1/10/0/1/5</span> &degC /<span class='intar-decimal'>Pb_P_evap1/10/0/1/5</span> bar </td></tr>
            <tr><td><img src='assets/img/img-cpr_stream.jpg' align='middle' width='60' height='45'/></td><td><span class='intar-decimal'>NUM_CPR_ACTIVOS_C1/1/0/0/5</span>/<span class='intar-decimal'>NUMEROCOMPRESORES/1/0/0/50</span></td></tr>
            <tr><th>Cond. Transd.:</td><td><span class='intar-decimal'>Pb_T_conde1/10/0/1/5</span> &degC /<span class='intar-decimal'>Pb_P_conde1/10/0/1/5</span> bar </td></tr>
            <tr><td><img src='assets/img/img-Ventilador.png' align='middle' width='40' height='40'/></td><td><span class='intar-decimal'>NUM_FAN_ACTIVOS_C1/1/0/0/5</span>/<span class='intar-decimal'>NUM_VENT_CIR1/1/0/0/50</span></td></tr>
          </table>
        </div>
      </div>`
  }
  /************** CIRCUIT 2 ********************************/
  if (numeroCircuitos >= 2) {
    html +=
      `<div class='col-lg-4 col-sm-4 mb-3'>
        <div class='card card-body h-100'>
          <h4 class='card-title text-center'>CIRCUIT 2</h4>
          <table>
            <tr><th>Evap. Transd.:</th><td><span class='intar-decimal'>Pb_T_evap2/10/0/1/5</span> &degC /<span class='intar-decimal'>Pb_P_evap2/10/0/1/5</span> bar </td></tr>
            <tr><td><img src='assets/img/img-cpr_stream.jpg' align='middle' width='60' height='45'/></td><td><span class='intar-decimal'>NUM_CPR_ACTIVOS_C2/1/0/0/5</span>/<span class='intar-decimal'>NUMEROCOMPRESORES/1/0/0/50</span></td></tr>
            <tr><th>Cond. Transd.:</th><td><span class='intar-decimal'>Pb_T_conde2/10/0/1/5</span> &degC /<span class='intar-decimal'>Pb_P_conde2/10/0/1/5</span> bar </td></tr>
            <tr><td><img src='assets/img/img-Ventilador.png' align='middle' width='40' height='40'/></td><td><span class='intar-decimal'>NUM_FAN_ACTIVOS_C2/1/0/0/5</span>/<span class='intar-decimal'>NUM_VENT_CIR1/1/0/0/50</span></td></tr>
          </table>
        </div>
      </div>`
  }
  /************** CIRCUIT 3 ********************************/
  if (numeroCircuitos >= 3) {
    html +=
      `<div class='col-lg-4 col-sm-4 mb-3'>
        <div class='card card-body h-100'>
          <h4 class='card-title text-center'>CIRCUIT 3</h4>
          <table>
            <tr><th>Evap. Transd.:</th><td><span class='intar-decimal'>Pb_T_evap3/10/0/1/5</span> &degC /<span class='intar-decimal'>Pb_P_evap3/10/0/1/5</span> bar </td></tr>
            <tr><td><img src='assets/img/img-cpr_stream.jpg' align='middle' width='60' height='45' /></td><td><span class='intar-decimal'>NUM_CPR_ACTIVOS_C3/1/0/0/5</span>/<span class='intar-decimal'>NUMEROCOMPRESORES/1/0/0/50</span></td></tr>
            <tr><th>Cond. Transd.:</th><td><span class='intar-decimal'>Pb_T_conde3/10/0/1/5</span> &degC /<span class='intar-decimal'>Pb_P_conde3/10/0/1/5</span> bar </td></tr>
            <tr><td><img src='assets/img/img-Ventilador.png' align='middle' width='40' height='40' /></td><td><span class='intar-decimal'>NUM_FAN_ACTIVOS_C3/1/0/0/5</span>/<span class='intar-decimal'>NUM_VENT_CIR1/1/0/0/50</span></td></tr>
          </table>
        </div>
      </div>`
  }
  /************** CIRCUIT 4 ********************************/
  if (numeroCircuitos >= 4) {
    html +=
      `<div class='col-lg-4 col-sm-4 mb-3'>
        <div class='card card-body h-100'>
          <h4 class='card-title text-center'>CIRCUIT 4</h4>
          <table>
            <tr><th>Evap. Transd.:</th><td><span class='intar-decimal'>Pb_T_evap4/10/0/1/5</span> &degC /<span class='intar-decimal'>Pb_P_evap4/10/0/1/5</span> bar </td></tr>
            <tr><td><img src='assets/img/img-cpr_stream.jpg' align='middle' width='60' height='45' /></td><td><span class='intar-decimal'>NUM_CPR_ACTIVOS_C4/1/0/0/5</span>/<span class='intar-decimal'>NUMEROCOMPRESORES/1/0/0/50</span></td></tr>
            <tr><th>Cond. Transd.:</th><td><span class='intar-decimal'>Pb_T_conde4/10/0/1/5</span> &degC /<span class='intar-decimal'>Pb_P_conde4/10/0/1/5</span> bar </td></tr>
            <tr><td><img src='assets/img/img-Ventilador.png' align='middle' width='40' height='40' /></td><td><span class='intar-decimal'>NUM_FAN_ACTIVOS_C4/1/0/0/5</span>/<span class='intar-decimal'>NUM_VENT_CIR1/1/0/0/50</span></td></tr>
          </table>
        </div>
      </div>`
  }
  /************** CIRCUIT 5 ********************************/
  if (numeroCircuitos >= 5) {
    html +=
      `<div class='col-lg-4 col-sm-4 mb-3'>
        <div class='card card-body h-100'>
          <h4 class='card-title text-center'>CIRCUIT 5</h4>
          <table>
            <tr><th>Evap. Transd.:</th><td><span class='intar-decimal'>Pb_T_evap5/10/0/1/5</span> &degC /<span class='intar-decimal'>Pb_P_evap5/10/0/1/5</span> bar </td></tr>
            <tr><td><img src='assets/img/img-cpr_stream.jpg' align='middle' width='60' height='45' /></td><td><span class='intar-decimal'>NUM_CPR_ACTIVOS_C5/1/0/0/5</span>/<span class='intar-decimal'>NUMEROCOMPRESORES/1/0/0/50</span></td></tr>
            <tr><th>Cond. Transd.:</th><td><span class='intar-decimal'>Pb_T_conde5/10/0/1/5</span> &degC /<span class='intar-decimal'>Pb_P_conde5/10/0/1/5</span> bar </td></tr>
            <tr><td><img src='assets/img/img-Ventilador.png' align='middle' width='40' height='40' /></td><td><span class='intar-decimal'>NUM_FAN_ACTIVOS_C5/1/0/0/5</span>/<span class='intar-decimal'>NUM_VENT_CIR1/1/0/0/50</span></td></tr>
          </table>
        </div>
      </div>`
  }
  /************** FEECOOLING ********************************/
  if (EN_freecooling == 1) {
    html +=
      `<div class='col-lg-4 col-sm-4 mb-3'>
        <div class='card card-body h-100'>
          <h4 class='card-title text-center'>FREE-COOLING</h4>
          <table>
            <tr><th>Inlet Temp.FreeCooling:</th><td><span class='intar-decimal'>Pb_T_entrada_freecooling/10/0/1/5</span> &degC </td></tr>
            <tr><th>Inlet Temp.Chiller:</th><td><span class='intar-decimal'>Pb_T_retorno/10/0/1/5</span> &degC </td></tr>
            <tr><th>Outdoor Temp.:</th><td><span class='intar-decimal'>Pb_T_exterior/10/0/1/5</span> &degC </td></tr>
            <tr><td><img src='assets/img/img-Ventilador.png' align='middle' width='40' height='40' /></td><td><span class='intar-decimal'>NUM_FAN_ACTIVOS_FREECOOLING/1/0/0/5</span>/<span class='intar-decimal'>PAR_NUM_FAN_FREECOOLING/1/0/0/50</span></td></tr>
          </table>
        </div>
      </div>`
  }

  document.getElementById('Grid-Container').insertAdjacentHTML('afterBegin', html);
  load();
};
// Carga de los scripts
function load() {
  if (window.forceTranslatePage) forceTranslatePage();
  $.ajax({
    url: 'js/intarcon.js',
    dataType: 'script',
    crossDomain: true,
    success: function () {
      setTimeout(() => {
        document.getElementById('main-load').style.display = "none";
        document.getElementById('Grid-Container').style.display = "";
        if (window.forceTranslatePage) forceTranslatePage();
      }, 2500)
    },
    error: function () {
      if (window.forceTranslatePage) forceTranslatePage();
    }
  });
};
