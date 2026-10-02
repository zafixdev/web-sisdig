// ===== learn.js: sub-tab engine, quiz generik, simulator langkah W1, preset K-Map =====

// ---- Sub-tab engine (tab atas 1-14 tetap, sub-tab per minggu) ----
document.querySelectorAll('.content-tabs').forEach(tabs => {
  tabs.querySelectorAll('.content-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const section = tabs.closest('.week-content');
      section.querySelectorAll('.content-tab').forEach(t => t.classList.remove('active'));
      section.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = section.querySelector('#' + tab.dataset.tab);
      if (panel) panel.classList.add('active');
    });
  });
});

// ---- Tombol cetak cheatsheet ----
document.querySelectorAll('.print-btn').forEach(b => b.addEventListener('click', () => window.print()));

// ---- Quiz generik ----
function initQuiz(prefix, questions) {
  const qEl = document.getElementById(prefix + '-questions');
  const scoreEl = document.getElementById(prefix + '-score');
  const progEl = document.getElementById(prefix + '-progress');
  const resetBtn = document.getElementById('reset-' + prefix);
  if (!qEl) return;
  let scores = new Array(questions.length).fill(false);
  const norm = s => (s || '').trim().toUpperCase().replace(/[\s()•]/g, '').replace(/’/g, "'");
  function update() {
    const sc = scores.filter(Boolean).length;
    if (scoreEl) scoreEl.textContent = sc + ' / ' + questions.length;
    if (progEl) progEl.style.width = (sc / questions.length * 100) + '%';
  }
  function render() {
    scores = new Array(questions.length).fill(false);
    update();
    qEl.innerHTML = questions.map((q, i) => `
      <div class="quiz-container interactive-card" style="margin-bottom:12px;">
        <div class="quiz-question">${i + 1}. ${q.q}</div>
        <div class="quiz-input-row">
          <input type="text" class="quiz-input" id="${prefix}-in-${i}" placeholder="Jawaban Anda...">
          <button class="btn btn-convert btn-sm" data-i="${i}">Periksa</button>
        </div>
        <div class="quiz-feedback" id="${prefix}-fb-${i}"></div>
      </div>`).join('');
    qEl.querySelectorAll('button[data-i]').forEach(btn => btn.addEventListener('click', () => {
      const i = Number(btn.dataset.i);
      const user = norm(document.getElementById(`${prefix}-in-${i}`).value);
      const ans = norm(questions[i].ans);
      const fb = document.getElementById(`${prefix}-fb-${i}`);
      if (user && (user === ans || user.includes(ans) || ans.includes(user))) {
        fb.className = 'quiz-feedback correct';
        fb.textContent = '✓ Benar! ' + questions[i].hint;
        scores[i] = true;
      } else {
        fb.className = 'quiz-feedback wrong';
        fb.textContent = '✗ Kurang tepat. Petunjuk: ' + questions[i].hint;
        scores[i] = false;
      }
      update();
    }));
  }
  resetBtn?.addEventListener('click', render);
  render();
}

