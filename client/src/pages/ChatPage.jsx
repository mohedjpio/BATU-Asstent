import { useState } from 'react';
import { ChatSidebar } from '../components/ChatSidebar.jsx';
import { ChatContainer } from '../components/ChatContainer.jsx';
import { ChatInput } from '../components/ChatInput.jsx';
import { useI18n } from '../i18n/index.jsx';

export default function ChatPage({ theme, onToggleTheme, onBack, chat }) {
  const { t, locale, setLocale } = useI18n();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    messages, loading, sendMessage, clearChat,
    sessions, activeId, newChat, switchChat, deleteChat,
  } = chat;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-page)' }}>

      {/* ── Sidebar (desktop: always visible, mobile: overlay) ── */}
      {/* Desktop */}
      <aside className="hidden lg:block w-[280px] flex-shrink-0 h-full border-r border-white/[0.06]">
        <ChatSidebar
          sessions={sessions} activeId={activeId}
          onSwitch={switchChat} onNew={newChat} onDelete={deleteChat}
          onClose={() => {}}
        />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className={`fixed inset-y-0 ${locale === 'ar' ? 'right-0' : 'left-0'} w-[300px] z-50 lg:hidden`} style={{ animation: 'slideIn .2s ease' }}>
            <ChatSidebar
              sessions={sessions} activeId={activeId}
              onSwitch={switchChat} onNew={newChat} onDelete={deleteChat}
              onClose={() => setSidebarOpen(false)}
            />
          </aside>
        </>
      )}

      {/* ── Main chat area ── */}
      <div className="flex-1 flex flex-col h-full min-w-0">

        {/* Header */}
        <header className="h-[56px] flex-shrink-0 flex items-center gap-3 px-4 border-b relative"
          style={{ background: 'var(--chat-header-bg)', borderColor: 'var(--chat-header-border)' }}>

          {/* Back to home */}
          <button onClick={onBack}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[0.78rem] font-[500] cursor-pointer transition-all duration-150 flex-shrink-0"
            style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)', background: 'var(--bg-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-subtle)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-muted)'; }}>
            <span className="material-symbols-outlined text-[14px]">
              {locale === 'ar' ? 'arrow_forward' : 'arrow_back'}
            </span>
            {t.home}
          </button>

          {/* Sidebar toggle mobile */}
          <button onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            <span className="material-symbols-outlined text-[18px]">menu</span>
          </button>

          <div className="flex-1" />

          {/* Title center */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0f6850, #0a4f3d)' }}>
              <span className="text-white text-[0.7rem] font-[800]" style={{ fontFamily: "'Public Sans'" }}>B</span>
            </div>
            <div>
              <p className="text-[0.8rem] font-[600] leading-tight" style={{ color: 'var(--text-h)', fontFamily: "'Public Sans'" }}>{t.chatTitle}</p>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full block" style={{ background: '#2db592' }} />
                <span className="text-[0.6rem]" style={{ color: 'var(--text-muted)' }}>{t.chatOnline}</span>
              </div>
            </div>
          </div>

          <div className="flex-1" />

          {/* Controls */}
          <div className="flex items-center gap-1">
            <button onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')} title={t.langSwitch}
              className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-150 font-[600] text-[0.8rem]"
              style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--teal-500)'; e.currentTarget.style.borderColor = 'var(--teal-500)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
              {locale === 'ar' ? 'EN' : 'ع'}
            </button>
            <button onClick={newChat} title={t.chatNewConv}
              className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-150"
              style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--teal-500)'; e.currentTarget.style.borderColor = 'var(--teal-500)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
              <span className="material-symbols-outlined text-[17px]">edit_square</span>
            </button>
            <button onClick={clearChat} title={t.chatClear}
              className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-150"
              style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--teal-500)'; e.currentTarget.style.borderColor = 'var(--teal-500)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
              <span className="material-symbols-outlined text-[17px]">delete_sweep</span>
            </button>
            <button onClick={onToggleTheme} title={theme === 'dark' ? t.lightMode : t.darkMode}
              className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-150"
              style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--teal-500)'; e.currentTarget.style.borderColor = 'var(--teal-500)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
              <span className="material-symbols-outlined text-[17px]">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          </div>
        </header>

        {/* Chat content */}
        <ChatContainer messages={messages} loading={loading} onSuggestion={sendMessage} />

        {/* Input */}
        <ChatInput onSend={sendMessage} disabled={loading} />
      </div>
    </div>
  );
}
