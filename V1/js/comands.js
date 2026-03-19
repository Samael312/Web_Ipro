var domain = "";
//var domain = "http://172.17.123.250"

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
$(document).ready(function () {
  var user = magcheck_user();
  if (!user) {
    document.getElementById('main-load').style.display = "none";
    modal_login.style.display = "block";
  } else {
    setTimeout(() => {
      document.getElementById('main-load').style.display = "none";
      document.getElementById('commands').style.display = "block";
    }, 2000);
  }
});

// ─────────────────────────────────────────────
// HELPER BASE: envía un KB con value=1 y muestra modal de confirmación
// ─────────────────────────────────────────────
function sendKB(varName, modalId) {
  $.ajax({
    crossOrigin: true,
    crossDomain: true,
    url: `${domain}/cgi-bin/jsetvar.cgi?name=${varName}&value=1`,
    data: { get_param: 'value' },
    cache: false,
    dataType: 'json',
    success: function () {
      showModal(modalId);
    },
    error: function () {
      console.warn(`[CMD] Error al enviar ${varName}`);
    }
  });
}

// ─────────────────────────────────────────────
// HELPER: muestra un modal jQuery-UI clip y lo oculta a los 3s
// ─────────────────────────────────────────────
function showModal(modalId) {
  $(modalId).show("clip", 500);
  setTimeout(() => $(modalId).hide(), 3000);
}

// ─────────────────────────────────────────────
// 1. CONTROL GENERAL  —  KB_ON / KB_OFF / KB_ONOFF (legacy)
// ─────────────────────────────────────────────

/** Botones ON/OFF generales (compatibilidad con el HTML existente) */
function commitModal(button) {
  const actions = { "on-button": "1", "off-button": "0" };
  const actionValue = actions[button.id];
  if (actionValue !== undefined) {
    const varName = actionValue === "1" ? "KB_ON" : "KB_OFF";
    $.ajax({
      crossOrigin: true,
      crossDomain: true,
      url: `${domain}/cgi-bin/jsetvar.cgi?name=${varName}&value=1`,
      data: { get_param: 'value' },
      cache: false,
      dataType: 'json',
      success: function () {
        const modalId = actionValue === "1" ? "#on-modal" : "#off-modal";
        showModal(modalId);
      },
    });
  }
}

/** ON general */
function cmdOn()  { sendKB("KB_ON",  "#on-modal");  }
/** OFF general */
function cmdOff() { sendKB("KB_OFF", "#off-modal"); }

// ─────────────────────────────────────────────
// 2. ALARMAS
// ─────────────────────────────────────────────

/** Reseteo manual de alarmas */
function resetAlarm() {
  $.ajax({
    crossOrigin: true,
    crossDomain: true,
    url: `${domain}/cgi-bin/jsetvar.cgi?name=RESET_ALARM_MANUAL&value=1`,
    data: { get_param: 'value' },
    cache: false,
    dataType: 'json',
    success: function () { resetDialog(); },
  });
}

function resetDialog() { showModal("#alarm-modal"); }

// ─────────────────────────────────────────────
// 3. CALDERAS  —  KB_ON/OFF/AUTO_CALD_E1/E2/E3
// ─────────────────────────────────────────────

function cmdCalderaOn(etapa)   { sendKB(`KB_ON_CALD_E${etapa}`,   `#caldera-on-modal`);   }
function cmdCalderaOff(etapa)  { sendKB(`KB_OFF_CALD_E${etapa}`,  `#caldera-off-modal`);  }
function cmdCalderaAuto(etapa) { sendKB(`KB_AUTO_CALD_E${etapa}`, `#caldera-auto-modal`); }

// ─────────────────────────────────────────────
// 4. BOMBAS G4 / G5  —  KB_ON/OFF_BOMBA_G4/G5
// ─────────────────────────────────────────────

function cmdBombaOn(grupo)  { sendKB(`KB_ON_BOMBA_G${grupo}`,  `#bomba-on-modal`);  }
function cmdBombaOff(grupo) { sendKB(`KB_OFF_BOMBA_G${grupo}`, `#bomba-off-modal`); }

// ─────────────────────────────────────────────
// 5. BOMBA ACS  —  KB_ON/OFF/AUTO_BOMBA_ACS
// ─────────────────────────────────────────────

