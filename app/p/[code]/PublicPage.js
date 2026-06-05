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
      width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
      background: color, color: '#fff',
      fontSize: label ? 9 : 0, fontWeight: 700, letterSpacing: '0.03em',
    }}>
      {label ?? (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

  // ── 배경 스타일 (position: fixed 레이어에 적용) ──────────────────────────
  const bgStyle = cfg.bg_image_url
    ? {
        backgroundImage: `url(${cfg.bg_image_url})`,
        backgroundSize: cfg.bg_size || 'cover',
        backgroundPosition: cfg.bg_pos || 'center',
        backgroundRepeat: 'no-repeat',
      }
    : cfg.bg_color
      ? { background: cfg.bg_color }
      : {
          background: `radial-gradient(ellipse at 20% 20%, ${color}55 0%, transparent 55%),
            radial-gradient(ellipse at 80% 80%, ${color}44 0%, transparent 50%), ${color}`,
        };

  const overlayOpacity = cfg.bg_image_url ? (cfg.bg_overlay ?? 0.3) : 0;
  const cardOpacity = cfg.card_opacity ?? 0.88;

  return (
    <>
      {/* ── 배경 레이어: 고정, 스크롤 안 됨 ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0,
        ...bgStyle,
      }} />

      {/* ── 배경 어둡기 오버레이 ── */}
      {overlayOpacity > 0 && (
        <div style={{
          position: 'fixed', top: 0, left: 0,
          width: '100%', height: '100%',
          background: `rgba(0,0,0,${overlayOpacity})`,
          zIndex: 1, pointerEvents: 'none',
        }} />
      )}

      {/* ── 콘텐츠 컨테이너: 스크롤되는 영역 ── */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: 680,
        margin: '0 auto',
        minHeight: '100vh',
        padding: '48px 16px 64px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>

        {/* 프로필 이미지 — 96px 원형 */}
        <div style={{
          width: logoSize, height: logoSize,
          borderRadius: '50%',
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.95)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
          flexShrink: 0,
        }}>
          {cfg.logo_url
            ? <img src={cfg.logo_url} alt="logo" style={{
                width: '88%', height: '88%', objectFit: 'contain', display: 'block',
              }} />
            : <span style={{ fontWeight: 800, fontSize: 28, color }}>{(page.title || 'D')[0]}</span>
          }
        </div>

        {/* 페이지 제목 */}
        {page.title && (
          <div style={{
            background: titleBgColor,
            borderRadius: 999,
            padding: '8px 24px',
            marginBottom: 8,
            textAlign: 'center',
          }}>
            <h1 style={{
              margin: 0, fontSize: 15, fontWeight: 700,
              letterSpacing: '0.07em', textTransform: 'uppercase',
              color: titleTextColor,
            }}>
              {page.title}
            </h1>
          </div>
        )}

        {/* 부제목 */}
        {page.subtitle && (
          <p style={{
            margin: '0 0 4px', fontSize: 14,
            color: 'rgba(255,255,255,0.85)',
            textShadow: '0 1px 4px rgba(0,0,0,0.35)',
            textAlign: 'center',
          }}>
            {page.subtitle}
          </p>
        )}

        {/* 다국어 병기 */}
        {langLines.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: 4, marginBottom: 4 }}>
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

        {/* ── 링크 카드 목록 ── */}
        <div style={{ width: '100%', marginTop: 28 }}>
          {page.items.map((item, i) => (
            <a key={i} href={item.url || '#'} target="_blank" rel="noopener noreferrer"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                boxSizing: 'border-box',
                padding: '16px',
                marginBottom: 16,
                borderRadius: 12,
                textAlign: 'center',
                background: hoveredIdx === i
                  ? 'rgba(255,255,255,1)'
                  : `rgba(255,255,255,${cardOpacity})`,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: hoveredIdx === i
                  ? '0 6px 24px rgba(0,0,0,0.18)'
                  : '0 2px 8px rgba(0,0,0,0.10)',
                transform: hoveredIdx === i ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.15s ease',
                textDecoration: 'none',
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.5)',
                position: 'relative',
              }}>
              {/* 왼쪽 배지 */}
              <span style={{ width: 30, flexShrink: 0 }}>
                <Badge icon={item.icon || 'link'} color={color} />
              </span>
              {/* 중앙 텍스트 */}
              <span style={{
                position: 'absolute', left: 0, right: 0,
                textAlign: 'center',
                fontSize: 15, fontWeight: 600, color: '#1a1a1a',
                pointerEvents: 'none',
              }}>
                {item.label}
              </span>
              {/* 오른쪽 화살표 */}
              <span style={{ marginLeft: 'auto', flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke={hoveredIdx === i ? color : `${color}80`}
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transition: 'stroke 0.15s ease', display: 'block' }}>
                  <path d="M9 5l7 7-7 7"/>
                </svg>
              </span>
            </a>
          ))}

          {page.items.length === 0 && (
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', padding: '40px 0' }}>
              링크가 없습니다.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
