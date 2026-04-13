/*
  status.js  —  KICONTROL ICOENERGIA
*/

window.CPR_status       = ["OFF", "100%", "Anti-short cycle", "Alarm", "33%", "50%", "66%", "Blocked", "Equalizing"];
window.FUNC_RECU_status = ["Precalentar depósito + Resist.", "Precalentar depósito + Recup.", "Funcionamiento normal", "Alta temperatura"];
window.MODE_3_status    = ["Manual OFF", "Manual ON", "AUTO"];

var domain          = "";
//var domain        = "http://172.17.123.250"

var caudal_variable     = 0;
var caudal_variable_sec = 0;
var activeSections      = [];
var _spanCounter        = 0;

// ─────────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────────
$(document).ready(function () {
  var ajaxConfig = {
    crossOrigin: true, crossDomain: true,
    data: { get_param: 'value' }, cache: false, dataType: 'json', timeout: 5000
  };
  var req1 = $.ajax(Object.assign({ url: domain + "/cgi-bin/jgetvar.cgi?name=CAUDAL_VAR_EN"    }, ajaxConfig));
  var req2 = $.ajax(Object.assign({ url: domain + "/cgi-bin/jgetvar.cgi?name=ENABLE_INV_PUM1S" }, ajaxConfig));
  var req3 = $.ajax(Object.assign({ url: domain + "/cgi-bin/jgetvar.cgi?name=NumeroCircuitos"  }, ajaxConfig));

  $.when(req1, req2, req3)
    .done(function (r1, r2, r3) {
      caudal_variable     = r1[0][0].value;
      caudal_variable_sec = r2[0][0].value;
      buildAll(r3[0][0].value);
    })
    .fail(function () { buildAll(1); });
});

// ─────────────────────────────────────────────────────────────────
// BUILD ALL
// ─────────────────────────────────────────────────────────────────
function buildAll(numCircuitos) {
  printSectionButtons();
  build_main_table();
  document.getElementById('main-load').style.display = 'none';
  document.getElementById('Grid-Container').style.display = '';
  processIntarcon(document);
}

// ─────────────────────────────────────────────────────────────────
// INTARCON SCOPED
// ─────────────────────────────────────────────────────────────────
function processIntarcon(root) {
  _runDecimal(root);
  _runBool(root);
  _runSelect(root);
  _runIcon(root);
}

function _runDecimal(root) {
  $(root).find('.intar-decimal:not([data-processed])').each(function (i) {
    var p = this.innerHTML.trim().split("/");
    var name = p[0].trim(), divisor = parseInt(p[1])||1, offset = parseInt(p[2])||0;
    var decimals = parseInt(p[3])||0, refreshTime = parseInt(p[4])||10, unit = p[5]||'';
    this.id = 'idec-' + (++_spanCounter);
    this.setAttribute('data-processed','1');
    ajaxDecimal(name, divisor, offset, decimals, refreshTime, this.id, unit);
  });
}

function _runBool(root) {
  // intar-bool usa "|" como separador para evitar conflicto con "/" dentro de </span>
  // Formato: VARNAME|<span...>OFF</span>|<span...>ON</span>|tiempo
  $(root).find('.intar-bool:not([data-processed])').each(function (i) {
    var spans = this.getElementsByTagName('span');
    var p = this.innerHTML.split("|");
    var name        = p[0].trim();
    var falseState  = p[1];
    var trueState   = p[2];
    var refreshTime = parseInt(p[3]) || 10;
    var falseStyle  = spans[0] ? spans[0].style.color : '';
    var trueStyle   = spans[1] ? spans[1].style.color : '';
    this.id = 'ibool-' + (++_spanCounter);
    this.setAttribute('data-processed','1');
    ajaxBool(name, falseState, trueState, falseStyle, trueStyle, refreshTime, this.id);
  });
}

