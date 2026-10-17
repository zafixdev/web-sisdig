// ===== shell.js: header, navigasi, footer, dan pager bersama antar-halaman =====
(function () {
  const WEEK_TITLES = {
    1: 'Pendahuluan & Konversi Bilangan',
    2: 'Bilangan Negatif & Operasi Biner',
    3: 'Aljabar Boolean & Gerbang Logika',
    4: 'Penyederhanaan Karnaugh Map',
    5: 'Adder & Subtractor',
    6: 'NAND/NOR & Multiplexer',
    7: 'Decoder, Encoder & 7-Segmen',
    8: 'Latch, Flip-Flop & Counter',
    9: 'Register',
    10: 'Machine State (FSM)',
    11: 'Memori',
    12: 'ADC/DAC & PLD',
    13: 'Proyek Mini Sistem Digital',
    14: 'Review Semester & Tryout UAS'
  };
  const TOTAL = 14;
  const cur = Number(document.body.dataset.week || 0);

  // ---- Header ----
  const headerHost = document.getElementById('app-header');
  if (headerHost) {
    headerHost.className = 'header';
    headerHost.innerHTML = `
      <div class="header-content">
        <div class="header-top">
          <a class="logo" href="index.html">
            <span class="logo-icon">🔢</span>
            <h1>Media Ajar Sistem Digital</h1>
          </a>
          <button class="theme-toggle" id="theme-toggle" title="Ganti terang/gelap">🌙 Dark</button>
        </div>
        <p class="subtitle">Mata Kuliah: Sistem Digital | Semester 1 (3 SKS)</p>
      </div>`;
  }

  // ---- Navigasi minggu ----
  const navHost = document.getElementById('app-nav');
  if (navHost) {
    navHost.className = 'tab-navigation';
    let links = `<a class="tab-btn${cur === 0 ? ' active' : ''}" href="index.html">🏠 Beranda</a>`;
    for (let n = 1; n <= 7; n++) {
      links += `<a class="tab-btn${n === cur ? ' active' : ''}" href="minggu${n}.html" title="Minggu ${n}: ${WEEK_TITLES[n]}">Minggu ${n}</a>`;
    }
    links += `<a class="tab-btn has-more${cur > 7 ? ' active' : ''}" href="minggu8.html">Minggu 8–14 ▾</a>`;
    navHost.innerHTML = `<div class="tab-container">${links}</div>`;
  }

  // ---- Footer ----
  const footerHost = document.getElementById('app-footer');
  if (footerHost) {
    footerHost.className = 'footer';
    footerHost.innerHTML = '<p>© 2026 Media Ajar Sistem Digital — dibuat untuk pembelajaran mandiri.</p>';
  }

  // ---- Pager (sebelum/sesudah minggu) ----
  const main = document.querySelector('.main-content');
  if (main && cur >= 1) {
    const pager = document.createElement('nav');
    pager.className = 'week-pager no-print';
    const prev = cur > 1
      ? `<a class="pager-link" href="minggu${cur - 1}.html">‹ Minggu ${cur - 1}: ${WEEK_TITLES[cur - 1]}</a>`
      : `<a class="pager-link" href="index.html">‹ Beranda / Silabus</a>`;
    const next = cur < TOTAL
      ? `<a class="pager-link next" href="minggu${cur + 1}.html">Minggu ${cur + 1}: ${WEEK_TITLES[cur + 1]} ›</a>`
      : `<a class="pager-link next" href="index.html">Selesai — kembali ke Silabus ›</a>`;
    pager.innerHTML = prev + next;
    main.appendChild(pager);
  }
})();
