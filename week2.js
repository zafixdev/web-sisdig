/* ========================================
   MINGGU 2: BILANGAN NEGATIF & KOMPLEMEN
   Sign-Magnitude, 1's Complement, 2's Complement
   ======================================== */

registerWeek(2, (container, activeTab) => {
    container.innerHTML = `
        <div class="week-header">
            <span class="week-badge">📘 Minggu 02</span>
            <h2>Representasi Bilangan Negatif & Komplemen</h2>
            <p>Memahami tiga skema utama representasi bilangan bertanda: <strong>Sign-Magnitude</strong>, <strong>1's Complement</strong>, dan <strong>2's Complement</strong> serta operasi aritmetika & deteksi overflow.</p>
        </div>

        <!-- In-content tabs -->
        <div class="content-tabs">
            <button class="content-tab ${activeTab === 'rep-intro' ? 'active' : ''}" data-tab="rep-intro">⚖️ Perbandingan Skema</button>
            <button class="content-tab ${activeTab === 'sign-mag' ? 'active' : ''}" data-tab="sign-mag">➕ Sign-Magnitude</button>
            <button class="content-tab ${activeTab === 'ones-comp' ? 'active' : ''}" data-tab="ones-comp">🔄 1's Complement</button>
            <button class="content-tab ${activeTab === 'twos-comp' ? 'active' : ''}" data-tab="twos-comp">⭐ 2's Complement</button>
            <button class="content-tab ${activeTab === 'sub-via-add' ? 'active' : ''}" data-tab="sub-via-add">➕ Pengurangan via Penjumlahan</button>
            <button class="content-tab ${activeTab === 'overflow' ? 'active' : ''}" data-tab="overflow">⚠️ Overflow</button>
            <button class="content-tab ${activeTab === 'quiz2' ? 'active' : ''}" data-tab="quiz2">📝 Latihan Soal</button>
        </div>

        <!-- TAB 1: PERBANDINGAN SKEMA -->
        <div class="tab-panel ${activeTab === 'rep-intro' ? 'active' : ''}" id="tab-rep-intro">
            <div class="interactive-card">
                <h4>📊 Perbandingan Tiga Skema Representasi Negatif (8-Bit)</h4>
                <p>Ketik bilangan desimal bertanda (−128 s.d. +127) untuk melihat representasinya di ketiga skema:</p>

                <div class="quiz-input-row">
                    <input type="number" class="quiz-input" id="compDecInput" value="-13" min="-128" max="127">
                    <button class="btn btn-primary" id="compDecBtn">Konversi ➔</button>
                </div>

                <div id="compResult" class="mt-16"></div>

                <!-- Comparison Table -->
                <div class="mt-24">
                    <h5 style="font-size:14px; margin-bottom:8px; color:var(--text-secondary);">Tabel Karakteristik Skema (8-bit):</h5>
                    <table class="truth-table">
                        <thead>
                            <tr><th>Skema</th><th>Rentang (8-bit)</th><th>Metode Negatif (−X)</th><th>Kelemahan/Kelebihan</th></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Sign-Magnitude</strong></td>
                                <td>−127 … +127</td>
                                <td>Set MSB = 1</td>
                                <td>Ada +0 dan −0, sirkuit aritmetika rumit</td>
                            </tr>
                            <tr>
                                <td><strong>1’s Complement</strong></td>
                                <td>−127 … +127</td>
                                <td>NOT (inversi) semua bit</td>
                                <td>Ada +0 dan −0, perlu <em>end-around carry</em></td>
                            </tr>
                            <tr>
                                <td style="color:var(--accent-light);"><strong>2’s Complement</strong></td>
                                <td>−128 … +127</td>
                                <td>NOT semua bit + 1</td>
                                <td><strong>Standar CPU/MCU</strong>: hanya 1 nol, aritmetika paling sederhana</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- TAB 2: SIGN-MAGNITUDE -->
        <div class="tab-panel ${activeTab === 'sign-mag' ? 'active' : ''}" id="tab-sign-mag">
            <div class="interactive-card">
                <h4>Sign-Magnitude (SM)</h4>
                <p>Bit paling kiri (<strong>MSB</strong>) berfungsi sebagai bit tanda: <code>0 = Positif (+)</code>, <code>1 = Negatif (−)</code>. Sisa 7 bit lainnya adalah nilai mutlak (magnitudo).</p>

                <div class="info-box tip">
                    <strong>Struktur 8-Bit Sign-Magnitude:</strong>
                    <div style="display:flex; gap:4px; margin-top:8px; justify-content:center;">
                        <div class="bit-cell b1" style="width:auto; padding:0 12px;">MSB (Tanda: 0=+ / 1=-)</div>
                        <div class="bit-cell b0" style="width:auto; padding:0 24px; flex:1;">7-bit Magnitudo (Nilai absolut)</div>
                    </div>
                </div>

                <div class="mt-16">
                    <h5>Contoh Nilai ±13:</h5>
                    <div class="grid-2 mt-8">
                        <div class="interactive-card" style="margin:0; background:var(--bg-tertiary);">
                            <strong>+13 (Positif):</strong>
                            <p style="font-family:'JetBrains Mono',monospace; font-size:16px; margin-top:6px;">
                                <span style="color:var(--green); font-weight:700;">0</span>000 1101
                            </p>
                            <span style="font-size:11px; color:var(--text-muted);">MSB=0 (+), Magnitudo=13 (0001101)</span>
                        </div>
                        <div class="interactive-card" style="margin:0; background:var(--bg-tertiary);">
                            <strong>−13 (Negatif):</strong>
                            <p style="font-family:'JetBrains Mono',monospace; font-size:16px; margin-top:6px;">
                                <span style="color:var(--red); font-weight:700;">1</span>000 1101
                            </p>
                            <span style="font-size:11px; color:var(--text-muted);">MSB=1 (−), Magnitudo=13 (0001101)</span>
                        </div>
                    </div>
                </div>

                <div class="info-box warning mt-16">
                    <strong>Masalah Double Zero:</strong>
                    +0 = <code>0000 0000</code> dan −0 = <code>1000 0000</code>. Adanya dua representasi nol memperumit logika perbandingan di perangkat keras.
                </div>
            </div>
        </div>

        <!-- TAB 3: 1'S COMPLEMENT -->
        <div class="tab-panel ${activeTab === 'ones-comp' ? 'active' : ''}" id="tab-ones-comp">
            <div class="interactive-card">
                <h4>1's Complement (C1)</h4>
                <p>Untuk mendapatkan representasi negatif dalam 1's Complement, cukup <strong>inversi (NOT) setiap bit</strong> dari representasi positifnya: bit 0 jadi 1, dan bit 1 jadi 0.</p>

                <div class="quiz-input-row">
                    <input type="text" class="quiz-input" id="c1Input" value="00001101" placeholder="Masukkan 8-bit biner...">
                    <button class="btn btn-primary" id="c1Btn">Inversi Bit ➔</button>
                </div>

                <div id="c1Result" class="mt-16"></div>

                <div class="info-box tip mt-16">
                    <strong>End-Around Carry pada Penjumlahan C1:</strong>
                    Jika terjadi carry keluar dari MSB pada penjumlahan 1's Complement, carry tersebut harus <strong>ditambahkan kembali ke LSB</strong> (bit paling kanan).
                </div>
            </div>
        </div>

        <!-- TAB 4: 2'S COMPLEMENT -->
        <div class="tab-panel ${activeTab === 'twos-comp' ? 'active' : ''}" id="tab-twos-comp">
            <div class="interactive-card">
                <h4>⭐ 2's Complement (C2) — Standar Industri</h4>
                <p>2's Complement adalah skema paling banyak digunakan pada CPU/MCU modern. Rumus: <code>C2 = NOT(semua bit) + 1</code></p>

                <div class="quiz-input-row">
                    <input type="number" class="quiz-input" id="c2DecInput" value="-13" min="-128" max="127" placeholder="Desimal (−128 s.d. 127)...">
                    <button class="btn btn-primary" id="c2DecBtn">Hitung C2 ➔</button>
                </div>

                <div id="c2StepsResult" class="mt-16"></div>

                <div class="info-box success mt-16">
                    <strong>Mengapa 2's Complement Unggul?</strong>
                    1. Hanya ada <strong>satu representasi nol</strong> (00000000 = +0).<br>
                    2. Operasi pengurangan dapat dilakukan langsung menggunakan rangkaian penjumlahan (Adder), sehingga tidak memerlukan rangkaian pengurang (Subtractor) terpisah.
                </div>
            </div>
        </div>

        <!-- TAB 5: PENGURANGAN VIA PENJUMLAHAN -->
        <div class="tab-panel ${activeTab === 'sub-via-add' ? 'active' : ''}" id="tab-sub-via-add">
            <div class="interactive-card">
                <h4>Aritmetika: Pengurangan via Penjumlahan 2's Complement</h4>
                <p>Rumus dasar: <code>A − B = A + (C2 dari B)</code></p>

                <div class="grid-2">
                    <div class="converter-input-group">
                        <label>Nilai A (Desimal):</label>
                        <input type="number" class="converter-input" id="subA" value="18" min="-64" max="63">
                    </div>
                    <div class="converter-input-group">
                        <label>Nilai B (Desimal):</label>
                        <input type="number" class="converter-input" id="subB" value="25" min="-64" max="63">
                    </div>
                </div>

                <button class="btn btn-primary mt-16" id="calcSubBtn">Hitung A − B via Adder ➔</button>

                <div id="subResult" class="mt-16"></div>
            </div>
        </div>

        <!-- TAB 6: OVERFLOW -->
        <div class="tab-panel ${activeTab === 'overflow' ? 'active' : ''}" id="tab-overflow">
            <div class="interactive-card">
                <h4>⚠️ Deteksi Overflow pada Aritmetika Bertanda</h4>
                <p>Overflow terjadi ketika hasil operasi aritmetika melebihi kapasitas bit yang tersedia (untuk 8-bit: rentang −128 s.d. +127).</p>

                <div class="info-box warning">
                    <strong>Aturan Deteksi Overflow:</strong>
                    • Positif + Positif = Negatif ➔ <strong>OVERFLOW!</strong><br>
                    • Negatif + Negatif = Positif ➔ <strong>OVERFLOW!</strong><br>
                    • Positif + Negatif ➔ <em>Tidak pernah overflow</em><br>
                    • Formula Hardware: <code>Overflow = Carry_In(MSB) XOR Carry_Out(MSB)</code>
                </div>

                <div class="grid-2 mt-16">
                    <div class="converter-input-group">
                        <label>Nilai X (−128 s.d. 127):</label>
                        <input type="number" class="converter-input" id="ofX" value="100">
                    </div>
                    <div class="converter-input-group">
                        <label>Nilai Y (−128 s.d. 127):</label>
                        <input type="number" class="converter-input" id="ofY" value="60">
                    </div>
                </div>

                <button class="btn btn-primary mt-16" id="checkOfBtn">Uji Penjumlahan & Cek Overflow ➔</button>

                <div id="ofResult" class="mt-16"></div>
            </div>
        </div>

        <!-- TAB 7: LATIHAN SOAL -->
        <div class="tab-panel ${activeTab === 'quiz2' ? 'active' : ''}" id="tab-quiz2">
            <div class="interactive-card">
                <div class="score-bar">
                    <span class="score-label">Skor Latihan:</span>
                    <span class="score-value" id="quiz2Score">0 / 5</span>
                    <div class="progress-track">
                        <div class="progress-fill" id="quiz2Progress" style="width: 0%;"></div>
                    </div>
                </div>

                <div id="quiz2Questions"></div>

                <button class="btn btn-secondary mt-16" id="resetQuiz2Btn">🔄 Acak Soal Baru</button>
            </div>
        </div>
    `;

    // ===== TAB SWITCHING =====
    container.querySelectorAll('.content-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            container.querySelectorAll('.content-tab').forEach(t => t.classList.remove('active'));
            container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const panel = container.querySelector(`#tab-${target}`);
            if (panel) panel.classList.add('active');
        });
    });

    // Init tab handlers
    initCompTab(container);
    initC1Tab(container);
    initC2Tab(container);
    initSubTab(container);
    initOverflowTab(container);
    initQuiz2(container);
});

