// Cambia la bandera del botón según el idioma seleccionado
window.setFlag = function(lang) {
  var flag = document.getElementById('current-flag');
  console.warn('Función de obtención de idioma.');
  if(flag) {
    flag.src = lang === 'en' ? 'assets/img/flag-en.png' : 'assets/img/flag-es.png';
  } else {
    console.warn('No se encontró el elemento #current-flag para cambiar la bandera.');
  }
};

// Al cargar, poner la bandera correcta si hay cookie
document.addEventListener('DOMContentLoaded', function() {
  var lang = null;
  try {
    lang = localStorage.getItem('selected_lang');
  } catch (e) {
    lang = null;
  }
  if (!lang) lang = 'en';
  setFlag(lang);
});
// Provides reusable layout: top navigation bar and side navigation
// Usage in HTML (before other scripts):
// <div id="topnav-root"></div>
// <div id="layoutSidenav">
//   <div id="layoutSidenav_nav"></div>
//   <div id="layoutSidenav_content"> ... </div>
// </div>
// <script src="js/layout.js"></script>
// <script>window.mountLayout('index');</script>

const topNavHtml = `
  <nav class="sb-topnav navbar navbar-expand navbar-dark">
    <!-- Logotipo -->
    <a class="ps-3 d-none d-sm-block" href="index.html">
      <img src="assets/logos/Logo-blanco.png" alt="intarLAB" style="width: 190px;" />
    </a>
    <a class="ps-3 d-block d-sm-none" href="index.html">
      <img src="assets/logos/Logo-simple-blanco.png" alt="intarLAB" style="width: 50px;" />
    </a>
    <!-- Collapse -->
    <button class="btn btn-link btn-sm m-3" id="sidebarToggle" href="#!">
      <i style='font-size: 18; color: white;' class="fas fa-bars"></i>
    </button>
    <!-- Menú de idioma -->
    <div class="dropdown d-inline-block align-middle ms-3" style="vertical-align: middle;">
      <button class="btn btn-light dropdown-toggle" type="button" id="langDropdown" data-bs-toggle="dropdown" aria-expanded="false">
        <img src="assets/img/flag-es.png" id="current-flag" alt="Idioma" style="width:24px;">
      </button>
      <ul class="dropdown-menu" aria-labelledby="langDropdown" style="min-width: 60px;">
        <li><a class="dropdown-item" href="#" onclick="setLang('es'); setFlag('es'); setTimeout(function(){ location.reload(); }, 100); return false;"><img src='assets/img/flag-es.png' style='width:24px;'> Español</a></li>
        <li><a class="dropdown-item" href="#" onclick="setLang('en'); setFlag('en'); setTimeout(function(){ location.reload(); }, 100); return false;"><img src='assets/img/flag-en.png' style='width:24px;'> English</a></li>
      </ul>
    </div>
    <!-- Navbar-->
    <div class="ms-auto">
      <div id="login-modal" class="modal">
        <div class="modal-content">
          <div class="container text-center">
            <div class="d-flex justify-content-start align-items-center mb-2">
              <h2 class="text-center mb-0 ms-2">Log In</h2>
            </div>
            <hr />
            <form id="loginForm">
              <input class="input-login" type="text" placeholder="Username" id="login-username">
              <input class="input-login" type="password" placeholder="Password" id="login-password">
              <span style="display: none;" id="login-error" class="text-danger">
                * Username or password incorrect</span>
              <div id="login_form" class="login_form text-center mt-2" style="display: block;">
                <button type="submit" class="btn btn-primary">LOGIN</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ul class="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
        <li>
          <span class='nav-link intar-icon' style="display: none;">ALARMA//i style='color:red;
            font-size: 25;' class="fa fa-bell"/10
          </span>
        </li>
        <li>
          <span class='nav-link intar-icon' style="display: none;">WARNING//i style='color:yellow;
            font-size: 25;' class="fa fa-exclamation-triangle"/10
          </span>
        </li>
        <li>&nbsp;&nbsp;&nbsp;</li>
        <li style="color: white;font-weight: bold; font-size: large; display: none;" class="nav-link"
          id="login_username"></li>
        <li style="color: white;font-weight: bold; font-size: large; display: none;" class="nav-link" id="login_logout"
          role="button" onclick="logOut()">
          <i class="fa fa-power-off" aria-hidden="true"></i>
        </li>
        <li style="color: white;font-weight: bold; font-size: large;" class="nav-link" role="button"
          onclick="document.getElementById('login-modal').style.display='block'" id="login_button">LOGIN
        </li>
      </ul>
    </div>
  </nav>
`;

