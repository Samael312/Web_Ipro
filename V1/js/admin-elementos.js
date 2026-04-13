let excelData = [];
let selectedElements = {};
let filterValues = {};
let elementConfig = {}; // Almacena configuración de cada elemento
let availableImages = []; // Imágenes disponibles

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.addEventListener('change', handleFileUpload);
    }
  });
} else {
  const fileInput = document.getElementById('fileInput');
  if (fileInput) {
    fileInput.addEventListener('change', handleFileUpload);
  }
}

function processFile() {
  try {
    console.log('processFile() llamado');
    
    const fileInput = document.getElementById('fileInput');
    if (!fileInput) {
      alert('No se encontró el input de archivo');
      return false;
    }
    
    const file = fileInput.files[0];
    if (!file) {
      alert('Selecciona un archivo CSV primero');
      return false;
    }
    
    console.log('Archivo seleccionado:', file.name);
    loadExcelFile(file);
    return false;
  } catch (e) {
    console.error('Error en processFile:', e);
    alert('Error: ' + e.message);
    return false;
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  console.log('Archivo seleccionado:', file.name);
  // No procesar automáticamente, esperar a que el usuario haga clic en "Buscar"
}

function loadExcelFile(file) {
  console.log('loadExcelFile() inicio - Leyendo:', file.name);
  
  // Mostrar estado de carga
  const fileInfo = document.getElementById('fileInfo');
  if (fileInfo) {
    fileInfo.textContent = '⏳ Leyendo archivo...';
    fileInfo.style.display = 'block';
  }
  
  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      console.log('Archivo leído, parseando CSV...');
      const csv = e.target.result;
      excelData = parseCSV(csv);
      
      console.log('CSV parseado, datos:', excelData.length, 'elementos');

      if (excelData.length === 0) {
        showError('El archivo CSV está vacío');
        fileInfo.textContent = '✗ Archivo vacío';
        fileInfo.style.display = 'block';
        return;
      }

      // Verificar que existe columna "Nombre"
      if (!excelData[0].hasOwnProperty('Nombre')) {
        console.log('Columnas disponibles:', Object.keys(excelData[0]));
        showError('El archivo debe contener una columna "Nombre" con los IDs de variables');
        fileInfo.textContent = '✗ Falta columna "Nombre"';
        fileInfo.style.display = 'block';
        return;
      }

      console.log('Iniciando displayElements()...');
      fileInfo.textContent = `⏳ Cargando ${excelData.length} elementos...`;
      
      // Usar setTimeout para no bloquear el UI
      setTimeout(() => {
        try {
          displayElements();
          console.log('displayElements() completado');
          
          fileInfo.textContent = `✓ Cargado: ${file.name} (${excelData.length} elementos)`;
          fileInfo.style.display = 'block';

          const elementsList = document.getElementById('elementsList');
          if (elementsList) {
            elementsList.style.display = 'block';
          }
          
          showSuccess(`Se cargaron ${excelData.length} elementos correctamente`);
        } catch (err) {
          console.error('Error en displayElements():', err);
          showError('Error al mostrar elementos: ' + err.message);
          fileInfo.textContent = '✗ Error al procesar';
          fileInfo.style.display = 'block';
        }
      }, 100);
      
    } catch (error) {
      console.error('Error en loadExcelFile:', error);
      showError('Error al procesar el archivo: ' + error.message);
      fileInfo.textContent = '✗ Error al procesar';
      fileInfo.style.display = 'block';
    }
  };
  
  reader.onerror = () => {
    console.error('Error leyendo archivo');
    showError('Error al leer el archivo');
    if (fileInfo) {
      fileInfo.textContent = '✗ Error al leer archivo';
      fileInfo.style.display = 'block';
    }
  };
  
  console.log('Iniciando lectura como texto...');
  reader.readAsText(file);
}

// Parser CSV nativo (sin dependencias externas)
function parseCSV(csv) {
  const lines = csv.trim().split('\n');
  if (lines.length === 0) return [];

  // Detectar automáticamente el separador (coma o punto y coma)
  const separator = detectSeparator(lines[0]);

  // Parsear encabezados
  const headers = parseCSVLine(lines[0], separator);
  
  // Parsear filas
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;
    
    const values = parseCSVLine(lines[i], separator);
    const row = {};
    
    headers.forEach((header, index) => {
      row[header.trim()] = values[index] ? values[index].trim() : '';
    });
    
    data.push(row);
  }
  
  return data;
}

// Detectar separador automáticamente (coma o punto y coma)
function detectSeparator(line) {
  const commaCount = (line.match(/,/g) || []).length;
  const semicolonCount = (line.match(/;/g) || []).length;
  
  // Usar el separador que aparezca más veces
  if (semicolonCount > commaCount) {
    return ';';
  }
  return ',';
}

