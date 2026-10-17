// ===== home.js: peta 14 minggu di halaman silabus =====
(function () {
  const host = document.getElementById('week-map');
  if (!host) return;

  const WEEKS = [
    { n: 1, icon: '🔢', title: 'Konversi Bilangan', desc: 'Analog vs digital, biner–oktal–heksa–desimal, MSB/LSB.', tag: 'biner' },
    { n: 2, icon: '➖', title: 'Bilangan Negatif', desc: 'Sign-magnitude, 1’s & 2’s complement, overflow.', tag: 'biner' },
    { n: 3, icon: '🔌', title: 'Aljabar Boolean', desc: 'Gerbang logika, hukum Boolean, SOP & POS.', tag: 'logika' },
    { n: 4, icon: '🗺️', title: 'Karnaugh Map', desc: 'Penyederhanaan fungsi Boolean secara grafis.', tag: 'logika' },
    { n: 5, icon: '➕', title: 'Adder & Subtractor', desc: 'Half/Full adder, RCA, CLA, subtractor.', tag: 'kombinasional' },
    { n: 6, icon: '🔀', title: 'NAND/NOR & MUX', desc: 'Gerbang universal, multilevel, multiplexer.', tag: 'kombinasional' },
    { n: 7, icon: '🔽', title: 'Decoder & Encoder', desc: 'Decoder, priority encoder, display 7-segmen.', tag: 'kombinasional' },
    { n: 8, icon: '🔁', title: 'Latch & Flip-Flop', desc: 'SR, D, JK, T, counter sinkron/ripple.', tag: 'sekuensial' },
    { n: 9, icon: '📦', title: 'Register', desc: 'PIPO, SISO, SIPO, PISO, shift register.', tag: 'sekuensial' },
    { n: 10, icon: '🚦', title: 'Machine State (FSM)', desc: 'Diagram state, Mealy/Moore, detektor sekuens.', tag: 'sekuensial' },
    { n: 11, icon: '💾', title: 'Memori', desc: 'RAM, ROM, organisasi alamat × data, kapasitas.', tag: 'sistem' },
    { n: 12, icon: '📶', title: 'ADC/DAC & PLD', desc: 'Konversi analog-digital, R-2R, FPGA.', tag: 'sistem' },
    { n: 13, icon: '🛠️', title: 'Proyek Mini', desc: 'Counter + decoder + FSM kunci digital.', tag: 'sistem' },
    { n: 14, icon: '🎓', title: 'Review & Tryout', desc: 'Cheatsheet gabungan dan tryout UAS.', tag: 'sistem' }
  ];

  host.innerHTML = WEEKS.map(w => `
    <a class="week-card" href="minggu${w.n}.html">
      <div class="week-card-top">
        <span class="week-icon">${w.icon}</span>
        <span class="week-tag week-tag-${w.tag.replace(/\s/g, '')}">${w.tag}</span>
      </div>
      <div class="week-week">Minggu ${w.n}</div>
      <h4>${w.title}</h4>
      <p>${w.desc}</p>
      ${w.n <= 7 ? '<span class="week-badge">Bergambar</span>' : ''}
    </a>`).join('');
})();
