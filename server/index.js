import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { chatRouter } from './routes/chat.routes.js';
import { errorHandler } from './utils/errorHandler.js';
import { logger } from './utils/logger.js';

// ─── Startup Validation ───────────────────────────────────────────────────────
const key = process.env.GROQ_API_KEY || '';
if (!key || key.startsWith('gsk_REPLACE') || key === 'your_groq_api_key_here') {
  console.error('\n╔══════════════════════════════════════════════════════╗');
  console.error('║  ❌  GROQ_API_KEY is missing or invalid              ║');
  console.error('║                                                      ║');
  console.error('║  Fix:                                                ║');
  console.error('║  1. Create server/.env  (copy from .env.example)    ║');
  console.error('║  2. Get free key → https://console.groq.com         ║');
  console.error('║  3. Set GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx           ║');
  console.error('╚══════════════════════════════════════════════════════╝\n');
  process.exit(1);
}

logger.info('GROQ_API_KEY loaded', {
  prefix: key.slice(0, 8) + '...',
  len: key.length,
  model: process.env.GROQ_MODEL || 'llama3-70b-8192',
});

const app = express();
const PORT = process.env.PORT || 3001;
const isDev = process.env.NODE_ENV !== 'production';

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  // In dev allow all origins; in prod restrict to CLIENT_ORIGIN
  origin: isDev ? true : (process.env.CLIENT_ORIGIN || 'http://localhost:5173'),
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json({ limit: '10kb' }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/chat', chatRouter);

// Debug endpoint — exposes safe info to diagnose issues without exposing the key
app.get('/api/debug', async (_req, res) => {
  const apiKey = process.env.GROQ_API_KEY || '';
  const info = {
    keyLoaded: apiKey.length > 10,
    keyPrefix: apiKey.slice(0, 8) + '...',
    keyLength: apiKey.length,
    model: process.env.GROQ_MODEL || 'llama3-70b-8192',
    nodeVersion: process.version,
    platform: process.platform,
  };

  // Quick connectivity test to Groq
  try {
    const { default: axios } = await import('axios');
    await axios.get('https://api.groq.com', { timeout: 5000 });
    info.groqReachable = true;
  } catch (e) {
    info.groqReachable = false;
    info.groqError = e.code || e.message;
  }

  res.json(info);
});

app.get('/health', (_req, res) => res.json({ status: 'ok', ts: Date.now() }));

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  logger.info(`Server ready → http://localhost:${PORT}`);
  logger.info('Debug info → http://localhost:' + PORT + '/api/debug');
});

export default app;
