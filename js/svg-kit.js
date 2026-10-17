// ===== svg-kit.js: pustaka diagram SVG untuk modul Sistem Digital =====
// Mount otomatis: elemen dengan [data-svg="kunci"] akan diisi gambar.
(function () {
  // ---------- helper primitif ----------
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  function txt(x, y, t, cls = 'svg-label', anchor = 'middle', size = 13) {
    return `<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}">${esc(t)}</text>`;
  }
  function line(x1, y1, x2, y2, cls = 'svg-line') {
    return `<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  }
  function poly(pts, cls = 'svg-line') {
    return `<polyline class="${cls}" points="${pts}" fill="none"/>`;
  }
  function node(x, y, w, h, cls = 'svg-node', r = 8) {
    return `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`;
  }
  function path(d, cls = 'svg-node') { return `<path class="${cls}" d="${d}"/>`; }
  function dot(x, y, cls = 'svg-dot') { return `<circle class="${cls}" cx="${x}" cy="${y}" r="3.5"/>`; }

  // simbol gerbang logika. (x,y) = sudut kiri-atas bodi, mengembalikan {body, outX, cy}
  function gate(type, x, y, w = 46, h = 44) {
    const cy = y + h / 2, r = 5;
    const orType = ['OR', 'NOR', 'XOR', 'XNOR'].includes(type);
    const bubble = ['NOT', 'NAND', 'NOR', 'XNOR'].includes(type);
    let s = '';
    if (type === 'NOT') {
      s += path(`M${x},${y} L${x + w},${cy} L${x},${y + h} Z`);
    } else if (orType) {
      s += path(`M${x},${y} Q${x + w * 0.5},${y} ${x + w},${cy} Q${x + w * 0.5},${y + h} ${x},${y + h} Q${x + w * 0.28},${cy} ${x},${y} Z`);
      if (type === 'XOR' || type === 'XNOR') s += path(`M${x - 7},${y} Q${x - 1},${cy} ${x - 7},${y + h}`, 'svg-line');
    } else {
      s += path(`M${x},${y} L${x + w * 0.5},${y} A${w * 0.5},${h / 2} 0 0 1 ${x + w * 0.5},${y + h} L${x},${y + h} Z`);
    }
    if (bubble) s += `<circle class="svg-node" cx="${x + w + r}" cy="${cy}" r="${r}"/>`;
    return { body: s, outX: x + w + (bubble ? 2 * r : 0), cy };
  }

  function gate2(type, x, y, label) {
    const w = 46, h = 44;
    const g = gate(type, x, y, w, h);
    const cy = g.cy;
    return g.body +
      line(x - 22, y + h * 0.3, x, y + h * 0.3) +
      line(x - 22, y + h * 0.7, x, y + h * 0.7) +
      line(g.outX, cy, g.outX + 22, cy) +
      txt(x + w * 0.5, cy + 4, label, 'svg-label', 'middle', 11);
  }

  // kotak blok berlabel
  function block(x, y, w, h, label, cls = 'svg-block') {
    return node(x, y, w, h, cls, 10) + txt(x + w / 2, y + h / 2 + 4, label, 'svg-label', 'middle', 12);
  }

  // ---------- diagram ----------
  const D = {};

  D['bit-weights'] = () => {
    const bits = '10110';
    const weights = [16, 8, 4, 2, 1];
    let x = 40, terms = [];
    for (let i = 0; i < 5; i++) {
      const on = bits[i] === '1';
      terms.push(`<rect class="svg-box ${on ? 'svg-box-on' : ''}" x="${x}" y="40" width="52" height="52" rx="8"/>`);
      terms.push(txt(x + 26, 46, '2^' + (4 - i), 'svg-sub', 'middle', 11));
      terms.push(txt(x + 26, 78, bits[i], 'svg-bit ' + (on ? 'svg-bit-on' : ''), 'middle', 26));
      if (on) terms.push(txt(x + 26, 116, '×' + weights[i], 'svg-label', 'middle', 12));
      x += 64;
    }
    terms.push(txt(40 + 5 * 64 - 30 + 8, 78, '=', 'svg-op', 'middle', 24));
    terms.push(txt(40 + 5 * 64 + 62, 78, '22', 'svg-result', 'middle', 30));
    return `<svg viewBox="0 0 ${40 + 5 * 64 + 110} 140" role="img">${terms.join('')}</svg>`;
  };

  D['signed-circle'] = () => {
    const cx = 190, cy = 150, r = 105;
    const vals = [0, 1, 2, 3, -4, -3, -2, -1];
    let s = `<circle class="svg-line" cx="${cx}" cy="${cy}" r="${r}"/>`;
    s += `<circle class="svg-line-dash" cx="${cx}" cy="${cy}" r="${r - 34}"/>`;
    vals.forEach((v, i) => {
      const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      const lx = cx + Math.cos(a) * (r + 24), ly = cy + Math.sin(a) * (r + 24);
      const b = ((v + 16) % 16).toString(2).padStart(4, '0');
      s += dot(x, y);
      s += txt(lx, ly + 4, `${v}`, 'svg-label', 'middle', 13);
      s += `<text class="svg-sub" x="${x + Math.cos(a) * 22}" y="${y + Math.sin(a) * 22 + 4}" text-anchor="middle" font-size="10">${b}</text>`;
    });
    s += txt(cx, cy - 6, '4-bit 2\'s', 'svg-title', 'middle', 13);
    s += txt(cx, cy + 12, 'complement', 'svg-title', 'middle', 12);
    return `<svg viewBox="0 0 380 310" role="img">${s}</svg>`;
  };

  D['logic-gates'] = () => {
    const types = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'];
    const cell = 108;
    let s = '';
    types.forEach((t, i) => {
      const x = 34 + i * cell, y = 30;
      if (t === 'NOT') {
        s += gate('NOT', x, y, 46, 44).body + line(x - 22, y + 22, x, y + 22) + line(x + 56, y + 22, x + 78, y + 22);
      } else {
        s += gate2(t, x, y, '');
      }
      s += txt(x + 24, y + 78, t, 'svg-title', 'middle', 12);
    });
    return `<svg viewBox="0 0 ${34 * 2 + 7 * cell} 130" role="img">${s}</svg>`;
  };

  D['half-adder'] = () => {
    let s = '';
    s += gate2('XOR', 150, 20, '');
    s += gate2('AND', 150, 90, '');
    s += line(40, 33, 128, 33) + line(40, 115, 128, 115);
    s += dot(70, 33) + dot(70, 115);
    s += poly(`70,33 70,115`) ;
    s += line(40, 33, 40, 33);
    s += txt(28, 37, 'A', 'svg-label', 'end', 15);
    s += txt(28, 119, 'B', 'svg-label', 'end', 15);
    // split A to XOR top & AND top
    s += line(70, 33, 70, 43) + line(70, 43, 128, 43);
    s += line(70, 115, 128, 105);
    s += txt(218, 47, 'S = A⊕B', 'svg-title', 'start', 13);
    s += txt(218, 117, 'C = A·B', 'svg-title', 'start', 13);
    return `<svg viewBox="0 0 330 170" role="img">${s}</svg>`;
  };

  D['full-adder'] = () => {
    // dua half adder + OR
    let s = '';
    // HA1
    s += block(70, 20, 90, 46, 'Half Adder');
    s += block(70, 110, 90, 46, 'Half Adder');
    s += block(250, 66, 56, 44, 'OR');
    // inputs
    s += line(20, 40, 70, 40) + txt(16, 44, 'A', 'svg-label', 'end', 14);
    s += line(20, 60, 70, 60) + txt(16, 64, 'B', 'svg-label', 'end', 14);
    s += txt(16, 44, '', 'svg-label');
    // Cin into HA2
    s += line(20, 133, 70, 133) + txt(14, 137, 'Cin', 'svg-label', 'end', 14);
    // HA1 sum -> HA2 (top input)
    s += line(160, 43, 205, 43) + line(205, 43, 205, 130) + line(205, 130, 205, 130);
    s += line(205, 118, 205, 118);
    s += line(205, 118, 205, 118);
    // connect 205 -> HA2 top (A side at y=130)
    s += line(160, 43, 205, 43);
    s += poly('205,43 205,130 250,130') ;
    // HA1 carry -> OR
    s += poly('160,63 210,63 210,88 250,88');
    // HA2 sum -> S out
    s += line(250, 133, 310, 133) + line(310, 133, 310, 133);
    s += txt(316, 137, 'S', 'svg-title', 'start', 14);
    // HA2 carry -> OR bottom
    s += poly('250,153 230,153 230,108 250,108');
    // OR out -> Cout
    s += line(306, 88, 340, 88) + txt(346, 92, 'Cout', 'svg-title', 'start', 12);
    // labels
    s += txt(115, 90, 'S₁', 'svg-sub', 'middle', 11);
    s += txt(185, 90, 'C₁', 'svg-sub', 'middle', 11);
    return `<svg viewBox="0 0 410 190" role="img">${s}</svg>`;
  };

  D['rca4'] = () => {
    const y = 60, w = 74, h = 60, step = 118, x0 = 60;
    const totalW = x0 + 3 * step + w + 90;
    let s = '';
    s += txt(x0 - 34, y + 34, 'Cin', 'svg-label', 'end', 12);
    s += line(x0 - 30, y + 30, x0, y + 30);
    for (let i = 0; i < 4; i++) {
      const x = x0 + i * step;
      s += block(x, y, w, h, 'FA');
      s += txt(x + w / 2, y - 8, `bit ${i}`, 'svg-sub', 'middle', 11);
      s += txt(x + 6, y + 20, `A${i}`, 'svg-sub', 'start', 11);
      s += txt(x + 6, y + 48, `B${i}`, 'svg-sub', 'start', 11);
      s += line(x - 16, y + 16, x, y + 16);
      s += line(x - 16, y + 44, x, y + 44);
      s += line(x + w, y + 30, x + w + 18, y + 30);
      s += txt(x + w + 24, y + 22, `S${i}`, 'svg-sub', 'start', 11);
      if (i < 3) {
        s += poly(`${x + w},${y + 50} ${x + step - 18},${y + 50} ${x + step - 18},${y + h} ${x + step},${y + h}`);
      }
    }
    const lastX = x0 + 3 * step + w;
    s += line(lastX, y + 50, lastX + 34, y + 50);
    s += txt(lastX + 38, y + 54, 'Cout', 'svg-title', 'start', 12);
    s += txt(x0 + 1.5 * step, y + h + 42, 'carry merambat dari LSB ke MSB (delay O(N))', 'svg-sub', 'middle', 11);
    return `<svg viewBox="0 0 ${totalW} ${y + h + 70}" role="img">${s}</svg>`;
  };

  D['cla-gp'] = () => {
    let s = '';
    for (let i = 0; i < 4; i++) {
      const x = 40 + i * 84;
      s += block(x, 20, 60, 54, '');
      s += txt(x + 30, 44, `G${i}, P${i}`, 'svg-label', 'middle', 12);
      s += line(x + 30, 2, x + 30, 20);
      s += txt(x + 30, -4, `A${i} B${i}`, 'svg-sub', 'middle', 10);
      s += line(x + 30, 74, x + 30, 92);
    }
    s += node(40, 92, 4 * 84 - 24, 50, 'svg-block', 10);
    s += txt(40 + (4 * 84 - 24) / 2, 122, 'Logika Carry Lookahead (paralel)', 'svg-label', 'middle', 12);
    s += txt(40 + (4 * 84 - 24) / 2, 170, 'C1 = G0+P0·C0   C2 = G1+P1·G0+P1·P0·C0   …', 'svg-sub', 'middle', 11);
    return `<svg viewBox="0 0 ${40 * 2 + 4 * 84} 195" role="img">${s}</svg>`;
  };

  D['adder-subtractor'] = () => {
    let s = '';
    // XOR bank
    for (let i = 0; i < 4; i++) {
      const x = 30 + i * 70;
      s += gate('XOR', x, 30, 40, 34).body;
      s += txt(x + 20, 84, `B${i}`, 'svg-sub', 'middle', 11);
      s += txt(x + 20, 108, `B${i}’`, 'svg-sub', 'middle', 11);
      s += line(x + 20, 64, x + 20, 130);
    }
    s += block(320, 40, 90, 60, 'Adder 4-bit');
    s += line(20, 95, 320, 95);
    s += txt(20, 40, 'M ─▶  B⊕M', 'svg-title', 'start', 12);
    s += txt(20, 150, 'Cin = M', 'svg-title', 'start', 12);
    s += line(410, 70, 460, 70) + txt(466, 74, 'S', 'svg-title', 'start', 14);
    return `<svg viewBox="0 0 520 175" role="img">${s}</svg>`;
  };

  D['mux21'] = () => {
    let s = '';
    s += path('M150,20 L150,140 L250,100 L250,60 Z', 'svg-node');
    s += txt(120, 45, 'I0', 'svg-label', 'end', 14) + line(100, 45, 150, 45);
    s += txt(120, 115, 'I1', 'svg-label', 'end', 14) + line(100, 115, 150, 115);
    s += txt(100, 160, 'S', 'svg-label', 'end', 14) + line(104, 155, 104, 155);
    s += line(60, 160, 60, 90) + line(60, 90, 150, 90);
    s += txt(60, 178, 'select', 'svg-sub', 'middle', 10);
    s += line(250, 80, 300, 80) + txt(306, 84, 'Y', 'svg-title', 'start', 15);
    s += txt(200, 200, 'Y = S’·I0 + S·I1', 'svg-sub', 'middle', 12);
    return `<svg viewBox="0 0 380 215" role="img">${s}</svg>`;
  };

  D['mux41'] = () => {
    let s = '';
    s += path('M170,20 L170,180 L290,120 L290,80 Z', 'svg-node');
    ['I0', 'I1', 'I2', 'I3'].forEach((lab, i) => {
      const y = 42 + i * 38;
      s += txt(140, y + 5, lab, 'svg-label', 'end', 13) + line(110, y, 170, y);
    });
    s += line(60, 210, 60, 110) + line(60, 110, 170, 110) + txt(30, 230, 'S1', 'svg-label', 'middle', 12);
    s += line(90, 230, 90, 140) + line(90, 140, 170, 140) + txt(90, 250, 'S0', 'svg-label', 'middle', 12);
    s += line(290, 100, 340, 100) + txt(346, 104, 'Y', 'svg-title', 'start', 15);
    s += txt(230, 30, 'MUX 4:1', 'svg-title', 'middle', 13);
    return `<svg viewBox="0 0 400 265" role="img">${s}</svg>`;
  };

  D['nand-universal'] = () => {
    let s = '';
    const rows = [
      ['NOT  A’', 'NAND(A,A)'],
      ['AND  A·B', 'NAND → NOT'],
      ['OR  A+B', 'NAND + De Morgan']
    ];
    rows.forEach((r, i) => {
      const y = 30 + i * 60;
      s += block(20, y, 150, 42, r[0]);
      s += txt(350, y + 26, r[1], 'svg-sub', 'middle', 12);
      s += line(170, y + 21, 280, y + 21);
    });
    return `<svg viewBox="0 0 470 210" role="img">${s}</svg>`;
  };

  D['decoder24'] = () => {
    let s = '';
    s += node(40, 60, 110, 100, 'svg-node', 10);
    s += txt(95, 115, 'DEC 2→4', 'svg-title', 'middle', 13);
    s += txt(20, 88, 'A', 'svg-label', 'end', 13) + line(4, 84, 40, 84);
    s += txt(20, 132, 'B', 'svg-label', 'end', 13) + line(4, 128, 40, 128);
    s += txt(20, 176, 'EN', 'svg-label', 'end', 12) + line(4, 172, 40, 172);
    for (let i = 0; i < 4; i++) {
      const y = 62 + i * 26;
      const on = i === 2;
      s += line(150, y, 250, y);
      s += `<rect class="svg-box ${on ? 'svg-box-on' : ''}" x="250" y="${y - 10}" width="34" height="20" rx="4"/>`;
      s += txt(305, y + 5, `Y${i}=${on ? '1' : '0'}`, 'svg-sub', 'middle', 12);
    }
    s += txt(250, 200, 'contoh: A=1, B=0 → Y2 aktif', 'svg-sub', 'middle', 11);
    return `<svg viewBox="0 0 380 215" role="img">${s}</svg>`;
  };

  D['encoder42'] = () => {
    let s = '';
    s += node(140, 50, 110, 110, 'svg-node', 10);
    s += txt(195, 110, 'ENC 4→2', 'svg-title', 'middle', 13);
    ['D0', 'D1', 'D2', 'D3'].forEach((lab, i) => {
      const y = 70 + i * 25;
      s += txt(130, y + 4, lab, 'svg-label', 'end', 12) + line(100, y, 140, y);
    });
    s += line(250, 85, 330, 85) + txt(336, 89, 'A1', 'svg-title', 'start', 14);
    s += line(250, 130, 330, 130) + txt(336, 134, 'A0', 'svg-title', 'start', 14);
    s += txt(195, 185, 'A1=D2+D3   A0=D1+D3', 'svg-sub', 'middle', 12);
    return `<svg viewBox="0 0 400 200" role="img">${s}</svg>`;
  };

  D['seven-seg'] = () => {
    // pemetaan segmen untuk menampilkan angka "2"
    const lit = { a: 1, b: 1, c: 0, d: 1, e: 1, f: 0, g: 1 };
    const segs = [
      ['a', 60, 20, 80, 14, 'h'],
      ['b', 145, 35, 14, 60, 'v'],
      ['c', 145, 110, 14, 60, 'v'],
      ['d', 60, 175, 80, 14, 'h'],
      ['e', 45, 110, 14, 60, 'v'],
      ['f', 45, 35, 14, 60, 'v'],
      ['g', 60, 98, 80, 14, 'h']
    ];
    let s = '';
    segs.forEach(([n, x, y, w, h]) => {
      s += `<rect class="seg-rect ${lit[n] ? 'seg-on' : ''}" x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/>`;
      s += txt(x + w + 16, y + h / 2 + 4, n, 'svg-sub', 'middle', 12);
    });
    s += txt(230, 60, 'digit “2”', 'svg-title', 'start', 14);
    s += txt(230, 84, 'a,b,g,e,d = ON', 'svg-sub', 'start', 11);
    s += txt(230, 104, 'c,f = OFF', 'svg-sub', 'start', 11);
    return `<svg viewBox="0 0 360 210" role="img">${s}</svg>`;
  };

  D['gray-code'] = () => {
    const seq = ['00', '01', '11', '10'];
    let s = '';
    seq.forEach((v, i) => {
      const x = 30 + i * 100;
      s += `<rect class="svg-box" x="${x}" y="40" width="70" height="60" rx="8"/>`;
      s += txt(x + 35, 78, v, 'svg-bit', 'middle', 24);
      if (i < 3) s += txt(x + 85, 78, '→', 'svg-op', 'middle', 18);
    });
    s += txt(230, 140, 'hanya 1 bit berubah antar kotak', 'svg-sub', 'middle', 12);
    return `<svg viewBox="0 0 460 170" role="img">${s}</svg>`;
  };

  // ---------- mount ----------
  function mount(root) {
    (root || document).querySelectorAll('[data-svg]').forEach(el => {
      const key = el.dataset.svg;
      if (D[key]) el.innerHTML = D[key]();
    });
  }

  window.SISDIG_SVG = { D, mount };
  mount(document);
})();
