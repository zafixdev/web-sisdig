// build/split.mjs — memecah index.html (14 minggu dalam 1 halaman) menjadi minggu1..14.html
// Jalankan: node build/split.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');

const WEEK_TITLES = {
  1: 'Pendahuluan & Konversi Bilangan',
  2: 'Bilangan Negatif & Operasi Biner',
  3: 'Aljabar Boolean & Gerbang Logika',
  4: 'Penyederhanaan Karnaugh Map',
  5: 'Adder & Subtractor',
  6: 'NAND/NOR & Multiplexer',
  7: 'Decoder, Encoder & 7-Segmen',
  8: 'Latch, Flip-Flop & Counter',
  9: 'Register',
  10: 'Machine State (FSM)',
  11: 'Memori',
  12: 'ADC/DAC & PLD',
  13: 'Proyek Mini Sistem Digital',
  14: 'Review Semester & Tryout UAS'
};

const re = /<section class="week-content[^"]*" id="week-(\d+)">([\s\S]*?)<\/section>/g;
let m, count = 0;
while ((m = re.exec(html))) {
  const n = Number(m[1]);
  const inner = m[2].replace(/^\n/, '').replace(/\s+$/, '');
  const title = WEEK_TITLES[n] || `Minggu ${n}`;
  const page = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minggu ${n}: ${title} — Media Ajar Sistem Digital</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body data-week="${n}">
    <div id="app-header"></div>
    <div id="app-nav"></div>

    <main class="main-content">
        <section class="week-content active" id="week-${n}">
${inner}
        </section>
    </main>

    <footer class="footer" id="app-footer"></footer>

    <script src="js/shell.js"></script>
    <script src="js/script.js"></script>
    <script src="js/signed.js"></script>
    <script src="js/boolean.js"></script>
    <script src="js/kmap.js"></script>
    <script src="js/comb.js"></script>
    <script src="js/seq.js"></script>
    <script src="js/svg-kit.js"></script>
    <script src="js/learn.js"></script>
</body>
</html>
`;
  writeFileSync(join(root, `minggu${n}.html`), page, 'utf8');
  count++;
}

console.log(`Selesai: ${count} halaman minggu ditulis.`);
