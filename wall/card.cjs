// Parses and validates a participant card (participants/<username>.md).
// Shared by the PR validator (.github/workflows/validate-pr.yml) and the wall builder.
// No dependencies on purpose: the format is tiny and fixed.
//
// Expected format:
//
//   ---
//   name: Your Name
//   top4:
//     - Movie One
//     - Movie Two
//     - Movie Three
//     - Movie Four
//   ---
//   Optional one-liner.

const LIMITS = { name: 40, movie: 60, line: 140 };

function clean(value) {
  let v = value.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1).trim();
  }
  return v;
}

function parseCard(text) {
  const errors = [];
  const src = text.replace(/^﻿/, '').replace(/\r\n?/g, '\n');
  const m = src.match(/^---\n([\s\S]*?)\n---[ \t]*(?:\n|$)([\s\S]*)$/);
  if (!m) {
    return {
      ok: false,
      errors: ['File must start with a `---` line, then your fields, then another `---` line. Copy `participants/exitflynn.md` and edit it.'],
      data: null,
    };
  }

  const [, head, body] = m;
  let name = null;
  const top4 = [];
  let inTop4 = false;

  for (const raw of head.split('\n')) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    const item = raw.match(/^\s+-\s*(.*)$/) || raw.match(/^-\s+(.*)$/);
    if (item && inTop4) {
      top4.push(clean(item[1]));
      continue;
    }
    const kv = raw.match(/^([A-Za-z0-9_]+)\s*:\s*(.*)$/);
    if (!kv) {
      errors.push(`Could not read this line: \`${raw.trim()}\``);
      continue;
    }
    const key = kv[1].toLowerCase();
    inTop4 = key === 'top4';
    if (key === 'name') name = clean(kv[2]);
    else if (key === 'top4') {
      if (kv[2].trim()) errors.push('Put each movie on its own line under `top4:`, starting with `  - `.');
    } else errors.push(`Unknown field \`${kv[1]}\`. Only \`name\` and \`top4\` are allowed.`);
  }

  if (!name) errors.push('Missing `name:`.');
  else if (name.length > LIMITS.name) errors.push(`\`name\` is too long (max ${LIMITS.name} characters).`);

  if (top4.length !== 4) errors.push(`\`top4\` needs exactly 4 movies, found ${top4.length}.`);
  top4.forEach((t, i) => {
    if (!t) errors.push(`Movie #${i + 1} is empty.`);
    else if (t.length > LIMITS.movie) errors.push(`Movie #${i + 1} is too long (max ${LIMITS.movie} characters).`);
  });

  const line = body.trim().replace(/\s+/g, ' ');
  if (line.length > LIMITS.line) errors.push(`Your one-liner is too long (max ${LIMITS.line} characters).`);

  return { ok: errors.length === 0, errors, data: { name, top4, line } };
}

module.exports = { parseCard, LIMITS };
