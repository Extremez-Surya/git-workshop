#!/usr/bin/env node
// Builds the wall: reads participants/*.md, writes <out>/index.html + <out>/cards.json.
// Usage: node wall/build.cjs [outDir]   (default: dist/wall)
//
// Posters: set TMDB_API_KEY (TMDB v3 API key or v4 read access token) to look up
// each movie on TMDB. Without it, the wall shows coloured text tiles instead.
// Lookups are cached in wall/.cache/tmdb.json (restored between CI runs by actions/cache).

const fs = require('fs');
const path = require('path');
const { parseCard } = require('./card.cjs');

const root = path.resolve(__dirname, '..');
const outDir = path.resolve(root, process.argv[2] || 'dist/wall');
const dir = path.join(root, 'participants');
const cacheFile = path.join(__dirname, '.cache', 'tmdb.json');
const KEY = process.env.TMDB_API_KEY || '';

const norm = (t) => t.toLowerCase().replace(/[^a-z0-9]/g, '');

async function tmdbSearch(query) {
  const url = new URL('https://api.themoviedb.org/3/search/movie');
  url.searchParams.set('query', query);
  url.searchParams.set('include_adult', 'false');
  const headers = { accept: 'application/json' };
  // v4 read tokens are long JWTs; v3 keys are 32 hex chars.
  if (KEY.length > 40) headers.authorization = `Bearer ${KEY}`;
  else url.searchParams.set('api_key', KEY);
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  const results = (await res.json()).results || [];
  // Prefer an exact title match ("Up" → Up (2009), not Tied Up), else TMDB's first result.
  const top = results.find((r) => norm(r.title) === norm(query) || norm(r.original_title || '') === norm(query)) || results[0];
  if (!top) return null;
  return {
    id: top.id,
    title: top.title,
    year: (top.release_date || '').slice(0, 4),
    poster: top.poster_path ? `https://image.tmdb.org/t/p/w342${top.poster_path}` : null,
  };
}

async function main() {
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

  // Resolve every distinct typed title to a movie (TMDB if available).
  let cache = {};
  try { cache = JSON.parse(fs.readFileSync(cacheFile, 'utf8')); } catch {}
  const typed = [...new Set(cards.flatMap((c) => c.top4))];
  const resolved = {}; // typed title -> movie key
  const movies = {}; // movie key -> { title, year, poster }
  let lookups = 0;
  let failures = 0;

  const queue = [...typed];
  async function worker() {
    while (queue.length) {
      const t = queue.shift();
      const n = norm(t);
      let m = null;
      if (KEY) {
        if (n in cache) m = cache[n];
        else {
          try {
            m = await tmdbSearch(t).catch(() => tmdbSearch(t)); // one retry
            cache[n] = m;
            lookups++;
          } catch (e) {
            failures++;
            console.warn(`tmdb: "${t}": ${e.message}`);
          }
        }
      }
      const key = m ? `tmdb:${m.id}` : `t:${n}`;
      resolved[t] = key;
      if (!movies[key]) movies[key] = m ? { title: m.title, year: m.year, poster: m.poster } : { title: t, year: '', poster: null };
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker));

  // Top 10 by number of people who picked it.
  const counts = new Map();
  for (const c of cards) for (const k of new Set(c.top4.map((t) => resolved[t]))) counts.set(k, (counts.get(k) || 0) + 1);
  const top = [...counts]
    .sort((a, b) => b[1] - a[1] || movies[a[0]].title.localeCompare(movies[b[0]].title))
    .slice(0, 10)
    .map(([key, n]) => ({ key, n }));

  const out = cards.map((c) => ({ ...c, top4: c.top4.map((t) => ({ typed: t, key: resolved[t] })) }));

  if (KEY) {
    fs.mkdirSync(path.dirname(cacheFile), { recursive: true });
    fs.writeFileSync(cacheFile, JSON.stringify(cache));
  }
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'cards.json'), JSON.stringify({ cards: out, movies, top, tmdb: Boolean(KEY) }, null, 2));
  fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(outDir, 'index.html'));
  console.log(
    `wall: ${cards.length} cards, ${Object.keys(movies).length} movies` +
      (KEY ? `, ${lookups} TMDB lookups, ${failures} failed` : ', no TMDB_API_KEY (text tiles)') +
      ` → ${path.relative(root, outDir)}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
