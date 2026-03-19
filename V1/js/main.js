var caudalVariable, numeroCircuitos, EN_bomba1_P, EN_bomba2_P, EN_bomba1_S, EN_bomba2_S, EN_inver1_S, EN_inver2_S, EN_freecooling, EN_bomba1_R, EN_bomba2_R;

var domain = "";
//var domain = "http://172.17.123.250"

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
    success: function (data) { valor = data[0].value; },
    error: function () { valor = null; }
  });
  return valor;
}

$(document).ready(function () {
  $.ajax({
    crossOrigin: true,
    crossDomain: true,
    url: domain + "/cgi-bin/jgetvar.cgi?name=ONOFF_GEN",
    data: { get_param: 'value' },
    cache: false,
    dataType: 'json',
    timeout: 5000,
    success: function (data) {
      caudalVariable = data[0].value;
      main_table(true);
    },
    error: function () {
      console.warn("No se pudieron obtener los datos iniciales o se agotó el tiempo de espera.");
      main_table(false);
    }
  });
});

// --- FUNCIONES DE AYUDA ---
function getSensorHtml(hasData, sensorTag) {
  if (hasData) {
    return `<span class='intar-decimal'>${sensorTag}</span>`;
  }
  let displayName = sensorTag.split(/[\/|]/)[0];
  return `<span class='scada-error'>${displayName}</span>`;
}

function getCounterHtml(hasData, counterTag) {
  if (hasData) {
    return `<span class='intar-decimal'>${counterTag}</span>`;
  }
  let displayName = counterTag.split(/[\/|]/)[0];
  return `<span class='scada-error'>${displayName}</span>`;
}

function getDisplayHtml(hasData, displayTag) {
  if (hasData) {
    return `<span class='intar-display'>${displayTag}</span>`;
  }
  let displayName = displayTag.split(/[\/|]/)[0];
  return `<span class='scada-error'>${displayName}</span>`;
}

// --- FUNCIONES DE ZOOM Y PANTALLA COMPLETA ---
let currentZoom = 1;

function cambiarZoom(delta) {
  currentZoom += delta;
  if (currentZoom < 0.3) currentZoom = 0.3;
  if (currentZoom > 3) currentZoom = 3;
  aplicarZoom();
}

function resetearZoom() {
  currentZoom = 1;
  aplicarZoom();
}

function aplicarZoom() {
  let grid = document.getElementById('Grid-Container-Zoom');
  if (grid) {
    grid.style.zoom = currentZoom;
  }
}

