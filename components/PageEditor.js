'use client';
import { useState, useRef } from 'react';

// ── 상수 ────────────────────────────────────────────────────────────────────

const ICON_OPTIONS = [
  { value: 'none', label: '없음', group: '기본' },
  { value: 'link', label: '링크', group: '기본' },
  { value: 'google', label: 'Google', group: 'SNS' },
  { value: 'instagram', label: 'Instagram', group: 'SNS' },
  { value: 'facebook', label: 'Facebook', group: 'SNS' },
  { value: 'youtube', label: 'YouTube', group: 'SNS' },
  { value: 'tiktok', label: 'TikTok', group: 'SNS' },
  { value: 'naver', label: 'Naver', group: 'SNS' },
  { value: 'band', label: 'Band', group: 'SNS' },
  { value: 'flag_kr', label: '🇰🇷 한국어', group: '국기' },
  { value: 'flag_cn', label: '🇨🇳 简体中文', group: '국기' },
  { value: 'flag_tw', label: '🇹🇼 繁體中文', group: '국기' },
  { value: 'flag_jp', label: '🇯🇵 日本語', group: '국기' },
  { value: 'flag_en', label: '🇺🇸 English', group: '국기' },
  { value: 'flag_gb', label: '🇬🇧 English (UK)', group: '국기' },
  { value: 'flag_th', label: '🇹🇭 ภาษาไทย', group: '국기' },
  { value: 'flag_id', label: '🇮🇩 Indonesia', group: '국기' },
  { value: 'flag_ru', label: '🇷🇺 Русский', group: '국기' },
  { value: 'flag_vn', label: '🇻🇳 Tiếng Việt', group: '국기' },
  { value: 'flag_sg', label: '🇸🇬 Singapore', group: '국기' },
  { value: 'flag_mn', label: '🇲🇳 Монгол', group: '국기' },
];

const FLAG_META = {
  flag_kr: 'KR', flag_cn: 'CN', flag_tw: 'TW', flag_jp: 'JP',
  flag_en: 'US', flag_gb: 'GB', flag_th: 'TH', flag_id: 'ID',
  flag_ru: 'RU', flag_vn: 'VN', flag_sg: 'SG', flag_mn: 'MN',
};

function hexToRgba(hex, opacity) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

const THEME_PRESETS =['#f43f5e', '#f97316', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#64748b'];

const LANG_FIELDS = [
  { key: 'en', label: 'English' },
  { key: 'zh_hans', label: '中文(简体)' },
  { key: 'zh_hant', label: '中文(繁體)' },
  { key: 'ja', label: '日本語' },
  { key: 'th', label: 'ภาษาไทย' },
];

function defaultConfig() {
  return { logo_url: '', logo_size: 'md', title_color: '', title_bg_color: '', title_bg_opacity: 1, subtitle_color: '', bg_color: '', bg_image_url: '', bg_size: 'cover', bg_pos: 'center', bg_overlay: 0.3, card_opacity: 0.86, lang: { en: '', zh_hans: '', zh_hant: '', ja: '', th: '' } };
}

// ── 아이콘 뱃지 ──────────────────────────────────────────────────────────────

export function IconBadge({ icon, color, size = 'md', useThemeColor = false }) {
  if (!icon || icon === 'none') return null;
  const w = size === 'sm' ? 18 : 24;
  const h = size === 'sm' ? 18 : 24;
  const fs = size === 'sm' ? 7 : 8;
  const r = '50%';

  const flagLabel = FLAG_META[icon];
  if (flagLabel) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: w, height: h, borderRadius: r, flexShrink: 0, background: color, color: '#fff', fontSize: fs, fontWeight: 700, letterSpacing: '0.05em' }}>
        {flagLabel}
      </span>
    );
  }

  // SNS icons
  const snsBg = useThemeColor ? color : ({
    instagram: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)',
    facebook: '#1877f2', youtube: '#ff0000', tiktok: '#010101',
    google: '#fff', naver: '#03c75a', band: '#35c5f0', link: '#6b7280',
  }[icon] || color);
  const iconColor = icon === 'google' ? '#4285F4' : '#fff';

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: w, height: h, borderRadius: r, flexShrink: 0, background: snsBg }}>
      <SnsIcon name={icon} size={size} color={iconColor} />
    </span>
  );
}

