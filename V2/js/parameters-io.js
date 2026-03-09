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
        // Generación de las tablas de parámetros
        const config = [
          { vector: diConf, select: 'sel-di', valor: 'DI', id: 'copy-di', number: diNumber },
          { vector: aiConf, select: 'sel-ai', valor: 'AI', id: 'copy-ai', number: aiNumber },
          { vector: doConf, select: 'sel-do', valor: 'DO', id: 'copy-do', number: doNumber },
          { vector: aoConf, select: 'sel-ao', valor: 'AO', id: 'copy-ao', number: aoNumber }
        ];

        // Generación de los selects para cada tipo de entrada y salida
        config.forEach(item => {
          for (let i = 1; i < item.number; i++) {
            htmlGenerator(item.vector, `${item.select}${i}`, `${item.valor}${i}`, `${item.id}${i}`);
          }
        });

        // Ocultar el gráfico de carga y mostrar parámetros
        document.getElementById('main-load').style.display = "none";
        document.getElementById('submit-div').style.display = "block";
        document.getElementById('parameters-conf').style.display = "block";
      }, 30000);
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
  setTimeout(() => location.reload(true), 30000);
}

// Función para generar el HTML de los selects
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