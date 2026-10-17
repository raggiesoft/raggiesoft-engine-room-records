/**
 * @license MIT
 * err-client.js — Progressive Enhancement for engineroom.raggiesoft.com
 * Implements Modern Web Guidance dark-mode-toggle (two-state override reverting
 * to system default when matching OS preference) and DSP verification filtering.
 */
(function () {
  var meta = document.querySelector('meta[name="color-scheme"]');
  var toggleBtn = document.getElementById('theme-toggle');
  var toggleLabel = document.getElementById('theme-toggle-label');

  function getSystemScheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function getRenderedScheme() {
    var stored = null;
    try {
      stored = localStorage.getItem('color-scheme');
    } catch (e) {}
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return getSystemScheme();
  }

  function updateButtonLabel() {
    var current = getRenderedScheme();
    document.documentElement.setAttribute('data-bs-theme', current);
    if (!toggleLabel) return;
    var stored = null;
    try {
      stored = localStorage.getItem('color-scheme');
    } catch (e) {}
    if (stored === 'light' || stored === 'dark') {
      toggleLabel.textContent = current === 'dark' ? '🌙 Dark (Pinned)' : '☀️ Light (Pinned)';
    } else {
      toggleLabel.textContent = current === 'dark' ? '🌙 System (Dark)' : '☀️ System (Light)';
    }
  }

  if (toggleBtn && meta) {
    updateButtonLabel();
    toggleBtn.addEventListener('click', function () {
      var current = getRenderedScheme();
      var target = current === 'dark' ? 'light' : 'dark';
      var sys = getSystemScheme();
      try {
        if (target === sys) {
          localStorage.removeItem('color-scheme');
          meta.content = 'light dark';
        } else {
          localStorage.setItem('color-scheme', target);
          meta.content = target;
        }
      } catch (e) {
        meta.content = target;
      }
      updateButtonLabel();
    });

    window.addEventListener('storage', function (e) {
      if (e.key === 'color-scheme') {
        meta.content = e.newValue || 'light dark';
        updateButtonLabel();
      }
    });
  }

  // DSP Verification table instant filter + URL query param filter (?artist=, ?album=, ?track=)
  var searchInput = document.getElementById('dsp-search');
  var table = document.getElementById('dsp-ledger-table');
  if (table) {
    var rows = Array.prototype.slice.call(table.querySelectorAll('tbody tr'));
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('track') || params.get('album') || params.get('artist') || '';
    if (searchInput && initialQuery) {
      searchInput.value = initialQuery;
    }

    function filterRows(q) {
      var needle = String(q || '').trim().toLowerCase();
      rows.forEach(function (row) {
        if (!needle) {
          row.style.display = '';
          return;
        }
        var text = (row.textContent || '').toLowerCase();
        var attrs = [
          row.getAttribute('data-artist') || '',
          row.getAttribute('data-album') || '',
          row.getAttribute('data-track') || ''
        ].join(' ').toLowerCase();
        row.style.display = text.indexOf(needle) !== -1 || attrs.indexOf(needle) !== -1 ? '' : 'none';
      });
    }

    if (initialQuery) {
      filterRows(initialQuery);
    }
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        filterRows(e.target.value);
      });
    }
  }
})();
