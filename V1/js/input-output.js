//Variable para almacenar el estado del modulo de expansion
var expansion;

var domain = ""
//var domain = "http://172.17.123.250"

$(document).ready(function () {
	//Se consulta si hay modulo de expansion
	$.ajax({
		crossOrigin: true,
		crossDomain: true,
		url: domain + "/cgi-bin/jgetvar.cgi?name=MODULO_EXPANSION",
		data: { get_param: 'value' },
		cache: false,
		dataType: 'json',
		success: function (data) {
			expansion = data[0].value;
			//Una vez se obtiene el resultado se generan las tablas
			aiTableGenerator();
			diTableGenerator();
			doTableGenerator();
			aoTableGenerator();
		}
	});
});

//Funcion para generar el html de las entradas analogicas
function aiTableGenerator() {
	var html = `<h3 style='background-color: #d9daff;'>ANALOG INPUTS</h3>\
				<div class="col-10"><table class="table">\
					<tr>\
						<th style="border-radius:5px 0 0 5px;">Probe</th>\
						<th>Description</th>\
						<th>Value</th>\
						<th style="border-radius:0 5px 5px 0;">Unit</th>\
					</tr>`;
	for (var i = 1; i < 11; i++) {
		html += "<tr>\
					<td>Pb"+ i + "</td>\
					<td><span class='intar-select'>SONDAS["+ i + "]/aiConf</span></td>\
					<td><span class='intar-decimal'>SONDAS_OUT["+ i + "]/10/0/1/3</span></td>\
					<td><span class='intar-select'>SONDAS["+ i + "]/aiUnit</span></td>\
				</tr>";
	}
	//Si el modulo de expansion DIN4 esta habilitado, se generan las variables correspondientes
	if (expansion == 1 || expansion == 3 || expansion == 5) {
		for (i = 11; i < 18; i++) {
			html += "<tr>\
						<td>Pb"+ (i - 10) + " DIN4</td>\
						<td><span class='intar-select'>SONDAS["+ i + "]/aiConf</span></td>\
						<td><span class='intar-decimal'>SONDAS_OUT["+ i + "]/10/0/1/3</span></td>\
						<td><span class='intar-select'>SONDAS["+ i + "]/aiUnit</span></td>\
					</tr>";
		}
	}
	//Si el modulo de expansion DIN10 esta habilitado, se generan las variables correspondientes
	if (expansion >= 2 || expansion == 3) {
		for (i = 18; i < 28; i++) {
			html += "<tr>\
						<td>Pb"+ (i - 17) + " DIN10</td>\
						<td><span class='intar-select'>SONDAS["+ i + "]/aiConf</span></td>\
						<td><span class='intar-decimal'>SONDAS_OUT["+ i + "]/10/0/1/3</span></td>\
						<td><span class='intar-select'>SONDAS["+ i + "]/aiUnit</span></td>\
					</tr>";
		}
	}
	//Si el modulo de expansion DIN10' esta habilitado, se generan las variables correspondientes
	if (expansion == 4 || expansion == 5) {
		for (i = 28; i < 38; i++) {
			html += "<tr>\
						<td>Pb"+ (i - 27) + " DIN10</td>\
						<td><span class='intar-select'>SONDAS["+ i + "]/aiConf</span></td>\
						<td><span class='intar-decimal'>SONDAS_OUT["+ i + "]/10/0/1/3</span></td>\
						<td><span class='intar-select'>SONDAS["+ i + "]/aiUnit</span></td>\
					</tr>";
		}
	}
	html += '</table></div>';
	document.getElementById('ai-values').insertAdjacentHTML('afterBegin', html);
};

