var domain = "";
//var domain = "http://172.17.123.250"

// Generación de la tabla de entradas y salidas dentro del elemento correspondiente del accordion
$(document).ready(function () {
  var user = magcheck_user();
  
  if (user) {
    if (user === "User") {
      document.getElementById('main-load').style.display = "none"; // Ocultamos el spinner
      document.getElementById('not-perms').style.display = "block";
    } else {
      load();
      setTimeout(function () {
        // Genera las tablas y oculta el loader pasado un tiempo
        const configs = [
          { vector: gasType, select: 'sel-CNF04', valor: 'CNF04', id: 'copy-CNF04' },
          { vector: aiConf, select: 'sel-TER01', valor: 'TER01', id: 'copy-TER01' },
          { vector: aiConf, select: 'sel-TER05', valor: 'TER05', id: 'copy-TER05' },
          { vector: aiConf, select: 'sel-TER09', valor: 'TER09', id: 'copy-TER09' },
          { vector: aiConf, select: 'sel-TER13', valor: 'TER13', id: 'copy-TER13' },
          { vector: aiConf, select: 'sel-TER17', valor: 'TER17', id: 'copy-TER17' }
        ];
        
        // Generar las tablas
        configs.forEach(config => htmlGenerator(config.vector, config.select, config.valor, config.id));
        
        // Ocultar el gráfico de carga y mostrar parámetros
        document.getElementById('main-load').style.display = "none";
        document.getElementById('submit-div').style.display = "block";
        document.getElementById('parameters-conf').style.display = "block";
      }, 25000);
    }
  } else {
    document.getElementById('main-load').style.display = "none";
    modal_login.style.display = "block";
  }
});

// Función para ocultar todos los parámetros, mostrar el loader y actualizar la página después de un tiempo
function submitChanges() {
  document.getElementById('submit-div').style.display = "none";
  document.getElementById('parameters-conf').style.display = "none";
  document.getElementById('warning').style.display = "block";
  document.getElementById('main-load').style.display = "block";
  setTimeout(() => location.reload(true), 25000);
}

// Función para generar el HTML de los select
function htmlGenerator(vector, select, valor, id) {
  const y = document.getElementById(valor);
  let html = '', html2 = '';
  
  vector.forEach((item, i) => {
    if (i == parseInt(y.value)) {
      html += `<option value='${i}' selected>${item}</option>`;
      html2 += `<input readonly disabled value='${item}'></input>`;
    } else {
      html += `<option value='${i}'>${item}</option>`;
    }
  });

  document.getElementById(select).innerHTML = html;
  document.getElementById(id).innerHTML = html2;
}

// Función para aplicar el valor del select
function selected(select, valor) {
  const x = select.selectedIndex;
  const y = document.getElementById(valor);
  y.value = x;
}

// Carga de los scripts
function load() {
  $.ajax({ 
    url: 'js/lib/dixell.js', 
    dataType: 'script', 
    crossDomain: true 
  });
}