// ---- Bank soal (dari materi minggu 1-4) ----
initQuiz('quiz1', [
  { q: 'Konversikan desimal 35 ke biner:', ans: '100011', hint: '35 = 32 + 2 + 1 = 2⁵ + 2¹ + 2⁰' },
  { q: 'Konversikan biner 110110 ke heksadesimal:', ans: '36', hint: '0011 0110 → 3, 6 → 36₁₆' },
  { q: 'Konversikan biner 101110 ke oktal:', ans: '56', hint: '101 110 → 5, 6 → 56₈' },
  { q: 'Konversikan heksadesimal 2F ke desimal:', ans: '47', hint: '2F → 0010 1111 → 32+8+4+2+1 = 47' },
  { q: 'Berapa bit pengelompokan biner → heksadesimal?', ans: '4', hint: 'Karena 2⁴ = 16' },
]);
initQuiz('quiz2', [
  { q: "Representasi 8-bit 2's complement dari −1?", ans: '11111111', hint: '+1=00000001 → NOT=11111110 → +1=11111111' },
  { q: "Rentang 8-bit 2's complement?", ans: '-128 sampai 127', hint: '−2⁷ s.d. 2⁷−1' },
  { q: 'Apakah +100 + +60 pada 8-bit overflow?', ans: 'YA', hint: '160 > +127' },
  { q: "2's complement dari +18 (00010010) menjadi −18?", ans: '11101110', hint: 'NOT=11101101, +1=11101110' },
  { q: 'Skema yang punya +0 dan −0?', ans: 'SIGN-MAGNITUDE', hint: 'SM dan C1 punya dua nol' },
]);
initQuiz('quiz3', [
  { q: "De Morgan: (A + B)′ setara dengan?", ans: "A'•B'", hint: 'Komplemen jumlah = kali komplemen: A′•B′' },
  { q: 'Gerbang output 1 HANYA JIKA kedua input 1?', ans: 'AND', hint: 'Konjungsi / perkalian logika' },
  { q: 'Sederhanakan: A + A•B', ans: 'A', hint: 'Absorpsi: A + AB = A' },
  { q: 'Pada SOP, variabel bernilai 0 ditulis sebagai?', ans: "A'", hint: 'Bentuk komplemen' },
  { q: 'f(A,B,C) = Σm(0,2,4), indeks Maxterm POS?', ans: '1, 3, 5, 6, 7', hint: 'Indeks yang tidak ada di SOP' },
]);
initQuiz('quiz4', [
  { q: 'Ukuran grup K-Map yang diperbolehkan?', ans: '1, 2, 4, 8, 16', hint: 'Kelipatan 2ⁿ' },
  { q: 'Mengapa kolom K-Map pakai Gray code?', ans: 'HANYA 1 BIT BERUBAH', hint: '1 variabel berubah antar kotak' },
  { q: 'Grup 4 kotak mengeliminasi berapa variabel?', ans: '2', hint: 'log₂(4) = 2' },
  { q: 'Apakah 4 sudut K-Map 4-var bisa 1 grup?', ans: 'YA', hint: 'Wrap-around / toroid' },
  { q: "X don't care yang tak membantu diapakan?", ans: 'DIABAIKAN', hint: 'Anggap 0' },
]);

// ---- W1: Desimal → Biner (bagi berulang) ----
(function () {
  const inp = document.getElementById('w1-dec-in');
  const btn = document.getElementById('w1-dec-btn');
  const out = document.getElementById('w1-dec-steps');
  if (!inp || !btn || !out) return;
  function render() {
    const val = parseInt(inp.value, 10);
    if (isNaN(val) || val < 0) { out.innerHTML = '<p> Masukkan bilangan bulat non-negatif.</p>'; return; }
    if (val === 0) { out.innerHTML = '<div class="info-box success"><strong>Hasil:</strong> 0₁₀ = 0₂</div>'; return; }
    let n = val; const steps = []; const bits = [];
    while (n > 0) { const q = Math.floor(n / 2), r = n % 2; steps.push({ n, q, r }); bits.push(r); n = q; }
    out.innerHTML = '<div class="steps-container">' + steps.map((s, i) => `
      <div class="step-item"><div class="step-number">${i + 1}</div>
      <div class="step-content"><h5>${s.n} ÷ 2 = ${s.q}, <b>sisa ${s.r}</b>${i === 0 ? ' (LSB)' : ''}${i === steps.length - 1 ? ' (MSB)' : ''}</h5></div></div>`).join('') + '</div>' +
      `<div class="info-box success"><strong>Hasil:</strong> Baca sisa dari bawah ke atas: ${val}₁₀ = <b>${bits.reverse().join('')}₂</b></div>`;
  }
  btn.addEventListener('click', render);
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') render(); });
  render();
})();

// ---- W1: Biner → Heksa (4-bit) ----
(function () {
  const inp = document.getElementById('w1-hex-in');
  const btn = document.getElementById('w1-hex-btn');
  const out = document.getElementById('w1-hex-res');
  if (!inp || !btn || !out) return;
  function render() {
    let bin = inp.value.replace(/[^01]/g, '') || '0';
    inp.value = bin;
    const pad = (4 - bin.length % 4) % 4;
    const padded = '0'.repeat(pad) + bin;
    const groups = [];
    for (let i = 0; i < padded.length; i += 4) {
      const g = padded.substr(i, 4);
      groups.push({ g, h: parseInt(g, 2).toString(16).toUpperCase() });
    }
    out.innerHTML = (pad ? `<div class="info-box tip"><strong>Langkah 1:</strong> Tambah ${pad} nol di depan → <code>${padded}</code></div>` : '') +
      `<div class="bit-grouping">${groups.map(x => `<div class="bit-group"><div class="bit-group-bits">${x.g.split('').map(b => `<div class="bit-cell ${b === '1' ? 'b1' : ''}">${b}</div>`).join('')}</div><div class="bit-group-value">${x.h}₁₆</div></div>`).join('')}</div>` +
      `<div class="info-box success"><strong>Hasil:</strong> ${bin}₂ = <b>${groups.map(x => x.h).join('')}₁₆</b></div>`;
  }
  btn.addEventListener('click', render);
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') render(); });
  render();
})();

