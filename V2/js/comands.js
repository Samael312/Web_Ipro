var domain = ""
//var domain = "http://192.168.0.170"

//Generacion de la tabla de entradas y salidas dentro del elemento correspondiente del accordion
$(document).ready(function () {
  var user = magcheck_user();
  if (!user) {
    document.getElementById('main-load').style.display = "none";
    modal_login.style.display = "block"
  } else {
    setTimeout(() => {
      document.getElementById('main-load').style.display = "none";
      document.getElementById('commands').style.display = "block";
    }, 2000);
  }
});

//Funcion para llamar a la funcion correspondiente en caso de aceptar
function commitModal(button) {
  //Se comprueba que boton ha sido activado, y se realiza la peticion correspondiente
  switch (button.id) {
    //Si se ha pulsado el boton de ON, se hace la peticion de ajax y se devuelve un modal de confirmacion
    case "on-button":
      $.ajax({
        crossOrigin: true,
        crossDomain: true,
        url: domain + "/cgi-bin/jsetvar.cgi?name=KB_ONOFF&value=1",
        data: { get_param: 'value' },
        cache: false,
        dataType: 'json',
        //En caso de exito se muestra un modal de aviso
        success: function () {
          $("#on-modal").show("clip", 500);
          setTimeout(function () { $("#on-modal").hide(); }, 3000);
        },
      });
      break;
    //Si se ha pulsado el boton de OFF, se hace la peticion de ajax y se devuelve un modal de confirmacion
    case "off-button":
      $.ajax({
        crossOrigin: true,
        crossDomain: true,
        url: domain + "/cgi-bin/jsetvar.cgi?name=KB_ONOFF&value=0",
        data: { get_param: 'value' },
        cache: false,
        dataType: 'json',
        //En caso de exito se muestra un modal de aviso
        success: function () {
          $("#off-modal").show("clip", 500);
          setTimeout(function () { $("#off-modal").hide(); }, 3000);
        },
      });
      break;
  }
}

//Funcion para reiniciar las alarmas
function resetAlarm() {
  $.ajax({
    crossOrigin: true,
    crossDomain: true,
    url: domain + "/cgi-bin/jsetvar.cgi?name=RESET_ALARM_MANUAL&value=1", //Se envia un 1 al registro de reinicio de alarmas de la regulacion
    data: { get_param: 'value' },
    cache: false,
    dataType: 'json',
    //En caso de exito se muestra un modal de aviso
    success: function () { resetDialog(); },
  });
}

//Funcion para mostrar el modal del reinicio de alarmas
function resetDialog() {
  $("#alarm-modal").show("clip", 500);
  setTimeout(function () { $("#alarm-modal").hide(); }, 3000);
};

//Funcion para descargar el log de alarmas
function downloadAlarms(user) {
  if (user) { window.location.href = domain + "/cgi-bin/getfile.cgi?log=alarms&what=log&disp=attachment"; }
  else { modal_login.style.display = "block" }
}

//Funcion para descargar el log de warnings
function downloadWarnings(user) {
  if (user) { window.location.href = domain + "/cgi-bin/getfile.cgi?log=warnings&what=log&disp=attachment"; }
  else { modal_login.style.display = "block" }
}

//Funcion para realizar la carga o guardado de parametros
function map_management(map_action) {
  var map = "SEL_CURRENT_MAP";
  var action_value = 1;
  switch (map_action) {
    case "loadDefault":
      var action = "LOAD_PARAMETERS";
      var map_value = "0";
      break;
    case "loadBackup":
      var action = "LOAD_PARAMETERS";
      var map_value = "1";
      break;
    case "loadService":
      var action = "LOAD_PARAMETERS";
      var map_value = "2";
      break;
    case "writeDefault":
      var action = "SAVE_PARAMETERS";
      var map_value = "0";
      break;
    case "writeBackup":
      var action = "SAVE_PARAMETERS";
      var map_value = "1";
      break;
    case "writeService":
      var action = "SAVE_PARAMETERS";
      var map_value = "2";
      break;
  }
  $.ajax({
    url: domain + "/cgi-bin/jsetvar.cgi?name=" + map + "&" + "value=" + map_value,
    cache: false,
    type: 'GET',
    success: function () { }
  });
  $.ajax({
    url: domain + "/cgi-bin/jsetvar.cgi?name=" + action + "&" + "value=" + action_value,
    cache: false,
    type: 'GET',
    success: function () {
      if (action == "LOAD_PARAMETERS") {
        $("#load-modal").show("clip", 500);
        setTimeout(function () { $("#load-modal").hide(); }, 3000);
      };
      if (action == "SAVE_PARAMETERS") {
        $("#write-modal").show("clip", 500);
        setTimeout(function () { $("#write-modal").hide(); }, 3000);
      };
    }
  });
};

function log_alert() {
  $("#log-modal").show("clip", 500);
  setTimeout(function () { $("#log-modal").hide(); }, 3000);
}

function simulator_alert() {
  $("#simulator-modal").show("clip", 500);
  setTimeout(function () { $("#simulator-modal").hide(); }, 3000);
}
