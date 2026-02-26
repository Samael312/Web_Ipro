var domain = ""
//var domain = "http://172.17.123.250"

//Generacion de la tabla de entradas y salidas dentro del elemento correspondiente del accordion
$(document).ready(function () {
  var user = magcheck_user();
  if (user) {
    if (user === "User") {
      document.getElementById('main-load').style.display = "none";    // Ocultamos el spinner
      document.getElementById('not-perms').style.display = "block";
    } else {
      //Generacion de las tablas de parametros
      diTableGenerator();
      aiTableGenerator();
      doTableGenerator();
      aoTableGenerator();
      load()
      setTimeout(function () {
        //Se genera la tabla y se oculta el loader pasado un tiempo
        //Generacion de los select de cada tipo de entrada y salida
        for (var i = 1; i < diNumber; i++) {
          htmlGenerator(diConf, 'sel-di' + i, 'DI' + i, 'copy-di' + i);
          htmlGenerator(polConf, 'sel-pol' + i, 'POL' + i, 'copy-pol' + i);
        };
        for (var i = 1; i < aiNumber; i++) {
          htmlGenerator(aiConf, 'sel-ai' + i, 'AI' + i, 'copy-ai' + i);
        };
        for (var i = 1; i < doNumber; i++) {
          htmlGenerator(doConf, 'sel-do' + i, 'DO' + i, 'copy-do' + i);
        };
        for (var i = 1; i < aoNumber; i++) {
          htmlGenerator(aoConf, 'sel-ao' + i, 'AO' + i, 'copy-ao' + i);
        };

        //Ocultar el grafico de carga y mostrar parameteros
        document.getElementById('main-load').style.display = "none";    // Ocultamos el spinner
        document.getElementById('submit-div').style.display = "block";
        document.getElementById('parameters-conf').style.display = "block";
      }, 30000);
    }
  } else {
    document.getElementById('main-load').style.display = "none";
    modal_login.style.display = "block"
  }
});

//Funcion para ocultar todos los parametros y mostrar el loader de carga y actualizar la pagina pasado un tiempo
function submitChanges() {
  document.getElementById('submit-div').style.display = "none";
  document.getElementById('parameters-conf').style.display = "none";
  document.getElementById('warning').style.display = "block";
  document.getElementById('main-load').style.display = "block";
  setTimeout(function () { location.reload(true); }, 30000);
}

/*---------------------------------------------------------Funciones para generar html de entradas y salidas--------------------------------------------*/
//Funcion para generar la tabla con la configuracion de entradas digitales
function diTableGenerator() {
  var html = '<thead><tr>\
          <th style="border-radius:10px 0 0 10px;">Parameter</th>\
          <th>Description</th>\
          <th>Polarity</th>\
          <th>Previous value</th>\
          <th>Setting</th>\
          <th style="border-radius:0 10px 10px 0;">Previous value</th>\
        </tr></thead>';
  for (var i = 1; i < diNumber; i++) {
    if (i < 21) {
      html += "<tr>\
            <td>DIG"+ i + "</td><td>Digital input " + i + "</td>\
            <td>\
              <select id='sel-pol"+ i + "' onchange='selected(this,\"POL" + i + "\")'></select>\
            </td>\
            <td id='copy-pol"+ i + "'></td>\
            <td>\
              <select id='sel-di"+ i + "' onchange='selected(this,\"DI" + i + "\")'></select>\
            </td>\
            <td id='copy-di"+ i + "'></td>\
            <td>\
              <span id='POL"+ i + "' class='isaform_dint' style='visibility:hidden; z-index:-4; position:absolute'>POLARIDAD_DI[" + i + "]</span>\
            </td>\
            <td>\
              <span id='DI"+ i + "' class='isaform_dint' style='visibility:hidden; z-index:-4; position:absolute'>ENTRADAS_DIGITALES[" + i + "]</span>\
            </td>\
          </tr>";
    }
    else if (i >= 21 && i < 24) {
      html += "<tr>\
            <td>DIG"+ i + "</td><td>Digital input " + (i - 20) + " DIN4</td>\
            <td>\
              <select id='sel-pol"+ i + "' onchange='selected(this,\"POL" + i + "\")'></select>\
            </td>\
            <td id='copy-pol"+ i + "'></td>\
            <td>\
              <select id='sel-di"+ i + "' onchange='selected(this,\"DI" + i + "\")'></select>\
            </td>\
            <td id='copy-di"+ i + "'></td>\
            <td>\
              <span id='POL"+ i + "' class='isaform_dint' style='visibility:hidden; z-index:-4; position:absolute'>POLARIDAD_DI[" + i + "]</span>\
            </td>\
            <td>\
              <span id='DI"+ i + "' class='isaform_dint' style='visibility:hidden; z-index:-4; position:absolute'>ENTRADAS_DIGITALES[" + i + "]</span>\
            </td>\
          </tr>";
    }
    else {
      html += "<tr>\
            <td>DIG"+ i + "</td><td>Digital input " + (i - 23) + " DIN10</td>\
            <td>\
              <select id='sel-pol"+ i + "' onchange='selected(this,\"POL" + i + "\")'></select>\
            </td>\
            <td id='copy-pol"+ i + "'></td>\
            <td>\
              <select id='sel-di"+ i + "' onchange='selected(this,\"DI" + i + "\")'></select>\
            </td>\
            <td id='copy-di"+ i + "'></td>\
            <td>\
              <span id='POL"+ i + "' class='isaform_dint' style='visibility:hidden; z-index:-4; position:absolute'>POLARIDAD_DI[" + i + "]</span>\
            </td>\
            <td>\
              <span id='DI"+ i + "' class='isaform_dint' style='visibility:hidden; z-index:-4; position:absolute'>ENTRADAS_DIGITALES[" + i + "]</span>\
            </td>\
          </tr>";
    }
  }
  document.getElementById('di-table').insertAdjacentHTML('afterBegin', html);
};