//Funcion para generar el html de las entradas digitales
function diTableGenerator() {
	var html = '<h3 style="background-color: #d9daff;">DIGITAL INPUTS</h3>\
				<div class="col-10"><table class="table">\
					<tr>\
						<th style="border-radius:5px 0 0 5px;">Probe</th>\
						<th>Description</th>\
						<th style="border-radius:0 5px 5px 0;">Status</th>\
					</tr>';
	for (var i = 1; i < 21; i++) {
		html += "<tr>\
					<td>DI"+ i + "</td>\
					<td><span class='intar-select'>ENTRADAS_DIGITALES["+ i + "]/diConf</span></td>\
					<td><span class='intar-bool'>DI_OUT["+ i + "]/<span style='color: black;'>OFF</span>/<span style='color: blue;'>ON</span>/3</span></td>\
				</tr>";
	}
	//Si el modulo de expansion DIN4 esta habilitado, se generan las variables correspondientes
	if (expansion == 1 || expansion == 3) {
		for (i = 21; i < 24; i++) {
			html += "<tr>\
						<td>DI"+ (i - 20) + " DIN4</td>\
						<td><span class='intar-select'>ENTRADAS_DIGITALES["+ i + "]/diConf</span></td>\
						<td><span class='intar-bool'>DI_OUT["+ i + "]/<span style='color: black;'>OFF</span>/<span style='color: blue;'>ON</span>/3</span></td>\
					</tr>";
		}
	}
	//Si el modulo de expansion DIN10 esta habilitado, se generan las variables correspondientes
	if (expansion == 2 || expansion == 3 || expansion == 4 || expansion == 5) {
		for (i = 24; i < 44; i++) {
			html += "<tr>\
						<td>DI"+ (i - 23) + " DIN10</td>\
						<td><span class='intar-select'>ENTRADAS_DIGITALES["+ i + "]/diConf</span></td>\
						<td><span class='intar-bool'>DI_OUT["+ i + "]/<span style='color: black;'>OFF</span>/<span style='color: blue;'>ON</span>/3</span></td>\
					</tr>";
		}
	}
	//Si el modulo de expansion DIN10' esta habilitado, se generan las variables correspondientes
	if (expansion == 4 || expansion == 5) {
		for (i = 44; i < 65; i++) {
			html += "<tr>\
						<td>DI"+ (i - 43) + " DIN10</td>\
						<td><span class='intar-select'>ENTRADAS_DIGITALES["+ i + "]/diConf</span></td>\
						<td><span class='intar-bool'>DI_OUT["+ i + "]/<span style='color: black;'>OFF</span>/<span style='color: blue;'>ON</span>/3</span></td>\
					</tr>";
		}
	}
	html += '</table></div>';
	document.getElementById('di-values').insertAdjacentHTML('afterBegin', html);
};

//Funcion para generar el html de las entradas digitales
function doTableGenerator() {
	var html = '<h3 style="background-color: #d9daff;">DIGITAL OUTPUTS</h3>\
				<div class="col-10"><table class="table">\
					<tr>\
						<th style="border-radius:5px 0 0 5px;">Probe</th>\
						<th>Description</th>\
						<th style="border-radius:0 5px 5px 0;">Status</th>\
					</tr>';
	for (var i = 1; i < 16; i++) {
		html += "<tr>\
					<td>RL"+ i + "</td>\
					<td><span class='intar-select'>RELE_SALIDA["+ i + "]/doConf</span></td>\
					<td><span class='intar-bool'>RELE_SALIDA_VALOR["+ i + "]/<span style='color: black;'>OFF</span>/<span style='color: blue;'>ON</span>/3</span></td>\
				</tr>";
	}
	//Si el modulo de expansion DIN4 esta habilitado, se generan las variables correspondientes
	if (expansion == 1 || expansion == 3) {
		for (i = 16; i < 22; i++) {
			html += "<tr>\
						<td>RL"+ (i - 15) + " DIN4</td>\
						<td><span class='intar-select'>RELE_SALIDA["+ i + "]/doConf</span></td>\
						<td><span class='intar-bool'>RELE_SALIDA_VALOR["+ i + "]/<span style='color: black;'>OFF</span>/<span style='color: blue;'>ON</span>/3</span></td>\
					</tr>";
		}
	}
	//Si el modulo de expansion DIN10 esta habilitado, se generan las variables correspondientes
	if (expansion == 2 || expansion == 3 || expansion == 4 || expansion == 5) {
		for (i = 22; i < 37; i++) {
			html += "<tr>\
						<td>RL"+ (i - 21) + " DIN10</td>\
						<td><span class='intar-select'>RELE_SALIDA["+ i + "]/doConf</span></td>\
						<td><span class='intar-bool'>RELE_SALIDA_VALOR["+ i + "]/<span style='color: black;'>OFF</span>/<span style='color: blue;'>ON</span>/3</span></td>\
					</tr>";
		}
	}
	//Si el modulo de expansion DIN10' esta habilitado, se generan las variables correspondientes
	if (expansion == 4 || expansion == 5) {
		for (i = 37; i < 52; i++) {
			html += "<tr>\
						<td>RL"+ (i - 36) + " DIN10</td>\
						<td><span class='intar-select'>RELE_SALIDA["+ i + "]/doConf</span></td>\
						<td><span class='intar-bool'>RELE_SALIDA_VALOR["+ i + "]/<span style='color: black;'>OFF</span>/<span style='color: blue;'>ON</span>/3</span></td>\
					</tr>";
		}
	}

	html += '</table></div>';
	document.getElementById('do-values').insertAdjacentHTML('afterBegin', html);
};

