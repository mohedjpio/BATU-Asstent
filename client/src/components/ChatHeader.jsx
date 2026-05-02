import { memo } from 'react';

export const ChatHeader = memo(({ theme, onToggleTheme, onClear, activePage, onChangePage }) => {
  return (
    <header className="flex-shrink-0" style={{ background: 'var(--chat-header-bg)', borderBottom: '1px solid var(--chat-header-border)' }}>
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Logo mark */}
        <div className="w-9 h-9 rounded-[10px] bg-secondary flex items-center justify-center flex-shrink-0 ring-2 ring-secondary/20">
          <span className="text-white font-[800] text-[0.95rem]" style={{ fontFamily: 'var(--f-display)' }}>B</span>
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <p className="font-[600] text-[0.9rem] truncate leading-tight" style={{ color: 'var(--chat-header-text)', fontFamily: 'var(--f-display)' }}>
            جامعة برج العرب التكنولوجية
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="bg-secondary w-1.5 h-1.5 rounded-full block" />
            <span className="text-[0.7rem]" style={{ color: 'var(--text-muted)' }}>المساعد الذكي · BATU AI</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-0.5">
          {activePage === 'chat' && (
            <button onClick={onClear} title="مسح المحادثة"
              className="p-2 rounded-lg transition-colors duration-150"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
          )}
          <button onClick={onToggleTheme} title={theme === 'dark' ? 'وضع فاتح' : 'وضع داكن'}
            className="p-2 rounded-lg transition-colors duration-150"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
            <span className="material-symbols-outlined text-[18px]">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex px-4 gap-1 pb-0">
        {[
          { id: 'chat', label: 'المحادثة', icon: 'chat_bubble' },
          { id: 'learn', label: 'تعرّف علينا', icon: 'menu_book' },
        ].map((tab) => (
          <button key={tab.id} onClick={() => onChangePage(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 text-[0.82rem] bg-transparent border-none cursor-pointer transition-colors duration-200 -mb-px
              ${activePage === tab.id
                ? 'text-secondary font-[600] border-b-2 border-secondary'
                : 'font-[400] border-b-2 border-transparent hover:opacity-70'
              }`}
            style={{ color: activePage === tab.id ? 'var(--secondary)' : 'var(--text-muted)' }}>
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
});

ChatHeader.displayName = 'ChatHeader';
