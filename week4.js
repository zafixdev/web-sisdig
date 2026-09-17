/* ========================================
   MINGGU 4: PENYEDERHANAAN K-MAP
   Karnaugh Map 2, 3, 4 Variabel & Don't Care
   ======================================== */

registerWeek(4, (container, activeTab) => {
    container.innerHTML = `
        <div class="week-header">
            <span class="week-badge">📘 Minggu 04</span>
            <h2>Penyederhanaan Rangkaian Logika — Karnaugh Map</h2>
            <p>Metode grafis <strong>K-Map</strong> untuk meminimalkan fungsi Boolean secara visual tanpa harus melakukan manipulasi aljabar manual yang rumit.</p>
        </div>

        <!-- In-content tabs -->
        <div class="content-tabs">
            <button class="content-tab ${activeTab === 'kmap-intro' ? 'active' : ''}" data-tab="kmap-intro">🗺️ Konsep K-Map</button>
            <button class="content-tab ${activeTab === 'kmap-rules' ? 'active' : ''}" data-tab="kmap-rules">📏 Aturan Pengelompokan</button>
            <button class="content-tab ${activeTab === 'kmap-2var' ? 'active' : ''}" data-tab="kmap-2var">2️⃣ K-Map 2 Variabel</button>
            <button class="content-tab ${activeTab === 'kmap-3var' ? 'active' : ''}" data-tab="kmap-3var">3️⃣ K-Map 3 Variabel</button>
            <button class="content-tab ${activeTab === 'kmap-4var' ? 'active' : ''}" data-tab="kmap-4var">4️⃣ K-Map 4 Variabel</button>
            <button class="content-tab ${activeTab === 'dont-care' ? 'active' : ''}" data-tab="dont-care">❓ Don't Care (X)</button>
            <button class="content-tab ${activeTab === 'quiz4' ? 'active' : ''}" data-tab="quiz4">📝 Latihan Soal</button>
        </div>

        <!-- TAB 1: KMAP INTRO -->
        <div class="tab-panel ${activeTab === 'kmap-intro' ? 'active' : ''}" id="tab-kmap-intro">
            <div class="interactive-card">
                <h4>🗺️ Mengapa Menggunakan Karnaugh Map?</h4>
                <p>K-Map menyusun tabel kebenaran dalam format kisi 2D berdasarkan <strong>Kode Gray</strong> (hanya 1 bit yang berubah antar kotak bersebelahan). Hal ini memungkinkan kita mengidentifikasi dan mengeliminasi variabel yang redundan secara langsung.</p>

                <div class="grid-2 mt-16">
                    <div class="interactive-card" style="background:var(--bg-tertiary); margin:0;">
                        <h5>⚡ Aljabar Boolean Manual</h5>
                        <p style="font-size:13px; color:var(--text-muted); margin-top:8px;">
                            • Butuh kejelian melihat hukum aljabar<br>
                            • Rentan keliru pada persamaan panjang<br>
                            • Sulit memastikan hasil sudah paling minimal
                        </p>
                    </div>
                    <div class="interactive-card" style="background:var(--accent-glow); border-color:var(--accent); margin:0;">
                        <h5>⭐ Karnaugh Map (K-Map)</h5>
                        <p style="font-size:13px; color:var(--text-primary); margin-top:8px;">
                            • Grafis dan sangat intuitif<br>
                            • Pengelompokan visual (kotak 1, 2, 4, 8, 16)<br>
                            • Dijamin menghasilkan bentuk minimal SOP/POS
                        </p>
                    </div>
                </div>

                <div class="info-box tip mt-24">
                    <strong>Penyusunan Kode Gray:</strong>
                    Urutan label pada kolom/baris K-Map adalah <code>00 ➔ 01 ➔ 11 ➔ 10</code> (bukan 10 lalu 11). Ini memastikan hanya 1 variabel yang berubah nilainya antar kolom bersebelahan!
                </div>
            </div>
        </div>

        <!-- TAB 2: KMAP RULES -->
        <div class="tab-panel ${activeTab === 'kmap-rules' ? 'active' : ''}" id="tab-kmap-rules">
            <div class="interactive-card">
                <h4>📏 Aturan Utama Pengelompokan (Grouping)</h4>
                <p>Ikuti 5 aturan emas berikut saat melingkari angka 1 pada K-Map:</p>

                <div class="steps-container">
                    <div class="step-item">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h5>Ukuran Kelompok Harus Kelipatan 2<sup>n</sup></h5>
                            <p>Kelompok hanya boleh berukuran <strong>1, 2, 4, 8, atau 16</strong> kotak. Dilarang mengelompokkan 3, 5, atau 6 kotak!</p>
                        </div>
                    </div>
                    <div class="step-item">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h5>Bentuk Kelompok Harus Persegi / Persegi Panjang</h5>
                            <p>Kelompok tidak boleh berbentuk diagonal atau huruf L.</p>
                        </div>
                    </div>
                    <div class="step-item">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h5>Buat Kelompok Sebesar Mungkin</h5>
                            <p>Semakin besar kelompok (misal 8 vs 4 kotak), semakin banyak variabel yang tereliminasi sehingga hasil semakin sederhana.</p>
                        </div>
                    </div>
                    <div class="step-item">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <h5>Tepi K-Map Saling Menyambung (Toroid / Wrap-around)</h5>
                            <p>Tepi kiri tersambung dengan tepi kanan, tepi atas tersambung dengan tepi bawah. Keempat sudut K-Map 4-variabel dapat dikelompokkan menjadi 1 kelompok 4-kotak!</p>
                        </div>
                    </div>
                    <div class="step-item">
                        <div class="step-number">5</div>
                        <div class="step-content">
                            <h5>Boleh Terjadi Overlapping (Tumpang Tindih)</h5>
                            <p>Satu kotak bernilai 1 boleh masuk ke dalam lebih dari satu kelompok asalkan membantu memperbesar ukuran kelompok lain.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- TAB 3: KMAP 2 VAR -->
        <div class="tab-panel ${activeTab === 'kmap-2var' ? 'active' : ''}" id="tab-kmap-2var">
            <div class="interactive-card">
                <h4>Interactive K-Map 2-Variabel (A, B)</h4>
                <p>Klik kotak-kotak di bawah untuk mengubah nilai 0/1. Persamaan Boolean yang disederhanakan akan diperbarui secara real-time:</p>

                <div style="display:flex; gap:32px; align-items:center; flex-wrap:wrap; margin:20px 0;">
                    <!-- Grid -->
                    <div>
                        <div class="kmap-grid" style="grid-template-columns: 50px 60px 60px;">
                            <div class="kmap-cell header">A \\ B</div>
                            <div class="kmap-cell header">B=0</div>
                            <div class="kmap-cell header">B=1</div>

                            <div class="kmap-cell header">A=0</div>
                            <div class="kmap-cell value" id="k2_00" data-idx="0">0</div>
                            <div class="kmap-cell value" id="k2_01" data-idx="1">1</div>

                            <div class="kmap-cell header">A=1</div>
                            <div class="kmap-cell value" id="k2_10" data-idx="2">1</div>
                            <div class="kmap-cell value" id="k2_11" data-idx="3">1</div>
                        </div>
                    </div>

                    <!-- Result Panel -->
                    <div style="flex:1; min-width:240px;">
                        <div class="info-box success" style="margin:0;">
                            <strong>Hasil Penyederhanaan:</strong>
                            <p style="font-family:'JetBrains Mono',monospace; font-size:20px; font-weight:700; margin-top:6px;" id="k2Result">Q = A + B</p>
                            <span style="font-size:12px; color:var(--text-secondary);" id="k2Detail">m(1) + m(2) + m(3) = A′B + AB′ + AB = A + B</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- TAB 4: KMAP 3 VAR -->
        <div class="tab-panel ${activeTab === 'kmap-3var' ? 'active' : ''}" id="tab-kmap-3var">
            <div class="interactive-card">
                <h4>Interactive K-Map 3-Variabel (A, BC)</h4>
                <p>Klik kotak untuk mengubah nilai (0 atau 1):</p>

                <div class="kmap-grid" style="grid-template-columns: 60px repeat(4, 56px);">
                    <div class="kmap-cell header">A \\ BC</div>
                    <div class="kmap-cell header">00</div>
                    <div class="kmap-cell header">01</div>
                    <div class="kmap-cell header">11</div>
                    <div class="kmap-cell header">10</div>

                    <div class="kmap-cell header">0</div>
                    <div class="kmap-cell value" id="k3_0" data-m="0">0</div>
                    <div class="kmap-cell value" id="k3_1" data-m="1">1</div>
                    <div class="kmap-cell value" id="k3_3" data-m="3">1</div>
                    <div class="kmap-cell value" id="k3_2" data-m="2">0</div>

                    <div class="kmap-cell header">1</div>
                    <div class="kmap-cell value" id="k3_4" data-m="4">0</div>
                    <div class="kmap-cell value" id="k3_5" data-m="5">1</div>
                    <div class="kmap-cell value" id="k3_7" data-m="7">1</div>
                    <div class="kmap-cell value" id="k3_6" data-m="6">0</div>
                </div>

                <div class="info-box success mt-16">
                    <strong>Fungsi Hasil Penyederhanaan:</strong>
                    <p style="font-family:'JetBrains Mono',monospace; font-size:20px; font-weight:700; margin-top:6px;" id="k3Result">Q = C</p>
                    <span style="font-size:12px; color:var(--text-secondary);" id="k3Detail">Kelompok 4 kotak (m1, m3, m5, m7) mengeliminasi variabel A dan B, menyisakan C.</span>
                </div>
            </div>
        </div>

        <!-- TAB 5: KMAP 4 VAR -->
        <div class="tab-panel ${activeTab === 'kmap-4var' ? 'active' : ''}" id="tab-kmap-4var">
            <div class="interactive-card">
                <h4>Interactive K-Map 4-Variabel (AB, CD)</h4>
                <p>Klik kotak untuk mengubah nilai 0/1 (Kode Gray 2D: 16 kotak):</p>

                <div class="kmap-grid" style="grid-template-columns: 60px repeat(4, 52px);">
                    <div class="kmap-cell header">AB \\ CD</div>
                    <div class="kmap-cell header">00</div>
                    <div class="kmap-cell header">01</div>
                    <div class="kmap-cell header">11</div>
                    <div class="kmap-cell header">10</div>

                    <div class="kmap-cell header">00</div>
                    <div class="kmap-cell value" id="k4_0" data-m="0">0</div>
                    <div class="kmap-cell value" id="k4_1" data-m="1">0</div>
                    <div class="kmap-cell value" id="k4_3" data-m="3">0</div>
                    <div class="kmap-cell value" id="k4_2" data-m="2">0</div>

                    <div class="kmap-cell header">01</div>
                    <div class="kmap-cell value" id="k4_4" data-m="4">0</div>
                    <div class="kmap-cell value" id="k4_5" data-m="5">1</div>
                    <div class="kmap-cell value" id="k4_7" data-m="7">1</div>
                    <div class="kmap-cell value" id="k4_6" data-m="6">0</div>

                    <div class="kmap-cell header">11</div>
                    <div class="kmap-cell value" id="k4_12" data-m="12">0</div>
                    <div class="kmap-cell value" id="k4_13" data-m="13">1</div>
                    <div class="kmap-cell value" id="k4_15" data-m="15">1</div>
                    <div class="kmap-cell value" id="k4_14" data-m="14">0</div>

                    <div class="kmap-cell header">10</div>
                    <div class="kmap-cell value" id="k4_8" data-m="8">0</div>
                    <div class="kmap-cell value" id="k4_9" data-m="9">0</div>
                    <div class="kmap-cell value" id="k4_11" data-m="11">0</div>
                    <div class="kmap-cell value" id="k4_10" data-m="10">0</div>
                </div>

                <div class="info-box success mt-16">
                    <strong>Hasil Contoh (Slide 13 SISDIG 4):</strong>
                    <p style="font-family:'JetBrains Mono',monospace; font-size:18px; font-weight:700; margin-top:6px;">Q = A′BC′D + ABC′D + A′BCD + ABCD = <strong>BD</strong></p>
                    <span style="font-size:12px; color:var(--text-secondary);">Kelompok 4 kotak (m5, m7, m13, m15) mengeliminasi variabel A dan C, menyisakan <strong>B • D</strong>.</span>
                </div>
            </div>
        </div>

        <!-- TAB 6: DON'T CARE -->
        <div class="tab-panel ${activeTab === 'dont-care' ? 'active' : ''}" id="tab-dont-care">
            <div class="interactive-card">
                <h4>❓ Kondisi Don't Care (X / d)</h4>
                <p>Kondisi di mana output rangkaian tidak berpengaruh terhadap fungsionalitas sistem (misalnya kode input yang tidak mungkin pernah muncul pada sistem BCD: 10 s.d. 15).</p>

                <div class="info-box tip">
                    <strong>Strategi Pemanfaatan Don't Care:</strong>
                    • Anggap <strong>X bernilai 1</strong> jika dapat memperbesar ukuran kelompok (misal dari 2 menjadi 4 kotak).<br>
                    • Anggap <strong>X bernilai 0</strong> jika tidak membantu memperbesar kelompok (abaikan saja).<br>
                    • Don't care TIDAK WAJIB dilingkari semua!
                </div>

                <div class="mt-24">
                    <h5>Contoh Penerapan Don't Care:</h5>
                    <p style="font-size:13px; color:var(--text-muted);">F(A,B,C,D) = ∑m(1,3,7,11,15) + d(0,2,5)</p>
                    <div class="info-box success mt-8">
                        Dengan memanfaatkan d(0,2) bersama m(1,3), kita dapat membentuk kelompok 4 kotak di baris pertama sehingga penyederhanaan menjadi jauh lebih optimal.
                    </div>
                </div>
            </div>
        </div>

        <!-- TAB 7: QUIZ 4 -->
        <div class="tab-panel ${activeTab === 'quiz4' ? 'active' : ''}" id="tab-quiz4">
            <div class="interactive-card">
                <div class="score-bar">
                    <span class="score-label">Skor Latihan:</span>
                    <span class="score-value" id="quiz4Score">0 / 5</span>
                    <div class="progress-track">
                        <div class="progress-fill" id="quiz4Progress" style="width: 0%;"></div>
                    </div>
                </div>

                <div id="quiz4Questions"></div>

                <button class="btn btn-secondary mt-16" id="resetQuiz4Btn">🔄 Acak Soal Baru</button>
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

    initKMap2(container);
    initKMap3(container);
    initKMap4(container);
    initQuiz4(container);
});

// ===== K-MAP 2 VAR =====
function initKMap2(container) {
    const state = [0, 1, 1, 1]; // m0=00, m1=01, m2=10, m3=11
    const resEl = container.querySelector('#k2Result');
    const detEl = container.querySelector('#k2Detail');

    function update() {
        // Simple solver for 2-variable
        const [m0, m1, m2, m3] = state;
        let expr = '';
        let detail = '';

        if (m0 && m1 && m2 && m3) {
            expr = 'Q = 1';
            detail = 'Semua kotak bernilai 1 ➔ Fungsi selalu aktif.';
        } else if (!m0 && !m1 && !m2 && !m3) {
            expr = 'Q = 0';
            detail = 'Semua kotak bernilai 0 ➔ Fungsi selalu non-aktif.';
        } else if (!m0 && m1 && m2 && m3) {
            expr = 'Q = A + B';
            detail = 'Dua kelompok 2-kotak: (m1,m3) menghasilkan B + (m2,m3) menghasilkan A.';
        } else if (m0 && m1 && !m2 && !m3) {
            expr = 'Q = A′';
            detail = 'Kelompok 2-kotak baris atas: m0,m1 ➔ A′';
        } else if (!m0 && !m1 && m2 && m3) {
            expr = 'Q = A';
            detail = 'Kelompok 2-kotak baris bawah: m2,m3 ➔ A';
        } else if (m0 && !m1 && m2 && !m3) {
            expr = 'Q = B′';
            detail = 'Kelompok 2-kotak kolom kiri: m0,m2 ➔ B′';
        } else if (!m0 && m1 && !m2 && m3) {
            expr = 'Q = B';
            detail = 'Kelompok 2-kotak kolom kanan: m1,m3 ➔ B';
        } else if (m0 && !m1 && !m2 && m3) {
            expr = 'Q = A′B′ + AB (XNOR)';
            detail = 'Dua kotak diagonal: m0 dan m3 (tidak bisa dikelompokkan).';
        } else if (!m0 && m1 && m2 && !m3) {
            expr = 'Q = A′B + AB′ (XOR)';
            detail = 'Dua kotak diagonal: m1 dan m2 (tidak bisa dikelompokkan).';
        } else {
            let terms = [];
            if (m0) terms.push("A′B′");
            if (m1) terms.push("A′B");
            if (m2) terms.push("AB′");
            if (m3) terms.push("AB");
            expr = `Q = ${terms.join(' + ')}`;
            detail = 'Satu kotak bernilai 1.';
        }

        resEl.textContent = expr;
        detEl.textContent = detail;
    }

    container.querySelectorAll('.kmap-cell.value[data-idx]').forEach(cell => {
        const idx = parseInt(cell.dataset.idx);
        cell.addEventListener('click', () => {
            state[idx] = state[idx] ? 0 : 1;
            cell.textContent = state[idx];
            cell.classList.toggle('selected', state[idx] === 1);
            update();
        });
        cell.classList.toggle('selected', state[idx] === 1);
    });

    update();
}

// ===== K-MAP 3 VAR =====
function initKMap3(container) {
    const state = { 0:0, 1:1, 2:0, 3:1, 4:0, 5:1, 6:0, 7:1 };
    const resEl = container.querySelector('#k3Result');

    container.querySelectorAll('#tab-kmap-3var .kmap-cell.value').forEach(cell => {
        const m = parseInt(cell.dataset.m);
        cell.addEventListener('click', () => {
            state[m] = state[m] ? 0 : 1;
            cell.textContent = state[m];
            cell.classList.toggle('selected', state[m] === 1);
            // Simple display update
            const ones = Object.keys(state).filter(k => state[k] === 1);
            if (ones.length === 8) resEl.textContent = 'Q = 1';
            else if (ones.length === 0) resEl.textContent = 'Q = 0';
            else if (ones.join(',') === '1,3,5,7') resEl.textContent = 'Q = C';
            else resEl.textContent = `∑m(${ones.join(', ')})`;
        });
        cell.classList.toggle('selected', state[m] === 1);
    });
}

// ===== K-MAP 4 VAR =====
function initKMap4(container) {
    const state = {};
    for (let i = 0; i < 16; i++) state[i] = 0;
    state[5] = 1; state[7] = 1; state[13] = 1; state[15] = 1;

    container.querySelectorAll('#tab-kmap-4var .kmap-cell.value').forEach(cell => {
        const m = parseInt(cell.dataset.m);
        cell.addEventListener('click', () => {
            state[m] = state[m] ? 0 : 1;
            cell.textContent = state[m];
            cell.classList.toggle('selected', state[m] === 1);
        });
        cell.classList.toggle('selected', state[m] === 1);
    });
}

// ===== QUIZ 4 =====
function initQuiz4(container) {
    const questions = [
        {
            q: 'Berapakah ukuran kelompok (group size) yang DIPERBOLEHKAN pada K-Map?',
            ans: '1, 2, 4, 8, 16',
            hint: 'Harus berupa kelipatan 2^n',
        },
        {
            q: 'Mengapa urutan kolom pada K-Map disusun dengan Kode Gray (00, 01, 11, 10)?',
            ans: 'HANYA 1 BIT BERUBAH',
            hint: 'Agar hanya 1 variabel yang berubah nilainya antar kotak bersebelahan',
        },
        {
            q: 'Berapa banyak variabel yang tereliminasi jika kita membuat satu kelompok berukuran 4 kotak?',
            ans: '2',
            hint: 'Rumus eliminasi: log2(ukuran kelompok) = log2(4) = 2 variabel',
        },
        {
            q: 'Apakah sudut-sudut K-Map 4-variabel dapat digabungkan menjadi satu kelompok 4-kotak?',
            ans: 'YA',
            hint: 'Prinsip wrap-around/toroid: tepi dan sudut saling bersambungan',
        },
        {
            q: 'Bagaimana perlakuan kondisi Don\'t Care (X) jika TIDAK membantu memperbesar kelompok?',
            ans: 'DIABAIKAN',
            hint: 'Anggap X sebagai 0 dan abaikan saja',
        }
    ];

    const quizEl = container.querySelector('#quiz4Questions');
    const scoreEl = container.querySelector('#quiz4Score');
    const progEl = container.querySelector('#quiz4Progress');
    const resetBtn = container.querySelector('#resetQuiz4Btn');

    let userScores = new Array(questions.length).fill(false);

    function renderQuiz() {
        userScores = new Array(questions.length).fill(false);
        updateScore();

        quizEl.innerHTML = questions.map((q, idx) => `
            <div class="quiz-container interactive-card" style="margin-bottom:16px;">
                <div class="quiz-question">${idx + 1}. ${q.q}</div>
                <div class="quiz-input-row">
                    <input type="text" class="quiz-input" id="q4Input${idx}" placeholder="Jawaban Anda...">
                    <button class="btn btn-primary btn-sm" data-idx="${idx}">Periksa</button>
                </div>
                <div class="quiz-feedback" id="q4Feedback${idx}"></div>
            </div>
        `).join('');

        quizEl.querySelectorAll('button[data-idx]').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.idx);
                const input = quizEl.querySelector(`#q4Input${idx}`);
                const feedback = quizEl.querySelector(`#q4Feedback${idx}`);
                const userAns = input.value.trim().toUpperCase().replace(/[\s\(\)\•]/g, '');
                const correctAns = questions[idx].ans.toUpperCase().replace(/[\s\(\)\•]/g, '');

                if (userAns === correctAns || userAns.includes(correctAns) || correctAns.includes(userAns)) {
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
