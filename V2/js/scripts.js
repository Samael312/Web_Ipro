// =============================================================================
//  scripts.js  —  LÓGICA DE SESIÓN, NAVEGACIÓN Y PERMISOS  (archivo GENÉRICO)
//  Los permisos por rol se configuran en js/config.js → CLIENT_CONFIG.permisos
// =============================================================================

var modal_login = document.getElementById('login-modal');
var alarm       = document.getElementById('alarm-modal');
var power_on    = document.getElementById('on-modal');
var power_off   = document.getElementById('off-modal');
var button_login = document.getElementById('login_button');
var username     = document.getElementById('login_username');
var logout       = document.getElementById('login_logout');
var error        = document.getElementById('login-error');

// --- Sidebar toggle ---
window.addEventListener('DOMContentLoaded', () => {
  const sidebarToggle = document.body.querySelector('#sidebarToggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.toggle('sb-sidenav-toggled');
      localStorage.setItem('sb|sidebar-toggle',
        document.body.classList.contains('sb-sidenav-toggled'));
    });
  }
});

// --- Cerrar modales al clicar fuera ---
window.onclick = function (event) {
  if (event.target == modal_login) modal_login.style.display = "none";
  if (event.target == alarm)       alarm.style.display       = "none";
  if (event.target == power_on)    power_on.style.display    = "none";
  if (event.target == power_off)   power_off.style.display   = "none";
};

window.onload = function () {
  checkSession();
  checkPermision();
};

// =============================================================================
//  SESIÓN
// =============================================================================

// --- Login: intenta primero el PLC; si falla, prueba las credenciales locales de config ---
function magcheck_login(user, password) {
  const plcResult = dixe_only_login(user, password);
  if (plcResult === true) return true;

  // PLC no disponible o credenciales incorrectas → fallback a devCredentials
  const devCreds = (CLIENT_CONFIG && CLIENT_CONFIG.devCredentials) || [];
  const match = devCreds.find(c => c.user === user && c.password === password);
  if (match) {
    document.cookie = "magcheck_user=" + user + "; path=/";
    return true;
  }
  return false;
}

function magcheck_logout() {
  const devCreds = (CLIENT_CONFIG && CLIENT_CONFIG.devCredentials) || [];
  if (devCreds.length > 0) {
    // Borra la cookie manualmente
    document.cookie = "magcheck_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  } else {
    dixe_forget();
  }
}

function magcheck_user() { return readCookie("magcheck_user"); }

$('#loginForm').submit(function () {
  login_Validation();
  return false;
});

function login_Validation() {
  const user     = $('#login-username').val();
  const password = $('#login-password').val();

  if (magcheck_login(user, password) === true) {
    username.style.display = "block";
    $("#login_username").html(`<i class="fa fa-user"></i> ${user}`);
    logout.style.display   = "block";
    $("#login_logout").html('<i class="fa fa-power-off"></i>');
    button_login.style.display = "none";
    modal_login.style.display  = "none";
    window.location.reload();
  } else {
    error.style.display = "block";
  }
}

function checkSession() {
  const user = magcheck_user();
  if (user == null) {
    button_login.style.display = "block";
    username.style.display     = "none";
    logout.style.display       = "none";
  } else {
    button_login.style.display = "none";
    username.style.display     = "block";
    $("#login_username").html(`<i class="fa fa-user"></i> ${user}`);
    logout.style.display       = "block";
    $("#login_logout").html('<i class="fa fa-power-off"></i>');
  }
  return user;
}

function logOut() {
  magcheck_logout();
  window.location.reload();
}

// =============================================================================
//  ACCORDION
// =============================================================================

$(function () {
  $('.intar-accordion .content').hide();
  $('.intar-accordion h5').click(function () {
    if ($(this).next().is(':hidden')) {
      $('.content').height("auto");
      $('.intar-accordion h5').removeClass('active').next().slideUp('slow');
      $(this).toggleClass('active').next().slideDown('slow');
    } else if (this.className == 'active') {
      $(this).removeClass('active').next().slideUp('slow');
    }
  });
});

// =============================================================================
//  PERMISOS  (leídos desde CLIENT_CONFIG.permisos)
// =============================================================================

function checkPermision() {
  const user     = magcheck_user();
  const permisos = (CLIENT_CONFIG && CLIENT_CONFIG.permisos) || {};
  if (!user || !permisos[user]) return;

  permisos[user].forEach(elementId => {
    try {
      const el = document.getElementById(elementId);
      if (el) el.style.display = "none";
    } catch (e) { /* el elemento no existe en esta página, ignorar */ }
  });
}