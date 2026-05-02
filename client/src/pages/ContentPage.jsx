import { useState, useEffect } from 'react';
import { useI18n } from '../i18n/index.jsx';

/* ── Breakpoint ──────────────────────────────────────────── */
const useBP = () => {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener('resize', fn, { passive: true });
    return () => window.removeEventListener('resize', fn);
  }, []);
  return { xs: w < 480, sm: w < 640, md: w < 1024, lg: w >= 1024, w };
};

/* ── Icon ─────────────────────────────────────────────────── */
const Ic = ({ d, s = 16, w = 1.8 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

export default function ContentPage({ pageId, theme, onToggleTheme, onBack, onOpenChat, onNavigate }) {
  const { t, locale, setLocale } = useI18n();
  const { xs, sm, md, lg } = useBP();
  const [scrollY, setScrollY] = useState(0);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  useEffect(() => { if (lg) setNavOpen(false); }, [lg]);

  const isDark = theme === 'dark';
  const navScrolled = scrollY > 20;

  /* Layout */
  const mw  = { maxWidth:1200, margin:'0 auto', width:'100%', padding: sm?'0 18px':md?'0 32px':'0 48px' };
  
  const pageData = t.pageData?.[pageId];
  const title = pageData?.title || 'Not Found';
  const content = pageData?.content || 'The requested page could not be found.';

  /* ── Button A (amber accent) ── */
  const BtnA = ({ children, onClick, size='md' }) => (
    <button onClick={onClick}
      style={{ display:'inline-flex', alignItems:'center', gap:8,
        background:'var(--btn-accent-bg)', color:'#fff', border:'none',
        cursor:'pointer', borderRadius:'var(--r-md)',
        fontFamily:'var(--f-display)', fontWeight:700, letterSpacing:'.01em',
        padding: size==='lg'?'14px 28px':size==='sm'?'7px 14px':'11px 22px',
        fontSize: size==='lg'?'0.96rem':size==='sm'?'0.78rem':'0.88rem',
        boxShadow:'var(--btn-accent-sh)', transition:'all .18s var(--ease-out)' }}
      onMouseEnter={e=>{ e.currentTarget.style.background='var(--btn-accent-hover)'; e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 22px rgba(232,146,10,.5)'; }}
      onMouseLeave={e=>{ e.currentTarget.style.background='var(--btn-accent-bg)'; e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='var(--btn-accent-sh)'; }}>
      {children}
    </button>
  );

  return (
    <div style={{ width:'100%', minHeight:'100vh', display:'flex', flexDirection:'column', background:'var(--bg-page)',
      color:'var(--text-primary)', overflowX:'hidden',
      fontFamily:'var(--f-arabic)', transition:'background .3s,color .3s' }}>
      
      <style>{`
        .batu * { box-sizing:border-box }
        .batu a { text-decoration:none; color:inherit }
        
        .nl { color:rgba(255,255,255,.72); font-size:.83rem; font-weight:500;
          font-family:var(--f-display); padding:7px 11px; border-radius:8px;
          text-decoration:none; transition:all .17s; white-space:nowrap; display:inline-block; }
        .nl:hover { color:#fff; background:rgba(255,255,255,.1); }
        
        .fl:hover { color:rgba(255,255,255,.8) !important; }
        .soc:hover { background:rgba(255,255,255,.14) !important; color:#fff !important; }
        
        .di { display:block; } .hi { display:none; }
        .nd { display:flex; gap:2px; align-items:center; }
        .nc { display:inline-flex; }
        .hb { display:none; align-items:center; justify-content:center; }
        
        .fc2 { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:40px; }
        @media(max-width:1023px){
          .di { display:none !important; } .hi { display:block !important; }
          .nd,.nc { display:none !important; }
          .hb { display:flex !important; }
          .fc2 { grid-template-columns:1fr 1fr !important; gap:28px !important; }
        }
        @media(max-width:639px){
          .fc2 { grid-template-columns:1fr !important; }
        }
      `}</style>
      
      <div className="batu" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* ══ NAVBAR ════════════════════════════════════════════ */}
        <header style={{
          position:'fixed', top:0, left:0, right:0, zIndex:1000,
          background:'var(--nav-bg)',
          backdropFilter: navScrolled ? 'blur(20px)' : 'none',
          borderBottom:`1px solid ${navScrolled ? 'var(--nav-border)' : 'rgba(255,255,255,.07)'}`,
          transition:'all .3s var(--ease)',
        }}>
          <div style={{ ...mw, height:62, display:'flex', alignItems:'center', gap:16 }}>
            {/* Logo */}
            <div style={{ display:'flex', alignItems:'center', gap:11, flex:1, cursor: 'pointer' }} onClick={onBack}>
              <div style={{ width:38, height:38, borderRadius:10,
                background:'linear-gradient(135deg,var(--teal-600),var(--teal-800))',
                border:'2px solid var(--amber-400)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:'var(--f-display)', fontWeight:900, fontSize:'1rem', color:'#fff',
                flexShrink:0, boxShadow:'0 2px 12px rgba(15,104,80,.5)' }}>B</div>
              <div>
                <p style={{ color:'#fff', fontFamily:'var(--f-display)', fontWeight:800, fontSize:'0.95rem', lineHeight:1.1, letterSpacing:'-.02em' }}>BATU</p>
                {!xs && <p style={{ color:'rgba(255,255,255,.38)', fontSize:'0.57rem', letterSpacing:'.05em', fontFamily:'var(--f-display)' }}>{t.appSubtitle}</p>}
              </div>
            </div>

            <nav className="nd">
              <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }} className="nl">{t.home}</a>
            </nav>

            <div style={{ display:'flex', gap:8, alignItems:'center', flexShrink:0 }}>
              {/* Language toggle */}
              <button onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')} title={t.langSwitch}
                style={{ width:34, height:34, borderRadius:8, background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.14)', color:'rgba(255,255,255,.9)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .18s', flexShrink:0, fontSize:'0.8rem', fontWeight:600 }}
                onMouseEnter={e=>{ e.currentTarget.style.background='rgba(255,255,255,.16)'; }}
                onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,.08)'; }}>
                {locale === 'ar' ? 'EN' : 'ع'}
              </button>

              {/* Theme toggle */}
              <button onClick={onToggleTheme} title={isDark ? t.lightMode : t.darkMode}
                style={{ width:34, height:34, borderRadius:8, background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.14)', color:'rgba(255,255,255,.6)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .18s', flexShrink:0 }}
                onMouseEnter={e=>{ e.currentTarget.style.background='rgba(255,255,255,.16)'; e.currentTarget.style.color='#fff'; }}
                onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,.08)'; e.currentTarget.style.color='rgba(255,255,255,.6)'; }}>
                {isDark
                  ? <Ic d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364-.707-.707M6.343 6.343l-.707-.707m12.728 0-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" s={14} w={2}/>
                  : <Ic d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" s={13}/>
                }
              </button>

              <div className="nc">
                <BtnA onClick={onOpenChat} size="sm">
                  <Ic d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" s={12}/>
                  {t.heroCTA}
                </BtnA>
              </div>

              <button className="hb" onClick={()=>setNavOpen(v=>!v)}
                style={{ width:36, height:36, borderRadius:8, background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.14)', color:'rgba(255,255,255,.8)', cursor:'pointer', transition:'all .15s', flexShrink:0 }}>
                <Ic d={navOpen?'M18 6L6 18M6 6l12 12':'M4 6h16M4 12h16M4 18h16'} s={16} w={2}/>
              </button>
            </div>
          </div>

          {/* Mobile drawer */}
          {navOpen && (
            <div style={{ background:'rgba(3,15,10,.98)', borderTop:'1px solid rgba(255,255,255,.06)', padding:'10px 18px 20px' }}>
              <div style={{ borderBottom:'1px solid rgba(255,255,255,.05)' }}>
                <a href="#" onClick={(e) => { e.preventDefault(); onBack(); }} className="nl" style={{ display:'block', padding:'12px 0', fontSize:'0.9rem' }}>{t.home}</a>
              </div>
              <div style={{ marginTop:16 }}>
                <BtnA onClick={()=>{ onOpenChat(); setNavOpen(false); }} size="lg">
                  <Ic d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" s={15}/>
                  {t.heroCTA}
                </BtnA>
              </div>
            </div>
          )}
        </header>

        {/* ══ HEADER ══════════════════════════════════════════════ */}
        <div style={{ height: 62 }} />
        <section style={{
          background:`linear-gradient(155deg,var(--teal-950) 0%,var(--teal-800) 50%,var(--teal-700) 100%)`,
          padding: sm?'50px 18px':md?'60px 32px':'70px 48px',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)', backgroundSize:'56px 56px', pointerEvents:'none' }}/>
          <div style={{ ...mw, position: 'relative' }}>
            <h1 style={{ color:'#fff', fontFamily:'var(--f-display)', fontWeight:800,
                  fontSize: xs?'1.8rem':sm?'2.2rem':md?'2.5rem':'3rem',
                  lineHeight:1.1, letterSpacing:'-.02em' }}>
              {title}
            </h1>
          </div>
        </section>

        {/* ══ CONTENT ═════════════════════════════════════════════ */}
        <section style={{ flex: 1, padding: sm?'40px 18px':md?'50px 32px':'60px 48px', background:'var(--bg-page)' }}>
          <div style={{ ...mw }}>
            <div style={{ maxWidth: 800, background:'var(--bg-card)', padding: sm?'24px':'40px', borderRadius:'var(--r-xl)', border:'1px solid var(--border)', boxShadow:'var(--sh-md)' }}>
              {content.split('\n').map((paragraph, index) => (
                <p key={index} style={{ color:'var(--text-secondary)', fontFamily:'var(--f-arabic)', fontSize:'1rem', lineHeight:1.8, marginBottom: paragraph ? 20 : 0 }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FOOTER ════════════════════════════════════════════ */}
        <footer style={{ background:'var(--footer-bg)', borderTop:'1px solid rgba(255,255,255,.06)' }}>
          <div style={{ ...mw, padding: sm?'52px 18px 32px':'68px 48px 40px' }}>
            <div className="fc2" style={{ marginBottom: sm?36:52 }}>
              {/* Brand */}
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:11, marginBottom:18 }}>
                  <div style={{ width:38, height:38, borderRadius:10, background:'linear-gradient(135deg,var(--teal-600),var(--teal-800))', border:'2px solid var(--amber-500)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--f-display)', fontWeight:900, fontSize:'1rem', color:'#fff' }}>B</div>
                  <div>
                    <p style={{ color:'#fff', fontFamily:'var(--f-display)', fontWeight:800, fontSize:'0.94rem', lineHeight:1.1 }}>BATU</p>
                    <p style={{ color:'rgba(255,255,255,.32)', fontFamily:'var(--f-display)', fontSize:'0.57rem', letterSpacing:'.04em' }}>{t.appSubtitle}</p>
                  </div>
                </div>
                <p style={{ color:'rgba(255,255,255,.4)', fontFamily:'var(--f-arabic)', fontSize:'0.8rem', lineHeight:1.78, maxWidth:256, marginBottom:20 }}>
                  {t.footerDesc}
                </p>
                <div style={{ display:'flex', gap:8 }}>
                  {['M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z','M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'].map((d,i)=>(
                    <a key={i} href="#" className="soc" style={{ width:32, height:32, borderRadius:7, background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', color:'rgba(255,255,255,.4)', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .18s' }}>
                      <Ic d={d} s={13}/>
                    </a>
                  ))}
                </div>
              </div>

              {[
                { t: t.footerCol1Title, ls: t.footerCol1Links },
                { t: t.footerCol2Title, ls: t.footerCol2Links },
                { t: t.footerCol3Title, ls: t.footerCol3Links },
              ].map((col, idx) => (
                <div key={idx}>
                  <p style={{ color:'#fff', fontFamily:'var(--f-display)', fontWeight:700, fontSize:'0.84rem', marginBottom:16, letterSpacing:'.02em' }}>{col.t}</p>
                  <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    {col.ls?.map(l => (
                      <a key={l.id} href={l.external || '#'} target={l.external ? "_blank" : undefined} rel={l.external ? "noopener noreferrer" : undefined} onClick={e => {
                        if (!l.external) {
                          e.preventDefault();
                          if (typeof onNavigate === 'function') onNavigate(l.id);
                        }
                      }} className="fl" style={{ color:'rgba(255,255,255,.36)', fontFamily:'var(--f-arabic)', fontSize:'0.79rem', transition:'color .15s', cursor:'pointer' }}>{l.label}</a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop:'1px solid rgba(255,255,255,.07)', paddingTop:22, display:'flex', flexWrap:'wrap', gap:14, alignItems:'center', justifyContent:'space-between' }}>
              <p style={{ color:'rgba(255,255,255,.22)', fontFamily:'var(--f-arabic)', fontSize:'0.72rem' }}>{t.footerRights}</p>
              <div style={{ display:'flex', gap:18 }}>
                {t.footerBottomLinks?.map(l=>(
                  <a key={l.id} href="#" onClick={e => { e.preventDefault(); if (typeof onNavigate === 'function') onNavigate(l.id); }} className="fl" style={{ color:'rgba(255,255,255,.22)', fontFamily:'var(--f-arabic)', fontSize:'0.72rem', transition:'color .15s', cursor:'pointer' }}>{l.label}</a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
