// ===== Minggu 8-13: Sekuensial, FSM, Memori, ADC/DAC, Proyek =====
// memakai combTgl()/bin4() dari js/comb.js bila ada; fallback lokal bila tidak.
function seqTgl(id, init) {
  if (typeof combTgl === 'function') return combTgl(id, init);
  const el = document.getElementById(id);
  let v = init || 0;
  const paint = () => { el.textContent = el.textContent.split('=')[0] + '=' + v; el.classList.toggle('on', v === 1); };
  el.addEventListener('click', () => { v ^= 1; paint(); el.dispatchEvent(new Event('comb-change')); });
  paint();
  return { get: () => v };
}
function segHTML(onList) {
  const on = (s) => onList.includes(s);
  const seg = (id, h) => `<div class="seg ${h ? 'h' : 'v'} ${on(id) ? 'lit' : ''}">${id}</div>`;
  return `<div class="seg7">${seg('a', 1)}<div class="seg-row">${seg('f', 0)}${seg('b', 0)}</div>${seg('g', 1)}<div class="seg-row">${seg('e', 0)}${seg('c', 0)}</div>${seg('d', 1)}</div>`;
}
const SEG10 = ['abcdef', 'bc', 'abged', 'abgcd', 'fgbc', 'afgcd', 'afgedc', 'abc', 'abcdefg', 'abcfgd'];

// ---- M8: SR latch NOR ----
(function () {
  if (!document.getElementById('w8-sr-s')) return;
  const S = seqTgl('w8-sr-s', 0), R = seqTgl('w8-sr-r', 0);
  let q = 0;
  const render = (msg) => {
    const s = S.get(), r = R.get();
    if (s && r) {
      document.getElementById('w8-sr-q').textContent = '?';
      document.getElementById('w8-sr-qn').textContent = '?';
      document.getElementById('w8-sr-steps').innerHTML = `<div class="step-item"><div class="step-number">Tak valid</div><div class="step-text">S=R=1 → Q=Q'=0, melanggar komplementer. <b>Hindari!</b></div></div>`;
    } else if (s) { q = 1; step(`S=1 → SET, Q=1`); }
    else if (r) { q = 0; step(`R=1 → RESET, Q=0`); }
    else step(msg || 'S=R=0 → HOLD (menyimpan nilai).');
  };
  const step = (t) => {
    document.getElementById('w8-sr-q').textContent = q;
    document.getElementById('w8-sr-qn').textContent = 1 - q;
    document.getElementById('w8-sr-steps').innerHTML = `<div class="step-item highlight"><div class="step-number">Q=${q}</div><div class="step-text">${t}</div></div>`;
  };
  ['w8-sr-s', 'w8-sr-r'].forEach(id => document.getElementById(id).addEventListener('comb-change', () => render()));
  document.getElementById('w8-sr-clk').addEventListener('click', () => { q = 0; render('Reset manual: Q=0.'); });
  render('Awal: Q=0.');
})();

// ---- M8: D latch ----
(function () {
  if (!document.getElementById('w8-dl-d')) return;
  const D = seqTgl('w8-dl-d', 0), EN = seqTgl('w8-dl-en', 1);
  let q = 0;
  const render = () => {
    const d = D.get(), en = EN.get();
    if (en) q = d;
    document.getElementById('w8-dl-out').textContent = `Q = ${q} (D=${d}, EN=${en})`;
    document.getElementById('w8-dl-steps').innerHTML = en
      ? `<div class="step-item highlight"><div class="step-number">Transparan</div><div class="step-text">EN=1 → Q mengikuti D → <b>Q=${q}</b>.</div></div>`
      : `<div class="step-item"><div class="step-number">Hold</div><div class="step-text">EN=0 → Q terkunci di <b>${q}</b> (D=${d} diabaikan).</div></div>`;
  };
  ['w8-dl-d', 'w8-dl-en'].forEach(id => document.getElementById(id).addEventListener('comb-change', render));
  render();
})();

