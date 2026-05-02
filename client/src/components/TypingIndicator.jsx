import { memo } from 'react';

export const TypingIndicator = memo(() => (
  <div className="flex gap-3" style={{ animation: 'fadeUp .22s ease both' }}>
    {/* Avatar */}
    <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, var(--teal-700), var(--teal-800))', boxShadow: '0 2px 8px rgba(15,104,80,.15)' }}>
      <span className="text-white font-[800] text-[0.72rem]" style={{ fontFamily: "'Public Sans'" }}>B</span>
    </div>
    {/* Dots */}
    <div className="flex items-center gap-1 px-4 py-3"
      style={{
        background: 'var(--chat-bubble-bot-bg)',
        border: '1px solid var(--chat-bubble-bot-border)',
        borderRadius: '4px 18px 18px 18px',
        boxShadow: '0 1px 3px rgba(0,0,0,.04)',
      }}>
      {[0, 1, 2].map(i => (
        <span key={i}
          className="w-2 h-2 rounded-full block"
          style={{
            background: 'var(--teal-700)',
            animation: 'dotPulse 1.4s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
          }} />
      ))}
    </div>
  </div>
));
TypingIndicator.displayName = 'TypingIndicator';