// Helper functions for Week 2
function to8BitTwosComplement(dec) {
    if (dec >= 0) {
        return (dec & 0xFF).toString(2).padStart(8, '0');
    } else {
        return ((1 << 8) + dec).toString(2).padStart(8, '0');
    }
}

function to8BitSignMag(dec) {
    const sign = dec < 0 ? '1' : '0';
    const mag = Math.abs(dec).toString(2).padStart(7, '0');
    return sign + mag;
}

function to8BitOnesComplement(dec) {
    if (dec >= 0) {
        return dec.toString(2).padStart(8, '0');
    } else {
        const pos = Math.abs(dec).toString(2).padStart(8, '0');
        return pos.split('').map(b => b === '0' ? '1' : '0').join('');
    }
}

// ===== TAB 1: PERBANDINGAN =====
function initCompTab(container) {
    const input = container.querySelector('#compDecInput');
    const btn = container.querySelector('#compDecBtn');
    const resultEl = container.querySelector('#compResult');

    function render() {
        const val = parseInt(input.value) || 0;
        if (val < -128 || val > 127) {
            resultEl.innerHTML = '<p style="color:var(--red);">Rentang bilangan harus antara −128 dan +127 untuk 8-bit.</p>';
            return;
        }

        const sm = (val >= -127 && val <= 127) ? to8BitSignMag(val) : 'Di luar rentang (−127..+127)';
        const c1 = (val >= -127 && val <= 127) ? to8BitOnesComplement(val) : 'Di luar rentang (−127..+127)';
        const c2 = to8BitTwosComplement(val);

        resultEl.innerHTML = `
            <div class="grid-2">
                <div class="interactive-card" style="background:var(--bg-tertiary); margin:0;">
                    <span style="font-size:12px; color:var(--text-muted); font-weight:600;">SIGN-MAGNITUDE:</span>
                    <p style="font-family:'JetBrains Mono',monospace; font-size:18px; font-weight:700; margin-top:6px;">
                        ${sm.length === 8 ? `<span style="color:var(--red);">${sm[0]}</span> ${sm.substr(1,3)} ${sm.substr(4,4)}` : sm}
                    </p>
                </div>
                <div class="interactive-card" style="background:var(--bg-tertiary); margin:0;">
                    <span style="font-size:12px; color:var(--text-muted); font-weight:600;">1'S COMPLEMENT:</span>
                    <p style="font-family:'JetBrains Mono',monospace; font-size:18px; font-weight:700; margin-top:6px;">
                        ${c1.length === 8 ? `${c1.substr(0,4)} ${c1.substr(4,4)}` : c1}
                    </p>
                </div>
            </div>
            <div class="interactive-card mt-16" style="background:var(--accent-glow); border-color:var(--accent); margin-bottom:0;">
                <span style="font-size:12px; color:var(--accent-light); font-weight:600;">⭐ 2'S COMPLEMENT (STANDAR CPU):</span>
                <p style="font-family:'JetBrains Mono',monospace; font-size:22px; font-weight:700; color:var(--text-primary); margin-top:6px;">
                    ${c2.substr(0,4)} ${c2.substr(4,4)}₂
                </p>
                <span style="font-size:12px; color:var(--text-secondary);">Heksadesimal: 0x${parseInt(c2, 2).toString(16).toUpperCase().padStart(2,'0')}</span>
            </div>
        `;
    }

    btn.addEventListener('click', render);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') render(); });
    render();
}

