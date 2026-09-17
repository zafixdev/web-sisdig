/* ========================================
   MINGGU 3: ALJABAR BOOLEAN
   Gerbang Logika, Hukum Boolean, SOP & POS
   ======================================== */

registerWeek(3, (container, activeTab) => {
    container.innerHTML = `
        <div class="week-header">
            <span class="week-badge">📘 Minggu 03</span>
            <h2>Aljabar Boolean & Gerbang Logika</h2>
            <p>Eksplorasi gerbang logika dasar (AND, OR, NOT, NAND, NOR, XOR, XNOR), hukum-hukum aljabar Boolean, serta representasi bentuk standar <strong>Sum of Product (SOP)</strong> dan <strong>Product of Sum (POS)</strong>.</p>
        </div>

        <!-- In-content tabs -->
        <div class="content-tabs">
            <button class="content-tab ${activeTab === 'gates' ? 'active' : ''}" data-tab="gates">⚡ Simulator Gerbang</button>
            <button class="content-tab ${activeTab === 'boolean-laws' ? 'active' : ''}" data-tab="boolean-laws">📜 Hukum Boolean</button>
            <button class="content-tab ${activeTab === 'boolean-ops' ? 'active' : ''}" data-tab="boolean-ops">⚙️ Operasi & Presedensi</button>
            <button class="content-tab ${activeTab === 'sop' ? 'active' : ''}" data-tab="sop">➕ SOP (Minterm)</button>
            <button class="content-tab ${activeTab === 'pos' ? 'active' : ''}" data-tab="pos">✖️ POS (Maxterm)</button>
            <button class="content-tab ${activeTab === 'quiz3' ? 'active' : ''}" data-tab="quiz3">📝 Latihan Soal</button>
        </div>

        <!-- TAB 1: GATES SIMULATOR -->
        <div class="tab-panel ${activeTab === 'gates' ? 'active' : ''}" id="tab-gates">
            <div class="interactive-card">
                <h4>🎛️ Simulator Gerbang Logika Interaktif</h4>
                <p>Pilih jenis gerbang logika dan klik saklar input (A & B) untuk menguji output secara langsung.</p>

                <!-- Gate Selector -->
                <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
                    <button class="btn btn-secondary btn-sm gate-select-btn active" data-gate="AND">AND (•)</button>
                    <button class="btn btn-secondary btn-sm gate-select-btn" data-gate="OR">OR (+)</button>
                    <button class="btn btn-secondary btn-sm gate-select-btn" data-gate="NOT">NOT (′)</button>
                    <button class="btn btn-secondary btn-sm gate-select-btn" data-gate="NAND">NAND</button>
                    <button class="btn btn-secondary btn-sm gate-select-btn" data-gate="NOR">NOR</button>
                    <button class="btn btn-secondary btn-sm gate-select-btn" data-gate="XOR">XOR (⊕)</button>
                    <button class="btn btn-secondary btn-sm gate-select-btn" data-gate="XNOR">XNOR (⊙)</button>
                </div>

                <!-- Simulator UI -->
                <div class="gate-sim">
                    <div class="gate-inputs">
                        <div class="gate-input-row">
                            <span style="font-weight:600; width:60px;">Input A:</span>
                            <div class="gate-toggle" id="toggleA"></div>
                            <span class="text-mono" id="valA">0</span>
                        </div>
                        <div class="gate-input-row" id="rowB">
                            <span style="font-weight:600; width:60px;">Input B:</span>
                            <div class="gate-toggle" id="toggleB"></div>
                            <span class="text-mono" id="valB">0</span>
                        </div>
                    </div>

                    <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
                        <span class="gate-symbol" id="gateSymbol">AND</span>
                        <span style="font-size:11px; color:var(--text-muted);" id="gateExpr">Y = A • B</span>
                    </div>

                    <div class="gate-output">
                        <div class="gate-output-value v0" id="gateOut">0</div>
                        <span class="gate-output-label">Output (Y)</span>
                    </div>
                </div>

                <!-- Dynamic Truth Table -->
                <div class="mt-24">
                    <h5 style="font-size:14px; margin-bottom:8px; color:var(--text-secondary);">Tabel Kebenaran (Truth Table):</h5>
                    <div id="gateTableContainer"></div>
                </div>
            </div>
        </div>

        <!-- TAB 2: HUKUM BOOLEAN -->
        <div class="tab-panel ${activeTab === 'boolean-laws' ? 'active' : ''}" id="tab-boolean-laws">
            <div class="interactive-card">
                <h4>📜 Hukum-Hukum Aljabar Boolean</h4>
                <p>Prinsip-prinsip fundamental untuk menyederhanakan ekspresi logika:</p>

                <div style="overflow-x:auto;">
                    <table class="truth-table">
                        <thead>
                            <tr><th>Nama Hukum</th><th>Bentuk Operasi OR (+)</th><th>Bentuk Operasi AND (•)</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>Identitas</strong></td><td>A + 0 = A</td><td>A • 1 = A</td></tr>
                            <tr><td><strong>Dominansi (Null)</strong></td><td>A + 1 = 1</td><td>A • 0 = 0</td></tr>
                            <tr><td><strong>Idempoten</strong></td><td>A + A = A</td><td>A • A = A</td></tr>
                            <tr><td><strong>Inversi (Komplemen)</strong></td><td>A + A′ = 1</td><td>A • A′ = 0</td></tr>
                            <tr><td><strong>Involusi (Double NOT)</strong></td><td colspan="2" style="text-align:center;">(A′)′ = A</td></tr>
                            <tr><td><strong>Komutatif</strong></td><td>A + B = B + A</td><td>A • B = B • A</td></tr>
                            <tr><td><strong>Asosiatif</strong></td><td>A + (B + C) = (A + B) + C</td><td>A • (B • C) = (A • B) • C</td></tr>
                            <tr><td><strong>Distributif</strong></td><td>A + (B • C) = (A + B) • (A + C)</td><td>A • (B + C) = (A • B) + (A • C)</td></tr>
                            <tr><td><strong>De Morgan</strong></td><td>(A + B)′ = A′ • B′</td><td>(A • B)′ = A′ + B′</td></tr>
                            <tr><td><strong>Absorpsi</strong></td><td>A + A • B = A</td><td>A • (A + B) = A</td></tr>
                        </tbody>
                    </table>
                </div>

                <div class="info-box tip mt-16">
                    <strong>Hukum De Morgan Sangat Penting:</strong>
                    Komplemen dari penjumlahan adalah perkalian dari komplemen masing-masing variabel, dan sebaliknya.
                </div>
            </div>
        </div>

        <!-- TAB 3: OPERASI BOOLEAN -->
        <div class="tab-panel ${activeTab === 'boolean-ops' ? 'active' : ''}" id="tab-boolean-ops">
            <div class="interactive-card">
                <h4>⚙️ Urutan Presedensi Operasi Boolean</h4>
                <p>Ketika mengevaluasi fungsi logika tanpa tanda kurung, ikuti urutan prioritas berikut:</p>

                <div class="steps-container">
                    <div class="step-item">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h5>Tanda Kurung <code>( )</code></h5>
                            <p>Ekspresi di dalam tanda kurung selalu diselesaikan terlebih dahulu.</p>
                        </div>
                    </div>
                    <div class="step-item">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h5>NOT / Komplemen (<code>′</code> atau <code>~</code>)</h5>
                            <p>Operasi pembalikan bit memiliki prioritas tertinggi setelah kurung.</p>
                        </div>
                    </div>
                    <div class="step-item">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h5>AND / Perkalian Logika (<code>•</code>)</h5>
                            <p>Operasi konjungsi dievaluasi sebelum operasi OR.</p>
                        </div>
                    </div>
                    <div class="step-item">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <h5>OR / Penjumlahan Logika (<code>+</code>)</h5>
                            <p>Operasi disjungsi memiliki prioritas paling akhir.</p>
                        </div>
                    </div>
                </div>

                <div class="info-box tip mt-16">
                    <strong>Contoh Evaluasi:</strong><br>
                    Untuk <code>F = A + B • C′</code> dengan A=0, B=1, C=1:<br>
                    1. <code>C′ = 1′ = 0</code><br>
                    2. <code>B • C′ = 1 • 0 = 0</code><br>
                    3. <code>A + 0 = 0 + 0 = 0</code> ➔ Hasil: <strong>0</strong>
                </div>
            </div>
        </div>

        <!-- TAB 4: SOP (MINTERM) -->
        <div class="tab-panel ${activeTab === 'sop' ? 'active' : ''}" id="tab-sop">
            <div class="interactive-card">
                <h4>Sum of Product (SOP) / Minterm</h4>
                <p>SOP adalah bentuk standar fungsi Boolean di mana <strong>suku-suku perkalian (AND) dijumlahkan (OR)</strong>.</p>

                <div class="info-box tip">
                    <strong>Karakteristik SOP:</strong>
                    • Setiap suku (term) adalah hasil perkalian AND (misal: <code>A′BC</code>)<br>
                    • Seluruh suku dihubungkan dengan tanda tambah OR (misal: <code>A′BC + AB′C + ABC</code>)<br>
                    • Variabel <strong>tanpa komplemen (A)</strong> bernilai <strong>1</strong><br>
                    • Variabel <strong>dengan komplemen (A′)</strong> bernilai <strong>0</strong><br>
                    • Notasi Minterm: <code>f(A,B,C) = ∑m(1, 4, 7)</code>
                </div>

                <!-- Interactive Minterm Converter -->
                <div class="mt-24">
                    <h5>🛠️ Kalkulator Minterm 3-Variabel:</h5>
                    <p style="font-size:13px; color:var(--text-muted);">Pilih baris tabel kebenaran yang bernilai 1 untuk menghasilkan ekspresi SOP:</p>

                    <div id="sopTable"></div>

                    <div class="info-box success mt-16" id="sopResultBox">
                        <strong>Fungsi Boolean SOP yang Dihasilkan:</strong>
                        <p style="font-family:'JetBrains Mono',monospace; font-size:16px; margin-top:4px;" id="sopExpr">F = 0</p>
                        <p style="font-size:12px; color:var(--text-secondary);" id="sopMinterm">Notasi: f(A,B,C) = ∑m()</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- TAB 5: POS (MAXTERM) -->
        <div class="tab-panel ${activeTab === 'pos' ? 'active' : ''}" id="tab-pos">
            <div class="interactive-card">
                <h4>Product of Sum (POS) / Maxterm</h4>
                <p>POS adalah bentuk standar fungsi Boolean di mana <strong>suku-suku penjumlahan (OR) dikalikan (AND)</strong>.</p>

                <div class="info-box tip">
                    <strong>Karakteristik POS:</strong>
                    • Setiap suku (term) adalah hasil penjumlahan OR (misal: <code>(A + B′ + C)</code>)<br>
                    • Seluruh suku dihubungkan dengan perkalian AND (misal: <code>(A+B+C)(A′+B+C′)</code>)<br>
                    • Variabel <strong>tanpa komplemen (A)</strong> bernilai <strong>0</strong><br>
                    • Variabel <strong>dengan komplemen (A′)</strong> bernilai <strong>1</strong> (kebalikan dari SOP!)<br>
                    • Notasi Maxterm: <code>f(A,B,C) = ∏M(0, 2, 3)</code>
                </div>

                <div class="mt-24">
                    <h5>Perbandingan Pembacaan Variabel:</h5>
                    <table class="truth-table">
                        <thead>
                            <tr><th>Nilai Biner</th><th>Pada SOP (Minterm)</th><th>Pada POS (Maxterm)</th></tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>0</strong></td><td>A′ (berkomplemen)</td><td>A (tanpa komplemen)</td></tr>
                            <tr><td><strong>1</strong></td><td>A (tanpa komplemen)</td><td>A′ (berkomplemen)</td></tr>
                        </tbody>
                    </table>
                </div>

                <div class="info-box success mt-16">
                    <strong>Konversi SOP ⇄ POS:</strong>
                    SOP mengambil indeks baris bernilai <strong>1</strong> (∑m), sedangkan POS mengambil indeks baris bernilai <strong>0</strong> (∏M).<br>
                    Contoh jika ∑m(1, 3, 5, 7) maka bentuk POS-nya adalah ∏M(0, 2, 4, 6).
                </div>
            </div>
        </div>

        <!-- TAB 6: QUIZ 3 -->
        <div class="tab-panel ${activeTab === 'quiz3' ? 'active' : ''}" id="tab-quiz3">
            <div class="interactive-card">
                <div class="score-bar">
                    <span class="score-label">Skor Latihan:</span>
                    <span class="score-value" id="quiz3Score">0 / 5</span>
                    <div class="progress-track">
                        <div class="progress-fill" id="quiz3Progress" style="width: 0%;"></div>
                    </div>
                </div>

                <div id="quiz3Questions"></div>

                <button class="btn btn-secondary mt-16" id="resetQuiz3Btn">🔄 Acak Soal Baru</button>
            </div>
        </div>
    `;

    // Tab switching
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

    initGateSimulator(container);
    initSopTab(container);
    initQuiz3(container);
});

