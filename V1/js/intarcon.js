/*-------------Fichero con los scripts de las funciones de lectura y escritura de variables----------------
v1.00	(13/04/2020) A.Luque	-Se unifican los diferentes script de Intarcon en uno sólo y se ponen versiones.
v2.00	(30/09/2021) A.Luque	-Se modifica el software para adaptarse a la bios de ipro 2021
*/
var domain = ""
//var domain = "http://172.17.123.250"

/*--------------Al cargar este fichero se hace la llamada a las funciones--------------*/
$(document).ready(function () {
  intarDecimal();				//v1.0 Se piden los datos numericos con o sin decimales
  intarSelect();				//v1.0 Se piden los datos de listas
  intarBool();				//v1.0 Se piden los datos booleanos
  intarDisplay();				//v1.0 Se muestran las imagenes de estado
  intarDisplayICON();			//v1.0 Se muestran iconos
});

/*------------------------------------------INTAR BOOL------------------------------------------*/
/*Funcion para la lectura de variables de tipo booleano*/
function intarBool() {
  /*Esta funcion evalua todos las etiquetas con la clase "intar-bool" para pedir datos de tipo booleano
  La sintaxis de la clase debe ser la siguiente:
  <span class='intar-bool>Nombre/Estado_0/Estado_1/Tiempo</span>
  La barra "/" es el separador clave de la funcion. No añadir mas de las que hay.
  Cada elemento representa:
  Nombre: Nombre del registro al que se va a acceder. Debe ser texto sin espacios.
  Estado_0: Nombre que se va a representar si el valor es 0. Debe ir dentro de un span con color.
  Estado_1: Nombre que se va a representar si el valor es 1. Debe ir dentro de un span con color.
  Tiempo: Tiempo para realizar la siguiente consulta
  ¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡Ejemplo para copiar y pegar!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  <span class="intar-bool">ONOFF_GEN/<span style='color: blue'>OFF</span>/<span style='color: blue'>ON</span>/10</span>
  */
  //Se crean las variables que se van a utilizar en la funcion
  var length = $('.intar-bool').length;									//Guarda el numero de etiquetas con la clase intar-bool			
  var name = [];															//Guarda el nombre de cada registro que tiene que evaluar
  var falseState = [];													//Guarda el nombre que se va a mostrar en caso de estar a 0
  var trueState = [];														//Guarda el nombre que se va a mostrar en caso de estar a 1
  var refreshTime = [];													//Guarda el tiempo de refresco de cada variable
  var variableId = [];													//Guarda el nombre de la id que se el va a asignar a cada etiqueta
  var falseStyle = [];													//Guarda el estilo que va a tener la variable en caso de estar a 0
  var trueStyle = [];														//Guarda el estilo que va a tener la variable en caso de estar a 1
  var i = 0;																//Variable que sirve como puntero para los vectores
  //Para cada elemento con la clase 'intar-bool', se realiza lo siguiente
  $('.intar-bool').each(function () {
    var text = '';														//Variable temporal que va a contener el texto en caso de error
    var htmlContent = this.textContent.split("/");   					//Se trocea el texto que hay en el html, separando por barras /
    //Se guardan en la posicion "i" de cada vector las variables correspondientes recogidas del html troceado
    name[i] = htmlContent[0];
    falseState[i] = htmlContent[1];
    trueState[i] = htmlContent[2];
    refreshTime[i] = parseInt(htmlContent[3]);
    falseStyle[i] = this.getElementsByTagName('span')[0].style.color;
    trueStyle[i] = this.getElementsByTagName('span')[1].style.color;
    //Si el texto de la variable esta mal introducido, se indica el error
    if (typeof name[i] != 'string') { text = 'Wrong format!'; }
    //Se le asigna un ID a cada elemento
    this.id = 'intar-bool' + i;
    variableId[i] = this.id;
    //Si no hay error, se manda la peticion
    if (text != 'Wrong format') {
      ajaxBool(name[i], falseState[i], trueState[i], falseStyle[i], trueStyle[i], refreshTime[i], variableId[i]);
    }
    //En caso de error, se imprime el texto en pantalla
    else { document.getElementById(variableId[i]).innerHTML = text; }
    i++;
  });
}

