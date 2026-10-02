// ===== DOM Elements =====
const tabBtns = document.querySelectorAll('.tab-btn');
const weekContents = document.querySelectorAll('.week-content');
const numberInput = document.getElementById('number-input');
const fromBase = document.getElementById('from-base');
const toBase = document.getElementById('to-base');
const swapBtn = document.getElementById('swap-btn');
const convertBtn = document.getElementById('convert-btn');
const resetBtn = document.getElementById('reset-btn');
const copyBtn = document.getElementById('copy-btn');
const resultDisplay = document.getElementById('result-display');
const stepsContent = document.getElementById('steps-content');
const bitGroups = document.getElementById('bit-groups');
const exampleCards = document.querySelectorAll('.example-card');

// ===== Tab Navigation =====
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const week = btn.dataset.week;

        tabBtns.forEach(b => b.classList.remove('active'));
        weekContents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(`week-${week}`).classList.add('active');
    });
});

// ===== Conversion Functions =====
const converters = {
    // Validate input based on base
    validate(input, base) {
        const validators = {
            binary: /^[01]+$/,
            octal: /^[0-7]+$/,
            decimal: /^[0-9]+$/,
            hexadecimal: /^[0-9A-Fa-f]+$/
        };
        return validators[base].test(input);
    },

    // Convert to binary (central method)
    toBinary(value, fromBase) {
        switch (fromBase) {
            case 'binary':
                return value;
            case 'octal':
                return this.octalToBinary(value);
            case 'decimal':
                return this.decimalToBinary(value);
            case 'hexadecimal':
                return this.hexToBinary(value);
            default:
                throw new Error('Basis tidak valid');
        }
    },

    // Convert from binary to target base
    fromBinary(binary, toBase) {
        switch (toBase) {
            case 'binary':
                return binary;
            case 'octal':
                return this.binaryToOctal(binary);
            case 'decimal':
                return this.binaryToDecimal(binary);
            case 'hexadecimal':
                return this.binaryToHex(binary);
            default:
                throw new Error('Basis tidak valid');
        }
    },

    // Octal to Binary
    octalToBinary(octal) {
        const map = {
            '0': '000', '1': '001', '2': '010', '3': '011',
            '4': '100', '5': '101', '6': '110', '7': '111'
        };
        return octal.split('').map(d => map[d]).join('');
    },

    // Decimal to Binary
    decimalToBinary(decimal) {
        let num = parseInt(decimal, 10);
        if (num === 0) return '0';
        let binary = '';
        while (num > 0) {
            binary = (num % 2) + binary;
            num = Math.floor(num / 2);
        }
        return binary;
    },

    // Hex to Binary
    hexToBinary(hex) {
        const map = {
            '0': '0000', '1': '0001', '2': '0010', '3': '0011',
            '4': '0100', '5': '0101', '6': '0110', '7': '0111',
            '8': '1000', '9': '1001', 'A': '1010', 'B': '1011',
            'C': '1100', 'D': '1101', 'E': '1110', 'F': '1111'
        };
        return hex.toUpperCase().split('').map(d => map[d]).join('');
    },

    // Binary to Octal (group by 3)
    binaryToOctal(binary) {
        const padded = this.padBinary(binary, 3);
        const groups = this.groupBinary(padded, 3);
        return groups.map(g => parseInt(g, 2).toString()).join('');
    },

    // Binary to Decimal
    binaryToDecimal(binary) {
        let decimal = 0;
        for (let i = 0; i < binary.length; i++) {
            decimal += parseInt(binary[i]) * Math.pow(2, binary.length - 1 - i);
        }
        return decimal.toString();
    },

    // Binary to Hex (group by 4)
    binaryToHex(binary) {
        const padded = this.padBinary(binary, 4);
        const groups = this.groupBinary(padded, 4);
        return groups.map(g => parseInt(g, 2).toString(16).toUpperCase()).join('');
    },

    // Pad binary to multiple of group size
    padBinary(binary, groupSize) {
        const remainder = binary.length % groupSize;
        if (remainder === 0) return binary;
        return '0'.repeat(groupSize - remainder) + binary;
    },

    // Group binary into chunks
    groupBinary(binary, groupSize) {
        const groups = [];
        for (let i = 0; i < binary.length; i += groupSize) {
            groups.push(binary.substr(i, groupSize));
        }
        return groups;
    }
};

