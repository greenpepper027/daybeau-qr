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
        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
        background: color, color: '#fff',
        fontSize: 9, fontWeight: 700, letterSpacing: '0.03em',
      }}>
        {flagLabel}
      </span>
    );
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
      background: color, color: '#fff',
    }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
      </svg>
    </span>
  );
}

export default function PublicPage({ page }) {
  const color = page.theme_color || '#E76D26';
  const cfg = page.config || {};
  const lang = cfg.lang || {};
  const logoH = { sm: 56, md: 80, lg: 110 }[cfg.logo_size || 'md'];
  const langLines = [lang.en, lang.zh_hans, lang.zh_hant, lang.ja, lang.th].filter(Boolean);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const titleBgOpacity = cfg.title_bg_opacity ?? 1;
  const titleBgColor = (() => {
    const hex = cfg.title_bg_color || color;
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
    return `rgba(${r},${g},${b},${titleBgOpacity})`;
  })();
  const titleTextColor = cfg.title_color || (titleBgOpacity < 0.3 ? color : '#ffffff');

  const outerBg = cfg.bg_image_url
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
          background: `
            radial-gradient(ellipse at 20% 20%, ${color}55 0%, transparent 55%),
            radial-gradient(ellipse at 80% 80%, ${color}44 0%, transparent 50%),
            ${color}
          `,
        };

  const overlayOpacity = cfg.bg_image_url ? (cfg.bg_overlay ?? 0.3) : 0;

  return (
    <div style={{ minHeight: '100vh', ...outerBg, position: 'relative' }}>
      {/* 배경 오버레이 */}
      {overlayOpacity > 0 && (
        <div style={{
          position: 'fixed', inset: 0,
          background: `rgba(0,0,0,${overlayOpacity})`,
          pointerEvents: 'none', zIndex: 0,
        }} />
      )}

      {/* 메인 컨텐츠 */}
      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 520, margin: '0 auto',
        padding: '56px 20px 80px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>

        {/* 로고 */}
        <div style={{ marginBottom: 20, textAlign: 'center' }}>
          {cfg.logo_url
            ? <img src={cfg.logo_url} alt="logo" style={{
                height: logoH, objectFit: 'contain',
                borderRadius: logoH > 70 ? '50%' : 0,
                background: logoH > 70 ? 'rgba(255,255,255,0.9)' : 'none',
                padding: logoH > 70 ? 8 : 0,
                boxShadow: logoH > 70 ? '0 4px 20px rgba(0,0,0,0.15)' : 'none',
              }} />
            : <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'rgba(255,255,255,0.9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 18, color,
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              }}>D</div>
          }
        </div>

        {/* 제목 + 부제목 */}
        {page.title && (
          <div style={{
            background: titleBgColor,
            borderRadius: 12,
            padding: '10px 28px',
            marginBottom: 10,
            textAlign: 'center',
          }}>
            <h1 style={{
              margin: 0, fontSize: 14, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: titleTextColor,
            }}>
              {page.title}
            </h1>
          </div>
        )}

        {page.subtitle && (
          <p style={{
            margin: '0 0 8px', fontSize: 13,
            color: 'rgba(255,255,255,0.9)',
            textShadow: '0 1px 4px rgba(0,0,0,0.4)',
            textAlign: 'center', fontWeight: 500,
          }}>
            {page.subtitle}
          </p>
        )}

        {/* 다국어 병기 */}
        {langLines.length > 0 && (
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            {langLines.map((l, i) => (
              <p key={i} style={{
                margin: 0, fontSize: 11,
                color: 'rgba(255,255,255,0.7)',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                lineHeight: 1.9,
              }}>{l}</p>
            ))}
          </div>
        )}

        {/* 버튼 목록 */}
        <div style={{ width: '100%', marginTop: langLines.length > 0 ? 0 : 24 }}>
          {page.items.map((item, i) => (
            <a key={i} href={item.url || '#'} target="_blank" rel="noopener noreferrer"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '16px 20px',
                marginBottom: 14,
                borderRadius: 16,
                background: hoveredIdx === i
                  ? 'rgba(255,255,255,0.97)'
                  : `rgba(255,255,255,${cfg.card_opacity ?? 0.86})`,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: hoveredIdx === i
                  ? '0 8px 28px rgba(0,0,0,0.18)'
                  : '0 2px 12px rgba(0,0,0,0.12)',
                transform: hoveredIdx === i ? 'translateY(-2px)' : 'translateY(0)',
                transition: 'all 0.18s ease',
                textDecoration: 'none',
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.6)',
              }}>
              <Badge icon={item.icon || 'link'} color={color} />
              <span style={{
                fontSize: 15, fontWeight: 600, color: '#1a1a1a',
                flex: 1, lineHeight: 1.3,
              }}>{item.label}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke={hoveredIdx === i ? color : `${color}90`}
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ transition: 'stroke 0.18s ease', flexShrink: 0 }}>
                <path d="M9 5l7 7-7 7"/>
              </svg>
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
