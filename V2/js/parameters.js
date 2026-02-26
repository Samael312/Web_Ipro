var domain = ""
//var domain = "http://192.168.0.170"

//Generacion de la tabla de entradas y salidas dentro del elemento correspondiente del accordion
$(document).ready(function () {
  var user = magcheck_user();
  if (user) {
    if (user === "User") {
      document.getElementById('main-load').style.display = "none";    // Ocultamos el spinner
      document.getElementById('not-perms').style.display = "block";
    } else {
      load()
      setTimeout(function () {
        //Se genera la tabla y se oculta el loader pasado un tiempo
        htmlGenerator(gasType, 'sel-CNF04', 'CNF04', 'copy-CNF04');
        htmlGenerator(aiConf, 'sel-TER01', 'TER01', 'copy-TER01');
        htmlGenerator(aiConf, 'sel-TER05', 'TER05', 'copy-TER05');
        htmlGenerator(aiConf, 'sel-TER09', 'TER09', 'copy-TER09');
        htmlGenerator(aiConf, 'sel-TER13', 'TER13', 'copy-TER13');
        htmlGenerator(aiConf, 'sel-TER17', 'TER17', 'copy-TER17');
        //Ocultar el grafico de carga y mostrar parameteros
        document.getElementById('main-load').style.display = "none";    // Ocultamos el spinner
        document.getElementById('submit-div').style.display = "block";
        document.getElementById('parameters-conf').style.display = "block";
      }, 25000);
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
  setTimeout(function () { location.reload(true); }, 25000);
}

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