function SnsIcon({ name, size, color = '#fff' }) {
  const s = size === 'sm' ? 13 : 18;
  switch (name) {
    case 'link': return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>;
    case 'google': return <svg width={s} height={s} viewBox="0 0 24 24" fill={color}><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>;
    case 'instagram': return <svg width={s} height={s} viewBox="0 0 24 24" fill={color}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>;
    case 'youtube': return <svg width={s} height={s} viewBox="0 0 24 24" fill={color}><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
    case 'facebook': return <svg width={s} height={s} viewBox="0 0 24 24" fill={color}><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
    default: return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>;
  }
}

// ── 동심원 SVG ───────────────────────────────────────────────────────────────

function Rings({ color }) {
  return (
    <svg viewBox="0 0 440 140" style={{ width: '100%', overflow: 'visible', display: 'block' }}>
      {[60, 140, 220, 300, 380].map(cx =>
        [18, 30, 42, 54, 66, 78, 90, 102, 114].map((r, ri) => (
          <circle key={`${cx}-${r}`} cx={cx} cy={140} r={r} fill="none"
            stroke={color} strokeWidth="1.2" opacity={0.15 + ri * 0.04} />
        ))
      )}
    </svg>
  );
}

// ── 미리보기 ──────────────────────────────────────────────────────────────────

