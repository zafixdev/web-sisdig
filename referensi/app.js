/* ========================================
   MEDIA AJAR INTERAKTIF — SISTEM DIGITAL
   Core Application Logic & Theme Manager
   ======================================== */

// ===== THEME MANAGEMENT =====
function initTheme() {
    const savedTheme = localStorage.getItem('sisdig-theme') || 'dark';
    setTheme(savedTheme);

    const toggleBtn = document.getElementById('themeToggleBtn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sisdig-theme', theme);

    const label = document.getElementById('themeLabel');
    if (label) {
        label.textContent = theme === 'dark' ? 'Mode Gelap' : 'Mode Terang';
    }
}

// Week definitions
const WEEKS = [
    {
        num: 1,
        title: 'Konversi Bilangan',
        status: 'available',
        submenus: [
            { id: 'converter', label: 'Konverter Interaktif' },
            { id: 'dec2bin', label: 'Desimal → Biner' },
            { id: 'bin2hex', label: 'Biner → Heksadesimal' },
            { id: 'bin2oct', label: 'Biner → Oktal' },
            { id: 'bin2dec', label: 'Biner → Desimal' },
            { id: 'quiz1', label: 'Latihan Soal' },
        ]
    },
    {
        num: 2,
        title: 'Bilangan Negatif & Komplemen',
        status: 'available',
        submenus: [
            { id: 'rep-intro', label: 'Representasi Bilangan Negatif' },
            { id: 'sign-mag', label: 'Sign-Magnitude' },
            { id: 'ones-comp', label: "1's Complement" },
            { id: 'twos-comp', label: "2's Complement" },
            { id: 'sub-via-add', label: 'Pengurangan via Penjumlahan' },
            { id: 'overflow', label: 'Overflow' },
            { id: 'quiz2', label: 'Latihan Soal' },
        ]
    },
    {
        num: 3,
        title: 'Aljabar Boolean',
        status: 'available',
        submenus: [
            { id: 'gates', label: 'Gerbang Logika' },
            { id: 'boolean-laws', label: 'Hukum Aljabar Boolean' },
            { id: 'boolean-ops', label: 'Operasi Boolean' },
            { id: 'sop', label: 'Sum of Product (SOP)' },
            { id: 'pos', label: 'Product of Sum (POS)' },
            { id: 'quiz3', label: 'Latihan Soal' },
        ]
    },
    {
        num: 4,
        title: 'Penyederhanaan K-Map',
        status: 'available',
        submenus: [
            { id: 'kmap-intro', label: 'Konsep Dasar K-Map' },
            { id: 'kmap-rules', label: 'Aturan Pengelompokan' },
            { id: 'kmap-2var', label: 'K-Map 2 Variabel' },
            { id: 'kmap-3var', label: 'K-Map 3 Variabel' },
            { id: 'kmap-4var', label: 'K-Map 4 Variabel' },
            { id: 'dont-care', label: "Don't Care Condition" },
            { id: 'quiz4', label: 'Latihan Soal' },
        ]
    },
    { num: 5, title: 'Rangkaian Kombinasional', status: 'coming', submenus: [] },
    { num: 6, title: 'Decoder & Encoder', status: 'coming', submenus: [] },
    { num: 7, title: 'Multiplexer & Demux', status: 'coming', submenus: [] },
    { num: 8, title: 'UTS', status: 'coming', submenus: [] },
    { num: 9, title: 'Flip-Flop', status: 'coming', submenus: [] },
    { num: 10, title: 'Register & Counter', status: 'coming', submenus: [] },
    { num: 11, title: 'Rangkaian Sekuensial', status: 'coming', submenus: [] },
    { num: 12, title: 'Finite State Machine', status: 'coming', submenus: [] },
    { num: 13, title: 'Memori & PLD', status: 'coming', submenus: [] },
    { num: 14, title: 'Review & UAS', status: 'coming', submenus: [] },
];

// State
let activeWeek = null;
let activeSubmenu = null;

// ===== BUILD NAVIGATION =====
function buildNav() {
    const menu = document.getElementById('navMenu');
    menu.innerHTML = '';

    WEEKS.forEach(week => {
        const weekEl = document.createElement('div');
        weekEl.className = 'nav-week';
        weekEl.dataset.week = week.num;

        const hasSubmenus = week.submenus.length > 0;
        const tagClass = week.status === 'available' ? 'available' : 'coming';
        const tagText = week.status === 'available' ? '' : 'Soon';

        weekEl.innerHTML = `
            <button class="nav-week-header" data-week="${week.num}">
                <span class="nav-week-number">${String(week.num).padStart(2,'0')}</span>
                <span class="nav-week-label">${week.title}</span>
                ${tagText ? `<span class="nav-week-tag ${tagClass}">${tagText}</span>` : ''}
                ${hasSubmenus ? '<span class="chevron">▶</span>' : ''}
            </button>
            ${hasSubmenus ? `
                <div class="nav-submenu" id="submenu-${week.num}">
                    ${week.submenus.map(sub => `
                        <button class="nav-sub-item" data-week="${week.num}" data-sub="${sub.id}">${sub.label}</button>
                    `).join('')}
                </div>
            ` : ''}
        `;

        menu.appendChild(weekEl);
    });

    // Event listeners
    menu.querySelectorAll('.nav-week-header').forEach(btn => {
        btn.addEventListener('click', () => handleWeekClick(btn));
    });

    menu.querySelectorAll('.nav-sub-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const weekNum = parseInt(btn.dataset.week);
            const subId = btn.dataset.sub;
            navigateTo(weekNum, subId);
        });
    });
}

