// ===== Minggu 5-7: Rangkaian Kombinasional (Adder, MUX, DEC/ENC, 7-seg) =====
function combTgl(id, init) {
  const el = document.getElementById(id);
  if (!el) return { get: () => init || 0, set: () => {} };
  let v = init || 0;
  const paint = () => {
    const base = el.textContent.split('=')[0];
    el.textContent = base + '=' + v;
    el.classList.toggle('on', v === 1);
  };
  el.addEventListener('click', () => { v ^= 1; paint(); el.dispatchEvent(new Event('comb-change')); });
  paint();
  return { get: () => v, set: (x) => { v = x ? 1 : 0; paint(); } };
}
function combNum(id, def) {
  const el = document.getElementById(id);
  return () => {
    let v = parseInt((el && el.value || '').trim(), 10);
    if (isNaN(v)) v = def;
    return Math.max(0, Math.min(15, v));
  };
}
function bin4(v) { return v.toString(2).padStart(4, '0'); }

// ---- M5: Half Adder ----
(function () {
  if (!document.getElementById('w5-ha-a')) return;
  const A = combTgl('w5-ha-a', 0), B = combTgl('w5-ha-b', 0);
  const render = () => {
    const a = A.get(), b = B.get(), s = a ^ b, c = a & b;
    document.getElementById('w5-ha-s').textContent = s;
    document.getElementById('w5-ha-c').textContent = c;
    document.getElementById('w5-ha-steps').innerHTML =
      `<div class="step-item"><div class="step-number">S = A XOR B</div><div class="step-text">${a} XOR ${b} = <b>${s}</b></div></div>` +
      `<div class="step-item"><div class="step-number">C = A AND B</div><div class="step-text">${a} AND ${b} = <b>${c}</b></div></div>`;
  };
  ['w5-ha-a', 'w5-ha-b'].forEach(id => document.getElementById(id).addEventListener('comb-change', render));
  render();
})();

// ---- M5: Full Adder 1-bit ----
(function () {
  if (!document.getElementById('w5-fa-btn')) return;
  const A = combTgl('w5-fa-a', 0), B = combTgl('w5-fa-b', 0), Cin = combTgl('w5-fa-cin', 0);
  document.getElementById('w5-fa-btn').addEventListener('click', () => {
    const a = A.get(), b = B.get(), cin = Cin.get();
    const s = a ^ b ^ cin, cout = (a & b) | (cin & (a ^ b));
    document.getElementById('w5-fa-result').textContent = `S=${s}, Cout=${cout}`;
    document.getElementById('w5-fa-steps').innerHTML =
      `<div class="step-item"><div class="step-number">S</div><div class="step-text">${a} XOR ${b} XOR ${cin} = <b>${s}</b></div></div>` +
      `<div class="step-item"><div class="step-number">Cout</div><div class="step-text">AB + Cin(A XOR B) = ${a & b} + ${cin & (a ^ b)} = <b>${cout}</b></div></div>`;
  });
})();

// ---- M5: RCA 4-bit ----
(function () {
  const btn = document.getElementById('w5-rca-btn');
  if (!btn) return;
  const gA = combNum('w5-rca-a', 11), gB = combNum('w5-rca-b', 7);
  btn.addEventListener('click', () => {
    const A = gA(), B = gB();
    const aB = bin4(A), bB = bin4(B);
    let carry = 0, out = '', rows = [];
    for (let i = 3; i >= 0; i--) {
      const a = Number(aB[i]), b = Number(bB[i]);
      const s = a ^ b ^ carry, ncarry = (a & b) | (carry & (a ^ b));
      rows.unshift(`bit${3 - i}: ${a}+${b}+Cin${carry} → S=${s}, Cout=${ncarry}`);
      out = s + out; carry = ncarry;
    }
    const dec = A + B;
    document.getElementById('w5-rca-result').textContent = `${A} + ${B} = ${dec} (${bin4(A)} + ${bin4(B)} = ${carry}${out})`;
    document.getElementById('w5-rca-steps').innerHTML = rows.map((r, i) =>
      `<div class="step-item${i === 0 ? ' highlight' : ''}"><div class="step-number">Kolom ${i === 0 ? 'LSB' : i}</div><div class="step-text">${r}</div></div>`).join('') +
      `<div class="step-item"><div class="step-number">Carry akhir</div><div class="step-text">C4=${carry} → hasil 5-bit <b>${carry}${out}</b> = ${dec} desimal.</div></div>`;
  });
})();