// ===== TAB 3: 1'S COMPLEMENT =====
function initC1Tab(container) {
    const input = container.querySelector('#c1Input');
    const btn = container.querySelector('#c1Btn');
    const resultEl = container.querySelector('#c1Result');

    function render() {
        let bin = input.value.replace(/[^01]/g, '').padStart(8, '0').substr(-8);
        input.value = bin;

        const inv = bin.split('').map(b => b === '0' ? '1' : '0').join('');

        resultEl.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:12px; align-items:center; padding:16px; background:var(--bg-tertiary); border-radius:var(--radius);">
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:13px; color:var(--text-muted); width:80px;">Biner Asli:</span>
                    <div style="display:flex; gap:3px;">
                        ${bin.split('').map(b => `<div class="bit-cell ${b==='1'?'b1':'b0'}">${b}</div>`).join('')}
                    </div>
                </div>
                <div style="font-size:16px; color:var(--accent-light);">⬇ NOT (Inversi Setiap Bit) ⬇</div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:13px; color:var(--accent-light); width:80px; font-weight:600;">1's Comp:</span>
                    <div style="display:flex; gap:3px;">
                        ${inv.split('').map(b => `<div class="bit-cell ${b==='1'?'b1':'b0'}" style="border-color:var(--accent);">${b}</div>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    btn.addEventListener('click', render);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') render(); });
    render();
}

// ===== TAB 4: 2'S COMPLEMENT =====
function initC2Tab(container) {
    const input = container.querySelector('#c2DecInput');
    const btn = container.querySelector('#c2DecBtn');
    const resultEl = container.querySelector('#c2StepsResult');

    function render() {
        const val = parseInt(input.value) || 0;
        if (val < -128 || val > 127) {
            resultEl.innerHTML = '<p style="color:var(--red);">Rentang bilangan harus antara −128 dan +127.</p>';
            return;
        }

        if (val >= 0) {
            const bin = val.toString(2).padStart(8, '0');
            resultEl.innerHTML = `
                <div class="info-box success">
                    <strong>Bilangan Positif (${val}):</strong>
                    Untuk bilangan positif, 2's complement sama persis dengan biner biasa (MSB = 0).<br>
                    <span style="font-family:'JetBrains Mono',monospace; font-size:18px; font-weight:700;">+${val}₁₀ = ${bin.substr(0,4)} ${bin.substr(4,4)}₂</span>
                </div>
            `;
            return;
        }

        const absVal = Math.abs(val);
        const posBin = absVal.toString(2).padStart(8, '0');
        const invBin = posBin.split('').map(b => b === '0' ? '1' : '0').join('');
        const c2Bin = to8BitTwosComplement(val);

        resultEl.innerHTML = `
            <div class="steps-container">
                <div class="step-item">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h5>Tulis bentuk biner dari nilai absolut (+${absVal}):</h5>
                        <p><code>+${absVal}₁₀ = ${posBin.substr(0,4)} ${posBin.substr(4,4)}₂</code></p>
                    </div>
                </div>
                <div class="step-item">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h5>Inversi semua bit (1's Complement):</h5>
                        <p><code>NOT(${posBin}) = ${invBin.substr(0,4)} ${invBin.substr(4,4)}</code></p>
                    </div>
                </div>
                <div class="step-item">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h5>Tambahkan 1 (+1):</h5>
                        <p><code>${invBin} + 1 = ${c2Bin.substr(0,4)} ${c2Bin.substr(4,4)}₂</code></p>
                    </div>
                </div>
            </div>

            <div class="info-box success mt-16">
                <strong>Hasil Akhir 2's Complement:</strong>
                <span style="font-family:'JetBrains Mono',monospace; font-size:18px; font-weight:700;">${val}₁₀ = ${c2Bin.substr(0,4)} ${c2Bin.substr(4,4)}₂ (Hex: 0x${parseInt(c2Bin,2).toString(16).toUpperCase()})</span>
            </div>
        `;
    }

    btn.addEventListener('click', render);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') render(); });
    render();
}

// ===== TAB 5: SUB VIA ADD =====
function initSubTab(container) {
    const inA = container.querySelector('#subA');
    const inB = container.querySelector('#subB');
    const btn = container.querySelector('#calcSubBtn');
    const resultEl = container.querySelector('#subResult');

    function render() {
        const a = parseInt(inA.value) || 0;
        const b = parseInt(inB.value) || 0;
        const expectedDiff = a - b;

        const binA = to8BitTwosComplement(a);
        const negB = -b;
        const binNegB = to8BitTwosComplement(negB);

        // Raw 9-bit sum
        const rawSum = parseInt(binA, 2) + parseInt(binNegB, 2);
        const binSum9 = rawSum.toString(2).padStart(9, '0');
        const binResult8 = binSum9.substr(-8);
        const carryOut = binSum9[0];

        // Interpret 8-bit result as signed
        let resultSigned = parseInt(binResult8, 2);
        if (resultSigned >= 128) resultSigned -= 256;

        resultEl.innerHTML = `
            <div class="steps-container">
                <div class="step-item">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h5>Ubah operasi: ${a} − (${b}) ➔ ${a} + (${negB})</h5>
                        <p>A = <code>${a}₁₀</code> ➔ <code>${binA}₂</code></p>
                        <p>−B = C2(${b}) = <code>${negB}₁₀</code> ➔ <code>${binNegB}₂</code></p>
                    </div>
                </div>
                <div class="step-item">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h5>Jumlahkan bit-per-bit:</h5>
                        <pre style="font-family:'JetBrains Mono',monospace; background:var(--bg-tertiary); padding:12px; border-radius:6px; margin-top:6px;">
   ${binA}  (${a})
+  ${binNegB}  (${negB})
-----------------
 ${carryOut === '1' ? '1 ' : '  '}${binResult8}  (Carry out: ${carryOut})</pre>
                        <p style="font-size:12px; color:var(--text-muted); margin-top:4px;">*Carry out bit ke-9 diabaikan dalam aritmetika 2's complement.</p>
                    </div>
                </div>
            </div>

            <div class="info-box success mt-16">
                <strong>Hasil Akhir:</strong>
                <span style="font-family:'JetBrains Mono',monospace; font-size:18px; font-weight:700;">${binResult8}₂ = ${resultSigned}₁₀</span>
                ${resultSigned === expectedDiff ? ' (✓ Benar Sesuai Desimal)' : ' (⚠️ Terjadi Overflow)'}
            </div>
        `;
    }

    btn.addEventListener('click', render);
    render();
}

// ===== TAB 6: OVERFLOW =====
function initOverflowTab(container) {
    const inX = container.querySelector('#ofX');
    const inY = container.querySelector('#ofY');
    const btn = container.querySelector('#checkOfBtn');
    const resultEl = container.querySelector('#ofResult');

    function render() {
        const x = parseInt(inX.value) || 0;
        const y = parseInt(inY.value) || 0;
        const sumTrue = x + y;

        const binX = to8BitTwosComplement(x);
        const binY = to8BitTwosComplement(y);

        const rawSum = parseInt(binX, 2) + parseInt(binY, 2);
        const binSum8 = rawSum.toString(2).padStart(9, '0').substr(-8);

        let signedResult = parseInt(binSum8, 2);
        if (signedResult >= 128) signedResult -= 256;

        const isOverflow = (x > 0 && y > 0 && signedResult < 0) || (x < 0 && y < 0 && signedResult >= 0);

        resultEl.innerHTML = `
            <div style="padding:16px; background:var(--bg-tertiary); border-radius:var(--radius); margin-top:12px;">
                <p><strong>X:</strong> ${x} (<code>${binX}</code>, MSB=${binX[0]})</p>
                <p><strong>Y:</strong> ${y} (<code>${binY}</code>, MSB=${binY[0]})</p>
                <p><strong>Hasil Penjumlahan 8-bit:</strong> <code>${binSum8}</code> (MSB=${binSum8[0]} ➔ Desimal bertanda: <strong>${signedResult}</strong>)</p>
                <p><strong>Nilai Seharusnya:</strong> ${x} + ${y} = <strong>${sumTrue}</strong></p>
            </div>

            <div class="info-box ${isOverflow ? 'warning' : 'success'} mt-16">
                <strong>Status Overflow:</strong>
                ${isOverflow
                    ? `⚠️ <strong>TERJADI OVERFLOW!</strong> Nilai seharusnya (${sumTrue}) di luar rentang 8-bit bertanda [−128 … +127]. MSB berubah menjadi tanda yang salah.`
                    : `✓ <strong>TIDAK ADA OVERFLOW.</strong> Hasil ${signedResult} valid dan berada dalam rentang [−128 … +127].`}
            </div>
        `;
    }

    btn.addEventListener('click', render);
    render();
}

// ===== TAB 7: QUIZ 2 =====
function initQuiz2(container) {
    const questions = [
        {
            q: 'Berapakah representasi 8-bit 2\'s complement dari desimal −1?',
            ans: '11111111',
            hint: '+1 = 00000001 → NOT = 11111110 → +1 = 11111111',
        },
        {
            q: 'Berapakah rentang bilangan desimal bertanda pada sistem 8-bit 2\'s complement?',
            ans: '-128 sampai 127',
            hint: 'Rentangnya dari −2^(n-1) sampai 2^(n-1) − 1',
        },
        {
            q: 'Apakah terjadi overflow jika +100 dijumlahkan dengan +60 pada register 8-bit?',
            ans: 'YA',
            hint: '100 + 60 = 160, melebihi batas maksimum +127',
        },
        {
            q: 'Berapakah hasil 2\'s complement dari +18 (00010010) menjadi −18?',
            ans: '11101110',
            hint: 'NOT(00010010) = 11101101 → + 1 = 11101110',
        },
        {
            q: 'Skema manakah yang memiliki DUA representasi nilai nol (+0 dan −0)?',
            ans: 'SIGN-MAGNITUDE',
            hint: 'Sign-Magnitude dan 1\'s Complement memiliki +0 dan −0',
        }
    ];

    const quizEl = container.querySelector('#quiz2Questions');
    const scoreEl = container.querySelector('#quiz2Score');
    const progEl = container.querySelector('#quiz2Progress');
    const resetBtn = container.querySelector('#resetQuiz2Btn');

    let userScores = new Array(questions.length).fill(false);

    function renderQuiz() {
        userScores = new Array(questions.length).fill(false);
        updateScore();

        quizEl.innerHTML = questions.map((q, idx) => `
            <div class="quiz-container interactive-card" style="margin-bottom:16px;">
                <div class="quiz-question">${idx + 1}. ${q.q}</div>
                <div class="quiz-input-row">
                    <input type="text" class="quiz-input" id="q2Input${idx}" placeholder="Jawaban Anda...">
                    <button class="btn btn-primary btn-sm" data-idx="${idx}">Periksa</button>
                </div>
                <div class="quiz-feedback" id="q2Feedback${idx}"></div>
            </div>
        `).join('');

        quizEl.querySelectorAll('button[data-idx]').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.idx);
                const input = quizEl.querySelector(`#q2Input${idx}`);
                const feedback = quizEl.querySelector(`#q2Feedback${idx}`);
                const userAns = input.value.trim().toUpperCase().replace(/\s+/g, '');
                const correctAns = questions[idx].ans.toUpperCase().replace(/\s+/g, '');

                if (userAns === correctAns || userAns.includes(correctAns)) {
                    feedback.className = 'quiz-feedback correct';
                    feedback.textContent = `✓ Benar! ${questions[idx].hint}`;
                    userScores[idx] = true;
                } else {
                    feedback.className = 'quiz-feedback wrong';
                    feedback.textContent = `✗ Kurang tepat. Petunjuk: ${questions[idx].hint}`;
                    userScores[idx] = false;
                }
                updateScore();
            });
        });
    }

    function updateScore() {
        const score = userScores.filter(Boolean).length;
        scoreEl.textContent = `${score} / ${questions.length}`;
        progEl.style.width = `${(score / questions.length) * 100}%`;
    }

    resetBtn.addEventListener('click', renderQuiz);
    renderQuiz();
}