//Funcion para realizar la peticion ajax de los datos de tipo booleano
function ajaxBool(name, falseState, trueState, falseStyle, trueStyle, refreshTime, variableId) {
  $.ajax({
    crossOrigin: true,
    crossDomain: true,
    url: domain + "/cgi-bin/jgetvar.cgi?name=" + name, //Se realiza la consulta al registro correspondiente
    data: { get_param: 'value' },
    cache: false,
    dataType: 'json',
    //En caso de exito, se guarda el valor y se muestra
    success: function (data) {
      htmlBool(data, falseState, trueState, falseStyle, trueStyle, variableId);
      setTimeout(function () {
        ajaxBool(name, falseState, trueState, falseStyle, trueStyle, refreshTime, variableId);
      }, refreshTime * 1000);
    },
    //En caso de fallo, se muestra un texto de error
    error: function () { document.getElementById(variableId).innerHTML = 'Wrong register!'; }
  });
}

//Funcion para mostrar en el html el dato segun si es "true" o "false"
function htmlBool(data, falseState, trueState, falseStyle, trueStyle, variableId) {
  var boolValue = data[0].value;
  //Si el valor es 0, se cargan los valores del estado "false"
  if (boolValue == 0) {
    document.getElementById(variableId).innerHTML = falseState;
    document.getElementById(variableId).style.color = `${falseStyle}`;
  }
  //Si el valor es 1, se cargan los valores del estado "true"
  else {
    document.getElementById(variableId).innerHTML = trueState;
    document.getElementById(variableId).style.color = `${trueStyle}`;
  }
}

/*------------------------------------------INTAR SELECT------------------------------------------*/
/*Funcion para la asignación de nombres alojados en un array a variables*/
function intarSelect() {
  /*La sintaxis de la clase debe ser la siguiente:
  <span class='intar-select'>Nombre/Array</span>
  La barra "/" es el separador clave de la funcion. No añadir mas de las que hay.
  Cada elemento representa:
  Nombre: Nombre del registro al que se va a acceder. Debe ser texto sin espacios
  Array: variable tipo object array que contenga los nombres de configuracion
  ¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡Ejemplo para copiar y pegar!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  var AO_conf = ["Not used", "Fan C1", "Fan C2", "Fan C3", "Fan C4", "Fan C5", "Pump 1 primary group", "Pump 2 primary group"];
  <span class="intar_select">SONDAS[1]/AO_conf/refreshTime</span>*/
  //Se crean las variables que se van a usar en la funcion
  var length = $('.intar-select').length;							//Guarda el numero de etiquetas con la clase intar-select
  var name = [];													//Guarda el nombre del registro a evaluar
  var variable = [];												//Guarda el valor que corresponde al nombre de esa variable
  var variableId = [];											//Guarda el id de la variable evaluada
  var refreshTime = [];
  var i = 0;
  //Para cada elemento con la clase 'intar-select' se realizan las acciones pertinentes.
  $('.intar-select').each(function () {
    var text = '';														//Variable para contener temporalmente el texto en caso de error
    var htmlContent = this.textContent.split("/");						//Se separa el nombre del registro y el nombre del string y se almacenan
    name[i] = htmlContent[0];
    variable[i] = htmlContent[1];
    refreshTime[i] = parseInt(htmlContent[2]);
    //Se comprueba que el formato introducido sea el correcto
    if (typeof name[i] !== 'string' || typeof variable[i] !== 'object') { text = 'Wrong format!!'; }
    //Se asigna una ID a cada elemento
    this.id = '.intar-select' + i;
    variableId[i] = this.id;
    //Si esta bien la sintaxis, se realiza la peticion ajax
    if (text != 'Wrong format!') { ajaxSelect(name[i], variable[i], variableId[i], refreshTime[i]); }
    //Si la sintaxis esta mal, le asigna el texto de error
    else { document.getElementById(variableId[i]).innerHTML = text; }
    i++;
  });
}

function ajaxSelect(name, variable, variableId, refreshTime) {
  $.ajax({
    crossOrigin: true,
    crossDomain: true,
    url: domain + "/cgi-bin/jgetvar.cgi?name=" + name, //Se realiza la consulta al registro correspondiente
    data: { get_param: 'value' },
    cache: false,
    dataType: 'json',
    //En caso de exito, se guarda el valor y se muestra
    success: function (data) {
      document.getElementById(variableId).innerHTML = window[variable][data[0].value];	//Extrae el valor y le asigna el nombre que obtenga del array
      setTimeout(function () {
        ajaxSelect(name, variable, variableId, refreshTime);
      }, refreshTime * 1000);
    },
    //En caso de fallo, se muestra un texto de error
    error: function () { document.getElementById(id).innerHTML = 'Wrong register!'; }
  });
}

