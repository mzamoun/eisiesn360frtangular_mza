#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const srcRoot = path.join(repoRoot, 'src', 'app');
const baselinePath = path.join(repoRoot, '.i18n-hardcoded-baseline.json');

const args = new Set(process.argv.slice(2));
const updateBaseline = args.has('--update-baseline');

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'coverage']);
const TEXT_NODE_REGEX = />([^<]*)</g;
const ATTR_REGEX = /\b(?:placeholder|title|aria-label|alt|matTooltip)\s*=\s*"([^"]*)"/g;
const LETTER_REGEX = /[A-Za-zÀ-ÿ]/;

function toRelative(filePath) {
  return path.relative(repoRoot, filePath).replace(/\\/g, '/');
}

function lineFromIndex(content, index) {
  let line = 1;
  for (let i = 0; i < index; i += 1) {
    if (content.charCodeAt(i) === 10) line += 1;
  }
  return line;
}

function normalizeSnippet(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function shouldIgnoreText(value) {
  const v = normalizeSnippet(value);
  if (!v) return true;
  if (!LETTER_REGEX.test(v)) return true;
  if (v.includes('{{') || v.includes('}}')) return true;
  if (v.includes('utils.tr(')) return true;
  if (/^(&times;|x|X|ok|OK|todo)$/i.test(v)) return true;
  if (/^[0-9\s:./#,+-]+$/.test(v)) return true;
  return false;
}

function sanitizeHtml(content) {
  return content.replace(/<!--[\s\S]*?-->/g, (m) => '\n'.repeat((m.match(/\n/g) || []).length));
}

async function walkHtmlFiles(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) {
        out.push(...await walkHtmlFiles(fullPath));
      }
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.html')) {
      out.push(fullPath);
    }
  }
  return out;
}

async function collectViolations() {
  const htmlFiles = await walkHtmlFiles(srcRoot);
  const violations = [];

  for (const filePath of htmlFiles) {
    const raw = await fs.readFile(filePath, 'utf8');
    const content = sanitizeHtml(raw);

    for (const match of content.matchAll(TEXT_NODE_REGEX)) {
      const text = match[1] || '';
      if (shouldIgnoreText(text)) continue;

      const line = lineFromIndex(content, match.index || 0);
      const snippet = normalizeSnippet(text);
      violations.push(`${toRelative(filePath)}:${line}:text:${snippet}`);
    }

    for (const match of content.matchAll(ATTR_REGEX)) {
      const value = match[1] || '';
      if (shouldIgnoreText(value)) continue;

      const line = lineFromIndex(content, match.index || 0);
      const snippet = normalizeSnippet(value);
      violations.push(`${toRelative(filePath)}:${line}:attr:${snippet}`);
    }
  }

  return Array.from(new Set(violations)).sort();
}

async function readBaseline() {
  try {
    const raw = await fs.readFile(baselinePath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeBaseline(items) {
  await fs.writeFile(baselinePath, `${JSON.stringify(items, null, 2)}\n`, 'utf8');
}

(async () => {
  const current = await collectViolations();

  if (updateBaseline) {
    await writeBaseline(current);
    console.log(`[i18n-hardcoded] Baseline updated with ${current.length} entries: ${toRelative(baselinePath)}`);
    process.exit(0);
  }

  const baseline = await readBaseline();
  const baselineSet = new Set(baseline);
  const newViolations = current.filter((item) => !baselineSet.has(item));

  console.log(`[i18n-hardcoded] Current matches: ${current.length}, baseline: ${baseline.length}, new: ${newViolations.length}`);

  if (newViolations.length > 0) {
    console.error('[i18n-hardcoded] New hardcoded texts detected:');
    for (const v of newViolations) {
      console.error(`  - ${v}`);
    }
    console.error(`[i18n-hardcoded] If intended, refresh baseline with: node scripts/check-i18n-hardcoded.mjs --update-baseline`);
    process.exit(1);
  }
})();