// ---- M5: CLA G/P ----
(function () {
  const btn = document.getElementById('w5-cla-btn');
  if (!btn) return;
  const gA = combNum('w5-cla-a', 11), gB = combNum('w5-cla-b', 7);
  btn.addEventListener('click', () => {
    const A = gA(), B = gB(), C0 = Number(document.getElementById('w5-cla-c0').value || 0);
    const aB = bin4(A), bB = bin4(B);
    const G = [], P = [], C = [C0];
    for (let i = 3; i >= 0; i--) {
      const a = Number(aB[i]), b = Number(bB[i]);
      G.unshift(a & b); P.unshift(a ^ b);
    }
    for (let i = 0; i < 4; i++) C.push(G[i] | (P[i] & C[i]));
    let s = '';
    for (let i = 0; i < 4; i++) s += (P[i] ^ C[i]);
    document.getElementById('w5-cla-result').textContent = `G=${G.join('')} P=${P.join('')} carry=${C.join('')} → S=${s} (${parseInt(s, 2)}), C4=${C[4]}`;
    document.getElementById('w5-cla-steps').innerHTML =
      `<div class="step-item"><div class="step-number">G = A·B</div><div class="step-text">per bit: <b>${G.join(' ')}</b></div></div>` +
      `<div class="step-item"><div class="step-number">P = A XOR B</div><div class="step-text">per bit: <b>${P.join(' ')}</b></div></div>` +
      `<div class="step-item highlight"><div class="step-number">Carry paralel</div><div class="step-text">C1=G0+P0C0=${C[1]}, C2=${C[2]}, C3=${C[3]}, C4=${C[4]}. Sum bit i = Pi XOR Ci.</div></div>`;
  });
})();

// ---- M5: Full Subtractor 1-bit ----
(function () {
  const btn = document.getElementById('w5-sub-btn');
  if (!btn) return;
  const A = combTgl('w5-sub-a', 0), B = combTgl('w5-sub-b', 0), Bin = combTgl('w5-sub-bin', 0);
  btn.addEventListener('click', () => {
    const a = A.get(), b = B.get(), bin = Bin.get();
    const d = a ^ b ^ bin, bout = (((1 - a) & b) | (bin & (1 - (a ^ b))));
    document.getElementById('w5-sub-result').textContent = `D=${d}, Bout=${bout}`;
    document.getElementById('w5-sub-steps').innerHTML =
      `<div class="step-item"><div class="step-number">D</div><div class="step-text">${a} XOR ${b} XOR ${bin} = <b>${d}</b></div></div>` +
      `<div class="step-item"><div class="step-number">Bout</div><div class="step-text">A'B + Bin(A XOR B)' = ${(1 - a) & b} + ${bin & (1 - (a ^ b))} = <b>${bout}</b></div></div>`;
  });
})();

// ---- M5: Adder-Subtractor M ----
(function () {
  const btn = document.getElementById('w5-as-btn');
  if (!btn) return;
  const gA = combNum('w5-as-a', 11), gB = combNum('w5-as-b', 7);
  btn.addEventListener('click', () => {
    const A = gA(), B = gB(), M = Number(document.getElementById('w5-as-mode').value || 0);
    const bXor = B ^ (M ? 15 : 0);
    const res = M ? A - B : A + B;
    document.getElementById('w5-as-result').textContent = M ? `${A} − ${B} = ${res}` : `${A} + ${B} = ${res}`;
    document.getElementById('w5-as-steps').innerHTML =
      `<div class="step-item"><div class="step-number">Mode M=${M}</div><div class="step-text">${M ? 'Kurang: B di-XOR dengan 1111 (=NOT B), Cin=1 → A + C2(B)' : 'Tambah: B langsung, Cin=0 → A + B'}</div></div>` +
      `<div class="step-item"><div class="step-number">B efektif</div><div class="step-text">${bin4(B)} XOR ${M ? '1111' : '0000'} = <b>${bin4(bXor)}</b>, Cin=${M}</div></div>` +
      `<div class="step-item highlight"><div class="step-number">Hasil (desimal)</div><div class="step-text"><b>${res}</b> — pada hardware 4-bit dibaca modulo 16 (C2 untuk negatif).</div></div>`;
  });
})();

