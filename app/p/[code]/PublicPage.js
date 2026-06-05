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
          background: `radial-gradient(ellipse at 20% 20%, ${color}55 0%, transparent 55%),
            radial-gradient(ellipse at 80% 80%, ${color}44 0%, transparent 50%), ${color}`,
        };

  const overlayOpacity = cfg.bg_image_url ? (cfg.bg_overlay ?? 0.3) : 0;

  return (
    <div style={{ minHeight: '100vh', ...outerBg, position: 'relative' }}>
      {overlayOpacity > 0 && (
        <div style={{
          position: 'fixed', inset: 0,
          background: `rgba(0,0,0,${overlayOpacity})`,
          pointerEvents: 'none', zIndex: 0,
        }} />
      )}

      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: 680, margin: '0 auto',
        padding: '60px 24px 80px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>

        {/* 아바타/로고 — 원형 컨테이너, 이미지는 contain */}
        <div style={{
          width: logoSize, height: logoSize, borderRadius: '50%',
          background: 'rgba(255,255,255,0.95)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', flexShrink: 0, marginBottom: 20,
        }}>
          {cfg.logo_url
            ? <img src={cfg.logo_url} alt="logo" style={{
                width: '88%', height: '88%', objectFit: 'contain',
              }} />
            : <span style={{ fontWeight: 800, fontSize: 28, color }}>D</span>
          }
        </div>

        {/* 이름 (page.title) */}
        {page.title && (
          <h1 style={{
            margin: '0 0 8px', textAlign: 'center',
            fontSize: 22, fontWeight: 700,
            color: titleTextColor,
            textShadow: titleBgOpacity < 0.5 ? 'none' : '0 1px 6px rgba(0,0,0,0.35)',
            // 제목 바 배경이 설정된 경우 pill로 표시
            ...(titleBgOpacity > 0.1
              ? {
                  background: titleBgColor,
                  padding: '8px 28px',
                  borderRadius: 999,
                }
              : {}),
          }}>
            {page.title}
          </h1>
        )}

        {/* 부제목 */}
        {page.subtitle && (
          <p style={{
            margin: '0 0 6px', fontSize: 14,
            color: 'rgba(255,255,255,0.88)',
            textShadow: '0 1px 4px rgba(0,0,0,0.4)',
            textAlign: 'center', fontWeight: 400,
          }}>
            {page.subtitle}
          </p>
        )}

        {/* 다국어 병기 */}
        {langLines.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: 6 }}>
            {langLines.map((l, i) => (
              <p key={i} style={{
                margin: 0, fontSize: 11,
                color: 'rgba(255,255,255,0.65)',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                lineHeight: 1.9,
              }}>{l}</p>
            ))}
          </div>
        )}

        {/* 버튼 목록 — Linktree 스타일 pill 버튼 */}
        <div style={{ width: '100%', marginTop: 32 }}>
          {page.items.map((item, i) => (
            <a key={i} href={item.url || '#'} target="_blank" rel="noopener noreferrer"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                display: 'flex', alignItems: 'center',
                padding: '0 20px',
                height: 56,
                marginBottom: 16,
                borderRadius: 999,
                background: hoveredIdx === i
                  ? 'rgba(255,255,255,1)'
                  : `rgba(255,255,255,${cfg.card_opacity ?? 0.88})`,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: hoveredIdx === i
                  ? '0 6px 24px rgba(0,0,0,0.2)'
                  : '0 2px 10px rgba(0,0,0,0.12)',
                transform: hoveredIdx === i ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.15s ease',
                textDecoration: 'none',
                cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.5)',
                position: 'relative',
              }}>
              {/* 왼쪽 배지 자리 (레이아웃 균형용) */}
              <span style={{ width: 30, flexShrink: 0 }}>
                <Badge icon={item.icon || 'link'} color={color} />
              </span>
              {/* 가운데 정렬 텍스트 */}
              <span style={{
                position: 'absolute', left: 0, right: 0,
                textAlign: 'center',
                fontSize: 15, fontWeight: 600, color: '#1a1a1a',
                pointerEvents: 'none',
              }}>{item.label}</span>
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
    </div>
  );
}
