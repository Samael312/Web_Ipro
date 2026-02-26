//Variables
var modal_login = document.getElementById('login-modal');
var i = 0;											//Variable que contiene el puntero del vector
var alarmList = [];									//Vector donde se guarda el valor que corresponde a la alarma
var warningList = [];
var alarmListHisto = [];
var alarmStartHour = [];							//Vector donde se guardan las horas de inicio de las alarmas
var alarmStartMinute = [];							//Vector donde se guardan los minutos de inicio de las alarmas
var alarmStartHourHisto = [];
var alarmStartMinuteHisto = [];

var domain = ""
//var domain = "http://192.168.0.170"

/*Petición json para conocer el valor de las variables en iPRO*/
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

/*Funcion para la lectura de las alarmas activas*/
/*Esta función indexa en el html una lista con las alarmas del equipo y la hora en la que ocurrieron*/
$(document).ready(function () {
  $.ajax({
    url: 'js/input-output-config.js',
    dataType: 'script',
    crossDomain: true,
    success: function () { }
  });

  for (i = 1; i < 11; i++) {
    alarmList[i] = peticionAjax('List_alarms[' + i + ']');
    warningList[i] = peticionAjax('List_warnings[' + i + ']');
    alarmListHisto[i] = peticionAjax('List_alarms_histo[' + i + ']');
    alarmStartHour[i] = peticionAjax('Hora_Inicio_Alarmas_Activas[' + i + ']');
    alarmStartMinute[i] = peticionAjax('Minuto_Inicio_Alarmas_Activas[' + i + ']');
    alarmStartHourHisto[i] = peticionAjax('List_alarms_Histo_Hour[' + i + ']');
    alarmStartMinuteHisto[i] = peticionAjax('List_alarms_Histo_Minute[' + i + ']');
  }
  //Se obtiene si se ha configurado caudal variable
  $.ajax({
    crossOrigin: true,
    crossDomain: true,
    url: domain + "/cgi-bin/jgetvar.cgi?name=ONOFF_GEN",
    data: { get_param: 'value' },
    cache: false,
    dataType: 'json',
    success: function () {
      alarmTable(alarmList, alarmStartHour, alarmStartMinute, warningList, alarmListHisto, alarmStartHourHisto, alarmStartMinuteHisto);
    }
  });
})

function alarmTable(alarmList, alarmStartHour, alarmStartMinute, warningList, alarmListHisto, alarmStartHourHisto, alarmStartMinuteHisto) {
  var html = "";
  //Se general la tabla html
  if (alarmList[1] == 0) {
    document.getElementById('alarm-list').style.display = "";
  } else {
    html += `<thead>
          <tr>
            <th class='text-center'>#</th>
            <th>Time</th>
            <th>Alarm</th>
          </tr>
        </thead>
        <tbody>`
    for (i = 1; i < 11; i++) {
      if (alarmList[i] != 0) {
        html += "<tr>\
  						<td class ='text-center'>"+ i + "</td>\
  						<td>"+ alarmStartHour[i] + ":" + alarmStartMinute[i] + "</td>\
  						<td>"+ activeAlarmsList[alarmList[i]] + "</td>\
  					</tr>";
      }
    }
    html += `</tbody>`
  }
  //Se inserta la table en el documento
  document.getElementById('alarm-table').insertAdjacentHTML('afterBegin', html);

  html = "";
  if (alarmListHisto[1] == 0) {
    document.getElementById('alarm-histo').style.display = "";
  } else {
    html += `<thead>
        <tr>
          <th class='text-center'>#</th>
          <th>Time</th>
          <th>Alarm</th>
        </tr>
      </thead>
      <tbody>`
    for (i = 1; i < 11; i++) {
      if (alarmListHisto[i] != 0) {
        html += "<tr>\
              <td class ='text-center'>"+ i + "</td>\
              <td>"+ alarmStartHourHisto[i] + ":" + alarmStartMinuteHisto[i] + "</td>\
  						<td>"+ activeAlarmsList[alarmListHisto[i]] + "</td>\
  					</tr>";
      }
    }
    html += `</tbody>`
  }
  //Se inserta la table en el documento
  document.getElementById('alarm-table-histo').insertAdjacentHTML('afterBegin', html);

  html = "";
  if (warningList[1] == 0) {
    document.getElementById('warn-list').style.display = "";
  } else {
    html += `<thead>
      <tr>
        <th class='text-center'>#</th>
        <th>Warning</th>
      </tr>
    </thead>
    <tbody>`
    for (i = 1; i < 11; i++) {
      if (warningList[i] != 0) {
        html += "<tr>\
  						<td class='text-center'>"+ i + "</td>\
  						<td>"+ activeWarningsList[warningList[i]] + "</td>\
  					</tr>";
      }
    }
    html += `</tbody>`
  }
  //Se inserta la table en el documento
  document.getElementById('warning-table').insertAdjacentHTML('afterBegin', html);

  document.getElementById('main-load').style.display = "none";    // Ocultamos el spinner
  document.getElementById('Grid-Container').style.display = "";   // Activamos el div principal
}

//Carga de los scripts
function load() {
  $.ajax({
    url: 'js/input-output-config.js',
    dataType: 'script',
    crossDomain: true,
    success: function () { }
  });
};