// ===== GATE SIMULATOR =====
function initGateSimulator(container) {
    let currentGate = 'AND';
    let inA = 0;
    let inB = 0;

    const toggleA = container.querySelector('#toggleA');
    const toggleB = container.querySelector('#toggleB');
    const valA = container.querySelector('#valA');
    const valB = container.querySelector('#valB');
    const rowB = container.querySelector('#rowB');
    const gateSymbol = container.querySelector('#gateSymbol');
    const gateExpr = container.querySelector('#gateExpr');
    const gateOut = container.querySelector('#gateOut');
    const tableContainer = container.querySelector('#gateTableContainer');

    const gateDefs = {
        'AND': { expr: 'Y = A • B', calc: (a, b) => a & b },
        'OR': { expr: 'Y = A + B', calc: (a, b) => a | b },
        'NOT': { expr: 'Y = A′', calc: (a) => a ? 0 : 1, single: true },
        'NAND': { expr: 'Y = (A • B)′', calc: (a, b) => (a & b) ? 0 : 1 },
        'NOR': { expr: 'Y = (A + B)′', calc: (a, b) => (a | b) ? 0 : 1 },
        'XOR': { expr: 'Y = A ⊕ B', calc: (a, b) => a ^ b },
        'XNOR': { expr: 'Y = (A ⊕ B)′', calc: (a, b) => (a ^ b) ? 0 : 1 },
    };

    function updateSim() {
        const def = gateDefs[currentGate];
        gateSymbol.textContent = currentGate;
        gateExpr.textContent = def.expr;

        if (def.single) {
            rowB.style.display = 'none';
        } else {
            rowB.style.display = 'flex';
        }

        const out = def.single ? def.calc(inA) : def.calc(inA, inB);
        gateOut.textContent = out;
        gateOut.className = `gate-output-value ${out === 1 ? 'v1' : 'v0'}`;

        renderTable();
    }

    function renderTable() {
        const def = gateDefs[currentGate];
        let html = '<table class="truth-table"><thead><tr><th>A</th>';
        if (!def.single) html += '<th>B</th>';
        html += '<th>Y (Output)</th></tr></thead><tbody>';

        if (def.single) {
            [0, 1].forEach(a => {
                const out = def.calc(a);
                const isCurrent = (a === inA);
                html += `<tr class="${isCurrent ? 'highlight' : ''}"><td>${a}</td><td class="${isCurrent ? 'highlight' : ''}"><strong>${out}</strong></td></tr>`;
            });
        } else {
            [[0,0], [0,1], [1,0], [1,1]].forEach(([a, b]) => {
                const out = def.calc(a, b);
                const isCurrent = (a === inA && b === inB);
                html += `<tr class="${isCurrent ? 'highlight' : ''}"><td>${a}</td><td>${b}</td><td class="${isCurrent ? 'highlight' : ''}"><strong>${out}</strong></td></tr>`;
            });
        }

        html += '</tbody></table>';
        tableContainer.innerHTML = html;
    }

    // Gate buttons
    container.querySelectorAll('.gate-select-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.gate-select-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentGate = btn.dataset.gate;
            updateSim();
        });
    });

    toggleA.addEventListener('click', () => {
        inA = inA ? 0 : 1;
        toggleA.classList.toggle('on', inA === 1);
        valA.textContent = inA;
        updateSim();
    });

    toggleB.addEventListener('click', () => {
        inB = inB ? 0 : 1;
        toggleB.classList.toggle('on', inB === 1);
        valB.textContent = inB;
        updateSim();
    });

    updateSim();
}

