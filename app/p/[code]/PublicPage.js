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
  const color = page.theme_color || '#c27440';
  const cfg = page.config || {};
  const lang = cfg.lang || {};
  const logoSize = { sm: 64, md: 80, lg: 100 }[cfg.logo_size || 'md'];
  const langLines = [lang.en, lang.zh_hans, lang.zh_hant, lang.ja, lang.th].filter(Boolean);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const titleTextColor = cfg.title_color || '#ffffff';
  const subtitleColor = cfg.subtitle_color || 'rgba(255,255,255,0.9)';

  // ── 배경 이미지는 카드 전체 배경에 사용 ───────────────────────────────────
  const headerBgImage = cfg.bg_image_url;
  const headerBgSize  = cfg.bg_size || 'cover';
  const headerBgPos   = cfg.bg_pos  || 'center top';
  const overlayOpacity = cfg.bg_overlay ?? 0.55;
  const cardOpacity = cfg.card_opacity ?? 0.82;

  // 헤더 오버레이 색상 (title_bg_color), 기본값 #b4460a
  const overlayColor = (() => {
    const hex = (cfg.title_bg_color || '#b4460a').replace('#', '');
    const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
    return `rgba(${r},${g},${b},${overlayOpacity})`;
  })();

  // ── 헤더 색상 (이미지 없을 때 fallback) ──────────────────────────────────
  const headerBg = headerBgImage
    ? { backgroundImage: `url(${headerBgImage})`, backgroundSize: headerBgSize, backgroundPosition: headerBgPos }
    : cfg.bg_color
      ? { background: cfg.bg_color }
      : { background: color };

  return (
    /* 【1】 페이지 전체 배경 — 뷰포트 고정, 카드만 중앙 배치 */
    <div style={{
      background: 'linear-gradient(160deg, #d4845a 0%, #8b4513 100%)',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 16px',
      boxSizing: 'border-box',
      overflow: 'hidden',
    }}>

      {/* 카드 wrapper — 절대 위치 버튼용 */}
      <div style={{
        position: 'relative', width: '100%', maxWidth: 480,
        height: '100%', display: 'flex', flexDirection: 'column',
      }}>

        {/* 카드 상단 바깥 버튼 */}
        <div style={{
          position: 'absolute', top: -36, left: 0,
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(255,255,255,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
          </svg>
        </div>
        <div style={{ position: 'absolute', top: -36, right: 0 }}>
          <ShareIcon />
        </div>

        {/* 【2】 중앙 카드 — 뷰포트 높이에 맞게 늘어남, 내부만 스크롤 */}
        <div style={{
          flex: 1,
          borderRadius: 20,
          overflow: 'hidden',
          ...headerBg,
          boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}>

          {/* 카드 내부 스크롤 영역 — 헤더+버튼 전체 스크롤 */}
          <div style={{ flex: 1, overflowY: 'auto' }}>

          {/* 【3】 카드 헤더 */}
          <div style={{
            position: 'relative',
            padding: '40px 24px 28px',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 10,
          }}>
            {/* 헤더 오버레이 */}
            <div style={{
              position: 'absolute', inset: 0,
              background: overlayColor,
              zIndex: 0,
            }} />

            {/* 헤더 콘텐츠 — 오버레이 위 */}
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: '100%' }}>
              {/* 로고 */}
              <div style={{
                width: logoSize, height: logoSize,
                borderRadius: '50%',
                border: '3px solid #fff',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.95)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
              }}>
                {cfg.logo_url
                  ? <img src={cfg.logo_url} alt="logo" style={{ width: '90%', height: '90%', objectFit: 'contain', display: 'block' }} />
                  : <span style={{ fontWeight: 800, fontSize: 26, color }}>{(page.title || 'D')[0]}</span>
                }
              </div>

              {/* 제목 */}
              {page.title && (
                <h1 style={{
                  margin: 0, fontSize: 20, fontWeight: 700,
                  color: titleTextColor, textAlign: 'center',
                  letterSpacing: '0.04em',
                  textShadow: '0 1px 4px rgba(0,0,0,0.4)',
                }}>
                  {page.title}
                </h1>
              )}

              {/* 부제목 */}
              {page.subtitle && (
                <p style={{
                  margin: 0, fontSize: 13,
                  color: subtitleColor,
                  textAlign: 'center',
                }}>
                  {page.subtitle}
                </p>
              )}

              {/* 다국어 병기 */}
              {langLines.length > 0 && (
                <div style={{ textAlign: 'center' }}>
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
          </div>

          {/* 【4】 링크 버튼 영역 */}
          <div style={{ position: 'relative' }}>
            {/* 버튼 영역 오버레이 — 헤더보다 밝게 */}
            <div style={{
              position: 'absolute', inset: 0,
              background: `rgba(180,70,10,${Math.max(0, overlayOpacity - 0.15)})`,
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'relative', zIndex: 1,
              padding: 16,
              display: 'flex', flexDirection: 'column', gap: 14,
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
                  background: hoveredIdx === i ? `rgba(255,248,240,${Math.min(1, cardOpacity + 0.1)})` : `rgba(255,248,240,${cardOpacity})`,
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  fontSize: 15, fontWeight: 700,
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
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', padding: '28px 0', margin: 0 }}>
                링크가 없습니다.
              </p>
            )}
            </div>
          </div>
          </div>{/* 스크롤 영역 끝 */}
        </div>
      </div>
    </div>
  );
}
