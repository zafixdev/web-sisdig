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
  const shuffle = () => {
    const idx = questions.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    return idx;
  };
  function update() {
    const sc = scores.filter(Boolean).length;
    if (scoreEl) scoreEl.textContent = sc + ' / ' + questions.length;
    if (progEl) progEl.style.width = (sc / questions.length * 100) + '%';
  }
  function render() {
    scores = new Array(questions.length).fill(false);
    update();
    const orderIdx = shuffle();
    qEl.innerHTML = orderIdx.map((qi, pos) => {
      const q = questions[qi];
      if (Array.isArray(q.options)) {
        const opts = q.options.map((o, oi) =>
          `<button class="quiz-option" data-i="${qi}" data-o="${oi}">${String.fromCharCode(65 + oi)}. ${o}</button>`).join('');
        return `<div class="quiz-container interactive-card" style="margin-bottom:12px;">
          <div class="quiz-question">${pos + 1}. ${q.q}</div>
          <div class="quiz-options">${opts}</div>
          <div class="quiz-explain" id="${prefix}-ex-${qi}"></div>
        </div>`;
      }
      return `<div class="quiz-container interactive-card" style="margin-bottom:12px;">
        <div class="quiz-question">${pos + 1}. ${q.q}</div>
        <div class="quiz-input-row">
          <input type="text" class="quiz-input" id="${prefix}-in-${qi}" placeholder="Jawaban Anda...">
          <button class="btn btn-convert btn-sm" data-check="${qi}">Periksa</button>
        </div>
        <div class="quiz-feedback" id="${prefix}-fb-${qi}"></div>
      </div>`;
    }).join('');

    qEl.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const qi = Number(btn.dataset.i), oi = Number(btn.dataset.o);
        const q = questions[qi];
        const correct = oi === q.answer;
        const sib = btn.parentElement.querySelectorAll('.quiz-option');
        sib.forEach(b => b.disabled = true);
        btn.classList.add(correct ? 'correct' : 'wrong');
        if (!correct) sib[q.answer].classList.add('correct');
        scores[qi] = correct;
        update();
        const ex = document.getElementById(`${prefix}-ex-${qi}`);
        if (ex) { ex.classList.add('show'); ex.innerHTML = `<strong>${correct ? '✓ Benar!' : '✗ Belum tepat.'}</strong> ${q.explain || q.hint || ''}`; }
      });
    });

    qEl.querySelectorAll('button[data-check]').forEach(btn => {
      btn.addEventListener('click', () => {
        const qi = Number(btn.dataset.check);
        const q = questions[qi];
        const user = norm(document.getElementById(`${prefix}-in-${qi}`).value);
        const ans = norm(q.ans);
        const fb = document.getElementById(`${prefix}-fb-${qi}`);
        if (user && (user === ans || user.includes(ans) || ans.includes(user))) {
          fb.className = 'quiz-feedback correct';
          fb.textContent = '✓ Benar! ' + (q.explain || q.hint);
          scores[qi] = true;
        } else {
          fb.className = 'quiz-feedback wrong';
          fb.textContent = '✗ Kurang tepat. Petunjuk: ' + (q.hint || q.explain);
          scores[qi] = false;
        }
        update();
      });
    });
  }
  resetBtn?.addEventListener('click', render);
  render();
}

