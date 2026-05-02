import NodeCache from 'node-cache';

const TTL = parseInt(process.env.CACHE_TTL_SECONDS || '3600', 10);

// Q&A answer cache — keyed by normalized question
const answerCache = new NodeCache({ stdTTL: TTL, useClones: false });

export const cache = {
  getAnswer: (key) => answerCache.get(key) ?? null,
  setAnswer: (key, value) => answerCache.set(key, value),
  flush: () => answerCache.flushAll(),
  stats: () => answerCache.getStats(),
};