//Funcion para generar la tabla con la configuracion de entradas analogicas
function aiTableGenerator() {
  var html = '<thead><tr>\
          <th style="border-radius:10px 0 0 10px;">Parameter</th>\
          <th>Description</th>\
          <th>Setting</th>\
          <th style="border-radius:0 10px 10px 0;">Previous value</th>\
        </tr></thead>';
  for (var i = 1; i < aiNumber; i++) {
    if (i < 11) {
      html += "<tr>\
            <td>PBS"+ i + "</td><td>Probe " + i + "</td>\
            <td>\
              <select id='sel-ai"+ i + "' onchange='selected(this,\"AI" + i + "\")'></select>\
            </td>\
            <td id='copy-ai"+ i + "'></td>\
            <td>\
              <span id='AI"+ i + "' class='isaform_dint' style='visibility:hidden; z-index:-4; position:absolute'>SONDAS[" + i + "]</span>\
            </td>\
          </tr>";
    }
    else if (i >= 11 && i < 18) {
      html += "<tr>\
            <td>PBS"+ i + "</td><td>Probe " + (i - 10) + " DIN4</td>\
            <td>\
              <select id='sel-ai"+ i + "' onchange='selected(this,\"AI" + i + "\")'></select>\
            </td>\
            <td id='copy-ai"+ i + "'></td>\
            <td>\
              <span id='AI"+ i + "' class='isaform_dint' style='visibility:hidden; z-index:-4; position:absolute'>SONDAS[" + i + "]</span>\
            </td>\
          </tr>";
    }
    else {
      html += "<tr>\
            <td>PBS"+ i + "</td><td>Probe " + (i - 17) + " DIN10</td>\
            <td>\
              <select id='sel-ai"+ i + "' onchange='selected(this,\"AI" + i + "\")'></select>\
            </td>\
            <td id='copy-ai"+ i + "'></td>\
            <td>\
              <span id='AI"+ i + "' class='isaform_dint' style='visibility:hidden; z-index:-4; position:absolute'>SONDAS[" + i + "]</span>\
            </td>\
          </tr>";
    }
  }
  document.getElementById('ai-table').insertAdjacentHTML('afterBegin', html);
};

