/**
 * ki-topnav.js — Componente reutilizable del top nav de kiControl.
 *
 * Uso en cualquier HTML (ki-head.js lo carga automáticamente):
 *   <ki-topnav></ki-topnav>
 *
 * No necesita atributos. Lee logos y título de CLIENT_CONFIG.
 */

(function () {
  'use strict';

  class KiTopnav extends HTMLElement {
    connectedCallback() {
      const render = () => {
        const cfg = window.CLIENT_CONFIG?.proyecto || {};

        this.innerHTML = `
          <nav class="sb-topnav navbar navbar-expand navbar-dark">

            <!-- Logo desktop -->
            <a class="ps-3 d-none d-sm-block" href="index.html">
              <img id="logo-desktop"
                   src="${cfg.logoAncho || 'assets/logos/Logo-blanco.png'}"
                   alt="Logo"
                   style="width:190px;" />
            </a>
            <!-- Logo móvil -->
            <a class="ps-3 d-block d-sm-none" href="index.html">
              <img id="logo-movil"
                   src="${cfg.logoMovil || ''}"
                   alt="Logo"
                   style="width:50px;" />
            </a>

            <button class="btn btn-link btn-sm m-3" id="sidebarToggle">
              <i style="font-size:18px;color:white;" class="fas fa-bars"></i>
            </button>

            <div class="ms-auto">
              <!-- Modal login -->
              <div id="login-modal" class="modal">
                <div class="modal-content">
                  <div class="container text-center">
                    <h2 class="text-center">Log In</h2>
                    <hr />
                    <form id="loginForm">
                      <input class="input-login" type="text"
                             placeholder="Username" id="login-username" />
                      <input class="input-login" type="password"
                             placeholder="Password" id="login-password" />
                      <span style="display:none;" id="login-error" class="text-danger">
                        * Username or password incorrect
                      </span>
                      <div class="login_form text-center mt-2">
                        <button type="submit" class="btn btn-primary">LOGIN</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <ul class="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                <li>
                  <span class="nav-link intar-icon" style="display:none;">
                    ALARMA//<i style="color:red;font-size:25px;" class="fa fa-bell"></i>/10
                  </span>
                </li>
                <li>
                  <span class="nav-link intar-icon" style="display:none;">
                    WARNING//<i style="color:yellow;font-size:25px;" class="fa fa-exclamation-triangle"></i>/10
                  </span>
                </li>
                <li>&nbsp;&nbsp;&nbsp;</li>
                <li style="color:white;font-weight:bold;font-size:large;display:none;"
                    class="nav-link" id="login_username"></li>
                <li style="color:white;font-weight:bold;font-size:large;display:none;"
                    class="nav-link" id="login_logout"
                    role="button" onclick="logOut()">
                  <i class="fa fa-power-off"></i>
                </li>
                <li style="color:white;font-weight:bold;font-size:large;"
                    class="nav-link" role="button"
                    onclick="document.getElementById('login-modal').style.display='block'"
                    id="login_button">
                  LOGIN
                </li>
              </ul>
            </div>
          </nav>`;
      };

      if (window._kiConfigReady) {
        render();
      } else {
        window.addEventListener('ki:config-ready', render, { once: true });
      }
    }
  }

  customElements.define('ki-topnav', KiTopnav);
})();