var domain = "";
//var domain = "http://172.17.123.250"

$(document).ready(function () { /* tablas se construyen bajo demanda al pulsar cada botón */ });

// ─────────────────────────────────────────────────────────────────
// TOGGLE — construye la sección la primera vez que se abre
// ─────────────────────────────────────────────────────────────────
var IO_SECTIONS = {
  'analog-input-button':   { containerId: 'ai-values', built: false, buildFn: aiTableGenerator   },
  'analog-output-button':  { containerId: 'ao-values', built: false, buildFn: aoTableGenerator   },
  'digital-input-button':  { containerId: 'di-values', built: false, buildFn: diTableGenerator   },
  'digital-output-button': { containerId: 'do-values', built: false, buildFn: doTableGenerator   }
};

function hideTable(btn) {
  var section = IO_SECTIONS[btn.id];
  if (!section) return;
  var div = document.getElementById(section.containerId);
  if (div.style.display === 'none') {
    if (!section.built) {
      section.buildFn();
      section.built = true;
      _ioProcess(div);
    }
    div.style.display = '';
    btn.style.backgroundColor = '#1a82ba';
  } else {
    div.style.display = 'none';
    btn.style.backgroundColor = 'gray';
  }
}

// ─────────────────────────────────────────────────────────────────
// INTARCON SCOPED — solo decimal y bool, sin select
// ─────────────────────────────────────────────────────────────────
function _ioProcess(root) {
  $(root).find('.intar-decimal').each(function (i) {
    var p = this.innerHTML.trim().split("/");
    var name=p[0], div=parseInt(p[1])||1, off=parseInt(p[2])||0;
    var dec=parseInt(p[3])||0, ref=parseInt(p[4])||5, unit=p[5]||'';
    this.id = 'iodec-' + Date.now() + '-' + i;
    ajaxDecimal(name, div, off, dec, ref, this.id, unit);
  });
  $(root).find('.intar-bool').each(function (i) {
    var spans = this.getElementsByTagName('span');
    var p = this.innerHTML.split("/");
    var name=p[0], f=p[1], t=p[2], ref=parseInt(p[3])||5;
    var fc = spans[0] ? spans[0].style.color : '';
    var tc = spans[1] ? spans[1].style.color : '';
    this.id = 'iobool-' + Date.now() + '-' + i;
    ajaxBool(name, f, t, fc, tc, ref, this.id);
  });
}

