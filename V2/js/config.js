// =============================================================================
//  config.js  —  ARCHIVO DE CONFIGURACIÓN DEL CLIENTE
//  Edita SOLO este archivo para adaptar el proyecto a un nuevo cliente.
//  El resto de archivos (main.js, status.js, scripts.js…) son genéricos
//  y NO deben modificarse salvo que cambies funcionalidad del motor.
// =============================================================================

const CLIENT_CONFIG = {

  // ---------------------------------------------------------------------------
  // 1. DATOS GENERALES DEL PROYECTO
  // ---------------------------------------------------------------------------
  proyecto: {
    nombre:       "NOMBRE DEL CLIENTE",   // Aparece en el <title> y en el footer
    titulo:       "kiControl: NOMBRE DEL CLIENTE",
    año:          "2025",
    logoAncho:    "assets/logos/Logo-blanco.png",
    logoMovil:    "assets/logos/Logo-simple-blanco.png",
  },

  // ---------------------------------------------------------------------------
  // 2. CREDENCIALES DE DESARROLLO LOCAL
  //    Solo activas cuando domain != "" (modo local).
  //    En producción el login va contra el PLC (dixe_only_login).
  //    El flujo revisa primero la exitencia del usuario en el PLC; si falla, busca en esta lista.
  //    Eliminar devCredentials o dejarlo vacío [] para deshabilitar.
  // ---------------------------------------------------------------------------
  devCredentials: [
    { user: "Tech",  password: "tech1234"  },
    { user: "User",  password: "user1234"  },
  ],

  // ---------------------------------------------------------------------------
  // 2. CONEXIÓN AL CONTROLADOR
  //    Dejar en "" para usar la misma IP que sirve la web (modo producción).
  //    Descomentar y poner IP para desarrollo local.
  // ---------------------------------------------------------------------------
  domain: "",
  // domain: "http://192.168.1.100",

  // ---------------------------------------------------------------------------
  // 3. SINÓPTICO  (index.html / main.js)
  //    - imagen:    ruta al fondo del sinóptico (específico del cliente)
  //    - variables: lista de badges que se superponen sobre la imagen
  //      Cada badge tiene:
  //        id       → identificador único (también se usa como data-id)
  //        tipo     → "sensor" | "display" | "counter"
  //        tag      → cadena completa que consume intarcon.js
  //        top/left → posición inicial en % (se puede sobreescribir con el modo Editar)
  //        extra    → (opcional) transform CSS, p.ej. "rotate(90deg)"
  // ---------------------------------------------------------------------------
  sinaptico: {
    imagen: "layout01.png",

    variables: [
      // --- SENSORES DE TEMPERATURA ---
      { id: "Pb_T_S1",  tipo: "sensor",  tag: "Pb_T_S1/10/0/1/5/ºC",  top: "6.2%",  left: "41%" },
      { id: "Pb_T_S2",  tipo: "sensor",  tag: "Pb_T_S2/10/0/1/5/ºC",  top: "47%",   left: "34%" },
      { id: "Pb_T_S3",  tipo: "sensor",  tag: "Pb_T_S3/10/0/1/5/ºC",  top: "30%",   left: "72%" },
      { id: "Pb_T_S4",  tipo: "sensor",  tag: "Pb_T_S4/10/0/1/5/ºC",  top: "4%",    left: "41%" },
      { id: "Pb_T_S5",  tipo: "sensor",  tag: "Pb_T_S5/10/0/1/5/ºC",  top: "32%",   left: "6.5%" },
      { id: "Pb_T_S6",  tipo: "sensor",  tag: "Pb_T_S6/10/0/1/5/ºC",  top: "54.5%", left: "25%" },
      { id: "Pb_T_S7",  tipo: "sensor",  tag: "Pb_T_S7/10/0/1/5/ºC",  top: "6.5%",  left: "6.5%" },
      { id: "Pb_T_S14", tipo: "sensor",  tag: "Pb_T_S14/10/0/1/5/ºC", top: "6.2%",  left: "71%" },
      { id: "Pb_T_S15", tipo: "sensor",  tag: "Pb_T_S15/10/0/1/5/ºC", top: "8.9%",  left: "71%" },
      { id: "Pb_T_S24", tipo: "sensor",  tag: "Pb_T_S24/10/0/1/5/ºC", top: "25%",   left: "92%" },
      { id: "Pb_T_S24_2", tipo: "sensor", tag: "Pb_T_S24/10/0/1/5/ºC", top: "61%",  left: "9%" },
      { id: "Pb_T_S25", tipo: "sensor",  tag: "Pb_T_S25/10/0/1/5/ºC", top: "27%",   left: "92%" },
      { id: "Pb_T_S26", tipo: "sensor",  tag: "Pb_T_S26/10/0/1/5/ºC", top: "59%",   left: "9%" },
      { id: "Pb_T_S27", tipo: "sensor",  tag: "Pb_T_S27/10/0/1/5/ºC", top: "7.5%",  left: "89.5%" },

      // --- SENSORES DE PRESIÓN ---
      { id: "Pb_P_S16", tipo: "sensor",  tag: "Pb_P_S16/10/0/1/5/bar", top: "52%",   left: "40%" },
      { id: "Pb_P_S17", tipo: "sensor",  tag: "Pb_P_S17/10/0/1/5/bar", top: "36%",   left: "47%" },
      { id: "Pb_P_S21", tipo: "sensor",  tag: "Pb_P_S21/10/0/1/5/bar", top: "51%",   left: "59%" },
      { id: "Pb_P_S22", tipo: "sensor",  tag: "Pb_P_S22/10/0/1/5/bar", top: "68%",   left: "89%" },
      { id: "Pb_P_S23", tipo: "sensor",  tag: "Pb_P_S23/10/0/1/5/bar", top: "59%",   left: "74%" },

      // --- CONSIGNAS ---
      { id: "PAR_CONSIGNA_FRIO",    tipo: "sensor", tag: "PAR_CONSIGNA_FRIO/10/0/1/5/ºC",  top: "8.8%", left: "41%" },
      { id: "PAR_CONSIGNA_FRIO_2",  tipo: "sensor", tag: "PAR_CONSIGNA_FRIO/10/0/1/5/ºC",  top: "12%",  left: "71%" },
      { id: "PAR_CONSIGNA_CALOR",   tipo: "sensor", tag: "PAR_CONSIGNA_CALOR/10/0/1/5/ºC", top: "29%",  left: "92%" },
      { id: "PAR_CONSIGNA_CALOR_2", tipo: "sensor", tag: "PAR_CONSIGNA_CALOR/10/0/1/5/ºC", top: "63%",  left: "10%" },

      // --- DISPLAYS (BOMBAS / RELÉS) ---
      { id: "RL_BOMBAS_G1",        tipo: "display", tag: "RL_BOMBAS_G1|assets/img/stop.png|assets/img/play.png|15/10/5",                       top: "41.5%", left: "52%" },
      { id: "RL_BOMBAS_G3",        tipo: "display", tag: "RL_BOMBAS_G3|assets/img/stop.png|assets/img/play.png|15/10/5",                       top: "37%",   left: "36%" },
      { id: "RL_BOMBAS_G4",        tipo: "display", tag: "RL_BOMBAS_G4|assets/img/stop.png|assets/img/play.png|15/10/5",                       top: "44%",   left: "80.7%" },
      { id: "RL_BOMBAS_G5",        tipo: "display", tag: "RL_BOMBAS_G5|assets/img/stop.png|assets/img/play.png|15/10/5",                       top: "56.5%", left: "83%",  extra: "rotate(90deg)" },
      { id: "RL_BOMBA_G6",         tipo: "display", tag: "RL_BOMBA_G6|assets/img/stop.png|assets/img/play.png|15/10/5",                        top: "23%",   left: "7.5%" },
      { id: "RL_ENABLE_INTAR_BIG", tipo: "display", tag: "RL_ENABLE_INTAR_BIG|assets/img/stop.png|assets/img/play.png|15/10/5",                top: "20%",   left: "62%" },
      { id: "RL_ENABLE_INTAR_SMALL",tipo:"display", tag: "RL_ENABLE_INTAR_SMALL|assets/img/stop.png|assets/img/play.png|15/10/5",               top: "20%",   left: "34%" },
      { id: "RL_ENABLE_BDC_KEYTER",tipo: "display", tag: "RL_ENABLE_BDC_KEYTER|assets/img/stop.png|assets/img/play.png|15/10/5",               top: "42%",   left: "90%" },
      { id: "RL_ELECT_HEATER_REC", tipo: "display", tag: "RL_ELECT_HEATER_REC|assets/img/resistencia_OFF.png|assets/img/resistencia_ON.png|15/10/5", top: "42%", left: "71.5%" },

      // --- CONTADORES ---
      { id: "ST_LITROS_C1", tipo: "counter", tag: "ST_CAUDAL_PULSOS_1/10/0/1/5/lt", top: "86.5%", left: "46%" },
      { id: "ST_LITROS_C2", tipo: "counter", tag: "ST_CAUDAL_PULSOS_2/10/0/1/5/lt", top: "83%",   left: "4.5%" },
      { id: "ST_LITROS_C3", tipo: "counter", tag: "ST_CAUDAL_PULSOS_3/10/0/1/5/lt", top: "90%",   left: "46%" },
      { id: "ST_LITROS_C4", tipo: "counter", tag: "ST_CAUDAL_PULSOS_4/10/0/1/5/lt", top: "19%",   left: "7.5%" },
      { id: "ST_LITROS_C5", tipo: "counter", tag: "ST_CAUDAL_PULSOS_5/10/0/1/5/lt", top: "72.5%", left: "16%" },
      { id: "ST_LITROS_C6", tipo: "counter", tag: "ST_CAUDAL_PULSOS_6/10/0/1/5/lt", top: "82.5%", left: "46%" },
    ],
  },

  // ---------------------------------------------------------------------------
  // 4. PÁGINA STATUS  (status.js)
  //    Variables de arranque que determinan la topología del equipo.
  //    El motor las lee al cargar y construye las tablas dinámicamente.
  // ---------------------------------------------------------------------------
  status: {
    // Tag que indica si hay caudal variable en el circuito primario
    tagCaudalVar:    "CAUDAL_VAR_EN",
    // Tag que indica si hay caudal variable en el circuito secundario
    tagCaudalVarSec: "ENABLE_INV_PUM1S",
    // Tag con el número de circuitos frigoríficos
    tagNumCircuitos: "NumeroCircuitos",
  },

  // ---------------------------------------------------------------------------
  // 5. PERMISOS DE USUARIO  (scripts.js)
  //    Define qué elementos del DOM se ocultan según el rol del usuario.
  //    La clave es el nombre de usuario (case-sensitive).
  //    El valor es un array de IDs de elementos a ocultar.
  // ---------------------------------------------------------------------------
  permisos: {
    "Tech": ["write-default", "simulator"],
    "User": ["manage-param", "manage-log", "simulator"],
  },

};