function _runSelect(root) {
  $(root).find('.intar-select:not([data-processed])').each(function (i) {
    var p = this.innerHTML.trim().split("/");
    var name = p[0].trim(), arrName = p[1].trim(), refreshTime = parseInt(p[2]) || 10;
    this.id = 'isel-' + (++_spanCounter);
    this.setAttribute('data-processed','1');
    if (typeof window[arrName] === 'undefined') {
      this.innerHTML = 'Array not found: ' + arrName;
      return;
    }
    ajaxSelect(name, arrName, this.id, refreshTime);
  });
}

function _runIcon(root) {
  $(root).find('.intar-icon:not([data-processed])').each(function (i) {
    var p = this.textContent.split("/");
    this.id = 'iicon-' + (++_spanCounter);
    this.setAttribute('data-processed','1');
    ajaxDisplayICON(p[0], p[1], p[2], parseInt(p[3])||10, this.id);
  });
}

// ─────────────────────────────────────────────────────────────────
// SECTION BUTTONS
// ─────────────────────────────────────────────────────────────────
var SECTION_DEFS = [
  { id: 'Heat-circuit',     label: 'CIRCUITO CALOR',   buildFn: build_heat_html     },
  { id: 'Cold-circuit',     label: 'CIRCUITO FRÍO',    buildFn: build_cold_html     },
  { id: 'Recovery-circuit', label: 'RECUPERACIÓN',     buildFn: build_recovery_html },
  { id: 'Calculos-section', label: 'CÁLCULOS',         buildFn: build_calc_html     },
  { id: 'Operation-modes',  label: 'MODOS OPERACIÓN',  buildFn: build_modes_html    },
  { id: 'Counters-section', label: 'CONTADORES',       buildFn: build_counters_html }
];

function printSectionButtons() {
  var html = '';
  SECTION_DEFS.forEach(function (s) {
    html += '<button class="btn circuit-button mb-3" id="sbtn-' + s.id + '" onclick="toggleSection(this,\'' + s.id + '\')">' + s.label + '</button> ';
  });
  document.getElementById('N-sections').innerHTML = html;
}

function toggleSection(btn, sectionId) {
  var container = document.getElementById('sections-container');
  var existing  = document.getElementById(sectionId);
  if (existing) {
    existing.remove();
    activeSections = activeSections.filter(function (id) { return id !== sectionId; });
    btn.style.backgroundColor = '';
  } else {
    var def = SECTION_DEFS.find(function (s) { return s.id === sectionId; });
    if (!def) return;
    var wrapper = document.createElement('div');
    wrapper.id  = sectionId;
    wrapper.innerHTML = def.buildFn();
    container.appendChild(wrapper);
    activeSections.push(sectionId);
    btn.style.backgroundColor = '#1a82ba';
    processIntarcon(wrapper);
  }
}

// ─────────────────────────────────────────────────────────────────
// HTML HELPERS
// bool usa "|" como separador — evita conflicto con "/" de </span>
// dec y sel siguen usando "/" porque su contenido no tiene tags HTML
// ─────────────────────────────────────────────────────────────────
function dec(v, d, decimals) {
  return "<span class='intar-decimal'>" + v + "/" + d + "/0/" + decimals + "/10</span>";
}
function bool(v, off, on) {
  return "<span class='intar-bool'>" + v + "|" + off + "|" + on + "|10</span>";
}
function sel(v, arr) {
  return "<span class='intar-select'>" + v + "/" + arr + "/10</span>";
}
function section(title, bg, body) {
  return "<div class='row'><h3 class='text-center' style='background-color:" + bg + ";'>" + title + "</h3>" +
    "<div class='col-12 table-responsive'>" + body + "</div></div>";
}
function twoCol(c1, c2) {
  return "<table class='table table-borderless text-center' style='border:none;'><tr>" +
    "<td style='width:50%;'><table class='table table-borderless'>" + c1 + "</table></td>" +
    "<td style='width:50%;'><table class='table table-borderless'>" + c2 + "</table></td>" +
    "</tr></table>";
}
function threeCol(c1, c2, c3) {
  return "<table class='table table-borderless text-center' style='border:none;'><tr>" +
    "<td style='width:33%;'><table class='table table-borderless'>" + c1 + "</table></td>" +
    "<td style='width:33%;'><table class='table table-borderless'>" + c2 + "</table></td>" +
    "<td style='width:33%;'><table class='table table-borderless'>" + c3 + "</table></td>" +
    "</tr></table>";
}
function th(label)      { return "<thead><tr><th colspan='2' class='text-center'>" + label + "</th></tr></thead>"; }
function tr(label, val) { return "<tr><th>" + label + "</th><td>" + val + "</td></tr>"; }