/*------------------------------------------INTAR DECIMAL------------------------------------------*/
/*Funcion para la lectura de variables de tipo numerico con o sin decimales*/
function intarDecimal() {
  /*La sintaxis de la clase debe ser la siguiente:
  <span class='intar-decimal'>Nombre/Divisor/Offset/Decimales/Tiempo</span>
  La barra "/" es el separador clave de la funcion. No añadir mas de las que hay.
  Cada elemento representa:
  Nombre: Nombre del registro al que se va a acceder. Debe ser texto sin espacios
  Divisor: Numero por el que se va a dividir el valor obtenido. Debe ser un numero
  Offset: Numero que se va a sumar al valor obtenido. Debe ser un numero
  Decimales: Numero de decimales que se van a mostrar. Debe ser un numero
  Tiempo: Tiempo para realizar la siguiente consulta
  ¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡Ejemplo para copiar y pegar!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  <span class="intar-decimal">Pb_P_evap1/10/0/1/10</span>*/
  //Se crean las variables que se van a utilizar en la funcion
  var length = $('.intar-decimal').length;						//Guarda el numero de etiquetas con la clase 'intar-decimal'
  var name = [];													//Guarda el nombre de la variable que se va a consultar
  var divisor = [];												//Guarda el divisor de cada variabl
  var offset = [];												//Guarda el offset que se le va a añadir o sustraer al valor obtenido
  var decimals = [];												//Guarda el numero de decimales que se van a mostrar en cada variable
  var refreshTime = [];											//Guarda el tiempo de refresco de las variables
  var variableId = [];											//Guarda la id de cada variable evaluada
  var i = 0;
  //Para cada elemento con la clase 'intar_decimal' se realizan las acciones pertinentes
  $('.intar-decimal').each(function () {
    var text = '';												//Variable temporal que va a contener el texto en caso de error
    var htmlContent = this.textContent.split("/");   			//Se trocea el texto que hay en el html separandolo por /
    //Se guardan en los vectores correspondientes los parametros de la variable a consultar
    name[i] = htmlContent[0];
    divisor[i] = parseInt(htmlContent[1]);
    offset[i] = parseInt(htmlContent[2]);
    decimals[i] = parseInt(htmlContent[3]);
    refreshTime[i] = parseInt(htmlContent[4]);
    //Se comprueba que los valores numericos introducidos son correctos
    for (var j = 1; j < htmlContent.length; j++) {
      if (isNaN(htmlContent[j])) {
        text = 'Not a number!';
        break;
      }
    }
    //Se le asigna un ID a cada elemento 
    this.id = 'intar-dec' + i;
    variableId[i] = this.id;
    //Se realiza la peticion ajax si esta bien la sintaxis
    if (text != 'Not a number!') { ajaxDecimal(name[i], divisor[i], offset[i], decimals[i], refreshTime[i], variableId[i]); }
    //Si la sintaxis esta mal, le asigna el texto de error
    else { document.getElementById(variableId[i]).innerHTML = text; }
    i++;
  });
}

//Funcion de la peticion ajax de los valores enteros
function ajaxDecimal(name, divisor, offset, decimals, refreshTime, variableId) {
  $.ajax({
    crossOrigin: true,
    crossDomain: true,
    url: domain + "/cgi-bin/jgetvar.cgi?name=" + name, //Se realiza la consulta al registro correspondiente
    data: { get_param: 'value' },
    cache: false,
    dataType: 'json',
    //En caso de exito, se guarda el valor y se muestra
    success: function (data) {
      htmlDecimal(data, divisor, offset, decimals, variableId);
      setTimeout(function () {
        ajaxDecimal(name, divisor, offset, decimals, refreshTime, variableId);
      }, refreshTime * 1000);
    },
    //En caso de fallo, se muestra un texto de error
    error: function () { document.getElementById(variableId).innerHTML = 'Wrong register!'; }
  });
}

//Funcion para convertir el dato segun sus caracteristicas
function htmlDecimal(data, divisor, offset, decimals, variableId) {
  var value = data[0].value;
  var text = parseFloat(Math.round(value + offset) / divisor).toFixed(decimals);
  document.getElementById(variableId).innerHTML = text;
}