function cmdBombaAcsOn()   { sendKB("KB_ON_BOMBA_ACS",   "#bomba-acs-on-modal");   }
function cmdBombaAcsOff()  { sendKB("KB_OFF_BOMBA_ACS",  "#bomba-acs-off-modal");  }
function cmdBombaAcsAuto() { sendKB("KB_AUTO_BOMBA_ACS", "#bomba-acs-auto-modal"); }

// ─────────────────────────────────────────────
// 6. BOMBA DE CALOR KEYTER  —  KB_ON/OFF/AUTO_BCKEYTER
// ─────────────────────────────────────────────

function cmdBckeyterOn()   { sendKB("KB_ON_BCKEYTER",   "#bckeyter-on-modal");   }
function cmdBckeyterOff()  { sendKB("KB_OFF_BCKEYTER",  "#bckeyter-off-modal");  }
function cmdBckeyterAuto() { sendKB("KB_AUTO_BCKEYTER", "#bckeyter-auto-modal"); }

// ─────────────────────────────────────────────
// 7. INTARCON GRANDE  —  KB_ON/OFF_INTAR_BIG
// ─────────────────────────────────────────────

function cmdIntarBigOn()  { sendKB("KB_ON_INTAR_BIG",  "#intar-big-on-modal");  }
function cmdIntarBigOff() { sendKB("KB_OFF_INTAR_BIG", "#intar-big-off-modal"); }

// ─────────────────────────────────────────────
// 8. INTARCON PEQUEÑA  —  KB_ON/OFF/AUTO_INTAR_SMALL
// ─────────────────────────────────────────────

function cmdIntarSmallOn()   { sendKB("KB_ON_INTAR_SMALL",   "#intar-small-on-modal");   }
function cmdIntarSmallOff()  { sendKB("KB_OFF_INTAR_SMALL",  "#intar-small-off-modal");  }
function cmdIntarSmallAuto() { sendKB("KB_AUTO_INTAR_SMALL", "#intar-small-auto-modal"); }

// ─────────────────────────────────────────────
// 9. VÁLVULA RECUPERACIÓN  —  KB_ON/OFF/AUTO_V3V_RECOVERY
// ─────────────────────────────────────────────

function cmdV3vOn()   { sendKB("KB_ON_V3V_RECOVERY",   "#v3v-on-modal");   }
function cmdV3vOff()  { sendKB("KB_OFF_V3V_RECOVERY",  "#v3v-off-modal");  }
function cmdV3vAuto() { sendKB("KB_AUTO_V3V_RECOVERY", "#v3v-auto-modal"); }

// ─────────────────────────────────────────────
// 10. RESISTENCIA DEPÓSITO  —  KB_ON/OFF/AUTO_HEATER_REC
// ─────────────────────────────────────────────

function cmdHeaterOn()   { sendKB("KB_ON_HEATER_REC",   "#heater-on-modal");   }
function cmdHeaterOff()  { sendKB("KB_OFF_HEATER_REC",  "#heater-off-modal");  }
function cmdHeaterAuto() { sendKB("KB_AUTO_HEATER_REC", "#heater-auto-modal"); }

// ─────────────────────────────────────────────
// 11. CONTADORES  —  KB_RESET_C1..C6 / KB_RESET_CONTADOR
// ─────────────────────────────────────────────

/** Reset de un contador individual (1–6) */
function cmdResetContador(n) { sendKB(`KB_RESET_C${n}`, "#contador-reset-modal"); }

/** Reset global de todos los contadores */
function cmdResetAllContadores() { sendKB("KB_RESET_CONTADOR", "#contador-reset-modal"); }

// ─────────────────────────────────────────────
// 12. GESTIÓN DE MAPAS (parámetros)
// ─────────────────────────────────────────────

