// ===== Minggu 4: K-Map solver (Quine-McCluskey-lite, up to 4 vars) =====
const KMAP = { n: 3, vals: new Array(8).fill(0) };
const GRAY2 = ['00', '01', '11', '10'];
const VARS = ['A', 'B', 'C', 'D'];

function kmapSize() { return Math.pow(2, KMAP.n); }
function kmapMintermToPos(m) {
  const b = m.toString(2).padStart(KMAP.n, '0').split('').map(Number);
  if (KMAP.n === 2) return { r: b[0], c: b[1] };
  if (KMAP.n === 3) {
    const row = b[0];
    const colBits = `${b[1]}${b[2]}`;
    return { r: row, c: GRAY2.indexOf(colBits) };
  }
  const rowBits = `${b[0]}${b[1]}`, colBits = `${b[2]}${b[3]}`;
  return { r: GRAY2.indexOf(rowBits), c: GRAY2.indexOf(colBits) };
}
function kmapPosToMinterm(r, c) {
  let bits = '';
  if (KMAP.n === 2) bits = `${r}${c}`;
  else if (KMAP.n === 3) bits = `${r}${GRAY2[c]}`;
  else bits = `${GRAY2[r]}${GRAY2[c]}`;
  return parseInt(bits, 2);
}
function renderKmap(highlight = []) {
  const wrap = document.getElementById('kmap-wrap');
  if (!wrap) return;
  const n = KMAP.n;
  const rows = n === 2 ? 2 : n === 3 ? 2 : 4;
  const cols = n === 2 ? 2 : 4;
  const rowLbl = n === 2 ? ['A=0', 'A=1'] : n === 3 ? ['A=0', 'A=1'] : GRAY2.map(g => `AB=${g}`);
  const colLbl = n === 2 ? ['B=0', 'B=1'] : n === 3 ? GRAY2.map(g => `BC=${g}`) : GRAY2.map(g => `CD=${g}`);
  let html = `<div style="display:inline-block"><div style="display:grid;grid-template-columns:70px repeat(${cols},64px);gap:4px;align-items:center"><div></div>`;
  colLbl.forEach(l => html += `<div style="font-size:0.75rem;color:#666">${l}</div>`);
  for (let r = 0; r < rows; r++) {
    html += `<div style="font-size:0.75rem;color:#666">${rowLbl[r]}</div>`;
    for (let c = 0; c < cols; c++) {
      const m = kmapPosToMinterm(r, c);
      const v = KMAP.vals[m];
      const hl = highlight.some(g => g.covers.includes(m)) ? ' grouped' : '';
      html += `<button class="kmap-cell ${v === 1 ? 'v1' : v === 2 ? 'vx' : ''}${hl}" data-m="${m}" title="m${m}">${v === 2 ? 'X' : v}<div style="font-size:0.6rem;font-weight:400">m${m}</div></button>`;
    }
  }
  wrap.innerHTML = html + '</div></div>';
  wrap.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    const m = Number(b.dataset.m);
    KMAP.vals[m] = (KMAP.vals[m] + 1) % 3; // 0->1->X->0
    renderKmap();
  }));
}

