import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPageByCode, updatePage, deletePage } from '@/lib/sheets';

export async function GET(req, { params }) {
  const { code } = await params;
  const page = await getPageByCode(code);
  if (!page) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(page);
}

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { code } = await params;
  const body = await req.json();
  const bgLen = body?.config?.bg_image_url?.length || 0;
  console.log('[PATCH page]', code, 'bg_image_url length:', bgLen);
  try {
    await updatePage(code, body);
    console.log('[PATCH page] success');
    return Response.json({ ok: true });
  } catch (e) {
    console.error('[PATCH page] error:', e?.message || e);
    return Response.json({ error: e?.message || 'unknown' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { code } = await params;
  await deletePage(code);
  return Response.json({ ok: true });
}