// ─────────────────────────────────────────────────────────────────
// MAIN TABLE
// ─────────────────────────────────────────────────────────────────
function build_main_table() {
  document.getElementById('Main-table').innerHTML =
    "<div class='row'><h3 class='text-center' style='background-color:#d9daff;'>STATUS (MAIN)</h3>" +
    "<div class='col-12 table-responsive'><table class='table table-borderless text-center' style='border:none;'><tr>" +

    "<td style='width:33%;'><table class='table table-borderless'>" + th("Temperaturas Principales") +
      tr("T. Colector frío retorno (T1)",    dec('Pb_T_S1',  10,1) + " ºC") +
      tr("T. Colector frío impulsión (T2)",  dec('Pb_T_S2',  10,1) + " ºC") +
      tr("T. Colector calor impulsión (T5)", dec('Pb_T_S5',  10,1) + " ºC") +
      tr("T. Colector calor retorno (T6)",   dec('Pb_T_S6',  10,1) + " ºC") +
      tr("T. Depósito recuperación (T3)",    dec('Pb_T_S3',  10,1) + " ºC") +
      tr("T. Depósito ACS (T7)",             dec('Pb_T_S7',  10,1) + " ºC") +
      tr("T. Exterior (T13)",                dec('PB_T_S27', 10,1) + " ºC") +
    "</table></td>" +

    "<td style='width:33%;'><table class='table table-borderless'>" + th("Estado General") +
      tr("On / Off",       bool("ONOFF_GEN",       "<span style='color:blue'>OFF</span>","<span style='color:red'>ON</span>")) +
      tr("Alarma",         bool("RELE_ALARMA",      "<span style='color:blue'>Sin alarma</span>","<span style='color:red'>ALARMA</span>")) +
      tr("Aviso",          bool("WARNING",          "<span style='color:blue'>Sin aviso</span>","<span style='color:orange'>AVISO</span>")) +
      tr("Consigna frío",  dec('PAR_CONSIGNA_FRIO', 10,1) + " ºC") +
      tr("Consigna calor", dec('PAR_CONSIGNA_CALOR',10,1) + " ºC") +
      tr("Caudal frío",    dec('PB_Q_S28',          10,1) + " l/s") +
    "</table></td>" +

    "<td style='width:33%;'><table class='table table-borderless'>" + th("Grupos de bombeo") +
      tr("Grupo de bombeo G1",  bool("RL_BOMBAS_G1",      "<span style='color:blue'>OFF</span>","<span style='color:red'>ON</span>")) +
      tr("Grupo de bombeo G2",  bool("RL_BOMBAS_G2",      "<span style='color:blue'>OFF</span>","<span style='color:red'>ON</span>")) +
      tr("Grupo de bombeo G3",  bool("RL_BOMBAS_G3",      "<span style='color:blue'>OFF</span>","<span style='color:red'>ON</span>")) +
      tr("Grupo de bombeo G4", bool("RL_BOMBAS_G4",      "<span style='color:blue'>OFF</span>","<span style='color:red'>ON</span>")) +
      tr("Grupo de bombeo G5", bool("RL_BOMBAS_G5",       "<span style='color:blue'>OFF</span>","<span style='color:red'>ON</span>")) +
      tr("Bomba ACS G6",   bool("RL_BOMBA_G6",       "<span style='color:blue'>OFF</span>","<span style='color:red'>ON</span>")) +
    "</table></td>" +

    "</tr></table></div></div>";
}

