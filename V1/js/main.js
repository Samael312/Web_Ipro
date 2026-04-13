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
  let label = '';
  let parts = displayTag.split('|');
  if (parts.length >= 7) {
    label = parts[6];
    displayTag = parts.slice(0, 6).join('|');
  }
  if (hasData) {
    let labelAttr = label ? ` data-label='${label}'` : '';
    return `<span class='intar-display'${labelAttr}>${displayTag}</span>`;
  }
  let displayName = displayTag.split(/[\/|]/)[0];
  return `<span class='scada-error'>${displayName}</span>`;
}

// --- VARIABLES GLOBALES PARA COPIAR/PEGAR AJUSTES ---
let copiedSettings = null;
let contextMenuElement = null;

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

// --- FUNCIONES DE ROTACIÓN, COPIAR Y PEGAR AJUSTES ---
function rotarElemento(elemento, angulo = 90) {
  let transform = elemento.style.transform || 'rotate(0deg)';
  let rotacionActual = 0;
  
  // Extraer ángulo actual del transform
  let match = transform.match(/rotate\((-?\d+)deg\)/);
  if (match) {
    rotacionActual = parseInt(match[1]);
  }
  
  // Calcular nuevo ángulo
  let nuevoAngulo = (rotacionActual + angulo) % 360;
  
  // Aplicar nueva rotación
  let newTransform = transform.replace(/rotate\(-?\d+deg\)/, `rotate(${nuevoAngulo}deg)`);
  if (!transform.includes('rotate')) {
    newTransform = transform + ` rotate(${nuevoAngulo}deg)`;
  }
  
  elemento.style.transform = newTransform.trim();
}

function copiarAjustes(elemento) {
  const computed = window.getComputedStyle(elemento);
  
  copiedSettings = {
    width: computed.width,
    height: computed.height,
    fontSize: computed.fontSize,
    transform: computed.transform && computed.transform !== 'none' ? computed.transform : 'none'
  };
  
  console.log('Ajustes copiados:', copiedSettings);
  mostrarNotificacion('Ajustes copiados');
}

function pegarAjustes(elemento) {
  if (!copiedSettings) {
    mostrarNotificacion('No hay ajustes para pegar', 'error');
    return;
  }
  
  elemento.style.width = copiedSettings.width;
  elemento.style.height = copiedSettings.height;
  elemento.style.fontSize = copiedSettings.fontSize;
  
  if (copiedSettings.transform !== 'none') {
    elemento.style.transform = copiedSettings.transform;
  }
  
  console.log('Ajustes pegados');
  mostrarNotificacion('Ajustes pegados');
}

function mostrarNotificacion(mensaje, tipo = 'success') {
  let notifClass = tipo === 'error' ? 'notif-error' : 'notif-success';
  let notif = document.createElement('div');
  notif.className = 'scada-notification ' + notifClass;
  notif.textContent = mensaje;
  document.body.appendChild(notif);
  
  setTimeout(() => notif.remove(), 2000);
}

function mostrarMenuContextual(event, elemento) {
  event.preventDefault();
  event.stopPropagation();
  
  contextMenuElement = elemento;
  
  // Remover menú anterior si existe
  let menuAnterior = document.getElementById('context-menu');
  if (menuAnterior) menuAnterior.remove();
  
  let menu = document.createElement('div');
  menu.id = 'context-menu';
  menu.className = 'context-menu';
  
  let pasteDisabled = !copiedSettings ? 'disabled' : '';
  
  menu.innerHTML = `
    <div class="context-menu-item" onclick="rotarElemento(contextMenuElement, 90);">
      ↻ Rotar 90°
    </div>
    <div class="context-menu-item" onclick="copiarAjustes(contextMenuElement);">
      📋 Copiar ajustes
    </div>
    <div class="context-menu-item ${pasteDisabled}" onclick="if (!this.classList.contains('disabled')) { pegarAjustes(contextMenuElement); }">
      📌 Pegar ajustes
    </div>
  `;
  
  document.body.appendChild(menu);
  
  // Ajustar posición del menú para que no se salga del viewport
  let rect = menu.getBoundingClientRect();
  let x = event.pageX;
  let y = event.pageY;
  
  // Verificar si se sale por la derecha
  if (x + rect.width > window.innerWidth) {
    x = window.innerWidth - rect.width - 10;
  }
  
  // Verificar si se sale por abajo
  if (y + rect.height > window.innerHeight) {
    y = window.innerHeight - rect.height - 10;
  }
  
  // Asegurar que no se salga por la izquierda o arriba
  x = Math.max(x, 10);
  y = Math.max(y, 10);
  
  menu.style.left = x + 'px';
  menu.style.top = y + 'px';
  
  // Cerrar menú al hacer clic fuera
  setTimeout(() => {
    document.addEventListener('click', cerrarMenuContextual);
  }, 0);
}

