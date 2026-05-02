import { memo } from 'react';
import { useI18n } from '../i18n/index.jsx';

export const WelcomeSuggestions = memo(({ onSelect }) => {
  const { t } = useI18n();

  const CHIPS = [
    { icon: 'school', text: t.sug1 },
    { icon: 'how_to_reg', text: t.sug2 },
    { icon: 'payments', text: t.sug3 },
    { icon: 'swap_horiz', text: t.sug4 },
    { icon: 'handshake', text: t.sug5 },
    { icon: 'description', text: t.sug6 },
  ];

  return (
    <div className="flex flex-col items-center pt-8 pb-4" style={{ animation: 'fadeIn .35s ease both' }}>
      {/* Logo */}
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: 'linear-gradient(135deg, var(--teal-700), var(--teal-800))', boxShadow: '0 4px 20px rgba(15,104,80,.2)' }}>
        <span className="text-white font-[900] text-[1.2rem]" style={{ fontFamily: "'Public Sans'" }}>B</span>
      </div>

      {/* Heading */}
      <h2 className="text-[1.15rem] font-[700] mb-2" style={{ color: 'var(--text-h)', fontFamily: "'Public Sans'" }}>
        {t.chatWelcome}
      </h2>
      <p className="text-[0.88rem] mb-8 text-center max-w-[420px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {t.chatWelcomeDesc}
      </p>

      {/* Suggestion grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-[520px]">
        {CHIPS.map(c => (
          <button key={c.text} onClick={() => onSelect(c.text)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[0.82rem] font-[500] cursor-pointer transition-all duration-200 group"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              boxShadow: '0 1px 3px rgba(0,0,0,.03)',
              textAlign: 'start',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--teal-600)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(15,104,80,.1)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,.03)';
              e.currentTarget.style.transform = '';
            }}>
            <span className="material-symbols-outlined text-[18px] flex-shrink-0 transition-colors" style={{ color: 'var(--teal-700)' }}>
              {c.icon}
            </span>
            <span className="flex-1">{c.text}</span>
            <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: 'var(--text-muted)' }}>
              arrow_forward
            </span>
          </button>
        ))}
      </div>
    </div>
  );
});
WelcomeSuggestions.displayName = 'WelcomeSuggestions';
