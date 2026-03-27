// =============================================================================
//  main.js  —  MOTOR DEL SINÓPTICO  (archivo GENÉRICO, no editar por cliente)
//  Lee la configuración de js/config.js y construye la vista del sinóptico.
// =============================================================================

// --- VARIABLE DE DOMINIO: leída desde config ---
var domain = CLIENT_CONFIG.domain || "";

// --- PETICIÓN AJAX SÍNCRONA GENÉRICA ---
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

// --- ARRANQUE: comprueba conexión con el controlador ---
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
      main_table(true);
    },
    error: function () {
      console.warn("Sin conexión con el controlador. Mostrando vista sin datos.");
      main_table(false);
    }
  });
});

// =============================================================================
//  FUNCIONES DE AYUDA PARA GENERAR HTML DE BADGES
// =============================================================================

function getSensorHtml(hasData, tag) {
  if (hasData) return `<span class='intar-decimal'>${tag}</span>`;
  const nombre = tag.split(/[\/|]/)[0];
  return `<span class='scada-error'>${nombre}</span>`;
}

function getDisplayHtml(hasData, tag) {
  if (hasData) return `<span class='intar-display'>${tag}</span>`;
  const nombre = tag.split(/[\/|]/)[0];
  return `<span class='scada-error'>${nombre}</span>`;
}

function getCounterHtml(hasData, tag) {
  if (hasData) return `<span class='intar-decimal'>${tag}</span>`;
  const nombre = tag.split(/[\/|]/)[0];
  return `<span class='scada-error'>${nombre}</span>`;
}

// --- Genera el HTML de un badge a partir de su definición en config ---
function _badgeHtml(hasData, variable) {
  const { id, tipo, tag, top, left, extra } = variable;
  const transform = extra ? `transform: ${extra};` : '';

  let contenido = '';
  if (tipo === 'sensor')  contenido = getSensorHtml(hasData, tag);
  if (tipo === 'display') contenido = getDisplayHtml(hasData, tag);
  if (tipo === 'counter') contenido = getCounterHtml(hasData, tag);

  return `<div class="var-editable scada-badge" data-id="${id}"
               style="position:absolute; top:${top}; left:${left}; ${transform}">
            ${contenido}
          </div>`;
}

// =============================================================================
//  ZOOM Y PANTALLA COMPLETA
// =============================================================================

let currentZoom = 1;

function cambiarZoom(delta) {
  currentZoom = Math.min(3, Math.max(0.3, currentZoom + delta));
  aplicarZoom();
}

function resetearZoom() {
  currentZoom = 1;
  aplicarZoom();
}

function aplicarZoom() {
  const grid = document.getElementById('Grid-Container-Zoom');
  if (grid) grid.style.zoom = currentZoom;
}

function alternarPantallaCompleta() {
  const elem = document.getElementById('Scada-App-Root');
  if (!document.fullscreenElement) {
    elem.requestFullscreen().catch(err => alert(`Error pantalla completa: ${err.message}`));
  } else {
    document.exitFullscreen();
  }
}

// =============================================================================
//  MENÚ FLOTANTE (FAB)
// =============================================================================

function toggleFabMenu() {
  const menu = document.getElementById('fab-menu-items');
  const btn  = document.getElementById('fab-main-btn');
  const open = menu.style.display === 'flex';
  menu.style.display = open ? 'none' : 'flex';
  btn.innerHTML = open ? '+' : '✖';
}

// =============================================================================
//  MODO EDICIÓN
// =============================================================================

function toggleModoEdicion(activar) {
  if (activar) {
    $('#Grid-Container-Zoom').addClass('edit-mode-active');

    $('.var-editable').draggable({
      start: function (e, ui) { $(this).css('z-index', 100); },
      stop:  function (e, ui) {
        $(this).css('z-index', '');
        const pw = ui.helper.parent().width();
        const ph = ui.helper.parent().height();
        ui.helper.css({
          left: ((ui.position.left / pw) * 100).toFixed(2) + '%',
          top:  ((ui.position.top  / ph) * 100).toFixed(2) + '%',
        });
      }
    });

    $('.var-editable').resizable({
      containment: "parent",
      handles: "se",
      resize: function (e, ui) {
        $(this).css('font-size', (ui.size.height * 0.5) + 'px');
      },
      stop: function (e, ui) {
        const pw = ui.helper.parent().width();
        const ph = ui.helper.parent().height();
        const fsPx = parseFloat($(this).css('font-size'));
        ui.helper.css({
          width:    ((ui.size.width  / pw) * 100).toFixed(2) + '%',
          height:   ((ui.size.height / ph) * 100).toFixed(2) + '%',
          fontSize: ((fsPx / window.innerHeight) * 100).toFixed(3) + 'vh',
        });
      }
    });

  } else {
    $('#Grid-Container-Zoom').removeClass('edit-mode-active');
    if ($('.var-editable').hasClass('ui-draggable')) {
      $('.var-editable').draggable('destroy').resizable('destroy');
    }
    $('.var-editable').css({ cursor: '' });
  }
}