/*------------------------------------------INTAR DISPLAY------------------------------------------*/
/*Funcion para leer variables booleanas y sustituir por una imagen*/
function intarDisplay() {
  /*Esta funcion evalua todos las etiquetas con la clase "intar-display" para representar booleanos con imagenes
  La sintaxis de la clase debe ser la siguiente:
  <span class="intar-display">ONOFF_GEN|img_0|img_1|Ancho|Alto|10</span>
  La barra "/" es el separador clave de la funcion. No añadir mas de las que hay.
  Cada elemento representa:
  Nombre: Nombre del registro al que se va a acceder. Debe ser texto sin espacios.
  img_0: Imagen para representar si el valor es 0.
  img_1: Imagen para representar si el valor es 1.
  Ancho: Tamaño del ancho de la imagen (en pixeles).
  Alto: Tamaño del alto de la imagen (en pixeles).
  Tiempo: Tiempo para realizar la siguiente consulta
  ¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡Ejemplo para copiar y pegar!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  <span class="intar-display">ONOFF_GEN/img-unit-off.png/img-unit-on.png/70/24/5</span>
  */
  //Se crean las variables que se van a utilizar en la funcion
  var length = $('.intar-display').length;								//Guarda el numero de etiquetas con la clase intar-bool			
  var name = [];															//Guarda el nombre de cada registro que tiene que evaluar
  var falseUrl = [];														//Guarda el nombre que se va a mostrar en caso de estar a 0
  var trueUrl = [];														//Guarda el nombre que se va a mostrar en caso de estar a 1
  var width = [];															//Guarda el ancho de la imagen a insertar
  var height = [];														//Guarda el alto de la imagen a insertar
  var refreshTime = [];													//Guarda el tiempo de refresco de cada variable
  var variableId = [];													//Guarda el nombre de la id que se el va a asignar a cada etiqueta
  var i = 0;																//Variable que sirve como puntero para los vectores
  //Para cada elemento con la clase 'intar-display', se realiza lo siguiente
  $('.intar-display').each(function () {
    var text = "";
    var htmlContent = this.textContent.split("|");					//Se trocea el texto que hay en el html, separando por barras "/"
    //Se guardan en la posicion "i" de cada vector las variables correspondientes recogidas del html troceado
    name[i] = htmlContent[0];
    falseUrl[i] = htmlContent[1];
    trueUrl[i] = htmlContent[2];
    width[i] = parseInt(htmlContent[3]);
    height[i] = parseInt(htmlContent[4]);
    refreshTime[i] = parseInt(htmlContent[5]);
    //Si el texto de la variable esta mal introducido, se indica el error
    if (typeof name[i] != 'string') { text = 'Wrong format!'; }
    //Se le asigna un ID a cada elemento
    this.id = 'intar-display' + i;
    variableId[i] = this.id;
    //Si no hay error, se manda la peticion
    if (text != 'Wrong format') {
      ajaxDisplay(name[i], falseUrl[i], trueUrl[i], width[i], height[i], refreshTime[i], variableId[i]);
    }
    //En caso de error, se imprime el texto en pantalla
    else { document.getElementById(variableId[i]).innerHTML = text; }
    i++;
  });
}

//Funcion para realizar la peticion ajax de los datos de tipo booleano
function ajaxDisplay(name, falseUrl, trueUrl, width, height, refreshTime, variableId) {
  $.ajax({
    crossOrigin: true,
    crossDomain: true,
    url: domain + "/cgi-bin/jgetvar.cgi?name=" + name, //Se realiza la consulta al registro correspondiente
    data: { get_param: 'value' },
    cache: false,
    dataType: 'json',
    //En caso de exito, se guarda el valor y se muestra
    success: function (data) {
      htmlDisplay(data, falseUrl, trueUrl, width, height, variableId);
      setTimeout(function () {
        ajaxDisplay(name, falseUrl, trueUrl, width, height, refreshTime, variableId);
      }, refreshTime * 1000);
    },
    //En caso de fallo, se muestra un texto de error
    error: function () { document.getElementById(variableId).innerHTML = 'Wrong register!'; }
  });
}

//Funcion para mostrar en el html el dato segun si es "true" o "false"
function htmlDisplay(data, falseUrl, trueUrl, width, height, variableId) {
  //Se guarda el valor devuelto por ajax
  var displayValue = data[0].value;
  //Se evalua el valor devuelto y, en funcion de este, se muestra una imagen u otra
  switch (displayValue) {
    case 0:
      //Se inserta la imagen en el html
      if (falseUrl === '') {
        document.getElementById(variableId).innerHTML = "";
      } else {
        document.getElementById(variableId).innerHTML = "<img src=" + falseUrl + " width=" + width + " height=" + height + ">";
      }
      break;
    case 1:
      //Se inserta la imagen en el html
      if (trueUrl === '') {
        document.getElementById(variableId).innerHTML = "";
      } else {
        document.getElementById(variableId).innerHTML = "<img src=" + trueUrl + " width=" + width + " height=" + height + ">";
      }
      break;
    default:
      //Se inserta la imagen en el html
      if (trueUrl === '') {
        document.getElementById(variableId).innerHTML = "";
      } else {
        document.getElementById(variableId).innerHTML = "<img src=" + trueUrl + " width=" + width + " height=" + height + ">";
      }
      break;
  }
}

