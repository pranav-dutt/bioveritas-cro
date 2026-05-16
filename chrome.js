// ─────────────────────────────────────────────────────────────────────────────
// BioVeritas — shared site chrome (header + footer)
// Pages have <div id="site-header"></div> / <div id="site-footer"></div>
// placeholders; this fills them so nav stays consistent across pages.
// Each page sets <body data-page="services"> etc. so the active nav item
// can be highlighted.
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  const NAV = [
    { id: 'home',     label: 'Home',     href: 'index.html' },
    { id: 'about',    label: 'About',    href: 'about.html' },
    { id: 'services', label: 'Services', href: 'services.html' },
    { id: 'projects', label: 'Projects', href: 'projects.html' },
    { id: 'blog',     label: 'Insights', href: 'blog.html' },
    { id: 'contact',  label: 'Contact',  href: 'contact.html' },
  ];

  const active = document.body.dataset.page || '';
  const arrow = '<svg class="arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';

  const header = `
    <header class="site-header">
      <div class="wrap header-inner">
        <a class="brand" href="index.html" aria-label="BioVeritas CRO home">
          <img src="assets/bioveritas-logo.jpg" alt="BioVeritas" />
        </a>
        <nav class="nav" aria-label="Primary">
          ${NAV.map(n => `<a href="${n.href}" class="${active === n.id ? 'active' : ''}">${n.label}</a>`).join('')}
        </nav>
        <div class="cta-row">
          <a class="btn btn-ghost" href="contact.html">Brief us</a>
          <a class="btn btn-primary" href="contact.html">Start a study${arrow}</a>
        </div>
      </div>
    </header>
  `;

  const footer = `
    <footer class="site-footer" data-screen-label="Footer">
      <div class="wrap">
        <div class="foot-grid">
          <div class="foot-brand">
            <div class="brand-wordmark">Bio<em>Veritas</em></div>
            <p>Independent contract research organization supporting regulated science from non-clinical research through clinical trials and regulatory readiness.</p>
            <p style="margin-top:18px; font-size:13px;">
              Ground Floor, B-14, Sector-132<br/>
              Noida, Uttar Pradesh, India
            </p>
          </div>
          <div class="foot-col">
            <h5>Services</h5>
            <ul>
              <li><a href="service-detail.html">Pre-clinical</a></li>
              <li><a href="service-detail.html">Toxicology</a></li>
              <li><a href="service-detail.html">Bioanalytical</a></li>
              <li><a href="service-detail.html">Clinical trials</a></li>
              <li><a href="service-detail.html">Regulatory</a></li>
              <li><a href="service-detail.html">NPD</a></li>
            </ul>
          </div>
          <div class="foot-col">
            <h5>Company</h5>
            <ul>
              <li><a href="about.html">About</a></li>
              <li><a href="services.html">Services</a></li>
              <li><a href="projects.html">Projects</a></li>
              <li><a href="blog.html">Insights</a></li>
              <li><a href="contact.html">Contact</a></li>
            </ul>
          </div>
          <div class="foot-col">
            <h5>Get in touch</h5>
            <ul>
              <li><a href="mailto:bioveritascro@gmail.com">bioveritascro@gmail.com</a></li>
              <li><a href="tel:+919910663681">+91 99106 63681</a></li>
              <li style="margin-top:8px; color: rgba(255,255,255,0.5); font-size:12.5px;">
                Office hours<br/>Mon – Fri · 09:30 – 18:30 IST
              </li>
            </ul>
          </div>
        </div>
        <div class="foot-bottom">
          <div>© 2026 BioVeritas CRO Private Limited. Science. Verified.</div>
          <div class="legal">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Quality policy</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  `;

  const h = document.getElementById('site-header');
  const f = document.getElementById('site-footer');
  if (h) h.outerHTML = header;
  if (f) f.outerHTML = footer;

  // ── Tweaks FAB — inject on every page ────────────────────────────────────
  const fab = document.createElement('button');
  fab.id = 'tweak-fab';
  fab.setAttribute('aria-label', 'Open Tweaks panel');
  fab.setAttribute('title', 'Open Tweaks');
  fab.textContent = '✦';
  fab.style.cssText = [
    'position:fixed', 'bottom:72px', 'right:16px', 'z-index:2147483645',
    'width:44px', 'height:44px', 'border-radius:50%', 'border:none',
    'cursor:pointer', 'background:#0E2A47', 'color:#fff', 'font-size:18px',
    'box-shadow:0 2px 12px rgba(0,0,0,0.25)',
    'display:flex', 'align-items:center', 'justify-content:center',
    'transition:background .15s,transform .15s,bottom .2s',
  ].join(';');
  document.body.appendChild(fab);

  var panelOpen = false;

  function syncFab() {
    fab.style.background = panelOpen ? '#2A8A8E' : '#0E2A47';
    fab.style.transform = panelOpen ? 'rotate(45deg)' : 'rotate(0deg)';
    fab.setAttribute('title', panelOpen ? 'Close Tweaks' : 'Open Tweaks');
    fab.style.bottom = panelOpen ? '336px' : '72px';
  }

  fab.addEventListener('click', function () {
    panelOpen = !panelOpen;
    syncFab();
    window.dispatchEvent(new CustomEvent('toggleTweakPanel', { detail: panelOpen }));
  });

  // Keep FAB in sync when panel is dismissed via its own ✕ button
  window.addEventListener('tweakPanelClosed', function () {
    panelOpen = false;
    syncFab();
  });

  // Hide FAB when running inside a host frame (host manages the toggle)
  window.addEventListener('message', function (e) {
    if (e.data && e.data.type === '__activate_edit_mode') {
      fab.style.display = 'none';
    } else if (e.data && e.data.type === '__deactivate_edit_mode') {
      fab.style.display = 'flex';
    }
  });
})();