export function PagePreview({ form }) {
  const color = form.theme_color || '#f43f5e';
  const cfg = form.config || {};
  const logoSize = { sm: 40, md: 52, lg: 64 }[cfg.logo_size || 'md'];
  const lang = cfg.lang || {};
  const langLines = [lang.en, lang.zh_hans, lang.zh_hant, lang.ja, lang.th].filter(Boolean);
  const titleTextColor = cfg.title_color || '#ffffff';

  // 배경 이미지 → 카드 전체에 적용
  const cardBgStyle = cfg.bg_image_url
    ? { backgroundImage: `url(${cfg.bg_image_url})`, backgroundSize: cfg.bg_size || 'cover', backgroundPosition: cfg.bg_pos || 'center', backgroundRepeat: 'no-repeat' }
    : cfg.bg_color
      ? { background: cfg.bg_color }
      : { background: `linear-gradient(135deg, ${color} 0%, ${color}bb 100%)` };

  const overlayOpacity = cfg.bg_overlay ?? 0.55;
  const cardOpacity = cfg.card_opacity ?? 0.82;
  const subtitleColor = cfg.subtitle_color || 'rgba(255,255,255,0.85)';
  const overlayColor = (() => {
    const hex = (cfg.title_bg_color || '#b4460a').replace('#', '');
    const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
    return `rgba(${r},${g},${b},${overlayOpacity})`;
  })();

  return (
    // 페이지 배경 (단색 그라디언트)
    <div style={{
      background: 'linear-gradient(160deg, #d4845a 0%, #8b4513 100%)',
      borderRadius: 16, padding: '20px 12px', width: 272, flexShrink: 0,
    }}>
      {/* 플로팅 카드 */}
      <div style={{
        borderRadius: 14, overflow: 'hidden',
        boxShadow: '0 6px 24px rgba(0,0,0,0.3)',
        ...cardBgStyle,
        position: 'relative',
      }}>

        {/* 카드 헤더 */}
        <div style={{ position: 'relative', padding: '20px 14px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          {/* 헤더 오버레이 */}
          <div style={{ position: 'absolute', inset: 0, background: overlayColor, zIndex: 0 }} />
          {/* 헤더 콘텐츠 */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: '100%' }}>
            <div style={{
              width: logoSize, height: logoSize, borderRadius: '50%',
              border: '2px solid #fff', overflow: 'hidden',
              background: 'rgba(255,255,255,0.95)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}>
              {cfg.logo_url
                ? <img src={cfg.logo_url} alt="logo" style={{ width: '88%', height: '88%', objectFit: 'contain', display: 'block' }} />
                : <span style={{ fontWeight: 800, fontSize: 16, color }}>{(form.title || 'D')[0]}</span>
              }
            </div>
            {form.title && (
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: titleTextColor, textAlign: 'center', letterSpacing: '0.04em' }}>
                {form.title}
              </p>
            )}
            {form.subtitle && (
              <p style={{ margin: 0, fontSize: 9, color: subtitleColor, textAlign: 'center' }}>
                {form.subtitle}
              </p>
            )}
            {langLines.length > 0 && (
              <div style={{ textAlign: 'center' }}>
                {langLines.map((l, i) => <p key={i} style={{ margin: 0, fontSize: 8, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>{l}</p>)}
              </div>
            )}
          </div>
        </div>

        {/* 버튼 영역 */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: `rgba(180,70,10,${Math.max(0, overlayOpacity - 0.15)})`, pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1, padding: '8px 8px 10px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {form.items.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 10px', borderRadius: 8,
                background: `rgba(255,248,240,${cardOpacity})`,
                border: '1px solid rgba(255,255,255,0.4)',
                backdropFilter: 'blur(6px)',
              }}>
                <IconBadge icon={item.icon || 'link'} color={color} size="sm" useThemeColor />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#2d1a0e', flex: 1, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label || '버튼'}</span>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7"/></svg>
              </div>
            ))}
            {form.items.length === 0 && (
              <p style={{ textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.6)', padding: '8px 0', margin: 0 }}>링크 버튼이 표시됩니다</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 에디터 메인 ───────────────────────────────────────────────────────────────

export default function PageEditor({ initial, onSave, onCancel, saving }) {
  const initCfg = { ...defaultConfig(), ...(initial?.config || {}) };
  initCfg.lang = { ...defaultConfig().lang, ...(initial?.config?.lang || {}) };

  const [form, setForm] = useState({
    title: initial?.title || '',
    subtitle: initial?.subtitle || '',
    theme_color: initial?.theme_color || '#f43f5e',
    custom_code: '',
    items: (initial?.items || []).map(item => ({ icon: 'link', ...item })),
    config: initCfg,
  });
  const [langOpen, setLangOpen] = useState(false);
  const logoRef = useRef(null);
  const bgRef = useRef(null);

  const color = form.theme_color || '#f43f5e';

  function cfg(patch) { setForm(f => ({ ...f, config: { ...f.config, ...patch } })); }
  function setLang(k, v) { setForm(f => ({ ...f, config: { ...f.config, lang: { ...f.config.lang, [k]: v } } })); }
  function uploadFile(ref, cb) { ref.current.click(); }
  function onLogoFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const MAX_W = 600;
      const scale = Math.min(1, MAX_W / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      cfg({ logo_url: canvas.toDataURL('image/png', 1) });
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  }
  function onBgFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const MAX_W = 700;
      const scale = Math.min(1, MAX_W / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // 50,000자 한도에 맞을 때까지 품질 단계적으로 낮춤
      let quality = 0.35;
      let dataUrl;
      do {
        dataUrl = canvas.toDataURL('image/jpeg', quality);
        quality -= 0.05;
      } while (dataUrl.length > 48000 && quality > 0.05);
      cfg({ bg_image_url: dataUrl });
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  }
  function addItem() { setForm(f => ({ ...f, items: [...f.items, { label: '', url: '', icon: 'link' }] })); }
  function setItem(i, k, v) { setForm(f => { const items = [...f.items]; items[i] = { ...items[i], [k]: v }; return { ...f, items }; }); }
  function removeItem(i) { setForm(f => ({ ...f, items: f.items.filter((_, j) => j !== i) })); }
  function moveItem(i, d) { setForm(f => { const items = [...f.items]; const j = i + d; if (j < 0 || j >= items.length) return f; [items[i], items[j]] = [items[j], items[i]]; return { ...f, items }; }); }

  const inp = (val, onChange, ph = '') => ({
    value: val, onChange, placeholder: ph,
    style: { width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '7px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>
      {/* ── 에디터 패널 ── */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 24, overflowY: 'auto', maxHeight: '80vh' }}>
<p style={{ margin: '0 0 16px', fontWeight: 600, fontSize: 15, color: '#111' }}>페이지 설정</p>

        {/* 로고 */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 5 }}>로고</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={() => uploadFile(logoRef)} style={{ fontSize: 12, background: '#f3f4f6', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', color: '#374151' }}>파일 업로드</button>
            {form.config.logo_url ? (
              <>
                <img src={form.config.logo_url} alt="" style={{ height: 32, objectFit: 'contain', border: '1px solid #e5e7eb', borderRadius: 6 }} />
                <button onClick={() => cfg({ logo_url: '' })} style={{ fontSize: 11, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>제거</button>
                {['sm','md','lg'].map(s => (
                  <button key={s} onClick={() => cfg({ logo_size: s })} style={{ width: 28, height: 28, borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, background: form.config.logo_size === s ? color : '#f3f4f6', color: form.config.logo_size === s ? '#fff' : '#6b7280' }}>
                    {s.toUpperCase()}
                  </button>
                ))}
              </>
            ) : (
              <input {...inp(form.config.logo_url, e => cfg({ logo_url: e.target.value }), 'URL 직접 입력')} style={{ flex: 1, border: '1px solid #d1d5db', borderRadius: 8, padding: '7px 12px', fontSize: 12, outline: 'none' }} />
            )}
          </div>
          <input ref={logoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onLogoFile} />
        </div>

        {/* 제목/부제목 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 4 }}>페이지 제목</label>
            <input {...inp(form.title, e => setForm({ ...form, title: e.target.value }), '예: 리뷰 이벤트')} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 4 }}>부제목</label>
            <input {...inp(form.subtitle, e => setForm({ ...form, subtitle: e.target.value }), '예: DayBeau Clinic')} />
          </div>
        </div>

        {/* 색상 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 4 }}>헤더 오버레이 색상</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="color" value={form.config.title_bg_color || '#b4460a'} onChange={e => cfg({ title_bg_color: e.target.value })} style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid #d1d5db', cursor: 'pointer' }} />
              {form.config.title_bg_color && <button onClick={() => cfg({ title_bg_color: '' })} style={{ fontSize: 11, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}>초기화</button>}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 4 }}>제목 텍스트 색상</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="color" value={form.config.title_color || '#ffffff'} onChange={e => cfg({ title_color: e.target.value })} style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid #d1d5db', cursor: 'pointer' }} />
              {form.config.title_color && <button onClick={() => cfg({ title_color: '' })} style={{ fontSize: 11, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}>초기화</button>}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 4 }}>부제목 색상</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="color" value={form.config.subtitle_color || '#ffffff'} onChange={e => cfg({ subtitle_color: e.target.value })} style={{ width: 32, height: 32, borderRadius: 6, border: '1px solid #d1d5db', cursor: 'pointer' }} />
              {form.config.subtitle_color && <button onClick={() => cfg({ subtitle_color: '' })} style={{ fontSize: 11, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}>초기화</button>}
            </div>
          </div>
        </div>

        {!initial && (
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 4 }}>URL 코드 (선택)</label>
            <input {...inp(form.custom_code, e => setForm({ ...form, custom_code: e.target.value }), '비워두면 자동 생성')} />
          </div>
        )}

        {/* 테마 색상 */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>테마 색상</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            {THEME_PRESETS.map(c => (
              <button key={c} onClick={() => setForm({ ...form, theme_color: c })}
                style={{ width: 26, height: 26, borderRadius: '50%', border: form.theme_color === c ? '2.5px solid #111' : '2px solid transparent', background: c, cursor: 'pointer' }} />
            ))}
            <input type="color" value={form.theme_color} onChange={e => setForm({ ...form, theme_color: e.target.value })} style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid #d1d5db', cursor: 'pointer' }} />
          </div>
        </div>

        {/* 배경 */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>배경</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, color: '#6b7280' }}>색상</span>
              <input type="color" value={form.config.bg_color || '#f9fafb'} onChange={e => cfg({ bg_color: e.target.value })} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #d1d5db', cursor: 'pointer' }} />
              {form.config.bg_color && <button onClick={() => cfg({ bg_color: '' })} style={{ fontSize: 11, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}>초기화</button>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, color: '#6b7280' }}>이미지</span>
              <button onClick={() => uploadFile(bgRef)} style={{ fontSize: 11, background: '#f3f4f6', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', color: '#374151' }}>업로드</button>
              {form.config.bg_image_url && <>
                <button onClick={() => cfg({ bg_image_url: '' })} style={{ fontSize: 11, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>제거</button>
                {[['cover','꽉채움'],['contain','전체보기'],['100% auto','너비맞춤']].map(([val, label]) => (
                  <button key={val} onClick={() => cfg({ bg_size: val })}
                    style={{ fontSize: 10, padding: '3px 8px', borderRadius: 5, border: 'none', cursor: 'pointer',
                      background: (form.config.bg_size || 'cover') === val ? color : '#f3f4f6',
                      color: (form.config.bg_size || 'cover') === val ? '#fff' : '#6b7280' }}>
                    {label}
                  </button>
                ))}
                <span style={{ fontSize: 10, color: '#9ca3af', margin: '0 2px' }}>|</span>
                {[['top','위'],['center','중앙'],['bottom','아래']].map(([val, label]) => (
                  <button key={val} onClick={() => cfg({ bg_pos: val })}
                    style={{ fontSize: 10, padding: '3px 8px', borderRadius: 5, border: 'none', cursor: 'pointer',
                      background: (form.config.bg_pos || 'center') === val ? color : '#f3f4f6',
                      color: (form.config.bg_pos || 'center') === val ? '#fff' : '#6b7280' }}>
                    {label}
                  </button>
                ))}
              </>}
            </div>
          </div>
          {form.config.bg_image_url && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, color: '#6b7280', whiteSpace: 'nowrap', width: 52 }}>어둡기</span>
                <input type="range" min="0" max="0.7" step="0.05"
                  value={form.config.bg_overlay ?? 0.3}
                  onChange={e => cfg({ bg_overlay: parseFloat(e.target.value) })}
                  style={{ flex: 1 }} />
                <span style={{ fontSize: 10, color: '#9ca3af', width: 28 }}>
                  {Math.round((form.config.bg_overlay ?? 0.3) * 100)}%
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, color: '#6b7280', whiteSpace: 'nowrap', width: 52 }}>버튼</span>
                <input type="range" min="0.3" max="1" step="0.05"
                  value={form.config.card_opacity ?? 0.86}
                  onChange={e => cfg({ card_opacity: parseFloat(e.target.value) })}
                  style={{ flex: 1 }} />
                <span style={{ fontSize: 10, color: '#9ca3af', width: 28 }}>
                  {Math.round((form.config.card_opacity ?? 0.86) * 100)}%
                </span>
              </div>
            </div>
          )}
          <input ref={bgRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onBgFile} />
        </div>

        {/* 다국어 */}
        <div style={{ marginBottom: 14 }}>
          <button onClick={() => setLangOpen(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <span>{langOpen ? '▼' : '▶'}</span> 다국어 병기 (영·중·일·태)
          </button>
          {langOpen && (
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {LANG_FIELDS.map(({ key, label }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: 10, color: '#9ca3af', marginBottom: 2 }}>{label}</label>
                  <input value={form.config.lang[key]} onChange={e => setLang(key, e.target.value)} placeholder={label}
                    style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 7, padding: '6px 10px', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 링크 버튼 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#6b7280' }}>링크 버튼</label>
            <button onClick={addItem} style={{ fontSize: 12, fontWeight: 600, color, background: 'none', border: 'none', cursor: 'pointer' }}>+ 추가</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {form.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', background: '#f9fafb', borderRadius: 10, padding: 8 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 2 }}>
                  <button onClick={() => moveItem(i, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, color: '#9ca3af', lineHeight: 1 }}>▲</button>
                  <button onClick={() => moveItem(i, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, color: '#9ca3af', lineHeight: 1 }}>▼</button>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <select value={item.icon} onChange={e => setItem(i, 'icon', e.target.value)}
                      style={{ border: '1px solid #d1d5db', borderRadius: 7, padding: '5px 6px', fontSize: 11, background: '#fff', cursor: 'pointer' }}>
                      {['기본', 'SNS', '국기'].map(g => (
                        <optgroup key={g} label={g}>
                          {ICON_OPTIONS.filter(o => o.group === g).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </optgroup>
                      ))}
                    </select>
                    <input value={item.label} onChange={e => setItem(i, 'label', e.target.value)} placeholder="버튼 텍스트"
                      style={{ flex: 1, border: '1px solid #d1d5db', borderRadius: 7, padding: '5px 8px', fontSize: 12, outline: 'none' }} />
                  </div>
                  <input value={item.url} onChange={e => setItem(i, 'url', e.target.value)} placeholder="https://..."
                    style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 7, padding: '5px 8px', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <button onClick={() => removeItem(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 13, paddingTop: 2 }}>✕</button>
              </div>
            ))}
            {form.items.length === 0 && <p style={{ textAlign: 'center', fontSize: 12, color: '#d1d5db', padding: '12px 0' }}>버튼을 추가해보세요</p>}
          </div>
        </div>

        {/* 저장/취소 */}
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button onClick={() => onSave(form)} disabled={saving}
            style={{ background: form.theme_color || '#f43f5e', color: '#fff', fontSize: 14, fontWeight: 700, padding: '10px 28px', borderRadius: 10, border: '2px solid #ea6c00', cursor: 'pointer', boxShadow: '0 2px 8px rgba(249,115,22,0.4)' }}>
            {saving ? '저장 중...' : (initial ? '저장' : '만들기')}
          </button>
          <button onClick={onCancel} style={{ fontSize: 14, color: '#6b7280', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 10, cursor: 'pointer', padding: '10px 16px' }}>
            취소
          </button>
        </div>
      </div>

      {/* ── 미리보기 패널 ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'sticky', top: 16, alignSelf: 'flex-start' }}>
        <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 10, fontWeight: 600 }}>미리보기</p>
        <PagePreview form={form} />
      </div>
    </div>
  );
}
