var domain = "";
//var domain = "http://172.17.123.250"

// Generación de la tabla de entradas y salidas dentro del elemento correspondiente del accordion
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

// Función para llamar a la función correspondiente en caso de aceptar
function commitModal(button) {
  const actions = {
    "on-button": "1",
    "off-button": "0"
  };

  // Si el botón es válido, se realiza la petición correspondiente
  const actionValue = actions[button.id];
  if (actionValue !== undefined) {
    $.ajax({
      crossOrigin: true,
      crossDomain: true,
      url: `${domain}/cgi-bin/jsetvar.cgi?name=KB_ONOFF&value=${actionValue}`,
      data: { get_param: 'value' },
      cache: false,
      dataType: 'json',
      success: function () {
        const modalId = actionValue === "1" ? "#on-modal" : "#off-modal";
        $(modalId).show("clip", 500);
        setTimeout(() => $(modalId).hide(), 3000);
      },
    });
  }
}

// Función para reiniciar las alarmas
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

// Función para mostrar el modal del reinicio de alarmas
function resetDialog() {
  $("#alarm-modal").show("clip", 500);
  setTimeout(() => $("#alarm-modal").hide(), 3000);
}

// Función para descargar el log de alarmas
function downloadLog(logType) {
  if (magcheck_user()) {
    window.location.href = `${domain}/cgi-bin/getfile.cgi?log=${logType}&what=log&disp=attachment`;
  } else {
    modal_login.style.display = "block";
  }
}

// Función para gestionar la carga o guardado de parámetros
function mapManagement(mapAction) {
  const actions = {
    "loadDefault": { action: "LOAD_PARAMETERS", mapValue: "0" },
    "loadBackup": { action: "LOAD_PARAMETERS", mapValue: "1" },
    "loadService": { action: "LOAD_PARAMETERS", mapValue: "2" },
    "writeDefault": { action: "SAVE_PARAMETERS", mapValue: "0" },
    "writeBackup": { action: "SAVE_PARAMETERS", mapValue: "1" },
    "writeService": { action: "SAVE_PARAMETERS", mapValue: "2" }
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
        $(modalId).show("clip", 500);
        setTimeout(() => $(modalId).hide(), 3000);
      }
    });
  }
}

// Función para mostrar un modal de log
function logAlert() {
  $("#log-modal").show("clip", 500);
  setTimeout(() => $("#log-modal").hide(), 3000);
}

// Función para mostrar un modal de simulador
function simulatorAlert() {
  $("#simulator-modal").show("clip", 500);
  setTimeout(() => $("#simulator-modal").hide(), 3000);
}