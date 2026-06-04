'use client';
import { useState } from 'react';

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : '';

export default function LinkTable({ links, onDelete, onQr, onPrint, onRefresh }) {
  const [editCode, setEditCode] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  function startEdit(link) {
    setEditCode(link.code);
    setEditForm({ title: link.title, original_url: link.original_url });
  }

  async function saveEdit(code) {
    setSaving(true);
    await fetch(`/api/links/${code}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    setSaving(false);
    setEditCode(null);
    onRefresh();
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 text-sm">
        링크가 없습니다. 새 링크를 만들어보세요.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
            <th className="text-left px-4 py-3 font-medium">제목</th>
            <th className="text-left px-4 py-3 font-medium">단축 링크</th>
            <th className="text-left px-4 py-3 font-medium hidden md:table-cell">원본 URL</th>
            <th className="text-center px-4 py-3 font-medium">클릭</th>
            <th className="text-right px-4 py-3 font-medium">액션</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {links.map((link) => (
            <tr key={link.code} className="hover:bg-gray-50 transition-colors">
              {editCode === link.code ? (
                <>
                  <td className="px-4 py-3">
                    <input
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                    />
                  </td>
                  <td className="px-4 py-3 text-rose-600 font-mono text-xs">
                    /r/{link.code}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <input
                      value={editForm.original_url}
                      onChange={(e) => setEditForm({ ...editForm, original_url: e.target.value })}
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                    />
                  </td>
                  <td className="px-4 py-3 text-center text-gray-500">{link.clicks}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => saveEdit(link.code)}
                        disabled={saving}
                        className="text-xs bg-rose-500 text-white px-3 py-1 rounded-lg hover:bg-rose-600 disabled:opacity-50"
                      >
                        저장
                      </button>
                      <button
                        onClick={() => setEditCode(null)}
                        className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
                      >
                        취소
                      </button>
                    </div>
                  </td>
                </>
              ) : (
                <>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {link.title || <span className="text-gray-400 italic">제목 없음</span>}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`/r/${link.code}`}
                      target="_blank"
                      className="text-rose-500 font-mono text-xs hover:underline"
                    >
                      /r/{link.code}
                    </a>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-500 truncate max-w-xs">
                    <a href={link.original_url} target="_blank" className="hover:underline">
                      {link.original_url}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600 font-medium">{link.clicks}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onQr(link)}
                        title="QR 보기"
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
                      >
                        <QrIcon />
                      </button>
                      <button
                        onClick={() => onPrint(link)}
                        title="안내문 출력"
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
                      >
                        <PrintIcon />
                      </button>
                      <button
                        onClick={() => startEdit(link)}
                        title="수정"
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => onDelete(link.code)}
                        title="삭제"
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function QrIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
    </svg>
  );
}

function PrintIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}
