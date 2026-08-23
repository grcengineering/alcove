/* ============================================================================
   ALCOVE — alcove.grc.engineering
   Vanilla JS, no dependencies. Three jobs:
     1. theme toggle (light → dark → system), matching the GRCE convention
     2. header scroll state
     3. the assurance-timeline motif: the hero backdrop and the live
        "historical control monitoring metrics" demonstration
   ============================================================================ */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------ THEME ---- */

  function systemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function applyTheme(pref) {
    var theme = pref === 'system' ? systemTheme() : pref;
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-theme-preference', pref);
  }

  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    var order = ['light', 'dark', 'system'];
    toggle.addEventListener('click', function () {
      var current;
      try { current = localStorage.getItem('grc-theme') || 'system'; } catch (e) { current = 'system'; }
      var next = order[(order.indexOf(current) + 1) % order.length];
      try { localStorage.setItem('grc-theme', next); } catch (e) {}
      applyTheme(next);
      toggle.setAttribute('title', 'Theme: ' + next);
    });
  }

  /* ----------------------------------------------------------- HEADER ---- */

  var header = document.getElementById('site-header');
  if (header) {
    var onScroll = function () {
      header.setAttribute('data-scrolled', window.scrollY > 8 ? 'true' : 'false');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --------------------------------------------------- HERO BACKDROP ---- */
  /* Rows of day-cells drifting left. Deliberately abstract: it is the shape
     of a control's history, not a claim about any real control. */

  var backdrop = document.getElementById('hero-backdrop');
  if (backdrop && !reduceMotion) {
    var ROWS = 7;
    var PER_ROW = 90;         // rendered twice for a seamless -50% drift
    var frag = document.createDocumentFragment();

    for (var r = 0; r < ROWS; r++) {
      var track = document.createElement('div');
      track.className = 'track';
      track.style.animationDuration = (58 + r * 11) + 's';
      track.style.opacity = String(0.85 - r * 0.09);

      for (var pass = 0; pass < 2; pass++) {
        for (var c = 0; c < PER_ROW; c++) {
          var cell = document.createElement('span');
          // Deterministic-looking texture from a cheap hash — no Math.random,
          // so every visitor sees the same backdrop.
          var h = (c * 2654435761 + r * 40503) % 1000;
          var cls = 'cell';
          if (h < 22) cls += ' fail';
          else if (h < 96) cls += ' risk';
          else if (h < 150) cls += ' void';
          cell.className = cls;
          track.appendChild(cell);
        }
      }
      frag.appendChild(track);
    }
    backdrop.appendChild(frag);
  }

  /* ------------------------------------------ THE REPORTING ARTIFACT ---- */

  var DAYS = 180;

  // Deterministic, illustrative history. `risk`/`fail`/`void` hold day offsets
  // counted back from today (0 = today). The first two controls reproduce the
  // proposal's own mock; the third is currently degraded on purpose — an honest
  // artifact leaves a failing control on the page.
  var CONTROLS = [
    {
      name: 'Phishing-resistant MFA enforced for employee SSO authentication',
      uptime: '99.94%',
      state: 'pass',
      risk: [4, 11],
      fail: [],
      void: []
    },
    {
      name: 'Plaintext secrets prevented from storage in version control systems',
      uptime: '100.0%',
      state: 'pass',
      risk: [],
      fail: [],
      void: [92, 118]
    },
    {
      name: 'Production data stores encrypted at rest',
      uptime: '97.2%',
      state: 'fail',
      risk: [5, 6],
      fail: [0, 1, 2, 3, 4],
      void: []
    },
    {
      name: 'Public API domains covered by the web application firewall',
      uptime: '99.1%',
      state: 'pass',
      risk: [38, 39, 40, 41],
      fail: [],
      void: []
    }
  ];

  var STATE_LABEL = {
    pass: 'operating effectively',
    risk: 'degraded',
    fail: 'not operating effectively',
    void: 'no evidence recorded'
  };

  var ICON = {
    pass: '<path d="M4 12.5 9.5 18 20 6.5"/>',
    fail: '<path d="M12 8v5"/><path d="M12 16.5v.01"/><path d="M10.3 3.6 2.5 17a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0Z"/>'
  };

  function fmt(date) {
    return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function buildControl(ctrl) {
    var riskSet = new Set(ctrl.risk);
    var failSet = new Set(ctrl.fail);
    var voidSet = new Set(ctrl.void);

    var wrap = document.createElement('div');
    wrap.className = 'ctrl';

    var top = document.createElement('div');
    top.className = 'ctrl-top';

    var name = document.createElement('span');
    name.className = 'ctrl-name';
    var pipColor = ctrl.state === 'fail' ? 'var(--strip-fail)' : 'var(--strip-pass)';
    name.innerHTML =
      '<span class="pip" style="background:' + pipColor + '" aria-hidden="true"></span>' +
      '<span></span>';
    name.lastElementChild.textContent = ctrl.name;

    var uptime = document.createElement('span');
    uptime.className = 'ctrl-uptime';
    uptime.style.color = ctrl.state === 'fail' ? 'var(--status-fail-fg)' : 'var(--status-pass-fg)';
    uptime.textContent = ctrl.uptime + ' effective';

    top.appendChild(name);
    top.appendChild(uptime);

    var strip = document.createElement('div');
    strip.className = 'strip';
    strip.setAttribute('role', 'img');
    strip.setAttribute('aria-label',
      ctrl.name + ' — ' + ctrl.uptime + ' of the last ' + DAYS + ' days operating effectively' +
      (ctrl.fail.length ? ', currently not operating effectively' : ''));

    var today = new Date();
    for (var i = DAYS - 1; i >= 0; i--) {
      var day = document.createElement('span');
      var state = failSet.has(i) ? 'fail' : riskSet.has(i) ? 'risk' : voidSet.has(i) ? 'void' : 'pass';
      day.className = 'day' + (state === 'pass' ? '' : ' ' + state);
      day.tabIndex = 0;

      var d = new Date(today.getTime());
      d.setDate(d.getDate() - i);
      day.setAttribute('data-label', fmt(d) + ' — ' + STATE_LABEL[state]);
      day.style.setProperty('--d', ((DAYS - 1 - i) * 4) + 'ms');
      strip.appendChild(day);
    }

    var axis = document.createElement('div');
    axis.className = 'strip-axis';
    axis.innerHTML = '<span>180 days ago</span><span>Today</span>';

    wrap.appendChild(top);
    wrap.appendChild(strip);
    wrap.appendChild(axis);
    return wrap;
  }

  var host = document.getElementById('controls');
  if (host) {
    var f = document.createDocumentFragment();
    CONTROLS.forEach(function (c) { f.appendChild(buildControl(c)); });
    host.appendChild(f);

    // Summary reflects the actual data rather than a hard-coded boast.
    var failing = CONTROLS.filter(function (c) { return c.state === 'fail'; }).length;
    var okCount = CONTROLS.length - failing;
    var summary = document.getElementById('artifact-summary');
    var summaryText = document.getElementById('artifact-summary-text');
    if (summary && summaryText) {
      summaryText.textContent = failing === 0
        ? 'All controls operating effectively'
        : okCount + ' of ' + CONTROLS.length + ' controls operating effectively';
      if (failing > 0) {
        summary.style.color = 'var(--status-fail-fg)';
        var ring = summary.querySelector('.ring');
        var svg = summary.querySelector('svg');
        if (ring) ring.style.background = 'var(--status-fail-bg)';
        if (svg) { svg.innerHTML = ICON.fail; svg.setAttribute('stroke-width', '2.2'); }
      }
    }

    // Draw the strips in when they scroll into view — the point of the section
    // is that a control's effectiveness is a time series, so it arrives as one.
    var artifact = document.getElementById('artifact');
    if (artifact) {
      if (reduceMotion || !('IntersectionObserver' in window)) {
        artifact.classList.add('is-live');
      } else {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-live');
              io.unobserve(entry.target);
            }
          });
        }, { threshold: 0.18 });
        io.observe(artifact);
      }
    }
  }
})();