// ===== TAB 4: SOP (MINTERM) =====
function initSopTab(container) {
    const tableEl = container.querySelector('#sopTable');
    const exprEl = container.querySelector('#sopExpr');
    const mintermEl = container.querySelector('#sopMinterm');

    const state = [0, 1, 0, 1, 0, 0, 1, 1]; // 8 combinations for 3 vars

    function updateSOP() {
        let minterms = [];
        let terms = [];

        state.forEach((val, idx) => {
            if (val === 1) {
                minterms.push(idx);
                const a = (idx & 4) ? 'A' : 'A′';
                const b = (idx & 2) ? 'B' : 'B′';
                const c = (idx & 1) ? 'C' : 'C′';
                terms.push(`${a}${b}${c}`);
            }
        });

        exprEl.textContent = terms.length > 0 ? `F = ${terms.join(' + ')}` : 'F = 0';
        mintermEl.textContent = `Notasi Minterm: f(A,B,C) = ∑m(${minterms.join(', ')})`;
    }

    function renderTable() {
        let html = `
            <table class="truth-table">
                <thead>
                    <tr><th>Minterm</th><th>A</th><th>B</th><th>C</th><th>Output (F) - Klik untuk Ubah</th><th>Bentuk Term</th></tr>
                </thead>
                <tbody>
        `;

        for (let i = 0; i < 8; i++) {
            const a = (i & 4) ? 1 : 0;
            const b = (i & 2) ? 1 : 0;
            const c = (i & 1) ? 1 : 0;
            const term = `${a ? 'A' : 'A′'}${b ? 'B' : 'B′'}${c ? 'C' : 'C′'}`;

            html += `
                <tr>
                    <td><code>m${i}</code></td>
                    <td>${a}</td>
                    <td>${b}</td>
                    <td>${c}</td>
                    <td>
                        <button class="btn btn-sm ${state[i] ? 'btn-primary' : 'btn-secondary'}" data-m="${i}" style="width:60px;">
                            ${state[i]}
                        </button>
                    </td>
                    <td><code>${term}</code></td>
                </tr>
            `;
        }

        html += '</tbody></table>';
        tableEl.innerHTML = html;

        tableEl.querySelectorAll('button[data-m]').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.m);
                state[idx] = state[idx] ? 0 : 1;
                renderTable();
                updateSOP();
            });
        });
    }

    renderTable();
    updateSOP();
}

