// ===== Minggu 3: Gerbang + SOP/POS =====
const GATES = {
  AND: (a, b) => a & b, OR: (a, b) => a | b, NAND: (a, b) => (a & b) ^ 1,
  NOR: (a, b) => (a | b) ^ 1, XOR: (a, b) => a ^ b, XNOR: (a, b) => (a ^ b) ^ 1,
  NOT: (a) => a ^ 1,
};
const gateState = {};
function renderGates() {
  const grid = document.getElementById('gate-grid');
  if (!grid) return;
  grid.innerHTML = '';
  Object.keys(GATES).forEach(g => {
    if (!(g in gateState)) gateState[g] = g === 'NOT' ? { a: 0 } : { a: 0, b: 0 };
    const st = gateState[g];
    const out = g === 'NOT' ? GATES[g](st.a) : GATES[g](st.a, st.b);
    const card = document.createElement('div');
    card.className = 'gate-card';
    card.innerHTML = `<h4>${g}</h4>
      <div class="gate-io">
        <button data-g="${g}" data-k="a" class="${st.a ? 'on' : ''}">${st.a}</button>
        ${g !== 'NOT' ? `<button data-g="${g}" data-k="b" class="${st.b ? 'on' : ''}">${st.b}</button>` : ''}
      </div>
      <div class="gate-out">= ${out}</div>`;
    grid.appendChild(card);
  });
  grid.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const s = gateState[btn.dataset.g];
      s[btn.dataset.k] ^= 1;
      renderGates();
    });
  });
}

let boolRows = [];
function boolVars(n) { return n === 2 ? ['x', 'y'] : ['x', 'y', 'z']; }
function genBoolTable(demoXor = false) {
  const n = parseInt(document.getElementById('bool-nvar').value, 10);
  const vars = boolVars(n);
  const N = Math.pow(2, n);
  boolRows = [];
  for (let i = 0; i < N; i++) {
    const bits = i.toString(2).padStart(n, '0').split('').map(Number);
    let f = 0;
    if (demoXor && n === 2) f = bits[0] ^ bits[1];
    boolRows.push({ bits, f });
  }
  renderBoolTable();
}
function renderBoolTable() {
  const wrap = document.getElementById('bool-table-wrap');
  const vars = boolVars(parseInt(document.getElementById('bool-nvar').value, 10));
  let html = '<table class="mini-table" style="text-align:center"><tr>' + vars.map(v => `<th>${v}</th>`).join('') + '<th>F (klik)</th><th>Minterm</th></tr>';
  boolRows.forEach((r, i) => {
    const m = r.bits.map((b, j) => (b ? '' : vars[j] + "'")).join('') || '1';
    html += `<tr>${r.bits.map(b => `<td>${b}</td>`).join('')}<td><button data-i="${i}" class="kmap-cell ${r.f ? 'v1' : ''}" style="width:44px;height:36px">${r.f}</button></td><td style="font-family:monospace">m${i}</td></tr>`;
  });
  wrap.innerHTML = html + '</table>';
  wrap.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    boolRows[Number(b.dataset.i)].f ^= 1;
    renderBoolTable(); calcSOPPOS();
  }));
  calcSOPPOS();
}
function calcSOPPOS() {
  const n = parseInt(document.getElementById('bool-nvar').value, 10);
  const vars = boolVars(n);
  const ones = [], zeros = [];
  boolRows.forEach((r, i) => (r.f ? ones : zeros).push(i));
  const termSOP = (i) => boolRows[i].bits.map((b, j) => b ? vars[j] : vars[j] + "'").join('');
  const termPOS = (i) => '(' + boolRows[i].bits.map((b, j) => b ? vars[j] + "'" : vars[j]).join(' + ') + ')';
  document.getElementById('sop-out').textContent = ones.length ? `Σm(${ones.join(',')}) = ` + ones.map(termSOP).join(' + ') : '0 (nol)';
  document.getElementById('pos-out').textContent = zeros.length ? `ΠM(${zeros.join(',')}) = ` + zeros.map(termPOS).join('') : '1 (satu)';
  document.getElementById('bool-steps').innerHTML =
    `<div class="step-item"><div class="step-number">SOP dari F=1</div><div class="step-text">${ones.length} baris: tiap baris jadi suku AND (tanpa ' =1, dengan ' =0), lalu di-OR.</div></div>
     <div class="step-item"><div class="step-number">POS dari F=0</div><div class="step-text">${zeros.length} baris: tiap baris jadi suku OR (tanpa ' =0, dengan ' =1), lalu di-AND.</div></div>`;
}
document.getElementById('bool-gen')?.addEventListener('click', () => genBoolTable(false));
document.getElementById('bool-demo')?.addEventListener('click', () => {
  document.getElementById('bool-nvar').value = '2'; genBoolTable(true);
});
document.getElementById('bool-nvar')?.addEventListener('change', () => genBoolTable(false));
renderGates(); genBoolTable(false);