//Funcion para generar la tabla con la configuracion de salidas digitales
function doTableGenerator() {
  var html = '<thead><tr>\
          <th style="border-radius:10px 0 0 10px;">Parameter</th>\
          <th>Description</th>\
          <th>Setting</th>\
          <th style="border-radius:0 10px 10px 0;">Previous value</th>\
        </tr></thead>';
  for (var i = 1; i < doNumber; i++) {
    if (i < 16) {
      html += "<tr>\
            <td>RLO"+ i + "</td><td>Relay output " + i + "</td>\
            <td>\
              <select id='sel-do"+ i + "' onchange='selected(this,\"DO" + i + "\")'></select>\
            </td>\
            <td id='copy-do"+ i + "'></td>\
            <td>\
              <span id='DO"+ i + "' class='isaform_dint' style='visibility:hidden; z-index:-4; position:absolute'>RELE_SALIDA[" + i + "]</span>\
            </td>\
          </tr>";
    }
    else if (i >= 16 && i < 22) {
      html += "<tr>\
            <td>RLO"+ i + "</td><td>Relay output " + (i - 15) + " DIN4</td>\
            <td>\
              <select id='sel-do"+ i + "' onchange='selected(this,\"DO" + i + "\")'></select>\
            </td>\
            <td id='copy-do"+ i + "'></td>\
            <td>\
              <span id='DO"+ i + "' class='isaform_dint' style='visibility:hidden; z-index:-4; position:absolute'>RELE_SALIDA[" + i + "]</span>\
            </td>\
          </tr>";
    }
    else {
      html += "<tr>\
            <td>RLO"+ i + "</td><td>Relay output " + (i - 21) + " DIN10</td>\
            <td>\
              <select id='sel-do"+ i + "' onchange='selected(this,\"DO" + i + "\")'></select>\
            </td>\
            <td id='copy-do"+ i + "'></td>\
            <td>\
              <span id='DO"+ i + "' class='isaform_dint' style='visibility:hidden; z-index:-4; position:absolute'>RELE_SALIDA[" + i + "]</span>\
            </td>\
          </tr>";
    }
  }
  document.getElementById('do-table').insertAdjacentHTML('afterBegin', html);
};

//Funcion para generar la tabla con la configuracion de salidas analogicas
function aoTableGenerator() {
  var html = '<thead><tr>\
          <th style="border-radius:10px 0 0 10px;">Parameter</th>\
          <th>Description</th>\
          <th>Setting</th>\
          <th style="border-radius:0 10px 10px 0;">Previous value</th>\
        </tr></thead>';
  for (var i = 1; i < aoNumber; i++) {
    if (i < 7) {
      html += "<tr>\
            <td>ANA"+ i + "</td><td>Analog output " + i + "</td>\
            <td>\
              <select id='sel-ao"+ i + "' onchange='selected(this,\"AO" + i + "\")'></select>\
            </td>\
            <td id='copy-ao"+ i + "'></td>\
            <td>\
              <span id='AO"+ i + "' class='isaform_dint' style='visibility:hidden; z-index:-4; position:absolute'>SALIDAS_ANALOG[" + i + "]</span>\
            </td>\
          </tr>";
    }
    else if (i >= 7 && i < 10) {
      html += "<tr>\
            <td>ANA"+ i + "</td><td>Analog output " + (i - 6) + " DIN4</td>\
            <td>\
              <select id='sel-ao"+ i + "' onchange='selected(this,\"AO" + i + "\")'></select>\
            </td>\
            <td id='copy-ao"+ i + "'></td>\
            <td>\
              <span id='AO"+ i + "' class='isaform_dint' style='visibility:hidden; z-index:-4; position:absolute'>SALIDAS_ANALOG[" + i + "]</span>\
            </td>\
          </tr>";
    }
    else {
      html += "<tr>\
            <td>ANA"+ i + "</td><td>Analog output " + (i - 9) + " DIN10</td>\
            <td>\
              <select id='sel-ao"+ i + "' onchange='selected(this,\"AO" + i + "\")'></select>\
            </td>\
            <td id='copy-ao"+ i + "'></td>\
            <td>\
              <span id='AO"+ i + "' class='isaform_dint' style='visibility:hidden; z-index:-4; position:absolute'>SALIDAS_ANALOG[" + i + "]</span>\
            </td>\
          </tr>";
    }
  }
  document.getElementById('ao-table').insertAdjacentHTML('afterBegin', html);
};

//Funcion para generar el html de los select
function htmlGenerator(vector, select, valor, id) {
  var html = '';
  var html2 = '';
  var y = document.getElementById(valor);
  for (var i = 0; i < vector.length; i++) {
    if (i == parseInt(y.value)) {
      html += "<option value='" + i + "' selected>" + vector[i] + "</option>";
      html2 += "<input readonly disabled value='" + vector[i] + "'></input>";
    }
    else { html += "<option value='" + i + "'>" + vector[i] + "</option>"; }
  }
  document.getElementById(select).innerHTML = html;
  document.getElementById(id).innerHTML = html2;
}

//Funcion para aplicar el valor del select
function selected(select, valor) {
  var x = select.selectedIndex;
  var y = document.getElementById(valor);
  y.value = x;
}

//Carga de los scripts
function load() {
  //Carga de las funciones intar
  $.ajax({ url: 'js/lib/dixell.js', dataType: 'script', crossDomain: true, success: function () { } });
};