// ---- M6: NAND / NOR ----
(function () {
  const nb = document.getElementById('w6-nand-btn');
  if (nb) {
    const data = [
      { f: 'F = AB + CD', nn: "F = ((AB)'·(CD)')'", steps: 'AND→NAND per suku, OR→NAND: F=(AB) NAND (CD).' },
      { f: 'F = AB + BC + AC', nn: "F = ((AB)'·(BC)'·(AC)')'", steps: 'Tiga suku AND→tiga NAND 2-input, lalu NAND 3-input.' },
      { f: "F = A'B + AB' (XOR)", nn: "F = ((A'B)'·(AB')')'", steps: 'XOR dari SOP 2 suku → NAND-NAND 2 level.' },
    ];
    nb.addEventListener('click', () => {
      const d = data[Number(document.getElementById('w6-nand-sel').value || 0)];
      document.getElementById('w6-nand-out').textContent = d.nn;
      document.getElementById('w6-nand-steps').innerHTML = `<div class="step-item"><div class="step-number">SOP</div><div class="step-text">${d.f}</div></div><div class="step-item highlight"><div class="step-number">NAND-NAND</div><div class="step-text">${d.steps}<br><b>${d.nn}</b></div></div>`;
    });
  }
  const rb = document.getElementById('w6-nor-btn');
  if (rb) {
    const data = [
      { f: 'F = (A+B)(C+D)', nn: "F = ((A+B)'+(C+D)')'", steps: 'OR→NOR per kurung, AND→NOR: F=(A+B) NOR (C+D) di-NOR.' },
      { f: "F = (A+B+C)(A+B'+C')", nn: "F = ((A+B+C)'+(A+B'+C')')'", steps: 'Dua kurung OR→dua NOR 3-input, lalu NOR 2-input.' },
    ];
    rb.addEventListener('click', () => {
      const d = data[Number(document.getElementById('w6-nor-sel').value || 0)];
      document.getElementById('w6-nor-out').textContent = d.nn;
      document.getElementById('w6-nor-steps').innerHTML = `<div class="step-item"><div class="step-number">POS</div><div class="step-text">${d.f}</div></div><div class="step-item highlight"><div class="step-number">NOR-NOR</div><div class="step-text">${d.steps}<br><b>${d.nn}</b></div></div>`;
    });
  }
})();

