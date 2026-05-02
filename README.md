# BATU AI Chatbot
**المساعد الذكي لجامعة برج العرب التكنولوجية**

A production-grade AI chatbot for Borg El Arab Technological University — built with Express, React/Vite, Groq LLM, and a lightweight RAG pipeline.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Client (React/Vite)                                 │
│  ChatHeader · ChatContainer · MessageBubble          │
│  ChatInput · TypingIndicator · WelcomeSuggestions    │
└─────────────┬───────────────────────────────────────┘
              │ HTTP /api
┌─────────────▼───────────────────────────────────────┐
│  Express Server                                      │
│  ┌─────────┐  ┌──────────┐  ┌────────────────────┐  │
│  │ Scraper │  │ RAG      │  │ AI Service (Groq)  │  │
│  │ Cheerio │→ │ keyword  │→ │ llama3-70b-8192    │  │
│  │ node-cache│ │ scorer   │  │ retry + anti-halluc│  │
│  └─────────┘  └──────────┘  └────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Data flow per request:**
1. Normalize question → check `node-cache`
2. Cache miss → RAG retrieves top-5 relevant chunks
3. Build grounded system prompt → call Groq
4. Validate response → cache answer → return

---

## Prerequisites

- Node.js ≥ 20
- A [Groq API key](https://console.groq.com) (free tier available)

---

## Local Development

### 1. Clone & install

```bash
git clone <repo-url>
cd batu-chatbot
npm run install:all
```

### 2. Configure environment

```bash
cd server
cp .env.example .env
```

Edit `.env`:

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
GROQ_MODEL=llama3-70b-8192
PORT=3001
UNIVERSITY_URL=https://batu.edu.eg
SCRAPE_INTERVAL_HOURS=24
CACHE_TTL_SECONDS=3600
CLIENT_ORIGIN=http://localhost:5173
```

### 3. Run

**Terminal 1 — Backend:**
```bash
npm run dev:server
# → http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
npm run dev:client
# → http://localhost:5173
```

The scraper runs automatically on startup and caches data to `server/data/university_data.json`.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat` | Send message `{ message: string }` |
| `GET`  | `/api/chat/branding` | Get university logo + colors |
| `POST` | `/api/scraper/refresh` | Manually trigger re-scrape |
| `GET`  | `/api/scraper/status` | Scrape status + cache stats |
| `GET`  | `/health` | Health check |

---

## Production Deployment (VPS)

### 1. Build frontend

```bash
npm run build:client
# Output: client/dist/
```

### 2. Serve static files from Express

Add to `server/index.js` (after routes):

```js
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(join(__dirname, '../client/dist')));
app.get('*', (_req, res) =>
  res.sendFile(join(__dirname, '../client/dist/index.html'))
);
```

### 3. PM2 process manager

```bash
npm install -g pm2
cd server
pm2 start index.js --name batu-chatbot
pm2 save
pm2 startup
```

### 4. Nginx reverse proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. SSL (Let's Encrypt)

```bash
sudo certbot --nginx -d yourdomain.com
```

---

## Configuration Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `GROQ_API_KEY` | — | **Required.** Groq API key |
| `GROQ_MODEL` | `llama3-70b-8192` | Groq model ID |
| `PORT` | `3001` | Server port |
| `UNIVERSITY_URL` | `https://batu.edu.eg` | Website to scrape |
| `SCRAPE_INTERVAL_HOURS` | `24` | Re-scrape frequency |
| `CACHE_TTL_SECONDS` | `3600` | Q&A cache lifetime |
| `CLIENT_ORIGIN` | `http://localhost:5173` | CORS allowed origin |

---

## Project Structure

```
batu-chatbot/
├── server/
│   ├── index.js                  ← Express entry
│   ├── .env.example
│   ├── routes/
│   │   ├── chat.routes.js
│   │   └── scraper.routes.js
│   ├── controllers/
│   │   ├── chat.controller.js    ← Cache→RAG→AI pipeline
│   │   └── scraper.controller.js
│   ├── services/
│   │   ├── ai.service.js         ← Groq + retry + prompt
│   │   └── rag.service.js        ← Keyword scorer, top-K
│   ├── scraper/
│   │   └── scraper.js            ← Cheerio, logo, colors
│   ├── cache/
│   │   └── cache.service.js      ← node-cache wrapper
│   └── utils/
│       ├── logger.js
│       ├── errorHandler.js
│       └── textUtils.js
│
└── client/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── styles/globals.css
        ├── hooks/
        │   ├── useChat.js
        │   ├── useBranding.js
        │   └── useTheme.js
        ├── services/
        │   └── api.js
        └── components/
            ├── ChatHeader.jsx
            ├── ChatContainer.jsx
            ├── MessageBubble.jsx
            ├── TypingIndicator.jsx
            ├── ChatInput.jsx
            ├── ScrollToBottomBtn.jsx
            └── WelcomeSuggestions.jsx
```