// ===== Step-by-Step Generator =====
function generateSteps(input, fromBase, toBase) {
    const steps = [];
    const inputUpper = input.toUpperCase();

    // Step 1: Validate
    if (!converters.validate(inputUpper, fromBase)) {
        return { error: true, message: `Input tidak valid untuk basis ${getBaseName(fromBase)}!` };
    }

    // Step 2: Convert to binary (central)
    steps.push({
        number: 1,
        text: `Konversi ${inputUpper} (basis ${getBaseName(fromBase)}) ke biner`,
        code: ''
    });

    const binary = converters.toBinary(inputUpper, fromBase);
    steps.push({
        number: 2,
        text: `Hasil konversi ke biner:`,
        code: `${inputUpper}₂ = ${binary}`,
        highlight: true
    });

    // Step 3: Convert from binary to target
    if (toBase !== 'binary') {
        let groupInfo = '';
        let groupedBinary = binary;

        if (toBase === 'hexadecimal') {
            groupedBinary = converters.padBinary(binary, 4);
            const groups = converters.groupBinary(groupedBinary, 4);
            groupInfo = `Pengelompokan 4 bit: ${groups.join(' | ')}`;
        } else if (toBase === 'octal') {
            groupedBinary = converters.padBinary(binary, 3);
            const groups = converters.groupBinary(groupedBinary, 3);
            groupInfo = `Pengelompokan 3 bit: ${groups.join(' | ')}`;
        }

        steps.push({
            number: 3,
            text: groupInfo || `Konversi biner ke ${getBaseName(toBase)}`,
            code: '',
            highlight: true
        });
    }

    // Step 4: Final result
    const result = converters.fromBinary(binary, toBase);
    steps.push({
        number: steps.length + 1,
        text: `Hasil akhir konversi:`,
        code: `${inputUpper} = ${result}`,
        highlight: true
    });

    return { steps, binary, result };
}

// ===== Visualization Generator =====
function generateVisualization(binary, toBase) {
    bitGroups.innerHTML = '';

    if (toBase === 'binary' || toBase === 'decimal') {
        // Show all bits
        const group = document.createElement('div');
        group.className = 'bit-group';
        binary.split('').forEach(bit => {
            const bitBox = document.createElement('div');
            bitBox.className = `bit-box bit-${bit}`;
            bitBox.textContent = bit;
            group.appendChild(bitBox);
        });
        bitGroups.appendChild(group);
        return;
    }

    const groupSize = toBase === 'hexadecimal' ? 4 : 3;
    const padded = converters.padBinary(binary, groupSize);
    const groups = converters.groupBinary(padded, groupSize);
    const groupClass = toBase === 'hexadecimal' ? 'hex-group' : 'octal-group';

    groups.forEach((g, index) => {
        // Add separator between groups
        if (index > 0) {
            const separator = document.createElement('div');
            separator.className = 'group-separator';
            separator.textContent = '│';
            bitGroups.appendChild(separator);
        }

        // Create group container
        const groupDiv = document.createElement('div');
        groupDiv.className = `bit-group ${groupClass}`;

        // Add bit boxes
        g.split('').forEach(bit => {
            const bitBox = document.createElement('div');
            bitBox.className = `bit-box bit-${bit}`;
            bitBox.textContent = bit;
            groupDiv.appendChild(bitBox);
        });

        // Add arrow
        const arrow = document.createElement('div');
        arrow.className = 'group-arrow';
        arrow.textContent = '→';
        groupDiv.appendChild(arrow);

        // Add result
        const result = document.createElement('div');
        result.className = 'group-result';
        result.textContent = parseInt(g, 2).toString(toBase === 'hexadecimal' ? 16 : 8).toUpperCase();
        groupDiv.appendChild(result);

        bitGroups.appendChild(groupDiv);
    });
}

// ===== Helper Functions =====
function getBaseName(base) {
    const names = {
        binary: 'Biner',
        octal: 'Oktal',
        decimal: 'Desimal',
        hexadecimal: 'Heksadesimal'
    };
    return names[base] || base;
}

