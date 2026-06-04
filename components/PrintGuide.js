'use client';
import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

export default function PrintGuide({ link, onClose }) {
  const canvasRef = useRef(null);
  const printRef = useRef(null);
  const [message, setMessage] = useState('아래 QR 코드를 스캔하시면\n더 자세한 정보를 확인하실 수 있습니다.');

  const shortUrl = `${window.location.origin}/r/${link.code}`;

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, shortUrl, {
        width: 200,
        margin: 2,
        color: { dark: '#1f2937', light: '#ffffff' },
      });
    }
  }, [shortUrl]);

  function handlePrint() {
    const printContent = printRef.current.innerHTML;
    const win = window.open('', '_blank', 'width=600,height=700');
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Daybeau QR 안내문</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif; display: flex; justify-content: center; align-items: flex-start; padding: 20px; }
            .guide { width: 400px; border: 2px solid #f43f5e; border-radius: 16px; overflow: hidden; text-align: center; }
            .guide-header { background: #f43f5e; padding: 20px; color: white; }
            .guide-header h1 { font-size: 22px; font-weight: 700; letter-spacing: 0.05em; }
            .guide-header p { font-size: 12px; margin-top: 4px; opacity: 0.85; }
            .guide-body { padding: 24px; background: white; }
            .qr-wrap { display: flex; justify-content: center; margin-bottom: 16px; }
            .qr-wrap canvas { border-radius: 8px; border: 1px solid #e5e7eb; padding: 6px; }
            .guide-msg { font-size: 13px; color: #4b5563; line-height: 1.7; white-space: pre-line; margin-bottom: 16px; }
            .guide-url { font-size: 11px; color: #9ca3af; word-break: break-all; }
            .guide-footer { background: #fff1f2; padding: 12px; border-top: 1px solid #fecdd3; }
            .guide-footer p { font-size: 11px; color: #e11d48; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 400);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xl my-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-800">안내문 출력</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Message editor */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-600 mb-1">안내 문구 편집</label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
          />
        </div>

        {/* Preview */}
        <div ref={printRef}>
          <div className="guide" style={{ width: '100%', border: '2px solid #f43f5e', borderRadius: '16px', overflow: 'hidden', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <div className="guide-header" style={{ background: '#f43f5e', padding: '20px', color: 'white' }}>
              <h1 style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '0.05em' }}>DAYBEAU</h1>
              <p style={{ fontSize: '12px', marginTop: '4px', opacity: 0.85 }}>{link.title || shortUrl}</p>
            </div>
            <div className="guide-body" style={{ padding: '24px', background: 'white' }}>
              <div className="qr-wrap" style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <canvas ref={canvasRef} style={{ borderRadius: '8px', border: '1px solid #e5e7eb', padding: '6px' }} />
              </div>
              <p className="guide-msg" style={{ fontSize: '13px', color: '#4b5563', lineHeight: 1.7, whiteSpace: 'pre-line', marginBottom: '16px' }}>{message}</p>
              <p className="guide-url" style={{ fontSize: '11px', color: '#9ca3af', wordBreak: 'break-all' }}>{shortUrl}</p>
            </div>
            <div className="guide-footer" style={{ background: '#fff1f2', padding: '12px', borderTop: '1px solid #fecdd3' }}>
              <p style={{ fontSize: '11px', color: '#e11d48' }}>QR 코드를 스캔하거나 위 주소를 입력해 주세요</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={handlePrint}
            className="flex-1 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium py-2 rounded-lg transition-colors"
          >
            인쇄 / PDF 저장
          </button>
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