// ---- W1: Biner → Oktal (3-bit) ----
(function () {
  const inp = document.getElementById('w1-oct-in');
  const btn = document.getElementById('w1-oct-btn');
  const out = document.getElementById('w1-oct-res');
  if (!inp || !btn || !out) return;
  function render() {
    let bin = inp.value.replace(/[^01]/g, '') || '0';
    inp.value = bin;
    const pad = (3 - bin.length % 3) % 3;
    const padded = '0'.repeat(pad) + bin;
    const groups = [];
    for (let i = 0; i < padded.length; i += 3) {
      const g = padded.substr(i, 3);
      groups.push({ g, o: parseInt(g, 2).toString(8) });
    }
    out.innerHTML = (pad ? `<div class="info-box tip"><strong>Langkah 1:</strong> Tambah ${pad} nol di depan → <code>${padded}</code></div>` : '') +
      `<div class="bit-grouping">${groups.map(x => `<div class="bit-group"><div class="bit-group-bits">${x.g.split('').map(b => `<div class="bit-cell ${b === '1' ? 'b1' : ''}">${b}</div>`).join('')}</div><div class="bit-group-value">${x.o}₈</div></div>`).join('')}</div>` +
      `<div class="info-box success"><strong>Hasil:</strong> ${bin}₂ = <b>${groups.map(x => x.o).join('')}₈</b></div>`;
  }
  btn.addEventListener('click', render);
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') render(); });
  render();
})();

// ---- W1: Biner → Desimal (bobot) ----
(function () {
  const inp = document.getElementById('w1-bdec-in');
  const btn = document.getElementById('w1-bdec-btn');
  const out = document.getElementById('w1-bdec-res');
  if (!inp || !btn || !out) return;
  function render() {
    let bin = inp.value.replace(/[^01]/g, '') || '0';
    inp.value = bin;
    let total = 0; const terms = [];
    let cols = '';
    for (let i = 0; i < bin.length; i++) {
      const p = bin.length - 1 - i, w = Math.pow(2, p), v = Number(bin[i]) * w;
      total += v;
      if (bin[i] === '1') terms.push(`2<sup>${p}</sup>=${w}`);
      cols += `<div class="weight-col"><span class="weight-power">2<sup>${p}</sup></span><span class="weight-value">${w}</span><div class="weight-bit ${bin[i] === '1' ? 'active' : ''}">${bin[i]}</div><span class="weight-result">${v}</span></div>`;
    }
    out.innerHTML = `<div class="weight-table">${cols}</div>
      <div class="info-box success"><strong>Hasil:</strong> ${terms.join(' + ') || '0'} = <b>${total}₁₀</b> — jadi ${bin}₂ = ${total}₁₀</div>`;
  }
  btn.addEventListener('click', render);
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') render(); });
  render();
})();

// ---- W4: preset contoh → buka Lab K-Map ----
function kmapPreset(n, ones, dcs) {
  KMAP.n = n;
  KMAP.vals = new Array(Math.pow(2, n)).fill(0);
  ones.forEach(m => KMAP.vals[m] = 1);
  (dcs || []).forEach(m => KMAP.vals[m] = 2);
  const sel = document.getElementById('kmap-nvar');
  if (sel) sel.value = String(n);
  document.querySelector('#week-4 [data-tab="w4-lab"]')?.click();
  solveKmap();
  document.getElementById('kmap-wrap')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
document.querySelectorAll('[data-kmap-preset]').forEach(b => b.addEventListener('click', () => {
  const [n, ones, dcs] = b.dataset.kmapPreset.split('|').map((s, i) => i === 0 ? Number(s) : s ? s.split(',').map(Number) : []);
  kmapPreset(n, ones, dcs);
}));
