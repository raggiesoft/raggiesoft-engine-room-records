/**
 * @license MIT
 * err-client.js — Progressive Enhancement for engineroom.raggiesoft.com
 * Implements Modern Web Guidance dark-mode-toggle, mobile navigation drawer,
 * and DSP verification instant filtering.
 */
(function () {
  var meta = document.querySelector('meta[name="color-scheme"]');
  var toggleBtn = document.getElementById('theme-toggle');
  var toggleLabel = document.getElementById('theme-toggle-label');
  var mobileToggle = document.getElementById('mobile-menu-toggle');
  var primaryNav = document.getElementById('primary-navigation');

  if (mobileToggle && primaryNav) {
    mobileToggle.addEventListener('click', function () {
      var expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      primaryNav.classList.toggle('is-open', !expanded);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        mobileToggle.setAttribute('aria-expanded', 'false');
        primaryNav.classList.remove('is-open');
        mobileToggle.focus();
      }
    });
  }

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
    toggleLabel.textContent = current === 'dark' ? '🌙 Dark' : '☀️ Light';
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
  var visibleCountEl = document.getElementById('dsp-visible-count');
  var resetBtn = document.getElementById('dsp-reset-filter-btn');
  var artistClaimSection = document.getElementById('dsp-artist-claim-section');
  var artistClaimTitle = document.getElementById('dsp-artist-claim-title');
  var artistClaimBody = document.getElementById('dsp-artist-claim-body');
  var trackAffidavitSection = document.getElementById('dsp-track-affidavit-section');
  var trackAffidavitTitle = document.getElementById('dsp-affidavit-track-title');
  var trackAffidavitSubtitle = document.getElementById('dsp-affidavit-subtitle');
  var trackAffidavitDetails = document.getElementById('dsp-affidavit-details');

  function normalizeArtistSlug(slug) {
    var s = String(slug || '').trim().toLowerCase();
    if (s === 'stardust-engine' || s === 'thestardustengine') return 'the-stardust-engine';
    if (s === 'fracturedprisms') return 'fractured-prisms';
    if (s === 'paper-wall' || s === 'mirage' || s === 'thepaperwall') return 'the-paper-wall';
    if (s === 'arctic-symphony-project' || s === 'winter-palace' || s === 'the-winter-palace') return 'the-arctic-symphony-project';
    if (s === 'crimsonnode') return 'crimson-node';
    if (s === 'manacanvas') return 'mana-canvas';
    if (s === 'hoshizora-ensemble' || s === 'hoshizora' || s === 'thehoshizoraensemble') return 'the-hoshizora-ensemble';
    return s;
  }

  var ARTIST_NAMES = {
    'the-stardust-engine': 'The Stardust Engine',
    'fractured-prisms': 'Fractured Prisms',
    'the-paper-wall': 'The Paper Wall',
    'the-arctic-symphony-project': 'The Arctic Symphony Project',
    'crimson-node': 'Crimson Node',
    'mana-canvas': 'Mana Canvas',
    'the-hoshizora-ensemble': 'The Hoshizora Ensemble',
    'firelight': 'Firelight'
  };

  if (table) {
    var rows = Array.prototype.slice.call(table.querySelectorAll('tbody tr'));
    var params = new URLSearchParams(window.location.search);
    var rawArtist = params.get('artist') || '';
    var normArtist = normalizeArtistSlug(rawArtist);
    var paramAlbum = (params.get('album') || '').trim().toLowerCase();
    var paramTrack = (params.get('track') || '').trim().toLowerCase();

    if (rawArtist || paramAlbum || paramTrack) {
      if (resetBtn) resetBtn.style.display = 'inline-flex';
    }

    // Populate Artist / Album Direct Claim Banner if ?artist= or ?album= is provided
    if ((normArtist || paramAlbum) && artistClaimSection && artistClaimTitle && artistClaimBody) {
      var matchedAlbumRow = null;
      for (var j = 0; j < rows.length; j++) {
        var rowItem = rows[j];
        var rowArtist = (rowItem.getAttribute('data-artist') || '').toLowerCase();
        var rowAlbum = (rowItem.getAttribute('data-album') || '').toLowerCase();
        if ((!normArtist || rowArtist === normArtist) && (!paramAlbum || rowAlbum === paramAlbum)) {
          matchedAlbumRow = rowItem;
          break;
        }
      }
      var displayArtist =
        (matchedAlbumRow && matchedAlbumRow.getAttribute('data-artist-name')) ||
        ARTIST_NAMES[normArtist] ||
        rawArtist ||
        'Engine Room Records Artist';
      var displayAlbum =
        paramAlbum && matchedAlbumRow ? matchedAlbumRow.getAttribute('data-album-title') || '' : '';
      var displayUpc =
        paramAlbum && matchedAlbumRow ? matchedAlbumRow.getAttribute('data-upc') || '' : '';

      artistClaimTitle.textContent = displayAlbum
        ? 'Direct Release & Artist Claim Verification: ' + displayArtist + ' — ' + displayAlbum
        : 'Direct Artist Profile Claim Verification: ' + displayArtist;
      artistClaimBody.innerHTML =
        '<strong>Notice to Platform Verification Teams (DistroKid, DistributeMusic.ai, Apple Music for Artists, Spotify for Artists, Amazon Music for Artists, YouTube Music):</strong> ' +
        'You have been routed to this official Engine Room Records verification ledger via an authenticated domain or claim link for <strong>' +
        displayArtist +
        (displayAlbum ? ' — <em>' + displayAlbum + '</em>' + (displayUpc ? ' (UPC: <code>' + displayUpc + '</code>)' : '') : '') +
        '</strong>. This confirms that <strong>Michael P. Ragsdale</strong> (<code>dsp.operations@engineroom-records.com</code>) is the sole human creator, songwriter, producer, and 100% legal rights holder authorized to claim, distribute, and administer the official artist profile and catalog for <strong>' +
        displayArtist +
        '</strong> across both DistroKid and DistributeMusic.ai as well as all DSPs.';
      artistClaimSection.style.display = 'block';
    }

    // Populate Single-Track Affidavit if ?track= matches a row
    if (paramTrack && trackAffidavitSection && trackAffidavitTitle && trackAffidavitSubtitle && trackAffidavitDetails) {
      var matchedRow = null;
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        var rTrack = (r.getAttribute('data-track') || '').toLowerCase();
        var rAlbum = (r.getAttribute('data-album') || '').toLowerCase();
        var rArtist = (r.getAttribute('data-artist') || '').toLowerCase();
        if (rTrack === paramTrack && (!paramAlbum || rAlbum === paramAlbum) && (!normArtist || rArtist === normArtist)) {
          matchedRow = r;
          break;
        }
      }
      if (matchedRow) {
        var tTitle = matchedRow.getAttribute('data-track-title') || '';
        var aName = matchedRow.getAttribute('data-artist-name') || '';
        var alTitle = matchedRow.getAttribute('data-album-title') || '';
        var errId = matchedRow.getAttribute('data-err-id') || '';
        var isrc = matchedRow.getAttribute('data-isrc') || '';
        var upc = matchedRow.getAttribute('data-upc') || '';
        var dist = matchedRow.getAttribute('data-distributor') || '';
        var clr = matchedRow.getAttribute('data-clearance') || '';
        var rel = matchedRow.getAttribute('data-release-date') || '';

        trackAffidavitTitle.textContent = 'Verified Recording: "' + tTitle + '" — ' + aName;
        trackAffidavitSubtitle.textContent = 'Album: ' + alTitle + ' • Catalog ID: ' + errId + ' • ISRC: ' + isrc;
        trackAffidavitDetails.innerHTML =
          '<div class="card" style="padding: 0.9rem;">' +
          '<div><strong>ISRC Code:</strong> <code>' + isrc + '</code></div>' +
          '<div><strong>Release UPC:</strong> <code>' + upc + '</code></div>' +
          '<div><strong>Catalog ID:</strong> <code>' + errId + '</code></div>' +
          '<div><strong>Release Date:</strong> ' + rel + '</div>' +
          '</div>' +
          '<div class="card" style="padding: 0.9rem;">' +
          '<div><strong>Legal Owner:</strong> Michael P. Ragsdale (<code>dsp.operations@engineroom-records.com</code>)</div>' +
          '<div><strong>US ISRC Agency Prefix:</strong> <code>QTAHP</code> (Registrant ID <code>185611</code>)</div>' +
          '<div><strong>Artist Persona:</strong> ' + aName + ' (Fictitious Project)</div>' +
          '<div><strong>Aggregator:</strong> ' + dist + '</div>' +
          '<div><strong>Commercial AI Clearance:</strong> ' + clr + '</div>' +
          '</div>';
        trackAffidavitSection.style.display = 'block';
      }
    }

    function filterByParamsAndSearch(q) {
      var needle = String(q || '').trim().toLowerCase();
      var shown = 0;
      rows.forEach(function (row) {
        var rArtist = (row.getAttribute('data-artist') || '').toLowerCase();
        var rAlbum = (row.getAttribute('data-album') || '').toLowerCase();
        var rTrack = (row.getAttribute('data-track') || '').toLowerCase();

        // If URL params are active and user hasn't typed a custom override, filter by URL params
        if (!needle && (normArtist || paramAlbum || paramTrack)) {
          var matchArtist = !normArtist || rArtist === normArtist;
          var matchAlbum = !paramAlbum || rAlbum === paramAlbum;
          var matchTrack = !paramTrack || rTrack === paramTrack;
          var ok = matchArtist && matchAlbum && matchTrack;
          row.style.display = ok ? '' : 'none';
          if (ok) shown++;
          return;
        }

        if (!needle) {
          row.style.display = '';
          shown++;
          return;
        }
        var text = (row.textContent || '').toLowerCase();
        var attrs = [rArtist, rAlbum, rTrack, row.getAttribute('data-isrc') || '', row.getAttribute('data-upc') || ''].join(' ').toLowerCase();
        var match = text.indexOf(needle) !== -1 || attrs.indexOf(needle) !== -1;
        row.style.display = match ? '' : 'none';
        if (match) shown++;
      });
      if (visibleCountEl) visibleCountEl.textContent = String(shown);
    }

    if (searchInput && (paramTrack || paramAlbum || normArtist)) {
      searchInput.placeholder = 'Filtered by URL (' + (paramTrack || paramAlbum || normArtist) + ') — type here to search all tracks...';
    }
    filterByParamsAndSearch('');

    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        filterByParamsAndSearch(e.target.value);
      });
    }
  }
})();