// ─────────────────────────────────────────────────────────────────
// ANALOG INPUTS
// ─────────────────────────────────────────────────────────────────
var AI_VARS = [
  { name:'Pb_T_S1',    desc:'Temperatura colector frío retorno (T1)',       div:10, dec:1, unit:'ºC'   },
  { name:'Pb_T_S2',    desc:'Temperatura colector frío impulsión (T2)',     div:10, dec:1, unit:'ºC'   },
  { name:'Pb_T_S3',    desc:'Temperatura depósito recuperación (T3)',       div:10, dec:1, unit:'ºC'   },
  { name:'Pb_T_S4',    desc:'Temperatura retorno recuperación (T4)',        div:10, dec:1, unit:'ºC'   },
  { name:'Pb_T_S5',    desc:'Temperatura colector calor impulsión (T5)',    div:10, dec:1, unit:'ºC'   },
  { name:'Pb_T_S6',    desc:'Temperatura colector calor retorno (T6)',      div:10, dec:1, unit:'ºC'   },
  { name:'Pb_T_S7',    desc:'Temperatura depósito ACS (T7)',                div:10, dec:1, unit:'ºC'   },
  { name:'PB_T_S14',   desc:'Temperatura impulsión frío Intarcon (T8)',     div:10, dec:1, unit:'ºC'   },
  { name:'PB_T_S15',   desc:'Temperatura retorno frío Intarcon (T9)',       div:10, dec:1, unit:'ºC'   },
  { name:'PB_T_S24',   desc:'Temperatura impulsión Keyter (T10)',           div:10, dec:1, unit:'ºC'   },
  { name:'PB_T_S25',   desc:'Temperatura retorno Keyter (T11)',             div:10, dec:1, unit:'ºC'   },
  { name:'PB_T_S26',   desc:'Temperatura impulsión caldera (T12)',          div:10, dec:1, unit:'ºC'   },
  { name:'PB_T_S27',   desc:'Temperatura exterior (T13)',                   div:10, dec:1, unit:'ºC'   },
  { name:'PB_P_S16',   desc:'Presión impulsión Intarcon (P1)',              div:10, dec:2, unit:'bar'  },
  { name:'PB_P_S17',   desc:'Presión retorno Intarcon (P2)',                div:10, dec:2, unit:'bar'  },
  { name:'PB_P_S21',   desc:'Presión depósito inercia (P3)',                div:10, dec:2, unit:'bar'  },
  { name:'PB_P_S22',   desc:'Presión impulsión Keyter (P4)',                div:10, dec:2, unit:'bar'  },
  { name:'PB_P_S23',   desc:'Presión retorno Keyter (P5)',                  div:10, dec:2, unit:'bar'  },
  { name:'PB_Q_S28',   desc:'Caudalímetro circuito frío',                   div:10, dec:1, unit:'m³/h' },
  { name:'PB_VEL_S8',  desc:'Velocidad bomba 1 calor variable calor',      div:10, dec:1, unit:'%'    },
  { name:'PB_VEL_S9',  desc:'Velocidad bomba 2 calor variable calor',      div:10, dec:1, unit:'%'    },
  { name:'PB_VEL_S10', desc:'Velocidad bomba 1 frío',                      div:10, dec:1, unit:'%'    },
  { name:'PB_VEL_S11', desc:'Velocidad bomba 2 frío',                      div:10, dec:1, unit:'%'    },
  { name:'PB_VEL_S12', desc:'Velocidad bomba 1 recuperación',              div:10, dec:1, unit:'%'    },
  { name:'PB_VEL_S13', desc:'Velocidad bomba 2 recuperación',              div:10, dec:1, unit:'%'    }
];

function aiTableGenerator() {
  var rows = AI_VARS.map(function(v) {
    return "<tr><td>" + v.name + "</td><td>" + v.desc + "</td>" +
      "<td><span class='intar-decimal'>" + v.name + "/" + v.div + "/0/" + v.dec + "/5</span></td>" +
      "<td>" + v.unit + "</td></tr>";
  }).join('');
  document.getElementById('ai-values').innerHTML =
    "<h3 style='background-color:#d9daff;'>ANALOG INPUTS</h3>" +
    "<div class='col-10'><table class='table'>" +
    "<tr><th style='border-radius:5px 0 0 5px;'>Variable</th><th>Descripción</th><th>Valor</th><th style='border-radius:0 5px 5px 0;'>Unidad</th></tr>" +
    rows + "</table></div>";
}

// ─────────────────────────────────────────────────────────────────
// ANALOG OUTPUTS
// ─────────────────────────────────────────────────────────────────
var AO_VARS = [
  { name:'AO_BDC',       desc:'Control potencia bomba de calor Keyter',             div:1, dec:0, unit:'%'   },
  { name:'AO_V2V_CAUDAL',desc:'Válvula 2 vías bypass Intarcon',                    div:1, dec:0, unit:'%'   },
  { name:'AO_V3V_REC',   desc:'Válvula 3 vías recuperación (0=bypass, 1=glicol)',  div:1, dec:0, unit:'%'   },
  { name:'AO_BURNER',    desc:'Quemador modulante',                                div:1, dec:0, unit:'%'   }
];

