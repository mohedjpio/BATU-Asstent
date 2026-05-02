import { CHUNKS, BRANDING, NAV_SECTIONS } from '../data/knowledge.js';
import { normalizeText } from '../utils/textUtils.js';
import { logger } from '../utils/logger.js';

const TOP_K = 6;

// ─── Keyword scorer (TF-IDF inspired) ────────────────────────────────────────

const scoreChunk = (chunk, queryWords, rawQuery) => {
  const chunkLower = normalizeText(chunk.text);
  let score = 0;

  // Exact phrase match — strongest signal
  if (chunkLower.includes(rawQuery)) score += 12;

  // Partial phrase (first half of query)
  const half = Math.floor(rawQuery.length / 2);
  if (half > 3 && chunkLower.includes(rawQuery.slice(0, half))) score += 5;

  // Topic keyword match (topic field is a strong hint)
  const topicLower = normalizeText(chunk.topic || '');
  for (const word of queryWords) {
    if (word.length < 2) continue;
    if (topicLower.includes(word)) score += 3;
  }

  // Term frequency in body
  let matched = 0;
  for (const word of queryWords) {
    if (word.length < 2) continue;
    const re = new RegExp(word, 'g');
    const hits = chunkLower.match(re);
    if (hits) {
      score += hits.length * 0.6;
      matched++;
    }
  }

  // Coverage bonus
  if (queryWords.length > 0) score += (matched / queryWords.length) * 4;

  return score;
};

// ─── Public: retrieve context for a query ────────────────────────────────────

export const retrieveContext = (query) => {
  const normalized = normalizeText(query);
  const queryWords = normalized.split(' ').filter((w) => w.length >= 2);

  const scored = CHUNKS
    .map((chunk) => ({ ...chunk, score: scoreChunk(chunk, queryWords, normalized) }))
    .sort((a, b) => b.score - a.score);

  // Always take top-K regardless of score — we have verified data, never leave context empty
  const topChunks = scored.slice(0, TOP_K);

  const seen = new Set();
  let context = '';
  for (const chunk of topChunks) {
    const text = chunk.text.trim();
    if (!seen.has(text)) {
      seen.add(text);
      context += text + '\n\n';
    }
  }

  logger.debug('RAG: context built', {
    query: normalized,
    topScore: scored[0]?.score?.toFixed(2),
    chunks: topChunks.length,
  });

  return { context: context.trim(), branding: BRANDING, navSections: NAV_SECTIONS };
};
