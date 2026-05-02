import { memo, useState, useCallback } from 'react';
import { useI18n } from '../i18n/index.jsx';

export const MessageBubble = memo(({ message }) => {
  const { t, locale } = useI18n();
  const { role, text, ts, isError } = message;
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);
  const [hover, setHover] = useState(false);

  const fmt = ts => new Date(ts).toLocaleTimeString(locale === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' });

  const copy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  }, [text]);

  if (isUser) {
    return (
      <div className="flex justify-end" style={{ animation: 'fadeUp .22s ease both' }}>
        <div className="max-w-[75%] flex flex-col items-end gap-1">
          <div className="px-4 py-3 text-[0.88rem] leading-[1.75] whitespace-pre-wrap break-words text-white"
            style={{
              background: 'linear-gradient(135deg, var(--teal-700), var(--teal-800))',
              borderRadius: locale === 'ar' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
              boxShadow: 'var(--sh-md)',
            }}>
            {text}
          </div>
          <span className={`text-[0.64rem] px-1 transition-opacity duration-150 ${hover ? 'opacity-70' : 'opacity-0'}`}
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            {fmt(ts)}
          </span>
        </div>
      </div>
    );
  }

  // Bot message
  return (
    <div className="flex gap-3" style={{ animation: 'fadeUp .22s ease both' }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {/* Avatar */}
      <div className="w-8 h-8 rounded-lg flex-shrink-0 mt-1 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, var(--teal-700), var(--teal-800))', boxShadow: 'var(--sh-sm)' }}>
        <span className="text-white font-[800] text-[0.72rem]" style={{ fontFamily: "var(--f-display)" }}>B</span>
      </div>

      <div className="flex-1 min-w-0 max-w-[85%]">
        <div className={`px-4 py-3 text-[0.88rem] leading-[1.8] whitespace-pre-wrap break-words`}
          style={{
            background: isError ? '#fef2f2' : 'var(--chat-bubble-bot-bg)',
            border: `1px solid ${isError ? '#fecaca' : 'var(--chat-bubble-bot-border)'}`,
            borderRadius: locale === 'ar' ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
            color: isError ? '#991b1b' : 'var(--chat-bubble-bot-text)',
            boxShadow: 'var(--sh-sm)',
          }}>
          {isError && <span className="ml-1">⚠️ </span>}
          {text}
        </div>

        {/* Meta row */}
        <div className={`flex items-center gap-2.5 mt-1 h-5 transition-opacity duration-200 ${hover ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-[0.64rem]" style={{ color: 'var(--text-muted)' }}>{fmt(ts)}</span>
          <button onClick={copy}
            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[0.64rem] cursor-pointer transition-colors duration-150"
            style={{
              background: 'transparent', border: 'none',
              color: copied ? 'var(--teal-700)' : 'var(--text-muted)',
            }}
            title={copied ? t.chatCopied : t.chatCopy}>
            <span className="material-symbols-outlined text-[13px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            {copied ? t.chatCopied : t.chatCopy}
          </button>
        </div>
      </div>
    </div>
  );
});
MessageBubble.displayName = 'MessageBubble';
