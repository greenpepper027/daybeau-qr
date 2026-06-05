'use client';
import { useState, useRef } from 'react';
import ConcentricRings from './ConcentricRings';

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

const THEME_PRESETS = ['#f43f5e', '#f97316', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#64748b'];

const LANG_FIELDS = [
  { key: 'en', label: 'English' },
  { key: 'zh_hans', label: '中文(简体)' },
  { key: 'zh_hant', label: '中文(繁體)' },
  { key: 'ja', label: '日本語' },
  { key: 'th', label: 'ภาษาไทย' },
];

const LOGO_SIZES = [
  { value: 'sm', label: 'S', px: 32 },
  { value: 'md', label: 'M', px: 48 },
  { value: 'lg', label: 'L', px: 72 },
];

function defaultConfig() {
  return {
    logo_url: '',
    logo_size: 'md',
    title_color: '',
    subtitle_color: '',
    bg_color: '',
    bg_image_url: '',
    lang: { en: '', zh_hans: '', zh_hant: '', ja: '', th: '' },
  };
}

export default function PageEditor({ initial, onSave, onCancel, saving }) {
  const initConfig = { ...defaultConfig(), ...(initial?.config || {}) };
  initConfig.lang = { ...defaultConfig().lang, ...(initial?.config?.lang || {}) };

  const [form, setForm] = useState({
    title: initial?.title || '',
    subtitle: initial?.subtitle || '',
    theme_color: initial?.theme_color || '#f43f5e',
    custom_code: '',
    items: initial?.items || [],
    config: initConfig,
  });

  const [langOpen, setLangOpen] = useState(false);
  const logoInputRef = useRef(null);
  const bgInputRef = useRef(null);

  function setConfig(patch) {
    setForm((f) => ({ ...f, config: { ...f.config, ...patch } }));
  }
  function setLang(key, val) {
    setForm((f) => ({ ...f, config: { ...f.config, lang: { ...f.config.lang, [key]: val } } }));
  }
  function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setConfig({ logo_url: ev.target.result });
    reader.readAsDataURL(file);
  }
  function handleBgUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setConfig({ bg_image_url: ev.target.result });
    reader.readAsDataURL(file);
  }
  function addItem() {
    setForm((f) => ({ ...f, items: [...f.items, { label: '', url: '', icon: 'link' }] }));
  }
  function updateItem(i, field, value) {
    setForm((f) => { const items = [...f.items]; items[i] = { ...items[i], [field]: value }; return { ...f, items }; });
  }
  function removeItem(i) {
    setForm((f) => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));
  }
  function moveItem(i, dir) {
    setForm((f) => {
      const items = [...f.items]; const j = i + dir;
      if (j < 0 || j >= items.length) return f;
      [items[i], items[j]] = [items[j], items[i]];
      return { ...f, items };
    });
  }

  const color = form.theme_color || '#f43f5e';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ── Editor ── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 overflow-y-auto max-h-[80vh]">
        <h2 className="font-semibold text-gray-800">페이지 설정</h2>

        {/* Logo */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">로고</label>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => logoInputRef.current.click()}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-gray-600 transition-colors shrink-0">
              파일 업로드
            </button>
            {form.config.logo_url ? (
              <>
                <img src={form.config.logo_url} alt="logo" className="h-8 object-contain rounded border border-gray-200" />
                <button onClick={() => setConfig({ logo_url: '' })} className="text-xs text-red-400 hover:text-red-500">제거</button>
                <div className="flex gap-1 ml-1">
                  {LOGO_SIZES.map((s) => (
                    <button key={s.value} onClick={() => setConfig({ logo_size: s.value })}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${form.config.logo_size === s.value ? 'text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                      style={form.config.logo_size === s.value ? { background: color } : {}}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <input value={form.config.logo_url} onChange={(e) => setConfig({ logo_url: e.target.value })}
                placeholder="또는 URL 직접 입력"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 min-w-0" />
            )}
          </div>
          <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
        </div>

        {/* Title / Subtitle */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">페이지 제목</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="예: 시술 후 주의사항"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">부제목</label>
            <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder="예: DayBeau Clinic"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" />
          </div>
        </div>

        {/* Title/subtitle colors */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">제목 색상</label>
            <div className="flex items-center gap-2">
              <input type="color" value={form.config.title_color || color}
                onChange={(e) => setConfig({ title_color: e.target.value })}
                className="w-8 h-8 rounded border border-gray-300 cursor-pointer" />
              {form.config.title_color && (
                <button onClick={() => setConfig({ title_color: '' })} className="text-xs text-gray-400 hover:text-gray-600">초기화</button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">부제목 색상</label>
            <div className="flex items-center gap-2">
              <input type="color" value={form.config.subtitle_color || '#ffffff'}
                onChange={(e) => setConfig({ subtitle_color: e.target.value })}
                className="w-8 h-8 rounded border border-gray-300 cursor-pointer" />
              {form.config.subtitle_color && (
                <button onClick={() => setConfig({ subtitle_color: '' })} className="text-xs text-gray-400 hover:text-gray-600">초기화</button>
              )}
            </div>
          </div>
        </div>

        {!initial && (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">URL 코드 (선택)</label>
            <input value={form.custom_code} onChange={(e) => setForm({ ...form, custom_code: e.target.value })}
              placeholder="비워두면 자동 생성"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" />
          </div>
        )}

        {/* Theme color */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">테마 색상 (헤더·버튼 테두리)</label>
          <div className="flex items-center gap-2 flex-wrap">
            {THEME_PRESETS.map((c) => (
              <button key={c} onClick={() => setForm({ ...form, theme_color: c })}
                className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                style={{ background: c, borderColor: form.theme_color === c ? '#1f2937' : 'transparent' }} />
            ))}
            <input type="color" value={form.theme_color}
              onChange={(e) => setForm({ ...form, theme_color: e.target.value })}
              className="w-7 h-7 rounded-full border border-gray-300 cursor-pointer" title="직접 선택" />
          </div>
        </div>

        {/* Background */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">배경</label>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">색상</span>
              <input type="color" value={form.config.bg_color || '#f9fafb'}
                onChange={(e) => setConfig({ bg_color: e.target.value })}
                className="w-8 h-7 rounded border border-gray-300 cursor-pointer" />
              {form.config.bg_color && (
                <button onClick={() => setConfig({ bg_color: '' })} className="text-xs text-gray-400 hover:text-gray-600">초기화</button>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">이미지</span>
              <button onClick={() => bgInputRef.current.click()}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-lg text-gray-600 transition-colors">
                업로드
              </button>
              {form.config.bg_image_url && (
                <button onClick={() => setConfig({ bg_image_url: '' })} className="text-xs text-red-400 hover:text-red-500">제거</button>
              )}
            </div>
          </div>
          <input ref={bgInputRef} type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />
        </div>

        {/* Multilingual */}
        <div>
          <button onClick={() => setLangOpen((v) => !v)}
            className="flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-gray-800">
            <span>{langOpen ? '▼' : '▶'}</span> 다국어 병기 (영·중·일·태)
          </button>
          {langOpen && (
            <div className="mt-2 space-y-2">
              {LANG_FIELDS.map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs text-gray-500 mb-0.5">{label}</label>
                  <input value={form.config.lang[key]} onChange={(e) => setLang(key, e.target.value)}
                    placeholder={`${label} 문구`}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-rose-400" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Link buttons */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-gray-600">링크 버튼</label>
            <button onClick={addItem} className="text-xs font-medium" style={{ color }}>+ 추가</button>
          </div>
          <div className="space-y-2">
            {form.items.map((item, i) => (
              <div key={i} className="flex gap-2 items-start bg-gray-50 rounded-xl p-2">
                <div className="flex flex-col gap-1">
                  <button onClick={() => moveItem(i, -1)} className="text-gray-300 hover:text-gray-500 text-xs leading-none">▲</button>
                  <button onClick={() => moveItem(i, 1)} className="text-gray-300 hover:text-gray-500 text-xs leading-none">▼</button>
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex gap-1.5">
                    <select value={item.icon} onChange={(e) => updateItem(i, 'icon', e.target.value)}
                      className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-rose-400 bg-white">
                      {['기본', 'SNS', '국기'].map((group) => (
                        <optgroup key={group} label={group}>
                          {ICON_OPTIONS.filter((o) => o.group === group).map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <input value={item.label} onChange={(e) => updateItem(i, 'label', e.target.value)}
                      placeholder="버튼 텍스트"
                      className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-rose-400" />
                  </div>
                  <input value={item.url} onChange={(e) => updateItem(i, 'url', e.target.value)}
                    placeholder="https://..."
                    className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-rose-400" />
                </div>
                <button onClick={() => removeItem(i)} className="text-gray-300 hover:text-red-400 text-xs pt-1">✕</button>
              </div>
            ))}
            {form.items.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-3">버튼을 추가해보세요</p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
          <button onClick={() => onSave(form)} disabled={saving}
            style={{ background: color, color: '#fff', fontSize: 14, fontWeight: 600,
              padding: '8px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
              opacity: saving ? 0.5 : 1 }}>
            {saving ? '저장 중...' : (initial ? '저장' : '만들기')}
          </button>
          <button onClick={onCancel}
            style={{ fontSize: 14, color: '#6b7280', background: 'none', border: 'none',
              cursor: 'pointer', padding: '8px 16px' }}>
            취소
          </button>
        </div>
      </div>

      {/* ── Live Preview ── */}
      <div className="flex flex-col items-center sticky top-4 self-start">
        <p className="text-xs text-gray-500 mb-3 font-medium">미리보기</p>
        <PagePreview form={form} />
      </div>
    </div>
  );
}

export function PagePreview({ form }) {
  const color = form.theme_color || '#f43f5e';
  const cfg = form.config || {};
  const logoSizePx = { sm: 28, md: 44, lg: 68 }[cfg.logo_size || 'md'];
  const lang = cfg.lang || {};
  const langLines = [lang.en, lang.zh_hans, lang.zh_hant, lang.ja, lang.th].filter(Boolean);
  const titleColor = cfg.title_color || color;
  const subtitleColor = cfg.subtitle_color || 'rgba(255,255,255,0.8)';

  const bgStyle = cfg.bg_image_url
    ? { backgroundImage: `url(${cfg.bg_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: cfg.bg_color || `${color}12` };

  const outerBg = cfg.bg_image_url
    ? { backgroundImage: `url(${cfg.bg_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: cfg.bg_color || color };

  return (
    <div style={{ ...outerBg, borderRadius: 16, padding: 12, width: 272 }}>
      <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
        {/* Logo */}
        <div style={{ background: '#fff', padding: '16px 16px 12px', textAlign: 'center' }}>
          {cfg.logo_url
            ? <img src={cfg.logo_url} alt="logo" style={{ height: logoSizePx, objectFit: 'contain', display: 'block', margin: '0 auto' }} />
            : <p style={{ margin: 0, fontWeight: 800, fontSize: 14, letterSpacing: '0.1em', color }}>{form.config?.logo_url ? '' : 'DAYBEAU'}</p>
          }
          {form.subtitle && <p style={{ margin: '4px 0 0', fontSize: 11, color }}>{form.subtitle}</p>}
        </div>
        {/* Title band */}
        {form.title && (
          <div style={{ background: color, padding: '8px 16px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#fff' }}>{form.title}</p>
          </div>
        )}
        {/* Buttons */}
        <div style={{ background: '#fff', padding: '12px 10px 8px' }}>
          {langLines.length > 0 && (
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              {langLines.map((l, i) => <p key={i} style={{ margin: 0, fontSize: 10, color: '#9ca3af' }}>{l}</p>)}
            </div>
          )}
          {form.items.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 10px', marginBottom: 6, borderRadius: 10,
              border: `1.5px solid ${color}`, background: '#fff',
            }}>
              <IconBadge icon={item.icon || 'link'} color={color} size="sm" useThemeColor />
              <span style={{ fontSize: 11, fontWeight: 500, color: '#374151', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label || '버튼'}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          ))}
          {form.items.length === 0 && (
            <p style={{ textAlign: 'center', fontSize: 11, color: '#d1d5db', padding: '8px 0' }}>링크 버튼이 표시됩니다</p>
          )}
        </div>
        {/* Rings */}
        <div style={{ height: 48, overflow: 'hidden', background: '#fff' }}>
          <ConcentricRings color={color} className="w-full" />
        </div>
      </div>
    </div>
  );
}

// country code → [bg color, text label]
const FLAG_META = {
  flag_kr: ['#C60C30', 'KR'],
  flag_cn: ['#DE2910', 'CN'],
  flag_tw: ['#FE0000', 'TW'],
  flag_jp: ['#BC002D', 'JP'],
  flag_en: ['#3C3B6E', 'US'],
  flag_gb: ['#012169', 'GB'],
  flag_th: ['#2D2A4A', 'TH'],
  flag_id: ['#CE1126', 'ID'],
  flag_ru: ['#003580', 'RU'],
  flag_vn: ['#DA251D', 'VN'],
  flag_sg: ['#EF3340', 'SG'],
  flag_mn: ['#C4272F', 'MN'],
};

const SNS_BG = {
  instagram: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400',
  facebook: 'bg-blue-600', youtube: 'bg-red-600', tiktok: 'bg-black',
  google: 'bg-white border border-gray-200', naver: 'bg-green-500',
  band: 'bg-green-600', link: 'bg-gray-500',
};

export function IconBadge({ icon, color, size = 'md', useThemeColor = false }) {
  if (!icon || icon === 'none') return null;

  const isFlag = !!FLAG_META[icon];
  const dim = size === 'sm'
    ? { w: 24, h: 24, fontSize: 9, radius: 8 }
    : { w: 36, h: 36, fontSize: 11, radius: 10 };

  if (isFlag) {
    const [countryBg, label] = FLAG_META[icon];
    const bg = useThemeColor ? color : countryBg;
    return (
      <span className="shrink-0 flex items-center justify-center font-bold tracking-wide text-white"
        style={{ background: bg, width: dim.w, height: dim.h, fontSize: dim.fontSize,
          borderRadius: dim.radius, letterSpacing: '0.05em', flexShrink: 0 }}>
        {label}
      </span>
    );
  }

  const dimCls = size === 'sm' ? 'w-6 h-6 rounded-lg' : 'w-9 h-9 rounded-xl';
  const snsBg = useThemeColor ? '' : (SNS_BG[icon] || 'bg-gray-400');
  const inlineStyle = useThemeColor ? { background: color } : {};
  return (
    <span className={`flex items-center justify-center ${dimCls} text-white shrink-0 ${snsBg}`} style={inlineStyle}>
      <SnsIcon name={icon} size={size} />
    </span>
  );
}

function SnsIcon({ name, size, isGoogle }) {
  const cls = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
  switch (name) {
    case 'instagram': return <svg viewBox="0 0 24 24" className={cls} fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>;
    case 'facebook': return <svg viewBox="0 0 24 24" className={cls} fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
    case 'youtube': return <svg viewBox="0 0 24 24" className={cls} fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
    case 'tiktok': return <svg viewBox="0 0 24 24" className={cls} fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>;
    case 'google': return <svg viewBox="0 0 24 24" className={cls} fill="#4285F4"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>;
    case 'naver': return <svg viewBox="0 0 24 24" className={cls} fill="currentColor"><path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/></svg>;
    case 'band': return <svg viewBox="0 0 24 24" className={cls} fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 13.037c-.05.224-.112.434-.195.632a4.255 4.255 0 01-.344.645 4.05 4.05 0 01-.476.573 3.857 3.857 0 01-.598.46 3.674 3.674 0 01-.698.316 3.61 3.61 0 01-.775.148H7.41V8.189h7.066c.27.02.53.07.775.148.245.077.476.183.698.316.21.134.41.29.598.46.175.183.34.373.476.573.147.2.258.42.344.645.083.198.145.408.195.632.037.224.056.448.056.672s-.019.448-.056.672zm-5.618-.336h2.394c.14-.007.268-.035.39-.084a.997.997 0 00.32-.21.978.978 0 00.21-.315 1.01 1.01 0 00.077-.392c0-.14-.026-.268-.077-.392a.973.973 0 00-.21-.315.997.997 0 00-.32-.21 1.065 1.065 0 00-.39-.084H11.944v2.002zm0-3.024h2.198c.127-.007.247-.035.357-.084a.9.9 0 00.29-.21.845.845 0 00.187-.308.87.87 0 00.063-.35.87.87 0 00-.063-.35.845.845 0 00-.187-.308.9.9 0 00-.29-.21 1.005 1.005 0 00-.357-.084H11.944v1.904z"/></svg>;
    default: return <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
  }
}