function aoTableGenerator() {
  var rows = AO_VARS.map(function(v) {
    return "<tr><td>" + v.name + "</td><td>" + v.desc + "</td>" +
      "<td><span class='intar-decimal'>" + v.name + "/" + v.div + "/0/" + v.dec + "/5</span></td>" +
      "<td>" + v.unit + "</td></tr>";
  }).join('');
  document.getElementById('ao-values').innerHTML =
    "<h3 style='background-color:#d9daff;'>ANALOG OUTPUTS</h3>" +
    "<div class='col-10'><table class='table'>" +
    "<tr><th style='border-radius:5px 0 0 5px;'>Variable</th><th>Descripción</th><th>Valor</th><th style='border-radius:0 5px 5px 0;'>Unidad</th></tr>" +
    rows + "</table></div>";
}

// ─────────────────────────────────────────────────────────────────
// DIGITAL INPUTS
// ─────────────────────────────────────────────────────────────────
var DI_VARS = [
  { name:'DI_onoff',             desc:'On/Off remoto equipo'                              },
  { name:'DI_ALARM_BOMBA1_G1',   desc:'Seguridad bomba 1 frío (G1)'                      },
  { name:'DI_ALARM_BOMBA2_G1',   desc:'Seguridad bomba 2 frío (G1)'                      },
  { name:'DI_ALARM_BOMBA1_G2',   desc:'Seguridad bomba 1 frío (G2)'                      },
  { name:'DI_ALARM_BOMBA2_G2',   desc:'Seguridad bomba 2 frío (G2)'                      },
  { name:'DI_ALARM_BOMBA1_G3',   desc:'Seguridad bomba 1 frío (G3)'                      },
  { name:'DI_ALARM_BOMBA2_G3',   desc:'Seguridad bomba 2 frío (G3)'                      },
  { name:'DI_ALARM_BOMBA1_G4',   desc:'Seguridad bomba 1 recuperación (G4)'              },
  { name:'DI_ALARM_BOMBA2_G4',   desc:'Seguridad bomba 2 recuperación (G4)'              },
  { name:'DI_ALARM_BOMBA1_G5',   desc:'Seguridad bomba 1 calor (G5)'                     },
  { name:'DI_ALARM_BOMBA2_G5',   desc:'Seguridad bomba 2 calor (G5)'                     },
  { name:'DI_ALARM_BOMBA_G6',    desc:'Seguridad bomba ACS (G6)'                         },
  { name:'DI_ALARM_INTAR_SMALL', desc:'Seguridad enfriamiento Intarcon pequeña'          },
  { name:'DI_ALARM_CIATESA',     desc:'Seguridad enfriamiento Ciatesa'                   },
  { name:'DI_ALARM_INTAR_BIG',   desc:'Seguridad enfriamiento Intarcon grande'           },
  { name:'DI_ALARM_BDC_KEYTER',  desc:'Seguridad bomba de calor Keyter'                  },
  { name:'DI_ALARM_BOILER1',     desc:'Seguridad caldera 1'                              },
  { name:'DI_ALARM_BOILER2',     desc:'Seguridad caldera 2'                              },
  { name:'DI_CONT1',             desc:'Contador llenado glicol - circuito frío (C1)'     },
  { name:'DI_CONT2',             desc:'Contador llenado agua fría (C2)'                  },
  { name:'DI_CONT3',             desc:'Contador llenado agua fría recuperación (C3)'     },
  { name:'DI_CONT4',             desc:'Contador llenado agua fría ACS (C4)'              },
  { name:'DI_CONT5',             desc:'Contador de gasóleo (C5)'                         },
  { name:'DI_CONT6',             desc:'Contador llenado glicol - circuito calor (C6)'    }
];

function diTableGenerator() {
  var rows = DI_VARS.map(function(v) {
    return "<tr><td>" + v.name + "</td><td>" + v.desc + "</td>" +
      "<td><span class='intar-bool'>" + v.name +
      "/<span style='color:black'>OFF</span>/<span style='color:blue'>ON</span>/5</span></td></tr>";
  }).join('');
  document.getElementById('di-values').innerHTML =
    "<h3 style='background-color:#d9daff;'>DIGITAL INPUTS</h3>" +
    "<div class='col-10'><table class='table'>" +
    "<tr><th style='border-radius:5px 0 0 5px;'>Variable</th><th>Descripción</th><th style='border-radius:0 5px 5px 0;'>Estado</th></tr>" +
    rows + "</table></div>";
}