// ---- M8: FF lab ----
(function () {
  const clk = document.getElementById('w8-ff-clock');
  if (!clk) return;
  const J = seqTgl('w8-ff-j', 0), K = seqTgl('w8-ff-k', 0);
  let q = 0;
  const log = [];
  const lbl = () => {
    const t = document.getElementById('w8-ff-type').value;
    document.getElementById('w8-ff-j').textContent = (t === 'JK' ? 'J=' : t === 'SR' ? 'S=' : t === 'T' ? 'T=' : 'D=') + J.get();
    document.getElementById('w8-ff-k').textContent = (t === 'JK' ? 'K=' : t === 'SR' ? 'R=' : '—=') + K.get();
  };
  document.getElementById('w8-ff-type').addEventListener('change', lbl);
  clk.addEventListener('click', () => {
    const t = document.getElementById('w8-ff-type').value, j = J.get(), k = K.get();
    const q0 = q;
    if (t === 'JK') q = (j && !q0) || (!k && q0) ? 1 : 0;
    else if (t === 'SR') { if (j && k) { log.unshift('S=R=1 tak valid!'); return paint(); } else if (j) q = 1; else if (k) q = 0; }
    else if (t === 'D') q = j;
    else if (t === 'T') q = j ? 1 - q0 : q0;
    log.unshift(`${t}: in=(${j},${k}) Q:${q0}→${q}`);
    paint();
  });
  const paint = () => {
    document.getElementById('w8-ff-out').textContent = `Q = ${q} (Q' = ${1 - q})`;
    document.getElementById('w8-ff-steps').innerHTML = log.slice(0, 6).map((l, i) =>
      `<div class="step-item${i === 0 ? ' highlight' : ''}"><div class="step-number">CLK ${log.length - i}</div><div class="step-text">${l}</div></div>`).join('') || '<p class="placeholder-text">Tekan Clock ↑.</p>';
  };
  document.getElementById('w8-ff-reset').addEventListener('click', () => { q = 0; log.length = 0; paint(); });
  lbl(); paint();
})();

// ---- M8: Counter ----
(function () {
  const clk = document.getElementById('w8-ct-clock');
  if (!clk) return;
  let v = 0;
  const log = [];
  const paint = (msg) => {
    const n = Number(document.getElementById('w8-ct-n').value);
    document.getElementById('w8-ct-out').textContent = `${v} (${v.toString(2).padStart(n, '0')})`;
    document.getElementById('w8-ct-steps').innerHTML = (msg ? `<div class="step-item highlight"><div class="step-number">Info</div><div class="step-text">${msg}</div></div>` : '') +
      log.slice(0, 6).map((l, i) => `<div class="step-item"><div class="step-number">${l}</div></div>`).join('');
  };
  clk.addEventListener('click', () => {
    const n = Number(document.getElementById('w8-ct-n').value);
    const dir = document.getElementById('w8-ct-dir').value;
    const mod = parseInt(document.getElementById('w8-ct-mod').value.trim(), 10) || 0;
    const max = mod > 0 ? mod : Math.pow(2, n);
    v = dir === 'up' ? v + 1 : v - 1;
    if (v >= max) v = 0;
    if (v < 0) v = max - 1;
    log.unshift(`CLK → ${v} (${v.toString(2).padStart(n, '0')})${mod > 0 ? ` mod-${mod}` : ''}`);
    paint();
  });
  document.getElementById('w8-ct-reset').addEventListener('click', () => { v = 0; log.length = 0; paint('Reset ke 0.'); });
  paint();
})();

// ---- M9: PIPO ----
(function () {
  const load = document.getElementById('w9-pipo-load');
  if (!load) return;
  const B = [3, 2, 1, 0].map(i => seqTgl('w9-pipo-b' + i, 0));
  let q = '0000';
  const paint = (msg) => {
    document.getElementById('w9-pipo-out').textContent = `Q = ${q} (${parseInt(q, 2)})`;
    document.getElementById('w9-pipo-steps').innerHTML = msg ? `<div class="step-item highlight"><div class="step-number">Info</div><div class="step-text">${msg}</div></div>` : '';
  };
  load.addEventListener('click', () => { q = B.map(b => b.get()).join(''); paint(`Load paralel: D=${q} → Q=${q} dalam 1 clock.`); });
  document.getElementById('w9-pipo-clear').addEventListener('click', () => { q = '0000'; paint('Clear: Q=0000.'); });
  paint();
})();

