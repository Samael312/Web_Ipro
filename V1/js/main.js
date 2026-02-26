var caudalVariable, numeroCircuitos, EN_bomba1_P, EN_bomba2_P, EN_bomba1_S, EN_bomba2_S, EN_inver1_S, EN_inver2_S, EN_freecooling, EN_bomba1_R, EN_bomba2_R;

var domain = ""
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
    success: function (data) { valor = data[0].value; }
  });
  return valor;
}

$(document).ready(function () {
  //numeroCircuitos = peticionAjax("NumeroCircuitos");

  //Se obtiene si se ha configurado caudal variable
  $.ajax({
    crossOrigin: true,
    crossDomain: true,
    url: domain + "/cgi-bin/jgetvar.cgi?name=ONOFF_GEN",
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
  html +=
    `<div style="" class="row" id="Grid-Container"><div style="position: relative;">
      <img src="layout01.png" style="width: 100%;height: calc(100vh - 88px);">
      
      <div style="position:absolute; top:42%; left:87%; background:rgba(255, 255, 255, 0); padding:8px; border-radius:6px;">
        <span class='intar-decimal'>Pb_T_S1/10/0/1/5</span> &degC
      </div>
      <div style="position:absolute; top:49%; left:87%; background:rgba(255, 255, 255, 0); padding:8px; border-radius:6px;">
        <span class='intar-decimal'>Pb_T_S2/10/0/1/5</span> &degC
      </div>
      <div style="position:absolute; top:43%; left:38%; background:rgba(255, 255, 255, 0); padding:8px; border-radius:6px;">
        <span class='intar-decimal'>Pb_T_S3/10/0/1/5</span> &degC
      </div>
      <div style="position:absolute; top:74%; left:44%; background:rgba(255, 255, 255, 0); padding:8px; border-radius:6px;">
        <span class='intar-decimal'>Pb_T_S4/10/0/1/5</span> &degC
      </div>
      <div style="position:absolute; top:30%; left:24%; background:rgba(255, 255, 255, 0); padding:8px; border-radius:6px;">
        <span class='intar-decimal'>Pb_T_S5/10/0/1/5</span> &degC
      </div>
      <div style="position:absolute; top:24%; left:24%; background:rgba(255, 255, 255, 0); padding:8px; border-radius:6px;">
        <span class='intar-decimal'>Pb_T_S6/10/0/1/5</span> &degC
      </div>
      <div style="position:absolute; top:6%; left:21%; background:rgba(255, 255, 255, 0); padding:8px; border-radius:6px;">
        <span class='intar-decimal'>Pb_T_S7/10/0/1/5</span> &degC
      </div>
      <div style="position:absolute; top:73%; left:77%; background:rgba(255, 255, 255, 0); padding:8px; border-radius:6px;">
        <span class='intar-decimal'>Pb_T_S14/10/0/1/5</span> &degC
      </div>
      <div style="position:absolute; top:66%; left:77%; background:rgba(255, 255, 255, 0); padding:8px; border-radius:6px;">
        <span class='intar-decimal'>Pb_T_S15/10/0/1/5</span> &degC
      </div>
      <div style="position:absolute; top:51%; left:7%; background:rgba(255, 255, 255, 0); padding:8px; border-radius:6px;">
        <span class='intar-decimal'>Pb_T_S24/10/0/1/5</span> &degC
      </div>
      <div style="position:absolute; top:45%; left:7%; background:rgba(255, 255, 255, 0); padding:8px; border-radius:6px;">
        <span class='intar-decimal'>Pb_T_S25/10/0/1/5</span> &degC
      </div>
      <div style="position:absolute; top:33%; left:8%; background:rgba(255, 255, 255, 0); padding:8px; border-radius:6px;">
        <span class='intar-decimal'>Pb_T_S26/10/0/1/5</span> &degC
      </div>
      <div style="position:absolute; top:3%; left:3%; background:rgba(255, 255, 255, 0); padding:8px; border-radius:6px;">
        <span class='intar-decimal'>Pb_T_S27/10/0/1/5</span> &degC
      </div>
      
      <div style="position:absolute; top:55%; left:58%; background:rgba(255,255,255,0); padding:8px; border-radius:6px;">
        <span class='intar-display'>RL_BOMBAS_G1|assets/img/img-bomba-off.png|assets/img/img-bomba-on.png|35|35|5</span>
      </div>
      <div style="position:absolute; top:60%; left:49%; background:rgba(255,255,255,0); padding:8px; border-radius:6px;">
        <span class='intar-display'>RL_BOMBAS_G2|assets/img/img-bomba-off.png|assets/img/img-bomba-on.png|35|35|5</span>
      </div>
      <div style="position:absolute; top:64%; left:53%; background:rgba(255,255,255,0); padding:8px; border-radius:6px;">
        <span class='intar-display'>RL_BOMBAS_G3|assets/img/img-bomba-off.png|assets/img/img-bomba-on.png|35|35|5</span>
      </div>
      <div style="position:absolute; top:54%; left:34%; background:rgba(255,255,255,0); padding:8px; border-radius:6px;">
        <span class='intar-display'>RL_BOMBAS_G4|assets/img/img-bomba-off.png|assets/img/img-bomba-on.png|35|35|5</span>
      </div>
      <div style="position:absolute; top:45%; left:31%; background:rgba(255,255,255,0); padding:8px; border-radius:6px; transform: rotate(90deg);">
        <span class='intar-display'>RL_BOMBAS_G5|assets/img/img-bomba-off.png|assets/img/img-bomba-on.png|35|35|5</span>
      </div>
      <div style="position:absolute; top:13.5%; left:18.5%; background:rgba(255,255,255,0); padding:8px; border-radius:6px;">
        <span class='intar-display'>RL_BOMBA_G6|assets/img/img-bomba-off.png|assets/img/img-bomba-on.png|35|35|5</span>
      </div>
      <div style="position:absolute; top:41%; left:62%; background:rgba(255,255,255,0); padding:8px; border-radius:6px;">
        <span class='intar-display'>RL_ENABLE_INTAR_BIG|assets/img/stop.png|assets/img/play.png|35|35|5</span>
      </div>
      <div style="position:absolute; top:68%; left:22%; background:rgba(255,255,255,0); padding:8px; border-radius:6px;">
        <span class='intar-display'>RL_ENABLE_CIATESA|assets/img/stop.png|assets/img/play.png|35|35|5</span>
      </div>
      <div style="position:absolute; top:68%; left:11%; background:rgba(255,255,255,0); padding:8px; border-radius:6px;">
        <span class='intar-display'>RL_ENABLE_INTAR_SMALL|assets/img/stop.png|assets/img/play.png|35|35|5</span>
      </div>
      <div style="position:absolute; top:60%; left:21%; background:rgba(255,255,255,0); padding:8px; border-radius:6px;">
        <span class='intar-display'>RL_ENABLE_BDC_KEYTER|assets/img/stop.png|assets/img/play.png|35|35|5</span>
      </div>
      <div style="position:absolute; top:53%; left:39%; background:rgba(255,255,255,0); padding:8px; border-radius:6px;">
        <span class='intar-display'>RL_ELECT_HEATER_REC|assets/img/resistencia_OFF.png|assets/img/resistencia_ON.png|35|35|5</span>
      </div>
      <div style="position:absolute; top:41%; left:72%; background:rgba(255,255,255,0); padding:8px; border-radius:6px;">
        <span class='intar-display'>RL_ENABLE_INTAR_BIG|assets/img/piston-OFF.png|assets/img/piston-ON.gif|35|35|5</span>
      </div>
    </div>`;

  document.getElementById('Grid-Container').insertAdjacentHTML('afterBegin', html);
  load();
};
// Carga de los scripts
function load() {
  $.ajax({
    url: 'js/intarcon.js',
    dataType: 'script',
    crossDomain: true,
    success: function () {
      setTimeout(() => {
        document.getElementById('main-load').style.display = "none";
        document.getElementById('Grid-Container').style.display = "";
      }, 2500)
    }
  });
};
