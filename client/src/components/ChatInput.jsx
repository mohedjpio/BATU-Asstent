import { memo, useState, useRef, useCallback } from 'react';
import { useI18n } from '../i18n/index.jsx';

export const ChatInput = memo(({ onSend, disabled }) => {
  const { t } = useI18n();
  const [val, setVal] = useState('');
  const [focused, setFocused] = useState(false);
  const ref = useRef(null);

  const submit = useCallback(() => {
    const v = val.trim();
    if (!v || disabled) return;
    onSend(v);
    setVal('');
    if (ref.current) ref.current.style.height = 'auto';
  }, [val, disabled, onSend]);

  const onKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
  };

  const onInput = e => {
    setVal(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
  };

  const active = val.trim().length > 0 && !disabled;

  return (
    <div style={{ background: 'var(--chat-input-area-bg)', borderTop: '1px solid var(--chat-input-area-border)' }} className="px-4 pt-3 pb-3">
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div className={`flex items-end gap-2 rounded-2xl px-4 py-2.5 transition-all duration-200`}
          style={{
            background: 'var(--chat-input-box-bg)',
            border: focused ? '2px solid var(--teal-600)' : '1px solid var(--chat-input-box-border)',
            boxShadow: focused ? '0 0 0 3px var(--badge-teal-border)' : 'var(--sh-sm)',
            padding: focused ? 'calc(0.625rem - 1px) calc(1rem - 1px)' : undefined,
          }}>
          <textarea ref={ref} value={val} onChange={onInput} onKeyDown={onKey}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            disabled={disabled} placeholder={t.chatPlaceholder} rows={1}
            className="flex-1 bg-transparent text-[0.88rem] leading-relaxed resize-none outline-none border-none max-h-[150px] overflow-y-auto py-1"
            style={{
              color: 'var(--text-primary)',
              fontFamily: "var(--f-arabic)",
              opacity: disabled ? 0.5 : 1,
            }}
          />
          <button onClick={submit} disabled={!active}
            className="w-9 h-9 rounded-xl flex-shrink-0 border-none flex items-center justify-center transition-all duration-200"
            style={{
              background: active ? 'linear-gradient(135deg, var(--teal-700), var(--teal-800))' : 'var(--bg-subtle)',
              color: active ? '#fff' : 'var(--text-muted)',
              cursor: active ? 'pointer' : 'not-allowed',
              boxShadow: active ? 'var(--sh-md)' : 'none',
              transform: active ? 'scale(1)' : 'scale(0.95)',
            }}>
            <span className="material-symbols-outlined text-[18px]">
              {disabled ? 'progress_activity' : 'arrow_upward'}
            </span>
          </button>
        </div>
        <p className="text-center text-[0.66rem] mt-2 tracking-wider" style={{ color: 'var(--text-muted)' }}>
          {t.chatDisclaimer}
        </p>
      </div>
    </div>
  );
});
ChatInput.displayName = 'ChatInput';