function mapManagement(mapAction) {
  const actions = {
    "loadDefault": { action: "LOAD_PARAMETERS", mapValue: "0" },
    "loadBackup":  { action: "LOAD_PARAMETERS", mapValue: "1" },
    "loadService": { action: "LOAD_PARAMETERS", mapValue: "2" },
    "writeDefault":{ action: "SAVE_PARAMETERS", mapValue: "0" },
    "writeBackup": { action: "SAVE_PARAMETERS", mapValue: "1" },
    "writeService":{ action: "SAVE_PARAMETERS", mapValue: "2" }
  };

  const { action, mapValue } = actions[mapAction] || {};
  if (action) {
    $.ajax({ url: `${domain}/cgi-bin/jsetvar.cgi?name=SEL_CURRENT_MAP&value=${mapValue}`, cache: false, type: 'GET' });
    $.ajax({
      url: `${domain}/cgi-bin/jsetvar.cgi?name=${action}&value=1`,
      cache: false,
      type: 'GET',
      success: function () {
        const modalId = action === "LOAD_PARAMETERS" ? "#load-modal" : "#write-modal";
        showModal(modalId);
      }
    });
  }
}

// ─────────────────────────────────────────────
// 13. UTILIDADES (log, simulator)
// ─────────────────────────────────────────────

function downloadLog(logType) {
  if (magcheck_user()) {
    window.location.href = `${domain}/cgi-bin/getfile.cgi?log=${logType}&what=log&disp=attachment`;
  } else {
    modal_login.style.display = "block";
  }
}

function logAlert()       { showModal("#log-modal");       }
function simulatorAlert() { showModal("#simulator-modal"); }

// ─────────────────────────────────────────────
// RESUMEN DE COMANDOS DISPONIBLES
// (referencia rápida para el HTML de commands.html)
// ─────────────────────────────────────────────
//
//  CONTROL GENERAL
//    cmdOn()                        KB_ON
//    cmdOff()                       KB_OFF
//    commitModal(button)            KB_ON / KB_OFF  (compatibilidad botones legacy)
//
//  ALARMAS
//    resetAlarm()                   RESET_ALARM_MANUAL
//
//  CALDERAS  (etapa = 1 | 2 | 3)
//    cmdCalderaOn(etapa)            KB_ON_CALD_E{n}
//    cmdCalderaOff(etapa)           KB_OFF_CALD_E{n}
//    cmdCalderaAuto(etapa)          KB_AUTO_CALD_E{n}
//
//  BOMBAS G4 / G5  (grupo = 4 | 5)
//    cmdBombaOn(grupo)              KB_ON_BOMBA_G{n}
//    cmdBombaOff(grupo)             KB_OFF_BOMBA_G{n}
//
//  BOMBA ACS
//    cmdBombaAcsOn()                KB_ON_BOMBA_ACS
//    cmdBombaAcsOff()               KB_OFF_BOMBA_ACS
//    cmdBombaAcsAuto()              KB_AUTO_BOMBA_ACS
//
//  BOMBA DE CALOR KEYTER
//    cmdBckeyterOn()                KB_ON_BCKEYTER
//    cmdBckeyterOff()               KB_OFF_BCKEYTER
//    cmdBckeyterAuto()              KB_AUTO_BCKEYTER
//
//  INTARCON GRANDE
//    cmdIntarBigOn()                KB_ON_INTAR_BIG
//    cmdIntarBigOff()               KB_OFF_INTAR_BIG
//
//  INTARCON PEQUEÑA
//    cmdIntarSmallOn()              KB_ON_INTAR_SMALL
//    cmdIntarSmallOff()             KB_OFF_INTAR_SMALL
//    cmdIntarSmallAuto()            KB_AUTO_INTAR_SMALL
//
//  VÁLVULA RECUPERACIÓN
//    cmdV3vOn()                     KB_ON_V3V_RECOVERY
//    cmdV3vOff()                    KB_OFF_V3V_RECOVERY
//    cmdV3vAuto()                   KB_AUTO_V3V_RECOVERY
//
//  RESISTENCIA DEPÓSITO
//    cmdHeaterOn()                  KB_ON_HEATER_REC
//    cmdHeaterOff()                 KB_OFF_HEATER_REC
//    cmdHeaterAuto()                KB_AUTO_HEATER_REC
//
//  CONTADORES  (n = 1..6)
//    cmdResetContador(n)            KB_RESET_C{n}
//    cmdResetAllContadores()        KB_RESET_CONTADOR
//
//  MAPAS
//    mapManagement(mapAction)       SEL_CURRENT_MAP + LOAD/SAVE_PARAMETERS
//
//  UTILIDADES
//    downloadLog(logType)
//    logAlert()
//    simulatorAlert()