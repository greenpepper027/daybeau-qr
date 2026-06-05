'use client';
import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

const LANG_FIELDS = [
  { key: 'en', label: 'English' },
  { key: 'zh_hans', label: '中文(简体)' },
  { key: 'zh_hant', label: '中文(繁體)' },
  { key: 'ja', label: '日本語' },
  { key: 'th', label: 'ภาษาไทย' },
];

function ConcentricRingsSVG({ color }) {
  const groups = [60, 140, 220, 300, 380];
  const radii = [18, 30, 42, 54, 66, 78, 90, 102, 114];
  return `<svg viewBox="0 0 440 140" xmlns="http://www.w3.org/2000/svg" style="overflow:visible;width:100%;">
    ${groups.map(cx =>
      radii.map(r =>
        `<circle cx="${cx}" cy="140" r="${r}" fill="none" stroke="${color}" stroke-width="1.2" opacity="0.25"/>`
      ).join('')
    ).join('')}
  </svg>`;
}

export default function PrintGuide({ target, onClose }) {
  const { type, data } = target;
  const canvasRef = useRef(null);
  const logoInputRef = useRef(null);

  const shortUrl = type === 'page'
    ? `${window.location.origin}/p/${data.code}`
    : `${window.location.origin}/r/${data.code}`;

  const pageLang = data.config?.lang || {};

  const [config, setConfig] = useState({
    headerText: 'DAYBEAU',
    subText: data.subtitle || '',
    bodyTitle: data.title || '',
    themeColor: data.theme_color || '#f43f5e',
    logoDataUrl: data.config?.logo_url || '',
    showRings: true,
    lang: {
      en: pageLang.en || '',
      zh_hans: pageLang.zh_hans || '',
      zh_hant: pageLang.zh_hant || '',
      ja: pageLang.ja || '',
      th: pageLang.th || '',
    },
  });
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, shortUrl, {
        width: 180, margin: 2,
        color: { dark: '#1f2937', light: '#ffffff' },
      });
    }
  }, [shortUrl]);

  function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setConfig((c) => ({ ...c, logoDataUrl: ev.target.result }));
    reader.readAsDataURL(file);
  }

  function handlePrint() {
    const c = config;
    const qrDataUrl = canvasRef.current.toDataURL('image/png');
    const langLines = LANG_FIELDS.map((f) => c.lang[f.key]).filter(Boolean);

    const win = window.open('', '_blank', 'width=520,height=820');
    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Daybeau QR 안내문</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Apple SD Gothic Neo','Noto Sans KR',sans-serif; background:#f9fafb; display:flex; justify-content:center; padding:30px 20px; }
    .card { width:360px; border:2.5px solid ${c.themeColor}; border-radius:24px; overflow:hidden; background:white; position:relative; }
    .header { background:${c.themeColor}; padding:18px 20px 16px; text-align:center; }
    .header img { height:48px; object-fit:contain; margin-bottom:4px; }
    .header h1 { color:white; font-size:20px; font-weight:800; letter-spacing:0.1em; }
    .header p { color:rgba(255,255,255,0.82); font-size:11px; margin-top:3px; }
    .body { padding:22px 20px 16px; text-align:center; }
    .body-title { font-size:17px; font-weight:700; color:${c.themeColor}; margin-bottom:14px; }
    .qr-wrap { display:inline-block; border:1.5px solid ${c.themeColor}55; border-radius:14px; padding:8px; background:white; margin-bottom:14px; }
    .lang-lines { font-size:11.5px; color:#4b5563; line-height:1.85; margin-bottom:12px; }
    .url { font-size:10px; color:#9ca3af; word-break:break-all; }
    .rings { overflow:hidden; height:80px; }
    @media print { body { padding:0; background:white; } }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      ${c.logoDataUrl
        ? `<img src="${c.logoDataUrl}" alt="logo"/>`
        : `<h1>${c.headerText}</h1>`}
      ${c.subText ? `<p>${c.subText}</p>` : ''}
    </div>
    <div class="body">
      ${c.bodyTitle ? `<p class="body-title">${c.bodyTitle}</p>` : ''}
      <div class="qr-wrap"><img src="${qrDataUrl}" width="180" height="180"/></div>
      ${langLines.length > 0 ? `<div class="lang-lines">${langLines.map(l => `<div>${l}</div>`).join('')}</div>` : ''}
      <p class="url">${shortUrl}</p>
    </div>
    ${c.showRings ? `<div class="rings">${ConcentricRingsSVG({ color: c.themeColor })}</div>` : ''}
  </div>
</body>
</html>`);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  }

  const previewLangLines = LANG_FIELDS.map((f) => config.lang[f.key]).filter(Boolean);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl my-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-800">안내문 출력</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ── Controls ── */}
          <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-1">

            {/* Logo */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">로고 이미지</label>
              <div className="flex items-center gap-2">
                <button onClick={() => logoInputRef.current.click()}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-gray-600 transition-colors">
                  파일 업로드
                </button>
                {config.logoDataUrl && (
                  <>
                    <img src={config.logoDataUrl} alt="logo preview" className="h-8 object-contain rounded border border-gray-200" />
                    <button onClick={() => setConfig((c) => ({ ...c, logoDataUrl: '' }))}
                      className="text-xs text-red-400 hover:text-red-500">제거</button>
                  </>
                )}
                <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </div>
              {config.logoDataUrl && (
                <p className="text-xs text-gray-400 mt-1">로고가 헤더 텍스트를 대체합니다</p>
              )}
            </div>

            {!config.logoDataUrl && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">헤더 텍스트</label>
                  <input value={config.headerText} onChange={(e) => setConfig({ ...config, headerText: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">부제목</label>
                  <input value={config.subText} onChange={(e) => setConfig({ ...config, subText: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">카드 제목</label>
              <input value={config.bodyTitle} onChange={(e) => setConfig({ ...config, bodyTitle: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>

            {/* Multilingual */}
            <div>
              <button onClick={() => setLangOpen((v) => !v)}
                className="flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-gray-800">
                <span>{langOpen ? '▼' : '▶'}</span> 다국어 병기
              </button>
              {langOpen && (
                <div className="mt-2 space-y-2">
                  {LANG_FIELDS.map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-xs text-gray-500 mb-0.5">{label}</label>
                      <input value={config.lang[key]}
                        onChange={(e) => setConfig({ ...config, lang: { ...config.lang, [key]: e.target.value } })}
                        placeholder={`${label} 문구 (비워두면 미출력)`}
                        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-rose-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">테마 색상</label>
                <input type="color" value={config.themeColor}
                  onChange={(e) => setConfig({ ...config, themeColor: e.target.value })}
                  className="w-10 h-8 rounded border border-gray-300 cursor-pointer" />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <input type="checkbox" id="rings" checked={config.showRings}
                  onChange={(e) => setConfig({ ...config, showRings: e.target.checked })}
                  className="rounded" />
                <label htmlFor="rings" className="text-xs text-gray-600">하단 동심원 장식</label>
              </div>
            </div>
          </div>

          {/* ── Preview ── */}
          <div className="flex flex-col items-center">
            <p className="text-xs text-gray-500 mb-3 font-medium">미리보기</p>
            <div className="w-64 border-2 rounded-3xl overflow-hidden" style={{ borderColor: config.themeColor }}>
              {/* Header */}
              <div className="px-4 py-3 text-center" style={{ background: config.themeColor }}>
                {config.logoDataUrl
                  ? <img src={config.logoDataUrl} alt="logo" className="h-10 object-contain mx-auto" />
                  : <p className="text-white font-bold text-sm tracking-widest">{config.headerText || 'DAYBEAU'}</p>
                }
                {config.subText && <p className="text-white/80 text-xs">{config.subText}</p>}
              </div>
              {/* Body */}
              <div className="bg-white px-4 py-4 text-center">
                {config.bodyTitle && <p className="text-sm font-bold mb-2" style={{ color: config.themeColor }}>{config.bodyTitle}</p>}
                <div className="flex justify-center mb-3">
                  <div className="border rounded-xl p-1.5" style={{ borderColor: `${config.themeColor}55` }}>
                    <canvas ref={canvasRef} className="rounded-lg" />
                  </div>
                </div>
                {previewLangLines.length > 0 && (
                  <div className="space-y-0.5 mb-2">
                    {previewLangLines.map((l, i) => (
                      <p key={i} className="text-xs text-gray-500">{l}</p>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-300 break-all">{shortUrl}</p>
              </div>
              {/* Rings */}
              {config.showRings && (
                <div className="overflow-hidden" style={{ height: '56px', background: 'white' }}>
                  <svg viewBox="0 0 440 140" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible', width: '100%' }}>
                    {[60, 140, 220, 300, 380].map((cx) =>
                      [18, 30, 42, 54, 66, 78, 90, 102, 114].map((r, ri) => (
                        <circle key={`${cx}-${ri}`} cx={cx} cy={140} r={r} fill="none"
                          stroke={config.themeColor} strokeWidth="1.2" opacity={0.22 + ri * 0.03} />
                      ))
                    )}
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button onClick={handlePrint}
            className="flex-1 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium py-2 rounded-lg transition-colors">
            인쇄 / PDF 저장
          </button>
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2">닫기</button>
        </div>
      </div>
    </div>
  );
}