function cerrarMenuContextual() {
  let menu = document.getElementById('context-menu');
  if (menu) {
    menu.remove();
  }
  document.removeEventListener('click', cerrarMenuContextual);
}

// --- ELEMENTOS POR DEFECTO (fallback si no existe scada-elements.html) ---
function getDefaultElements() {
  return `          <div class="var-editable scada-badge" data-id="Pb_T_S3" >
            \${getSensorHtml(hasData, 'Pb_T_S3/10/0/1/3/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_T_S7">
            \${getSensorHtml(hasData, 'Pb_T_S7/10/0/1/3/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_T_S14">
            \${getSensorHtml(hasData, 'Pb_T_S14/10/0/1/3/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_T_S15">
            \${getSensorHtml(hasData, 'Pb_T_S15/10/0/1/3/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_T_S24" >
            \${getSensorHtml(hasData, 'Pb_T_S24/10/0/1/3/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_T_S25" >
            \${getSensorHtml(hasData, 'Pb_T_S25/10/0/1/3/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_T_S27" >
            \${getSensorHtml(hasData, 'Pb_T_S27/10/0/1/3/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_P_S17" >
            \${getSensorHtml(hasData, 'Pb_P_S17/10/0/1/3/bar')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_P_S21" >
            \${getSensorHtml(hasData, 'Pb_P_S21/10/0/1/3/bar')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_P_S23" >
            \${getSensorHtml(hasData, 'Pb_P_S23/10/0/1/3/bar')}
          </div>`;
}

// --- MENÚ FLOTANTE ---
function isUserAdmin() {
  // Función para verificar si el usuario actual es admin
  // Utiliza magcheck_user() que está en scripts.js
  if (typeof magcheck_user !== 'function') {
    return false;
  }
  const currentUser = magcheck_user();
  // Permitir acceso a usuario "Tech" o "Admin"
  return currentUser === 'admin';
}

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
    
    // 1. DRAG
    $('.var-editable').draggable({
      start: function(event, ui) { $(this).css('z-index', 100); },
      stop: function(event, ui) {
        $(this).css('z-index', ''); 
        var parentWidth = ui.helper.parent().width();
        var parentHeight = ui.helper.parent().height();
        var newLeftPercent = (ui.position.left / parentWidth) * 100;
        var newTopPercent = (ui.position.top / parentHeight) * 100;

        ui.helper.css({
          left: newLeftPercent.toFixed(2) + "%",
          top: newTopPercent.toFixed(2) + "%"
        });
      }
    });

    // 2. RESIZE
    $('.var-editable').resizable({
      containment: "parent",
      handles: "se",
      resize: function(event, ui) {
        var newHeight = ui.size.height;
        $(this).css('font-size', (newHeight * 0.5) + 'px');
      },
      stop: function(event, ui) {
        var parentWidth = ui.helper.parent().width();
        var parentHeight = ui.helper.parent().height();
        var newWidthPercent = (ui.size.width / parentWidth) * 100;
        var newHeightPercent = (ui.size.height / parentHeight) * 100;
        
        var currentFontSizePx = parseFloat($(this).css('font-size'));
        var fontSizeVh = (currentFontSizePx / window.innerHeight) * 100;
        
        ui.helper.css({
          width: newWidthPercent.toFixed(2) + "%",
          height: newHeightPercent.toFixed(2) + "%",
          fontSize: fontSizeVh.toFixed(3) + "vh"
        });
      }
    });

    // 3. CONTEXT MENU (Clic derecho)
    $('.var-editable').on('contextmenu', function(event) {
      mostrarMenuContextual(event, this);
    });

  } else {
    $('#Grid-Container-Zoom').removeClass('edit-mode-active');
    if ($('.var-editable').hasClass('ui-draggable')) {
      $('.var-editable').draggable("destroy").resizable("destroy");
    }
    $('.var-editable').off('contextmenu');
    $('.var-editable').css({ cursor: '' });
  }
}

let isEditMode = false;
let posicionesAntes = null; // Snapshot antes de editar