// ---- M9: Shift lab ----
(function () {
  const clk = document.getElementById('w9-sh-clock');
  if (!clk) return;
  let q = [0, 0, 0, 0], out = [];
  const paint = (msg) => {
    document.getElementById('w9-sh-out').textContent = `Q = ${q.join('')} (ser-out = ${q[3]})`;
    document.getElementById('w9-sh-steps').innerHTML = (msg ? `<div class="step-item highlight"><div class="step-number">Info</div><div class="step-text">${msg}</div></div>` : '') +
      out.slice(-6).reverse().map(o => `<div class="step-item"><div class="step-number">Keluar</div><div class="step-text">bit ${o}</div></div>`).join('');
  };
  clk.addEventListener('click', () => {
    const mode = document.getElementById('w9-sh-mode').value;
    const sin = Number(document.getElementById('w9-sh-sin').value);
    if (mode === 'PISO' && q.every(x => x === 0) && !clk.dataset.loaded) {
      const par = (document.getElementById('w9-sh-par').value || '0000').replace(/[^01]/g, '').padStart(4, '0').slice(-4).split('').map(Number);
      q = par; clk.dataset.loaded = '1';
      paint(`PISO load paralel ${q.join('')}. Clock berikutnya mulai menggeser keluar.`);
      return;
    }
    out.push(q[3]);
    q = [sin, q[0], q[1], q[2]];
    if (mode === 'SIPO') paint(`SIPO: Sin=${sin} masuk kiri → Q=${q.join('')}. Setelah 4 clock, paralel valid.`);
    else if (mode === 'SISO') paint(`SISO: keluar ${out[out.length - 1]}, Q=${q.join('')}.`);
    else paint(`PISO shift: keluar ${out[out.length - 1]}, Q=${q.join('')}.`);
  });
  document.getElementById('w9-sh-reset').addEventListener('click', () => { q = [0, 0, 0, 0]; out = []; delete clk.dataset.loaded; paint('Reset: Q=0000.'); });
  paint();
})();

// ---- M9: Ring ----
(function () {
  const clk = document.getElementById('w9-ring-clock');
  if (!clk) return;
  let q = [1, 0, 0, 0], n = 0;
  const paint = (msg) => {
    document.getElementById('w9-ring-out').textContent = `Q = ${q.join('')} (state ${n % 4})`;
    document.getElementById('w9-ring-steps').innerHTML = msg ? `<div class="step-item highlight"><div class="step-number">Info</div><div class="step-text">${msg}</div></div>` : '';
  };
  clk.addEventListener('click', () => { q = [q[3], q[0], q[1], q[2]]; n++; paint(`Putar ${n}: 1 bergeser → ${q.join('')}. 4 state berulang (mod-4).`); });
  document.getElementById('w9-ring-reset').addEventListener('click', () => { q = [1, 0, 0, 0]; n = 0; paint('Reset: 1000.'); });
  paint();
})();

// ---- M9: Universal ----
(function () {
  const clk = document.getElementById('w9-uni-clock');
  if (!clk) return;
  let q = [0, 0, 0, 0];
  const paint = (msg) => {
    document.getElementById('w9-uni-out').textContent = `Q = ${q.join('')} (${parseInt(q.join(''), 2)})`;
    document.getElementById('w9-uni-steps').innerHTML = msg ? `<div class="step-item highlight"><div class="step-number">S1S0</div><div class="step-text">${msg}</div></div>` : '';
  };
  clk.addEventListener('click', () => {
    const s1 = document.getElementById('w9-uni-s1').value, s0 = document.getElementById('w9-uni-s0').value;
    const ser = Number(document.getElementById('w9-uni-ser').value);
    const mode = s1 + s0;
    if (mode === '00') paint('00 hold: Q tetap.');
    else if (mode === '01') { q = [ser, q[0], q[1], q[2]]; paint(`01 shift kanan, ser=${ser} → ${q.join('')}.`); }
    else if (mode === '10') { q = [q[1], q[2], q[3], ser]; paint(`10 shift kiri, ser=${ser} → ${q.join('')}.`); }
    else { q = (document.getElementById('w9-uni-par').value || '0000').replace(/[^01]/g, '').padStart(4, '0').slice(-4).split('').map(Number); paint(`11 load paralel → ${q.join('')}.`); }
  });
  document.getElementById('w9-uni-reset').addEventListener('click', () => { q = [0, 0, 0, 0]; paint('Reset: 0000.'); });
  paint();
})();