// --- QM ---
function combineTerms(a, b) {
  let diff = -1;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      if (a[i] === '-' || b[i] === '-') return null;
      if (diff !== -1) return null;
      diff = i;
    }
  }
  if (diff === -1) return null;
  return a.slice(0, diff) + '-' + a.slice(diff + 1);
}
function findPrimes(ones, dcs) {
  let terms = [...ones, ...dcs].map(m => ({ bits: m.toString(2).padStart(KMAP.n, '0'), covers: [m], used: false }));
  const primes = [];
  while (true) {
    const next = new Map();
    const grouped = new Map();
    terms.forEach(t => {
      const k = (t.bits.match(/1/g) || []).length;
      if (!grouped.has(k)) grouped.set(k, []);
      grouped.get(k).push(t);
    });
    const keys = [...grouped.keys()].sort((a, b) => a - b);
    let combined = false;
    for (let i = 0; i < keys.length - 1; i++) {
      for (const a of grouped.get(keys[i])) for (const b of grouped.get(keys[i + 1])) {
        const c = combineTerms(a.bits, b.bits);
        if (c) {
          a.used = b.used = true; combined = true;
          const covers = [...new Set([...a.covers, ...b.covers])].sort((x, y) => x - y);
          const key = c + '|' + covers.join(',');
          if (!next.has(key)) next.set(key, { bits: c, covers, used: false });
        }
      }
    }
    terms.forEach(t => { if (!t.used && !primes.some(p => p.bits === t.bits)) primes.push(t); });
    if (!combined) break;
    terms = [...next.values()];
  }
  return primes.filter(p => p.covers.some(m => ones.includes(m)));
}
function termStr(bits) {
  let s = '';
  for (let i = 0; i < bits.length; i++) {
    if (bits[i] === '-') continue;
    s += VARS[i] + (bits[i] === '0' ? "'" : '');
  }
  return s || '1';
}
function solveKmap() {
  const n = KMAP.n, N = kmapSize();
  const ones = [], dcs = [];
  KMAP.vals.forEach((v, m) => { if (v === 1) ones.push(m); if (v === 2) dcs.push(m); });
  const resEl = document.getElementById('kmap-result');
  const stepsEl = document.getElementById('kmap-steps');
  if (!ones.length) { resEl.textContent = 'F = 0 (tidak ada minterm 1)'; stepsEl.innerHTML = ''; renderKmap(); return; }
  if (ones.length + dcs.length === N) { resEl.textContent = 'F = 1 (semua 1/X)'; stepsEl.innerHTML = ''; renderKmap([{ covers: ones }]); return; }
  const primes = findPrimes(ones, dcs);
  // essential + greedy cover
  const cover = new Map(); // minterm -> primes idx
  ones.forEach(m => cover.set(m, []));
  primes.forEach((p, i) => p.covers.forEach(m => { if (cover.has(m)) cover.get(m).push(i); }));
  const chosen = new Set();
  cover.forEach(list => { if (list.length === 1) chosen.add(list[0]); });
  let covered = new Set();
  chosen.forEach(i => primes[i].covers.forEach(m => covered.add(m)));
  let remaining = ones.filter(m => !covered.has(m));
  while (remaining.length) {
    let best = -1, bestN = -1;
    primes.forEach((p, i) => {
      if (chosen.has(i)) return;
      const c = p.covers.filter(m => remaining.includes(m)).length;
      if (c > bestN) { bestN = c; best = i; }
    });
    if (best === -1) break;
    chosen.add(best);
    primes[best].covers.forEach(m => covered.add(m));
    remaining = ones.filter(m => !covered.has(m));
  }
  const groups = [...chosen].map(i => primes[i]);
  const expr = groups.map(g => termStr(g.bits)).join(' + ');
  resEl.textContent = `F = ${expr}`;
  stepsEl.innerHTML = groups.map((g, k) => {
    const eliminated = g.bits.split('').filter(ch => ch === '-').length;
    return `<div class="step-item ${k === 0 ? 'highlight' : ''}"><div class="step-number">Grup ${k + 1}: m${g.covers.join(', m')}</div><div class="step-text">Pola <code>${g.bits}</code> → <b>${termStr(g.bits)}</b> (${eliminated} variabel tereliminasi, ukuran ${g.covers.length}).</div></div>`;
  }).join('') + `<div class="step-item"><div class="step-number">Aturan dipakai</div><div class="step-text">Grup ukuran 2<sup>n</sup>, wrap-around, overlap boleh, X dimanfaatkan untuk memperbesar grup.</div></div>`;
  renderKmap(groups);
}
document.getElementById('kmap-nvar')?.addEventListener('change', e => {
  KMAP.n = parseInt(e.target.value, 10);
  KMAP.vals = new Array(kmapSize()).fill(0);
  renderKmap();
});
document.getElementById('kmap-solve')?.addEventListener('click', solveKmap);
document.getElementById('kmap-clear')?.addEventListener('click', () => { KMAP.vals = new Array(kmapSize()).fill(0); renderKmap(); document.getElementById('kmap-result').textContent = '-'; document.getElementById('kmap-steps').innerHTML = '<p class="placeholder-text">Klik sel untuk set 1 / X, lalu Sederhanakan.</p>'; });
document.getElementById('kmap-demo')?.addEventListener('click', () => {
  KMAP.n = 4; document.getElementById('kmap-nvar').value = '4';
  KMAP.vals = new Array(16).fill(0);
  [1, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15].forEach(m => KMAP.vals[m] = 1);
  solveKmap();
});
renderKmap();