// Parsear una línea CSV respetando comillas
function parseCSVLine(line, separator = ',') {
  const result = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escapar comilla doble
        current += '"';
        i++;
      } else {
        // Toggle quotes
        insideQuotes = !insideQuotes;
      }
    } else if (char === separator && !insideQuotes) {
      // Separador de columna
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

function displayElements() {
  console.log('displayElements() inicio - ', excelData.length, 'elementos');
  
  const container = document.getElementById('elementsContainer');
  if (!container) {
    console.error('No se encontró elementsContainer');
    return;
  }
  
  container.innerHTML = '';
  console.log('Container limpiado');

  if (excelData.length === 0) {
    console.log('No hay datos para mostrar');
    return;
  }

  const columns = Object.keys(excelData[0]);
  console.log('Columnas:', columns);

  // Crear filtros
  createFilters(columns);

  // Usar DocumentFragment para mejor rendimiento
  const fragment = document.createDocumentFragment();
  
  for (let index = 0; index < excelData.length; index++) {
    try {
      const item = excelData[index];
      const nombre = item['Nombre'] || '';
      
      if (index % 50 === 0) {
        console.log('Procesando elemento', index, '/', excelData.length);
      }

      const elemento = document.createElement('div');
      elemento.className = 'element-item';
      elemento.id = `element-${index}`;
      elemento.setAttribute('data-index', index);

      // Construir HTML más compacto
      let html = `
        <input 
          type="checkbox" 
          class="element-checkbox" 
          id="check-${index}"
          onchange="toggleElement(${index})"
        />
        <div class="element-info">
          <div class="element-name">${nombre}</div>
      `;

      // Mostrar un preview de las columnas adicionales
      if (columns.length > 1) {
        const otherColumns = columns.filter(col => col !== 'Nombre').slice(0, 2);
        const preview = otherColumns.map(col => `${col}: ${item[col] || ''}`).join(' | ');
        if (preview) {
          html += `<div class="element-preview">${preview}</div>`;
        }
      }

      html += '</div>';
      elemento.innerHTML = html;
      fragment.appendChild(elemento);

      // Inicializar configuración
      if (!selectedElements[index]) {
        selectedElements[index] = {
          nombre: nombre,
          selected: false,
          unitConfig: {}
        };

        // Asignar unidades
        for (let c = 0; c < columns.length; c++) {
          const col = columns[c];
          if (col !== 'Nombre') {
            selectedElements[index].unitConfig[col] = item[col] || '';
          }
        }
      }
    } catch (e) {
      console.error('Error procesando elemento', index, ':', e);
    }
  }

  console.log('Añadiendo', excelData.length, 'elementos al DOM');
  container.appendChild(fragment);
  console.log('displayElements() completado');
}

function createFilters(columns) {
  const filtersRow = document.getElementById('filtersRow');
  const filtersSection = document.getElementById('filtersSection');
  
  if (!filtersRow) return;
  
  filtersRow.innerHTML = '';
  filterValues = {};

  // Crear filtros para cada columna
  const filterColumns = columns.filter(col => col);

  filterColumns.forEach(column => {
    filterValues[column] = '';
    
    const filterGroup = document.createElement('div');
    filterGroup.className = 'filter-group';
    
    const label = document.createElement('label');
    label.textContent = column;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Filtrar ${column}...`;
    input.onkeyup = () => {
      filterValues[column] = input.value.toLowerCase();
      applyFilters();
    };
    
    filterGroup.appendChild(label);
    filterGroup.appendChild(input);
    filtersRow.appendChild(filterGroup);
  });

  // Botón para limpiar filtros
  if (filterColumns.length > 0) {
    const clearBtn = document.createElement('button');
    clearBtn.className = 'filter-clear-btn';
    clearBtn.textContent = 'Limpiar filtros';
    clearBtn.onclick = () => {
      filtersRow.querySelectorAll('input').forEach(input => input.value = '');
      filterValues = {};
      filterColumns.forEach(col => filterValues[col] = '');
      applyFilters();
    };
    const filterGroup = document.createElement('div');
    filterGroup.className = 'filter-group';
    filterGroup.appendChild(clearBtn);
    filtersRow.appendChild(filterGroup);
  }

  filtersSection.style.display = filterColumns.length > 0 ? 'block' : 'none';
}

function applyFilters() {
  const elements = document.querySelectorAll('.element-item');
  let visibleCount = 0;

  elements.forEach(elemento => {
    const index = parseInt(elemento.getAttribute('data-index'));
    const item = excelData[index];
    
    let showElement = true;

    // Verificar que coincida con todos los filtros
    const columns = Object.keys(excelData[0]);
    columns.forEach(column => {
      if (filterValues[column]) {
        const value = (item[column] || '').toLowerCase();
        if (!value.includes(filterValues[column])) {
          showElement = false;
        }
      }
    });

    if (showElement) {
      elemento.style.display = 'flex';
      visibleCount++;
    } else {
      elemento.style.display = 'none';
    }
  });

  console.log(`Mostrando ${visibleCount} de ${elements.length} elementos`);
}

function toggleElement(index) {
  const checkbox = document.getElementById(`check-${index}`);
  const elemento = document.getElementById(`element-${index}`);
  
  selectedElements[index].selected = checkbox.checked;
  
  if (checkbox.checked) {
    elemento.classList.add('selected');
  } else {
    elemento.classList.remove('selected');
  }
}

function selectAllElements() {
  Object.keys(selectedElements).forEach((index) => {
    const checkbox = document.getElementById(`check-${index}`);
    if (checkbox) {
      checkbox.checked = true;
      toggleElement(index);
    }
  });
}

function deselectAllElements() {
  Object.keys(selectedElements).forEach((index) => {
    const checkbox = document.getElementById(`check-${index}`);
    if (checkbox) {
      checkbox.checked = false;
      toggleElement(index);
    }
  });
}

function generateScadaHtml() {
  const selected = Object.values(selectedElements).filter(el => el.selected);

  if (selected.length === 0) {
    showError('Debe seleccionar al menos un elemento');
    return;
  }

  console.log('📝 Abriendo configurador para', selected.length, 'elementos del layout');

  // Inicializar configuración
  elementConfig = {};
  selected.forEach((element, idx) => {
    const nombre = element.nombre;
    elementConfig[nombre] = {
      type: 'sensor', // sensor o display
      unit: '',
      imgOff: '',
      imgOn: '',
      size: '10/8/5'
    };
  });

  // Cargar imágenes disponibles y mostrar modal
  loadAvailableImages().then(() => {
    showConfigModal(selected);
  });
}

function loadAvailableImages() {
  return new Promise((resolve) => {
    // Obtener lista de imágenes desde assets/img
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif'];
    const commonImages = [
      'stop.png', 'play.png',
      'alarma.png', 'alarma-off.png',
      'fire_on.png', 'fire_off.png',
      'resistencia_ON.png', 'resistencia_OFF.png',
      'switch_on.png', 'switch_off.png',
      'V2V_ABIERTA.png', 'V2V_CERRADA.png',
      'V3V_CERRADA_ABAJO.png', 'V3V_IZQUIERDA_CERRADA.png',
      'alarma-off.png'
    ];
    
    availableImages = commonImages;
    resolve();
  });
}

function showConfigModal(selected) {
  const configList = document.getElementById('configElementsList');
  configList.innerHTML = '';

  selected.forEach((element) => {
    const nombre = element.nombre;
    const config = elementConfig[nombre];

    const elementDiv = document.createElement('div');
    elementDiv.className = 'config-element';
    elementDiv.innerHTML = `
      <div class="config-element-name">📌 ${nombre}</div>
      
      <div class="config-type-selector">
        <button class="config-type-btn active" onclick="changeElementType('${nombre}', 'sensor', this)">
          📊 Sensor (Analógico)
        </button>
        <button class="config-type-btn" onclick="changeElementType('${nombre}', 'display', this)">
          🔘 Display (Digital)
        </button>
      </div>

      <div class="config-element-fields">
        <!-- Campo para sensor -->
        <div class="sensor-config">
          <div class="config-field">
            <label>Unidad (ej: ºC, bar, %, lt)</label>
            <input type="text" placeholder="ºC" value="${config.unit}" onchange="elementConfig['${nombre}'].unit = this.value; updatePreview('${nombre}')" />
          </div>
          <div class="config-preview" id="preview-${nombre}-sensor">
            \${getSensorHtml(hasData, '${nombre}/10/0/1/3/${config.unit}')}
          </div>
        </div>

        <!-- Campo para display (oculto inicialmente) -->
        <div class="display-config" style="display: none;">
          <div class="config-field">
            <label>Imagen OFF</label>
            <select onchange="elementConfig['${nombre}'].imgOff = this.value; updatePreview('${nombre}')">
              <option value="">-- Seleccionar --</option>
              ${availableImages.map(img => `<option value="assets/img/${img}">${img}</option>`).join('')}
            </select>
          </div>
          <div class="config-field">
            <label>Imagen ON</label>
            <select onchange="elementConfig['${nombre}'].imgOn = this.value; updatePreview('${nombre}')">
              <option value="">-- Seleccionar --</option>
              ${availableImages.map(img => `<option value="assets/img/${img}">${img}</option>`).join('')}
            </select>
          </div>
          <div class="config-field">
            <label>Tamaño (ej: 10/8/5)</label>
            <input type="text" placeholder="10/8/5" value="${config.size}" onchange="elementConfig['${nombre}'].size = this.value; updatePreview('${nombre}')" />
          </div>
          <div class="config-preview" id="preview-${nombre}-display">
            \${getDisplayHtml(hasData, '${nombre}|${config.imgOff || 'assets/img/stop.png'}|${config.imgOn || 'assets/img/play.png'}|${config.size}')}
          </div>
        </div>
      </div>
    `;

    configList.appendChild(elementDiv);
  });

  document.getElementById('configModal').classList.add('active');
}

function changeElementType(nombre, type, button) {
  elementConfig[nombre].type = type;
  
  // Actualizar botones seleccionados
  const buttons = button.parentElement.querySelectorAll('.config-type-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');

  // Mostrar/ocultar campos según el tipo
  const configElement = button.closest('.config-element');
  const sensorConfig = configElement.querySelector('.sensor-config');
  const displayConfig = configElement.querySelector('.display-config');

  if (type === 'sensor') {
    sensorConfig.style.display = 'block';
    displayConfig.style.display = 'none';
  } else {
    sensorConfig.style.display = 'none';
    displayConfig.style.display = 'block';
  }

  updatePreview(nombre);
}

function updatePreview(nombre) {
  const config = elementConfig[nombre];
  
  if (config.type === 'sensor') {
    const previewDiv = document.getElementById(`preview-${nombre}-sensor`);
    if (previewDiv) {
      const unit = config.unit || 'unidad';
      previewDiv.textContent = `\${getSensorHtml(hasData, '${nombre}/10/0/1/5/${unit}')}`;
    }
  } else {
    const previewDiv = document.getElementById(`preview-${nombre}-display`);
    if (previewDiv) {
      const imgOff = config.imgOff || 'assets/img/stop.png';
      const imgOn = config.imgOn || 'assets/img/play.png';
      const size = config.size || '10/8/5';
      previewDiv.textContent = `\${getDisplayHtml(hasData, '${nombre}|${imgOff}|${imgOn}|${size}')}`;
    }
  }
}

function cancelConfigModal() {
  document.getElementById('configModal').classList.remove('active');
  elementConfig = {};
}

function saveConfigAndGenerate() {
  const selected = Object.keys(elementConfig);
  console.log('💾 Generando layout-elements.html con', selected.length, 'elementos');

  let elementsList = [];

  selected.forEach((nombre) => {
    const config = elementConfig[nombre];
    let elementHtml;

    if (config.type === 'sensor') {
      const unit = config.unit || '';
      elementHtml = `          <div class="var-editable scada-badge" data-id="${nombre}">
            \${getSensorHtml(hasData, '${nombre}/10/0/1/5/${unit}')}
          </div>`;
    } else {
      const imgOff = config.imgOff || 'assets/img/stop.png';
      const imgOn = config.imgOn || 'assets/img/play.png';
      const size = config.size || '10/8/5';
      elementHtml = `          <div class="var-editable scada-badge" data-id="${nombre}">
            \${getDisplayHtml(hasData, '${nombre}|${imgOff}|${imgOn}|${size}')}
          </div>`;
    }

    elementsList.push(elementHtml);
  });

  const elementsContent = elementsList.join('\n');
  const htmlContent = `<!-- ELEMENTOS LAYOUT GENERADOS AUTOMÁTICAMENTE -->
<!-- Última actualización: ${new Date().toLocaleString()} -->
<!-- Total de elementos: ${selected.length} -->

${elementsContent}`;

  downloadFile('layout-elements.html', htmlContent);
  
  document.getElementById('configModal').classList.remove('active');
  showSuccess(`Se generó layout-elements.html con ${selected.length} elementos`);
  
  localStorage.setItem('layout_elements_config', JSON.stringify(elementConfig));
  console.log('✓ Proceso completado');
}

function downloadFile(filename, content, mimeType = 'text/html;charset=utf-8;') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  
  enlace.href = url;
  enlace.download = filename;
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  
  URL.revokeObjectURL(url);
}

function showSuccess(message) {
  const successDiv = document.getElementById('successMessage');
  const errorDiv = document.getElementById('errorMessage');
  errorDiv.style.display = 'none';
  successDiv.textContent = '✓ ' + message;
  successDiv.style.display = 'block';
  
  setTimeout(() => {
    successDiv.style.display = 'none';
  }, 5000);
}

function showError(message) {
  const errorDiv = document.getElementById('errorMessage');
  const successDiv = document.getElementById('successMessage');
  successDiv.style.display = 'none';
  errorDiv.textContent = '✗ Error: ' + message;
  errorDiv.style.display = 'block';
}