// ---- M10: Detektor 101 ----
(function () {
  const btn = document.getElementById('w10-det-btn');
  if (!btn) return;
  let steps = [], idx = 0;
  const run = () => {
    const bits = (document.getElementById('w10-det-in').value || '').replace(/[^01]/g, '').split('');
    steps = []; let s = 0; idx = 0;
    bits.forEach((b, i) => {
      // Mealy 101 overlap: S0 --1--> S1, S1 --0--> S2, S2 --1--> hit+kembali S1
      let ns = s, hit = false;
      if (s === 0) ns = b === '1' ? 1 : 0;
      else if (s === 1) ns = b === '0' ? 2 : 1;
      else if (s === 2) { if (b === '1') { hit = true; ns = 1; } else ns = 0; }
      steps.push({ i, b, s, ns, hit });
      s = ns;
    });
    idx = 0;
    const nHit = steps.filter(x => x.hit).length;
    document.getElementById('w10-det-out').textContent = nHit ? `Terdeteksi ${nHit}× pola "101" (overlap)` : 'Tidak ada pola "101".';
    paint();
  };
  const paint = () => {
    document.getElementById('w10-det-step').textContent = `Langkah: ${idx}/${steps.length}`;
    document.getElementById('w10-det-steps').innerHTML = steps.slice(0, idx).map(x =>
      `<div class="step-item${x.hit ? ' highlight' : ''}"><div class="step-number">bit${x.i}=${x.b}</div><div class="step-text">S${x.s} → S${x.ns}${x.hit ? ' → <b>DETEKSI! output=1</b>' : ''}</div></div>`).join('') || '<p class="placeholder-text">Tekan Langkah untuk majukan FSM.</p>';
  };
  btn.addEventListener('click', run);
  document.getElementById('w10-det-step').addEventListener('click', () => {
    if (!steps.length) run();
    if (idx < steps.length) { idx++; paint(); }
  });
  run();
})();

// ---- M10: Traffic ----
(function () {
  const clk = document.getElementById('w10-tr-clock');
  if (!clk) return;
  const ST = ['S0 — 🟢 HIJAU (jalan)', 'S1 — 🟡 KUNING (siap berhenti)', 'S2 — 🔴 MERAH (berhenti)', 'S3 — 🔴🟡 MERAH-KUNING (siap jalan)'];
  let s = 0;
  const paint = (msg) => {
    document.getElementById('w10-tr-out').textContent = ST[s];
    document.getElementById('w10-tr-steps').innerHTML = msg ? `<div class="step-item highlight"><div class="step-number">${msg}</div><div class="step-text">Output Moore hanya dari state: ${ST[s]}.</div></div>` : '';
  };
  clk.addEventListener('click', () => { s = (s + 1) % 4; paint(`Transisi → S${s}`); });
  document.getElementById('w10-tr-reset').addEventListener('click', () => { s = 0; paint('Reset → S0'); });
  paint();
})();

// ---- M11: RAM 16x4 ----
(function () {
  const w = document.getElementById('w11-ram-write');
  if (!w) return;
  const mem = new Array(16).fill('0000');
  const paint = (msg, addr) => {
    document.getElementById('w11-ram-out').textContent = msg;
    let rows = '';
    for (let i = 0; i < 16; i++) rows += `<tr${i === addr ? ' style="background:var(--accent-soft)"' : ''}><td>${i}</td><td style="font-family:monospace">${mem[i]}</td></tr>`;
    document.getElementById('w11-ram-steps').innerHTML = `<table class="mini-table"><tr><th>Addr</th><th>Data</th></tr>${rows}</table>`;
  };
  w.addEventListener('click', () => {
    const a = Math.max(0, Math.min(15, parseInt(document.getElementById('w11-ram-addr').value.trim(), 10) || 0));
    const d = (document.getElementById('w11-ram-data').value || '0000').replace(/[^01]/g, '').padStart(4, '0').slice(-4);
    mem[a] = d;
    paint(`Write: MEM[${a}] ← ${d}`, a);
  });
  document.getElementById('w11-ram-read').addEventListener('click', () => {
    const a = Math.max(0, Math.min(15, parseInt(document.getElementById('w11-ram-addr').value.trim(), 10) || 0));
    paint(`Read: MEM[${a}] = ${mem[a]}`, a);
  });
  paint('RAM 16×4 siap. Write lalu Read kembali.');
})();

// ---- M11: Kapasitas ----
(function () {
  const btn = document.getElementById('w11-cap-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const n = Math.max(1, Math.min(24, parseInt(document.getElementById('w11-cap-n').value.trim(), 10) || 10));
    const m = Math.max(1, Math.min(64, parseInt(document.getElementById('w11-cap-m').value.trim(), 10) || 8));
    const words = Math.pow(2, n), bits = words * m, bytes = bits / 8;
    const kb = bytes >= 1024 ? ` = ${(bytes / 1024).toLocaleString('id-ID')} KB` : '';
    document.getElementById('w11-cap-out').textContent = `${words.toLocaleString('id-ID')}×${m} = ${bits.toLocaleString('id-ID')} bit (${bytes.toLocaleString('id-ID')} byte${kb})`;
    document.getElementById('w11-cap-steps').innerHTML = `<div class="step-item"><div class="step-number">Lokasi</div><div class="step-text">2<sup>${n}</sup> = ${words.toLocaleString('id-ID')} alamat.</div></div><div class="step-item highlight"><div class="step-number">Kapasitas</div><div class="step-text">${words.toLocaleString('id-ID')} × ${m} = <b>${bits.toLocaleString('id-ID')} bit</b>.</div></div>`;
  });
})();

