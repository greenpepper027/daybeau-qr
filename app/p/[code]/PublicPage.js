'use client';
import { useState } from 'react';

const FLAG_LABELS = {
  flag_kr: 'KR', flag_cn: 'CN', flag_tw: 'TW', flag_jp: 'JP',
  flag_en: 'US', flag_gb: 'GB', flag_th: 'TH', flag_id: 'ID',
  flag_ru: 'RU', flag_vn: 'VN', flag_sg: 'SG', flag_mn: 'MN',
};

function Badge({ icon, color }) {
  if (!icon || icon === 'none') return null;
  const label = FLAG_LABELS[icon];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
      background: color, color: '#fff',
      fontSize: label ? 8 : 0, fontWeight: 700, letterSpacing: '0.03em',
    }}>
      {label ?? (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
        </svg>
      )}
    </span>
  );
}

/* ─── 공유 버튼 아이콘 ─── */
function ShareIcon() {
  const [copied, setCopied] = useState(false);
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      if (navigator.share) navigator.share({ url: window.location.href });
    }
  };
  return (
    <button onClick={handleShare} title={copied ? '복사됨!' : '링크 복사'} style={{
      width: 36, height: 36, borderRadius: '50%',
      background: 'rgba(255,255,255,0.18)', border: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', color: '#fff', backdropFilter: 'blur(8px)',
    }}>
      {copied
        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
      }
    </button>
  );
}

export default function PublicPage({ page }) {
  const color = page.theme_color || '#c87941';
  const cfg = page.config || {};
  const lang = cfg.lang || {};
  const logoSize = { sm: 64, md: 80, lg: 100 }[cfg.logo_size || 'md'];
  const langLines = [lang.en, lang.zh_hans, lang.zh_hant, lang.ja, lang.th].filter(Boolean);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const titleTextColor = cfg.title_color || '#ffffff';
  const cardBg = '#fdf6ee';
  const btnBg = '#fff8f0';
  const btnHoverBg = '#fff0dc';

  // ── 레이어1 배경 스타일 ──────────────────────────────────────────────────
  const bgStyle = cfg.bg_image_url
    ? {
        backgroundImage: `url(${cfg.bg_image_url})`,
        backgroundSize: cfg.bg_size || 'cover',
        backgroundPosition: cfg.bg_pos || 'center',
        backgroundRepeat: 'no-repeat',
      }
    : cfg.bg_color
      ? { background: cfg.bg_color }
      : { background: `linear-gradient(135deg, ${color} 0%, ${color}bb 100%)` };

  const overlayOpacity = cfg.bg_image_url ? (cfg.bg_overlay ?? 0.3) : 0;

  return (
    <>
      {/* ══ 레이어 1: 고정 배경 ══ */}
      <div style={{
        position: 'fixed', inset: 0,
        zIndex: 0,
        ...bgStyle,
      }} />
      {overlayOpacity > 0 && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1,
          background: `rgba(0,0,0,${overlayOpacity})`,
          pointerEvents: 'none',
        }} />
      )}

      {/* ══ 레이어 2: 스크롤 컨테이너 ══ */}
      <div style={{
        position: 'relative', zIndex: 2,
        width: '100%', minHeight: '100vh',
        overflowY: 'auto',
        display: 'flex',
        justifyContent: 'center',
        padding: '64px 16px 48px',
        boxSizing: 'border-box',
      }}>

        {/* ══ 레이어 3: 중앙 카드 wrapper (absolute 버튼용 position relative) ══ */}
        <div style={{
          position: 'relative',
          width: '100%', maxWidth: 480,
          height: 'fit-content',
        }}>
          {/* 카드 상단 바깥 — 아이콘 버튼 2개 */}
          <div style={{
            position: 'absolute', top: -44, left: 0,
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,0.18)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff',
          }}>
            {/* 링크트리 스타일 아이콘 (별표/앱 아이콘) */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
            </svg>
          </div>
          <div style={{ position: 'absolute', top: -44, right: 0 }}>
            <ShareIcon />
          </div>

          {/* ── 중앙 플로팅 카드 ── */}
          <div style={{
            width: '100%',
            borderRadius: 20,
            overflow: 'hidden',
            background: cardBg,
            boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
          }}>

            {/* 【카드 헤더】 */}
            <div style={{
              background: color,
              padding: '32px 24px 24px',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 8,
            }}>
              {/* 로고 */}
              <div style={{
                width: logoSize, height: logoSize,
                borderRadius: '50%',
                border: '3px solid #fff',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.95)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
              }}>
                {cfg.logo_url
                  ? <img src={cfg.logo_url} alt="logo" style={{
                      width: '90%', height: '90%', objectFit: 'contain', display: 'block',
                    }} />
                  : <span style={{ fontWeight: 800, fontSize: 26, color }}>
                      {(page.title || 'D')[0]}
                    </span>
                }
              </div>

              {/* 제목 */}
              {page.title && (
                <h1 style={{
                  margin: 0, fontSize: 20, fontWeight: 700,
                  color: titleTextColor, textAlign: 'center',
                  letterSpacing: '0.04em',
                  textShadow: '0 1px 4px rgba(0,0,0,0.2)',
                }}>
                  {page.title}
                </h1>
              )}

              {/* 부제목 */}
              {page.subtitle && (
                <p style={{
                  margin: 0, fontSize: 13,
                  color: 'rgba(255,255,255,0.85)',
                  textAlign: 'center',
                }}>
                  {page.subtitle}
                </p>
              )}

              {/* 다국어 병기 */}
              {langLines.length > 0 && (
                <div style={{ textAlign: 'center', marginTop: 2 }}>
                  {langLines.map((l, i) => (
                    <p key={i} style={{
                      margin: 0, fontSize: 11,
                      color: 'rgba(255,255,255,0.65)',
                      lineHeight: 1.8,
                    }}>{l}</p>
                  ))}
                </div>
              )}
            </div>

            {/* 【링크 버튼 영역】 */}
            <div style={{
              padding: '16px 16px 24px',
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              {page.items.map((item, i) => (
                <a key={i} href={item.url || '#'} target="_blank" rel="noopener noreferrer"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    borderRadius: 10,
                    background: hoveredIdx === i ? btnHoverBg : btnBg,
                    border: '1px solid rgba(0,0,0,0.06)',
                    fontSize: 14, fontWeight: 500,
                    color: '#2d1a0e',
                    textDecoration: 'none',
                    boxShadow: hoveredIdx === i
                      ? '0 3px 10px rgba(0,0,0,0.10)'
                      : '0 1px 4px rgba(0,0,0,0.06)',
                    transform: hoveredIdx === i ? 'translateY(-1px)' : 'translateY(0)',
                    transition: 'background 0.15s, transform 0.15s, box-shadow 0.15s',
                    cursor: 'pointer',
                  }}>
                  <Badge icon={item.icon || 'link'} color={color} />
                  <span style={{ flex: 1, textAlign: 'center' }}>{item.label}</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke={hoveredIdx === i ? color : `${color}99`}
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ flexShrink: 0, transition: 'stroke 0.15s' }}>
                    <path d="M9 5l7 7-7 7"/>
                  </svg>
                </a>
              ))}

              {page.items.length === 0 && (
                <p style={{ textAlign: 'center', color: '#9ca3af', padding: '28px 0', margin: 0 }}>
                  링크가 없습니다.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
