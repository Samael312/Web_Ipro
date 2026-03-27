/**
 * sidebar.js — Componente reutilizable del sidebar de kiControl.
 *
 * Uso en cualquier HTML:
 *   <script src="js/sidebar.js"></script>
 *   <ki-sidebar active="status"></ki-sidebar>
 *
 * El atributo `active` debe coincidir con el valor `data-page` de cada enlace
 * definido en SIDEBAR_LINKS (ver abajo).  Si se omite, ningún enlace queda activo.
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     Definición de enlaces del sidebar.
     Para añadir / quitar secciones, edita solo aquí.
  ───────────────────────────────────────────── */
  const SIDEBAR_LINKS = [
    {
      page:  'index',
      href:  'index.html',
      icon:  'fa fa-home',
      label: 'PRINCIPAL',
    },
    {
      page:  'status',
      href:  'status.html',
      icon:  'fa fa-tachometer',
      label: 'ESTADO',
    },
    {
      page:  'alarms',
      href:  'alarms.html',
      icon:  'fa fa-bell',
      label: 'ALARMAS',
      /* Inyecta el badge de alarma activa al icono */
      iconExtra: `<span class='intar-icon' style="display:none;">ALARMA///10 </span>`,
    },
    {
      page:  'input-output',
      href:  'input-output.html',
      icon:  'fa fa-toggle-off',
      label: 'ENTRADAS/SALIDAS',
    },
    {
      page:  'graphs',
      href:  'graphs.html',
      icon:  'fa fa-area-chart',
      label: 'GRAFICAS',
    },
    {
      page:     'parameters',
      icon:     'fa fa-sliders',
      label:    'PARAMETROS',
      children: [
        { page: 'parameters',    href: 'parameters.html',    icon: 'fa fa-bars', label: 'CONFIGURACION PARAMETROS' },
        { page: 'parameters-io', href: 'parameters-io.html', icon: 'fa fa-bars', label: 'CONFIGURACION E/S' },
      ],
    },
    {
      page:  'commands',
      href:  'commands.html',
      icon:  'fa fa-terminal',
      label: 'COMANDOS',
    },
    { divider: true },
    {
      page:  'panel',
      href:  '/panel/index.html',
      icon:  'fa fa-columns',
      label: 'PANEL DE CONTROL',
    },
  ];

  /* ─────────────────────────────────────────────
     Generador de HTML
  ───────────────────────────────────────────── */
  function buildLinks(links, activePage) {
    return links.map((item, i) => {
      /* Separador */
      if (item.divider) return '<hr>';

      const isActive        = item.page === activePage;
      const activeClass     = isActive ? ' active' : '';
      const iconExtra       = item.iconExtra || '';

      /* Enlace con hijos (acordeón) */
      if (item.children) {
        const collapseId    = `collapse-${item.page}-${i}`;
        const childActive   = item.children.some(c => c.page === activePage);
        const expandedClass = childActive ? 'show' : '';
        const ariaExpanded  = childActive ? 'true' : 'false';

        const childLinks = item.children.map(child => {
          const ca = child.page === activePage ? ' active' : '';
          return `
            <a style="color:white;" class="nav-link${ca}" href="${child.href}">
              <div class="sb-nav-link-icon"><i style="font-size:20px;" class="${child.icon}"></i></div>
              ${child.label}
            </a>`;
        }).join('');

        return `
          <a style="color:white;" class="nav-link${activeClass} collapsed"
             data-bs-toggle="collapse" data-bs-target="#${collapseId}"
             aria-expanded="${ariaExpanded}" aria-controls="${collapseId}">
            <div class="sb-nav-link-icon"><i style="font-size:20px;" class="${item.icon}"></i></div>
            ${item.label}
            <div class="sb-sidenav-collapse-arrow">
              <i style="color:white;" class="fas fa-angle-down"></i>
            </div>
          </a>
          <div class="collapse ${expandedClass}" id="${collapseId}"
               aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
            <nav class="sb-sidenav-menu-nested nav">
              ${childLinks}
            </nav>
          </div>`;
      }

      /* Enlace simple */
      return `
        <a style="color:white;" class="nav-link${activeClass}" href="${item.href}">
          <div class="sb-nav-link-icon">
            <i id="${item.page === 'alarms' ? 'alarm' : ''}"
               style="font-size:20px;" class="${item.icon}"></i>
            ${iconExtra}
          </div>
          ${item.label}
        </a>`;
    }).join('\n');
  }

  /* ─────────────────────────────────────────────
     Web Component
  ───────────────────────────────────────────── */
  class KiSidebar extends HTMLElement {
    connectedCallback() {
      const activePage = this.getAttribute('active') || '';

      /* Espera a que CLIENT_CONFIG esté disponible (config.js se carga antes) */
      const render = () => {
        const cfg  = window.CLIENT_CONFIG?.proyecto || {};
        const year = cfg.año || new Date().getFullYear();

        this.innerHTML = `
          <div id="layoutSidenav_nav">
            <nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
              <div class="sb-sidenav-menu">
                <div class="nav">
                  ${buildLinks(SIDEBAR_LINKS, activePage)}
                </div>
              </div>
              <div class="sb-sidenav-footer">
                <div class="text-center">
                  <a href="https://www.kiconex.com" target="_blank"
                     style="text-decoration:none;color:white;font-weight:bold;">
                    KICONEX — ${year}
                  </a>
                </div>
              </div>
            </nav>
          </div>`;
      };

      if (window._kiConfigReady) {
        render();
      } else {
        window.addEventListener('ki:config-ready', render, { once: true });
      }
    }

    /* Permite cambiar la página activa dinámicamente si se necesita */
    static get observedAttributes() { return ['active']; }
    attributeChangedCallback() { if (this.isConnected) this.connectedCallback(); }
  }

  customElements.define('ki-sidebar', KiSidebar);
})();