// ---- M12: ADC ----
(function () {
  const btn = document.getElementById('w12-adc-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const vin = parseFloat((document.getElementById('w12-adc-vin').value || '').replace(',', '.')) || 0;
    const vref = parseFloat((document.getElementById('w12-adc-vref').value || '').replace(',', '.')) || 5;
    const n = Number(document.getElementById('w12-adc-n').value);
    const step = vref / Math.pow(2, n);
    const code = Math.max(0, Math.min(Math.pow(2, n) - 1, Math.round(vin / step)));
    document.getElementById('w12-adc-out').textContent = `kode = ${code} (${code.toString(2).padStart(n, '0')})`;
    document.getElementById('w12-adc-steps').innerHTML =
      `<div class="step-item"><div class="step-number">Step</div><div class="step-text">Vref/2ⁿ = ${vref}/${Math.pow(2, n)} = <b>${step.toFixed(4)} V</b></div></div>` +
      `<div class="step-item highlight"><div class="step-number">Kuantisasi</div><div class="step-text">round(${vin}/${step.toFixed(4)}) = <b>${code}</b> → error ±½ LSB = ±${(step / 2).toFixed(4)} V.</div></div>`;
  });
})();

// ---- M12: DAC ----
(function () {
  const btn = document.getElementById('w12-dac-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const code = (document.getElementById('w12-dac-code').value || '').replace(/[^01]/g, '') || '0';
    const vref = parseFloat((document.getElementById('w12-dac-vref').value || '').replace(',', '.')) || 5;
    const dec = parseInt(code, 2), n = code.length;
    const vout = vref * dec / Math.pow(2, n);
    document.getElementById('w12-dac-out').textContent = `Vout = ${vout.toFixed(3)} V`;
    document.getElementById('w12-dac-steps').innerHTML = `<div class="step-item highlight"><div class="step-number">Rumus</div><div class="step-text">Vref × kode/2ⁿ = ${vref} × ${dec}/${Math.pow(2, n)} = <b>${vout.toFixed(3)} V</b>.</div></div>`;
  });
})();

// ---- M13: Counter BCD + 7seg ----
(function () {
  const clk = document.getElementById('w13-ct-clock');
  if (!clk) return;
  let v = 0;
  const paint = () => {
    document.getElementById('w13-ct-out').textContent = `${v} (${v.toString(2).padStart(4, '0')})`;
    document.getElementById('w13-ct-seg').innerHTML = segHTML(SEG10[v].split(''));
    document.getElementById('w13-ct-steps').innerHTML = `<div class="step-item"><div class="step-number">Mod-10</div><div class="step-text">Counter ${v} → BCD ${v.toString(2).padStart(4, '0')} → segmen <b>${SEG10[v].toUpperCase()}</b> menyala.</div></div>`;
  };
  clk.addEventListener('click', () => { v = (v + 1) % 10; paint(); });
  document.getElementById('w13-ct-reset').addEventListener('click', () => { v = 0; paint(); });
  paint();
})();

// ---- M13: Kunci digital ----
(function () {
  const btn = document.getElementById('w13-key-btn');
  if (!btn) return;
  const SECRET = '1011';
  let wrong = 0, open = false, locked = false;
  const paint = (msg) => {
    document.getElementById('w13-key-out').textContent = locked ? `⛔ TERKUNCI TOTAL (${wrong}/3)` : open ? '🔓 TERBUKA!' : `🔒 TERKUNCI (${wrong}/3 salah)`;
    if (msg) document.getElementById('w13-key-steps').innerHTML = `<div class="step-item highlight"><div class="step-number">FSM</div><div class="step-text">${msg}</div></div>`;
  };
  btn.addEventListener('click', () => {
    if (locked) { paint('Sudah lockout — tekan Reset kunci.'); return; }
    const inp = (document.getElementById('w13-key-in').value || '').replace(/[^01]/g, '').padStart(4, '0').slice(-4);
    if (inp === SECRET) { open = true; wrong = 0; paint(`Kode ${inp} BENAR → solenoid terbuka.`); }
    else { open = false; wrong++; if (wrong >= 3) { locked = true; paint(`Kode ${inp} salah ke-${wrong} → LOCKOUT.`); } else paint(`Kode ${inp} salah (${wrong}/3). Coba lagi.`); }
  });
  document.getElementById('w13-key-reset').addEventListener('click', () => { wrong = 0; open = false; locked = false; paint('Reset: counter salah = 0.'); });
  paint();
})();
