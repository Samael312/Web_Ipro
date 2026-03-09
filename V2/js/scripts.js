// Get the modals
var modal_login = document.getElementById('login-modal');
var alarm = document.getElementById('alarm-modal');
var power_on = document.getElementById('on-modal');
var power_off = document.getElementById('off-modal');
// Buttons Login
var button_login = document.getElementById('login_button')
var username = document.getElementById('login_username')
var logout = document.getElementById('login_logout')
var error = document.getElementById('login-error')

window.addEventListener('DOMContentLoaded', event => {
  // Toggle the side navigation
  const sidebarToggle = document.body.querySelector('#sidebarToggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', event => {
      event.preventDefault();
      document.body.classList.toggle('sb-sidenav-toggled');
      localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
    });
  }
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal_login) modal_login.style.display = "none"
  if (event.target == alarm) alarm.style.display = "none"
  if (event.target == power_on) power_on.style.display = "none"
  if (event.target == power_off) power_off.style.display = "none"
}

window.onload = function () {
  checkSession();
  checkPermision();
}

// Funciones para Inciar Sesión
function magcheck_login(a, b) { return dixe_only_login(a, b); }
function magcheck_logout() { dixe_forget(); }
function magcheck_user() { return readCookie("magcheck_user"); }

$('#loginForm').submit(function () {
  login_Validation();
  return false;
});

function login_Validation() {
  var user = $('#login-username').val();
  var password = $('#login-password').val();

  already_logged = magcheck_login(user, password);

  if (already_logged == true) {
    username.style.display = "block";
    $("#login_username").html('<i class="fa fa-user" aria-hidden="true"></i> ' + user);
    logout.style.display = "block";
    $("#login_logout").html('<i class="fa fa-power-off" aria-hidden="true"></i>');
    button_login.style.display = "none";
    modal_login.style.display = "none"
    window.location.reload()
  } else {
    error.style.display = "block";
  }
};

function checkSession() {
  var user = magcheck_user();

  if (user == null) {
    button_login.style.display = "block";
    username.style.display = "none";
    logout.style.display = "none";
  } else {
    button_login.style.display = "none";
    username.style.display = "block";
    $("#login_username").html('<i class="fa fa-user" aria-hidden="true"></i> ' + user);
    logout.style.display = "block";
    $("#login_logout").html('<i class="fa fa-power-off" aria-hidden="true"></i>');
  }
  return user
};

function logOut() {
  magcheck_logout();	/*borro las cookies*/
  window.location.reload()
};

/*-----------------------------------------------------Funciones que generan elementos del DOM---------------------------------------------------*/
/*Generacion y funcionamiento del accordion de jQuery-ui*/
$(function () {
  //Al cargar el fichero oculta todas las secciones
  $('.intar-accordion .content').hide();
  //Al pulsar sobre una seccion, se despliega y se deja marcada, y se oculta y desmarca la anterior
  $('.intar-accordion h5').click(function () {
    if ($(this).next().is(':hidden')) {
      //Se ajusta el tamaño del contenido de cada seccion
      $('.content').height("auto");
      $('.intar-accordion h5').removeClass('active').next().slideUp('slow');
      $(this).toggleClass('active').next().slideDown('slow');
    }
    else if (this.className == 'active') {
      $(this).removeClass('active').next().slideUp('slow');
    }
  })
});

function checkPermision() {
  var user = magcheck_user();
  try {
    if (user === "Tech") {
      document.getElementById('write-default').style.display = "none";
      document.getElementById('simulator').style.display = "none";
    }
    if (user === "User") {
      document.getElementById('manage-param').style.display = "none";
      document.getElementById('manage-log').style.display = "none";
      document.getElementById('simulator').style.display = "none";
    }
  } catch { }
}