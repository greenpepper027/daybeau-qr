'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LinkForm from '@/components/LinkForm';
import LinkTable from '@/components/LinkTable';
import QrModal from '@/components/QrModal';
import PrintGuide from '@/components/PrintGuide';
import PageEditor from '@/components/PageEditor';
import PagesTable from '@/components/PagesTable';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState('links'); // 'links' | 'pages'

  // Links state
  const [links, setLinks] = useState([]);
  const [linksLoading, setLinksLoading] = useState(true);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [qrTarget, setQrTarget] = useState(null);
  const [printTarget, setPrintTarget] = useState(null);

  // Pages state
  const [pages, setPages] = useState([]);
  const [pagesLoading, setPagesLoading] = useState(true);
  const [showPageEditor, setShowPageEditor] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [pageSaving, setPageSaving] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchLinks();
      fetchPages();
    }
  }, [status]);

  async function fetchLinks() {
    setLinksLoading(true);
    const res = await fetch('/api/links');
    const data = await res.json();
    setLinks(Array.isArray(data) ? data : []);
    setLinksLoading(false);
  }

  async function fetchPages() {
    setPagesLoading(true);
    const res = await fetch('/api/pages');
    const data = await res.json();
    setPages(Array.isArray(data) ? data : []);
    setPagesLoading(false);
  }

  async function handleDeleteLink(code) {
    if (!confirm('정말 삭제할까요?')) return;
    await fetch(`/api/links/${code}`, { method: 'DELETE' });
    fetchLinks();
  }

  async function handleSavePage(form) {
    setPageSaving(true);
    if (editingPage) {
      await fetch(`/api/pages/${editingPage.code}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setPageSaving(false);
    setShowPageEditor(false);
    setEditingPage(null);
    fetchPages();
  }

  async function handleDeletePage(code) {
    if (!confirm('정말 삭제할까요?')) return;
    await fetch(`/api/pages/${code}`, { method: 'DELETE' });
    fetchPages();
  }

  if (status === 'loading' || status === 'unauthenticated') return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daybeau QR</h1>
          <p className="text-sm text-gray-500 mt-0.5">링크 & QR 코드 관리</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          로그아웃
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { key: 'links', label: '단축 링크' },
          { key: 'pages', label: '링크 페이지' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Links Tab ── */}
      {tab === 'links' && (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowLinkForm((v) => !v)}
              className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              + 새 링크
            </button>
          </div>
          {showLinkForm && (
            <div className="mb-6">
              <LinkForm
                onCreated={() => { setShowLinkForm(false); fetchLinks(); }}
                onCancel={() => setShowLinkForm(false)}
              />
            </div>
          )}
          {linksLoading ? (
            <p className="text-sm text-gray-400 text-center py-16">불러오는 중...</p>
          ) : (
            <LinkTable
              links={links}
              onDelete={handleDeleteLink}
              onQr={(link) => setQrTarget(link)}
              onPrint={(link) => setPrintTarget({ type: 'link', data: link })}
              onRefresh={fetchLinks}
            />
          )}
        </>
      )}

      {/* ── Pages Tab ── */}
      {tab === 'pages' && (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => { setEditingPage(null); setShowPageEditor(true); }}
              className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              + 새 페이지
            </button>
          </div>

          {showPageEditor && (
            <div className="mb-6">
              <PageEditor
                initial={editingPage}
                onSave={handleSavePage}
                onCancel={() => { setShowPageEditor(false); setEditingPage(null); }}
                saving={pageSaving}
              />
            </div>
          )}

          {!showPageEditor && (
            pagesLoading ? (
              <p className="text-sm text-gray-400 text-center py-16">불러오는 중...</p>
            ) : (
              <PagesTable
                pages={pages}
                onEdit={(page) => { setEditingPage(page); setShowPageEditor(true); }}
                onDelete={handleDeletePage}
                onQr={(page) => setQrTarget({ code: page.code, title: page.title, isPage: true })}
                onPrint={(page) => setPrintTarget({ type: 'page', data: page })}
              />
            )
          )}
        </>
      )}

      {/* QR Modal */}
      {qrTarget && <QrModal link={qrTarget} onClose={() => setQrTarget(null)} />}

      {/* Print guide */}
      {printTarget && (
        <PrintGuide target={printTarget} onClose={() => setPrintTarget(null)} />
      )}
    </div>
  );
}
