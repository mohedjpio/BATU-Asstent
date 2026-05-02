import { memo, useState } from 'react';
import { useI18n } from '../i18n/index.jsx';

export const ChatSidebar = memo(({ sessions, activeId, onSwitch, onNew, onDelete, onClose }) => {
  const { t, locale } = useI18n();
  const [hoverId, setHoverId] = useState(null);

  const fmt = (ts) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now - d;
    if (locale === 'ar') {
      if (diff < 60000) return 'الآن';
      if (diff < 3600000) return `منذ ${Math.floor(diff / 60000)} د`;
      if (diff < 86400000) return `منذ ${Math.floor(diff / 3600000)} س`;
      if (diff < 604800000) return `منذ ${Math.floor(diff / 86400000)} ي`;
      return d.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
    }
    if (diff < 60000) return 'Now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="h-full flex flex-col border-e border-white/5" style={{ background: 'var(--chat-sidebar-bg)' }}>

      {/* Header */}
      <div className="px-4 py-4 flex items-center gap-3 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, var(--teal-700), var(--teal-800))', border: '1.5px solid var(--amber-400)' }}>
          <span className="text-white font-[800] text-[0.8rem]" style={{ fontFamily: "var(--f-display)" }}>B</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white/90 font-[600] text-[0.82rem] leading-tight" style={{ fontFamily: "var(--f-display)" }}>{t.aiName}</p>
          <p className="text-white/30 text-[0.65rem]">{t.aiSubtitle}</p>
        </div>
        {/* Close on mobile */}
        <button onClick={onClose}
          className="lg:hidden w-7 h-7 flex items-center justify-center text-white/40 hover:text-white/80 rounded transition-colors">
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      {/* New chat button */}
      <div className="px-3 pt-3 pb-2">
        <button onClick={() => { onNew(); onClose?.(); }}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-white/80 border border-white/[0.1] text-[0.82rem] font-[500] cursor-pointer transition-all duration-150 hover:bg-white/[0.06] hover:border-white/[0.16] hover:text-white active:scale-[0.98]"
          style={{ background: 'rgba(255,255,255,0.03)' }}>
          <span className="material-symbols-outlined text-[18px]">add</span>
          {t.chatNewChat}
        </button>
      </div>

      {/* Sessions list */}
      <div className="flex-1 overflow-y-auto sidebar-scroll px-2 py-1">
        <p className="px-2 pt-2 pb-1.5 text-white/25 text-[0.65rem] font-[600] tracking-wider uppercase"
          style={{ fontFamily: "var(--f-display)" }}>
          {t.chatPrevConvs}
        </p>
        <div className="flex flex-col gap-0.5">
          {sessions.map((s) => {
            const isActive = s.id === activeId;
            const isHover = hoverId === s.id;
            const msgCount = s.messages.filter(m => m.role === 'user').length;

            return (
              <div key={s.id}
                onMouseEnter={() => setHoverId(s.id)}
                onMouseLeave={() => setHoverId(null)}
                onClick={() => { onSwitch(s.id); onClose?.(); }}
                className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 relative
                  ${isActive
                    ? 'bg-white/[0.08] text-white'
                    : 'text-white/50 hover:bg-white/[0.04] hover:text-white/70'
                  }`}>
                <span className="material-symbols-outlined text-[16px] flex-shrink-0 opacity-50">
                  {isActive ? 'chat_bubble' : 'chat_bubble_outline'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-[0.79rem] truncate leading-tight ${isActive ? 'font-[600]' : 'font-[400]'}`}>
                    {s.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[0.62rem] text-white/25">{fmt(s.createdAt)}</span>
                    {msgCount > 0 && (
                      <span className="text-[0.62rem] text-white/20">{msgCount} {t.chatMessage}</span>
                    )}
                  </div>
                </div>
                {/* Delete button */}
                {(isHover || isActive) && sessions.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(s.id); }}
                    className="w-6 h-6 flex items-center justify-center text-white/25 hover:text-red-400 rounded transition-colors flex-shrink-0"
                    title={t.chatDelete}>
                    <span className="material-symbols-outlined text-[14px]">delete</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/[0.06]">
        <p className="text-white/15 text-[0.62rem] text-center" style={{ fontFamily: "var(--f-display)" }}>
          {t.footerPowered}
        </p>
      </div>
    </div>
  );
});

ChatSidebar.displayName = 'ChatSidebar';
