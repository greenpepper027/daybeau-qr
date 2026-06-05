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
      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
      background: color, color: '#fff',
      fontSize: label ? 9 : 0, fontWeight: 700, letterSpacing: '0.03em',
      marginRight: 10,
    }}>
      {label ?? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
        </svg>
      )}
    </span>
  );
}

export default function PublicPage({ page }) {
  const color = page.theme_color || '#E76D26';
  const cfg = page.config || {};
  const lang = cfg.lang || {};
  const logoSize = { sm: 72, md: 96, lg: 120 }[cfg.logo_size || 'md'];
  const langLines = [lang.en, lang.zh_hans, lang.zh_hant, lang.ja, lang.th].filter(Boolean);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const titleBgOpacity = cfg.title_bg_opacity ?? 1;
  const titleBgColor = (() => {
    const hex = cfg.title_bg_color || color;
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
    return `rgba(${r},${g},${b},${titleBgOpacity})`;
  })();
  const titleTextColor = cfg.title_color || '#ffffff';
  const cardOpacity = cfg.card_opacity ?? 0.85;

  // [1] 전체 페이지 wrapper 배경
  const bgStyle = cfg.bg_image_url
    ? {
        backgroundImage: `url(${cfg.bg_image_url})`,
        backgroundSize: cfg.bg_size || 'cover',
        backgroundPosition: cfg.bg_pos || 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }
    : cfg.bg_color
      ? { background: cfg.bg_color }
      : {
          background: `radial-gradient(ellipse at 20% 20%, ${color}55 0%, transparent 55%),
            radial-gradient(ellipse at 80% 80%, ${color}44 0%, transparent 50%), ${color}`,
        };

  const overlayOpacity = cfg.bg_image_url ? (cfg.bg_overlay ?? 0.3) : 0;

  return (
    /* [1] 전체 페이지 wrapper */
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      overflowY: 'auto',
      ...bgStyle,
    }}>
      {/* 배경 오버레이 */}
      {overlayOpacity > 0 && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: `rgba(0,0,0,${overlayOpacity})`,
          pointerEvents: 'none', zIndex: 0,
        }} />
      )}

      {/* [2] 콘텐츠 컬럼 */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%',
        maxWidth: 680,
        margin: '0 auto',
        padding: '48px 16px 40px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
      }}>

        {/* [3] 프로필 이미지 */}
        <div style={{
          width: logoSize, height: logoSize,
          borderRadius: '50%',
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.95)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          marginBottom: 8,
        }}>
          {cfg.logo_url
            ? <img src={cfg.logo_url} alt="logo" style={{
                width: '88%', height: '88%',
                objectFit: 'contain',
                display: 'block',
              }} />
            : <span style={{ fontWeight: 800, fontSize: 28, color }}>
                {(page.title || 'D')[0]}
              </span>
          }
        </div>

        {/* [4] 제목 */}
        {page.title && (
          <div style={{
            background: titleBgColor,
            borderRadius: 999,
            padding: '8px 24px',
          }}>
            <h1 style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              textAlign: 'center',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: titleTextColor,
            }}>
              {page.title}
            </h1>
          </div>
        )}

        {/* [5] 부제목 */}
        {page.subtitle && (
          <p style={{
            margin: '0 0 12px',
            fontSize: 14,
            textAlign: 'center',
            opacity: 0.85,
            color: 'rgba(255,255,255,0.9)',
            textShadow: '0 1px 4px rgba(0,0,0,0.3)',
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
                color: 'rgba(255,255,255,0.6)',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                lineHeight: 1.9,
              }}>{l}</p>
            ))}
          </div>
        )}

        {/* [6] 링크 카드 목록 */}
        <div style={{ width: '100%', marginTop: 12 }}>
          {page.items.map((item, i) => (
            <a key={i} href={item.url || '#'} target="_blank" rel="noopener noreferrer"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                boxSizing: 'border-box',
                padding: '16px 20px',
                borderRadius: 12,
                background: `rgba(255,255,255,${hoveredIdx === i ? 1 : cardOpacity})`,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
                color: '#1a1a1a',
                boxShadow: hoveredIdx === i
                  ? '0 4px 16px rgba(0,0,0,0.14)'
                  : '0 2px 8px rgba(0,0,0,0.08)',
                marginBottom: 8,
                transform: hoveredIdx === i ? 'scale(1.02)' : 'scale(1)',
                transition: 'transform 0.1s, box-shadow 0.1s',
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.5)',
                position: 'relative',
              }}>
              {/* 왼쪽 배지 (레이아웃 균형) */}
              <span style={{ position: 'absolute', left: 20 }}>
                <Badge icon={item.icon || 'link'} color={color} />
              </span>
              {item.label}
            </a>
          ))}

          {page.items.length === 0 && (
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', padding: '40px 0' }}>
              링크가 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