function alternarPantallaCompleta() {
  let elem = document.getElementById('Scada-App-Root');
  if (!document.fullscreenElement) {
    elem.requestFullscreen().catch(err => {
      alert(`Error al intentar activar pantalla completa: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}

// --- MENÚ FLOTANTE ---
function toggleFabMenu() {
  const menu = document.getElementById('fab-menu-items');
  const btn = document.getElementById('fab-main-btn');
  if (menu.style.display === 'none' || menu.style.display === '') {
    menu.style.display = 'flex';
    btn.innerHTML = '✖';
  } else {
    menu.style.display = 'none';
    btn.innerHTML = '+';
  }
}

// --- LÓGICA DE EDICIÓN ---
function toggleModoEdicion(activar) {
  if (activar) {
    $('#Grid-Container-Zoom').addClass('edit-mode-active');

    // 1. DRAG — referenciado a la imagen, no al padre genérico
    $('.var-editable').draggable({
      start: function (event, ui) {
        $(this).css('z-index', 100);
      },
      stop: function (event, ui) {
        $(this).css('z-index', '');

        // FIX: usar la imagen como referencia para los % → independiente de resolución
        var img = document.getElementById('scada-img-bg');
        var newLeftPercent = (ui.position.left / img.offsetWidth) * 100;
        var newTopPercent  = (ui.position.top  / img.offsetHeight) * 100;

        ui.helper.css({
          left: newLeftPercent.toFixed(2) + '%',
          top:  newTopPercent.toFixed(2)  + '%'
        });
      }
    });

    // 2. RESIZE — referenciado a la imagen
    $('.var-editable').resizable({
      containment: "parent",
      handles: "se",
      resize: function (event, ui) {
        var newHeight = ui.size.height;
        $(this).css('font-size', (newHeight * 0.5) + 'px');
      },
      stop: function (event, ui) {
        // FIX: usar la imagen como referencia para los % → independiente de resolución
        var img = document.getElementById('scada-img-bg');
        var newWidthPercent  = (ui.size.width  / img.offsetWidth)  * 100;
        var newHeightPercent = (ui.size.height / img.offsetHeight) * 100;

        var currentFontSizePx = parseFloat($(this).css('font-size'));
        var fontSizeVh = (currentFontSizePx / window.innerHeight) * 100;

        ui.helper.css({
          width:    newWidthPercent.toFixed(2)  + '%',
          height:   newHeightPercent.toFixed(2) + '%',
          fontSize: fontSizeVh.toFixed(3) + 'vh'
        });
      }
    });

  } else {
    $('#Grid-Container-Zoom').removeClass('edit-mode-active');
    if ($('.var-editable').hasClass('ui-draggable')) {
      $('.var-editable').draggable("destroy").resizable("destroy");
    }
    $('.var-editable').css({ cursor: '' });
  }
}

let isEditMode = false;
let posicionesAntes = null;

function toggleEditState() {
  isEditMode = !isEditMode;

  if (isEditMode) {
    resetearZoom();
    // Snapshot del estado ANTES de editar (para poder cancelar)
    posicionesAntes = {};
    $('.var-editable').each(function () {
      let id = $(this).attr('data-id');
      if (id) {
        posicionesAntes[id] = {
          top:      $(this)[0].style.top,
          left:     $(this)[0].style.left,
          width:    $(this)[0].style.width,
          height:   $(this)[0].style.height,
          fontSize: $(this)[0].style.fontSize
        };
      }
    });
  }

  toggleModoEdicion(isEditMode);

  let btn = document.getElementById('btn-editar');
  let btnCancelar = document.getElementById('btn-cancelar-editar');
  if (isEditMode) {
    btn.innerHTML = "Guardar";
    btn.classList.add('editing');
    if (btnCancelar) btnCancelar.style.display = 'block';
  } else {
    guardarPosiciones();
    btn.innerHTML = "Editar";
    btn.classList.remove('editing');
    if (btnCancelar) btnCancelar.style.display = 'none';
    posicionesAntes = null;
  }
}

function cancelarEdicion() {
  if (!isEditMode) return;
  isEditMode = false;

  // Restaurar posiciones del snapshot previo a la edición
  if (posicionesAntes) {
    $('.var-editable').each(function () {
      let id = $(this).attr('data-id');
      if (id && posicionesAntes[id]) {
        $(this).css({
          top:      posicionesAntes[id].top,
          left:     posicionesAntes[id].left,
          width:    posicionesAntes[id].width    || '',
          height:   posicionesAntes[id].height   || '',
          fontSize: posicionesAntes[id].fontSize || ''
        });
      }
    });
    posicionesAntes = null;
  }

  toggleModoEdicion(false);

  let btn = document.getElementById('btn-editar');
  btn.innerHTML = "Editar";
  btn.classList.remove('editing');

  let btnCancelar = document.getElementById('btn-cancelar-editar');
  if (btnCancelar) btnCancelar.style.display = 'none';
}

function guardarPosiciones() {
  let posiciones = {};
  $('.var-editable').each(function () {
    let id = $(this).attr('data-id');
    if (id) {
      // Los valores ya están en % gracias al fix del drag/resize
      posiciones[id] = {
        top:      this.style.top      || '',
        left:     this.style.left     || '',
        width:    this.style.width    || '',
        height:   this.style.height   || '',
        fontSize: this.style.fontSize || ''
      };
    }
  });
  localStorage.setItem('scada_layout_config', JSON.stringify(posiciones));
}

function aplicarPosicionesGuardadas() {
  let layoutGuardado = localStorage.getItem('scada_layout_config');
  if (!layoutGuardado) return;

  let posiciones = JSON.parse(layoutGuardado);

  // FIX: esperar a que la imagen esté cargada para tener offsetWidth/Height correctos
  var img = document.getElementById('scada-img-bg');

  function aplicar() {
    $('.var-editable').each(function () {
      let id = $(this).attr('data-id');
      if (!id || !posiciones[id]) return;

      let p = posiciones[id];

      // FIX: migrar valores en px a % por si hay layouts guardados con versiones anteriores
      function toPercent(val, base) {
        if (!val || val === '') return '';
        if (val.endsWith('%')) return val;            // ya es %, se aplica directo
        return ((parseFloat(val) / base) * 100).toFixed(2) + '%'; // convierte px → %
      }

      $(this).css({
        top:      toPercent(p.top,    img.offsetHeight),
        left:     toPercent(p.left,   img.offsetWidth),
        width:    p.width    ? toPercent(p.width,  img.offsetWidth)  : '',
        height:   p.height   ? toPercent(p.height, img.offsetHeight) : '',
        fontSize: p.fontSize || ''
      });
    });
  }

  // Si la imagen ya está cargada aplicar directo, si no esperar al evento load
  if (img.complete && img.naturalWidth > 0) {
    aplicar();
  } else {
    img.addEventListener('load', aplicar, { once: true });
  }
}

// --- FUNCIÓN PARA NAVEGAR ARRASTRANDO EL FONDO ---
function habilitarArrastreFondo() {
  const viewport = document.getElementById('Scada-Viewport');
  if (!viewport) return;

  let isDown = false;
  let startX, startY, scrollLeft, scrollTop;

  viewport.addEventListener('mousedown', (e) => {
    if (e.target.closest('.var-editable') || e.target.closest('.ui-resizable-handle')) return;

    e.preventDefault();
    isDown = true;
    viewport.classList.add('dragging');

    startX = e.pageX - viewport.offsetLeft;
    startY = e.pageY - viewport.offsetTop;
    scrollLeft = viewport.scrollLeft;
    scrollTop  = viewport.scrollTop;
  });

  window.addEventListener('mouseup', () => {
    isDown = false;
    if (viewport) viewport.classList.remove('dragging');
  });

  viewport.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();

    const x = e.pageX - viewport.offsetLeft;
    const y = e.pageY - viewport.offsetTop;

    viewport.scrollLeft = scrollLeft - (x - startX);
    viewport.scrollTop  = scrollTop  - (y - startY);
  });
}

// --- CONSTRUCCIÓN DE LA VISTA ---
function main_table(hasData) {
  var html = `
    <style>
      #Scada-App-Root {
        position: relative;
        width: 100%;
        height: calc(100vh - 105px);
        background-color: #f4f6f8;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
      }

      .fab-container {
        position: absolute;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
        gap: 10px;
      }

      .fab-main {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #1a82ba;
        color: white;
        border: none;
        font-size: 24px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: transform 0.2s, background-color 0.2s;
      }
      .fab-main:hover { transform: scale(1.05); background-color: #12638f; }

      .fab-menu {
        display: none;
        flex-direction: column;
        gap: 8px;
        background: rgba(255, 255, 255, 0.95);
        padding: 8px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        border: 1px solid #e5e7eb;
      }

      .fab-menu button {
        background: #f3f4f6;
        border: 1px solid #d1d5db;
        color: #374151;
        padding: 8px 15px;
        font-weight: bold;
        font-size: 12px;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
        width: 100%;
        text-align: center;
      }
      .fab-menu button:hover { background: #e5e7eb; }

      #btn-editar.editing { background: #000; color: #fff; border-color: #000; }
      #btn-cancelar-editar { background: #f3f4f6; color: #c0392b; border-color: #c0392b; display: none; }
      #btn-cancelar-editar:hover { background: #fdecea; }

      #Scada-Viewport {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: auto;
        cursor: grab;
        text-align: center;
        white-space: nowrap;
      }

      #Scada-Viewport::before {
        content: '';
        display: inline-block;
        height: 100%;
        vertical-align: middle;
      }

      #Scada-Viewport.dragging { cursor: grabbing; }

      /* FIX: line-height:0 elimina el espacio fantasma bajo la imagen en inline-block */
      #Grid-Container-Zoom {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        white-space: normal;
        line-height: 0;
      }

      /* FIX: display:block en la imagen para que el contenedor tenga exactamente su tamaño */
      #scada-img-bg {
        height: calc(100vh - 105px);
        width: auto;
        display: block;
        pointer-events: none;
      }

      .scada-badge {
        background: transparent;
        border: 1px solid transparent;
        padding: 4px 8px;
        border-radius: 3px;
        font-family: 'Arial', sans-serif;
        font-size: 11px;
        font-weight: bold;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        box-sizing: border-box;
        overflow: hidden;
      }
      .scada-badge:hover { z-index: 50; }

      .scada-badge .intar-display {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .scada-badge:not([style*="width"]) .intar-display {
        width: 40px;
        height: 40px;
      }

      .scada-badge .intar-display img {
        width: 100% !important;
        height: 100% !important;
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }

      .intar-decimal, .intar-display {
        color: #000000;
        text-shadow: 1px 1px 3px rgba(255, 255, 255, 0.9);
      }

      .scada-error {
        background: #ffffff;
        color: #bd0202;
        padding: 2px 6px;
        border-radius: 2px;
        text-shadow: none;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .edit-mode-active .scada-badge {
        border: 1px dashed #666 !important;
        background: rgba(200, 200, 200, 0.2);
        min-width: 30px;
        min-height: 20px;
        position: relative;
      }

      .edit-mode-active .scada-badge > .intar-decimal,
      .edit-mode-active .scada-badge > .intar-display,
      .edit-mode-active .scada-badge > .scada-error {
        display: inline-flex !important;
        opacity: 1 !important;
        z-index: 2 !important;
        position: relative;
      }

      .edit-mode-active .scada-badge::before {
        content: attr(data-id);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: rgba(0, 0, 0, 0.25);
        font-weight: bold;
        font-family: monospace;
        font-size: clamp(11px, 1.2vw, 16px);
        pointer-events: none;
        z-index: 1 !important;
        white-space: nowrap;
      }

      .edit-mode-active .scada-badge::after { display: none !important; }

      .ui-resizable-handle {
        position: absolute !important;
        display: block !important;
        font-size: 0.1px;
        touch-action: none;
        z-index: 100 !important;
      }
      .ui-resizable-se {
        cursor: se-resize !important;
        width: 12px !important;
        height: 12px !important;
        right: 0px !important;
        bottom: 0px !important;
        background: #000 !important;
        opacity: 0.4 !important;
      }
      .edit-mode-active .ui-resizable-se:hover { opacity: 0.8 !important; }
    </style>

    <div id="Scada-App-Root">

      <div class="fab-container">
        <button id="fab-main-btn" class="fab-main" onclick="toggleFabMenu()" title="Opciones">+</button>
        <div id="fab-menu-items" class="fab-menu">
          <button id="btn-editar" onclick="toggleEditState()">Editar</button>
          <button id="btn-cancelar-editar" onclick="cancelarEdicion()">Cancelar</button>
          <hr style="margin: 4px 0; border-color: #ccc;">
          <button onclick="cambiarZoom(0.1)" title="Acercar">🔍 +</button>
          <button onclick="cambiarZoom(-0.1)" title="Alejar">🔍 -</button>
          <button onclick="resetearZoom()" title="Tamaño 1:1">1:1</button>
          <button onclick="alternarPantallaCompleta()" title="Pantalla Completa">⛶</button>
        </div>
      </div>

      <div id="Scada-Viewport">
        <div id="Grid-Container-Zoom">
          <img id="scada-img-bg" src="layout01.png" alt="Mapa de la planta">

          <div class="var-editable scada-badge" data-id="Pb_T_S1" style="position:absolute; top:6.2%; left:41%;">
            ${getSensorHtml(hasData, 'Pb_T_S1/10/0/1/5/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_T_S2" style="position:absolute; top:47%; left:40%;">
            ${getSensorHtml(hasData, 'Pb_T_S2/10/0/1/5/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_T_S3" style="position:absolute; top:35%; left:78%;">
            ${getSensorHtml(hasData, 'Pb_T_S3/10/0/1/5/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_T_S4" style="position:absolute; top:4%; left:41%;">
            ${getSensorHtml(hasData, 'Pb_T_S4/10/0/1/5/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_T_S5" style="position:absolute; top:35%; left:10%;">
            ${getSensorHtml(hasData, 'Pb_T_S5/10/0/1/5/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_T_S6" style="position:absolute; top:54.5%; left:27.5%;">
            ${getSensorHtml(hasData, 'Pb_T_S6/10/0/1/5/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_T_S7" style="position:absolute; top:11%; left:9%;">
            ${getSensorHtml(hasData, 'Pb_T_S7/10/0/1/5/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_T_S14" style="position:absolute; top:6.2%; left:71%;">
            ${getSensorHtml(hasData, 'Pb_T_S14/10/0/1/5/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_T_S15" style="position:absolute; top:8.9%; left:71%;">
            ${getSensorHtml(hasData, 'Pb_T_S15/10/0/1/5/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_T_S24" style="position:absolute; top:25%; left:92%;">
            ${getSensorHtml(hasData, 'Pb_T_S24/10/0/1/5/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_T_S24_2" style="position:absolute; top:61%; left:9.7%;">
            ${getSensorHtml(hasData, 'Pb_T_S24/10/0/1/5/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_T_S25" style="position:absolute; top:27%; left:92%;">
            ${getSensorHtml(hasData, 'Pb_T_S25/10/0/1/5/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_T_S26" style="position:absolute; top:59.2%; left:9.7%;">
            ${getSensorHtml(hasData, 'Pb_T_S26/10/0/1/5/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_T_S27" style="position:absolute; top:7.5%; left:89.5%;">
            ${getSensorHtml(hasData, 'Pb_T_S27/10/0/1/5/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_P_S16" style="position:absolute; top:55%; left:45.3%;">
            ${getSensorHtml(hasData, 'Pb_P_S16/10/0/1/5/bar')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_P_S17" style="position:absolute; top:38%; left:46%;">
            ${getSensorHtml(hasData, 'Pb_P_S17/10/0/1/5/bar')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_P_S21" style="position:absolute; top:53%; left:62.5%;">
            ${getSensorHtml(hasData, 'Pb_P_S21/10/0/1/5/bar')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_P_S22" style="position:absolute; top:67%; left:87.5%;">
            ${getSensorHtml(hasData, 'Pb_P_S22/10/0/1/5/bar')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_P_S23" style="position:absolute; top:54.5%; left:74%;">
            ${getSensorHtml(hasData, 'Pb_P_S23/10/0/1/5/bar')}
          </div>
          <div class="var-editable scada-badge" data-id="PAR_CONSIGNA_FRIO" style="position:absolute; top:8.8%; left:41%;">
            ${getSensorHtml(hasData, 'PAR_CONSIGNA_FRIO/10/0/1/5/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="PAR_CONSIGNA_FRIO_2" style="position:absolute; top:12%; left:71%;">
            ${getSensorHtml(hasData, 'PAR_CONSIGNA_FRIO/10/0/1/5/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="PAR_CONSIGNA_CALOR" style="position:absolute; top:29%; left:92%;">
            ${getSensorHtml(hasData, 'PAR_CONSIGNA_CALOR/10/0/1/5/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="PAR_CONSIGNA_CALOR_2" style="position:absolute; top:63%; left:10%;">
            ${getSensorHtml(hasData, 'PAR_CONSIGNA_CALOR/10/0/1/5/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="RL_BOMBAS_G1" style="position:absolute; top:40.5%; left:51%;">
            ${getDisplayHtml(hasData, 'RL_BOMBAS_G1|assets/img/stop.png|assets/img/play.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge" data-id="RL_BOMBAS_G3" style="position:absolute; top:37%; left:35.5%;">
            ${getDisplayHtml(hasData, 'RL_BOMBAS_G3|assets/img/stop.png|assets/img/play.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge" data-id="RL_BOMBAS_G4" style="position:absolute; top:43%; left:80%;">
            ${getDisplayHtml(hasData, 'RL_BOMBAS_G4|assets/img/stop.png|assets/img/play.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge" data-id="RL_BOMBAS_G5" style="position:absolute; top:56%; left:82.8%; transform: rotate(90deg);">
            ${getDisplayHtml(hasData, 'RL_BOMBAS_G5|assets/img/stop.png|assets/img/play.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge" data-id="RL_BOMBA_G6" style="position:absolute; top:23%; left:6.5%;">
            ${getDisplayHtml(hasData, 'RL_BOMBA_G6|assets/img/stop.png|assets/img/play.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge" data-id="RL_ENABLE_INTAR_BIG" style="position:absolute; top:20%; left:62%;">
            ${getDisplayHtml(hasData, 'RL_ENABLE_INTAR_BIG|assets/img/stop.png|assets/img/play.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge" data-id="RL_ENABLE_INTAR_SMALL" style="position:absolute; top:20%; left:34%;">
            ${getDisplayHtml(hasData, 'RL_ENABLE_INTAR_SMALL|assets/img/stop.png|assets/img/play.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge" data-id="RL_ENABLE_BDC_KEYTER" style="position:absolute; top:42%; left:90%;">
            ${getDisplayHtml(hasData, 'RL_ENABLE_BDC_KEYTER|assets/img/stop.png|assets/img/play.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge" data-id="RL_ELECT_HEATER_REC" style="position:absolute; top:42%; left:71.5%;">
            ${getDisplayHtml(hasData, 'RL_ELECT_HEATER_REC|assets/img/resistencia_OFF.png|assets/img/resistencia_ON.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge" data-id="ST_LITROS_C1" style="position:absolute; top:86.5%; left:45.2%;">
            ${getCounterHtml(hasData, 'ST_CAUDAL_PULSOS_1/10/0/1/5/lt')}
          </div>
          <div class="var-editable scada-badge" data-id="ST_LITROS_C2" style="position:absolute; top:83%; left:4.5%;">
            ${getCounterHtml(hasData, 'ST_CAUDAL_PULSOS_2/10/0/1/5/lt')}
          </div>
          <div class="var-editable scada-badge" data-id="ST_LITROS_C3" style="position:absolute; top:90%; left:45.2%;">
            ${getCounterHtml(hasData, 'ST_CAUDAL_PULSOS_3/10/0/1/5/lt')}
          </div>
          <div class="var-editable scada-badge" data-id="ST_LITROS_C4" style="position:absolute; top:18.5%; left:7%;">
            ${getCounterHtml(hasData, 'ST_CAUDAL_PULSOS_4/10/0/1/5/lt')}
          </div>
          <div class="var-editable scada-badge" data-id="ST_LITROS_C5" style="position:absolute; top:72.5%; left:15.5%;">
            ${getCounterHtml(hasData, 'ST_CAUDAL_PULSOS_5/10/0/1/5/lt')}
          </div>
          <div class="var-editable scada-badge" data-id="ST_LITROS_C6" style="position:absolute; top:82.5%; left:45.2%;">
            ${getCounterHtml(hasData, 'ST_CAUDAL_PULSOS_6/10/0/1/5/lt')}
          </div>
          <div class="var-editable scada-badge" data-id="RL_VALV_ACS" style="position:absolute; top:13%; left:15.7%;">
            ${getDisplayHtml(hasData, 'RL_VALV_ACS|assets/img/V3V_CERRADA_ABAJO.png|assets/img/V2V_ABIERTA.png|8|3|5')}
          </div>
          <div class="var-editable scada-badge" data-id="AO_V3V_REC" style="position:absolute; top:42%; left:61%;">
            ${getSensorHtml(hasData, 'AO_V3V_REC/10/0/1/5/%')}
          </div>
          <div class="var-editable scada-badge" data-id="RL_RECOVERY_MODE" style="position:absolute; top:44%; left:62.5%; transform: rotate(180deg)">
            ${getDisplayHtml(hasData, 'RL_RECOVERY_MODE|assets/img/V3V_CERRADA_ABAJO.png|assets/img/V3V_CERRADA_ABAJO.png|8|3|5')}
          </div>
          <div class="var-editable scada-badge" data-id="RL_VALV_BOILER" style="position:absolute; top:42.5%; left:15.2%;">
            ${getDisplayHtml(hasData, 'RL_VALV_BOILER|assets/img/V3V_CERRADA_ABAJO.png|assets/img/V3V_DERECHA_CERRADA.png|8|3|5')}
          </div>
          <div class="var-editable scada-badge" data-id="RELE_ALARMA" style="position:absolute; top:92%; left:80%;">
            ${getDisplayHtml(hasData, 'RELE_ALARMA|assets/img/alarma.png|assets/img/alarma-off.png|15|10|5')}
          </div>

        </div>
      </div>
    </div>`;

  let kiconexContainer = document.querySelector('#layoutSidenav_content main .container-fluid');
  let existingRoot = document.getElementById('Scada-App-Root');

  if (existingRoot) {
    existingRoot.outerHTML = html;
  } else if (kiconexContainer) {
    kiconexContainer.innerHTML = html;
  } else {
    document.body.insertAdjacentHTML('beforeend', html);
  }

  habilitarArrastreFondo();
  aplicarPosicionesGuardadas();
  load(hasData);
}

function load(hasData) {
  if (!hasData) {
    let loader = document.getElementById('main-load');
    if (loader) loader.style.display = "none";
    let scadaApp = document.getElementById('Scada-App-Root');
    if (scadaApp) scadaApp.style.display = "";
    return;
  }

  $.ajax({
    url: 'js/intarcon.js',
    dataType: 'script',
    crossDomain: true,
    timeout: 5000,
    success: function () {
      setTimeout(() => {
        let loader = document.getElementById('main-load');
        if (loader) loader.style.display = "none";
        let scadaApp = document.getElementById('Scada-App-Root');
        if (scadaApp) scadaApp.style.display = "";
      }, 2500);
    },
    error: function () {
      console.warn("Error cargando intarcon.js. Volviendo a pintar sin datos...");
      main_table(false);
    }
  });
}