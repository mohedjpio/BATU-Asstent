import { normalizeText } from '../utils/textUtils.js';
import { cache } from '../cache/cache.service.js';
import { generateAnswer } from '../services/ai.service.js';
import { BRANDING, NAV_SECTIONS } from '../data/knowledge.js';
import { logger } from '../utils/logger.js';

// ─── POST /api/chat ───────────────────────────────────────────────────────────
export const handleChat = async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: { message: 'message is required', code: 'INVALID_INPUT' } });
  }

  const trimmed = message.trim();
  if (trimmed.length < 2 || trimmed.length > 600) {
    return res.status(400).json({ error: { message: 'Message must be 2–600 characters', code: 'INVALID_LENGTH' } });
  }

  const cacheKey = normalizeText(trimmed);

  // Cache hit
  const cached = cache.getAnswer(cacheKey);
  if (cached) {
    logger.debug('Cache hit', { key: cacheKey.slice(0, 40) });
    return res.json({ answer: cached, cached: true });
  }

  // Direct Groq call — full KB is embedded in the system prompt
  const answer = await generateAnswer(trimmed);

  cache.setAnswer(cacheKey, answer);
  return res.json({ answer, cached: false });
};

// ─── GET /api/chat/branding ───────────────────────────────────────────────────
export const getBranding = (_req, res) => {
  res.json({ branding: BRANDING, navSections: NAV_SECTIONS });
};