// ===== TAB 6: QUIZ 3 =====
function initQuiz3(container) {
    const questions = [
        {
            q: 'Berdasarkan Hukum De Morgan, ekspresi (A + B)′ setara dengan:',
            ans: "A'•B'",
            hint: 'Komplemen dari penjumlahan adalah perkalian dari komplemen: A′ • B′',
        },
        {
            q: 'Gerbang logika manakah yang menghasilkan output 1 HANYA JIKA kedua inputnya bernilai 1?',
            ans: 'AND',
            hint: 'Gerbang konjungsi logika (perkalian)',
        },
        {
            q: 'Sederhanakan ekspresi Boolean: A + A•B',
            ans: 'A',
            hint: 'Gunakan Hukum Absorpsi (Penyerapan): A + AB = A(1 + B) = A(1) = A',
        },
        {
            q: 'Pada representasi SOP, variabel A bernilai 0 direpresentasikan sebagai apa?',
            ans: "A'",
            hint: 'Variabel dengan nilai 0 pada SOP ditulis sebagai bentuk komplemen (A′)',
        },
        {
            q: 'Jika suatu fungsi 3-variabel memiliki SOP f(A,B,C) = ∑m(0, 2, 4), berapakah indeks Maxterm pada bentuk POS-nya?',
            ans: '1, 3, 5, 6, 7',
            hint: 'Ambil semua indeks baris yang tidak ada di SOP: 1, 3, 5, 6, 7',
        }
    ];

    const quizEl = container.querySelector('#quiz3Questions');
    const scoreEl = container.querySelector('#quiz3Score');
    const progEl = container.querySelector('#quiz3Progress');
    const resetBtn = container.querySelector('#resetQuiz3Btn');

    let userScores = new Array(questions.length).fill(false);

    function renderQuiz() {
        userScores = new Array(questions.length).fill(false);
        updateScore();

        quizEl.innerHTML = questions.map((q, idx) => `
            <div class="quiz-container interactive-card" style="margin-bottom:16px;">
                <div class="quiz-question">${idx + 1}. ${q.q}</div>
                <div class="quiz-input-row">
                    <input type="text" class="quiz-input" id="q3Input${idx}" placeholder="Jawaban Anda...">
                    <button class="btn btn-primary btn-sm" data-idx="${idx}">Periksa</button>
                </div>
                <div class="quiz-feedback" id="q3Feedback${idx}"></div>
            </div>
        `).join('');

        quizEl.querySelectorAll('button[data-idx]').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.idx);
                const input = quizEl.querySelector(`#q3Input${idx}`);
                const feedback = quizEl.querySelector(`#q3Feedback${idx}`);
                const userAns = input.value.trim().toUpperCase().replace(/[\s\(\)\•]/g, '').replace(/’/g, "'");
                const correctAns = questions[idx].ans.toUpperCase().replace(/[\s\(\)\•]/g, '').replace(/’/g, "'");

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
