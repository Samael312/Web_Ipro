# WEB IPRO — Plantilla de Proyecto

Plantilla normalizada para despliegues de sinóptico SCADA sobre controladores Intarcon/Kiconex.

---

## Estructura de archivos

```
PROYECTO/
│
├── index.html              ← HTML genérico (NO editar por cliente)
├── status.html
├── alarms.html
├── graphs.html
├── input-output.html
├── parameters.html
├── parameters-io.html
├── commands.html
│
├── layout01.png            ← ⚠️  ESPECÍFICO DEL CLIENTE (imagen del sinóptico)
│
├── assets/
│   ├── img/                ← Iconos genéricos (bombas, resistencias, etc.)
│   └── logos/              ← Logos del cliente (Logo-blanco.png, Logo-simple-blanco.png…)
│
├── css/
│   ├── boostrap.css
│   └── styles.css
│
└── js/
    ├── config.js           ← ⚠️  ÚNICO ARCHIVO QUE EDITAR POR CLIENTE
    ├── main.js             ← Motor sinóptico (genérico)
    ├── status.js           ← Motor página estado (genérico)
    ├── scripts.js          ← Sesión y permisos (genérico)
    ├── parameters.js       ← Parámetros (genérico)
    ├── intarcon.js         ← Librería Intarcon (no tocar)
    └── lib/                ← Librerías de terceros (no tocar)
```

---

## Cómo crear un nuevo proyecto desde cero

### Paso 1 — Copiar la plantilla

Duplica la carpeta completa y renómbrala con el nombre del cliente:

```
TEMPLATE/  →  NOMBRE_CLIENTE/
```

### Paso 2 — Editar `js/config.js`

Este es el **único archivo que debes modificar** para adaptar el proyecto a un cliente nuevo.

```js
const CLIENT_CONFIG = {

  proyecto: {
    nombre:    "NOMBRE DEL CLIENTE",
    titulo:    "kiControl: NOMBRE DEL CLIENTE",
    año:       "2025",
    logoAncho: "assets/logos/Logo-blanco.png",
    logoMovil: "assets/logos/Logo-simple-blanco.png",
  },

  domain: "",          // "" = producción (misma IP que la web)
  // domain: "http://192.168.1.100",  // Descomentar para desarrollo local

  sinaptico: {
    imagen: "layout01.png",   // Nombre del fichero de fondo del sinóptico
    variables: [
      // Añadir / quitar / reposicionar badges aquí
      { id: "TAG_1", tipo: "sensor",  tag: "TAG_1/10/0/1/5/ºC",  top: "10%", left: "20%" },
      { id: "TAG_2", tipo: "display", tag: "TAG_2|stop.png|play.png|15/10/5", top: "30%", left: "50%" },
      { id: "TAG_3", tipo: "counter", tag: "TAG_3/10/0/1/5/lt",  top: "80%", left: "45%" },
    ],
  },

  status: {
    tagCaudalVar:    "CAUDAL_VAR_EN",
    tagCaudalVarSec: "ENABLE_INV_PUM1S",
    tagNumCircuitos: "NumeroCircuitos",
  },

  permisos: {
    "Tech": ["write-default", "simulator"],
    "User": ["manage-param", "manage-log", "simulator"],
  },
};
```

### Paso 3 — Sustituir el sinóptico

Reemplaza `layout01.png` con la imagen del esquema del cliente.  
Actualiza el nombre en `config.js → sinaptico.imagen` si usas otro nombre de archivo.

### Paso 4 — Ajustar los logos

Coloca los logos del cliente en `assets/logos/` y actualiza las rutas en `config.js → proyecto`.

### Paso 5 — Posicionar los badges (modo visual)

1. Abre el proyecto en el navegador.
2. Pulsa el botón **+** (esquina inferior derecha) → **Editar**.
3. Arrastra y redimensiona los badges sobre el sinóptico.
4. Pulsa **Guardar** — las posiciones se guardan en `localStorage`.
5. Para exportar las posiciones al código, copia los valores `top/left` desde las DevTools y pégalos en `config.js → sinaptico.variables`.

---

## Tipos de badge disponibles

| tipo       | Descripción                                | Formato del tag |
|------------|--------------------------------------------|-----------------|
| `sensor`   | Valor numérico (temperatura, presión…)     | `NOMBRE_TAG/divisor/offset/decimales/timeout/unidad` |
| `display`  | Imagen ON/OFF (bomba, relé…)               | `NOMBRE_TAG\|img_off.png\|img_on.png\|ancho/alto/timeout` |
| `counter`  | Contador acumulado                         | `NOMBRE_TAG/divisor/offset/decimales/timeout/unidad` |

---

## Separación genérico / cliente

| Archivo          | Tipo       | ¿Editar por cliente? |
|------------------|------------|----------------------|
| `js/config.js`   | Cliente    | ✅ Siempre           |
| `layout01.png`   | Cliente    | ✅ Siempre           |
| `assets/logos/`  | Cliente    | ✅ Siempre           |
| `js/main.js`     | Genérico   | ❌ Nunca             |
| `js/status.js`   | Genérico   | ❌ Nunca             |
| `js/scripts.js`  | Genérico   | ❌ Nunca             |
| `js/parameters.js` | Genérico | ❌ Nunca             |
| `*.html`         | Genérico   | ❌ Nunca             |
| `js/lib/`        | Librerías  | ❌ Nunca             |

---

## Notas

- Las posiciones de los badges guardadas con el modo Editar se almacenan en `localStorage`
  con la clave `scada_layout_config`. Son **por navegador**, no se sincronizan entre usuarios.
- Para resetear las posiciones al estado del `config.js`, ejecuta en la consola del navegador:
  ```js
  localStorage.removeItem('scada_layout_config'); location.reload();
  ```
