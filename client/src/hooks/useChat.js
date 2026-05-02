import { useState, useCallback, useRef } from 'react';
import { chatApi } from '../services/api.js';

const WELCOME_TEXT = 'مرحباً! أنا المساعد الذكي لجامعة برج العرب التكنولوجية.\nيمكنني الإجابة على أسئلتك المتعلقة بالجامعة، البرامج الأكاديمية، والخدمات المتاحة.';

const makeWelcome = () => ({
  id: 'welcome',
  role: 'bot',
  text: WELCOME_TEXT,
  ts: Date.now(),
});

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

/* ── Persistence helpers ────────────────────────────── */
const STORAGE_KEY = 'batu-chat-history';

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function saveHistory(sessions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch { /* quota exceeded — silently skip */ }
}

function getPreview(messages) {
  const first = messages.find(m => m.role === 'user');
  if (!first) return 'محادثة جديدة';
  return first.text.length > 50 ? first.text.slice(0, 50) + '…' : first.text;
}

/* ── Hook ────────────────────────────────────────────── */
export const useChat = () => {
  const [sessions, setSessions] = useState(() => {
    const h = loadHistory();
    if (h.length === 0) {
      const initial = { id: uid(), messages: [makeWelcome()], title: 'محادثة جديدة', createdAt: Date.now() };
      return [initial];
    }
    return h;
  });
  const [activeId, setActiveId] = useState(() => {
    const h = loadHistory();
    return h.length > 0 ? h[0].id : sessions[0]?.id;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pendingRef = useRef(false);

  /* Active session */
  const activeSession = sessions.find(s => s.id === activeId) || sessions[0];
  const messages = activeSession?.messages || [makeWelcome()];

  /* Persist on every change */
  const update = useCallback((next) => {
    setSessions(next);
    saveHistory(typeof next === 'function' ? next(sessions) : next);
  }, [sessions]);

  /* Send message */
  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || pendingRef.current) return;

    pendingRef.current = true;
    setError(null);
    setLoading(true);

    const userMsg = { id: uid(), role: 'user', text: trimmed, ts: Date.now() };

    setSessions(prev => {
      const next = prev.map(s => {
        if (s.id !== activeId) return s;
        const updated = { ...s, messages: [...s.messages, userMsg] };
        // Update title from first user message
        if (!s.messages.some(m => m.role === 'user')) {
          updated.title = trimmed.length > 40 ? trimmed.slice(0, 40) + '…' : trimmed;
        }
        return updated;
      });
      saveHistory(next);
      return next;
    });

    try {
      const { answer } = await chatApi.sendMessage(trimmed);
      const botMsg = { id: uid(), role: 'bot', text: answer, ts: Date.now() };
      setSessions(prev => {
        const next = prev.map(s =>
          s.id === activeId ? { ...s, messages: [...s.messages, botMsg] } : s
        );
        saveHistory(next);
        return next;
      });
    } catch (err) {
      const msg = err.message || 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.';
      setError(msg);
      const errMsg = { id: uid(), role: 'bot', text: msg, ts: Date.now(), isError: true };
      setSessions(prev => {
        const next = prev.map(s =>
          s.id === activeId ? { ...s, messages: [...s.messages, errMsg] } : s
        );
        saveHistory(next);
        return next;
      });
    } finally {
      setLoading(false);
      pendingRef.current = false;
    }
  }, [activeId]);

  /* New chat */
  const newChat = useCallback(() => {
    const session = { id: uid(), messages: [makeWelcome()], title: 'محادثة جديدة', createdAt: Date.now() };
    setSessions(prev => {
      const next = [session, ...prev];
      saveHistory(next);
      return next;
    });
    setActiveId(session.id);
    setError(null);
  }, []);

  /* Switch chat */
  const switchChat = useCallback((id) => {
    setActiveId(id);
    setError(null);
  }, []);

  /* Delete chat */
  const deleteChat = useCallback((id) => {
    setSessions(prev => {
      let next = prev.filter(s => s.id !== id);
      if (next.length === 0) {
        const fresh = { id: uid(), messages: [makeWelcome()], title: 'محادثة جديدة', createdAt: Date.now() };
        next = [fresh];
      }
      saveHistory(next);
      // If deleted the active one, switch to first
      if (id === activeId) setActiveId(next[0].id);
      return next;
    });
  }, [activeId]);

  /* Clear current chat */
  const clearChat = useCallback(() => {
    setSessions(prev => {
      const next = prev.map(s =>
        s.id === activeId
          ? { ...s, messages: [makeWelcome()], title: 'محادثة جديدة' }
          : s
      );
      saveHistory(next);
      return next;
    });
    setError(null);
  }, [activeId]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearChat,
    sessions,
    activeId,
    newChat,
    switchChat,
    deleteChat,
  };
};
