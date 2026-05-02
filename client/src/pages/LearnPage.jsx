import { useState, useEffect } from 'react';
import { useI18n } from '../i18n/index.jsx';

/* ── Breakpoint Detection ── */
const useBP = () => {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener('resize', fn, { passive: true });
    return () => window.removeEventListener('resize', fn);
  }, []);
  return { xs: w < 480, sm: w < 640, md: w < 1024, lg: w >= 1024, w };
};

/* ── Generic Icon Component ── */
const Ic = ({ d, s = 16, w = 1.8 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

/* ── Image Assets ── */
const IMG = {
  hero:   'https://images.unsplash.com/photo-1562774053-701939374585?w=1400&q=90',
  hero2:  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=85',
  hero3:  'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&q=85',
  about:  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=900&q=85',
  campus: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200&q=85',
  prog1:  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
  prog2:  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
  prog3:  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
  t1:     'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=200&q=80',
  t2:     'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=200&q=80',
  t3:     'https://images.unsplash.com/photo-1627556704302-624286467c65?w=200&q=80',
};

export default function LearnPage({ theme, onToggleTheme, onOpenChat }) {
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
  const isRTL = t.dir === 'rtl';
  const navScrolled = scrollY > 80;
  const lp = t.learnPage || {};

  /* Styles */
  const mw = { maxWidth: 1200, margin: '0 auto', width: '100%', padding: sm ? '0 18px' : md ? '0 32px' : '0 48px' };
  const sp = sm ? '72px 18px' : md ? '88px 32px' : '100px 48px';

  /* ── Section Header Component ── */
  const SH = ({ badge, title, sub, center = true, inv = false }) => (
    <div style={{ textAlign: center ? 'center' : (isRTL ? 'right' : 'left'), marginBottom: 48, animation: 'fadeIn 0.8s ease-out both' }}>
      {badge && (
        <div style={{ marginBottom: 14 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: inv ? 'rgba(255,255,255,.12)' : 'var(--badge-amber-bg)',
            border: `1px solid ${inv ? 'rgba(255,255,255,.2)' : 'var(--badge-amber-border)'}`,
            borderRadius: 99, padding: '4px 14px',
            color: inv ? 'rgba(255,255,255,.9)' : 'var(--badge-amber-color)',
            fontFamily: 'var(--f-display)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase'
          }}>
            {badge}
          </span>
        </div>
      )}
      <h2 style={{
        fontFamily: 'var(--f-display)', fontWeight: 800,
        fontSize: 'clamp(1.75rem,3vw,2.5rem)', lineHeight: 1.15, letterSpacing: '-.035em',
        color: inv ? '#fff' : 'var(--text-h)', marginBottom: sub ? 14 : 0
      }}>
        {title}
      </h2>
      {sub && <p style={{
        fontSize: '.97rem', lineHeight: 1.8,
        color: inv ? 'rgba(255,255,255,.55)' : 'var(--text-secondary)',
        maxWidth: center ? 520 : 'none', margin: center ? '0 auto' : 0
      }}>{sub}</p>}
      <div style={{
        width: 44, height: 3,
        background: 'linear-gradient(90deg,var(--teal-500),var(--amber-400))',
        borderRadius: 99, margin: center ? '16px auto 0' : (isRTL ? '16px 0 0 auto' : '16px auto 0 0')
      }} />
    </div>
  );

  /* ── Buttons ── */
  const BtnP = ({ children, onClick, size = 'md' }) => (
    <button onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: 'var(--btn-primary-bg)', color: '#fff', border: 'none',
        cursor: 'pointer', borderRadius: 'var(--r-md)',
        fontFamily: 'var(--f-display)', fontWeight: 700,
        padding: size === 'lg' ? '14px 28px' : '11px 22px',
        fontSize: size === 'lg' ? '0.96rem' : '0.88rem',
        boxShadow: 'var(--btn-primary-sh)', transition: 'all .18s var(--ease-out)',
        animation: 'pulse-soft 2s infinite'
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--btn-primary-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'var(--btn-primary-bg)'; e.currentTarget.style.transform = ''; }}>
      {children}
    </button>
  );

  const BtnA = ({ children, onClick, size = 'md' }) => (
    <button onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: 'var(--btn-accent-bg)', color: '#fff', border: 'none',
        cursor: 'pointer', borderRadius: 'var(--r-md)',
        fontFamily: 'var(--f-display)', fontWeight: 700,
        padding: size === 'lg' ? '14px 28px' : '11px 22px',
        fontSize: size === 'lg' ? '0.96rem' : '0.88rem',
        boxShadow: 'var(--btn-accent-sh)', transition: 'all .18s var(--ease-out)'
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--btn-accent-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'var(--btn-accent-bg)'; e.currentTarget.style.transform = ''; }}>
      {children}
    </button>
  );

  const BtnG = ({ children, onClick, href, size = 'md' }) => {
    const s = {
      display: 'inline-flex', alignItems: 'center', gap: 7,
      color: 'rgba(255,255,255,.82)', border: '1.5px solid rgba(255,255,255,.25)',
      borderRadius: 'var(--r-md)', padding: size === 'lg' ? '14px 24px' : '11px 20px',
      fontSize: size === 'lg' ? '0.95rem' : '0.88rem', fontWeight: 500,
      background: 'rgba(255,255,255,.07)', transition: 'all .18s var(--ease-out)',
      fontFamily: 'var(--f-display)', cursor: 'pointer'
    };
    return href
      ? <a href={href} target="_blank" rel="noopener noreferrer" style={s}>{children}</a>
      : <button onClick={onClick} style={s}>{children}</button>;
  };

  return (
    <div style={{
      width: '100%', minHeight: '100vh', background: 'var(--bg-page)',
      color: 'var(--text-primary)', overflowX: 'hidden',
      direction: isRTL ? 'rtl' : 'ltr',
      fontFamily: isRTL ? 'var(--f-arabic)' : 'var(--f-display)',
      transition: 'background .3s, color .3s'
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float { 0%, 100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
        @keyframes pulse-soft { 0% { box-shadow:0 0 0 0 rgba(15,104,80,0.4); } 70% { box-shadow:0 0 0 12px rgba(15,104,80,0); } 100% { box-shadow:0 0 0 0 rgba(15,104,80,0); } }
        
        .batu-lp * { box-sizing: border-box; }
        .batu-lp img { display: block; max-width: 100%; }
        .nav-link { color: rgba(255,255,255,.7); padding: 8px 12px; border-radius: 8px; transition: all .2s; font-size: 0.88rem; font-weight: 500; }
        .nav-link:hover { color: #fff; background: rgba(255,255,255,.1); }
        
        .card-hover { transition: transform .3s ease, box-shadow .3s ease; }
        .card-hover:hover { transform: translateY(-8px); box-shadow: var(--sh-xl) !important; }
        
        .grid-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .grid-progs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .grid-feats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        
        @media (max-width: 1024px) {
          .grid-stats { grid-template-columns: repeat(2, 1fr); }
          .grid-progs, .grid-feats { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .grid-stats, .grid-progs, .grid-feats { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="batu-lp">
        {/* ── Navigation ── */}
        <header style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          background: navScrolled ? 'var(--nav-bg)' : 'transparent',
          backdropFilter: navScrolled ? 'blur(16px)' : 'none',
          borderBottom: navScrolled ? '1px solid var(--nav-border)' : 'none',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ ...mw, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'linear-gradient(135deg, var(--teal-600), var(--teal-800))',
                border: '2px solid var(--amber-400)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}>B</div>
              <div>
                <h1 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>{t.appName}</h1>
                <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>{t.appSubtitle}</p>
              </div>
            </div>

            <nav style={{ display: lg ? 'flex' : 'none', gap: 8 }}>
              {lp.nav?.map((item, idx) => (
                <a key={idx} href={`#${idx}`} className="nav-link">{item}</a>
              ))}
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
                style={{
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontWeight: 600,
                  fontSize: '0.85rem'
                }}>
                {locale === 'ar' ? 'EN' : 'ع'}
              </button>
              <button onClick={onToggleTheme}
                style={{
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff', borderRadius: 8, width: 36, height: 36, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                title={theme === 'dark' ? t.lightMode : t.darkMode}>
                <Ic d={theme === 'dark' 
                  ? "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
                  : "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"} s={18} />
              </button>
              <BtnA onClick={onOpenChat} size="sm">{t.heroCTA}</BtnA>
              {!lg && (
                <button onClick={() => setNavOpen(!navOpen)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                  <Ic d={navOpen ? "M18 6L6 18M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} s={24} />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* ── Hero Section ── */}
        <section style={{
          background: 'linear-gradient(160deg, var(--teal-950) 0%, var(--teal-800) 100%)',
          padding: '160px 0 100px', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(var(--amber-400) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div style={{ ...mw, position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: lg ? '1.1fr 0.9fr' : '1fr', gap: 60, alignItems: 'center' }}>
              <div>
                <span style={{
                  display: 'inline-block', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 99, padding: '6px 16px', color: 'var(--amber-300)', fontSize: '0.75rem', fontWeight: 700, marginBottom: 24,
                  animation: 'fadeIn 0.6s ease-out'
                }}>{t.heroBadge}</span>
                <h2 style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: 24,
                  animation: 'fadeIn 0.8s ease-out 0.2s both'
                }}>{t.heroTitle}</h2>
                <p style={{
                  fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 40, maxWidth: 500,
                  animation: 'fadeIn 0.8s ease-out 0.4s both'
                }}>{t.heroDesc}</p>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', animation: 'fadeIn 0.8s ease-out 0.6s both' }}>
                  <BtnA onClick={onOpenChat} size="lg">{t.heroCTA}</BtnA>
                  <BtnG href="https://batechu.com" size="lg">{t.heroSecondary}</BtnG>
                </div>
              </div>
              {lg && (
                <div style={{ position: 'relative', animation: 'float 6s ease-in-out infinite' }}>
                  <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', border: '4px solid rgba(255,255,255,0.1)' }}>
                    <img src={IMG.hero} alt="BATU Campus" style={{ width: '100%', height: 500, objectFit: 'cover' }} />
                  </div>
                  <div style={{
                    position: 'absolute', bottom: -30, right: -30, background: 'var(--bg-card)', padding: '20px', borderRadius: 20,
                    boxShadow: 'var(--sh-xl)', border: '1px solid var(--border)', maxWidth: 200
                  }}>
                    <p style={{ color: 'var(--teal-600)', fontWeight: 800, fontSize: '1.5rem', margin: 0 }}>2022</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>{isRTL ? 'تأسست لبناء المستقبل' : 'Founded to build the future'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Stats Section ── */}
        <section style={{ padding: '60px 0', background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ ...mw }}>
            <div className="grid-stats">
              {lp.stats?.map((s, i) => (
                <div key={i} className="card-hover" style={{
                  padding: '24px', background: 'var(--bg-page)', borderRadius: 20, border: '1px solid var(--border)',
                  textAlign: 'center', animation: `fadeIn 0.8s ease-out ${i * 0.1}s both`
                }}>
                  <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--teal-600)', margin: '0 0 4px' }}>{s.val}</p>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', margin: '0 0 4px' }}>{s.label}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── About Section ── */}
        <section id="0" style={{ padding: sp, background: 'var(--bg-page)' }}>
          <div style={{ ...mw }}>
            <div style={{ display: 'grid', gridTemplateColumns: lg ? '1fr 1.2fr' : '1fr', gap: 80, alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: 'var(--sh-xl)' }}>
                  <img src={IMG.about} alt="Learning" style={{ width: '100%', height: lg ? 550 : 350, objectFit: 'cover' }} />
                </div>
                <div style={{
                  position: 'absolute', bottom: 30, [isRTL ? 'right' : 'left']: -40, background: 'var(--teal-700)',
                  padding: '24px', borderRadius: 24, color: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', maxWidth: 240
                }}>
                  <p style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: 8 }}>{lp.aboutSection?.presidentTitle}</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.3 }}>{lp.aboutSection?.presidentName}</p>
                </div>
              </div>
              <div>
                <SH badge={lp.aboutSection?.badge} title={lp.aboutSection?.title} center={false} />
                <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: 32 }}>
                  {lp.aboutSection?.desc}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
                  {lp.aboutSection?.stats?.map((s, i) => (
                    <div key={i} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
                      <p style={{ color: 'var(--teal-600)', fontWeight: 800, fontSize: '1rem', margin: '0 0 4px' }}>{s.val}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{s.label}</p>
                    </div>
                  ))}
                </div>
                <BtnP onClick={() => {}}>{lp.aboutSection?.cta}</BtnP>
              </div>
            </div>
          </div>
        </section>

        {/* ── Programs Section ── */}
        <section id="1" style={{ padding: sp, background: 'var(--bg-muted)' }}>
          <div style={{ ...mw }}>
            <SH badge={t.facultiesTag} title={t.facultiesTitle} sub={t.facultiesDesc} />
            <div className="grid-progs">
              {lp.programs?.map((p, i) => (
                <div key={i} className="card-hover" style={{
                  background: 'var(--bg-card)', borderRadius: 24, overflow: 'hidden', border: '1px solid var(--border)',
                  boxShadow: 'var(--sh-md)'
                }}>
                  <div style={{ height: 200, position: 'relative' }}>
                    <img src={IMG[`prog${i + 1}`]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }} />
                    <div style={{ position: 'absolute', bottom: 16, [isRTL ? 'right' : 'left']: 20 }}>
                      <span style={{
                        background: p.accent, color: '#fff', padding: '4px 12px', borderRadius: 99,
                        fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase'
                      }}>Faculty {p.tag}</span>
                      <h3 style={{ color: '#fff', margin: '8px 0 0', fontSize: '1.1rem', fontWeight: 700 }}>{p.name}</h3>
                    </div>
                  </div>
                  <div style={{ padding: '24px' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>{isRTL ? 'العميد: ' : 'Dean: '}{p.dean}</p>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: 20 }}>{p.desc}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {p.courses?.map((c, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: p.accent }} />
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features Section ── */}
        <section id="3" style={{ padding: sp, background: 'var(--bg-page)' }}>
          <div style={{ ...mw }}>
            <SH badge={t.partnersTag} title={isRTL ? 'لماذا تختار جامعة باتو؟' : 'Why Choose BATU?'} sub={isRTL ? 'نظام تعليمي عالمي على أرض مصرية' : 'Global education system on Egyptian soil'} />
            <div className="grid-feats">
              {lp.features?.map((f, i) => (
                <div key={i} className="card-hover" style={{
                  padding: '32px', background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border)',
                  animation: `fadeIn 0.8s ease-out ${i * 0.1}s both`
                }}>
                  <div style={{
                    width: 50, height: 50, borderRadius: 14, background: 'var(--badge-teal-bg)',
                    color: 'var(--teal-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20
                  }}>
                    <Ic d={f.d} s={24} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 12 }}>{f.title}</h3>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-muted)' }}>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Admission Steps ── */}
        <section id="4" style={{ padding: sp, background: 'var(--bg-muted)' }}>
          <div style={{ ...mw }}>
            <SH badge={t.admissionTag} title={lp.steps?.[0]?.title ? isRTL ? 'خطوات الالتحاق' : 'Admission Steps' : ''} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {lp.steps?.map((s, i) => (
                <div key={i} className="card-hover" style={{
                  display: 'flex', gap: 24, padding: '32px', background: 'var(--bg-card)',
                  borderRadius: 24, border: '1px solid var(--border)', position: 'relative'
                }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: 18, background: 'var(--teal-600)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800, flexShrink: 0
                  }}>
                    {s.n}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
                    <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: 12 }}>{s.body}</p>
                    <div style={{
                      padding: '12px 16px', background: 'var(--bg-subtle)', borderRadius: 12,
                      borderLeft: isRTL ? 'none' : '4px solid var(--teal-500)',
                      borderRight: isRTL ? '4px solid var(--teal-500)' : 'none',
                      fontSize: '0.85rem', color: 'var(--text-muted)'
                    }}>{s.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Fees Quick View */}
            <div style={{
              marginTop: 40, padding: '40px', background: 'var(--teal-900)', borderRadius: 32, color: '#fff',
              display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 40
            }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>{lp.feesDetails?.title}</h3>
                <p style={{ opacity: 0.7 }}>{lp.feesDetails?.subtitle}</p>
              </div>
              <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
                {lp.feesDetails?.items?.map((item, idx) => (
                  <div key={idx}>
                    <p style={{ color: 'var(--amber-400)', fontWeight: 800, fontSize: '1.5rem', margin: 0 }}>{item.val} <span style={{ fontSize: '0.8rem' }}>{isRTL ? 'ج.م' : 'EGP'}</span></p>
                    <p style={{ fontSize: '0.85rem', opacity: 0.6, margin: 0 }}>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Testimonials Section ── */}
        <section style={{ padding: sp, background: 'var(--bg-page)' }}>
          <div style={{ ...mw }}>
            <SH title={isRTL ? 'قالوا عن باتو' : 'Testimonials'} sub={isRTL ? 'تجارب حقيقية من قلب الحرم الجامعي' : 'Real experiences from our students'} center />
            <div className="grid-feats" style={{ marginTop: 40 }}>
              {lp.testimonials?.map((t, i) => (
                <div key={i} className="card-hover" style={{
                  padding: '32px', background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border)',
                  display: 'flex', flexDirection: 'column', gap: 20
                }}>
                  <div style={{ color: 'var(--amber-500)', display: 'flex', gap: 4 }}>
                    {[...Array(5)].map((_, j) => <Ic key={j} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" s={14} />)}
                  </div>
                  <p style={{ fontSize: '1rem', lineHeight: 1.7, fontStyle: 'italic', color: 'var(--text-secondary)' }}>"{t.q}"</p>
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--teal-100)', color: 'var(--teal-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{t.name[0]}</div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>{t.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{t.prog} · {t.year}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Call to Action Section ── */}
        <section style={{ padding: '100px 0', background: 'linear-gradient(135deg, var(--teal-900), var(--teal-950))', color: '#fff', textAlign: 'center', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }} />
          <div style={{ ...mw, position: 'relative', zIndex: 1 }}>
            <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', padding: '6px 16px', borderRadius: 99, fontSize: '0.75rem', fontWeight: 700, color: 'var(--amber-300)', marginBottom: 20 }}>{lp.cta?.badge}</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: 20 }}>{lp.cta?.title} <span style={{ color: 'var(--teal-300)' }}>{lp.cta?.titleAccent}</span></h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.7, maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.6 }}>{lp.cta?.desc}</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <BtnA onClick={onOpenChat} size="lg">{lp.cta?.primaryCTA}</BtnA>
              <BtnG href="https://batechu.com" size="lg">{lp.cta?.secondaryCTA}</BtnG>
            </div>
            <p style={{ marginTop: 40, fontSize: '0.7rem', opacity: 0.3 }}>{lp.cta?.footer}</p>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{ background: 'var(--footer-bg)', padding: '80px 0 40px', color: '#fff', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ ...mw }}>
            <div style={{ display: 'grid', gridTemplateColumns: lg ? '1.5fr 1fr 1fr 1fr' : '1fr', gap: 40, marginBottom: 60 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--teal-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>B</div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>BATU</h3>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, maxWidth: 300 }}>{t.footerDesc}</p>
              </div>
              {[
                { title: t.footerCol1Title, links: t.footerCol1Links },
                { title: t.footerCol2Title, links: t.footerCol2Links },
                { title: t.footerCol3Title, links: t.footerCol3Links }
              ].map((col, idx) => (
                <div key={idx}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 20, color: 'var(--amber-400)' }}>{col.title}</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {col.links?.map((link, lIdx) => (
                      <li key={lIdx}><a href="#" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}>{link.label}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 30, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>{t.footerRights}</p>
              <div style={{ display: 'flex', gap: 24 }}>
                {t.footerBottomLinks?.map((link, idx) => (
                  <a key={idx} href="#" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>{link.label}</a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
