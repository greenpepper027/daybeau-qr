'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LinkForm from '@/components/LinkForm';
import LinkTable from '@/components/LinkTable';
import QrModal from '@/components/QrModal';
import PrintGuide from '@/components/PrintGuide';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrTarget, setQrTarget] = useState(null); // link object for QR modal
  const [printTarget, setPrintTarget] = useState(null); // link object for print
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') fetchLinks();
  }, [status]);

  async function fetchLinks() {
    setLoading(true);
    const res = await fetch('/api/links');
    const data = await res.json();
    setLinks(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function handleDelete(code) {
    if (!confirm('정말 삭제할까요?')) return;
    await fetch(`/api/links/${code}`, { method: 'DELETE' });
    fetchLinks();
  }

  if (status === 'loading' || status === 'unauthenticated') return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daybeau QR</h1>
          <p className="text-sm text-gray-500 mt-0.5">링크 & QR 코드 관리</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowForm((v) => !v)}
            className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + 새 링크
          </button>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            로그아웃
          </button>
        </div>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="mb-6">
          <LinkForm
            onCreated={() => { setShowForm(false); fetchLinks(); }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Table */}
      {loading ? (
        <p className="text-sm text-gray-400 text-center py-16">불러오는 중...</p>
      ) : (
        <LinkTable
          links={links}
          onDelete={handleDelete}
          onQr={(link) => setQrTarget(link)}
          onPrint={(link) => setPrintTarget(link)}
          onRefresh={fetchLinks}
        />
      )}

      {/* QR Modal */}
      {qrTarget && (
        <QrModal link={qrTarget} onClose={() => setQrTarget(null)} />
      )}

      {/* Print guide overlay */}
      {printTarget && (
        <PrintGuide link={printTarget} onClose={() => setPrintTarget(null)} />
      )}
    </div>
  );
}
