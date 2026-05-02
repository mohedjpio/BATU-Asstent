import OpenAI from 'openai';
import { CHUNKS } from '../data/knowledge.js';
import { logger } from '../utils/logger.js';

// ── Knowledge base — built once at startup ────────────────────────────────────
const FULL_KNOWLEDGE = CHUNKS.map((c) => c.text).join('\n\n');

const SYSTEM_PROMPT = `أنت المساعد الذكي الرسمي لجامعة برج العرب التكنولوجية (BATU — Borg El Arab Technological University).

إليك المعلومات الكاملة والرسمية عن الجامعة:
${FULL_KNOWLEDGE}

قواعد صارمة:
1. أجب بناءً على المعلومات أعلاه فقط.
2. اللغة: عربي ← عربي | English ← English.
3. أجب مباشرة وبإيجاز — بلا مقدمات زائدة.
4. اذكر الأرقام الدقيقة (مصروفات، درجات قبول، تواريخ) كما وردت.
5. إذا لم تجد الإجابة: "هذه المعلومة غير متوفرة، تواصل عبر batechu.com/contact"
6. لا تخترع معلومات.`;

// Active Groq models (llama3-70b-8192 is decommissioned)
// Fallback chain: try each until one works
const MODELS = [
  'llama-3.3-70b-versatile',   // best quality
  'llama-3.1-70b-versatile',   // fallback
  'llama3-8b-8192',            // fast fallback
  'gemma2-9b-it',              // last resort
];

// ── Create OpenAI client pointed at Groq ─────────────────────────────────────
const makeClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.length < 20 || apiKey.startsWith('gsk_REPLACE')) {
    throw Object.assign(
      new Error('GROQ_API_KEY غير مضبوط — أضفه في ملف server/.env'),
      { status: 503 }
    );
  }
  return new OpenAI({
    apiKey,
    baseURL: 'https://api.groq.com/openai/v1',
    timeout: 30000,
    maxRetries: 2,
  });
};

// ── Call Groq with model fallback ─────────────────────────────────────────────
const callGroq = async (userMessage, modelIndex = 0) => {
  if (modelIndex >= MODELS.length) {
    throw Object.assign(
      new Error('جميع نماذج الذكاء الاصطناعي غير متاحة حالياً. حاول لاحقاً.'),
      { status: 503 }
    );
  }

  const model = MODELS[modelIndex];
  const client = makeClient();

  try {
    logger.info(`Groq: trying model ${model}`);

    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: userMessage },
      ],
      max_tokens: 700,
      temperature: 0.2,
      top_p: 0.9,
    });

    const text = completion.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error('استجابة فارغة من Groq');

    logger.info('Groq ✓', {
      model: completion.model,
      tokens: completion.usage?.total_tokens,
    });

    return text;

  } catch (err) {
    const status  = err.status || err.response?.status;
    const message = err.message || '';

    logger.error('Groq error', { model, status, message: message.slice(0, 120) });

    // ── Model decommissioned / not found → try next model ─────────────────
    if (
      status === 400 ||
      status === 404 ||
      message.includes('decommissioned') ||
      message.includes('deprecated') ||
      message.includes('not found') ||
      message.includes('does not exist')
    ) {
      logger.warn(`Model ${model} unavailable, trying next...`);
      return callGroq(userMessage, modelIndex + 1);
    }

    // ── Auth ───────────────────────────────────────────────────────────────
    if (status === 401) {
      throw Object.assign(
        new Error('مفتاح GROQ_API_KEY خاطئ — تحقق من console.groq.com'),
        { status: 503 }
      );
    }

    // ── Rate limit ─────────────────────────────────────────────────────────
    if (status === 429) {
      throw Object.assign(
        new Error('تم تجاوز الحد المسموح به. انتظر دقيقة ثم حاول مجدداً.'),
        { status: 429 }
      );
    }

    // ── Network ────────────────────────────────────────────────────────────
    if (!status || err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
      throw Object.assign(
        new Error('تعذّر الاتصال بـ Groq — تأكد من اتصال الإنترنت على الخادم'),
        { status: 503 }
      );
    }

    throw Object.assign(
      new Error(`فشل الاتصال بخدمة الذكاء الاصطناعي (${status || err.code})`),
      { status: 503 }
    );
  }
};

// ── Public API ────────────────────────────────────────────────────────────────
export const generateAnswer = async (question) => {
  const answer = await callGroq(question);
  return answer || 'عذراً، لم يتم توليد إجابة. أعد المحاولة.';
};
