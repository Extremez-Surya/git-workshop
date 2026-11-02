#!/usr/bin/env node
// Builds the wall: reads participants/*.md, writes <out>/index.html + <out>/cards.json.
// Usage: node wall/build.cjs [outDir]   (default: dist/wall)

const fs = require('fs');
const path = require('path');
const { parseCard } = require('./card.cjs');

const root = path.resolve(__dirname, '..');
const outDir = path.resolve(root, process.argv[2] || 'dist/wall');
const dir = path.join(root, 'participants');

const cards = [];
for (const file of fs.readdirSync(dir).sort((a, b) => a.localeCompare(b))) {
  if (!file.endsWith('.md')) continue;
  const user = file.slice(0, -3);
  const { ok, errors, data } = parseCard(fs.readFileSync(path.join(dir, file), 'utf8'));
  if (!ok) {
    console.warn(`skip ${file}: ${errors.join(' ')}`);
    continue;
  }
  cards.push({ user, ...data });
}

// Most-picked movies, matching titles loosely ("Spirited away" == "Spirited Away!").
const counts = new Map();
for (const c of cards) {
  for (const t of new Set(c.top4)) {
    const key = t.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!key) continue;
    const e = counts.get(key) || { n: 0, spellings: new Map() };
    e.n += 1;
    e.spellings.set(t, (e.spellings.get(t) || 0) + 1);
    counts.set(key, e);
  }
}
// Show the most common spelling; on a tie, the one with more capitals ("Interstellar" over "interstellar").
const caps = (s) => (s.match(/[A-Z]/g) || []).length;
const top = [...counts.values()]
  .filter((e) => e.n > 1)
  .sort((a, b) => b.n - a.n)
  .slice(0, 5)
  .map((e) => ({
    title: [...e.spellings].sort((a, b) => b[1] - a[1] || caps(b[0]) - caps(a[0]) || a[0].length - b[0].length)[0][0],
    n: e.n,
  }));

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'cards.json'), JSON.stringify({ cards, top }, null, 2));
fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(outDir, 'index.html'));
console.log(`wall: ${cards.length} cards → ${path.relative(root, outDir)}`);