//Funcion para generar el html de las entradas digitales	
function aoTableGenerator() {
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
				<td>AO"+ i + "</td>\
				<td><span class='intar-select'>SALIDAS_ANALOG["+ i + "]/aoConf</span></td>\
				<td><span class='intar-decimal'>AO_OUT["+ i + "]/1/0/0/3</span></td>\
				<td><span class='intar-select'>SALIDAS_ANALOG["+ i + "]/aoUnit</span></td>\
			</tr>";
	}
	//Si el modulo de expansion DIN4 esta habilitado, se generan las variables correspondientes
	if (expansion == 1 || expansion == 3) {
		for (i = 7; i < 10; i++) {
			html += "<tr>\
						<td>AO"+ (i - 6) + " DIN4</td>\
						<td><span class='intar-select'>SALIDAS_ANALOG["+ i + "]/aoConf</span></td>\
						<td><span class='intar-decimal'>AO_OUT["+ i + "]/1/0/0/3</span></td>\
						<td><span class='intar-select'>SALIDAS_ANALOG["+ i + "]/aoUnit</span></td>\
					</tr>";
		}
	}
	//Si el modulo de expansion DIN10 esta habilitado, se generan las variables correspondientes
	if (expansion == 2 || expansion == 3 || expansion == 4 || expansion == 5) {
		for (i = 10; i < 17; i++) {
			html += "<tr>\
						<td>AO"+ (i - 9) + " DIN10</td>\
						<td><span class='intar-select'>SALIDAS_ANALOG["+ i + "]/aoConf</span></td>\
						<td><span class='intar-decimal'>AO_OUT["+ i + "]/1/0/0/3</span></td>\
						<td><span class='intar-select'>SALIDAS_ANALOG["+ i + "]/aoUnit</span></td>\
					</tr>";
		}
	}
	//Si el modulo de expansion DIN10' esta habilitado, se generan las variables correspondientes
	if (expansion == 4 || expansion == 5) {
		for (i = 17; i < 22; i++) {
			html += "<tr>\
						<td>AO"+ (i - 18) + " DIN10</td>\
						<td><span class='intar-select'>SALIDAS_ANALOG["+ i + "]/aoConf</span></td>\
						<td><span class='intar-decimal'>AO_OUT["+ i + "]/1/0/0/3</span></td>\
						<td><span class='intar-select'>SALIDAS_ANALOG["+ i + "]/aoUnit</span></td>\
					</tr>";
		}
	}
	html += '</table></div>';
	document.getElementById('ao-values').insertAdjacentHTML('afterBegin', html);
	loadScript();
};

//Funcion que oculta o muestra los datos de las entradas y salidas analogicas y digitales
function hideTable(clickId) {
	//Se comprueba el boton que se ha pulsado
	var buttonId = clickId.id;
	var button = document.getElementById(buttonId);
	//Se obtiene la id de las 4 tablas
	var aiId = document.getElementById('ai-values');
	var diId = document.getElementById('di-values');
	var doId = document.getElementById('do-values');
	var aoId = document.getElementById('ao-values');
	//Se oculta la tabla en funcion del boton pulsado
	switch (buttonId) {
		//Se oculta la tabla de entradas analogicas
		case "analog-input-button":
			if (aiId.style.display == 'none') {
				aiId.style.display = "";
				button.style.backgroundColor = '#1a82ba';
			}
			else {
				aiId.style.display = 'none';
				button.style.backgroundColor = 'gray';
			}
			break;

		//Se oculta la tabla de entradas digitales
		case "digital-input-button":
			if (diId.style.display == 'none') {
				diId.style.display = "";
				button.style.backgroundColor = '#1a82ba';
			}
			else {
				diId.style.display = 'none';
				button.style.backgroundColor = 'gray';
			}
			break;

		//Se oculta la tabla de salidas digitales
		case "digital-output-button":
			if (doId.style.display == 'none') {
				doId.style.display = "";
				button.style.backgroundColor = '#1a82ba';
			}
			else {
				doId.style.display = 'none';
				button.style.backgroundColor = 'gray';
			}
			break;

		//Se oculta la tabla de salidas analogicas
		case "analog-output-button":
			if (aoId.style.display == 'none') {
				aoId.style.display = "";
				button.style.backgroundColor = '#1a82ba';
			}
			else {
				aoId.style.display = 'none';
				button.style.backgroundColor = 'gray';
			}
			break;
	}
};

function loadScript() {
	$.ajax({ url: 'js/intarcon.js', dataType: 'script', crossDomain: true, });
	$.ajax({ url: 'js/input-output-config.js', dataType: 'script', crossDomain: true, });
};