let isEditMode    = false;
let posicionesAntes = null;

function toggleEditState() {
  isEditMode = !isEditMode;

  if (isEditMode) {
    resetearZoom();
    posicionesAntes = {};
    $('.var-editable').each(function () {
      const id = $(this).attr('data-id');
      if (id) posicionesAntes[id] = {
        top: this.style.top, left: this.style.left,
        width: this.style.width, height: this.style.height,
        fontSize: this.style.fontSize,
      };
    });
  }

  toggleModoEdicion(isEditMode);

  const btn        = document.getElementById('btn-editar');
  const btnCancelar = document.getElementById('btn-cancelar-editar');

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

  if (posicionesAntes) {
    $('.var-editable').each(function () {
      const id = $(this).attr('data-id');
      if (id && posicionesAntes[id]) {
        $(this).css({
          top: posicionesAntes[id].top,   left: posicionesAntes[id].left,
          width: posicionesAntes[id].width || '',
          height: posicionesAntes[id].height || '',
          fontSize: posicionesAntes[id].fontSize || '',
        });
      }
    });
    posicionesAntes = null;
  }

  toggleModoEdicion(false);
  const btn = document.getElementById('btn-editar');
  btn.innerHTML = "Editar";
  btn.classList.remove('editing');
  const btnCancelar = document.getElementById('btn-cancelar-editar');
  if (btnCancelar) btnCancelar.style.display = 'none';
}

function guardarPosiciones() {
  const posiciones = {};
  $('.var-editable').each(function () {
    const id = $(this).attr('data-id');
    if (id) posiciones[id] = {
      top: this.style.top, left: this.style.left,
      width: this.style.width, height: this.style.height,
      fontSize: this.style.fontSize,
    };
  });
  localStorage.setItem('scada_layout_config', JSON.stringify(posiciones));
}

function aplicarPosicionesGuardadas() {
  const guardado = localStorage.getItem('scada_layout_config');
  if (!guardado) return;
  const posiciones = JSON.parse(guardado);
  $('.var-editable').each(function () {
    const id = $(this).attr('data-id');
    if (id && posiciones[id]) {
      $(this).css({
        top: posiciones[id].top,      left: posiciones[id].left,
        width: posiciones[id].width   || '',
        height: posiciones[id].height || '',
        fontSize: posiciones[id].fontSize || '',
      });
    }
  });
}

// =============================================================================
//  ARRASTRE DE FONDO
// =============================================================================

function habilitarArrastreFondo() {
  const viewport = document.getElementById('Scada-Viewport');
  if (!viewport) return;

  let isDown = false, startX, startY, scrollLeft, scrollTop;

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
    viewport.scrollLeft = scrollLeft - (e.pageX - viewport.offsetLeft - startX);
    viewport.scrollTop  = scrollTop  - (e.pageY - viewport.offsetTop  - startY);
  });
}

// =============================================================================
//  CONSTRUCCIÓN DEL SINÓPTICO
// =============================================================================