function sideNavHtml(activeKey) {
  const isActive = (key) => key === activeKey ? " style=\"color: white; font-weight: bold;\"" : " style=\"color: white;\"";
  return `
      <nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
        <div class="sb-sidenav-menu">
          <div class="nav">
            <a${isActive('index')} class="nav-link" href="index.html">
              <div class="sb-nav-link-icon"><i style='font-size: 20;' class="fa fa-home"></i></div> MAIN
            </a>
            <a${isActive('status')} class="nav-link" href="status.html">
              <div class="sb-nav-link-icon"><i style='font-size: 20;' class="fa fa-tachometer"></i></div>
              STATUS
            </a>
            <a${isActive('alarms')} class="nav-link" href="alarms.html">
              <div class="sb-nav-link-icon">
                <i id="alarm" style='font-size: 20;' class="fa fa-bell"></i>
                <span class='intar-icon' style="display: none;">ALARMA///10 </span>
              </div> ALARM
            </a>
            <a${isActive('io')} class="nav-link" href="input-output.html">
              <div class="sb-nav-link-icon"><i style='font-size: 20;' class="fa fa-toggle-off"></i></div>
              INPUT/OUTPUT
            </a>
            <a${isActive('layout')} class="nav-link" href="layout.html">
              <div class="sb-nav-link-icon"><i style='font-size: 20;' class="fa fa-desktop"></i></div>
              LAYOUT
            </a>
            <a${isActive('eev')} class="nav-link" href="eev.html">
              <div class="sb-nav-link-icon"><i style='font-size: 20;' class="fa fa-code-fork"></i></div>
              EEV
            </a>
            <a${isActive('graphs')} class="nav-link" href="graphs.html">
              <div class="sb-nav-link-icon"><i style='font-size: 20;' class="fa fa-area-chart"></i></div>
              GRAPHS
            </a>
            <a class="nav-link" data-bs-toggle="collapse" data-bs-target="#collapseParameters"
              aria-expanded="false" aria-controls="collapseParameters" style="color: white;">
              <div class="sb-nav-link-icon"><i style='font-size: 20;' class="fa fa-sliders"></i></div>
              PARAMETERS
              <div class="sb-sidenav-collapse-arrow">
                <i style="color: white;" class="fas fa-angle-down"></i>
              </div>
            </a>
            <div class="collapse" id="collapseParameters" aria-labelledby="headingOne"
              data-bs-parent="#sidenavAccordion">
              <nav class="sb-sidenav-menu-nested nav">
                <a${isActive('parameters')} class="nav-link" href="parameters.html">
                  <div class="sb-nav-link-icon"><i style='font-size: 20;' class="fa fa-bars"></i>
                  </div> PARAMETERS CONF
                </a>
                <a${isActive('parameters-io')} class="nav-link" href="parameters-io.html">
                  <div class="sb-nav-link-icon"><i style='font-size: 20;' class="fa fa-bars"></i>
                  </div> I/O's CONF
                </a>
              </nav>
            </div>
            <a${isActive('commands')} class="nav-link" href="commands.html">
              <div class="sb-nav-link-icon"><i style='font-size: 20;' class="fa fa-terminal"></i></div>
              COMMANDS
            </a>
            <hr>
            <a class="nav-link" href="/panel/index.html" style="color: white;">
              <div class="sb-nav-link-icon"><i style='font-size: 20;' class="fa fa-columns"></i></div>
              CONTROL PANEL
            </a>
          </div>
        </div>
        <div class="sb-sidenav-footer">
          <div class="text-center">
            <a href="https://www.kiconex.com" target="_blank"
              style="text-decoration: none;color:white; font-weight: bold;">KICONEX - 2025</a>
          </div>
        </div>
      </nav>
  `;
}

function keyFromLocation() {
  const file = (location.pathname.split('/').pop() || '').toLowerCase();
  if (file.includes('index')) return 'index';
  if (file.includes('status')) return 'status';
  if (file.includes('alarms')) return 'alarms';
  if (file.includes('input-output')) return 'io';
  if (file.includes('layout')) return 'layout';
  if (file.includes('eev')) return 'eev';
  if (file.includes('graphs')) return 'graphs';
  if (file.includes('parameters-io')) return 'parameters-io';
  if (file.includes('parameters')) return 'parameters';
  if (file.includes('commands')) return 'commands';
  return 'index';
}

function mountLayout(activeKey) {
  const key = activeKey || keyFromLocation();
  const topRoot = document.getElementById('topnav-root');
  if (topRoot) {
    topRoot.innerHTML = topNavHtml;
  }
  const sideRoot = document.getElementById('layoutSidenav_nav');
  if (sideRoot) {
    sideRoot.innerHTML = sideNavHtml(key);
  }
}

// expose globally for non-module usage
window.mountLayout = mountLayout;

// Lógica de idioma global (solo una vez por página)
if (!window.__langSelectorInjected) {
  window.__langSelectorInjected = true;
  // Guardar idioma en localStorage
  window.setLang = function(lang) {
    try {
      localStorage.setItem('selected_lang', lang);
    } catch (e) {
      console.warn('No se pudo guardar el idioma en localStorage:', e);
    }
    if (window.i18n) i18n.setLanguage(lang);
  };
  window.getLang = function() {
    try {
      var lang = localStorage.getItem('selected_lang');
      return lang ? lang : 'en';
    } catch (e) {
      console.warn('No se pudo leer el idioma de localStorage:', e);
      return 'en';
    }
  };
  document.addEventListener('DOMContentLoaded', function() {
    var lang = window.getLang ? getLang() : 'en';
    if(window.i18n && lang !== i18n.getCurrentLang()) {
      i18n.setLanguage(lang);
    }
  });
}