// ---- M6: MUX ----
(function () {
  if (document.getElementById('w6-m21-i0')) {
    const I0 = combTgl('w6-m21-i0', 0), I1 = combTgl('w6-m21-i1', 0), S = combTgl('w6-m21-s', 0);
    const render = () => {
      const y = S.get() ? I1.get() : I0.get();
      document.getElementById('w6-m21-out').textContent = `Y = ${y} (S=${S.get()} memilih I${S.get()})`;
      document.getElementById('w6-m21-steps').innerHTML = `<div class="step-item"><div class="step-number">Y = S'I0 + SI1</div><div class="step-text">${1 - S.get()}·${I0.get()} + ${S.get()}·${I1.get()} = <b>${y}</b></div></div>`;
    };
    ['w6-m21-i0', 'w6-m21-i1', 'w6-m21-s'].forEach(id => document.getElementById(id).addEventListener('comb-change', render));
    render();
  }
  if (document.getElementById('w6-m41-d0')) {
    const D = [0, 1, 2, 3].map(i => combTgl('w6-m41-d' + i, 0));
    const S1 = combTgl('w6-m41-s1', 0), S0 = combTgl('w6-m41-s0', 0);
    const render = () => {
      const idx = S1.get() * 2 + S0.get(), y = D[idx].get();
      document.getElementById('w6-m41-out').textContent = `Y = D${idx} = ${y}`;
      document.getElementById('w6-m41-steps').innerHTML = `<div class="step-item"><div class="step-number">Select</div><div class="step-text">S1S0=${S1.get()}${S0.get()} → indeks ${idx} → <b>D${idx}=${y}</b></div></div>`;
    };
    ['w6-m41-d0', 'w6-m41-d1', 'w6-m41-d2', 'w6-m41-d3', 'w6-m41-s1', 'w6-m41-s0'].forEach(id => document.getElementById(id).addEventListener('comb-change', render));
    render();
  }
  if (document.getElementById('w6-m81-d0')) {
    const D = Array.from({ length: 8 }, (_, i) => combTgl('w6-m81-d' + i, 0));
    const S2 = combTgl('w6-m81-s2', 0), S1 = combTgl('w6-m81-s1', 0), S0 = combTgl('w6-m81-s0', 0);
    const render = () => {
      const idx = S2.get() * 4 + S1.get() * 2 + S0.get(), y = D[idx].get();
      document.getElementById('w6-m81-out').textContent = `Y = D${idx} = ${y}`;
      document.getElementById('w6-m81-steps').innerHTML = `<div class="step-item"><div class="step-number">Select</div><div class="step-text">S2S1S0=${S2.get()}${S1.get()}${S0.get()} → indeks ${idx} → <b>D${idx}=${y}</b></div></div>`;
    };
    Array.from({ length: 8 }, (_, i) => 'w6-m81-d' + i).concat(['w6-m81-s2', 'w6-m81-s1', 'w6-m81-s0']).forEach(id => document.getElementById(id).addEventListener('comb-change', render));
    render();
  }
})();

// ---- M7: Decoder ----
function decRender(prefix, n) {
  const outs = document.getElementById(prefix + '-out'), steps = document.getElementById(prefix + '-steps');
  if (!outs) return;
  const names = prefix.endsWith('d24') ? ['a', 'b'] : ['a', 'b', 'c'];
  const enEl = document.getElementById(prefix + '-en');
  const render = () => {
    const bits = names.map(k => Number(document.getElementById(`${prefix}-${k}`).textContent.split('=')[1] || 0));
    const en = Number(enEl.textContent.split('=')[1] || 0);
    let idx = 0;
    bits.forEach(b => { idx = idx * 2 + b; });
    const N = Math.pow(2, n);
    let html = '';
    for (let i = 0; i < N; i++) {
      const on = en && i === idx;
      html += `<div class="triple-card"><h4>Y${i}</h4><div class="mono">${on ? 1 : 0}</div></div>`;
    }
    outs.innerHTML = html;
    steps.innerHTML = en
      ? `<div class="step-item highlight"><div class="step-number">Aktif</div><div class="step-text">Input ${bits.join('')}₂ = ${idx} → <b>Y${idx}=1</b>, sisanya 0. (Yi = mi·EN)</div></div>`
      : `<div class="step-item"><div class="step-number">EN=0</div><div class="step-text">Enable mati → <b>semua output 0</b>.</div></div>`;
  };
  names.forEach(k => document.getElementById(`${prefix}-${k}`).addEventListener('comb-change', render));
  enEl.addEventListener('comb-change', render);
  render();
}
(function () {
  if (!document.getElementById('w7-d24-a')) return;
  const mk = (id, init) => combTgl(id, init);
  mk('w7-d24-a', 0); mk('w7-d24-b', 0); mk('w7-d24-en', 1);
  mk('w7-d38-a', 0); mk('w7-d38-b', 0); mk('w7-d38-c', 0); mk('w7-d38-en', 1);
  decRender('w7-d24', 2); decRender('w7-d38', 3);
})();