function main_table(hasData) {
  const cfg = CLIENT_CONFIG.sinaptico;

  // Genera todos los badges a partir de la config
  const badgesHtml = cfg.variables
    .map(v => _badgeHtml(hasData, v))
    .join('\n          ');

  const html = `
    <style>
      #Scada-App-Root {
        position: relative; width: 100%;
        height: calc(100vh - 105px);
        background-color: #f4f6f8;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        display: flex; justify-content: center; align-items: center;
        overflow: hidden;
      }
      .fab-container {
        position: absolute; bottom: 20px; right: 20px; z-index: 9999;
        display: flex; flex-direction: column-reverse; align-items: center; gap: 10px;
      }
      .fab-main {
        width: 50px; height: 50px; border-radius: 50%;
        background-color: #1a82ba; color: white; border: none; font-size: 24px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3); cursor: pointer;
        display: flex; justify-content: center; align-items: center;
        transition: transform 0.2s, background-color 0.2s;
      }
      .fab-main:hover { transform: scale(1.05); background-color: #12638f; }
      .fab-menu {
        display: none; flex-direction: column; gap: 8px;
        background: rgba(255,255,255,0.95); padding: 8px;
        border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        border: 1px solid #e5e7eb;
      }
      .fab-menu button {
        background: #f3f4f6; border: 1px solid #d1d5db; color: #374151;
        padding: 8px 15px; font-weight: bold; font-size: 12px;
        border-radius: 4px; cursor: pointer; transition: all 0.2s;
        width: 100%; text-align: center;
      }
      .fab-menu button:hover { background: #e5e7eb; }
      #btn-editar.editing { background: #000; color: #fff; border-color: #000; }
      #btn-cancelar-editar { background: #f3f4f6; color: #c0392b; border-color: #c0392b; display: none; }
      #btn-cancelar-editar:hover { background: #fdecea; }
      #Scada-Viewport {
        width: 100%; height: 100%; position: relative;
        overflow: auto; cursor: grab; text-align: center; white-space: nowrap;
      }
      #Scada-Viewport::before { content:''; display:inline-block; height:100%; vertical-align:middle; }
      #Scada-Viewport.dragging { cursor: grabbing; }
      #Grid-Container-Zoom { position: relative; display: inline-block; vertical-align: middle; white-space: normal; }
      #scada-img-bg { height: calc(100vh - 105px); width: auto; display: block; pointer-events: none; }
      .scada-badge {
        background: transparent; border: 1px solid transparent;
        padding: 4px 8px; border-radius: 3px;
        font-family: Arial, sans-serif; font-size: 11px; font-weight: bold;
        display: inline-flex; align-items: center; justify-content: center;
        text-align: center; box-sizing: border-box; overflow: hidden;
      }
      .scada-badge:hover { z-index: 50; }
      .scada-badge .intar-display { width:100%; height:100%; display:flex; align-items:center; justify-content:center; }
      .scada-badge:not([style*="width"]) .intar-display { width:40px; height:40px; }
      .scada-badge .intar-display img { width:100%!important; height:100%!important; max-width:100%; max-height:100%; object-fit:contain; }
      .intar-decimal, .intar-display { color:#000; text-shadow: 1px 1px 3px rgba(255,255,255,0.9); }
      .scada-error {
        background:#fff; color:#bd0202; padding:2px 6px; border-radius:2px;
        text-shadow:none; width:100%; height:100%;
        display:flex; align-items:center; justify-content:center;
      }
      .edit-mode-active .scada-badge {
        border: 1px dashed #666 !important; background: rgba(200,200,200,0.2);
        min-width:30px; min-height:20px; position:relative;
      }
      .edit-mode-active .scada-badge > .intar-decimal,
      .edit-mode-active .scada-badge > .intar-display,
      .edit-mode-active .scada-badge > .scada-error {
        display:inline-flex!important; opacity:1!important; z-index:2!important; position:relative;
      }
      .edit-mode-active .scada-badge::before {
        content: attr(data-id); position:absolute; top:50%; left:50%;
        transform:translate(-50%,-50%); color:rgba(0,0,0,0.25);
        font-weight:bold; font-family:monospace;
        font-size:clamp(11px,1.2vw,16px); pointer-events:none; z-index:1!important; white-space:nowrap;
      }
      .edit-mode-active .scada-badge::after { display:none!important; }
      .ui-resizable-handle { position:absolute!important; display:block!important; font-size:0.1px; touch-action:none; z-index:100!important; }
      .ui-resizable-se { cursor:se-resize!important; width:12px!important; height:12px!important; right:0!important; bottom:0!important; background:#000!important; opacity:0.4!important; }
      .edit-mode-active .ui-resizable-se:hover { opacity:0.8!important; }
    </style>

    <div id="Scada-App-Root">
      <div class="fab-container">
        <button id="fab-main-btn" class="fab-main" onclick="toggleFabMenu()" title="Opciones">+</button>
        <div id="fab-menu-items" class="fab-menu">
          <button id="btn-editar" onclick="toggleEditState()">Editar</button>
          <button id="btn-cancelar-editar" onclick="cancelarEdicion()">Cancelar</button>
          <hr style="margin:4px 0; border-color:#ccc;">
          <button onclick="cambiarZoom(0.1)">🔍 +</button>
          <button onclick="cambiarZoom(-0.1)">🔍 -</button>
          <button onclick="resetearZoom()">1:1</button>
          <button onclick="alternarPantallaCompleta()">⛶</button>
        </div>
      </div>

      <div id="Scada-Viewport">
        <div id="Grid-Container-Zoom">
          <img id="scada-img-bg" src="${cfg.imagen}" alt="Sinóptico">
          ${badgesHtml}
        </div>
      </div>
    </div>`;

  // Inyección en el DOM
  const existingRoot      = document.getElementById('Scada-App-Root');
  const kiconexContainer  = document.querySelector('#layoutSidenav_content main .container-fluid');

  if (existingRoot) {
    existingRoot.outerHTML = html;
  } else if (kiconexContainer) {
    kiconexContainer.innerHTML = html;
  } else {
    document.body.insertAdjacentHTML('beforeend', html);
  }

  habilitarArrastreFondo();
  aplicarPosicionesGuardadas();
  _cargarIntarcon(hasData);
}

function _cargarIntarcon(hasData) {
  if (!hasData) {
    const loader = document.getElementById('main-load');
    const root   = document.getElementById('Scada-App-Root');
    if (loader) loader.style.display = 'none';
    if (root)   root.style.display   = '';
    return;
  }
  $.ajax({
    url: 'js/intarcon.js', dataType: 'script', crossDomain: true, timeout: 5000,
    success: function () {
      setTimeout(() => {
        const loader = document.getElementById('main-load');
        const root   = document.getElementById('Scada-App-Root');
        if (loader) loader.style.display = 'none';
        if (root)   root.style.display   = '';
      }, 2500);
    },
    error: function () {
      console.warn("Error cargando intarcon.js. Mostrando vista sin datos.");
      main_table(false);
    }
  });
}
