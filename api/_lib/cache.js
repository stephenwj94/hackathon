import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

const CACHE_DIR = '/tmp/news-cache';
const MAX_AGE_MS = 2 * 60 * 60 * 1000; // 2 hours

function ensureCacheDir() {
  try {
    mkdirSync(CACHE_DIR, { recursive: true });
  } catch (e) {
    // already exists
  }
}

export function getCachedNews(slug) {
  try {
    const filePath = join(CACHE_DIR, `${slug}.json`);
    const raw = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    if (Date.now() - data.timestamp > MAX_AGE_MS) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function setCachedNews(slug, articles) {
  ensureCacheDir();
  const filePath = join(CACHE_DIR, `${slug}.json`);
  const data = { slug, articles, timestamp: Date.now() };
  writeFileSync(filePath, JSON.stringify(data));
  return data;
}

export function getAllCachedNews() {
  ensureCacheDir();
  const results = {};
  try {
    const files = readdirSync(CACHE_DIR);
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      try {
        const raw = readFileSync(join(CACHE_DIR, file), 'utf-8');
        const data = JSON.parse(raw);
        results[data.slug] = data;
      } catch {
        // skip corrupt files
      }
    }
  } catch {
    // empty cache
  }
  return results;
}
