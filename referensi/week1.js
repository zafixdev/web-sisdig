/* ========================================
   MINGGU 1: KONVERSI BILANGAN
   Metode Biner sebagai Central
   ======================================== */

registerWeek(1, (container, activeTab) => {
    container.innerHTML = `
        <div class="week-header">
            <span class="week-badge">📘 Minggu 01</span>
            <h2>Sistem Bilangan & Konversi Biner</h2>
            <p>Konversi bilangan dengan <strong>metode biner sebagai central</strong>. Semua konversi melalui biner terlebih dahulu!</p>
        </div>

        <!-- In-content tabs -->
        <div class="content-tabs">
            <button class="content-tab ${activeTab === 'converter' ? 'active' : ''}" data-tab="converter">⚡ Konverter Interaktif</button>
            <button class="content-tab ${activeTab === 'dec2bin' ? 'active' : ''}" data-tab="dec2bin">🔢 Desimal → Biner</button>
            <button class="content-tab ${activeTab === 'bin2hex' ? 'active' : ''}" data-tab="bin2hex">🔠 Biner → Heksadesimal</button>
            <button class="content-tab ${activeTab === 'bin2oct' ? 'active' : ''}" data-tab="bin2oct">🎱 Biner → Oktal</button>
            <button class="content-tab ${activeTab === 'bin2dec' ? 'active' : ''}" data-tab="bin2dec">➕ Biner → Desimal</button>
            <button class="content-tab ${activeTab === 'quiz1' ? 'active' : ''}" data-tab="quiz1">📝 Latihan Soal</button>
        </div>

        <!-- TAB 1: CONVERTER INTERAKTIF -->
        <div class="tab-panel ${activeTab === 'converter' ? 'active' : ''}" id="tab-converter">
            <div class="interactive-card">
                <h4>🔄 Konverter Bilangan Universal (Biner Central)</h4>
                <p>Ketik pada <strong>salah satu input</strong> di bawah. Semua konversi akan diproses <strong>melalui biner terlebih dahulu</strong> sebagai sentralnya.</p>

                <!-- Central Flow Visual -->
                <div class="conversion-flow" id="flowDiagram">
                    <div class="flow-node" id="nodeDec">
                        <span class="node-label">Desimal (10)</span>
                        <span class="node-value" id="valDec">42</span>
                    </div>
                    <span class="flow-arrow">⇄</span>
                    <div class="flow-node central" id="nodeBin">
                        <span class="node-label">⭐ BINER (2) ⭐</span>
                        <span class="node-value" id="valBin">0010 1010</span>
                    </div>
                    <span class="flow-arrow">⇄</span>
                    <div class="flow-node" id="nodeHex">
                        <span class="node-label">Heksa (16)</span>
                        <span class="node-value" id="valHex">2A</span>
                    </div>
                    <span class="flow-arrow">⇄</span>
                    <div class="flow-node" id="nodeOct">
                        <span class="node-label">Oktal (8)</span>
                        <span class="node-value" id="valOct">52</span>
                    </div>
                </div>

                <!-- Input Fields -->
                <div class="converter-hub">
                    <div class="converter-input-group">
                        <label><span class="base-tag dec">DEC</span> Desimal (Basis 10):</label>
                        <input type="text" class="converter-input" id="inputDec" value="42" placeholder="contoh: 42">
                    </div>
                    <div class="converter-input-group">
                        <label><span class="base-tag bin">BIN</span> Biner (Basis 2) — <em>Sentral</em>:</label>
                        <input type="text" class="converter-input" id="inputBin" value="101010" placeholder="contoh: 101010">
                    </div>
                    <div class="grid-2">
                        <div class="converter-input-group">
                            <label><span class="base-tag hex">HEX</span> Heksadesimal (Basis 16):</label>
                            <input type="text" class="converter-input" id="inputHex" value="2A" placeholder="contoh: 2A">
                        </div>
                        <div class="converter-input-group">
                            <label><span class="base-tag oct">OCT</span> Oktal (Basis 8):</label>
                            <input type="text" class="converter-input" id="inputOct" value="52" placeholder="contoh: 52">
                        </div>
                    </div>
                </div>

                <!-- Live Grouping Visual -->
                <div class="mt-24">
                    <h5 style="font-size:14px; margin-bottom:8px; color:var(--text-secondary);">Visualisasi Pengelompokan Biner:</h5>
                    <div id="groupingVisual"></div>
                </div>
            </div>
        </div>

        <!-- TAB 2: DESIMAL -> BINER -->
        <div class="tab-panel ${activeTab === 'dec2bin' ? 'active' : ''}" id="tab-dec2bin">
            <div class="interactive-card">
                <h4>Metode Pembagian Berulang dengan 2</h4>
                <p>Bagi bilangan desimal dengan 2 berulang kali, lalu catat sisa pembagiannya dari <strong>bawah ke atas</strong> (LSB ke MSB).</p>

                <div class="quiz-input-row">
                    <input type="number" class="quiz-input" id="simDecInput" value="25" min="0" max="65535" placeholder="Masukkan bilangan desimal...">
                    <button class="btn btn-primary" id="simDecBtn">Hitung Langkah ➔</button>
                </div>

                <div class="steps-container" id="dec2binSteps"></div>
            </div>
        </div>

        <!-- TAB 3: BINER -> HEKSA -->
        <div class="tab-panel ${activeTab === 'bin2hex' ? 'active' : ''}" id="tab-bin2hex">
            <div class="interactive-card">
                <h4>Metode Pengelompokan 4-Bit (Nibble)</h4>
                <p>Kelompokkan bit biner per <strong>4 bit dari kanan (LSB)</strong>. Setiap kelompok 4-bit dikonversi langsung ke 1 digit heksadesimal (0–9, A–F).</p>

                <div class="quiz-input-row">
                    <input type="text" class="quiz-input" id="simBinHexInput" value="11010110" placeholder="Masukkan biner (misal: 11010110)...">
                    <button class="btn btn-primary" id="simBinHexBtn">Kelompokkan ➔</button>
                </div>

                <div id="bin2hexResult"></div>

                <!-- Reference table -->
                <div class="mt-24">
                    <h5 style="font-size:14px; margin-bottom:8px; color:var(--text-secondary);">Tabel Referensi 4-Bit ⇄ Heksadesimal:</h5>
                    <div style="overflow-x:auto;">
                        <table class="truth-table">
                            <thead>
                                <tr><th>Biner</th><th>Heksa</th><th>Des</th><th>Biner</th><th>Heksa</th><th>Des</th></tr>
                            </thead>
                            <tbody>
                                <tr><td><code>0000</code></td><td><strong>0</strong></td><td>0</td><td><code>1000</code></td><td><strong>8</strong></td><td>8</td></tr>
                                <tr><td><code>0001</code></td><td><strong>1</strong></td><td>1</td><td><code>1001</code></td><td><strong>9</strong></td><td>9</td></tr>
                                <tr><td><code>0010</code></td><td><strong>2</strong></td><td>2</td><td><code>1010</code></td><td><strong>A</strong></td><td>10</td></tr>
                                <tr><td><code>0011</code></td><td><strong>3</strong></td><td>3</td><td><code>1011</code></td><td><strong>B</strong></td><td>11</td></tr>
                                <tr><td><code>0100</code></td><td><strong>4</strong></td><td>4</td><td><code>1100</code></td><td><strong>C</strong></td><td>12</td></tr>
                                <tr><td><code>0101</code></td><td><strong>5</strong></td><td>5</td><td><code>1101</code></td><td><strong>D</strong></td><td>13</td></tr>
                                <tr><td><code>0110</code></td><td><strong>6</strong></td><td>6</td><td><code>1110</code></td><td><strong>E</strong></td><td>14</td></tr>
                                <tr><td><code>0111</code></td><td><strong>7</strong></td><td>7</td><td><code>1111</code></td><td><strong>F</strong></td><td>15</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- TAB 4: BINER -> OKTAL -->
        <div class="tab-panel ${activeTab === 'bin2oct' ? 'active' : ''}" id="tab-bin2oct">
            <div class="interactive-card">
                <h4>Metode Pengelompokan 3-Bit</h4>
                <p>Kelompokkan bit biner per <strong>3 bit dari kanan (LSB)</strong>. Setiap kelompok 3-bit dikonversi langsung ke 1 digit oktal (0–7).</p>

                <div class="quiz-input-row">
                    <input type="text" class="quiz-input" id="simBinOctInput" value="11010110" placeholder="Masukkan biner...">
                    <button class="btn btn-primary" id="simBinOctBtn">Kelompokkan ➔</button>
                </div>

                <div id="bin2octResult"></div>

                <!-- Reference table -->
                <div class="mt-24">
                    <h5 style="font-size:14px; margin-bottom:8px; color:var(--text-secondary);">Tabel Referensi 3-Bit ⇄ Oktal:</h5>
                    <table class="truth-table">
                        <thead>
                            <tr><th>Biner (3-bit)</th><th>Oktal</th><th>Desimal</th><th>Bobot (4+2+1)</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><code>000</code></td><td><strong>0</strong></td><td>0</td><td>0 + 0 + 0</td></tr>
                            <tr><td><code>001</code></td><td><strong>1</strong></td><td>1</td><td>0 + 0 + 1</td></tr>
                            <tr><td><code>010</code></td><td><strong>2</strong></td><td>2</td><td>0 + 2 + 0</td></tr>
                            <tr><td><code>011</code></td><td><strong>3</strong></td><td>3</td><td>0 + 2 + 1</td></tr>
                            <tr><td><code>100</code></td><td><strong>4</strong></td><td>4</td><td>4 + 0 + 0</td></tr>
                            <tr><td><code>101</code></td><td><strong>5</strong></td><td>5</td><td>4 + 0 + 1</td></tr>
                            <tr><td><code>110</code></td><td><strong>6</strong></td><td>6</td><td>4 + 2 + 0</td></tr>
                            <tr><td><code>111</code></td><td><strong>7</strong></td><td>7</td><td>4 + 2 + 1</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- TAB 5: BINER -> DESIMAL -->
        <div class="tab-panel ${activeTab === 'bin2dec' ? 'active' : ''}" id="tab-bin2dec">
            <div class="interactive-card">
                <h4>Metode Penjumlahan Bobot Posisi (Powers of 2)</h4>
                <p>Setiap posisi bit biner memiliki bobot 2<sup>n</sup> (mulai dari 2<sup>0</sup>=1 di paling kanan). Kalikan setiap bit dengan bobotnya lalu <strong>jumlahkan semua</strong>.</p>

                <div class="quiz-input-row">
                    <input type="text" class="quiz-input" id="simBinDecInput" value="10110" placeholder="Masukkan biner...">
                    <button class="btn btn-primary" id="simBinDecBtn">Hitung Bobot ➔</button>
                </div>

                <div id="bin2decResult"></div>
            </div>
        </div>

        <!-- TAB 6: LATIHAN SOAL -->
        <div class="tab-panel ${activeTab === 'quiz1' ? 'active' : ''}" id="tab-quiz1">
            <div class="interactive-card">
                <div class="score-bar">
                    <span class="score-label">Skor Latihan:</span>
                    <span class="score-value" id="quizScore">0 / 5</span>
                    <div class="progress-track">
                        <div class="progress-fill" id="quizProgress" style="width: 0%;"></div>
                    </div>
                </div>

                <div id="quizQuestions"></div>

                <button class="btn btn-secondary mt-16" id="resetQuizBtn">🔄 Acak Soal Baru</button>
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

    // ===== TAB 1: CONVERTER LOGIC =====
    initConverterTab(container);

    // ===== TAB 2: DEC -> BIN =====
    initDec2BinTab(container);

    // ===== TAB 3: BIN -> HEX =====
    initBin2HexTab(container);

    // ===== TAB 4: BIN -> OCT =====
    initBin2OctTab(container);

    // ===== TAB 5: BIN -> DEC =====
    initBin2DecTab(container);

    // ===== TAB 6: QUIZ =====
    initQuiz1(container);
});

// ===== CONVERTER TAB =====
function initConverterTab(container) {
    const inputDec = container.querySelector('#inputDec');
    const inputBin = container.querySelector('#inputBin');
    const inputHex = container.querySelector('#inputHex');
    const inputOct = container.querySelector('#inputOct');

    const valDec = container.querySelector('#valDec');
    const valBin = container.querySelector('#valBin');
    const valHex = container.querySelector('#valHex');
    const valOct = container.querySelector('#valOct');
    const groupingVisual = container.querySelector('#groupingVisual');

    function updateFromBin(binStr) {
        binStr = binStr.replace(/[^01]/g, '') || '0';
        const dec = binToDec(binStr);
        const hex = binToHex(binStr);
        const oct = binToOct(binStr);

        valBin.textContent = formatBin(binStr);
        valDec.textContent = dec;
        valHex.textContent = hex;
        valOct.textContent = oct;

        // Render grouping
        renderGroupingVisual(binStr, groupingVisual);
    }

    function formatBin(bin) {
        // Group by 4
        let padded = bin;
        while (padded.length % 4 !== 0) padded = '0' + padded;
        let formatted = '';
        for (let i = 0; i < padded.length; i += 4) {
            formatted += (i > 0 ? ' ' : '') + padded.substr(i, 4);
        }
        return formatted;
    }

    inputDec.addEventListener('input', () => {
        const val = parseInt(inputDec.value) || 0;
        const bin = decToBin(val);
        inputBin.value = bin;
        inputHex.value = binToHex(bin);
        inputOct.value = binToOct(bin);
        updateFromBin(bin);
    });

    inputBin.addEventListener('input', () => {
        let bin = inputBin.value.replace(/[^01]/g, '');
        if (!bin) bin = '0';
        inputBin.value = bin;
        const dec = binToDec(bin);
        inputDec.value = dec;
        inputHex.value = binToHex(bin);
        inputOct.value = binToOct(bin);
        updateFromBin(bin);
    });

    inputHex.addEventListener('input', () => {
        let hex = inputHex.value.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
        inputHex.value = hex;
        if (!hex) hex = '0';
        const bin = hexToBin(hex);
        inputBin.value = bin;
        inputDec.value = binToDec(bin);
        inputOct.value = binToOct(bin);
        updateFromBin(bin);
    });

    inputOct.addEventListener('input', () => {
        let oct = inputOct.value.replace(/[^0-7]/g, '');
        inputOct.value = oct;
        if (!oct) oct = '0';
        const bin = octToBin(oct);
        inputBin.value = bin;
        inputDec.value = binToDec(bin);
        inputHex.value = binToHex(bin);
        updateFromBin(bin);
    });

    // Initial render
    updateFromBin('101010');
}

function renderGroupingVisual(binStr, targetEl) {
    // 4-bit (Hex) grouping
    let hexPad = binStr;
    while (hexPad.length % 4 !== 0) hexPad = '0' + hexPad;

    let hexHtml = '<div style="margin-bottom:12px;"><span style="font-size:12px;color:var(--text-muted);font-weight:600;">KELOMPOK 4-BIT → HEKSA:</span><div class="bit-grouping">';
    for (let i = 0; i < hexPad.length; i += 4) {
        if (i > 0) hexHtml += '<div class="bit-group-separator">•</div>';
        const group = hexPad.substr(i, 4);
        const hexDigit = parseInt(group, 2).toString(16).toUpperCase();
        hexHtml += `
            <div class="bit-group">
                <div class="bit-group-bits">
                    ${group.split('').map(b => `<div class="bit-cell ${b==='1'?'b1':'b0'}">${b}</div>`).join('')}
                </div>
                <div class="bit-group-value hex-val">${hexDigit}₁₆</div>
            </div>
        `;
    }
    hexHtml += '</div></div>';

    // 3-bit (Oct) grouping
    let octPad = binStr;
    while (octPad.length % 3 !== 0) octPad = '0' + octPad;

    let octHtml = '<div><span style="font-size:12px;color:var(--text-muted);font-weight:600;">KELOMPOK 3-BIT → OKTAL:</span><div class="bit-grouping">';
    for (let i = 0; i < octPad.length; i += 3) {
        if (i > 0) octHtml += '<div class="bit-group-separator">•</div>';
        const group = octPad.substr(i, 3);
        const octDigit = parseInt(group, 2).toString(8);
        octHtml += `
            <div class="bit-group">
                <div class="bit-group-bits">
                    ${group.split('').map(b => `<div class="bit-cell ${b==='1'?'b1':'b0'}">${b}</div>`).join('')}
                </div>
                <div class="bit-group-value oct-val">${octDigit}₈</div>
            </div>
        `;
    }
    octHtml += '</div></div>';

    targetEl.innerHTML = hexHtml + octHtml;
}

// ===== TAB 2: DEC -> BIN =====
function initDec2BinTab(container) {
    const input = container.querySelector('#simDecInput');
    const btn = container.querySelector('#simDecBtn');
    const stepsEl = container.querySelector('#dec2binSteps');

    function renderSteps() {
        const val = parseInt(input.value);
        if (isNaN(val) || val < 0) {
            stepsEl.innerHTML = '<p style="color:var(--red);">Masukkan bilangan bulat non-negatif.</p>';
            return;
        }

        if (val === 0) {
            stepsEl.innerHTML = `
                <div class="step-item">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h5>0 dibagi 2 = 0, sisa 0</h5>
                        <p>Hasil akhir: <code>0₂</code></p>
                    </div>
                </div>
            `;
            return;
        }

        let n = val;
        let steps = [];
        let bits = [];

        while (n > 0) {
            const quotient = Math.floor(n / 2);
            const remainder = n % 2;
            steps.push({ n, quotient, remainder });
            bits.push(remainder);
            n = quotient;
        }

        const binResult = bits.slice().reverse().join('');

        let html = '';
        steps.forEach((s, idx) => {
            const isLast = idx === steps.length - 1;
            html += `
                <div class="step-item">
                    <div class="step-number">${idx + 1}</div>
                    <div class="step-content">
                        <h5>${s.n} ÷ 2 = ${s.quotient} <span style="color:var(--accent-light);">sisa ${s.remainder}</span> ${idx===0 ? '(LSB - bit paling kanan)' : ''} ${isLast ? '(MSB - bit paling kiri)' : ''}</h5>
                        <p>Sisa: <code>${s.remainder}</code></p>
                    </div>
                </div>
            `;
        });

        html += `
            <div class="info-box success mt-16">
                <strong>Hasil Konversi:</strong>
                Baca sisa pembagian dari <strong>bawah ke atas</strong> (langkah ${steps.length} ke 1):<br>
                <span style="font-family:'JetBrains Mono',monospace; font-size:18px; font-weight:700;">${val}₁₀ = ${binResult}₂</span>
            </div>
        `;

        stepsEl.innerHTML = html;
    }

    btn.addEventListener('click', renderSteps);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') renderSteps(); });
    renderSteps();
}

// ===== TAB 3: BIN -> HEX =====
function initBin2HexTab(container) {
    const input = container.querySelector('#simBinHexInput');
    const btn = container.querySelector('#simBinHexBtn');
    const resultEl = container.querySelector('#bin2hexResult');

    function render() {
        let bin = input.value.replace(/[^01]/g, '');
        if (!bin) bin = '0';
        input.value = bin;

        let padded = bin;
        const padCount = (4 - (bin.length % 4)) % 4;
        padded = '0'.repeat(padCount) + bin;

        let groups = [];
        for (let i = 0; i < padded.length; i += 4) {
            const grp = padded.substr(i, 4);
            const hexDigit = parseInt(grp, 2).toString(16).toUpperCase();
            const decVal = parseInt(grp, 2);
            groups.push({ grp, hexDigit, decVal });
        }

        const hexResult = groups.map(g => g.hexDigit).join('');

        let html = `
            <div class="info-box tip mt-16">
                <strong>Langkah-langkah:</strong>
                ${padCount > 0 ? `1. Tambahkan <code>${padCount}</code> angka nol di depan agar genap kelipatan 4 bit → <code>${padded}</code><br>` : '1. Jumlah bit sudah pas kelipatan 4.<br>'}
                2. Kelompokkan per 4-bit dan konversikan masing-masing:
            </div>

            <div class="bit-grouping">
                ${groups.map((g, i) => `
                    ${i > 0 ? '<div class="bit-group-separator">•</div>' : ''}
                    <div class="bit-group">
                        <div class="bit-group-bits">
                            ${g.grp.split('').map(b => `<div class="bit-cell ${b==='1'?'b1':'b0'}">${b}</div>`).join('')}
                        </div>
                        <div class="bit-group-value hex-val">${g.grp} = ${g.decVal} = ${g.hexDigit}₁₆</div>
                    </div>
                `).join('')}
            </div>

            <div class="info-box success">
                <strong>Hasil Akhir:</strong>
                <span style="font-family:'JetBrains Mono',monospace; font-size:18px; font-weight:700;">${bin}₂ = ${hexResult}₁₆</span>
            </div>
        `;

        resultEl.innerHTML = html;
    }

    btn.addEventListener('click', render);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') render(); });
    render();
}

// ===== TAB 4: BIN -> OCT =====
function initBin2OctTab(container) {
    const input = container.querySelector('#simBinOctInput');
    const btn = container.querySelector('#simBinOctBtn');
    const resultEl = container.querySelector('#bin2octResult');

    function render() {
        let bin = input.value.replace(/[^01]/g, '');
        if (!bin) bin = '0';
        input.value = bin;

        let padded = bin;
        const padCount = (3 - (bin.length % 3)) % 3;
        padded = '0'.repeat(padCount) + bin;

        let groups = [];
        for (let i = 0; i < padded.length; i += 3) {
            const grp = padded.substr(i, 3);
            const octDigit = parseInt(grp, 2).toString(8);
            const decVal = parseInt(grp, 2);
            groups.push({ grp, octDigit, decVal });
        }

        const octResult = groups.map(g => g.octDigit).join('');

        let html = `
            <div class="info-box tip mt-16">
                <strong>Langkah-langkah:</strong>
                ${padCount > 0 ? `1. Tambahkan <code>${padCount}</code> angka nol di depan agar genap kelipatan 3 bit → <code>${padded}</code><br>` : '1. Jumlah bit sudah pas kelipatan 3.<br>'}
                2. Kelompokkan per 3-bit dan konversikan masing-masing:
            </div>

            <div class="bit-grouping">
                ${groups.map((g, i) => `
                    ${i > 0 ? '<div class="bit-group-separator">•</div>' : ''}
                    <div class="bit-group">
                        <div class="bit-group-bits">
                            ${g.grp.split('').map(b => `<div class="bit-cell ${b==='1'?'b1':'b0'}">${b}</div>`).join('')}
                        </div>
                        <div class="bit-group-value oct-val">${g.grp} = ${g.octDigit}₈</div>
                    </div>
                `).join('')}
            </div>

            <div class="info-box success">
                <strong>Hasil Akhir:</strong>
                <span style="font-family:'JetBrains Mono',monospace; font-size:18px; font-weight:700;">${bin}₂ = ${octResult}₈</span>
            </div>
        `;

        resultEl.innerHTML = html;
    }

    btn.addEventListener('click', render);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') render(); });
    render();
}

// ===== TAB 5: BIN -> DEC =====
function initBin2DecTab(container) {
    const input = container.querySelector('#simBinDecInput');
    const btn = container.querySelector('#simBinDecBtn');
    const resultEl = container.querySelector('#bin2decResult');

    function render() {
        let bin = input.value.replace(/[^01]/g, '');
        if (!bin) bin = '0';
        input.value = bin;

        const len = bin.length;
        let terms = [];
        let total = 0;

        let weightTableHtml = '<div class="weight-table">';
        for (let i = 0; i < len; i++) {
            const power = len - 1 - i;
            const bit = bin[i];
            const weight = Math.pow(2, power);
            const val = parseInt(bit) * weight;
            total += val;

            if (bit === '1') {
                terms.push(`(1 × 2<sup>${power}</sup> = ${weight})`);
            }

            weightTableHtml += `
                <div class="weight-col">
                    <span class="weight-power">2<sup>${power}</sup></span>
                    <span class="weight-value">${weight}</span>
                    <div class="weight-bit ${bit==='1'?'active':''}">${bit}</div>
                    <span class="weight-result">${val}</span>
                </div>
            `;
        }
        weightTableHtml += '</div>';

        let html = `
            <div class="info-box tip mt-16">
                <strong>Tabel Bobot Posisi:</strong>
            </div>
            ${weightTableHtml}

            <div class="steps-container mt-16">
                <div class="step-item">
                    <div class="step-number">∑</div>
                    <div class="step-content">
                        <h5>Penjumlahan Bit Bernilai 1:</h5>
                        <p>${terms.join(' + ')} = <strong>${total}</strong></p>
                    </div>
                </div>
            </div>

            <div class="info-box success mt-16">
                <strong>Hasil Akhir:</strong>
                <span style="font-family:'JetBrains Mono',monospace; font-size:18px; font-weight:700;">${bin}₂ = ${total}₁₀</span>
            </div>
        `;

        resultEl.innerHTML = html;
    }

    btn.addEventListener('click', render);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') render(); });
    render();
}

// ===== TAB 6: QUIZ 1 =====
function initQuiz1(container) {
    const questions = [
        {
            q: 'Konversikan desimal 35 ke biner:',
            ans: '100011',
            hint: '35 = 32 + 2 + 1 = 2⁵ + 2¹ + 2⁰',
            type: 'text'
        },
        {
            q: 'Konversikan biner 110110 ke heksadesimal (kelompokkan 4-bit):',
            ans: '36',
            hint: '0011 0110 → 0011=3, 0110=6 → 36₁₆',
            type: 'text'
        },
        {
            q: 'Konversikan biner 101110 ke oktal (kelompokkan 3-bit):',
            ans: '56',
            hint: '101 110 → 101=5, 110=6 → 56₈',
            type: 'text'
        },
        {
            q: 'Konversikan heksadesimal 2F ke desimal via biner:',
            ans: '47',
            hint: '2F → 0010 1111 → 32 + 8 + 4 + 2 + 1 = 47',
            type: 'text'
        },
        {
            q: 'Berapa bit yang dibutuhkan untuk mengelompokkan biner ke heksadesimal?',
            ans: '4',
            hint: 'Karena 2⁴ = 16',
            type: 'text'
        }
    ];

    const quizEl = container.querySelector('#quizQuestions');
    const scoreEl = container.querySelector('#quizScore');
    const progEl = container.querySelector('#quizProgress');
    const resetBtn = container.querySelector('#resetQuizBtn');

    let userScores = new Array(questions.length).fill(false);

    function renderQuiz() {
        userScores = new Array(questions.length).fill(false);
        updateScore();

        quizEl.innerHTML = questions.map((q, idx) => `
            <div class="quiz-container interactive-card" style="margin-bottom:16px;">
                <div class="quiz-question">${idx + 1}. ${q.q}</div>
                <div class="quiz-input-row">
                    <input type="text" class="quiz-input" id="qInput${idx}" placeholder="Jawaban Anda...">
                    <button class="btn btn-primary btn-sm" data-idx="${idx}">Periksa</button>
                </div>
                <div class="quiz-feedback" id="qFeedback${idx}"></div>
            </div>
        `).join('');

        quizEl.querySelectorAll('button[data-idx]').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.idx);
                const input = quizEl.querySelector(`#qInput${idx}`);
                const feedback = quizEl.querySelector(`#qFeedback${idx}`);
                const userAns = input.value.trim().toUpperCase();
                const correctAns = questions[idx].ans.toUpperCase();

                if (userAns === correctAns) {
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