// ─────────────────────────────────────────────────────────────────
// DIGITAL OUTPUTS
// ─────────────────────────────────────────────────────────────────
var DO_VARS = [
  { name:'RL_BOMBAS_G1',       desc:'Relé salida bombas frío (G1)'                          },
  { name:'RL_BOMBAS_G2',       desc:'Relé salida bombas frío (G2)'                          },
  { name:'RL_BOMBAS_G3',       desc:'Relé salida bombas frío (G3)'                          },
  { name:'RL_BOMBAS_G4',       desc:'Relé salida bombas calor (G4)'                         },
  { name:'RL_BOMBAS_G5',       desc:'Relé salida bombas calor (G5)'                         },
  { name:'RL_BOMBA_G6',        desc:'Relé salida bomba ACS (G6)'                            },
  { name:'RL_VALV_ACS',        desc:'Relé salida solenoide todo/nada ACS'                   },
  { name:'RL_ENABLE_INTAR_SMALL',desc:'Orden marcha enfriadora Intarcon pequeña'            },
  { name:'RL_ENABLE_CIATESA',  desc:'Orden marcha enfriadora Ciatesa'                       },
  { name:'RL_ENABLE_INTAR_BIG',desc:'Orden marcha enfriadora Intarcon grande'               },
  { name:'RL_ENABLE_BDC_KEYTER',desc:'Orden marcha bomba de calor Keyter'                   },
  { name:'RL_ENABLE_BOILER1',  desc:'Orden marcha caldera 1'                                },
  { name:'RL_ENABLE_BOILER2',  desc:'Orden marcha caldera 2'                                },
  { name:'RL_BURNER_STAGE1',   desc:'Quemador etapa 1'                                      },
  { name:'RL_BURNER_STAGE2',   desc:'Quemador etapa 2'                                      },
  { name:'RL_ELECT_HEATER_REC',desc:'Resistencia depósito recuperación'                     },
  { name:'RL_VALV_BOILER',     desc:'Válvula 3 vías producción caldera'                     },
  { name:'RL_RECOVERY_MODE',   desc:'Activación modo recuperación'                          },
  { name:'RELE_ALARMA',        desc:'Relé de alarma'                                        },
  { name:'RL_AUX1',            desc:'Relé auxiliar con control manual 1'                    },
  { name:'RL_AUX2',            desc:'Relé auxiliar con control manual 2'                    },
  { name:'RL_AUX3',            desc:'Relé auxiliar con control manual 3'                    },
  { name:'RL_AUX4',            desc:'Relé auxiliar con control manual 4'                    },
  { name:'RL_AUX5',            desc:'Relé auxiliar con control manual 5'                    },
  { name:'RL_AUX6',            desc:'Relé auxiliar con control manual 6'                    }
];

function doTableGenerator() {
  var rows = DO_VARS.map(function(v) {
    return "<tr><td>" + v.name + "</td><td>" + v.desc + "</td>" +
      "<td><span class='intar-bool'>" + v.name +
      "/<span style='color:black'>OFF</span>/<span style='color:blue'>ON</span>/5</span></td></tr>";
  }).join('');
  document.getElementById('do-values').innerHTML =
    "<h3 style='background-color:#d9daff;'>DIGITAL OUTPUTS</h3>" +
    "<div class='col-10'><table class='table'>" +
    "<tr><th style='border-radius:5px 0 0 5px;'>Variable</th><th>Descripción</th><th style='border-radius:0 5px 5px 0;'>Estado</th></tr>" +
    rows + "</table></div>";
}