function handleWeekClick(btn) {
    const weekNum = parseInt(btn.dataset.week);
    const week = WEEKS.find(w => w.num === weekNum);

    if (week.submenus.length > 0) {
        // Toggle submenu
        const submenu = document.getElementById(`submenu-${weekNum}`);
        const isOpen = submenu.classList.contains('open');

        // Close all submenus
        document.querySelectorAll('.nav-submenu').forEach(s => s.classList.remove('open'));
        document.querySelectorAll('.nav-week-header').forEach(h => h.classList.remove('expanded'));

        if (!isOpen) {
            submenu.classList.add('open');
            btn.classList.add('expanded');
            // Navigate to first submenu
            navigateTo(weekNum, week.submenus[0].id);
        }
    } else if (week.status === 'coming') {
        navigateTo(weekNum, null);
    }
}

function navigateTo(weekNum, subId) {
    activeWeek = weekNum;
    activeSubmenu = subId;

    // Update nav highlights
    document.querySelectorAll('.nav-week-header').forEach(h => h.classList.remove('active'));
    document.querySelectorAll('.nav-sub-item').forEach(s => s.classList.remove('active'));

    const weekHeader = document.querySelector(`.nav-week-header[data-week="${weekNum}"]`);
    if (weekHeader) weekHeader.classList.add('active');

    if (subId) {
        const subItem = document.querySelector(`.nav-sub-item[data-week="${weekNum}"][data-sub="${subId}"]`);
        if (subItem) subItem.classList.add('active');
    }

    // Ensure submenu is open
    const submenu = document.getElementById(`submenu-${weekNum}`);
    if (submenu) {
        submenu.classList.add('open');
        weekHeader.classList.add('expanded');
    }

    // Load content
    loadContent(weekNum, subId);

    // Close mobile sidebar
    document.getElementById('sidebar').classList.remove('open');
}

function loadContent(weekNum, subId) {
    const landing = document.getElementById('landingPage');
    const content = document.getElementById('weekContent');
    const week = WEEKS.find(w => w.num === weekNum);

    landing.style.display = 'none';
    content.style.display = 'block';

    if (week.status === 'coming') {
        content.innerHTML = `
            <div class="coming-soon">
                <div class="cs-icon">🚧</div>
                <h3>Minggu ${weekNum}: ${week.title}</h3>
                <p>Materi ini akan segera tersedia. Nantikan update berikutnya!</p>
            </div>
        `;
        return;
    }

    // Load week content from registered renderers
    const renderer = weekRenderers[weekNum];
    if (renderer) {
        renderer(content, subId);
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Registry for week content renderers
const weekRenderers = {};

function registerWeek(num, renderer) {
    weekRenderers[num] = renderer;
}

// ===== MOBILE MENU =====
document.getElementById('mobileMenuBtn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
});

// Close sidebar on outside click (mobile)
document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('mobileMenuBtn');
    if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
        sidebar.classList.remove('open');
    }
});

// ===== UTILITY FUNCTIONS =====
function decToBin(dec) {
    if (dec === 0) return '0';
    let result = '';
    let n = Math.abs(Math.floor(dec));
    while (n > 0) {
        result = (n % 2) + result;
        n = Math.floor(n / 2);
    }
    return result;
}

function binToDec(bin) {
    let result = 0;
    for (let i = 0; i < bin.length; i++) {
        result += parseInt(bin[bin.length - 1 - i]) * Math.pow(2, i);
    }
    return result;
}

function binToHex(bin) {
    // Pad to multiple of 4
    while (bin.length % 4 !== 0) bin = '0' + bin;
    let hex = '';
    for (let i = 0; i < bin.length; i += 4) {
        const group = bin.substring(i, i + 4);
        hex += parseInt(group, 2).toString(16).toUpperCase();
    }
    return hex;
}

function binToOct(bin) {
    // Pad to multiple of 3
    while (bin.length % 3 !== 0) bin = '0' + bin;
    let oct = '';
    for (let i = 0; i < bin.length; i += 3) {
        const group = bin.substring(i, i + 3);
        oct += parseInt(group, 2).toString(8);
    }
    return oct;
}

function hexToBin(hex) {
    let bin = '';
    for (const c of hex.toUpperCase()) {
        bin += parseInt(c, 16).toString(2).padStart(4, '0');
    }
    // Remove leading zeros but keep at least one
    return bin.replace(/^0+/, '') || '0';
}

function octToBin(oct) {
    let bin = '';
    for (const c of oct) {
        bin += parseInt(c, 8).toString(2).padStart(3, '0');
    }
    return bin.replace(/^0+/, '') || '0';
}

// ===== INIT =====
initTheme();
buildNav();