function toggleEditState() {
  isEditMode = !isEditMode;
  
  if (isEditMode) {
    resetearZoom();
    // Guardamos snapshot del estado actual ANTES de editar
    posicionesAntes = {};
    $('.var-editable').each(function() {
      let id = $(this).attr('data-id');
      if (id) {
        posicionesAntes[id] = {
          top: $(this)[0].style.top,
          left: $(this)[0].style.left,
          width: $(this)[0].style.width,
          height: $(this)[0].style.height,
          fontSize: $(this)[0].style.fontSize,
          transform: $(this)[0].style.transform
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

  // Restauramos las posiciones anteriores al editar
  if (posicionesAntes) {
    $('.var-editable').each(function() {
      let id = $(this).attr('data-id');
      if (id && posicionesAntes[id]) {
        $(this).css({
          top: posicionesAntes[id].top,
          left: posicionesAntes[id].left,
          width: posicionesAntes[id].width || '',
          height: posicionesAntes[id].height || '',
          fontSize: posicionesAntes[id].fontSize || '',
          transform: posicionesAntes[id].transform || ''
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

  $('.var-editable').each(function() {
    let id = $(this).attr('data-id');
    if (id) {
      const computed = window.getComputedStyle(this);

      posiciones[id] = {
        top: computed.top || '',
        left: computed.left || '',
        width: computed.width || '',
        height: computed.height || '',
        fontSize: computed.fontSize || '',
        transform: computed.transform && computed.transform !== 'none' ? computed.transform : ''
      };
    }
  });

  localStorage.setItem('scada_layout_config', JSON.stringify(posiciones));

  const cssContent = generarCssScada(posiciones);
  descargarFicheroCss('custom-scada.css', cssContent);
}


function generarCssScada(posiciones) {
  let css = `.var-editable.scada-badge {\n  position: absolute;\n}\n\n`;

  Object.keys(posiciones).sort().forEach(id => {
    const p = posiciones[id];

    css += `#Grid-Container-Zoom .var-editable[data-id="${id}"] {\n`;
    if (p.top) css += `  top: ${p.top};\n`;
    if (p.left) css += `  left: ${p.left};\n`;
    if (p.width) css += `  width: ${p.width};\n`;
    if (p.height) css += `  height: ${p.height};\n`;
    if (p.fontSize) css += `  font-size: ${p.fontSize};\n`;
    if (p.transform && p.transform !== 'none') css += `  transform: ${p.transform};\n`;
    css += `}\n\n`;
  });

  return css;
}

function descargarFicheroCss(nombreFichero, contenido) {
  const blob = new Blob([contenido], { type: 'text/css;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');

  enlace.href = url;
  enlace.download = nombreFichero;
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);

  URL.revokeObjectURL(url);
}



function aplicarPosicionesGuardadas() {
  let layoutGuardado = localStorage.getItem('scada_layout_config');
  if (layoutGuardado) {
    let posiciones = JSON.parse(layoutGuardado);
    $('.var-editable').each(function() {
      let id = $(this).attr('data-id');
      if (id && posiciones[id]) {
        $(this).css({
          top: posiciones[id].top,
          left: posiciones[id].left,
          width: posiciones[id].width || '', 
          height: posiciones[id].height || '', 
          fontSize: posiciones[id].fontSize || '',
          transform: posiciones[id].transform || ''
        });
      }
    });
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
    scrollTop = viewport.scrollTop;
  });

  window.addEventListener('mouseup', () => { 
    isDown = false; 
    if(viewport) viewport.classList.remove('dragging');
  });
  
  viewport.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault(); 
    
    const x = e.pageX - viewport.offsetLeft;
    const y = e.pageY - viewport.offsetTop;
    const walkX = (x - startX);
    const walkY = (y - startY);
    
    viewport.scrollLeft = scrollLeft - walkX;
    viewport.scrollTop = scrollTop - walkY;
  });
}

// --- CONSTRUCCIÓN DE LA VISTA ---
function main_table(hasData) {
  // Cargar elementos dinámicamente desde scada-elements.html
  let elementsHtml = '';
  
  $.ajax({
    url: 'scada-elements.html',
    dataType: 'text',
    async: false,
    success: function(data) {
      console.log('📥 scada-elements.html cargado, longitud:', data.length);
      
      // Extraer solo las líneas con divs var-editable (excluir comentarios y líneas vacías)
      const allLines = data.split('\n');
      
      const elementLines = allLines
        .filter(line => {
          const trimmed = line.trim();
          return trimmed && 
                 trimmed.includes('var-editable') && 
                 !trimmed.startsWith('<!--');
        });
      
      console.log('✓ Elementos encontrados:', elementLines.length);
      
      if (elementLines.length > 0) {
        // Reconstruir con indentación original
        elementsHtml = '          ' + elementLines.join('\n          ');
        console.log('✓ Elementos listos para renderizar');
      } else {
        console.warn('⚠ No se encontraron elementos en scada-elements.html');
        elementsHtml = getDefaultElements();
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.warn("⚠ No se encontró scada-elements.html:", textStatus, errorThrown);
      console.warn("Usando elementos por defecto");
      elementsHtml = getDefaultElements();
    }
  });

  var html = `
    <style>
      #Scada-App-Root {
          position: fixed;
          top: 72px;
          left: 0;
          right: 0;
          width: 100vw;
          height: calc(100vh - 72px);
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0);
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          z-index: 1;
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
        display: flex;
        justify-content: center;
        align-items: center;
      }

      #Scada-Viewport::before {
        display: none;
      }

      #Scada-Viewport.dragging {
        cursor: grabbing; 
      }

      #Grid-Container-Zoom {
        position: relative; 
        white-space: normal;
        width: 100%;
        height: 100%;
      }

      #scada-img-bg {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        object-fit: contain;
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

      .scada-badge-small {
        width: 25px !important;
        height: 25px !important;
        padding: 0 !important;
      }
      .scada-badge-small .intar-display {
        width: 25px !important;
        height: 25px !important;
        position: relative;
      }
      .scada-badge-small .intar-display:not(:empty)::after {
        content: attr(data-label);
        position: absolute;
        top: 110%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 12px;
        font-weight: bold;
        color: #000;
        pointer-events: none;
        text-shadow: 0 0 4px #fff;
      }
      .scada-badge-small .alarm-label { display: none; }

      @keyframes   {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.2; }
      }
      .  .intar-display img {
        animation:   0.8s infinite ease-in-out;
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

      .edit-mode-active .var-editable.scada-badge {
        position: absolute;
        border: 1px dashed #666 !important;
        background: rgba(200, 200, 200, 0.2);
        min-width: 30px;
        min-height: 20px;
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

      .edit-mode-active .scada-badge::after {
        display: none !important;
      }

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

      /* Estilos para menú contextual */
      .context-menu {
        position: fixed;
        background: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        min-width: 180px;
      }

      .context-menu-item {
        padding: 10px 15px;
        cursor: pointer;
        border-bottom: 1px solid #f0f0f0;
        font-size: 13px;
        user-select: none;
        transition: background-color 0.2s;
      }

      .context-menu-item:last-child {
        border-bottom: none;
      }

      .context-menu-item:hover:not(.disabled) {
        background-color: #f5f5f5;
      }

      .context-menu-item.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* Estilos para notificaciones */
      .scada-notification {
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 12px 20px;
        border-radius: 4px;
        font-size: 13px;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9998;
        animation: slideIn 0.3s ease-out;
      }

      .scada-notification.notif-success {
        background-color: #4CAF50;
        color: white;
      }

      .scada-notification.notif-error {
        background-color: #f44336;
        color: white;
      }

      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.2; }
      }

      .var-editable.scada-badge[data-id^="ALARM_"] .intar-display img {
        animation: blink 0.8s infinite ease-in-out;
      }
    </style>

    <div id="Scada-App-Root">
      
      ${isUserAdmin() ? `
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
          <hr style="margin: 4px 0; border-color: #ccc;">
          <button onclick="window.location.href='admin-elementos.html'" title="Importar elementos Excel">📊 Elementos</button>
        </div>
      </div>
      ` : ''}

      <div id="Scada-Viewport">
        <div id="Grid-Container-Zoom">
          <img id="scada-img-bg" src="layout01.png" alt="Mapa de la planta">
          
<!-- ELEMENTOS LAYOUT GENERADOS AUTOMÁTICAMENTE -->
<!-- Última actualización: 8/4/2026, 14:02:04 -->
<!-- Total de elementos: 49 -->

          <div class="var-editable scada-badge" data-id="Pb_T_S5">
            ${getSensorHtml(hasData, 'Pb_T_S5/10/0/1/3/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_T_S6">
            ${getSensorHtml(hasData, 'Pb_T_S6/10/0/1/3/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_T_S7">
            ${getSensorHtml(hasData, 'Pb_T_S7/10/0/1/3/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="PB_P_S17">
            ${getSensorHtml(hasData, 'PB_P_S17/10/0/1/3/bar')}
          </div>
          <div class="var-editable scada-badge" data-id="PB_P_S21">
            ${getSensorHtml(hasData, 'PB_P_S21/10/0/1/3/bar')}
          </div>
          <div class="var-editable scada-badge" data-id="PB_P_S23">
            ${getSensorHtml(hasData, 'PB_P_S23/10/0/1/3/bar')}
          </div>
          <div class="var-editable scada-badge" data-id="PB_T_S27">
            ${getSensorHtml(hasData, 'PB_T_S27/10/0/1/3/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_T_S1">
            ${getSensorHtml(hasData, 'Pb_T_S1/10/0/1/3/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="RL_BOMBAS_G1">
            ${getDisplayHtml(hasData, 'RL_BOMBAS_G1|assets/img/switch_off.png|assets/img/switch_on.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge" data-id="RL_BOMBAS_G3">
            ${getDisplayHtml(hasData, 'RL_BOMBAS_G3|assets/img/switch_off.png|assets/img/switch_on.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge" data-id="RL_BOMBAS_G4">
            ${getDisplayHtml(hasData, 'RL_BOMBAS_G4|assets/img/switch_off.png|assets/img/switch_on.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge" data-id="RL_BOMBAS_G5">
            ${getDisplayHtml(hasData, 'RL_BOMBAS_G5|assets/img/switch_off.png|assets/img/switch_on.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge" data-id="RL_VALV_ACS">
            ${getDisplayHtml(hasData, 'RL_VALV_ACS|assets/img/V2V_CERRADA.png|assets/img/V2V_ABIERTA.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge" data-id="RL_ENABLE_INTAR_SMALL">
            ${getDisplayHtml(hasData, 'RL_ENABLE_INTAR_SMALL|assets/img/switch_off.png|assets/img/switch_on.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge" data-id="RL_ENABLE_INTAR_BIG">
            ${getDisplayHtml(hasData, 'RL_ENABLE_INTAR_BIG|assets/img/switch_off.png|assets/img/switch_on.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge" data-id="RL_ENABLE_BDC_KEYTER">
            ${getDisplayHtml(hasData, 'RL_ENABLE_BDC_KEYTER|assets/img/switch_off.png|assets/img/switch_on.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge" data-id="RL_ENABLE_BOILER1">
            ${getDisplayHtml(hasData, 'RL_ENABLE_BOILER1|assets/img/fire_off.png|assets/img/fire_on.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge" data-id="RL_BURNER_STAGE1">
            ${getDisplayHtml(hasData, 'RL_BURNER_STAGE1|assets/img/fire_off.png|assets/img/fire_on.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge" data-id="RL_BURNER_STAGE2">
            ${getDisplayHtml(hasData, 'RL_BURNER_STAGE2|assets/img/fire_off.png|assets/img/fire_on.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge" data-id="RL_ELECT_HEATER_REC">
            ${getDisplayHtml(hasData, 'RL_ELECT_HEATER_REC|assets/img/resistencia_OFF.png|assets/img/resistencia_ON.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge" data-id="RL_VALV_BOILER">
            ${getDisplayHtml(hasData, 'RL_VALV_BOILER|assets/img/V3V_CERRADA_ABAJO.png|assets/img/V3V_IZQUIERDA_CERRADA.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge" data-id="ONOFF_GEN">
            ${getDisplayHtml(hasData, 'ONOFF_GEN|assets/img/switch_off.png|assets/img/switch_on.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge  " data-id="ALARM_BOMBA2_G5">
            ${getDisplayHtml(hasData, 'ALARM_BOMBA2_G5||assets/img/alarma.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge" data-id="RL_RECOVERY_MODE">
            ${getDisplayHtml(hasData, 'RL_RECOVERY_MODE|assets/img/V3V_IZQUIERDA_CERRADA.png|assets/img/V3V_CERRADA_ABAJO.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge" data-id="RELE_ALARMA">
            ${getDisplayHtml(hasData, 'RELE_ALARMA|assets/img/alarma-off.png|assets/img/alarma.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge  " data-id="ALARM_BOMBA1_G1">
            ${getDisplayHtml(hasData, 'ALARM_BOMBA1_G1||assets/img/alarma.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge  " data-id="ALARM_BOMBA2_G1">
            ${getDisplayHtml(hasData, 'ALARM_BOMBA2_G1||assets/img/alarma.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge  " data-id="ALARM_BOMBA1_G3">
            ${getDisplayHtml(hasData, 'ALARM_BOMBA1_G3||assets/img/alarma.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge" data-id="AO_V3V_REC">
            ${getSensorHtml(hasData, 'AO_V3V_REC/1/0/0/3/%')}
          </div>
          <div class="var-editable scada-badge  " data-id="ALARM_BOMBA1_G4">
            ${getDisplayHtml(hasData, 'ALARM_BOMBA1_G4||assets/img/alarma.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge  " data-id="ALARM_BOMBA2_G4">
            ${getDisplayHtml(hasData, 'ALARM_BOMBA2_G4||assets/img/alarma.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge  " data-id="ALARM_BOMBA1_G5">
            ${getDisplayHtml(hasData, 'ALARM_BOMBA1_G5||assets/img/alarma.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge" data-id="ST_LITROS_SUELTOS_C1">
            ${getSensorHtml(hasData, 'ST_LITROS_SUELTOS_C1/10/0/1/3/L')}
          </div>
          <div class="var-editable scada-badge" data-id="ST_LITROS_SUELTOS_C2">
            ${getSensorHtml(hasData, 'ST_LITROS_SUELTOS_C2/10/0/1/3/L')}
          </div>
          <div class="var-editable scada-badge" data-id="ST_LITROS_SUELTOS_C3">
            ${getSensorHtml(hasData, 'ST_LITROS_SUELTOS_C3/10/0/1/3/L')}
          </div>
          <div class="var-editable scada-badge" data-id="ST_LITROS_SUELTOS_C4">
            ${getSensorHtml(hasData, 'ST_LITROS_SUELTOS_C4/10/0/1/3/L')}
          </div>
          <div class="var-editable scada-badge" data-id="ST_LITROS_SUELTOS_C5">
            ${getSensorHtml(hasData, 'ST_LITROS_SUELTOS_C5/10/0/1/3/L')}
          </div>
          <div class="var-editable scada-badge" data-id="ST_LITROS_SUELTOS_C6">
            ${getSensorHtml(hasData, 'ST_LITROS_SUELTOS_C6/10/0/1/3/L')}
          </div>
          <div class="var-editable scada-badge  " data-id="ALARM_INTARCON_BIG">
            ${getDisplayHtml(hasData, 'ALARM_INTARCON_BIG|assets/img/alarma-off.png|assets/img/alarma.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge  " data-id="ALARM_INTARCON_SMALL">
            ${getDisplayHtml(hasData, 'ALARM_INTARCON_SMALL|assets/img/alarma-off.png|assets/img/alarma.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge  " data-id="ALARM_BDC_KEYTER">
            ${getDisplayHtml(hasData, 'ALARM_BDC_KEYTER|assets/img/alarma-off.png|assets/img/alarma.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge" data-id="ST_MEDIA_IMPULSION_FRIO">
            ${getSensorHtml(hasData, 'ST_MEDIA_IMPULSION_FRIO/10/0/1/3/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="ST_MEDIA_IMPULSION_CALOR">
            ${getSensorHtml(hasData, 'ST_MEDIA_IMPULSION_CALOR/10/0/1/3/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_T_S2">
            ${getSensorHtml(hasData, 'Pb_T_S2/10/0/1/3/ºC')}
          </div>
          <div class="var-editable scada-badge" data-id="Pb_T_S3">
            ${getSensorHtml(hasData, 'Pb_T_S3/10/0/1/3/ºC')}
          </div>
          <div class="var-editable scada-badge  " data-id="ALARM_ALTA_MEDIA_T2">
            ${getDisplayHtml(hasData, 'ALARM_ALTA_MEDIA_T2||assets/img/alarma.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge  " data-id="ALARM_ALTA_MEDIA_T5">
            ${getDisplayHtml(hasData, 'ALARM_ALTA_MEDIA_T5||assets/img/alarma.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge  " data-id="ALARM_BAJA_MEDIA_T2">
            ${getDisplayHtml(hasData, 'ALARM_BAJA_MEDIA_T2||assets/img/alarma.png|10/8/5')}
          </div>
          <div class="var-editable scada-badge  " data-id="ALARM_BAJA_MEDIA_T5">
            ${getDisplayHtml(hasData, 'ALARM_BAJA_MEDIA_T5||assets/img/alarma.png|10/8/5')}
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
};

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
};