// ─────────────────────────────────────────────────────────────────
// SECTION BUILDERS
// ─────────────────────────────────────────────────────────────────
function build_heat_html() {
  var c1 = th("Demanda") +
    tr("Etapas demandadas calor",  dec('ST_DEMANDA_CALOR',1,0)+" / "+dec('ST_ETAPAS_CALOR',1,0)) +
    tr("Salida PID Demanda Calor", dec('ST_DEMANDA_CALOR_OUTPUT',1,0) + " %") +
    tr("Disponibilidad bomba de calor", dec('ST_DISPONIBLE_BDC',1,0) + " %");
  var c2 = th("Activación Equipos") +
    tr("Orden activación Bomba de Calor", bool('RL_ENABLE_BDC_KEYTER',"<span style='color:blue'>OFF</span>","<span style='color:red'>ON</span>")) +
    tr("Orden activación caldera 1", bool('RL_ENABLE_BOILER1',"<span style='color:blue'>OFF</span>","<span style='color:red'>ON</span>")) +
    tr("Orden activación caldera 2", bool('RL_BURNER_STAGE1',"<span style='color:blue'>OFF</span>","<span style='color:red'>ON</span>")) +
    tr("Orden activación caldera 3", bool('RL_BURNER_STAGE2',"<span style='color:blue'>OFF</span>","<span style='color:red'>ON</span>")) +
    tr("Válvula circuito caldera", bool('RL_VALVE_BOILER',"<span style='color:blue'>OFF</span>","<span style='color:red'>ON</span>"));
  var c3 = th("Mantenimiento") +
    tr("Mantenimiento Caldera", bool('ST_MANTENIMIENTO_CALDERA',"<span style='color:blue'>Apagado</span>","<span style='color:red'>Encendido</span>"));
  return section("CIRCUITO CALOR", "#ffe0cc", threeCol(c1, c2, c3));
}

function build_cold_html() {
  var c1 = th("Demanda") +
    tr("Etapas activas producción frío", dec('ST_DEMANDA_FRIO',1,0)) +
    tr("Salida PID Demanda Frío",        dec('ST_DEMANDA_FRIO_OUTPUT',1,0) + " %") +
    tr("Etapa actual demanda frío",      dec('ST_ETAPAS_FRIO',1,0)) +
    tr("Etapas activas demanda frío",    dec('ST_ETAPAS_ACTUALES_FRIO',1,0));
  var c2 = th("Bomba de Calor") +
    tr("Disponibilidad BDC",   bool('ST_DISPONIBLE_BDC',"<span style='color:blue'>OFF</span>","<span style='color:red'>ON</span>")) +
    tr("Orden activación BDC", bool('ST_ACTIVAR_BDC',   "<span style='color:blue'>OFF</span>","<span style='color:red'>ON</span>"));
  return section("CIRCUITO FRÍO", "#cce5ff", twoCol(c1, c2));
}

function build_recovery_html() {
  var c1 = th("Modos de Funcionamiento") +
    tr("Modo funcionamiento recuperación",  sel('ST_ESTADO_DEPOSITO_REC','FUNC_RECU_status')) +
    tr("Modo op. Válvula Recuperación",     sel('KB_V3V_RECOVERY',       'MODE_3_status')) +
    tr("Modo op. resistencias dep. recup.", sel('KB_HEATER_REC',         'MODE_3_status'));
  var c2 = th("ACS") +
    tr("Orden demanda ACS",        bool('ST_DEMANDA_ACS',"<span style='color:blue'>OFF</span>","<span style='color:red'>ON</span>")) +
    tr("Modo operación bomba ACS", sel('KB_RL_AUX2','MODE_3_status'));
  return section("CIRCUITO RECUPERACIÓN", "#d4edda", twoCol(c1, c2));
}

