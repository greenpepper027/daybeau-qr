'use client';
import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

export default function QrModal({ link, onClose }) {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const shortUrl = `${window.location.origin}/r/${link.code}`;

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, shortUrl, {
        width: 240,
        margin: 2,
        color: { dark: '#1f2937', light: '#ffffff' },
      });
    }
  }, [shortUrl]);

  function downloadQr() {
    const canvas = canvasRef.current;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-${link.code}.png`;
    a.click();
  }

  function copyUrl() {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">QR 코드</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4 font-medium">
          {link.title || link.code}
        </p>

        <div className="flex justify-center mb-4">
          <canvas ref={canvasRef} className="rounded-lg" />
        </div>

        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mb-4">
          <span className="text-xs text-gray-600 truncate flex-1">{shortUrl}</span>
          <button
            onClick={copyUrl}
            className="text-xs text-rose-500 hover:text-rose-600 font-medium shrink-0"
          >
            {copied ? '복사됨!' : '복사'}
          </button>
        </div>

        <button
          onClick={downloadQr}
          className="w-full bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium py-2 rounded-lg transition-colors"
        >
          PNG 다운로드
        </button>
      </div>
    </div>
  );
}