function showSteps(steps) {
    stepsContent.innerHTML = '';

    steps.forEach((step, index) => {
        setTimeout(() => {
            const stepDiv = document.createElement('div');
            stepDiv.className = `step-item ${step.highlight ? 'highlight' : ''}`;
            stepDiv.innerHTML = `
                <div class="step-number">Langkah ${step.number}</div>
                <div class="step-text">${step.text}</div>
                ${step.code ? `<div class="step-code">${step.code}</div>` : ''}
            `;
            stepsContent.appendChild(stepDiv);
        }, index * 150);
    });
}

function showError(message) {
    numberInput.classList.add('input-error');
    resultDisplay.textContent = 'Error!';
    resultDisplay.style.color = '#E74C3C';

    stepsContent.innerHTML = `
        <div class="step-item" style="border-left-color: #E74C3C;">
            <div class="step-number" style="color: #E74C3C;">Error</div>
            <div class="step-text">${message}</div>
        </div>
    `;

    setTimeout(() => {
        numberInput.classList.remove('input-error');
    }, 2000);
}

// ===== Main Conversion Function =====
function performConversion() {
    const input = numberInput.value.trim();
    const from = fromBase.value;
    const to = toBase.value;

    if (!input) {
        showError('Masukkan bilangan terlebih dahulu!');
        return;
    }

    const result = generateSteps(input, from, to);

    if (result.error) {
        showError(result.message);
        return;
    }

    // Display steps
    showSteps(result.steps);

    // Display result
    resultDisplay.textContent = result.result;
    resultDisplay.style.color = 'var(--primary-color)';

    // Generate visualization
    generateVisualization(result.binary, to);
}

// ===== Event Listeners =====
swapBtn.addEventListener('click', () => {
    const fromVal = fromBase.value;
    const toVal = toBase.value;
    fromBase.value = toVal;
    toBase.value = fromVal;
});

convertBtn.addEventListener('click', performConversion);

resetBtn.addEventListener('click', () => {
    numberInput.value = '';
    fromBase.value = 'binary';
    toBase.value = 'hexadecimal';
    resultDisplay.textContent = '-';
    resultDisplay.style.color = 'var(--primary-color)';
    stepsContent.innerHTML = '<p class="placeholder-text">Masukkan bilangan dan klik "Konversi" untuk melihat langkah-langkahnya.</p>';
    bitGroups.innerHTML = '';
    numberInput.classList.remove('input-error');
});

copyBtn.addEventListener('click', () => {
    const text = resultDisplay.textContent;
    if (text && text !== '-' && text !== 'Error!') {
        navigator.clipboard.writeText(text).then(() => {
            copyBtn.textContent = '✓';
            setTimeout(() => {
                copyBtn.textContent = ' ';
            }, 1500);
        });
    }
});

// Enter key to convert
numberInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performConversion();
    }
});

// Example cards
exampleCards.forEach(card => {
    card.querySelector('.btn-example').addEventListener('click', () => {
        const example = card.dataset.example;
        const from = card.dataset.from || 'binary';

        numberInput.value = example;
        fromBase.value = from;

        // Set appropriate target base
        if (from === 'binary') {
            toBase.value = 'hexadecimal';
        } else {
            toBase.value = 'binary';
        }

        performConversion();

        // Scroll to converter
        document.querySelector('.converter-section').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// ===== Theme toggle (cream / dark) =====
(function initTheme() {
    const btn = document.getElementById('theme-toggle');
    const root = document.documentElement;
    const saved = localStorage.getItem('sisdig-theme');
    if (saved === 'dark') root.setAttribute('data-theme', 'dark');
    const paint = () => { if (btn) btn.textContent = root.getAttribute('data-theme') === 'dark' ? '☀️ Light' : '🌙 Dark'; };
    paint();
    btn?.addEventListener('click', () => {
        const dark = root.getAttribute('data-theme') === 'dark';
        if (dark) { root.removeAttribute('data-theme'); localStorage.setItem('sisdig-theme', 'light'); }
        else { root.setAttribute('data-theme', 'dark'); localStorage.setItem('sisdig-theme', 'dark'); }
        paint();
    });
})();

// Real-time conversion (optional - uncomment if desired)
// numberInput.addEventListener('input', () => {
//     if (numberInput.value.trim()) {
//         performConversion();
//     }
// });
