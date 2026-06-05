'use client';
import { useState } from 'react';

const FLAG_LABELS = {
  flag_kr: 'KR', flag_cn: 'CN', flag_tw: 'TW', flag_jp: 'JP',
  flag_en: 'US', flag_gb: 'GB', flag_th: 'TH', flag_id: 'ID',
  flag_ru: 'RU', flag_vn: 'VN', flag_sg: 'SG', flag_mn: 'MN',
};

function Badge({ icon, color }) {
  if (!icon || icon === 'none') return null;

  const flagLabel = FLAG_LABELS[icon];
  if (flagLabel) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
        background: color, color: '#fff',
        fontSize: 8, fontWeight: 700, letterSpacing: '0.03em',
      }}>
        {flagLabel}
      </span>
    );
  }

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
      background: color, color: '#fff',
    }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
      </svg>
    </span>
  );
}

function Rings({ color }) {
  return (
    <svg viewBox="0 0 440 140" style={{ width: '100%', overflow: 'visible', display: 'block' }}>
      {[60, 140, 220, 300, 380].map(cx =>
        [18, 30, 42, 54, 66, 78, 90, 102, 114].map((r, ri) => (
          <circle key={`${cx}-${r}`} cx={cx} cy={140} r={r}
            fill="none" stroke={color} strokeWidth="1.2"
            opacity={0.12 + ri * 0.035} />
        ))
      )}
    </svg>
  );
}

export default function PublicPage({ page }) {
  const color = page.theme_color || '#E76D26';
  const cfg = page.config || {};
  const lang = cfg.lang || {};
  const logoH = { sm: 32, md: 52, lg: 80 }[cfg.logo_size || 'md'];
  const titleBgOpacity = cfg.title_bg_opacity ?? 1;
  const titleBgColor = (() => {
    const hex = cfg.title_bg_color || color;
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
    return `rgba(${r},${g},${b},${titleBgOpacity})`;
  })();
  const titleTextColor = cfg.title_color || (titleBgOpacity < 0.3 ? color : '#ffffff');
  const langLines = [lang.en, lang.zh_hans, lang.zh_hant, lang.ja, lang.th].filter(Boolean);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // 배경: 이미지 > bg_color > 브랜드 그라디언트
  const outerBg = cfg.bg_image_url
    ? {
        backgroundImage: `url(${cfg.bg_image_url})`,
        backgroundSize: cfg.bg_size || 'cover',
        backgroundPosition: cfg.bg_pos || 'center',
        backgroundRepeat: 'no-repeat',
      }
    : cfg.bg_color
      ? { background: cfg.bg_color }
      : {
          background: `
            radial-gradient(ellipse at 20% 20%, ${color}55 0%, transparent 55%),
            radial-gradient(ellipse at 80% 80%, ${color}44 0%, transparent 50%),
            ${color}
          `,
        };

  const overlayOpacity = cfg.bg_image_url ? (cfg.bg_overlay ?? 0.3) : 0;

  return (
    <div style={{
      minHeight: '100vh', ...outerBg,
      display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
      padding: '24px 8px 60px',
      position: 'relative',
    }}>
      {overlayOpacity > 0 && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `rgba(0,0,0,${overlayOpacity})`,
          pointerEvents: 'none',
        }} />
      )}
      {/* 유리 카드 */}
      <div style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>
        <div style={{
          background: `rgba(255,255,255,${cfg.card_opacity ?? 0.86})`,
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 28,
          boxShadow: '0 12px 48px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.7)',
          border: '1px solid rgba(255,255,255,0.5)',
          overflow: 'hidden',
        }}>

          {/* 로고 영역 */}
          <div style={{
            padding: '28px 24px 16px', textAlign: 'center',
          }}>
            {cfg.logo_url
              ? <img src={cfg.logo_url} alt="logo" style={{ height: logoH, objectFit: 'contain', display: 'block', margin: '0 auto' }} />
              : <p style={{ margin: 0, fontWeight: 800, fontSize: 20, letterSpacing: '0.12em', color }}>DAYBEAU</p>
            }
            {page.subtitle && (
              <p style={{ margin: '6px 0 0', fontSize: 12, color, fontWeight: 500, opacity: 0.85 }}>
                {page.subtitle}
              </p>
            )}
          </div>

          {/* 제목 밴드 */}
          {page.title && (
            <div style={{ background: titleBgColor, padding: '10px 24px', textAlign: 'center', borderTop: `1px solid ${color}22`, borderBottom: `1px solid ${color}22` }}>
              <h1 style={{
                margin: 0, fontSize: 13, fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase', color: titleTextColor,
              }}>
                {page.title}
              </h1>
            </div>
          )}

          {/* 버튼 목록 */}
          <div style={{ padding: '14px 14px 8px' }}>
            {langLines.length > 0 && (
              <div style={{ textAlign: 'center', marginBottom: 12 }}>
                {langLines.map((l, i) => (
                  <p key={i} style={{ margin: 0, fontSize: 11, color: '#9ca3af', lineHeight: 1.8 }}>{l}</p>
                ))}
              </div>
            )}

            {page.items.map((item, i) => (
              <a key={i} href={item.url || '#'} target="_blank" rel="noopener noreferrer"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px', marginBottom: 8,
                  borderRadius: 14,
                  background: hoveredIdx === i ? '#ffffff' : 'rgba(255,255,255,0.9)',
                  boxShadow: hoveredIdx === i
                    ? `0 6px 20px rgba(0,0,0,0.12)`
                    : '0 1px 4px rgba(0,0,0,0.08)',
                  transform: hoveredIdx === i ? 'translateY(-1px)' : 'translateY(0)',
                  transition: 'all 0.18s ease',
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}>
                <Badge icon={item.icon || 'link'} color={color} />
                <span style={{
                  fontSize: 14, fontWeight: 600, color: '#222',
                  flex: 1,
                }}>{item.label}</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke={hoveredIdx === i ? color : `${color}80`}
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transition: 'stroke 0.18s ease', flexShrink: 0 }}>
                  <path d="M9 5l7 7-7 7"/>
                </svg>
              </a>
            ))}

            {page.items.length === 0 && (
              <p style={{ textAlign: 'center', color: '#d1d5db', padding: '28px 0' }}>링크가 없습니다.</p>
            )}
          </div>

          {/* 동심원 */}
          <div style={{ height: 60, overflow: 'hidden' }}>
            <Rings color={color} />
          </div>
        </div>
      </div>
    </div>
  );
}
