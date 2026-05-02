/**
 * Normalize user input for consistent cache keys and matching.
 * - Lowercase
 * - Trim whitespace
 * - Collapse multiple spaces
 * - Remove punctuation noise
 */
export const normalizeText = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[؟?!،,\.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Chunk a long string into overlapping segments for RAG retrieval.
 * @param {string} text
 * @param {number} chunkSize   - words per chunk
 * @param {number} overlap     - words shared between consecutive chunks
 */
export const chunkText = (text, chunkSize = 120, overlap = 20) => {
  const words = text.split(/\s+/);
  const chunks = [];
  let i = 0;
  while (i < words.length) {
    chunks.push(words.slice(i, i + chunkSize).join(' '));
    i += chunkSize - overlap;
  }
  return chunks;
};

/**
 * Strip HTML artifacts left after Cheerio extraction.
 */
export const cleanHtml = (str) =>
  str
    .replace(/\s+/g, ' ')
    .replace(/(\n\s*){3,}/g, '\n\n')
    .trim();