function build_calc_html() {
  var c1 = th("Medias de Temperatura") +
    tr("Media T° impulsión calor", dec('ST_MEDIA_IMPULSION_CALOR',10,1) + " ºC") +
    tr("Media T° retorno calor",   dec('ST_MEDIA_RETORNO_CALOR',  10,1) + " ºC") +
    tr("Media T° impulsión frío",  dec('ST_MEDIA_IMPULSION_FRIO', 10,1) + " ºC") +
    tr("Media T° retorno frío",    dec('ST_MEDIA_RETORNO_FRIO',   10,1) + " ºC");
  var c2 = th("Desviaciones Diarias") +
    tr("Desviación impulsión calor", dec('ST_DESV_IMPULSION_CALOR',10,1) + " ºC") +
    tr("Desviación retorno calor",   dec('ST_DESV_RETORNO_CALOR',  10,1) + " ºC") +
    tr("Desviación impulsión frío",  dec('ST_DESV_IMPULSION_FRIO', 10,1) + " ºC") +
    tr("Desviación retorno frío",    dec('ST_DESV_RETORNO_FRIO',   10,1) + " ºC");
  return section("CÁLCULOS — MEDIAS Y DESVIACIONES", "#fce4ec", twoCol(c1, c2));
}

function build_modes_html() {
  var c1 = th("Estado General") +
    tr("Estado del control",    bool('ONOFF_GEN',"<span style='color:blue'>Desactivado</span>","<span style='color:red'>Activado</span>")) +
    tr("Alarma activa",         bool('RELE_ALARMA',"<span style='color:blue'>Sin alarma</span>","<span style='color:red'>Alarma activada</span>")) +
    tr("Aviso activo",          bool('WARNING',"<span style='color:blue'>Sin aviso</span>","<span style='color:orange'>Aviso activado</span>")) +
    tr("Días de inactividad",   dec('ST_DIAS_INACTIVIDAD',86400000,1)   + " días") +
    tr("Minutos mantenimiento", dec('ST_MINUTOS_MANTENIMIENTO',60000,0) + " min");
  var c2 = th("Intarcon / Ciatesa") +
    tr("Orden activación Intarcon Grande",  bool('ST_ACTIVAR_INTAR_BIG',  "<span style='color:blue'>OFF</span>","<span style='color:red'>ON</span>")) +
    tr("Orden activación Intarcon Pequeña", bool('ST_ACTIVAR_INTAR_SMALL',"<span style='color:blue'>OFF</span>","<span style='color:red'>ON</span>")) +
    tr("Modo op. Intarcon Grande",          sel('ST_DISPONIBLE_INTAR_BIG',  'MODE_3_status')) +
    tr("Modo op. Intarcon Pequeña",         sel('ST_DISPONIBLE_INTAR_SMALL','MODE_3_status')) +
    tr("Mantenimiento Intarcon Pequeña",    bool('ST_MANTENIMIENTO_INTAR_SMALL',"<span style='color:blue'>Apagado</span>","<span style='color:red'>Encendido</span>")) +
    tr("Orden activación Ciatesa",          bool('ST_ACTIVAR_CIATESA',"<span style='color:blue'>OFF</span>","<span style='color:red'>ON</span>"));
  return section("MODOS DE OPERACIÓN / ESTADOS DE COMANDOS", "#e2d9f3", threeCol(c1, c2, c3));
}

function build_counters_html() {
  var counters = [
    {id:1,label:"C1 — Glicol Frío"},{id:2,label:"C2"},{id:3,label:"C3"},
    {id:4,label:"C4"},{id:5,label:"C5 — Gasóleo"},{id:6,label:"C6"}
  ];
  var rows = counters.map(function(c) {
    return "<tr><td><strong>" + c.label + "</strong></td>" +
      "<td>" + dec('ST_CONTAJE_PULSOS_'+c.id,1,0) + "</td>" +
      "<td>" + dec('ST_CAUDAL_PULSOS_'+c.id,1,0)  + "</td>" +
      "<td>" + dec('ST_M3_C'+c.id,1,0)             + "</td>" +
      "<td>" + dec('ST_HM3_C'+c.id,1,0)            + "</td></tr>";
  }).join('');
  return section("CONTADORES","#fff3cd",
    "<table class='table table-bordered text-center'>" +
    "<thead class='table-light'><tr><th>Contador</th><th>Pulsos</th><th>Litros (L)</th><th>M³</th><th>Hm³</th></tr></thead>" +
    "<tbody>" + rows + "</tbody></table>");
}