// ---- M7: Encoder + Priority ----
(function () {
  if (!document.getElementById('w7-enc-d0')) return;
  const E = [0, 1, 2, 3].map(i => combTgl('w7-enc-d' + i, 0));
  const renderEnc = () => {
    const d = E.map(e => e.get());
    const n = d.reduce((a, b) => a + b, 0);
    const a1 = (d[2] || d[3]) ? 1 : 0, a0 = (d[1] || d[3]) ? 1 : 0, v = n ? 1 : 0;
    document.getElementById('w7-enc-out').textContent = n === 1 ? `A1A0 = ${a1}${a0}, V=${v}` : `Tak valid (tepat satu input harus 1, kini ${n} aktif)`;
    document.getElementById('w7-enc-steps').innerHTML = `<div class="step-item"><div class="step-number">Rumus</div><div class="step-text">A1=D2+D3=${a1}, A0=D1+D3=${a0}, V=D0+D1+D2+D3=${v}</div></div>`;
  };
  ['w7-enc-d0', 'w7-enc-d1', 'w7-enc-d2', 'w7-enc-d3'].forEach(id => document.getElementById(id).addEventListener('comb-change', renderEnc));
  renderEnc();
  const P = [0, 1, 2, 3].map(i => combTgl('w7-pri-d' + i, 0));
  const renderPri = () => {
    const d = P.map(e => e.get());
    let win = -1;
    for (let i = 3; i >= 0; i--) if (d[i]) { win = i; break; }
    if (win === -1) {
      document.getElementById('w7-pri-out').textContent = 'A1A0 = 00, V=0 (tak ada input)';
      document.getElementById('w7-pri-steps').innerHTML = `<div class="step-item"><div class="step-text">Semua 0 → V=0.</div></div>`;
    } else {
      const a1 = win >= 2 ? 1 : 0, a0 = win % 2;
      document.getElementById('w7-pri-out').textContent = `Menang D${win} → A1A0 = ${a1}${a0}, V=1`;
      document.getElementById('w7-pri-steps').innerHTML = `<div class="step-item highlight"><div class="step-number">Prioritas</div><div class="step-text">Input aktif: ${d.map((v, i) => v ? 'D' + i : '').filter(Boolean).join(', ')} → tertinggi <b>D${win}</b> → kode <b>${a1}${a0}</b>.</div></div>`;
    }
  };
  ['w7-pri-d0', 'w7-pri-d1', 'w7-pri-d2', 'w7-pri-d3'].forEach(id => document.getElementById(id).addEventListener('comb-change', renderPri));
  renderPri();
})();

// ---- M7: BCD to 7-seg ----
(function () {
  const sel = document.getElementById('w7-seg-sel');
  if (!sel) return;
  const SEG = { 0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc', 5: 'afgcd', 6: 'afgedc', 7: 'abc', 8: 'abcdefg', 9: 'abcfgd', 10: 'abcefg', 11: 'fgedc', 12: 'afed', 13: 'bgced', 14: 'afged', 15: 'afge' };
  const HEX = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'b', 'C', 'd', 'E', 'F'];
  const render = () => {
    const v = Number(sel.value), type = document.getElementById('w7-seg-type').value;
    const on = SEG[v].split('');
    const isOn = (s) => on.includes(s);
    const disp = document.getElementById('w7-seg-display');
    const seg = (id, horiz) => {
      const lit = isOn(id);
      return `<div class="seg ${horiz ? 'h' : 'v'} ${lit ? 'lit' : ''}" title="${id}">${id}</div>`;
    };
    disp.innerHTML = `<div class="seg7">${seg('a', 1)}<div class="seg-row">${seg('f', 0)}${seg('b', 0)}</div>${seg('g', 1)}<div class="seg-row">${seg('e', 0)}${seg('c', 0)}</div>${seg('d', 1)}</div>`;
    const bits = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map(s => (isOn(s) ? (type === 'CC' ? 1 : 0) : (type === 'CC' ? 0 : 1))).join('');
    document.getElementById('w7-seg-out').textContent = `${HEX[v]} → segmen ${bits} (${type})`;
    document.getElementById('w7-seg-steps').innerHTML = `<div class="step-item"><div class="step-number">Segmen menyala</div><div class="step-text">${on.join(', ').toUpperCase()} → ${type === 'CC' ? 'logika 1 menyalakan (katoda bersama ke GND)' : 'logika 0 menyalakan (anoda bersama ke VCC)'}.</div></div>`;
  };
  sel.addEventListener('change', render);
  document.getElementById('w7-seg-type').addEventListener('change', render);
  render();
})();
