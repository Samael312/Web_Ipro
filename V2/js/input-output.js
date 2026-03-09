// Variable para el estado del módulo de expansión
var expansion;

var domain = ""; //var domain = "http://172.17.123.250"

$(document).ready(function () {
  // Consultamos si hay módulo de expansión
  $.ajax({
    crossOrigin: true,
    crossDomain: true,
    url: domain + "/cgi-bin/jgetvar.cgi?name=MODULO_EXPANSION",
    data: { get_param: 'value' },
    cache: false,
    dataType: 'json',
    timeout: 5000, // Timeout de 5 segundos
    success: function (data) {
      expansion = data[0].value;
      // Una vez se obtiene el resultado, se generan las tablas
      aiTableGenerator(true);
      diTableGenerator(true);
      doTableGenerator(true);
      aoTableGenerator(true);
    },
    error: function () {
      // Si ocurre un error o se agotó el tiempo
      console.warn("Fallo al obtener el estado del módulo de expansión o se agotó el tiempo.");
      aiTableGenerator(false);
      diTableGenerator(false);
      doTableGenerator(false);
      aoTableGenerator(false);
    }
  });
});

// Función para generar el html de las entradas analógicas
function aiTableGenerator(hasData) {
  var html = "<h3 style='background-color: #d9daff;'>ANALOG INPUTS</h3>\
				<div class='col-10'><table class='table'>\
					<tr>\
						<th style='border-radius:5px 0 0 5px;'>Probe</th>\
						<th>Description</th>\
						<th>Value</th>\
						<th style='border-radius:0 5px 5px 0;'>Unit</th>\
					</tr>";
  
  for (var i = 1; i < 11; i++) {
    html += "<tr>\
				<td>Pb" + i + "</td>\
				<td><span class='intar-select'>SONDAS[" + i + "]/aiConf</span></td>\
				<td><span class='intar-decimal'>SONDAS_OUT[" + i + "]/10/0/1/3</span></td>\
				<td><span class='intar-select'>SONDAS[" + i + "]/aiUnit</span></td>\
			</tr>";
  }
  // Si no hay datos, se coloca un mensaje
  if (!hasData) {
    html += "<tr><td colspan='4' style='color:#dc3545; font-weight:bold;'>Sin datos</td></tr>";
  }
  html += '</table></div>';
  document.getElementById('ai-values').insertAdjacentHTML('afterBegin', html);
}

// Función para generar el html de las entradas digitales
function diTableGenerator(hasData) {
  var html = '<h3 style="background-color: #d9daff;">DIGITAL INPUTS</h3>\
				<div class="col-10"><table class="table">\
					<tr>\
						<th style="border-radius:5px 0 0 5px;">Probe</th>\
						<th>Description</th>\
						<th style="border-radius:0 5px 5px 0;">Status</th>\
					</tr>';
  for (var i = 1; i < 21; i++) {
    html += "<tr>\
					<td>DI" + i + "</td>\
					<td><span class='intar-select'>ENTRADAS_DIGITALES[" + i + "]/diConf</span></td>\
					<td><span class='intar-bool'>DI_OUT[" + i + "]/<span style='color: black;'>OFF</span>/<span style='color: blue;'>ON</span>/3</span></td>\
				</tr>";
  }
  // Si no hay datos, se coloca un mensaje
  if (!hasData) {
    html += "<tr><td colspan='3' style='color:#dc3545; font-weight:bold;'>Sin datos</td></tr>";
  }
  html += '</table></div>';
  document.getElementById('di-values').insertAdjacentHTML('afterBegin', html);
};

// Función para generar el html de las salidas digitales
function doTableGenerator(hasData) {
  var html = '<h3 style="background-color: #d9daff;">DIGITAL OUTPUTS</h3>\
				<div class="col-10"><table class="table">\
					<tr>\
						<th style="border-radius:5px 0 0 5px;">Probe</th>\
						<th>Description</th>\
						<th style="border-radius:0 5px 5px 0;">Status</th>\
					</tr>';
  for (var i = 1; i < 16; i++) {
    html += "<tr>\
					<td>RL" + i + "</td>\
					<td><span class='intar-select'>RELE_SALIDA[" + i + "]/doConf</span></td>\
					<td><span class='intar-bool'>RELE_SALIDA_VALOR[" + i + "]/<span style='color: black;'>OFF</span>/<span style='color: blue;'>ON</span>/3</span></td>\
				</tr>";
  }
  // Si no hay datos, se coloca un mensaje
  if (!hasData) {
    html += "<tr><td colspan='3' style='color:#dc3545; font-weight:bold;'>Sin datos</td></tr>";
  }
  html += '</table></div>';
  document.getElementById('do-values').insertAdjacentHTML('afterBegin', html);
};

// Función para generar el html de las salidas analógicas
function aoTableGenerator(hasData) {
  var html = '<h3 style="background-color: #d9daff;">ANALOG OUTPUTS</h3>\
				<div class="col-10"><table class="table">\
					<tr>\
						<th style="border-radius:5px 0 0 5px;">Probe</th>\
						<th>Description</th>\
						<th>Value</th>\
						<th style="border-radius:0 5px 5px 0;">Unit</th>\
					</tr>';
  for (var i = 1; i < 7; i++) {
    html += "<tr>\
				<td>AO" + i + "</td>\
				<td><span class='intar-select'>SALIDAS_ANALOG[" + i + "]/aoConf</span></td>\
				<td><span class='intar-decimal'>AO_OUT[" + i + "]/1/0/0/3</span></td>\
				<td><span class='intar-select'>SALIDAS_ANALOG[" + i + "]/aoUnit</span></td>\
			</tr>";
  }
  // Si no hay datos, se coloca un mensaje
  if (!hasData) {
    html += "<tr><td colspan='4' style='color:#dc3545; font-weight:bold;'>Sin datos</td></tr>";
  }
  html += '</table></div>';
  document.getElementById('ao-values').insertAdjacentHTML('afterBegin', html);
};

// Función para generar el html de las entradas y salidas
function hideTable(clickId) {
  // Se comprueba el botón que se ha pulsado
  var buttonId = clickId.id;
  var button = document.getElementById(buttonId);
  // Se obtiene la id de las 4 tablas
  var aiId = document.getElementById('ai-values');
  var diId = document.getElementById('di-values');
  var doId = document.getElementById('do-values');
  var aoId = document.getElementById('ao-values');
  // Se oculta la tabla en función del botón pulsado
  switch (buttonId) {
    case "analog-input-button":
      if (aiId.style.display == 'none') {
        aiId.style.display = "";
        button.style.backgroundColor = '#1a82ba';
      } else {
        aiId.style.display = 'none';
        button.style.backgroundColor = 'gray';
      }
      break;

    case "digital-input-button":
      if (diId.style.display == 'none') {
        diId.style.display = "";
        button.style.backgroundColor = '#1a82ba';
      } else {
        diId.style.display = 'none';
        button.style.backgroundColor = 'gray';
      }
      break;

    case "digital-output-button":
      if (doId.style.display == 'none') {
        doId.style.display = "";
        button.style.backgroundColor = '#1a82ba';
      } else {
        doId.style.display = 'none';
        button.style.backgroundColor = 'gray';
      }
      break;

    case "analog-output-button":
      if (aoId.style.display == 'none') {
        aoId.style.display = "";
        button.style.backgroundColor = '#1a82ba';
      } else {
        aoId.style.display = 'none';
        button.style.backgroundColor = 'gray';
      }
      break;
  }
};