// ---- Bank soal (dari materi minggu 1-4) ----
initQuiz('quiz1', [
  { q: 'Konversikan desimal 35 ke biner.', options: ['100001', '100011', '110001', '101011'], answer: 1, explain: '35 = 32 + 2 + 1 = 2⁵ + 2¹ + 2⁰ → 100011₂.' },
  { q: 'Konversikan biner 110110 ke heksadesimal.', options: ['36', '63', '66', '30'], answer: 0, explain: 'Kelompokkan per 4 bit: 0011 0110 → 3 dan 6 → 36₁₆.' },
  { q: 'Konversikan biner 101110 ke oktal.', options: ['65', '47', '56', '27'], answer: 2, explain: 'Kelompokkan per 3 bit: 101 110 → 5 dan 6 → 56₈.' },
  { q: 'Konversikan heksadesimal 2F ke desimal.', options: ['32', '45', '51', '47'], answer: 3, explain: '2F = 2×16 + 15 = 32 + 15 = 47.' },
  { q: 'Berapa bit biner yang mewakili satu digit heksadesimal?', options: ['2', '3', '4', '8'], answer: 2, explain: 'Karena 2⁴ = 16, satu digit heksa = 4 bit.' },
]);
initQuiz('quiz2', [
  { q: "Representasi 8-bit 2's complement dari −1 adalah…", options: ['10000000', '10000001', '11111111', '01111111'], answer: 2, explain: '+1 = 00000001 → NOT = 11111110 → +1 = 11111111.' },
  { q: "Rentang nilai 8-bit 2's complement adalah…", options: ['−127..+127', '−128..+127', '0..255', '−128..+128'], answer: 1, explain: 'Rumus rentang: −2⁷ s.d. 2⁷−1 = −128..+127.' },
  { q: 'Apakah +100 + (+60) pada 8-bit bertanda mengalami overflow?', options: ['Ya, karena 160 > +127', 'Tidak, karena tandanya berbeda', 'Tidak, karena hasilnya genap', 'Ya, karena ada carry keluar'], answer: 0, explain: 'Hasil sebenarnya 160 melebihi nilai maksimum +127 → overflow.' },
  { q: "2's complement dari +18 (00010010) untuk memperoleh −18 adalah…", options: ['11101101', '11101110', '10010010', '11101100'], answer: 1, explain: 'NOT = 11101101, lalu +1 = 11101110.' },
  { q: 'Skema representasi yang memiliki dua bentuk nol (+0 dan −0) adalah…', options: ['Hanya sign-magnitude', 'Hanya 2’s complement', 'Sign-magnitude dan 1’s complement', 'Semua skema'], answer: 2, explain: 'SM dan 1’s complement memiliki +0 serta −0; 2’s complement hanya satu nol.' },
]);
initQuiz('quiz3', [
  { q: "Menurut De Morgan, (A + B)′ setara dengan…", options: ["A' + B'", "A' · B'", 'A · B', "A · B'"], answer: 1, explain: 'Komplemen dari penjumlahan = perkalian komplemen: (A+B)′ = A′·B′.' },
  { q: 'Gerbang yang outputnya 1 HANYA jika kedua input 1 adalah…', options: ['OR', 'NAND', 'AND', 'XOR'], answer: 2, explain: 'AND bernilai 1 hanya untuk 1·1; sisanya 0.' },
  { q: 'Sederhanakan: A + A·B.', options: ['A', 'B', 'A·B', 'A + B'], answer: 0, explain: 'Hukum absorpsi: A + A·B = A.' },
  { q: 'Pada bentuk SOP, variabel yang bernilai 0 ditulis sebagai…', options: ['variabel asli', 'bentuk komplemen (A′)', 'dihilangkan', 'di-AND dua kali'], answer: 1, explain: 'Aturan SOP: variabel bernilai 0 ditulis dalam bentuk komplemen.' },
  { q: 'Jika f(A,B,C) = Σm(0,2,4), maka bentuk POS-nya adalah ΠM…', options: ['1, 3, 5, 6, 7', '0, 2, 4', '0, 1, 2, 3', '2, 4, 6'], answer: 0, explain: 'POS memakai indeks yang BUKAN anggota SOP, yaitu 1, 3, 5, 6, 7.' },
]);
initQuiz('quiz4', [
  { q: 'Ukuran grup pada K-Map yang diperbolehkan adalah…', options: ['1, 2, 3, 4', '1, 2, 4, 8, 16', '2, 4, 6, 8', 'bisa semua angka'], answer: 1, explain: 'Ukuran grup harus pangkat dua (2ⁿ).' },
  { q: 'Mengapa tepi K-Map memakai urutan Gray code?', options: ['agar tampak rapi', 'agar harga murah', 'agar hanya 1 bit berubah antar kotak', 'agar mudah dicetak'], answer: 2, explain: 'Gray code menjamin kotak bertetangga berbeda tepat satu variabel.' },
  { q: 'Satu grup berisi 4 kotak mengeliminasi berapa variabel?', options: ['1', '2', '3', '4'], answer: 1, explain: 'Grup 2ⁿ mengeliminasi n variabel; log₂(4) = 2.' },
  { q: 'Apakah empat sudut pada K-Map 4 variabel dapat menjadi satu grup?', options: ['Ya, karena wrap-around', 'Tidak, terlalu jauh', 'Ya, tetapi hanya untuk 3 variabel', 'Tidak, harus bersebelahan langsung'], answer: 0, explain: 'Tepi K-Map saling menyambung, sehingga empat sudut boleh membentuk satu grup.' },
  { q: "X (don't care) yang tidak membantu sebaiknya…", options: ['dianggap 1', 'diabaikan (dianggap 0)', 'selalu dimasukkan grup', 'dihapus dari tabel'], answer: 1, explain: 'X hanya dianggap 1 bila memperbesar grup; jika tidak, diabaikan.' },
]);
initQuiz('quiz5', [
  { q: 'Half Adder dengan A=1 dan B=1 menghasilkan…', options: ['S=1, C=0', 'S=0, C=1', 'S=0, C=0', 'S=1, C=1'], answer: 1, explain: '1 + 1 = 10₂ → Sum 0, Carry 1.' },
  { q: 'Full Adder dengan A=1, B=1, Cin=1 menghasilkan Sum = …', options: ['0', '1', 'tak terdefinisi', '2'], answer: 1, explain: '1 XOR 1 XOR 1 = 1 (dengan Cout = 1).' },
  { q: 'Rumus Cout sebuah Full Adder adalah…', options: ['AB + Cin(A⊕B)', 'A⊕B⊕Cin', 'A·B only', 'A + B'], answer: 0, explain: 'Cout = AB + Cin(A⊕B).' },
  { q: 'Kelemahan utama Ripple Carry Adder (RCA) adalah…', options: ['terlalu banyak gerbang', 'carry harus merambat berantai sehingga lambat', 'tidak bisa menjumlah 4 bit', 'tidak punya Cin'], answer: 1, explain: 'Carry menunggu kolom sebelumnya → delay O(N).' },
  { q: 'Agar Adder-Subtractor bekerja sebagai pengurang (A−B), mode M diatur…', options: ['M=0', 'M=1', 'M=2', 'M= tak peduli'], answer: 1, explain: 'M=1 membalik B dan memberi Cin=1 sehingga terbentuk komplemen 2.' },
]);
initQuiz('quiz6', [
  { q: 'Gerbang yang paling langsung untuk mengimplementasikan bentuk SOP multilevel adalah…', options: ['NOR', 'XOR', 'NAND', 'XNOR'], answer: 2, explain: 'SOP cocok diimplementasikan sebagai NAND-NAND.' },
  { q: 'Output MUX 2:1 ketika S=1 adalah…', options: ['I0', 'I1', '0', 'D2'], answer: 1, explain: 'Y = S′I0 + S·I1; bila S=1 maka Y = I1.' },
  { q: 'Jumlah select line pada MUX 8:1 adalah…', options: ['2', '3', '4', '8'], answer: 1, explain: '2ⁿ = 8 → n = 3 select line.' },
  { q: 'MUX 4:1 dengan S1S0 = 10 akan memilih…', options: ['D0', 'D1', 'D2', 'D3'], answer: 2, explain: '10₂ = 2, jadi input D2 yang diteruskan.' },
  { q: 'Bentuk POS diimplementasikan secara efisien dengan gerbang…', options: ['NAND', 'NOR', 'AND', 'XOR'], answer: 1, explain: 'POS → NOR-NOR (dual dari SOP → NAND-NAND).' },
]);
initQuiz('quiz7', [
  { q: 'Decoder 2-to-4 (dengan EN aktif) mengaktifkan berapa output?', options: ['1', '2', '4', 'semua'], answer: 0, explain: 'Decoder mengaktifkan tepat satu output sesuai kode input.' },
  { q: 'Bila EN = 0 pada decoder, semua output bernilai…', options: ['1', '0', 'mengikuti input', 'tak tentu'], answer: 1, explain: 'Enable yang tidak aktif mematikan seluruh output.' },
  { q: 'Rumus keluaran A1 pada encoder 4-to-2 adalah…', options: ['D1 + D3', 'D2 + D3', 'D0 + D2', 'D3 saja'], answer: 1, explain: 'A1 = D2 + D3 dan A0 = D1 + D3.' },
  { q: 'Pada priority encoder, bila D1 dan D2 aktif, yang dikodekan adalah…', options: ['D1', 'D2', 'keduanya', 'tidak ada'], answer: 1, explain: 'Priority encoder memilih nomor terbesar, yaitu D2.' },
  { q: 'Pada display Common Cathode, sebuah segmen menyala dengan logika…', options: ['0', '1', 'bergantung arus', 'tak tentu'], answer: 1, explain: 'CC: 1 = nyala; CA: 0 = nyala.' },
]);
initQuiz('quiz8', [
  { q: 'Kondisi tak valid SR latch NOR?', ans: 'S=R=1', hint: 'Q=Q\'=0 melanggar komplemen' },
  { q: 'Persamaan karakteristik JK flip-flop?', ans: "JQ'+K'Q", hint: 'Q+ = JQ\' + K\'Q' },
  { q: 'Flip-flop yang outputnya selalu mengikuti D?', ans: 'D', hint: 'Q+ = D' },
  { q: 'T flip-flop dengan T=1 akan?', ans: 'TOGGLE', hint: 'Berbalik tiap clock' },
  { q: 'Counter modulo-10 punya berapa state?', ans: '10', hint: '0..9' },
]);
initQuiz('quiz9', [
  { q: 'Register 4-bit dibentuk dari berapa D-FF?', ans: '4', hint: '1 FF per bit' },
  { q: 'Mode register seri-in seri-out?', ans: 'SISO', hint: 'Serial In Serial Out' },
  { q: 'Berapa clock SIPO 4-bit sampai paralel valid?', ans: '4', hint: '1 clock per bit' },
  { q: 'Ring counter 4-bit punya berapa state?', ans: '4', hint: '1 berputar, mod-4' },
  { q: 'Mode universal S1S0=11 artinya?', ans: 'LOAD', hint: '00 hold, 01 kanan, 10 kiri, 11 load' },
]);
initQuiz('quiz10', [
  { q: 'Output FSM Moore ditentukan oleh?', ans: 'STATE SAJA', hint: 'Bukan input langsung' },
  { q: 'FSM Mealy: output = f(?)', ans: 'STATE DAN INPUT', hint: 'Respons langsung ke input' },
  { q: 'Langkah setelah diagram state?', ans: 'TABEL STATE', hint: 'Lalu encoding + eksitasi' },
  { q: 'Detektor 101 overlap: setelah hit kembali ke state?', ans: 'S1', hint: '"10" akhir jadi awalan' },
  { q: 'Controller traffic light cocok pakai?', ans: 'MOORE', hint: 'Output stabil per state' },
]);
initQuiz('quiz11', [
  { q: 'Kapasitas bit memori 2^n x m?', ans: '2^N KALI M', hint: 'Lokasi × lebar data' },
  { q: 'Memori 1K×8 = berapa byte?', ans: '1024', hint: '1K = 1024 lokasi × 1 byte' },
  { q: 'RAM vs ROM: yang volatil?', ans: 'RAM', hint: 'Hilang saat listrik mati' },
  { q: 'Jenis ROM yang bisa dihapus elektrik?', ans: 'EEPROM', hint: 'Flash = EEPROM modern' },
  { q: 'Level tercepat hierarki memori?', ans: 'REGISTER', hint: 'Lalu cache, RAM...' },
]);
initQuiz('quiz12', [
  { q: 'Step ADC 8-bit Vref=5V?', ans: '0,0195', hint: '5/256 ≈ 19,5 mV' },
  { q: 'Vout DAC 8-bit kode 128 Vref=5V?', ans: '2,5', hint: '5×128/256' },
  { q: 'Error kuantisasi maksimum?', ans: 'SETENGAH LSB', hint: '±½ step' },
  { q: 'PAL beda dari PLA: bagian yang tetap?', ans: 'OR', hint: 'PAL: AND program, OR tetap' },
  { q: 'Perangkat logika terbesar?', ans: 'FPGA', hint: 'Di atas CPLD' },
]);
initQuiz('quiz13', [
  { q: 'Counter BCD modulo-10 mencacah?', ans: '0 SAMPAI 9', hint: 'Lalu kembali 0' },
  { q: 'Blok pengubah BCD ke display?', ans: 'DECODER 7-SEGMEN', hint: 'Minggu 7' },
  { q: 'Kunci digital 3x salah → ?', ans: 'LOCKOUT', hint: 'Terkunci total' },
  { q: 'FSM kunci membandingkan input dengan?', ans: 'KODE RAHASIA', hint: '1011 pada simulator' },
  { q: 'Proyek counter-7seg memakai counter jenis?', ans: 'MODULO-10', hint: 'BCD 0-9' },
]);
initQuiz('quiz14', [
  { q: 'C2 dari +18 (00010010) = ?', ans: '11101110', hint: 'NOT + 1' },
  { q: 'Hasil grouping K-Map Σm(4,5,6,7) 3-var?', ans: 'A', hint: 'Satu grup 4' },
  { q: 'Output MUX 4:1 S1S0=10?', ans: 'D2', hint: '10₂=2' },
  { q: 'JK dengan J=K=1 tiap clock?', ans: 'TOGGLE', hint: 'Berbalik' },
  { q: 'RAM 2^10×8 kapasitasnya?', ans: '1 KB', hint: '1024 byte' },
]);
initQuiz('quiz14b', [
  { q: 'Desimal 35 ke biner?', ans: '100011', hint: '32+2+1' },
  { q: "2's complement −1 (8-bit)?", ans: '11111111', hint: 'NOT(00000001)+1' },
  { q: 'De Morgan (A+B)\' = ?', ans: "A'B'", hint: 'Kali komplemen' },
  { q: 'Sederhanakan A + AB?', ans: 'A', hint: 'Absorpsi' },
  { q: 'Grup 4 K-Map mengeliminasi?', ans: '2', hint: 'log₂4' },
  { q: 'Half Adder A=B=1: S,C?', ans: 'S=0, C=1', hint: '1+1=0 simpan 1' },
  { q: 'Decoder 3-to-8 jumlah output?', ans: '8', hint: '2³' },
  { q: 'Modulo-10 counter state?', ans: '10', hint: '0..9' },
  { q: 'SIPO 4-bit butuh clock?', ans: '4', hint: 'Per bit' },
  { q: 'Step ADC = ?', ans: 'VREF/2^N', hint: 'Vref bagi level' },
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
