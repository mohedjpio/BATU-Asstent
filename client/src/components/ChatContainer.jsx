import { useEffect, useRef, useState, memo } from 'react';
import { MessageBubble } from './MessageBubble.jsx';
import { TypingIndicator } from './TypingIndicator.jsx';
import { WelcomeSuggestions } from './WelcomeSuggestions.jsx';

export const ChatContainer = memo(({ messages, loading, onSuggestion }) => {
  const bottomRef = useRef(null);
  const scrollRef = useRef(null);
  const [showBtn, setShowBtn] = useState(false);
  const hasUser = messages.some(m => m.role === 'user');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loading]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (el) setShowBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 180);
  };

  return (
    <div className="flex-1 relative overflow-hidden" style={{ background: 'var(--bg-page)' }}>
      <div ref={scrollRef} onScroll={onScroll}
        className="h-full overflow-y-auto chat-scroll"
        style={{ padding: '28px 20px', scrollbarGutter: 'stable' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }} className="flex flex-col gap-6">
          {!hasUser && <WelcomeSuggestions onSelect={onSuggestion} />}
          {messages.filter(m => m.id !== 'welcome' || hasUser).map(m => (
            <MessageBubble key={m.id} message={m} />
          ))}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} className="h-1" />
        </div>
      </div>

      {/* Scroll to bottom */}
      <button onClick={() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' })}
        className={`absolute bottom-5 left-1/2 -translate-x-1/2 transition-all duration-200
          w-9 h-9 rounded-full flex items-center justify-center cursor-pointer
          ${showBtn ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'}`}
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--sh-lg)', color: 'var(--text-secondary)' }}>
        <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
      </button>
    </div>
  );
});
ChatContainer.displayName = 'ChatContainer';