/*------------------------------------------INTAR DISPLAY HTML------------------------------------------*/
/*Funcion para leer variables booleanas y sustituir por código html*/
function intarDisplayICON() {
  /*Esta funcion evalua todos las etiquetas con la clase "intar-display" para representar booleanos con imagenes
  La sintaxis de la clase debe ser la siguiente:
  <span class="intar-display">ONOFF_GEN/html_0/html_1/10</span>
  La barra "/" es el separador clave de la funcion. No añadir mas de las que hay.
  Cada elemento representa:
  Nombre: Nombre del registro al que se va a acceder. Debe ser texto sin espacios.
  html_0: Imagen para representar si el valor es 0.
  html_1: Imagen para representar si el valor es 1.
  Tiempo: Tiempo para realizar la siguiente consulta
  ¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡Ejemplo para copiar y pegar!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  <span class="intar-display">ONOFF_GEN/img-unit-off.png/img-unit-on.png/70/24/5</span>
  */
  //Se crean las variables que se van a utilizar en la funcion
  var length = $('.intar-icon').length;							//Guarda el numero de etiquetas con la clase intar-bool			
  var name = [];															//Guarda el nombre de cada registro que tiene que evaluar
  var falseHTML = [];														//Guarda el HTML que se va a mostrar en caso de estar a 0
  var trueHTML = [];														//Guarda el HTML que se va a mostrar en caso de estar a 1
  var refreshTime = [];													//Guarda el tiempo de refresco de cada variable
  var variableId = [];													//Guarda el nombre de la id que se el va a asignar a cada etiqueta
  var i = 0;																//Variable que sirve como puntero para los vectores
  //Para cada elemento con la clase 'intar-display', se realiza lo siguiente
  $('.intar-icon').each(function () {
    var text = "";
    var htmlContent = this.textContent.split("/");					//Se trocea el texto que hay en el html, separando por barras "/"
    //Se guardan en la posicion "i" de cada vector las variables correspondientes recogidas del html troceado
    name[i] = htmlContent[0];
    falseHTML[i] = htmlContent[1];
    trueHTML[i] = htmlContent[2];
    refreshTime[i] = parseInt(htmlContent[3]);
    //Si el texto de la variable esta mal introducido, se indica el error
    if (typeof name[i] != 'string') { text = 'Wrong format!'; }
    //Se le asigna un ID a cada elemento
    this.id = 'intar-icon' + i;
    variableId[i] = this.id;
    //Si no hay error, se manda la peticion
    if (text != 'Wrong format') { ajaxDisplayICON(name[i], falseHTML[i], trueHTML[i], refreshTime[i], variableId[i]); }
    //En caso de error, se imprime el texto en pantalla
    else { document.getElementById(variableId[i]).innerHTML = text; }
    i++;
  });
}

//Funcion para realizar la peticion ajax de los datos de tipo booleano
function ajaxDisplayICON(name, falseHTML, trueHTML, refreshTime, variableId) {
  $.ajax({
    crossOrigin: true,
    crossDomain: true,
    url: domain + "/cgi-bin/jgetvar.cgi?name=" + name, //Se realiza la consulta al registro correspondiente
    data: { get_param: 'value' },
    cache: false,
    dataType: 'json',
    //En caso de exito, se guarda el valor y se muestra
    success: function (data) {
      htmlDisplayICON(name, data, falseHTML, trueHTML, variableId);
      setTimeout(function () {
        ajaxDisplayICON(name, falseHTML, trueHTML, refreshTime, variableId);
      }, refreshTime * 1000);
    },
    //En caso de fallo, se muestra un texto de error
    error: function () { document.getElementById(variableId).innerHTML = 'Wrong register!'; }
  });
}

//Funcion para mostrar en el html el dato segun si es "true" o "false"
function htmlDisplayICON(name, data, falseHTML, trueHTML, variableId) {
  //Se guarda el valor devuelto por ajax
  var displayValue = data[0].value;
  //Se evalua el valor devuelto y, en funcion de este, se muestra una imagen u otra
  switch (displayValue) {
    case 0:
      //Se inserta la imagen en el html
      document.getElementById(variableId).style.display = "none";
      document.getElementById(variableId).innerHTML = "<" + falseHTML + "/>";
      if (name === "ALARMA") document.getElementById("alarm").style.color = "white";
      break;
    case 1:
      //Se inserta la imagen en el html
      if (name === "ALARMA") document.getElementById("alarm").style.color = "red";
      document.getElementById(variableId).innerHTML = "<" + trueHTML + "/>";
      document.getElementById(variableId).style.display = "";
      break;
  }
}