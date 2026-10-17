// ===== Minggu 2: Signed number SM / C1 / C2 =====
function toBinaryUnsigned(val, width) {
  let s = val.toString(2);
  if (s.length > width) return s.slice(-width);
  return s.padStart(width, '0');
}
function notBits(s) { return s.split('').map(c => c === '0' ? '1' : '0').join(''); }
function addOne(s) {
  const arr = s.split('').map(Number);
  let carry = 1;
  for (let i = arr.length - 1; i >= 0; i--) {
    const sum = arr[i] + carry;
    arr[i] = sum % 2; carry = Math.floor(sum / 2);
  }
  return { result: arr.join(''), carryOut: carry };
}
function groupNibble(s) { return s.replace(/(.{4})/g, '$1 ').trim(); }

function signedConvert() {
  const inp = document.getElementById('signed-input');
  const w = parseInt(document.getElementById('signed-width').value, 10);
  const steps = document.getElementById('signed-steps');
  const v = parseInt((inp.value || '').trim(), 10);
  if (isNaN(v)) { steps.innerHTML = '<p class="placeholder-text">Masukkan desimal valid, contoh -13.</p>'; return; }
  const minSM = -(Math.pow(2, w - 1) - 1), maxSM = Math.pow(2, w - 1) - 1;
  const minC2 = -Math.pow(2, w - 1), maxC2 = Math.pow(2, w - 1) - 1;
  const mag = toBinaryUnsigned(Math.abs(v), w - 1);
  // SM
  let sm = (v < 0 ? '1' : '0') + mag;
  // C1
  const pos = toBinaryUnsigned(Math.abs(v), w);
  let c1 = v < 0 ? notBits(pos) : pos;
  // C2
  let c2, c2info = '';
  if (v >= 0) { c2 = pos; c2info = 'Positif: sama dengan biner.'; }
  else {
    const inv = notBits(toBinaryUnsigned(Math.abs(v), w));
    const r = addOne(inv);
    c2 = r.result;
    c2info = `NOT(${toBinaryUnsigned(Math.abs(v), w)}) = ${inv}, +1 = ${c2}`;
  }
  document.getElementById('sm-out').textContent = groupNibble(sm);
  document.getElementById('c1-out').textContent = groupNibble(c1);
  document.getElementById('c2-out').textContent = groupNibble(c2);
  document.getElementById('signed-hex').textContent = '0x' + parseInt(c2, 2).toString(16).toUpperCase().padStart(Math.ceil(w / 4), '0');
  document.getElementById('signed-oct').textContent = parseInt(c2, 2).toString(8);

  let warn = '';
  if (v < minC2 || v > maxC2) warn = `<div class="step-item" style="border-left-color:#E74C3C"><div class="step-number" style="color:#E74C3C">Overflow range</div><div class="step-text">${v} di luar rentang C2 ${w}-bit (${minC2}..${maxC2}). Hasil terpotong.</div></div>`;
  else if (v < minSM || v > maxSM) warn = `<div class="step-item"><div class="step-number">Catatan</div><div class="step-text">${v} di luar SM/C1 ${w}-bit (${minSM}..${maxSM}) tapi masih valid C2.</div></div>`;
  steps.innerHTML = `
    <div class="step-item"><div class="step-number">Langkah 1 — Biner positif ${w}-bit</div><div class="step-text">|${v}| = ${groupNibble(pos)}</div></div>
    <div class="step-item highlight"><div class="step-number">Langkah 2 — SM</div><div class="step-text">MSB tanda + magnitudo ${groupNibble(mag)} → <b>${groupNibble(sm)}</b></div></div>
    <div class="step-item highlight"><div class="step-number">Langkah 3 — C1</div><div class="step-text">NOT semua bit → <b>${groupNibble(c1)}</b></div></div>
    <div class="step-item highlight"><div class="step-number">Langkah 4 — C2</div><div class="step-text">${c2info} → <b>${groupNibble(c2)}</b></div></div>
    ${warn}`;
}

function signedOp() {
  const W = 8;
  const a = parseInt(document.getElementById('op-a').value.trim(), 10);
  const b = parseInt(document.getElementById('op-b').value.trim(), 10);
  const isSub = document.getElementById('op-sel').value === 'sub';
  const resEl = document.getElementById('op-result');
  const stepsEl = document.getElementById('op-steps');
  if (isNaN(a) || isNaN(b)) { resEl.textContent = 'Error!'; return; }
  const toC2 = (v) => {
    const p = toBinaryUnsigned(Math.abs(v) % 256, W);
    if (v >= 0) return p;
    return addOne(notBits(p)).result;
  };
  const aBin = toC2(a), bBin = toC2(b);
  const bEff = isSub ? addOne(notBits(bBin)).result : bBin;
  // binary add with carry trace
  let carry = 0, out = '', carries = [];
  for (let i = W - 1; i >= 0; i--) {
    const s = Number(aBin[i]) + Number(bEff[i]) + carry;
    out = (s % 2) + out; carries.unshift(carry); carry = s >= 2 ? 1 : 0;
  }
  const carryOut = carry;
  const carryIntoMSB = carries[0];
  const overflow = (carryIntoMSB ^ carryOut) === 1;
  // decode C2 result
  let dec = parseInt(out, 2);
  if (out[0] === '1') dec = dec - 256;
  resEl.textContent = `${isSub ? a + ' − ' + b : a + ' + ' + b} = ${dec}` + (overflow ? '  ⚠️ OVERFLOW' : '');
  resEl.style.color = overflow ? '#E74C3C' : 'var(--primary-color)';
  stepsEl.innerHTML = `
    <div class="step-item"><div class="step-number">Langkah 1</div><div class="step-text">A=${a} → ${groupNibble(aBin)} | B=${b} → ${groupNibble(bBin)}</div></div>
    <div class="step-item"><div class="step-number">Langkah 2</div><div class="step-text">${isSub ? `C2 dari B = NOT + 1 = ${groupNibble(bEff)}` : 'Penjumlahan langsung'} </div><div class="step-code">${groupNibble(aBin)} + ${groupNibble(bEff)}</div></div>
    <div class="step-item highlight"><div class="step-number">Langkah 3 — Hasil</div><div class="step-text">= ${groupNibble(out)} = ${dec}. carry-in MSB=${carryIntoMSB}, carry-out=${carryOut} → ${overflow ? '<b>OVERFLOW (positif→negatif / sebaliknya)</b>' : 'tidak overflow'}.</div></div>`;
}

document.getElementById('signed-btn')?.addEventListener('click', signedConvert);
document.getElementById('signed-input')?.addEventListener('keypress', e => { if (e.key === 'Enter') signedConvert(); });
document.getElementById('op-btn')?.addEventListener('click', signedOp);
